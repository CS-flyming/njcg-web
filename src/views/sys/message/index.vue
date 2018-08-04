<style lang="less">
.news-item {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
}
.new-ft {
  display: flex;
  align-items: center;
  div {
    padding: 0 10px;
  }
}
</style>

<template>
    <div>
        <Card class="filter-wrap">
            <Form @submit.native.prevent="handleFilter" :model="filter" ref="filterForm" label-position="right" :label-width="120" >
                <FormItem label="消息主题">
                    <Input v-model="filter.name" clearable/>
                </FormItem>
                <FormItem class="submit">
                    <Button type="primary" html-type="submit">筛选</Button>
                </FormItem>
            </Form>
        </Card>
        <Collapse   accordion @on-change="readMsg">
            <Panel v-for="item in data" :key="item.id" :name="item.id+'_'+item.status">
                <span class="news-item">
                    <div>{{item.name}}</div>
                    <div class="new-ft">
                        <div class="send-name">{{item.sendName}}</div>
                        <div class="send-time">{{item.createTime}}</div>
                        <template v-if="item.status==1">
                            <Tag color="red">{{item.statusDesc}}</Tag>
                        </template>
                        <template v-else>
                            <Tag color="green">{{item.statusDesc}}</Tag>
                        </template>
                    </div>
                   
                </span>
                <p slot="content">{{item.info}}</p>
            </Panel>
        </Collapse>
        <pagination :total="total" :limit.sync="filter.limit" :offset.sync="filter.offset" @on-load="loadData"></pagination>
    </div>
</template>

<script>
import pagination from "components/pagination";
import { getNewsList, readMsg } from "@/actions/sys";
export default {
  name: "message",
  data() {
    return {
      loading: false,
      filter: {
        limit: 10,
        offset: 0,
        name: ""
      },
      activeName: "",
      data: [],
      total: 0
    };
  },
  methods: {
    readMsg(res) {
      if (res.length) {
        let arr = res[0].split("_");
        if (arr[1] == 1) {
          readMsg(arr[0]).then(res => {
            this.bus.$emit("toGetMsg");
            this.loadData();
          });
        }
      }
    },
    loadData() {
      this.loading = true;
      getNewsList(this.filter).then(res => {
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
