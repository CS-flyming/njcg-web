<style lang="less">
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="单位名称">
                    <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <div class="data-control">
            <Button type="primary" @click="$router.push({ name: 'base-unit-add' })">新增单位</Button>
             <Button type="primary" @click="$downloadByForm('/export/unit',filter)">导出</Button>
        </div>
        <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
    </div>
</template>

<script>
import pagination from "components/pagination";
import { getUnitList } from "@/actions/unit";
export default {
  name: "base_unit",
  data() {
    return {
      loading: false,
      columns: [
        {
          key: "name",
          title: "单位名称"
        },
        {
          key: "code",
          title: "单位编号"
        },
        {
          key: "info",
          title: "备注",
          render: (h, params) => {
            return h("span", params.row.info || "--");
          }
        },
        {
          type: "action",
          title: "操作",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "base-unit-edit",
                        params: {
                          id: params.row.id
                        },
                        query: {
                          item: JSON.stringify(params.row)
                        }
                      });
                    }
                  }
                },
                "编辑"
              )
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "text",
              //       size: "small"
              //     },
              //     on: {
              //       click: () => {
              //         this.$lf.confirm("是否确认删除该部门？", () => {
              //           deleteRoleById(params.row.id).then(res => {
              //             this.$lf.message("删除成功", "success");
              //             this.loadData();
              //           });
              //         });
              //       }
              //     }
              //   },
              //   "删除"
              // )
            ]);
          }
        }
      ],
      filter: {
        limit: 10,
        offset: 0,
        name: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getUnitList(this.filter).then(res => {
        this.loading = false;
        this.data = res.data.rows;
        this.total = res.data.total;
      });
    },
    handleFilter() {
      this.filter.offset = 0;
      this.loadData();
    }
  },
  components: {
    pagination
  }
};
</script>
