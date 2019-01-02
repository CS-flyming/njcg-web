import $axios from "../constants/constant";
export function addBid(params) {
  return $axios.post("/bid/add",params);
}

export function getBidMyList(params) {
  return $axios.post("/bid/my/list",params);
}

export function getBidFirstList(params) {
  return $axios.post("/bid/first/list",params);
}

export function getBidSecondList(params) {
  return $axios.post("/bid/second/list",params);
}

export function getBidFinishList(params) {
  return $axios.post("/bid/finish/list",params);
}

export function verifyBid(params) {
  return $axios.post("/bid/verify",params);
}