<template>
    <Card>
        <p slot="title">
            详情
        </p>
        <Table border ref="selection" :columns="columns2" :data="selectOrder" size="large" ></Table>
     <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
</template>

<script>
import { getOrderDetail } from "@/actions/verify";
export default {
  name: "base-order-detail",
  data() {
    return {
      spinShow: false,
      columns2: [
        {
          title: "商品名称",
          render: (h, params) => {
            return h("div", params.row.product.name || "--");
          }
        },
        {
          title: "规格",
          render: (h, params) => {
            return h("div", params.row.product.standard || "--");
          }
        },
        {
          title: "型号",
          render: (h, params) => {
            return h("div", params.row.product.model || "--");
          }
        },
        {
          title: "价格",
          render: (h, params) => {
            return h("div", params.row.product.value || "--");
          }
        },
        {
          title: "采购数量",
          key: "num",
          align: "center"
        },
        {
          title: "总价",
          key: "zj"
        },
        {
          title: "经费类型",
          key: "typeDesc",
          align: "center"
        }
      ],
      selectOrder: []
    };
  },
  activated() {
    let { id } = this.$route.params;
    this.spinShow = true;
    getOrderDetail(id).then(
      res => {
        this.spinShow = false;
        this.selectOrder = res.data;
      },
      () => {
        this.$router.goBack();
      }
    );
  }
};
</script>

<style>
</style>
