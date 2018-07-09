
<template>
    <Card>
        <p slot="title">
            新增单位
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
            <FormItem label="单位名称" prop="name" >
                <Input v-model="form.name" placeholder="单位名称"  />
            </FormItem>
            <FormItem label="单位编号" prop="code" >
                <Input v-model="form.code" placeholder="单位编号"/>
            </FormItem>
             <FormItem label="备注" prop="info" >
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
import { addOrUpdateUnit } from "@/actions/unit";
export default {
  name: "sys-unit-add",
  data() {
    return {
      loading: false,
      form: {
        name: "",
        code: "",
        info: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入单位名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入单位编号",
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
          let formData = this.form;
          addOrUpdateUnit(formData).then(
            res => {
              this.loading = false;
              this.$lf.message("保存成功", "success");
              closeCurrentErrPage(this, "base_unit");
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
