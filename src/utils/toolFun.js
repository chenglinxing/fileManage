/*eslint-disable*/

import { Message } from "element-ui";
import store from "../store";

function getMessage(type, message, duration = 1000) {
  return Message({
    type: type,
    message: message,
    duration: duration,
  });
}

/**
 * 路径校验
 * @param {*} path
 */
export const pathVerification = (path) => {
  let reg =
    /^(?<path>(?:[a-zA-Z]:)?\\(?:[^\\\?\/\*\|<>:"]+\\)+)(?<filename>(?<name>[^\\\?\/\*\|<>:"]+?)\.(?<ext>[^.\\\?\/\*\|<>:"]+))$/;
  console.log(path);
  if (reg.test(path)) {
    getMessage("success", "路径校验成功！");
  } else {
    getMessage("error", "路径校验失败！");
  }
};

/**
 * 路径返回上一层  如：C:/first/second/third  返回上一层得C:/first/second/third
 * 如果已经返回到了最上一层 如 C:/  则提示找不到上层目录
 * @param {*} str
 */
export const goBackCatalog = (str) => {
  let res;
  if (typeof str != "string") return Message.error("请输入正确路径");

  //只校验找不到上层目录
  let reg = /^[a-zA-Z]:\/$/;
  if (reg.test(str)) {
    Message.error("找不到上层目录！");
    return str; 
  } else {
    res = str.substring(0, str.lastIndexOf("/"));
    store.commit("getCurrentPath", decodeURI(res));
  }
  return res;
};
