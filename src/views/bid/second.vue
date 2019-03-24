<style lang="less">
</style>

<template>
  <div>
    <Card class="filter-wrap">
      <Form
        @submit.native.prevent="handleFilter"
        :model="filter"
        ref="filterForm"
        label-position="right"
        :label-width="120"
      >
        <FormItem label="项目名称">
          <Input v-model="filter.name" style="width:100%;"/>
        </FormItem>
        <FormItem label="经费类型">
          <Select v-model="filter.type" clearable>
            <Option value="5">装备经费</Option>
            <Option value="6">后勤经费</Option>
          </Select>
        </FormItem>
        <FormItem label="招标方式">
          <Select v-model="filter.method" clearable>
            <Option value="1">询价</Option>
            <Option value="2">邀请招标</Option>
            <Option value="3">公开招标</Option>
            <Option value="4">单一来源</Option>
            <Option value="5">竞争性谈判</Option>
          </Select>
        </FormItem>
        <FormItem label="起止时间">
          <dateRgSelector
            style="width:100%;"
            v-model="filter._dateRange"
            :start-date.sync="filter.startTime"
            :end-date.sync="filter.endTime"
            clearable
          />
        </FormItem>
        <FormItem label="需求部门">
          <departCalSelector v-model="filter._departId" :departId.sync="filter.departId" clearable/>
        </FormItem>
        <FormItem class="submit">
          <Button type="primary" html-type="submit">筛选</Button>
        </FormItem>
      </Form>
    </Card>

    <Table :loading="loading" border stripe :columns="columns" :data="data"></Table>
    <pagination
      :total="total"
      :limit.sync="filter.limit"
      :offset.sync="filter.offset"
      @on-load="loadData"
    ></pagination>
    <Modal v-model="showVerifyModal" title="复审" @on-cancel="handleCacelModal">
      <Form
        :model="verifyForm"
        ref="verifyForm"
        label-position="right"
        :label-width="120"
        :rules="rules"
      >
        <FormItem label="审核状态" prop="status">
          <RadioGroup v-model="verifyForm.status">
            <Radio label="1">通过</Radio>
            <Radio label="2">拒绝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="拒绝原因" v-if="verifyForm.status=='3'" prop="reason">
          <Input v-model="verifyForm.reason" placeholder="拒绝原因"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleVerifyFirst" :loading="modalLoading">初审</Button>
      </div>
    </Modal>

    <Modal v-model="showModal" title="资料录入" @on-cancel="handleModal">
      <Form
        :model="infoform"
        ref="infoform"
        label-position="right"
        :label-width="120"
        :rules="rules"
      >
         <FormItem label="项目名称" prop="name" >
                <Input v-model="infoform.name" placeholder="项目名称"  />
            </FormItem>
             <FormItem label="招标方式" prop="methodDesc" >
                <Input v-model="infoform.methodDesc" placeholder="招标方式"  />
            </FormItem>
         <FormItem label="投标单位" prop="bidDepart" >
                <Input v-model="infoform.bidDepart" placeholder="投标单位"  />
            </FormItem>
            <FormItem label="中标单位" prop="trueDepart" >
                <Input v-model="infoform.trueDepart" placeholder="中标单位"/>
            </FormItem>
            <FormItem label="备选单位"  prop="selectDepart">
                <Input v-model="infoform.selectDepart" placeholder="备选单位"/>
            </FormItem>
            <FormItem label="中标价格" prop="trueValue" >
                <Input v-model="infoform.trueValue" placeholder="中标价格"  />
            </FormItem>
             <FormItem label="备注" prop="trueInfo" >
                <Input v-model="infoform.trueInfo" placeholder="备注"  />
            </FormItem>
      
             <FormItem label="投标文件">
              <Upload ref='upload' multiple :action="uploadConfig.serviceUrl" :on-success="uploadSuccess" :before-upload="beforeUpload" :on-remove="handleRemove">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传附件</Button>
              </Upload>
            </FormItem>
             <FormItem label="招标资料">
              <Upload ref='upload' multiple :action="uploadConfig.serviceUrl" :on-success="uploadSuccess1" :before-upload="beforeUpload" :on-remove="handleRemove1">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传附件</Button>
              </Upload>
            </FormItem>
             <FormItem label="参考文本">
              <Upload ref='upload' multiple :action="uploadConfig.serviceUrl" :on-success="uploadSuccess2" :before-upload="beforeUpload" :on-remove="handleRemove2">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传附件</Button>
              </Upload>
            </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addInfo">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import pagination from "components/pagination";
import dateRgSelector from "components/date-rg-selector";
import { getBidSecondList, verifyBid,addBidInfo} from "@/actions/bid";
import { uploadConfig, ApiUrl } from "@/constants/constant";
import departCalSelector from "components/depart-cal-selector";
export default {
  name: "bid_second",
  data() {
    return {
       uploadConfig: {
        accept: "",
        headers: uploadConfig.headers,
        name: "file",
        serviceUrl: `${ApiUrl}/file/upload`
      },
      loading: false,
      modalLoading: false,
      verifyForm: {
        id: "",
        status: "1",
        reason: ""
      },
       infoform: {
        id: "",
        name:"",
        methodDesc:"",
        bidDepart: "",
        trueDepart: "",
        selectDepart:"",
        trueInfo:"",
        trueValue:"",
        tbwj:[],
        zbzl:[],
        ckwb:[]
      },
      showVerifyModal: false,
      showModal: false,
      rules: {
        reason: [
          {
            required: true,
            message: "请输入拒绝原因",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择审核状态",
            trigger: "change"
          }
        ]
      },
      columns: [
        {
          title: "项目名称",
          key: "name",
          align: "center"
        },
        {
          title: "项目需求",
          key: "xmxq",
          align: "center"
        },
        {
          title: "招标方式",
          key: "methodDesc",
          align: "center"
        },
        {
          title: "经费类型",
          key: "typeDesc",
          align: "center"
        },
        {
          title: "经费预算",
          key: "planMoney",
          align: "center"
        },
        {
          title: "需求部门",

          key: "departName",
          align: "center"
        },
        {
          title: "开始时间",
          key: "startTime",
          align: "center"
        },
        {
          title: "结束时间",
          key: "endTime",
          align: "center"
        },

        {
          title: "状态",
          key: "statusDesc",
          align: "center"
        },
        {
          title: "备注",
          key: "info",
          align: "center"
        },
        {
          type: "action",
          title: "操作",
          width:250,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  on: {
                    click: () => {
                      this.verifyForm.id = params.row.id;
                      this.showVerifyModal = true;
                    }
                  },
                  style: { margin: "0 5px" },
                  props: {
                    type: "primary"
                  }
                },
                "复审"
              ),
              h(
                "Button",
                {
                  on: {
                    click: () => {
                      this.infoform.id = params.row.id;
                      this.infoform.name = params.row.name;
                      this.infoform.methodDesc = params.row.methodDesc;
                      this.showModal = true;
                    }
                  },
                  props: {
                    type: "primary"
                  }
                },
                "资料录入"
              ),
                h(
                "Button",
                {
                  props: {
                    type: "info"
                  },
                   style: { margin: "0 5px" },
                  on: {
                    click: () => {
                      // this.showDetailModal(params.row.id);
                      this.$router.push({
                        name: "base-bid-detail",
                        params: {
                          id: params.row.id
                        }
                      });
                    }
                  }
                },
                "详情"
              ),
            ]);
          }
        }
      ],
      filter: {
        limit: 10,
        offset: 0,
        name: "",
        method: "",
        type: "",
        _dateRange: ["", ""],
        startTime: "",
        endTime: "",
        _departId: [],
        departId: ""
      },
      data: [],
      total: 0
    };
  },
  methods: {
    beforeUpload() {
      // this.$refs.upload.clearFiles();
    },
    handleRemove(file, fileList) {
      let arr = this.infoform.tbwj;
      arr = arr.filter(v => {
        return v != file.response.data;
      });
      this.infoform.tbwj = arr;
    },
     handleRemove1(file, fileList) {
      let arr = this.infoform.zbzl;
      arr = arr.filter(v => {
        return v != file.response.data;
      });
      this.infoform.zbzl = arr;
    },
     handleRemove2(file, fileList) {
      let arr = this.infoform.ckwb;
      arr = arr.filter(v => {
        return v != file.response.data;
      });
      this.infoform.ckwb = arr;
    },
    uploadSuccess(res, file) {
      let arr = this.infoform.tbwj
      arr.push(res.data);
      this.infoform.tbwj = arr;
    },
    handleRemove1(file, fileList) {
      let arr = this.infoform.zbzl;
      arr = arr.filter(v => {
        return v != file.response.data;
      });
      this.infoform.zbzl = arr;
    },
    uploadSuccess1(res, file) {
      let arr = this.infoform.zbzl
      arr.push(res.data);
      this.infoform.zbzl = arr;
    },
    handleRemove2(file, fileList) {
      let arr = this.infoform.ckwb;
      arr = arr.filter(v => {
        return v != file.response.data;
      });
      this.infoform.ckwb = arr;
    },
    uploadSuccess2(res, file) {
      let arr = this.infoform.ckwb
      arr.push(res.data);
      this.infoform.ckwb = arr;
    },

      addInfo() {
      addBidInfo(this.infoform).then(
        res => {
          this.loading = false;
          this.$Message.success("提交成功");
          this.handleModal();       
          this.loadData();
        },
        () => {}
      );
    },
    loadData() {
      this.loading = true;
      getBidSecondList(this.filter).then(res => {
        this.loading = false;
        this.data = res.data.rows;
        this.total = res.data.total;
      });
    },
    handleFilter() {
      this.filter.offset = 0;
      this.loadData();
    },
    resetVerifyForm() {
      this.verifyForm = {
        id: "",
        status: "1",
        reason: ""
      };
    },
   resetForm() {
      this.infoform={
        id: "",
        name:"",
        methodDesc:"",
        bidDepart: "",
        trueDepart: "",
        selectDepart:"",
        trueInfo:"",
        trueValue:"",
        tbwj:[],
        zbzl:[],
        ckwb:[]
      };
      this.$refs.infoform.resetFields();
    },
    handleCacelModal() {
      this.showVerifyModal = false;
      this.resetVerifyForm();
    },
   handleModal() {
      this.showModal = false;
      this.resetForm();
    },

    handleVerifyFirst() {
      this.$refs["verifyForm"].validate(valid => {
        if (valid) {
          this.modalLoading = true;
          verifyBid(this.infoform).then(
            res => {
              this.modalLoading = false;
              this.handleCacelModal();
              this.loadData();
            },
            () => {
              this.modalLoading = false;
            }
          );
        }
      });
    }
  },
  components: {
    pagination,
    dateRgSelector,
    departCalSelector
  }
};
</script>
