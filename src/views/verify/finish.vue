<style lang="less">
#printMe {
  width: 595px;
  margin: 0 auto;
  color: #333;
  font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;
}
.print-content {
  width: 100%;
  position: relative;
  border: 1px solid #888;
}
.print-header {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  padding: 5px 0;
}
.print-base-info,
.print-order-info,
.print-order-content {
  font-size: 12px;
  border-top: 1px solid #888;
}
.print-flex {
  display: flex;
}
.print-flex-item {
  flex: 1;
  min-height: 20px;
  padding: 2px;
}
.print-border-left {
  border-left: 1px solid #888;
}
.print-float-right {
  float: right;
}
.mg-rt-8 {
  margin-right: 8px;
}
.flex-1 {
  flex: 0 0 10%;
  word-break: break-all;
}
.flex-3 {
  flex: 0 0 30%;
  word-break: break-all;
}
.flex-7 {
  flex: 0 0 70%;
  word-break: break-all;
}
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="100">
                  <FormItem label="部门">
                   <departCalSelector v-model="filter._departId" :departId.sync="filter.departId" clearable />
                </FormItem>
                 <FormItem label="需求计划">
                    <DatePicker v-model="filter.name" type="month" format="yyyy-MM" placeholder="选择年月" style="width:100%;"></DatePicker>
                </FormItem>
                 <FormItem label="起止时间">
                   <dateRgSelector style="width:100%;" v-model="filter._dateRange" :start-date.sync="filter.startTime" :end-date.sync="filter.endTime" clearable />
                </FormItem>
                  <FormItem label="状态">
                    <Select v-model="filter.status" clearable>
                        <Option value="3">拒绝</Option>
                        <Option value="5">审核通过</Option>
                        <Option value="6">已入库</Option>
                        <Option value="7">待收货</Option>
                    </Select>
                </FormItem>
              
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <!-- <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button> -->
            <Button type="primary" @click="$downloadByForm('/export/verify/finish',filter)">导出</Button>
             <Button type="primary" @click="$downloadByForm('/export/typeproduct',filter)">分类导出</Button>
        </div>
       
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
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
        <Modal
            v-model="printModal"
            title="打印预览"
            @on-ok="print"
            width="640"
          >
          <div id="printMe">
            <div class="print-content">
                <div class="print-header">{{printType=='out'?'出库单':'入库单'}}</div>
                <div class="print-base-info print-flex">
                  <div class="print-flex-item">{{printType=='out'?'出库单位':'入库单位'}}：{{printData.departName}}</div>
                  <div class="print-flex-item print-border-left">{{printData.date}}<span class="print-float-right mg-rt-8">订单号：{{printData.orderNo}}</span></div>
                </div>
                <div class="print-order-info print-flex">
                  <div class="print-flex-item flex-1">序号</div>
                  <div class="print-flex-item  flex-3 print-border-left">名称</div>
                  <div class="print-flex-item flex-1 print-border-left">型号</div>
                  <div class="print-flex-item flex-1 print-border-left">单位</div>
                  <div class="print-flex-item flex-1 print-border-left">单价</div>
                  <div class="print-flex-item flex-1 print-border-left">数量</div>
                  <div class="print-flex-item flex-1 print-border-left">总价</div>
                  <div class="print-flex-item flex-1 print-border-left">备注</div>
                </div>
                <div class="print-order-content print-flex" v-for="item in printData.list" :key="item.xh">
                  <div class="print-flex-item flex-1">{{item.xh}}</div>
                  <div class="print-flex-item  flex-3 print-border-left">{{item.name}}</div>
                  <div class="print-flex-item flex-1 print-border-left">{{item.model}}</div>
                  <div class="print-flex-item flex-1 print-border-left">{{item.departName}}</div>
                  <div class="print-flex-item flex-1 print-border-left">{{item.value}}</div>
                  <div class="print-flex-item flex-1 print-border-left">{{item.num}}</div>
                  <div class="print-flex-item flex-1 print-border-left">{{item.zj}}</div>
                  <div class="print-flex-item flex-1 print-border-left">{{item.bz}}</div>
                </div>
                <div class="print-order-content print-flex">
                  <div class="print-flex-item flex-7">合计：</div>
                  <div class="print-flex-item flex-1 print-border-left">{{printData.num}}</div>
                  <div class="print-flex-item flex-1 print-border-left">{{printData.zj}}</div>
                  <div class="print-flex-item flex-1 print-border-left"></div>
                </div>
                <div class="print-order-content print-flex">
                  <div class="print-flex-item">核准数合计（大写）：</div>
                  <div class="print-flex-item">{{printData.dxzj}}</div>
                </div>
                <div class="print-order-content print-flex">
                  <div class="print-flex-item">股（连）长：</div>
                  <div class="print-flex-item print-border-left">仓库负责人：</div>
                  <div class="print-flex-item print-border-left">经办人：</div>
                </div>
            </div>
          </div>
        </Modal>
    </div>
</template>

<script>
let nzhcn = require("nzh/cn");
import pagination from "components/pagination";
import dateRgSelector from "components/date-rg-selector";
import departCalSelector from "components/depart-cal-selector";
import {
  getVerifyFinishList,
  verifyFirstItem,
  verifyOutAction,
  getPrintOrderData
} from "@/actions/verify";
export default {
  name: "verify_finish",
  data() {
    return {
      loading: false,
      showVerifyModal: false,
      modalLoading: false,
      printModal: false,
      printType: "out",
      printData: {
        list: [
          {
            xh: "序号",
            name: "名称",
            model: "型号",
            departName: " 单位",
            value: "219 单价",
            num: "数量",
            zj: "小计",
            bz: " 备注"
          }
        ],
        date: "",
        num: "数量合计",
        zj: "总价合计",
        orderNo: "订单号",
        departName: "出库单位"
      },
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
          align: "center",
          key: "applyDepartName",
            align:"center",
          title: "申请部门"
        },
        {
          align: "center",
          key: "createName",
            align:"center",
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
          key: "createTime",
            align:"center",
          title: "添加时间"
        },
        {
          key: "monthName",
            align:"center",
          title: "需求计划"
        },
        {
          key: "statusDesc",
            align:"center",
          title: "状态"
        },
        {
          type: "action",
          title: "操作",
          width: 350,
           align: "left",
          render: (h, params) => {
            let delBtn =
              params.row.status == 5
                ? h(
                    "Poptip",
                    {
                      props: {
                        confirm: true,
                        title: "您确定要出库吗?",
                        transfer: true
                      },
                      on: {
                        "on-ok": () => {
                          verifyOutAction(params.row.id).then(res => {
                            this.$Message.success("出库成功");
                            this.loadData();
                          });
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
                            type: "warning",
                            placement: "top"
                          }
                        },
                        "出库"
                      )
                    ]
                  )
                : "";
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
                "详情"
              ),
              delBtn,
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      // this.showDetailModal(params.row.id);
                      this.printType = "out";
                      getPrintOrderData(params.row.id).then(res => {
                        let { list } = res.data;
                        if (list.length <= 8) {
                          let dis = 8 - list.length;
                          for (let i = 0; i < dis; i++) {
                            list.push([]);
                          }
                        }
                        res.data.dxzj = nzhcn
                          .toMoney(res.data.zj)
                          .replace("人民币", "");
                        this.printData = res.data;
                        this.printModal = true;
                      });
                    }
                  }
                },
                "出库单"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      // this.showDetailModal(params.row.id);
                      this.printType = "in";
                      getPrintOrderData(params.row.id).then(res => {
                        let { list } = res.data;
                        if (list.length <= 8) {
                          let dis = 8 - list.length;
                          for (let i = 0; i < dis; i++) {
                            list.push([]);
                          }
                        }
                        res.data.dxzj = nzhcn
                          .toMoney(res.data.zj)
                          .replace("人民币", "");
                        this.printData = res.data;
                        this.printModal = true;
                      });
                    }
                  }
                },
                "入库单"
              )
            ]);
          }
        }
        // {
        //   type: "action",
        //   title: "操作",
        //   width: 200,
        //   render: (h, params) => {
        //     return h(
        //       "Button",
        //       {
        //         on: {
        //           click: () => {
        //             this.verifyForm.id = params.row.id;
        //             this.showVerifyModal = true;
        //           }
        //         },
        //         props: {
        //           type: "primary"
        //         }
        //       },
        //       "初审"
        //     );
        //     // return h("div", [
        //     //   h(
        //     //     "Poptip",
        //     //     {
        //     //       props: {
        //     //         confirm: true,
        //     //         title: "您确定要删除?",
        //     //         transfer: true
        //     //       },
        //     //       on: {
        //     //         "on-ok": () => {
        //     //           this.verifyForm.id = params.row.id;
        //     //           this.showVerifyModal = true;
        //     //         }
        //     //       }
        //     //     },
        //     //     [
        //     //       h(
        //     //         "Button",
        //     //         {
        //     //           style: {
        //     //             margin: "0 5px"
        //     //           },
        //     //           props: {
        //     //             type: "error",
        //     //             placement: "top"
        //     //           }
        //     //         },
        //     //         "删除"
        //     //       )
        //     //     ]
        //     //   )
        //     // ]);
        //   }
        // }
      ],
      filter: {
        limit: 10,
        offset: 0,
        level: "",
        type: "",
        name: "",
        status: "",
        _departId: [],
        departId: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    print() {
      this.$htmlToPaper("printMe");
    },
    loadData() {
      this.loading = true;
      getVerifyFinishList(this.filter).then(res => {
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
    pagination,
    departCalSelector,
    dateRgSelector
  }
};
</script>
