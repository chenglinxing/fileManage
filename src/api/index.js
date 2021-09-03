import service from "../utils/request";

export const test = () =>
  service.get({
    url: "/home",
  });

/**判断是否存在该路径 */
export const getPathExitFile = (path) =>
  service.get({
    url: `/getPathExitFile?path=${path}`,
  });

/**判断路径是文件还是文件夹 */
export const getFileOrDir = (path) =>
  service.get({
    url: `/getFileOrDir?path=${path}`,
  });

/** 根据路径返回文件 或 文件目录*/
export const getFileContents = (path) =>
  service.get({
    url: `/getFileContents?path=${path}`,
  });

/**操作文集 */
export const opreateFile = (params) =>
  service.post({
    url: "/opreateFile",
    data: params,
  });
