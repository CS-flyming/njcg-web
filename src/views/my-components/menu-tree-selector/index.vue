<template>
    <Tree :data="data" @on-check-change="handleCheck" show-checkbox></Tree>   
</template>

<script>
import { getSysMenus } from "@/actions/sys";
export default {
  name: "menu-tree-selector",
  props: {
    menuIds: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      data: []
    };
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      let { menuIds } = this;
      getSysMenus().then(({ data }) => {
        this.data = data.map(v => {
          v.title = v.name;
          v.expand = true;
          v.nodes.map(v2 => {
            if (menuIds.includes(v2.id)) {
              v2.checked = true;
            }
            v2.title = v2.name;
          });
          v.children = v.nodes;
          return v;
        });
      });
    },
    handleCheck(arr) {
      let menuIds = arr.map(v => {
        if (!v.children) {
          return v.id;
        }
      });
      this.$emit("input", menuIds);
    }
  },
  watch: {
    menuIds(val) {
      this.init();
    }
  }
};
</script>

<style>
</style>
