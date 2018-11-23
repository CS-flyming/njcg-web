
<template>
    <Card>
        <p slot="title">
            新增商品
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
            <FormItem label="商品分类"  prop="type">
                <productTypesSelector v-model="form.type" placeholder="商品分类"/>
            </FormItem>
            <FormItem label="商品规格" prop="standard" >
                <Input v-model="form.standard" placeholder="商品规格"  />
            </FormItem>
            <FormItem label="商品型号" prop="model" >
                <Input v-model="form.model" placeholder="商品型号"  />
            </FormItem>
                 <FormItem label="供货商" prop="companyId">
                <company-selector v-model="form.companyId"></company-selector>
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
            <FormItem label="商品说明图片">
                <imageUpload v-model="form.wjIds" ref="imgupload1"/>
            </FormItem>
            <FormItem label="商品详情图片">
                <imageUpload v-model="form.wjId" limit="1" ref="imgupload2"/>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" html-type="submit">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { closeCurrentErrPage } from "@/constants/constant";
import { addOrUpdateProduct } from "@/actions/product";
import productTypesSelector from "components/product-types-selector";
import companySelector from "components/company-selector";
import imageUpload from "components/image-upload";
export default {
  name: "product-add-add",
  components: {
    productTypesSelector,
    imageUpload,
    companySelector
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
          render: (h, params) => {
            console.log(params.row);
            let row = params.row,
              keys = [];
            for (const key in row) {
              if (
                row.hasOwnProperty(key) &&
                key != "_index" &&
                key != "_rowKey"
              ) {
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
              if (
                row.hasOwnProperty(key) &&
                key != "_index" &&
                key != "_rowKey"
              ) {
                values.push(row[key]);
              }
            }
            return h("div", values.join(""));
          }
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
        companyId:""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        value: [
          {
            required: true,
            type: "number",
            message: "请输入商品单价",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            type: "array",
            message: "请选择商品分类",
            trigger: "change"
          }
        ],
        standard: [
          {
            required: false,
            message: "请输入商品规格",
            trigger: "blur"
          }
        ],
        model: [
          {
            required: true,
            message: "请输入商品型号",
            trigger: "blur"
          }
        ],
        json: [
          {
            required: true,
            type: "array",
            message: "请输入商品参数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    pushParams() {
      if (this.params.value && this.params.key) {
        let obj = {},
          params = this.params;
        obj[params.key] = params.value;
        this.paramsArr.push(obj);
        this.params = {
          key: "",
          value: ""
        };
      } else {
        this.$lf.message("参数输入有误", "error");
      }
    },
    submit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          let formData = Object.assign({}, this.form);
          formData.json = this.arr2Json(this.paramsArr);
          formData.type = formData.type[formData.type.length - 1];
          addOrUpdateProduct(formData).then(
            res => {
              this.loading = false;
              this.$lf.message("保存成功", "success");
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
    resetForm() {
      this.$refs.form.resetFields();
      this.paramsArr = [];
      this.$refs.imgupload1.clearFileList();
      this.$refs.imgupload2.clearFileList();
    },
    arr2Json(arr = []) {
      let jsonObj = {};
      arr.map(v => {
        for (const key in v) {
          if (v.hasOwnProperty(key)) {
            jsonObj[key] = v[key];
          }
        }
      });
      return JSON.stringify(jsonObj);
    }
  }
};
</script>
