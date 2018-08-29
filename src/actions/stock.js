import $axios from "../constants/constant";

/**
 * 库存信息列表
 * @param {*} params
 */
export function getStockInfoList(params) {
  return $axios.post("/stock/list", params);
}

/**
 * 出库
 * @param {*} params
 */
export function stockOutAction(params) {
  return $axios.post("/stock/out", params);
}

/**
 * 报废物品
 * @param {*} params
 */
export function stockWasteAction(params) {
  return $axios.post("/stock/waste", params);
}

/**
 * 入库记录
 * @param {*} params
 */
export function getStockInList(params) {
  return $axios.post("/stock/list/in", params);
}

/**
 * 出库记录
 * @param {*} params
 */
export function getStockOutList(params) {
  return $axios.post("/stock/list/out", params);
}

/**
 * 退货记录
 * @param {*} params
 */
export function getStockReturnList(params) {
  return $axios.post("/stock/list/return", params);
}

/**
 * 报废记录
 * @param {*} params
 */
export function getStockLoseList(params) {
  return $axios.post("/stock/list/lose", params);
}

/**
 * 报废记录
 * @param {*} params
 */
export function getStockXhList(params) {
  return $axios.post("/stock/list/xh", params);
}

/**
 * 出库审核记录
 * @param {*} params
 */
export function getStockOutVerifyList(params) {
  return $axios.post("/stock/list/out/verify", params);
}

export function stockReturnAction(id) {
  return $axios.post(`/stock/return/${id}`);
}

export function stockVerifyAction(params) {
  return $axios.post("/stock/verify", params);
}
export function xiaohaoAction(params) {
  return $axios.post("/stock/xh", params);
}

export function getPrintOrderData(params) {
  return $axios.post("/data/stock", params);
}
export function getPrintOrderOutData(params) {
  return $axios.post("/data/stock/out", params);
}
export function editFzrAction(params) {
  return $axios.post("/stock/update", params);
}
export function getPrintXhData(params) {
  return $axios.post("/data/xh", params);
}


