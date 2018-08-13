import $axios from "../constants/constant";


/**
 * 我的订单
 * @param {*} params
 */
export function getPlanList(params) {
    return $axios.post("/month/list", params);
}

/**
 * 我的订单
 * @param {*} params
 */
export function addOrUpdatePlan(params) {
    return $axios.post("/month/add", params);
}

export function deletePlan(id) {
    return $axios.post(`/month/delete/${id}`)
}


