/**
 * 系统相关请求
 */
import $axios from "../constants/constant";

/**
 * 登录
 * @param {*} params
 */
export function getProductList(params) {
  return $axios.post("/product/list", params);
}

/**
 * 分类列表
 * @param {*} params 
 */
export function getProductTypesList(params) {
  return $axios.post("/product/list/type", params);
}

/**
 * 新增or更新分类
 * @param {*} params 
 */
export function addOrUpdateTypes(params) {
  return $axios.post("/product/type/add", params)
}