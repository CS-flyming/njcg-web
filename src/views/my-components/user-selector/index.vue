<template>
    <Select v-bind="$attrs" v-model="currentValue" @on-change="handleChange">
        <Option value="">请选择</Option>
        <Option :value="item.id" v-for="item in data" :key="item.id">{{ item.realName||item.name }}</Option>
    </Select>
</template>

<script>
import { getUserSelect } from "@/actions/sys";
export default {
  name: "user-selector",
  props: {
    value: {
      type: [String, Number],
      default: ""
    }
  },
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
      getUserSelect().then(res => {
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

