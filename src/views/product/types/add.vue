
<template>
    <Card>
        <p slot="title">
            新增分类
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
            <FormItem label="分类名称" prop="name" >
                <Input v-model="form.name" placeholder="分类名称"  />
            </FormItem>
            <FormItem label="分类编号" prop="code" >
                <Input v-model="form.code" placeholder="分类编号"  />
            </FormItem>
            <FormItem label="所属分类">
                <productTypesSelector v-model="form.parentId" placeholder="所属分类"  change-on-select/>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" html-type="submit">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { closeCurrentErrPage } from "@/constants/constant";
import { addOrUpdateTypes } from "@/actions/product";
import productTypesSelector from "components/product-types-selector";
export default {
  name: "product-type-add",
  components: {
    productTypesSelector
  },
  data() {
    return {
      loading: false,
      form: {
        name: "",
        code: "",
        parentId: []
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入分类编号",
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
          let formData = Object.assign({}, this.form);
          formData.parentId = formData.parentId[formData.parentId.length - 1];
          addOrUpdateTypes(formData).then(
            res => {
              this.loading = false;
              this.$lf.message("保存成功", "success");
              closeCurrentErrPage(this, "product_type");
            },
            () => {
              this.loading = false;
            }
          );
        }
      });
    }
  }
};
</script>
