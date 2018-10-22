<template>
    <div>
        <div class="demo-upload-list" v-for="item in uploadList" :key="item.url">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="uploadConfig.maxSize"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="uploadConfig.serviceUrl"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="image" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="图片预览" v-model="visible">
            <img :src="ApiUrl+'/file/download/'+imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
import { uploadConfig, ApiUrl } from "@/constants/constant";
export default {
  name: "image-upload",
  props: {
    limit: {
      type: [String, Number],
      default: 5
    },
    value: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      defaultList: [],
      imgName: "",
      ApiUrl,
      uploadConfig,
      visible: false,
      uploadList: []
    };
  },
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.handleChange();
    },
    handleSuccess(res, file) {
      file.url = `${ApiUrl}/file/download/${res.data}?type=small`;
      file.name = res.data;
      this.handleChange();
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "图片格式不正确",
        desc: "图片格式 " + file.name + " 不正确, 请选择 jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件太大",
        desc: "文件  " + file.name + " 太大, 不要超过2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < this.limit;
      if (!check) {
        this.$Notice.warning({
          title: "上传限制" + this.limit + "张"
        });
      }
      return check;
    },
    handleChange() {
      let idArr = [];
      this.uploadList.map(v => {
        idArr.push(v.name);
      });
      this.$emit("input", idArr);
    },
   clearFileList() {
      const fileList = this.$refs.upload.fileList;
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index];
        this.$refs.upload.fileList.splice(fileList.indexOf(element), 1);
        this.handleChange();
      }
    }
  },
  created() {
    this.defaultList = this.value;
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  }
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>