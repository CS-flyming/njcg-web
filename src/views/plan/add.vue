
<template>
    <Card>
        <p slot="title">
            新增计划
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
            <FormItem label="计划年月" prop="name" >
                <!-- <Input v-model="form.year" placeholder="年份"  /> -->
                <DatePicker v-model="form.name" type="month" format="yyyy-MM" placeholder="选择年月" style="width:100%;"></DatePicker>
            </FormItem>
            <FormItem label="开始时间" prop="startTime">
                <DatePicker v-model="form.startTime" format="yyyy-MM-dd" type="date"  placeholder="选择开始时间" style="width: 100%;"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="endTime">
                <DatePicker v-model="form.endTime" format="yyyy-MM-dd" type="date"  placeholder="选择结束时间" style="width: 100%;"></DatePicker>
            </FormItem>
            <FormItem >
                <Button type="primary" :loading="loading" html-type="submit">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { closeCurrentErrPage } from "@/constants/constant";
import { addOrUpdatePlan } from "@/actions/plan";
export default {
  name: "plan-add",
  data() {
    return {
      loading: false,
      keepUserArr: [],
      form: {
        name: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        name: [
          {
            required: true,
            type: "date",
            message: "请选择计划年月",
            trigger: "change"
          }
        ],
        month: [
          {
            required: true,
            message: "请输入月份",
            trigger: "blur"
          }
        ],
        startTime: [
          {
            required: true,
            type: "date",
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            type: "date",
            message: "请选择结束时间",
            trigger: "change"
          }
        ]
      }
    };
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
