<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="名称">
                   <Input v-model="filter.name" clearable/>
                </FormItem>
                 <!-- <FormItem label="订单状态">
                    <Select v-model="filter.sttaus" clearable>
                        <Option value="1">初审中</Option>
                        <Option value="2">复审中</Option>
                        <Option value="3">拒绝</Option>
                        <Option value="5">完成</Option>
                        <Option value="6">入库</Option>
                    </Select>
                </FormItem> -->
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
            <Button type="primary" @click="$downloadByForm('/export/issue/verify',filter)">导出</Button>
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
import dateRgSelector from "components/date-rg-selector";
import departCalSelector from "components/depart-cal-selector";
import { getIssueVerifyList, verifyIssueItem } from "@/actions/issue";
export default {
  name: "issue_verify",
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
          title: "驳回原因"
        },
        {
          key: "typeDesc",
          title: "商品类型"
        },
        {
          key: "departName",
          title: "申请部门"
        },
        {
          key: "statusDesc",
          title: "状态"
        },
        // {
        //   key: "lendUserName",
        //   title: "接收人"
        // },
        {
          key: "createName",
          title: "创建人"
        },
        {
          key: "createTime",
          title: "创建时间"
        },
        {
          type: "action",
          title: "操作",
          width: 100,
          render: (h, params) => {
            if (params.row.status == "1") {
              return h(
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
              );
            }
          }
        }
      ],
      filter: {
        limit: 10,
        offset: 0,
        // status: "",
        name: "",
        _dateRange: ["", ""],
        startTime: "",
        endTime: "",
        _departId: [],
        departId: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getIssueVerifyList(this.filter).then(res => {
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
          verifyIssueItem(this.verifyForm).then(
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
    dateRgSelector,
    departCalSelector
  }
};
</script>
