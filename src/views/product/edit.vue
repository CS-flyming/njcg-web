

<template>
    <Card>
        <p slot="title">
            编辑商品
        </p>
        <Form 
            style="max-width: 800px;" 
            ref="form" 
            method="post" 
            @submit.prevent.native="submit" 
            :model="form" 
            :label-width="120" 
            label-position="right"
            :rules="rules">
            <FormItem label="商品名称" prop="name" >
                <Input v-model="form.name" placeholder="商品名称"  />
            </FormItem>
            <FormItem label="商品单价" prop="value" >
                <InputNumber v-model="form.value" style="width:100%;"  :min="0"/>
            </FormItem>
            <FormItem label="商品规格" prop="standard" >
                <Input v-model="form.standard" placeholder="商品规格"  />
            </FormItem>
            
            <FormItem label="商品型号" prop="model" >
                <Input v-model="form.model" placeholder="商品型号"  />
            </FormItem>
            <FormItem label="商品参数">
                <Table :columns="paramscolumns" :data="paramsArr" border></Table>
                <Row style="margin-top:10px;">
                  <Col span="11">
                    <Input v-model="params.key" placeholder="参数名称"  />
                  </Col>
                  <Col span="11">
                    <Input v-model="params.value" placeholder="参数数值"  />
                  </Col>
                  <Col span="2" style="text-align:right;">
                    <Button type="primary" @click="pushParams">+</Button>
                  </Col>
                </Row> 
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" html-type="submit">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { closeCurrentErrPage } from "@/constants/constant";
import { getProductDetail, addOrUpdateProduct } from "@/actions/product";
import productTypesSelector from "components/product-types-selector";
export default {
  name: "product-add-edit",
  components: {
    productTypesSelector
  },
  data() {
    return {
      loading: false,
      paramsArr: [],
      params: {
        key: "",
        value: ""
      },
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
        standard: "",
        model: ""
      },
      rules: {
        name: [
          {
            required: false,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        value: [
          {
            required: false,
            type: "number",
            message: "请输入商品单价",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: false,
            type: "array",
            message: "请选择商品分类",
            trigger: "change"
          }
        ],
        standard: [
          {
            required: false,
            message: "请输入商品规格1",
            trigger: "blur"
          }
        ],
        model: [
          {
            required: false,
            message: "请输入商品型号",
            trigger: "blur"
          }
        ],
        json: [
          {
            required: false,
            type: "array",
            message: "请输入商品参数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  paramscolumns: [
    {
      title: "参数名称",
      render: (h, params) => {
        console.log(params.row);
        let row = params.row,
          keys = [];
        for (const key in row) {
          if (row.hasOwnProperty(key) && key != "_index" && key != "_rowKey") {
            keys.push(key);
          }
        }
        return h("div", keys.join(""));
      }
    },
    {
      title: "参数数值",
      render: (h, params) => {
        console.log(params.row);
        let row = params.row,
          values = [];
        for (const key in row) {
          if (row.hasOwnProperty(key) && key != "_index" && key != "_rowKey") {
            values.push(row[key]);
          }
        }
        return h("div", values.join(""));
      }
    }
  ],
  activated() {
    this.getDetail();
  },
  methods: {
    pushParams() {
      if (this.params.value && this.params.key) {
        console.log(this.paramsArr);
        let obj = {},
          params = this.params;
        obj["key"] = params.key;
        obj["value"] = params.value;
        this.paramsArr.push(obj);
        this.params = {
          key: "",
          value: ""
        };
      } else {
        this.$lf.message("参数输入有误", "error");
      }
    },
    getDetail() {
      let { id } = this.$route.params;
      getProductDetail(id).then(res => {
        this.form = res.data;
        this.paramsArr = this.json2arr(res.data.json);
      });
    },
    submit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          console.log(this.paramsArr);
          let formData = {};
          formData.json = this.arr2Json(this.paramsArr);
          formData.id = this.form.id;
          formData.name = this.form.name;
          formData.value = this.form.value;
          formData.model = this.form.model;
          formData.standard = this.form.standard;
          formData.type = this.form.type;
          addOrUpdateProduct(formData).then(
            res => {
              this.loading = false;
              this.$lf.message("编辑成功", "success");
              this.resetForm();
              closeCurrentErrPage(this, "product_add");
            },
            () => {
              this.loading = false;
            }
          );
        }
      });
    },
    arr2Json(arr = []) {
      let obj1 = {};
      for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        obj1[arr[i].key] = arr[i].value;
      }
      console.log(obj1);
      return JSON.stringify(obj1);
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
    },

    resetForm() {
      this.form = {
        name: "",
        value: 0,
        type: [],
        standard: "",
        model: "",
        wjId: [],
        wjIds: [],
        files: []
      };
    }
  }
};
</script>
