import $axios from "../constants/constant";

/**
 * 已划拨
 * @param {*} params
 */
export function getLendhisList(params) {
    return $axios.post("/lend/list/his", params);
}

/**
 * 已划拨
 * @param {*} params
 */
export function getLendMyList(params) {
    return $axios.post("/lend/list/my", params);
}

/**
 * 已划拨
 * @param {*} params
 */
export function getLendVerifyList(params) {
    return $axios.post("/lend/list/verify", params);
}

/**
 * 已划拨
 * @param {*} params
 */
export function lendHisAction(params) {
    return $axios.post("/lend/his", params);
}

/**
 * 已划拨
 * @param {*} params
 */
export function lendVerifyAction(params) {
    return $axios.post("/lend/verify", params);
}