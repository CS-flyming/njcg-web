<template>
    <RadioGroup v-model="currentValue" @on-change="handleChange">
        <Radio  :label="item.id" v-for="item in data" :key="item.id">{{ item.name }}</Radio>
    </RadioGroup>
</template>

<script>
import { getRoleSelect } from "@/actions/sys";
export default {
  name: "manager-role-selector",
  props: {
    value: {
      type: String
    },
    name: "",
    disabled: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  data() {
    return {
      currentValue: this.value,
      data: []
    };
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      getRoleSelect().then(res => {
        this.data = res.data;
      });
    },
    handleChange(val) {
      this.$emit("input", val);
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    }
  }
};
</script>
