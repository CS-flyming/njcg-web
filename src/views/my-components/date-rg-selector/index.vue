<template>
    <DatePicker v-bind="$attrs" type="daterange" :options="options" format="yyyy-MM-dd" placeholder="请选择.." v-model="currentValue"></DatePicker>
</template>

<script>
import moment from "moment-mini";
export default {
  name: "date-rg-selector",
  props: {
    value: {
      type: Array,
      default: function() {
        return ["", ""];
      }
    },
    startDate: "",
    endDate: ""
  },
  data() {
    return {
      currentValue: this.value,
      data: [],
      options: {
        shortcuts: [
          {
            text: "今天",
            value() {
              return [
                moment().format("YYYY-MM-DD"),
                moment().format("YYYY-MM-DD")
              ];
            }
          },
          {
            text: "昨天",
            value() {
              return [
                moment()
                  .subtract(1, "day")
                  .format("YYYY-MM-DD"),
                moment()
                  .subtract(1, "day")
                  .format("YYYY-MM-DD")
              ];
            }
          },
          {
            text: "近7天",
            value() {
              return [
                moment()
                  .subtract(7, "day")
                  .format("YYYY-MM-DD"),
                moment().format("YYYY-MM-DD")
              ];
            }
          },
          {
            text: "本周",
            value() {
              return [
                moment()
                  .weekday(1)
                  .format("YYYY-MM-DD"),
                moment()
                  .weekday(7)
                  .format("YYYY-MM-DD")
              ];
            }
          },
          {
            text: "上周",
            value() {
              return [
                moment()
                  .weekday(-6)
                  .format("YYYY-MM-DD"),
                moment()
                  .weekday(0)
                  .format("YYYY-MM-DD")
              ];
            }
          },
          {
            text: "本月",
            value() {
              return [
                moment()
                  .startOf("month")
                  .format("YYYY-MM-DD"),
                moment()
                  .endOf("month")
                  .format("YYYY-MM-DD")
              ];
            }
          },
          {
            text: "上个月",
            value() {
              return [
                moment()
                  .subtract(1, "month")
                  .startOf("month")
                  .format("YYYY-MM-DD"),
                moment()
                  .subtract(1, "month")
                  .endOf("month")
                  .format("YYYY-MM-DD")
              ];
            }
          }
        ]
      }
    };
  },
  activated() {},
  watch: {
    currentValue(val, oldVal) {
      if (val !== oldVal) {
        this.$emit("input", val);
        this.$emit("update:startDate", val[0]);
        this.$emit("update:endDate", val[1]);
      }
    },
    value(val) {
      this.currentValue = val;
    }
  }
};
</script>
