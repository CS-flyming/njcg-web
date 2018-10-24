<style lang="less">
.data-control-ts {
  display: flex;
}
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="商品名称">
                    <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem label="商品分类">
                    <productTypesSelector v-model="filter.type" change-on-select clearable/>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control data-control-ts">
            <Button type="primary" @click="$router.push({ name: 'product-add-add' })">新增商品</Button>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              multiple
              :action="uploadConfig.serviceUrl"
              style="display: inline-block;margin-left:10px;">
               <Button icon="ios-cloud-upload-outline" type="primary">导入图片</Button>
            </Upload>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              multiple
              :action="uploadConfig2.serviceUrl"
              style="display: inline-block;margin-left:10px;">
               <Button icon="ios-cloud-upload-outline" type="primary">导入excel</Button>
            </Upload>
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
import { getProductList,deleteProduct} from "@/actions/product";
import { uploadConfig, ApiUrl } from "@/constants/constant";
export default {
  name: "product_add",
  data() {
    return {
      uploadConfig: {
        accept: "",
        headers: uploadConfig.headers,
        name: "file",
        serviceUrl: `${ApiUrl}/file/upload/zip`
      },
      uploadConfig2: {
        accept: "",
        headers: uploadConfig.headers,
        name: "file",
        serviceUrl: `${ApiUrl}/product/export`
      },
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
          key: "typeDesc",
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
        },
        {
          type: "action",
          title: "操作",
          width: 250,
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
                      deleteProduct(params.row.id).then(
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
                   style: {
                        margin: "0 5px"
                      },
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "product-add-edit",
                        params: {
                          id: params.row.id
                        },
                        query: {
                          item: JSON.stringify(params.row)
                        }
                      });
                    }
                  }
                },
                "编辑"
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
                        name: "product-add-detail",
                        params: {
                          id: params.row.id
                        }
                      });
                    }
                  }
                },
                "详情"
              )
            ]);
          }
        }
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
    },
    handleSuccess(res, file) {
      if (res.code == "1000") {
        this.$Message.success("上传成功");
        this.loadData();
      } else {
        this.$Message.error(res.msg);
      }
    }
  },
  components: {
    pagination,
    productTypesSelector
  }
};
</script>
