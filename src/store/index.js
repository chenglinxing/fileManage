import Vue from "vue";
import Vuex from "vuex";
import persistedstate from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    path: "C:/Users/Admin/Desktop", //文本框的路径
    fileList: null, //返回的文件列表
    fileContent: null, //返回的文件内容,
    isShowFileDialog: false, //默认隐藏文件内容的dialog
  },
  getters: {
    currentPath: (state) => state.path, //文本框的路径
    currentFileList: (state) => state.fileList, //返回的文件列表
    currentFileContent: (state) => state.fileContent, //返回的文件内容
    currentIsShowFileDialog: (state) => state.isShowFileDialog, //当前dialog的状态
  },
  mutations: {
    //获取当前输入的文件路径
    getCurrentPath(state, data) {
      state.path = data;
    },

    //获取该文件路径返回的文件列表
    getCurrentFileList(state, data) {
      state.fileList = data;
    },

    //返回文件内容
    getCurrentFileContent(state, data) {
      state.fileContent = data;
    },

    //修改页面的dialog框
    getCurrentFileDialog(state, data) {
      state.isShowFileDialog = data;
    },
  },
  actions: {},
  modules: {},
  plugins: [persistedstate()],
});
