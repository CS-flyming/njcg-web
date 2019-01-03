<style lang="less">
</style>

<template>
  <div>
    <Card class="filter-wrap">
      <Form
        @submit.native.prevent="handleFilter"
        :model="filter"
        ref="filterForm"
        label-position="right"
        :label-width="120"
      >
        <FormItem label="项目名称">
          <Input v-model="filter.name" style="width:100%;"/>
        </FormItem>
        <FormItem label="经费类型">
          <Select v-model="filter.type" clearable>
            <Option value="5">装备经费</Option>
            <Option value="6">后勤经费</Option>
          </Select>
        </FormItem>
        <FormItem label="招标方式">
          <Select v-model="filter.method" clearable>
            <Option value="1">询价</Option>
            <Option value="2">邀请招标</Option>
            <Option value="3">公开招标</Option>
            <Option value="4">单一来源</Option>
            <Option value="5">竞争性谈判</Option>
          </Select>
        </FormItem>
        <FormItem label="起止时间">
          <dateRgSelector
            style="width:100%;"
            v-model="filter._dateRange"
            :start-date.sync="filter.startTime"
            :end-date.sync="filter.endTime"
            clearable
          />
        </FormItem>
        <FormItem class="submit">
          <Button type="primary" html-type="submit">筛选</Button>
        </FormItem>
      </Form>
    </Card>

    <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
    <pagination
      :total="total"
      :limit.sync="filter.limit"
      :offset.sync="filter.offset"
      @on-load="loadData"
    ></pagination>
  </div>
</template>

<script>
import pagination from "components/pagination";
import dateRgSelector from "components/date-rg-selector";
import { getBidMyList } from "@/actions/bid";
export default {
  name: "bid_my",
  data() {
    return {
       loading: false,
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
      columns: [
        {
          title: "项目名称",
          key: "name",
          align: "center"
        },
        {
          title: "项目需求",
          key: "xmxq",
          align: "center"
        },
        {
          title: "招标方式",
          key: "methodDesc",
          align: "center"
        },
        {
          title: "经费类型",
          key: "typeDesc",
          align: "center"
        },
        {
          title: "经费预算",
          key: "planMoney",
          align: "center"
        },
        {
          title: "需求部门",

          key: "departName",
          align: "center"
        },
        {
          title: "开始时间",
          key: "startTime",
          align: "center"
        },
        {
          title: "结束时间",
          key: "endTime",
          align: "center"
        },
          {
          title: "备注",
          key: "info",
          align: "center"
        },
        {
          title: "状态",
          key: "statusDesc",
          align: "center"
        }
      ],
      filter: {
        limit: 10,
        offset: 0,
        name: "",
        method: "",
        type: "",
        _dateRange: ["", ""],
        startTime: "",
        endTime: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getBidMyList(this.filter).then(res => {
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
    }
  },
  components: {
    pagination,
    dateRgSelector
  }
};
</script>
