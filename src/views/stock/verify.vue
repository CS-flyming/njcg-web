<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="商品名称">
                   <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="filter.status" clearable>
                        <Option value="1">待审核</Option>
                        <Option value="2">通过</Option>
                        <Option value="3">拒绝</Option>
                    </Select>
                </FormItem>
                <FormItem label="起止时间">
                   <dateRgSelector style="width:100%;" v-model="filter._dateRange" :start-date.sync="filter.startTime" :end-date.sync="filter.endTime" clearable />
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <!-- <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button> -->
            <Button type="primary" @click="$downloadByForm('/export/stock/out/verify',filter)">导出</Button>
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <Modal
            v-model="showVerifyModal"
            title="审核"
            @on-cancel="handleCacelModal"
           >
           <Form :model="verifyForm" ref="verifyForm" label-position="right" :label-width="120" :rules="rules">
                <FormItem label="审核状态" prop="status">
                   <RadioGroup v-model="verifyForm.status">
                      <Radio label="2">通过</Radio>
                      <Radio label="3">拒绝</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="拒绝原因" v-if="verifyForm.status=='3'" prop="reason">
                    <Input v-model="verifyForm.reason" placeholder="拒绝原因"  />
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst" :loading="modalLoading">审核</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import pagination from "components/pagination";
import userSelector from "components/user-selector";
import dateRgSelector from "components/date-rg-selector";
import {
  getStockOutVerifyList,
  stockOutAction,
  stockWasteAction,
  stockVerifyAction
} from "@/actions/stock";
export default {
  name: "stock_verify",
  data() {
    return {
      loading: false,
      showVerifyModal: false,
      modalLoading: false,
      rules: {
        reason: [
          {
            required: true,
            message: "请输入拒绝原因",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择审核状态",
            trigger: "change"
          }
        ]
      },
      verifyForm: {
        id: "",
        status: "2",
        reason: ""
      },
      columns: [
        {
          key: "name",
          title: "名称"
        },
        {
          key: "standard",
          title: "规格"
        },
        {
          key: "model",
          title: "型号"
        },
        {
          key: "allCount",
          title: "总数"
        },
         {
          key: "unit",
          title: "单位"
        },
        {
          key: "createTime",
          title: "入库时间"
        },
        {
          key: "typeDesc",
          title: "入库类型"
        },
        {
          key: "statusDesc",
          title: "状态"
        },
        {
          key: "useCount",
          title: "在库数量"
        },
        {
          key: "lendCount",
          title: "已借出数量"
        },
        {
          type: "action",
          title: "操作",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  on: {
                    click: () => {
                      this.verifyForm.id = params.row.id;
                      this.showVerifyModal = true;
                    }
                  },
                  props: {
                    type: "primary"
                  }
                },
                "审核"
              )
            ]);
            // return h("div", [
            //   h(
            //     "Poptip",
            //     {
            //       props: {
            //         confirm: true,
            //         title: "您确定要删除?",
            //         transfer: true
            //       },
            //       on: {
            //         "on-ok": () => {
            //           this.verifyForm.id = params.row.id;
            //           this.showVerifyModal = true;
            //         }
            //       }
            //     },
            //     [
            //       h(
            //         "Button",
            //         {
            //           style: {
            //             margin: "0 5px"
            //           },
            //           props: {
            //             type: "error",
            //             placement: "top"
            //           }
            //         },
            //         "删除"
            //       )
            //     ]
            //   )
            // ]);
          }
        }
      ],
      filter: {
        limit: 10,
        offset: 0,
        name: "",
        _dateRange: ["", ""],
        startTime: "",
        endTime: "",
        status: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getStockOutVerifyList(this.filter).then(res => {
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
        status: "2",
        reason: ""
      };
    },
    handleCacelModal() {
      this.showVerifyModal = false;
      this.resetVerifyForm();
    },
    handleVerifyFirst() {
      this.$refs["verifyForm"].validate(valid => {
        if (valid) {
          this.modalLoading = true;
          stockVerifyAction(this.verifyForm).then(
            res => {
              this.$lf.message("审核成功", "success");
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
    pagination,
    userSelector,
    dateRgSelector
  }
};
</script>
