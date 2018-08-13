<template>
    <Cascader :data="unitData" :load-data="loadData" @on-change="handleChange"></Cascader>
</template>
<script>
import { getDepartSelect } from "@/actions/depart";
import { getUnitSelect } from "@/actions/sys";

export default {
  name: "depart-cal-selector",
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    departId: ""
  },
  data() {
    return {
      currentValue: this.value,
      unitData: []
      //   {
      //      value: 'beijing',
      //      label: '北京',
      //      children: [],
      //      loading: false
      //   },
    };
  },
  created() {
    getUnitSelect().then(res => {
      this.unitData = res.data.map(v => {
        v.value = v.id;
        v.label = v.name;
        v.children = [];
        v.loading = false;
        return v;
      });
    });
  },
  methods: {
    loadData(item, callback) {
      item.loading = true;
      getDepartSelect(item.value).then(res => {
        item.children = res.data.map(v => {
          v.value = v.id;
          v.label = v.name;
          return v;
        });
        item.loading = false;
        callback();
      });
    },
    handleChange(val) {
      this.$emit("input", val);
      this.$emit("update:departId", val[1]);
    }
  }
};
</script>