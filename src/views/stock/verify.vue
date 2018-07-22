<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="商品名称">
                   <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <!-- <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button> -->
            <!-- <Button type="primary" @click="$downloadByForm('root/user/down',filter)">导出</Button> -->
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <Modal
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
        </Modal>
    </div>
</template>

<script>
import pagination from "components/pagination";
import userSelector from "components/user-selector";
import {
  getStockOutVerifyList,
  stockOutAction,
  stockWasteAction
} from "@/actions/stock";
export default {
  name: "stock_verify",
  data() {
    return {
      loading: false,
      showVerifyModal: false,
      modalLoading: false,
      showVerifyModal2: false,
      modalLoading2: false,
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
          key: "wasteTime",
          title: "报废时间"
        },
        {
          key: "wasteReason",
          title: "报废原因"
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
          type: "action",
          title: "操作",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  on: {
                    click: () => {
                      this.verifyForm.id = params.row.id;
                      this.verifyForm.limit =
                        params.row.useCount - params.row.lendCount;
                      this.showVerifyModal = true;
                    }
                  },
                  props: {
                    type: "primary"
                  }
                },
                "出库"
              ),
              h(
                "Button",
                {
                  on: {
                    click: () => {
                      this.verifyForm2.id = params.row.id;
                      this.showVerifyModal2 = true;
                    }
                  },
                  style: {
                    marginLeft: "8px"
                  },
                  props: {
                    type: "error"
                  }
                },
                "报废"
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
        name: ""
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
    userSelector
  }
};
</script>
