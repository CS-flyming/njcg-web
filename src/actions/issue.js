import $axios from "../constants/constant";

/**
 * 物品申报
 * @param {*} params
 */
export function getIssueApplyList(params) {
    return $axios.post("/issue/list/apply", params);
}

/**
 * 已完成
 * @param {*} params
 */
export function getIssueFinishList(params) {
    return $axios.post("/issue/list/finish", params);
}

/**
 * 驳回
 * @param {*} params
 */
export function getIssueRefuseList(params) {
    return $axios.post("/issue/list/refuse", params);
}

/**
 * 配发审核
 * @param {*} params
 */
export function getIssueVerifyList(params) {
    return $axios.post("/issue/list/verify", params);
}


