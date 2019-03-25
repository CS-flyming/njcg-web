import Main from "@/views/Main.vue";

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: "/login",
  name: "login",
  meta: {
    title: "Login - 登录"
  },
  component: () => import("@/views/login.vue")
};

export const page404 = {
  path: "/*",
  name: "error-404",
  meta: {
    title: "404-页面不存在"
  },
  component: () => import("@/views/error-page/404.vue")
};

export const page403 = {
  path: "/403",
  meta: {
    title: "403-权限不足"
  },
  name: "error-403",
  component: () => import("@/views/error-page/403.vue")
};

export const page500 = {
  path: "/500",
  meta: {
    title: "500-服务端错误"
  },
  name: "error-500",
  component: () => import("@/views/error-page/500.vue")
};

export const preview = {
  path: "/preview",
  name: "preview",
  component: () => import("@/views/error-page/500.vue")
};

export const locking = {
  path: "/locking",
  name: "locking",
  component: () =>
    import("@/views/main-components/lockscreen/components/locking-page.vue")
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: "/",
  name: "otherRouter",
  redirect: "/home",
  component: Main,
  children: [
    {
      path: "home",
      title: "首页",
      name: "home_index",
      meta: { access: 1 },
      component: () => import("@/views/home/home.vue")
    },
    {
      path: "message",
      title: "消息",
      name: "message",
      component: () => import("@/views/sys/message/index.vue")
    },
    {
      path: "account/password",
      title: "修改密码",
      name: "account-password",
      meta: { access: 1 },
      component: () => import("@/views/account/password.vue")
    },
    {
      path: "sys/manager/add",
      title: "新增用户",
      name: "sys-manager-add",
      component: () => import("@/views/sys/manager/add.vue")
    },
    {
      path: "sys/manager/:id/edit",
      title: "编辑操作员",
      name: "sys-manager-edit",
      component: () => import("@/views/sys/manager/edit.vue")
    },
    {
      path: "base/base_dep/add",
      title: "新增部门",
      name: "base-dep-add",
      component: () => import("@/views/sys/depart/add.vue")
    },
    {
      path: "base/base_dep/:id/edit",
      title: "编辑部门",
      name: "base-dep-edit",
      component: () => import("@/views/sys/depart/edit.vue")
    },
    {
      path: "base/base_unit/add",
      title: "新增单位",
      name: "base-unit-add",
      component: () => import("@/views/sys/unit/add.vue")
    },
    {
      path: "base/base_unit/:id/edit",
      title: "编辑单位",
      name: "base-unit-edit",
      component: () => import("@/views/sys/unit/edit.vue")
    },
    {
      path: "base/base_role/add",
      title: "新增角色",
      name: "base-role-add",
      component: () => import("@/views/sys/role/add.vue")
    },
    {
      path: "base/base_role/:id/edit",
      title: "编辑角色",
      name: "base-role-edit",
      component: () => import("@/views/sys/role/edit.vue")
    },
    {
      path: "product/add/add",
      title: "新增商品",
      name: "product-add-add",
      component: () => import("@/views/product/add.vue")
    },
    {
      path: "product/add/:id/edit",
      title: "编辑商品",
      name: "product-add-edit",
      component: () => import("@/views/product/edit.vue")
    },
    {
      path: "product/add/:id/detail",
      title: "商品详情",
      name: "product-add-detail",
      component: () => import("@/views/product/detail.vue")
    },
    {
      path: "product/type/add",
      title: "新增分类",
      name: "product-type-add",
      component: () => import("@/views/product/types/add.vue")
    },
    {
      path: "keep_apply/:id/edit",
      title: "编辑维修单",
      name: "keep-apply-edit",
      component: () => import("@/views/sys/keep/edit.vue")
    },
    {
      path: "product/company/add",
      title: "新增供应商",
      name: "product-company-add",
      component: () => import("@/views/product/company/add.vue")
    },
    {
      path: "product/company/:id/edit",
      title: "编辑供应商",
      name: "product-company-edit",
      component: () => import("@/views/product/company/edit.vue")
    },
    {
      path: "assets/:id/detail",
      title: "资产详情",
      name: "assets-detail",
      component: () => import("@/views/sys/assets/detail.vue")
    },
    {
      path: "check/add",
      title: "新增异常记录",
      name: "check-add",
      component: () => import("@/views/sys/keep/check_add.vue")
    },
    {
      path: "keep/:id/detail",
      title: "维修单详情",
      name: "keep-detail",
      component: () => import("@/views/sys/keep/keep_detail.vue")
    },
    {
      path: "check/:id/edit",
      title: "巡检编辑",
      name: "check-detail-edit",
      component: () => import("@/views/sys/keep/check_detail_edit.vue")
    },
    {
      path: "check/:id/detail",
      title: "巡检详情",
      name: "check-detail",
      component: () => import("@/views/sys/keep/check_detail.vue")
    },
    {
      path: "order/:id/detail",
      title: "订单详情",
      name: "base-order-detail",
      component: () => import("@/views/order/detail.vue")
    },
    {
      path: "bid/:id/detail",
      title: "资料详情",
      name: "base-bid-detail",
      component: () => import("@/views/bid/detail.vue")
    },
    {
      path: "plan/add",
      title: "新增计划",
      name: "plan-add",
      component: () => import("@/views/plan/add.vue")
    }
  ]
}; // }, //   component: () => import("@/views/plan/detail.vue") //   name: "plan-detail", //   title: "计划详情", //   path: "plan/:id/detail", // {

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: "/base",
    icon: "ios-gear",
    name: "base",
    title: "系统管理",
    component: Main,
    children: [
      {
        path: "base_user",
        title: "用户管理",
        name: "base_user",
        component: () => import("@/views/sys/manager/index.vue")
      },
      {
        path: "base_dep",
        title: "部门管理",
        name: "base_dep",
        component: () => import("@/views/sys/depart/index.vue")
      },
      {
        path: "base_unit",
        title: "单位管理",
        name: "base_unit",
        component: () => import("@/views/sys/unit/index.vue")
      },
      {
        path: "base_role",
        title: "角色管理",
        name: "base_role",
        component: () => import("@/views/sys/role/index.vue")
      }
    ]
  },
  {
    path: "/verify",
    name: "verify",
    title: "审核管理",
    component: Main,
    children: [
      {
        path: "first",
        title: "初审",
        name: "verify_first",
        component: () => import("@/views/verify/index.vue")
      },
      {
        path: "second",
        title: "复审",
        name: "verify_second",
        component: () => import("@/views/verify/second.vue")
      },
    
      {
        path: "all",
        title: "已审核",
        name: "verify_all",
        component: () => import("@/views/verify/finishVerify.vue")
      },
      {
        path: "refuse",
        title: "驳回",
        name: "verify_refuse",
        component: () => import("@/views/verify/refuse.vue")
      },
      {
        path: "stock_return",
        title: "退货初审",
        name: "stock_return",
        component: () => import("@/views/verify/stock_return.vue")
      },
      {
        path: "stock_second",
        title: "退货复审",
        name: "stock_second",
        component: () => import("@/views/verify/stock_second.vue")
      },
      {
        path: "stock_finish",
        title: "退货已审核",
        name: "stock_finish",
        component: () => import("@/views/verify/stock_finish.vue")
      },
      {
        path: "verify",
        title: "配发审核",
        name: "issue_verify",
        component: () => import("@/views/issue/verify.vue")
      }
    ]
  },
  {
    path: "/stock",
    name: "stock",
    title: "库存管理",
    component: Main,
    children: [
      {
        path: "xh",
        title: "消耗信息",
        name: "stock_xh",
        component: () => import("@/views/stock/xh.vue")
      },
      {
        path: "info",
        title: "库存信息",
        name: "stock_info",
        component: () => import("@/views/stock/info.vue")
      },
      {
        path: "in",
        title: "入库信息",
        name: "stock_in",
        component: () => import("@/views/stock/in.vue")
      },
      {
        path: "out",
        title: "发付信息",
        name: "stock_out",
        component: () => import("@/views/stock/out.vue")
      },
      {
        path: "return",
        title: "退货信息",
        name: "stock_refund",
        component: () => import("@/views/stock/return.vue")
      },
      {
        path: "waste",
        title: "报废信息",
        name: "stock_waste",
        component: () => import("@/views/stock/lose.vue")
      },
      {
        path: "verify",
        title: "发付审核",
        name: "stock_verify",
        component: () => import("@/views/stock/verify.vue")
      }
    ]
  },
  {
    path: "/lend",
    name: "lend",
    title: "借出管理",
    component: Main,
    children: [
      {
        path: "his",
        title: "已借出",
        name: "lend_his",
        component: () => import("@/views/lend/his.vue")
      },
      {
        path: "my",
        title: "接受借出",
        name: "lend_my",
        component: () => import("@/views/lend/my.vue")
      },
      {
        path: "verify",
        title: "待审核",
        name: "lend_verify",
        component: () => import("@/views/lend/verify.vue")
      }
    ]
  },
  {
    path: "/order",
    name: "order",
    title: "订单管理",
    component: Main,
    children: [
      {
        path: "my",
        title: "我的订单",
        name: "order_my",
        component: () => import("@/views/order/my.vue")
      },
      {
        path: "in",
        title: "已入库",
        name: "order_finish",
        component: () => import("@/views/order/in.vue")
      },
      {
        path: "take",
        title: "待收货",
        name: "order_take",
        component: () => import("@/views/order/take.vue")
      },
      {
        path: "refuse",
        title: "驳回",
        name: "order_refuse",
        component: () => import("@/views/order/refuse.vue")
      }
    ]
  },
  {
    path: "/issue",
    name: "issue",
    title: "上级配发",
    component: Main,
    children: [
      {
        path: "apply",
        title: "物品上报",
        name: "issue_apply",
        component: () => import("@/views/issue/apply.vue")
      },
      {
        path: "finish",
        title: "已完成",
        name: "issue_finish",
        component: () => import("@/views/issue/finish.vue")
      },
      {
        path: "refuse",
        title: "驳回",
        name: "issue_refuse",
        component: () => import("@/views/issue/refuse.vue")
      }
    ]
  },
  {
    path: "/product",
    name: "product",
    title: "商品录入",
    component: Main,
    children: [
      {
        path: "add",
        title: "新增商品",
        name: "product_add",
        component: () => import("@/views/product/index.vue")
      },
      {
        path: "types",
        title: "分类建立",
        name: "product_type",
        component: () => import("@/views/product/types/index.vue")
      },
      {
        path: "company",
        title: "供应商管理",
        name: "product_company",
        component: () => import("@/views/product/company/index.vue")
      }
    ]
  },
  {
    path: "/plan",
    name: "plan",
    title: "需求计划 ",
    component: Main,
    children: [
      {
        path: "list",
        title: "需求计划",
        name: "plan_list",
        component: () => import("@/views/plan/list.vue")
      },
      {
        path: "finish",
        title: "月采购计划",
        name: "verify_finish",
        component: () => import("@/views/verify/finish.vue")
      },
      {
        path: "jjcg",
        title: "紧急采购",
        name: "plan_jjcg",
        component: () => import("@/views/plan/jjcg.vue")
      },
      {
        path: "nonormal",
        title: "非标准件采购",
        name: "plan_nonormal",
        component: () => import("@/views/plan/nonormal.vue")
      },
    ]
  },
  {
    path: "/bid",
    name: "bid",
    title: "招投标受理 ",
    component: Main,
    children: [
      {
        path: "my",
        title: "我的",
        name: "bid_my",
        component: () => import("@/views/bid/my.vue")
      },
      {
        path: "first",
        title: "初审",
        name: "bid_first",
        component: () => import("@/views/bid/first.vue")
      },
      {
        path: "second",
        title: "受理",
        name: "bid_second",
        component: () => import("@/views/bid/second.vue")
      },
      {
        path: "finish",
        title: "已受理",
        name: "bid_finish",
        component: () => import("@/views/bid/finish.vue")
      },
      {
        path: "myfinish",
        title: "已完成",
        name: "bid_myfinish",
        component: () => import("@/views/bid/myfinish.vue")
      }
    ]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  preview,
  locking,
  ...appRouter,
  page500,
  page403,
  page404
];
