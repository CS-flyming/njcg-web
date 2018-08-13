<template>
  <Row>
      <Col span="8" style="padding-right:10px">
          <Select v-bind="$attrs"  @on-change="handleUnitChange" placeholder="请选择单位">
            <Option :value="item.id" v-for="item in unitData" :key="item.id">{{ item.realName||item.name }}</Option>
          </Select>
      </Col>
      <Col span="8">
         <Select v-bind="$attrs"  @on-change="handleDepartChange" placeholder="请选择部门" :disabled="unitDisable">
            <Option :value="item.id" v-for="item in departData" :key="item.id">{{ item.realName||item.name }}</Option>
          </Select>
      </Col>
      <Col span="8">
        <Select v-bind="$attrs" v-model="currentValue" @on-change="handleChange" placeholder="请选择人员" :disabled="departDisable">
          <Option value="">请选择</Option>
          <Option :value="item.id" v-for="item in data" :key="item.id">{{ item.realName||item.name }}</Option>
        </Select>
      </Col>
    </Row>
   
</template>

<script>
import { getUserSelect, getUnitSelect } from "@/actions/sys";
import { getDepartSelect } from "@/actions/depart";
export default {
  name: "user-lend-selector",
  props: {
    value: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      currentValue: this.value,
      unitId: "",
      departId: "",
      data: [],
      unitData: [],
      departData: []
    };
  },
  activated() {
    this.init();
  },
  computed: {
    unitDisable() {
      return !!!this.unitId;
    },
    departDisable() {
      return !!!this.departId;
    }
  },
  methods: {
    init() {
      getUnitSelect().then(res => {
        this.unitData = res.data;
      });
    },
    getUserSelect() {
      getUserSelect().then(res => {
        this.data = res.data;
      });
    },
    handleUnitChange(val) {
      this.unitId = val;
      getDepartSelect(val).then(res => {
        this.departData = res.data;
      });
    },
    handleDepartChange(val) {
      this.departId = val;
      getUserSelect({
        departId: val
      }).then(res => {
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

