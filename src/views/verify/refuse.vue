<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="采购类型">
                    <Select v-model="filter.type" clearable>
                        <Option value="1">集中采购</Option>
                        <Option value="2">自行采购</Option>
                    </Select>
                </FormItem>
                <FormItem label="紧急程度">
                    <Select v-model="filter.level" clearable>
                        <Option value="1">月度上报</Option>
                        <Option value="2">紧急购买</Option>
                    </Select>
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
    </div>
</template>

<script>
import pagination from "components/pagination";
import { getVerifyRefuseList, verifyFirstItem } from "@/actions/verify";
export default {
  name: "verify_refuse",
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
          key: "orderNo",
          title: "订单号"
        },
        {
          title: "总价",
          render: (h, params) => {
            return h("div", params.row.zj ? params.row.zj + "元" : "--");
          }
        },
        {
          key: "levelDesc",
          title: "紧急程度"
        },
        {
          key: "typeDesc",
          title: "采购类型"
        },
        {
          key: "createName",
          title: "申请人"
        },
        {
          key: "applyDepartName",
          title: "申请部门"
        },
        {
          key: "createTime",
          title: "添加时间"
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
        type: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getVerifyRefuseList(this.filter).then(res => {
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
    pagination
  }
};
</script>
