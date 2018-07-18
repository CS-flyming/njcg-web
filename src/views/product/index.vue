<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="商品名称">
                    <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem label="商品分类">
                    <productTypesSelector v-model="filter.type" clearable/>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button>
            <!-- <Button type="primary" @click="$downloadByForm('root/user/down',filter)">导出</Button> -->
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
        <Modal
            v-model="showParamsModal"
            title="参数列表"
           >
            <Table :columns="paramscolumns" :data="selectParamsArr" border></Table>
            <div slot="footer">
               
            </div>
        </Modal>
    </div>
</template>

<script>
import pagination from "components/pagination";
import productTypesSelector from "components/product-types-selector";
import { getProductList } from "@/actions/product";
export default {
  name: "product_add",
  data() {
    return {
      loading: false,
      showParamsModal: false,
      paramscolumns: [
        {
          key: "key",
          title: "参数名称"
        },
        {
          key: "value",
          title: "参数数值"
        }
      ],
      columns: [
        {
          key: "name",
          title: "商品名称"
        },
        {
          key: "type",
          title: "分类"
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
          key: "value",
          title: "价格"
        },
        {
          key: "createTime",
          title: "添加时间"
        },
        {
          title: "参数列表",
          render: (h, params) => {
            if (params.row.json) {
              return h(
                "div",
                {
                  style: {
                    color: "#2d8cf0"
                  },
                  on: {
                    click: () => {
                      let jsonObj = JSON.parse(params.row.json);
                      let selectParamsArr = [];
                      for (const key in jsonObj) {
                        if (jsonObj.hasOwnProperty(key)) {
                          let obj = { key: "", value: "" };
                          obj.key = key;
                          obj.value = jsonObj[key];
                          selectParamsArr.push(obj);
                        }
                      }
                      this.selectParamsArr = selectParamsArr;
                      this.showParamsModal = true;
                    }
                  }
                },
                "点击查看"
              );
            } else {
              return h("div", "无");
            }
          }
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
        name: "",
        type: []
      },
      data: [],
      total: 0,
      selectParamsArr: []
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      let filterCopy = Object.assign({}, this.filter);
      filterCopy.type = filterCopy.type[filterCopy.type.length - 1];
      getProductList(filterCopy).then(res => {
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
    pagination,
    productTypesSelector
  }
};
</script>
