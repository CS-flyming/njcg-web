<style lang="less">
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
                 <FormItem label="入库类型">
                    <Select v-model="filter.type" clearable>
                        <Option value="1">上级配发</Option>
                        <Option value="2">标准采购</Option>
                        <Option value="3">发放</Option>
                        <Option value="4">非标准采购</Option>
                    </Select>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <!-- <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button> -->
            <Button type="primary" @click="$downloadByForm('/export/stock',filter)">导出</Button>
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <Modal
            v-model="showVerifyModal"
            title="发放"
            @on-cancel="handleCacelModal"
           >
           <Form :model="verifyForm" ref="verifyForm" label-position="right" :label-width="120" :rules="rules">
                <FormItem label="发放数量" prop="count">
                     <InputNumber :max="verifyForm.limit" :min="1" v-model="verifyForm.count" style="width:100%;"/>
                </FormItem>
                <FormItem label="发放用户" prop="userId">
                    <userLendSelector v-model="verifyForm.userId"/>    
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst" :loading="modalLoading">发放</Button>
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
                <FormItem label="报废数量" prop="num">
                     <InputNumber :max="verifyForm2.limit" :min="1" v-model="verifyForm2.num" style="width:100%;"/>
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst2" :loading="modalLoading2">报废</Button>
            </div>
        </Modal>
        <Modal
            v-model="showVerifyModal3"
            title="划拨"
            @on-cancel="handleCacelModal3"
           >
           <Form :model="verifyForm3" ref="verifyForm3" label-position="right" :label-width="120" :rules="rules3">
                <FormItem label="划拨数量" prop="count">
                     <InputNumber :max="verifyForm3.limit" :min="1" v-model="verifyForm3.count" style="width:100%;"/>
                </FormItem>
                <FormItem label="划拨用户" prop="userId">
                    <userLendSelector v-model="verifyForm3.userId"/>    
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst3" :loading="modalLoading3">划拨</Button>
            </div>
        </Modal>
        <Modal
            v-model="showVerifyModal4"
            title="消耗"
            @on-cancel="handleCacelModal4"
           >
           <Form :model="verifyForm4" ref="verifyForm4" label-position="right" :label-width="120" :rules="rules4">
                <FormItem label="消耗数量" prop="num">
                     <InputNumber :max="verifyForm4.limit" :min="1" v-model="verifyForm4.num" style="width:100%;"/>
                </FormItem>
                <FormItem label="消耗人" prop="userId">
                    <Input v-model="verifyForm4.userId" placeholder="消耗人" style="width:100%;"/>
                </FormItem>
                <FormItem label="备注">
                     <Input v-model="verifyForm4.info" placeholder="备注" style="width:100%;"/>
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst4" :loading="modalLoading4">消耗</Button>
            </div>
        </Modal>
        <Modal
            v-model="showVerifyModal5"
            title="编辑"
            @on-cancel="handleCacelModal5"
           >
           <Form :model="verifyForm5" ref="verifyForm5" label-position="right" :label-width="120" :rules="rules5">
                <FormItem label="存储位置" prop="location">
                    <Input v-model="verifyForm5.location" placeholder="存储位置" style="width:100%;"/>
                </FormItem>
                <FormItem label="负责人" prop="fzr">
                     <Input v-model="verifyForm5.fzr" placeholder="负责人" style="width:100%;"/>
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst5" :loading="modalLoading5">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import pagination from "components/pagination";
import userSelector from "components/user-selector";
import dateRgSelector from "components/date-rg-selector";
import userLendSelector from "components/user-lend-selector";
import {
  getStockInfoList,
  stockOutAction,
  stockWasteAction,
  stockReturnAction,
  xiaohaoAction,
  editFzrAction
} from "@/actions/stock";
import { lendHisAction } from "@/actions/lend";
export default {
  name: "stock_info",
  data() {
    return {
      loading: false,
      showVerifyModal: false,
      modalLoading: false,
      showVerifyModal2: false,
      modalLoading2: false,
      showVerifyModal3: false,
      modalLoading3: false,
      showVerifyModal4: false,
      modalLoading4: false,
      showVerifyModal5: false,
      modalLoading5: false,
      rules: {
        userId: [
          {
            required: true,
            message: "请选择发放用户",
            trigger: "change"
          }
        ],
        count: [
          {
            required: true,
            type: "number",
            message: "请输入发放数量",
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
        ],
        num: [
          {
            required: true,
            type: "number",
            message: "请输入发放数量",
            trigger: "blur"
          }
        ]
      },
      rules3: {
        userId: [
          {
            required: true,
            message: "请选择划拨用户",
            trigger: "change"
          }
        ],
        count: [
          {
            required: true,
            type: "number",
            message: "请输入划拨数量",
            trigger: "blur"
          }
        ]
      },
      rules4: {
        userId: [
          {
            required: true,
            message: "请选择消耗人",
            trigger: "blur"
          }
        ],
        num: [
          {
            required: true,
            type: "number",
            message: "请输入消耗数量",
            trigger: "blur"
          }
        ]
      },
      rules5: {
        location: [
          {
            required: true,
            message: "请选择存储位置",
            trigger: "blur"
          }
        ],
        fzr: [
          {
            required: true,
            message: "请选择负责人",
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
        reason: "",
        num: 1,
        limit: 0
      },
      verifyForm3: {
        id: "",
        count: 1,
        userId: "",
        limit: 0
      },
      verifyForm4: {
        id: "",
        info: "",
        userId: "",
        num: 1,
        limit: 0
      },
      verifyForm5: {
        id: "",
        location: "",
        fzr: ""
      },
      columns: [
        {
          key: "name",
          title: "名称",
          width: 200
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
          title: "已划拨数量"
        },
        {
          key: "location",
          title: "存储位置"
        },
        {
          key: "fzr",
          title: "负责人"
        },
        {
          key: "createTime",
          title: "入库时间"
        },
        {
          type: "action",
          title: "操作",
          width: 240,
          render: (h, params) => {
            let div1 = h(
              "div",
              {
                style: {
                  marginTop: "8px"
                }
              },
              [
                h(
                  "Button",
                  {
                    on: {
                      click: () => {
                        this.verifyForm2.id = params.row.id;
                        this.verifyForm2.limit = params.row.allCount;
                        this.showVerifyModal2 = true;
                      }
                    },
                    props: {
                      type: "error"
                    }
                  },
                  "报废"
                ),
                h(
                  "Button",
                  {
                    on: {
                      click: () => {
                        this.verifyForm4.id = params.row.id;
                        this.verifyForm4.limit = params.row.useCount;
                        this.showVerifyModal4 = true;
                      }
                    },
                    style: {
                      marginLeft: "8px"
                    },
                    props: {
                      type: "error"
                    }
                  },
                  "消耗"
                ),
                h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "您确定要退货?",
                      transfer: true
                    },
                    on: {
                      "on-ok": () => {
                        stockReturnAction(params.row.id).then(res => {
                          this.$lf.message("退货成功", "success");
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
                          type: "error",
                          placement: "top"
                        }
                      },
                      "退货"
                    )
                  ]
                )
              ]
            );
            let div2 = h("div", [
              h(
                "Button",
                {
                  on: {
                    click: () => {
                      this.verifyForm.id = params.row.id;
                      this.verifyForm.limit = params.row.useCount;
                      this.showVerifyModal = true;
                    }
                  },
                  props: {
                    type: "primary"
                  }
                },
                "发放"
              ),
              h(
                "Button",
                {
                  on: {
                    click: () => {
                      this.verifyForm3.id = params.row.id;
                      this.verifyForm3.limit =
                        params.row.useCount - params.row.lendCount;
                      this.showVerifyModal3 = true;
                    }
                  },
                  style: {
                    marginLeft: "8px"
                  },
                  props: {
                    type: "primary"
                  }
                },
                "划拨"
              )
            ]);
            let div3 = h(
              "div",
              {
                style: {
                  marginTop: "8px"
                }
              },
              [
                h(
                  "Button",
                  {
                    on: {
                      click: () => {
                        this.verifyForm5.id = params.row.id;
                        this.showVerifyModal5 = true;
                      }
                    },
                    props: {
                      type: "primary"
                    }
                  },
                  "编辑存储位置和负责人"
                )
              ]
            );
            return h(
              "div",
              {
                style: {
                  padding: "5px"
                }
              },
              [div2, div1, div3]
            );
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
        type: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getStockInfoList(this.filter).then(res => {
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
        reason: "",
        num: 1,
        limit: 0
      };
    },
    resetVerifyForm3() {
      this.verifyForm3 = {
        id: "",
        count: 1,
        userId: "",
        limit: 0
      };
    },
    resetVerifyForm4() {
      this.verifyForm4 = {
        id: "",
        info: "",
        userId: "",
        num: 1,
        limit: 0
      };
    },
    resetVerifyForm5() {
      this.verifyForm5 = {
        id: "",
        location: "",
        fzr: ""
      };
    },
    handleCacelModal() {
      this.showVerifyModal = false;
      this.resetVerifyForm();
    },
    handleCacelModal2() {
      this.showVerifyModal2 = false;
      this.resetVerifyForm2();
    },
    handleCacelModal3() {
      this.showVerifyModal3 = false;
      this.resetVerifyForm3();
    },
    handleCacelModal4() {
      this.showVerifyModal4 = false;
      this.resetVerifyForm4();
    },
    handleCacelModal5() {
      this.showVerifyModal5 = false;
      this.resetVerifyForm5();
    },
    handleVerifyFirst() {
      this.$refs["verifyForm"].validate(valid => {
        if (valid) {
          this.modalLoading = true;
          stockOutAction(this.verifyForm).then(
            res => {
              this.$lf.message("发放成功", "success");
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
          this.modalLoading2 = true;
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
    },
    handleVerifyFirst3() {
      this.$refs["verifyForm3"].validate(valid => {
        if (valid) {
          this.modalLoading3 = true;
          lendHisAction(this.verifyForm3).then(
            res => {
              this.$lf.message("划拨成功", "success");
              this.modalLoading3 = false;
              this.handleCacelModal3();
              this.loadData();
            },
            () => {
              this.modalLoading3 = false;
            }
          );
        }
      });
    },
    handleVerifyFirst4() {
      this.$refs["verifyForm4"].validate(valid => {
        if (valid) {
          this.modalLoading4 = true;
          xiaohaoAction(this.verifyForm4).then(
            res => {
              this.$lf.message("消耗成功", "success");
              this.modalLoading4 = false;
              this.handleCacelModal4();
              this.loadData();
            },
            () => {
              this.modalLoading4 = false;
            }
          );
        }
      });
    },
    handleVerifyFirst5() {
      this.$refs["verifyForm5"].validate(valid => {
        if (valid) {
          this.modalLoading5 = true;
          editFzrAction(this.verifyForm5).then(
            res => {
              this.$lf.message("编辑成功", "success");
              this.modalLoading5 = false;
              this.handleCacelModal5();
              this.loadData();
            },
            () => {
              this.modalLoading5 = false;
            }
          );
        }
      });
    }
  },
  components: {
    pagination,
    userSelector,
    userLendSelector,
    dateRgSelector
  }
};
</script>
