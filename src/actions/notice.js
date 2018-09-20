import $axios from "../constants/constant";


/**
 * 我的公告
 * @param {*} params
 */
export function getNoticeList(params) {
    return $axios.post("/notice/list", params);
}


export function addOrUpdateNotice(params) {
    return $axios.post("/notice/add", params);
}

export function deleteNotice(id) {
    return $axios.post(`/notice/delete/${id}`)
}

export function detailNotice(id) {
    return $axios.post(`/notice/detail/${id}`)
}

