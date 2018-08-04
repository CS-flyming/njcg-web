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
                 <!-- <FormItem label="订单状态">
                    <Select v-model="filter.sttaus" clearable>
                        <Option value="1">初审中</Option>
                        <Option value="2">复审中</Option>
                        <Option value="3">拒绝</Option>
                        <Option value="5">完成</Option>
                        <Option value="6">入库</Option>
                    </Select>
                </FormItem> -->
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <!-- <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button> -->
            <Button type="primary" @click="$downloadByForm('/export/issue/refuse',filter)">导出</Button>
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
    </div>
</template>

<script>
import pagination from "components/pagination";
import { getIssueRefuseList } from "@/actions/issue";
export default {
  name: "issue_refuse",
  data() {
    return {
      loading: false,
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
        // {
        //   key: "reason",
        //   title: "拒绝理由"
        // },
        // {
        //   key: "statusDesc",
        //   title: "状态"
        // },
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
        }
      ],
      filter: {
        limit: 10,
        offset: 0,
        // status: "",
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
      getIssueRefuseList(this.filter).then(res => {
        this.loading = false;
        this.data = res.data.rows;
        this.total = res.data.total;
      });
    },
    handleFilter() {
      this.filter.offset = 0;
      this.loadData();
    }
  },
  components: {
    pagination
  }
};
</script>
