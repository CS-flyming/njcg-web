<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="起止时间">
                   <dateRgSelector style="width:100%;" v-model="filter._dateRange" :start-date.sync="filter.startTime" :end-date.sync="filter.endTime" clearable />
                </FormItem>
                 <FormItem label="申请部门">
                   <departCalSelector v-model="filter._departId" :departId.sync="filter.departId" clearable />
                </FormItem>
          
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <!-- <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button> -->
            <Button type="primary" @click="mutiVerify">多项复审</Button>
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data" @on-selection-change="handleMutiSelect"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <Modal
            v-model="showVerifyModal"
            title="复审"
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
                  <Button type="primary" @click="handleVerifyFirst" :loading="modalLoading">复审</Button>
            </div>
        </Modal>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Modal
              v-model="showDetailModalFlag"
              width="800"
              title="订单详情">
              <Table border ref="selection" :columns="columns2" :data="selectOrder" size="large" ></Table>
              <div slot="footer">
                  
              </div>
        </Modal>
    </div>
</template>

<script>
import pagination from "components/pagination";
import dateRgSelector from "components/date-rg-selector";
import departCalSelector from "components/depart-cal-selector";
import {
  getVerifySecondList,
  verifyFirstItem,
  getOrderDetail
} from "@/actions/verify";
export default {
  name: "verify_second",
  data() {
    return {
      loading: false,
      showVerifyModal: false,
      modalLoading: false,
      modalLoading: false,
      spinShow: false,
      columns2: [
        {
          title: "商品名称",
          render: (h, params) => {
            return h("div", params.row.product.name || "--");
          }
        },
        {
          title: "规格",
          render: (h, params) => {
            return h("div", params.row.product.standard || "--");
          }
        },
        {
          title: "型号",
          render: (h, params) => {
            return h("div", params.row.product.model || "--");
          }
        },
        {
          title: "价格",
          render: (h, params) => {
            return h("div", params.row.product.value || "--");
          }
        },
        {
          title: "总价",
          render: (h, params) => {
            return h("div", params.row.product.zj || "--");
          }
        },
        {
          title: "数量",
          key: "num",
          align: "center"
        },
        {
          title: "经费类型",
          key: "typeDesc",
          align: "center"
        }
      ],
      selectOrder: [],
      showDetailModalFlag: false,
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
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          align: "center",
          key: "applyDepartName",
          title: "申请部门"
        },
        {
          align: "center",
          key: "createName",
          title: "申请人"
        },
        {
          align: "center",
          key: "orderNo",
          title: "订单号"
        },
        {
          align: "center",
          title: "金额",
          render: (h, params) => {
            return h("div", "￥" + params.row.zj ? params.row.zj : "--");
          }
        },

        {
          align: "center",
          key: "createTime",
          title: "申请时间"
        },
        {
          type: "action",
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      // this.showDetailModal(params.row.id);
                      this.$router.push({
                        name: "base-order-detail",
                        params: {
                          id: params.row.id
                        }
                      });
                    }
                  }
                },
                "订单详情"
              ),
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
                "复审"
              )
            ]);
          }
          // return h(
          //   "Button",
          //   {
          //     on: {
          //       click: () => {
          //         this.verifyForm.id = params.row.id;
          //         this.showVerifyModal = true;
          //       }
          //     },
          //     props: {
          //       type: "primary"
          //     }
          //   },
          //   "初审"
          // );
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
      ],
      filter: {
        limit: 10,
        offset: 0,
        level: "",
        type: ""
      },
      data: [],
      total: 0,
      selection: []
    };
  },
  methods: {
    mutiVerify() {
      if (!this.selection.length) {
        this.$Message.error("请选择审核项");
        return;
      }
      let ids = this.selection.map(v => {
        return v.id;
      });
      this.verifyForm.id = ids.join(",");
      this.showVerifyModal = true;
      this.filter.offset = 0;
    },
    handleMutiSelect(selection) {
      this.selection = selection;
    },
    showDetailModal(id) {
      this.spinShow = true;
      getOrderDetail(id).then(
        res => {
          this.spinShow = false;
          this.selectOrder = res.data;
          this.showDetailModalFlag = true;
        },
        () => {
          this.spinShow = false;
        }
      );
    },
    loadData() {
      this.loading = true;
      getVerifySecondList(this.filter).then(res => {
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
          verifyFirstItem(this.verifyForm).then(
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
    dateRgSelector,
    departCalSelector,
    pagination
  }
};
</script>
