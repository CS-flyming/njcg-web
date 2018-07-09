/**
 * 部门actions
 */
import $axios from "../constants/constant";

/**
 * 获取单位列表
 * @param {*} params
 */
export function getUnitList(params) {
  return $axios.post("/unit/list", params);
}


/**
 * 新增修改单位
 * @param {*} params
 */
export function addOrUpdateUnit(params) {
  return $axios.post("/unit/add", params);
}
