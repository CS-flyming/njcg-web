<template>
    <Cascader  v-bind="$attrs" :data="data" v-model="currentValue" :load-data="loadData"></Cascader>
</template>

<script>
import { getProductTypesSelect } from "@/actions/sys";
export default {
  name: "product-types-selector",
  props: {
    value: {
      type: Array,
      default: []
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
      getProductTypesSelect().then(res => {
        this.data = res.data.map(v => {
          v.value = v.id;
          v.label = v.name;
          if (v.nodes) {
            v.children = [];
            v.loading = false;
          }
          return v;
        });
      });
    },
    loadData(item, callback) {
      item.loading = true;
      getProductTypesSelect(item.id).then(res => {
        let child = res.data.map(v => {
          v.value = v.id;
          v.label = v.name;
          if (v.nodes) {
            v.children = [];
            v.loading = false;
          }
          return v;
        });
        item.children = child;
        item.loading = false;
        callback();
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

