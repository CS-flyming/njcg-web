
<template>
    <Card>
        <p slot="title">
            新增角色
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
            <FormItem label="角色名称" prop="name" >
                <Input v-model="form.name" placeholder="角色名称"  />
            </FormItem>
            <FormItem label="角色菜单" prop="menuIds" >
                <menuTreeSelector v-model="form.menuIds"/>
            </FormItem>
           
            <FormItem>
                <Button type="primary" :loading="loading" html-type="submit">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { closeCurrentErrPage } from "@/constants/constant";
import { addOrUpdateRole } from "@/actions/sys";
import menuTreeSelector from "components/menu-tree-selector";
export default {
  name: "base-role-add",
  components: {
    menuTreeSelector
  },
  data() {
    return {
      loading: false,
      form: {
        name: "",
        menuIds: []
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入单位名称",
            trigger: "blur"
          }
        ],
        menuIds: [
          {
            required: true,
            type: "array",
            message: "请选择角色菜单",
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
          addOrUpdateRole(formData).then(
            res => {
              this.loading = false;
              this.$lf.message("保存成功", "success");
              closeCurrentErrPage(this, "base_role");
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
