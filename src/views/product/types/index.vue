<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="分类名称">
                    <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <Button type="primary" @click="$router.push({ name: 'product-type-add' })">新增分类</Button>
            <!-- <Button type="primary" @click="$downloadByForm('root/user/down',filter)">导出</Button> -->
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
    </div>
</template>

<script>
import pagination from "components/pagination";
import { getProductTypesList } from "@/actions/product";
export default {
  name: "product_type",
  data() {
    return {
      loading: false,
      columns: [
        {
          key: "name",
          title: "分类名称"
        },
        {
          key: "code",
          title: "分类编号"
        },
        {
          title: "父级分类",
          render: (h, params) => {
            return h("span", params.row.parentName || "无");
          }
        },
        {
          key: "deep",
          title: "层级"
        }
        // {
        //   type: "action",
        //   title: "操作",
        //   width: 200,
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Poptip",
        //         {
        //           props: {
        //             confirm: true,
        //             title: "您确定要删除?",
        //             transfer: true
        //           },
        //           on: {
        //             "on-ok": () => {
        //               deleteManagerById(params.row.id).then(
        //                 res => {
        //                   this.loading = false;
        //                   this.$lf.message("删除成功", "success");
        //                   this.loadData();
        //                 },
        //                 () => {
        //                   this.loading = false;
        //                 }
        //               );
        //             }
        //           }
        //         },
        //         [
        //           h(
        //             "Button",
        //             {
        //               style: {
        //                 margin: "0 5px"
        //               },
        //               props: {
        //                 type: "error",
        //                 placement: "top"
        //               }
        //             },
        //             "删除"
        //           )
        //         ]
        //       ),
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "primary"
        //           },
        //           on: {
        //             click: () => {
        //               this.$router.push({
        //                 name: "sys-manager-edit",
        //                 params: {
        //                   id: params.row.id
        //                 },
        //                 query: {
        //                   item: JSON.stringify(params.row)
        //                 }
        //               });
        //             }
        //           }
        //         },
        //         "编辑"
        //       )
        //     ]);
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
    loadData() {
      this.loading = true;
      getProductTypesList(this.filter).then(res => {
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
