<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="供应商名称">
                    <Input v-model="filter.name" clearable/>
                </FormItem>
                 <FormItem label="联系人">
                    <Input v-model="filter.user" clearable/>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <Button type="primary" @click="$router.push({ name: 'product-company-add' })">新增供应商</Button>
            <Button type="primary" @click="$downloadByForm('export/company',filter)">导出</Button>
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
    </div>
</template>

<script>
import pagination from "components/pagination";
import { getCompanyList, deleteCompanyById } from "@/actions/product";
export default {
  name: "product_company",
  data() {
    return {
      loading: false,
      columns: [
        {
          key: "name",
          title: "供货商名称"
        },
        {
          key: "user",
          title: "联系人"
        },
        {
          key: "address",
          title: "地址"
        },
        {
          key: "width",
          title: "经营范围"
        },
        {
          key: "info",
          title: "备注"
        },
        {
          key: "phone",
          title: "联系人电话"
        },
        {
          key: "createTime",
          title: "录入时间"
        },
        {
          type: "action",
          title: "操作",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      deleteCompanyById(params.row.id).then(
                        res => {
                          this.loading = false;
                          this.$lf.message("删除成功", "success");
                          this.loadData();
                        },
                        () => {
                          this.loading = false;
                        }
                      );
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
                    "删除"
                  )
                ]
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "product-company-edit",
                        params: {
                          id: params.row.id
                        }
                      });
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      filter: {
        limit: 10,
        offset: 0,
        name: "",
        user: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getCompanyList(this.filter).then(res => {
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
