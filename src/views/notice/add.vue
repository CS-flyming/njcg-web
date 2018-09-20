
<template>
    <Card>
        <p slot="title">
            新增公告
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
             <FormItem label="标题" prop="name" >
                <Input v-model="form.name" placeholder="标题"  />
            </FormItem>
            <FormItem label="内容" prop="info" >
                <Input v-model="form.info" placeholder="内容"  />
            </FormItem>
            <FormItem label="附件">
                <fileUpload v-model="form.wjIds" ref="fileUpload"/>
            </FormItem>
            <FormItem >
                <Button type="primary" :loading="loading" html-type="submit">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { closeCurrentErrPage } from "@/constants/constant";
import { addOrUpdatePlan } from "@/actions/notice";
import fileUpload from "components/file-upload";
export default {
  name: "notice-add",
  components: {
    fileUpload
  },
  data() {
    return {
      loading: false,
      keepUserArr: [],
      form: {
        name: "",
        info: "",
        wjIds: []
      },
      rules: {
        name: [
          {
             required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        info: [
          {
             required: true,
            message: "请输入内容",
            trigger: "blur"
          }
        ]
      }
    }
  },

  methods: {
    submit(e) {
      let { name } = this.$route.query;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          let formData = this.form;
          addOrUpdatePlan(formData).then(
            res => {
              this.loading = false;
              this.$lf.message("保存成功", "success");
              this.resetForm();
              closeCurrentErrPage(this, name);
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
    }
  }
    
};
</script>
