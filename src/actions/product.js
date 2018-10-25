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
  return $axios.post("/product/type/add", params);
}

/**
 * 新增商品
 * @param {*} params
 */
export function addOrUpdateProduct(params) {
  return $axios.post("/product/add", params);
}


/**
 * 新增商品
 * @param {*} params
 */
export function deleteProduct(id) {
  return $axios.post(`/product/delete/${id}`);
}

/**
 * 商品详情
 * @param {*} params
 */
export function getProductDetail(id) {
  return $axios.post(`/product/find/${id}`);
}

export function getCompanyList(params) {
  return $axios.post("/company/list", params);
}
export function deleteCompanyById(id) {
  return $axios.post(`/company/delete/${id}`);
}
export function addOrUpdateCompany(params) {
  return $axios.post("/company/add", params);
}

export function getCompanyDetail(id) {
  return $axios.post(`/company/detail/${id}`);
}
