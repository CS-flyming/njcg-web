<style lang="less">
</style>

<template>
    <div style="margin-top:20px;">
        <div class="data-control">
            <Button type="primary" @click="$router.push({ name: 'notice-add',query:{name:$route.name} })">新增公告</Button>
            <!-- <Button type="primary" @click="$downloadByForm('root/user/down',filter)">导出</Button> -->
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <Modal
            v-model="showVerifyModal"
            title="编辑"
            @on-cancel="handleCacelModal"
           >
           <Form :model="verifyForm" ref="verifyForm" label-position="right" :label-width="120" :rules="rules">
                <FormItem label="标题" prop="name">
                    <DatePicker v-model="verifyForm.name"  format="yyyy-MM-dd"  style="width: 100%;"></DatePicker>
                </FormItem>
                <FormItem label="内容" prop="info">
                    <DatePicker v-model="verifyForm.info"  format="yyyy-MM-dd"  style="width: 100%;"></DatePicker>
                </FormItem>
                 <FormItem label="创建时间" prop="createTime">
                    <DatePicker v-model="verifyForm.createTime"  format="yyyy-MM-dd"  style="width: 100%;"></DatePicker>
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
import { getNoticeList, deleteNotice, addOrUpdateNotice,detailNotice } from "@/actions/notice";
export default {
  name: "notice_list",
  data() {
    return {
      loading: false,
      showParamsModal: false,
      showVerifyModal: false,
      modalLoading: false,
      verifyForm: {
        id: "",
        name: "",
        info: "",
        createTime:""
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
          key: "name",
          title: "标题"
        },
        {
          key: "info",
          title: "内容"
        },
        {
          key: "createTime",
          title: "创建时间"
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
                      let { id, name, info,wjIds } = params.row;
                      this.verifyForm =  { id, name, info,wjIds };
                      console.log(this.verifyForm);
                      this.showVerifyModal = true;
                    }
                  }
                },
                "编辑"
              )
            
            ]);
          }
        }
      ],
      filter: {
        limit: 10,
        offset: 0
      },
      rules: {
        name: [
          {
             required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        info: [
          {
             required: true,
            message: "请输入内容",
            trigger: "blur"
          }
        ]
      },
      data: [],
      total: 0,
     
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getNoticeList(this.filter).then(res => {
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
