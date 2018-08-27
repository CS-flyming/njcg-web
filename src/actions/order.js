import $axios from "../constants/constant";

/**
 * 我的订单
 * @param {*} params
 */
export function getOrderMyList(params) {
  return $axios.post("/order/list", params);
}

/**
 * 入库订单
 * @param {*} params
 */
export function getOrderInList(params) {
  return $axios.post("/order/list/in", params);
}

/**
 * 待收货订单
 * @param {*} params
 */
export function getOrderTakeList(params) {
  return $axios.post("/order/list/finish", params);
}

/**
 * 入库订单
 * @param {*} params
 */
export function getOrderRefuseList(params) {
  return $axios.post("/order/list/refuse", params);
}

export function confirmOrder(id) {
  return $axios.post(`/product/take/${id}`);
}
