
<template>
    <Card>
        <p slot="title">
            新增供应商
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
            <FormItem label="供应商名称" prop="name" >
                <Input v-model="form.name" placeholder="供应商名称"  />
            </FormItem>
            <FormItem label="联系人" prop="user" >
                <Input v-model="form.user" placeholder="联系人"  />
            </FormItem>
            <FormItem label="联系电话" prop="phone" >
                <Input v-model="form.phone" placeholder="联系电话"  />
            </FormItem>
            <FormItem label="经营范围" prop="width" >
                <Input v-model="form.width" placeholder="经营范围"  />
            </FormItem>
            <FormItem label="地址" prop="address" >
                <Input v-model="form.address" placeholder="地址"  />
            </FormItem>
            <FormItem label="备注"  >
                <Input v-model="form.info" placeholder="备注"  />
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" html-type="submit">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { closeCurrentErrPage } from "@/constants/constant";
import { addOrUpdateCompany } from "@/actions/product";
import productTypesSelector from "components/product-types-selector";
export default {
  name: "product-company-add",
  components: {
    productTypesSelector
  },
  data() {
    return {
      loading: false,
      form: {
        name: "",
        user: "",
        address: "",
        width: "",
        info: "",
        phone: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入供应商名称",
            trigger: "blur"
          }
        ],
        user: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur"
          }
        ],
        width: [
          {
            required: true,
            message: "请输入经营范围",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          addOrUpdateCompany(this.form).then(
            res => {
              this.resetForm();
              this.loading = false;
              this.$lf.message("保存成功", "success");
              closeCurrentErrPage(this, "product_company");
            },
            () => {
              this.loading = false;
            }
          );
        }
      });
    },
    resetForm() {
      this.form = {
        name: "",
        user: "",
        address: "",
        width: "",
        info: "",
        phone: ""
      };
    }
  }
};
</script>
