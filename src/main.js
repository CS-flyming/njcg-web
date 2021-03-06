import Vue from "vue";
import iView from "iview";
import { router } from "./router/index";
import { appRouter } from "./router/router";
import store from "./store";
import App from "./app.vue";
import Util from "./libs/util";
import "@/locale";
import "iview/dist/styles/iview.css";
import VueI18n from "vue-i18n";
import { ApiUrl, downloadByForm } from "./constants/constant";
import Device from "./plugins/device";
import Alert from "./plugins/alert";
import Message from "./plugins/message";
import Confirm from "./plugins/confirm";
import Spin from "./plugins/spin";
import QueryFilter from "./plugins/query-filter";
import CheckPermission from "./plugins/check-permission";
import VueHtmlToPaper from "./libs/print";

const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: []
};

Vue.use(VueHtmlToPaper, options);
Vue.use(VueI18n);
Vue.use(iView);
Vue.use(Device);
Vue.use(Alert);
Vue.use(Confirm);
Vue.use(Message);
Vue.use(Spin);
// Vue.use(iviewArea);
Vue.use(QueryFilter);
Vue.use(CheckPermission);
let bus = new Vue();
Vue.prototype.bus = bus;
Vue.prototype.$util = Util;
Vue.prototype.$ApiUrl = ApiUrl;
Vue.prototype.$downloadByForm = downloadByForm;

new Vue({
  el: "#app",
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ""
  },
  mounted() {
    this.currentPageName = this.$route.name;
    //存储用户信息
    this.$store.commit("saveUserInfo");
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
    this.$store.commit("initCachepage");
    // 权限菜单过滤相关
    // this.$store.commit("updateMenulist");
    // iview-admin检查更新
    // util.checkUpdate(this);
  },
  created() {
    let tagsList = [];
    appRouter.map(item => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit("setTagsList", tagsList);
  }
});
