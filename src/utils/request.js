import axios from "axios";
import baseUrl from "./baseUrl";

const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000000,
});

service.interceptors.request.use(
  (config) => {
    // console.log(config);
    return config;
  },
  (err) => Promise.reject(err)
);

service.get = (params) =>
  new Promise((resolve, reject) => {
    service({
      ...params,
      method: "get",
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });

service.post = (params) =>
  new Promise((resolve, reject) => {
    service({
      ...params,
      method: "post",
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
export default service;
