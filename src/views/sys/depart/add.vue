
<template>
    <Card>
        <p slot="title">
            新增部门
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
            <FormItem label="部门名称" prop="name" >
                <Input v-model="form.name" placeholder="部门名称"  />
            </FormItem>
            <FormItem label="部门编号" prop="code" >
                <Input v-model="form.code" placeholder="部门编号"/>
            </FormItem>
            <FormItem label="联系电话" prop="phone" >
                <Input v-model="form.phone" placeholder="联系电话"/>
            </FormItem>
            <FormItem label="部门主管" prop="leader" >
                <Input v-model="form.leader" placeholder="部门主管"/>
            </FormItem>
            <FormItem label="所属单位" prop="unitId" >
                <unit-selector v-model="form.unitId"/>
            </FormItem>
            <FormItem label="备注" >
                <Input v-model="form.info" placeholder="备注"/>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" html-type="submit">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import unitSelector from "components/unit-selector";
import { closeCurrentErrPage } from "@/constants/constant";
import { addOrUpdateDepart } from "@/actions/depart";
export default {
  name: "base-dep-add",
  components: {
    unitSelector
  },
  data() {
    return {
      loading: false,
      form: {
        name: "",
        code: "",
        phone: "",
        leader: "",
        unitId: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入部门编号",
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
        leader: [
          {
            required: true,
            message: "请输入部门主管",
            trigger: "blur"
          }
        ],
        unitId: [
          {
            required: true,
            message: "请选择所属单位",
            trigger: "change"
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
          addOrUpdateDepart(formData).then(
            res => {
              this.loading = false;
              this.$lf.message("保存成功", "success");
              closeCurrentErrPage(this, "base_dep");
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
