
<template>
    <Card>
        <p slot="title">
            商品详情
        </p>
        <Form 
            ref="form" 
            :model="form" 
            :label-width="120" 
            label-position="right">
            <FormItem label="商品名称：">
                <span>{{form.name}}</span>
            </FormItem>
            <FormItem label="商品单价：">
                <span>{{form.value}}</span>
            </FormItem>
            <FormItem label="商品分类：" >
                <span>{{form.typeDescs+'/'+form.typeDesc}}</span>
            </FormItem>
            <FormItem label="商品规格：">
                <span>{{form.standard}}</span>
            </FormItem>
            <FormItem label="商品型号：">
                <span>{{form.model}}</span>
            </FormItem>
             <FormItem label="商品编号：">
                <span>{{form.code}}</span>
            </FormItem>
            <FormItem label="商品参数：">
                <Table :columns="paramscolumns" :data="paramsArr" border></Table>
            </FormItem>
            <FormItem label="商品说明图片：">
                <Row>
                  <template v-if="form.files.length">
                    <Col span="6" v-for="item in form.files" :key="item.id">
                      <img :src="item.url" alt="">
                    </Col> 
                  </template> 
                  <template v-else>
                    <Col span="6">
                      <span >暂无图片</span>
                    </Col> 
                  </template>
                  
                </Row> 
            </FormItem>
            <FormItem label="商品详情图片：">
               <Row>
                  <Col span="6">
                    <img :src="form.file&&form.file.url" alt="" v-if="form.file&&form.file.url">
                    <span v-else>暂无图片</span>
                  </Col> 
                </Row>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { getProductDetail } from "@/actions/product";
export default {
  name: "product-add-detail",
  data() {
    return {
      loading: false,
      paramsArr: [],
      paramscolumns: [
        {
          title: "参数名称",
          key: "key"
        },
        {
          title: "参数数值",
          key: "value"
        }
      ],
      form: {
        name: "",
        value: 0,
        type: [],
        standard: "",
        model: "",
        wjId: [],
        wjIds: [],
        files: []
      }
    };
  },
  activated() {
    this.getProductDetail();
  },
  methods: {
    getProductDetail() {
      let { id } = this.$route.params;
      getProductDetail(id).then(res => {
        this.form = res.data;
        this.paramsArr = this.json2arr(res.data.json);
      });
    },
    json2arr(jsonstr = "") {
      if (jsonstr) {
        let jsonObj = JSON.parse(jsonstr);
        let paramsArr = [];
        for (const key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            let obj = {};
            obj.key = key;
            obj.value = jsonObj[key];
            paramsArr.push(obj);
          }
        }
        return paramsArr;
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
img {
  width: 100%;
}
</style>
