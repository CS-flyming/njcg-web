<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="名称">
                   <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <Button type="primary" @click="showAddModal">申请配发</Button>
            <Button type="primary" @click="$downloadByForm('/export/issue/apply',filter)">导出</Button>
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <Modal
            v-model="showVerifyModal"
            title="申请配发"
            @on-cancel="handleCacelModal"
           >
           <Form :model="verifyForm" ref="verifyForm" label-position="right" :label-width="120" :rules="rules">
                <FormItem label="名称" prop="name">
                    <Input v-model="verifyForm.name" placeholder="名称"  />
                </FormItem>
                <FormItem label="价格" prop="value">
                    <InputNumber  :min="1" v-model="verifyForm.value" style="width:100%;"/>
                </FormItem>
                 <FormItem label="规格" prop="standard">
                    <Input v-model="verifyForm.standard" placeholder="规格"  />
                </FormItem>
                 <FormItem label="型号" prop="model">
                    <Input v-model="verifyForm.model" placeholder="型号"  />
                </FormItem>
                <FormItem label="数量" prop="issueCount">
                    <InputNumber  :min="1" v-model="verifyForm.issueCount" style="width:100%;"/>
                </FormItem>
                <FormItem label="类型" prop="type">
                   <RadioGroup v-model="verifyForm.type">
                      <Radio label="1">普通</Radio>
                      <Radio label="2">医药用品</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="过期时间" prop="endTime"  v-if="verifyForm.type=='2'">
                    <DatePicker style="width:100%;" type="date" v-model="verifyForm.endTime" :options="options" placeholder="选择过期时间"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                  <Button type="primary" @click="handleVerifyFirst" :loading="modalLoading">提交</Button>
            </div>
        </Modal>
        <!-- <Modal
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
    </div>
</template>

<script>
import pagination from "components/pagination";
// import userSelector from "components/user-selector";
import { getIssueApplyList, addIssueItem } from "@/actions/issue";
const moment = require("moment");

export default {
  name: "issue_apply",
  data() {
    return {
      loading: false,
      showVerifyModal: false,
      modalLoading: false,
      showVerifyModal2: false,
      modalLoading2: false,
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        standard: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur"
          }
        ],
        model: [
          {
            required: true,
            message: "请输入型号",
            trigger: "blur"
          }
        ],
        value: [
          {
            required: true,
            type: "number",
            message: "请输入价格",
            trigger: "blur"
          }
        ],
        issueCount: [
          {
            required: true,
            type: "number",
            message: "请输入数量",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            type: "date",
            message: "请选择过期时间",
            trigger: "change"
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
        name: "",
        value: 0,
        standard: "",
        model: "",
        issueCount: 1,
        type: "1",
        endTime: ""
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
          key: "value",
          title: "价格"
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
          key: "issueCount",
          title: "申请数量"
        },
        {
          key: "reason",
          title: "拒绝理由"
        },
        {
          key: "statusDesc",
          title: "状态"
        },
        {
          key: "typeDesc",
          title: "类型"
        },
        {
          key: "endTime",
          title: "过期时间"
        },
        {
          key: "createName",
          title: "创建人"
        },
        {
          key: "createTime",
          title: "创建时间"
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
        name: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    showAddModal() {
      this.showVerifyModal = true;
    },
    loadData() {
      this.loading = true;
      getIssueApplyList(this.filter).then(res => {
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
        name: "",
        value: 0,
        standard: "",
        model: "",
        issueCount: 1
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
          let copyForm = Object.assign({}, this.verifyForm);
          copyForm.endTime = moment(this.verifyForm.endTime).format(
            "YYYY-MM-DD"
          );
          addIssueItem(copyForm).then(
            res => {
              this.$lf.message("申请成功", "success");
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
    pagination
    // userSelector
  }
};
</script>
