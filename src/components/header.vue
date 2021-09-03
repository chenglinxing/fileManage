<template>
  <div class="header">
    <div class="opreate">
      <el-input v-model.trim="currentPath" @input="handleInput"> </el-input>
      <el-button @click="choosePath">切换路径</el-button>
    </div>
    <div class="center"></div>
    <div class="other"></div>
  </div>
</template>

<script>
/*eslint-disable*/
import { pathVerification } from "../utils/toolFun";
import { getPathExitFile, getFileOrDir, getFileContents } from "@/api/index";
import { mapGetters } from "vuex";

export default {
  // props: ["fileList", "path"],
  data() {
    return {
      path: this.$store.state.path,
      currentFileList: [], //当前路径获取的文件列表
      currentFileContent: null, //当前页面路径返回的文件内容
    };
  },

  computed: {
    // currentPath: {
    //   get() {
    //     return this.path;
    //   },
    //   set(val) {
    //     return this.$emit("update:path", val);
    //   },
    // },
    ...mapGetters(["currentPath"]),
  },
  methods: {
    handleInput(e) {
      this.$store.commit("getCurrentPath", e);
    },
    async choosePath() {
      if (this.path) {
        // pathVerification(this.currentPath);
        await this.isExitFile(this.currentPath);
        //传入父组件的文件列表
        this.$emit("update:fileList", this.currentFileList);
        // this.$emit("update:path", this.currentPath);
      } else {
        this.$message.error({
          message: "路径不能为空！",
          duration: 800,
        });
      }
    },

    //判断系统是否存在该路径（绝对路径）
    async isExitFile(path) {
      const { code, data, msg } = await getPathExitFile(decodeURI(path));
      if (code == 200) {
        await this.getFile(path);
      } else {
        this.currentFileList = data;
        this.$message.error(msg);
      }
    },

    //路径存在，则先判断是文件 还是 文本，
    async getFile(path) {
      const { code } = await getFileOrDir(decodeURI(path));
      if (code == 200) {
        await this.getFileContentOrCatalogue(path);
      }
    },

    //如果是文件继续返回下层目录，否则直接返回文本内容
    async getFileContentOrCatalogue(path) {
      const { data, code } = await getFileContents(decodeURI(path));
      this.$store.commit("getCurrentFileList", data);
      // this.currentFileList = data;
      // console.log(this.currentFileList);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  background: #ccc;
  height: 80px;
  display: flex;
  .opreate {
    height: 100%;
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-input {
      width: 60%;
    }
  }

  .center {
    flex: 1;
  }
  .other {
    flex: 2;
  }
}
</style>
