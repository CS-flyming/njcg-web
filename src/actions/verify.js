import $axios from "../constants/constant";

/**
 * 初审列表
 * @param {*} params
 */
export function getVerifyFirstList(params) {
  return $axios.post("/verify/list/first", params);
}

/**
 * 初审
 * @param {*} params
 */
export function verifyFirstItem(params) {
  return $axios.post("/verify/verify", params);
}

/**
 * 复审
 * @param {*} params
 */
export function getVerifySecondList(params) {
  return $axios.post("/verify/list/second", params);
}

/**
 * 完成
 * @param {*} params
 */
export function getVerifyFinishList(params) {
  return $axios.post("/verify/list/finish", params);
}

/**
 * 拒绝
 * @param {*} params
 */
export function getVerifyRefuseList(params) {
  return $axios.post("/verify/list/refuse", params);
}



export function getOrderDetail(id) {
  return $axios.post(`/order/find/${id}`);
}

export function getVerifyReturnList(params) {
  return $axios.post("verify/list/return", params);
}

export function verifyReturnAction(params) {
  return $axios.post("/verify/return", params);
}

export function verifyOutAction(id) {
  return $axios.post(`/verify/out/${id}`);
}

export function getPrintOrderData(id) {
  return $axios.post(`/data/order/${id}`);
}
export function getAllVerify(params) {
  return $axios.post("verify/list/verify/finish", params);
}

/**
 * 退货审核
 * @param {*} params
 */
export function getStockReturnList(params) {
  return $axios.post("/verify/list/return", params);
}

export function getStockReturnSecond(params) {
  return $axios.post("/verify/list/return/second", params);
}

export function getStockReturnFinish(params) {
  return $axios.post("/verify/list/return/finish", params);
}


/**
 * 完成
 * @param {*} params
 */
export function getjjcgList(params) {
  return $axios.post("/verify/list/jjcg", params);
}


/**
 * 完成
 * @param {*} params
 */
export function getNonormalList(params) {
  return $axios.post("/verify/list/nonormal", params);
}
