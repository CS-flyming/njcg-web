<style lang="less">
#printMe2 {
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
}
.flex-3 {
  flex: 0 0 30%;
}
.flex-7 {
  flex: 0 0 70%;
}
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="商品名称">
                   <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem label="起止时间">
                   <dateRgSelector style="width:100%;" v-model="filter._dateRange" :start-date.sync="filter.startTime" :end-date.sync="filter.endTime" clearable />
                </FormItem>
                 <FormItem label="接收部门">
                   <departCalSelector v-model="filter._departId" :departId.sync="filter.departId" clearable />
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <!-- <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button> -->
            <Button type="primary" @click="$downloadByForm('/export/stock/out',filter)">导出</Button>
            <Button type="primary" @click="handleDaochu">出库单</Button>
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"  @on-selection-change="handleSelect"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <!-- <Modal
            v-model="showVerifyModal"
            title="出库"
            @on-cancel="handleCacelModal"
           >
           <Form :model="verifyForm" ref="verifyForm" label-position="right" :label-width="120" :rules="rules">
                <FormItem label="出库数量" prop="count">
                     <InputNumber :max="verifyForm.limit" :min="1" v-model="verifyForm.count" style="width:100%;"/>
                </FormItem>
                <FormItem label="出库用户" prop="userId">
                    <userSelector v-model="verifyForm.userId"/>    
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst" :loading="modalLoading">出库</Button>
            </div>
        </Modal>
        <Modal
            v-model="showVerifyModal2"
            title="报废物品"
            @on-cancel="handleCacelModal2"
           >
           <Form :model="verifyForm2" ref="verifyForm2" label-position="right" :label-width="120" :rules="rules2">
                <FormItem label="报废原因" prop="reason">
                    <Input v-model="verifyForm2.reason" placeholder="报废原因"  />
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst2" :loading="modalLoading2">报废</Button>
            </div>
        </Modal> -->
        <Modal
            v-model="printModal"
            title="打印预览"
            @on-ok="print"
            width="640"
          >
          <div id="printMe2">
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
// import userSelector from "components/user-selector";
import { getStockOutList, getPrintOrderOutData } from "@/actions/stock";
export default {
  name: "stock_out",
  data() {
    return {
      loading: false,
      showVerifyModal: false,
      modalLoading: false,
      showVerifyModal2: false,
      modalLoading2: false,
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
            zj: "总价",
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
        userId: [
          {
            required: true,
            message: "请选择出库用户",
            trigger: "change"
          }
        ],
        count: [
          {
            required: true,
            type: "number",
            message: "请输入出库数量",
            trigger: "blur"
          }
        ]
      },
      rules2: {
        reason: [
          {
            required: true,
            message: "请输入报废原因",
            trigger: "blur"
          }
        ]
      },
      verifyForm: {
        id: "",
        count: 1,
        userId: "",
        limit: 0
      },
      verifyForm2: {
        id: "",
        reason: ""
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
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
          key: "outCount",
          title: "出库数量"
        },
        {
          key: "statusDesc",
          title: "状态"
        },
        {
          key: "createUserName",
          title: "发起人"
        },
        {
          key: "lendUserName",
          title: "接收人"
        },
        {
          key: "reason",
          title: "拒绝原因"
        },
        {
          key: "value",
          title: "价格"
        }
        // {
        //   type: "action",
        //   title: "操作",
        //   width: 200,
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           on: {
        //             click: () => {
        //               this.verifyForm.id = params.row.id;
        //               this.verifyForm.limit =
        //                 params.row.useCount - params.row.lendCount;
        //               this.showVerifyModal = true;
        //             }
        //           },
        //           props: {
        //             type: "primary"
        //           }
        //         },
        //         "出库"
        //       ),
        //       h(
        //         "Button",
        //         {
        //           on: {
        //             click: () => {
        //               this.verifyForm2.id = params.row.id;
        //               this.showVerifyModal2 = true;
        //             }
        //           },
        //           style: {
        //             marginLeft: "8px"
        //           },
        //           props: {
        //             type: "error"
        //           }
        //         },
        //         "报废"
        //       )
        //     ]);
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
        name: "",
        _dateRange: ["", ""],
        startTime: "",
        endTime: "",
        _departId: [],
        departId: ""
      },
      daoFilter: {
        ids: []
      },
      data: [],
      total: 0
    };
  },
  methods: {
    print() {
      this.$htmlToPaper("printMe2");
    },
    handleDaochu() {
      if (this.daoFilter.ids.length) {
        getPrintOrderOutData(this.daoFilter).then(res => {
          let { list } = res.data;
          if (list.length <= 8) {
            let dis = 8 - list.length;
            for (let i = 0; i < dis; i++) {
              list.push([]);
            }
          }
          res.data.dxzj = nzhcn.toMoney(res.data.zj).replace("人民币", "");
          this.printData = res.data;
          this.printModal = true;
        });
      } else {
        this.$Message.error("请选择导出项");
      }
    },
    handleSelect(selection) {
      this.daoFilter.ids = selection.map(v => {
        return v.id;
      });
    },
    loadData() {
      this.loading = true;
      getStockOutList(this.filter).then(res => {
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
        count: 1,
        userId: "",
        limit: 0
      };
    },
    resetVerifyForm2() {
      this.verifyForm2 = {
        id: "",
        reason: ""
      };
    },
    handleCacelModal() {
      this.showVerifyModal = false;
      this.resetVerifyForm();
    },
    handleCacelModal2() {
      this.showVerifyModal2 = false;
      this.resetVerifyForm();
    },
    handleVerifyFirst() {
      this.$refs["verifyForm"].validate(valid => {
        if (valid) {
          this.modalLoading = true;
          stockOutAction(this.verifyForm).then(
            res => {
              this.$lf.message("出库成功", "success");
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
    },
    handleVerifyFirst2() {
      this.$refs["verifyForm2"].validate(valid => {
        if (valid) {
          this.modalLoading = true;
          stockWasteAction(this.verifyForm2).then(
            res => {
              this.$lf.message("报废成功", "success");
              this.modalLoading2 = false;
              this.handleCacelModal2();
              this.loadData();
            },
            () => {
              this.modalLoading2 = false;
            }
          );
        }
      });
    }
  },
  components: {
    pagination,
    dateRgSelector,
    departCalSelector
    // userSelector
  }
};
</script>
