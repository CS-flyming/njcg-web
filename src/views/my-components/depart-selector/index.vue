<template>
    <Select ref="select" v-bind="$attrs" v-model="currentValue"  clearable filterable  :loading="loading" @on-change="handleChange" placeholder="部门单位">
        <Option :value="item.value" v-for="item in data" :key="item.value">{{ item.label }}</Option>
    </Select>
</template>
<script>
import { getDepartSelect } from "@/actions/depart";
export default {
  name: "depart-selector",
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    unitId: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      currentValue: this.value,
      data: []
    };
  },
  methods: {
    search(query) {
      this.loading = true;
      getDepartSelect(this.unitId).then(res => {
        this.loading = false;
        this.data = res.data.map(
          item => {
            return {
              value: item.id,
              label: item.name
            };
          },
          err => {
            this.loading = false;
          }
        );
      });
    },
    handleChange(val) {
      this.$emit("input", val);
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    unitId(val) {
      this.search();
    }
  }
};
</script>