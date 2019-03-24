<template>
  <Card>
    <p slot="title">资料详情</p>
    <Form :model="infoform" ref="infoform" label-position="right" :label-width="120" :rules="rules">
      <FormItem label="项目名称">
        <span>{{infoform.name}}</span>
       </FormItem>
      <FormItem label="招标方式">
        <span>{{infoform.methondDesc}}</span>
       </FormItem>
      <FormItem label="投标单位">
           <span>{{infoform.bidDepart}}</span>
     </FormItem>
      <FormItem label="中标单位">
         <span>{{infoform.trueDepart}}</span>
        </FormItem>
      <FormItem label="备选单位">
        <span>{{infoform.selectDepart}}</span>
         </FormItem>
      <FormItem label="中标价格">
           <span>{{infoform.trueValue}}</span>
        </FormItem>
      <FormItem label="备注" >
           <span>{{infoform.trueInfo}}</span>
      </FormItem>

      <FormItem label="投标文件">
        <Row>
           <Col span="20">
            <Row>
              <Col v-for="item in infoform.tbwjs" :key="item.id" span="6">
                <a :href="item.url" target="_blanks">{{item.name}}</a>
              </Col>
            </Row>
          </Col>
        </Row>
      </FormItem>
       <FormItem label="招标资料">
        <Row>
           <Col span="20">
            <Row>
              <Col v-for="item in infoform.zbzls" :key="item.id" span="6">
                <a :href="item.url" target="_blanks">{{item.name}}</a>
              </Col>
            </Row>
          </Col>
        </Row>
      </FormItem>
       <FormItem label="参考文本">
        <Row>
           <Col span="20">
            <Row>
              <Col v-for="item in infoform.ckwbs" :key="item.id" span="6">
                <a :href="item.url" target="_blanks">{{item.name}}</a>
              </Col>
            </Row>
          </Col>
        </Row>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </Card>
</template>

<script>
import { getBidInfo } from "@/actions/bid";
export default {
  name: "base-bid-detail",
  data() {
    return {
      spinShow: false,
      infoform: {
        id: "",
        name: "",
        methodDesc: "",
        bidDepart: "",
        trueDepart: "",
        selectDepart: "",
        trueInfo: "",
        trueValue: "",
        tbwjs: [],
        zbzls: [],
        ckwbs: []
      }
    };
  },
  activated() {
    let { id } = this.$route.params;
    this.spinShow = true;
    getBidInfo(id).then(
      res => {
        this.spinShow = false;
        this.infoform = res.data;
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
