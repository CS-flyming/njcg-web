<style lang="less">
</style>

<template>
    <div style="margin-top:20px;">
        <div class="data-control">
            <Button type="primary" @click="$router.push({ name: 'plan-add',query:{name:$route.name} })">新增需求计划</Button>
            <!-- <Button type="primary" @click="$downloadByForm('root/user/down',filter)">导出</Button> -->
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <Modal
            v-model="showVerifyModal"
            title="编辑起止日期"
            @on-cancel="handleCacelModal"
           >
           <Form :model="verifyForm" ref="verifyForm" label-position="right" :label-width="120" :rules="rules">
                <FormItem label="开始时间" prop="startTime">
                    <DatePicker v-model="verifyForm.startTime"  format="yyyy-MM-dd"   type="date"  placeholder="选择开始时间" style="width: 100%;"></DatePicker>
                </FormItem>
                <FormItem label="结束时间" prop="endTime">
                    <DatePicker v-model="verifyForm.endTime"  format="yyyy-MM-dd"   type="date"  placeholder="选择结束时间" style="width: 100%;"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst" :loading="modalLoading">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import pagination from "components/pagination";
import { getPlanList, deletePlan, addOrUpdatePlan } from "@/actions/plan";
export default {
  name: "plan_list",
  data() {
    return {
      loading: false,
      showParamsModal: false,
      showVerifyModal: false,
      modalLoading: false,
      rules: {
        startTime: [
          {
            required: true,
            type: "date",
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            type: "date",
            message: "请选择开始时间",
            trigger: "change"
          }
        ]
      },
      verifyForm: {
        id: "",
        startTime: "",
        endTime: ""
      },
      paramscolumns: [
        {
          key: "key",
          title: "参数名称"
        },
        {
          key: "value",
          title: "参数数值"
        }
      ],
      columns: [
        {
          key: "realName",
          title: "计划名称"
        },
        {
          key: "startTime",
          title: "开始时间"
        },
        {
          key: "endTime",
          title: "结束时间"
        },
        {
          type: "action",
          title: "操作",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      deletePlan(params.row.id).then(
                        res => {
                          this.loading = false;
                          this.$lf.message("删除成功", "success");
                          this.loadData();
                        },
                        () => {
                          this.loading = false;
                        }
                      );
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      style: {
                        margin: "0 5px"
                      },
                      props: {
                        type: "error",
                        placement: "top"
                      }
                    },
                    "删除"
                  )
                ]
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      let { id, startTime, endTime } = params.row;

                      this.verifyForm = {
                        id,
                        startTime,
                        endTime
                      };
                      console.log(this.verifyForm);
                      this.showVerifyModal = true;
                    }
                  }
                },
                "编辑"
              )
              //   h(
              //     "Button",
              //     {
              //       props: {
              //         type: "primary"
              //       },
              //       on: {
              //         click: () => {
              //           this.$router.push({
              //             name: "product-add-detail",
              //             params: {
              //               id: params.row.id
              //             }
              //           });
              //         }
              //       }
              //     },
              //     "详情"
              //   )
            ]);
          }
        }
      ],
      filter: {
        limit: 10,
        offset: 0
      },
      data: [],
      total: 0,
      selectParamsArr: []
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getPlanList(this.filter).then(res => {
        this.loading = false;
        this.data = res.data.rows;
        this.total = res.data.total;
      });
    },
    handleFilter() {
      this.filter.offset = 0;
      this.loadData();
    },
    resetVerifyForm() {
      this.verifyForm = {
        id: "",
        startTime: "",
        endTime: ""
      };
    },
    handleCacelModal() {
      this.showVerifyModal = false;
      this.resetVerifyForm();
    },
    handleVerifyFirst() {
      this.$refs["verifyForm"].validate(valid => {
        if (valid) {
          console.log(this.verifyForm);
          this.modalLoading = true;
          addOrUpdatePlan(this.verifyForm).then(
            res => {
              this.modalLoading = false;
              this.handleCacelModal();
              this.loadData();
            },
            () => {
              this.modalLoading = false;
            }
          );
        }
      });
    }
  },
  components: {
    pagination
  },
  watch: {
    "verifyForm.startTime"(val, val2) {
      console.log(val, val2);
    }
  }
};
</script>
