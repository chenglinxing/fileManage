<template>
  <div class="side-bar">
    <el-button @click="goBack">返回上一层目录</el-button>
    <el-table :data="currentFileList" @row-click="rowClick" align="center">
      <el-table-column label="名称" width="300px" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="fileName">
            <svg class="svg-icon" aria-hidden="true" v-show="!scope.row.isFile">
              <use xlink:href="#icon-wenjianjia"></use>
            </svg>
            <span>{{ scope.row.fileName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in tableTitleList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        align="center"
      ></el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="opreate-file">
            <el-button
              type="primary"
              @click.stop="insertFile(scope.row)"
              v-show="!scope.row.isFile"
              >新增</el-button
            >
            <el-button
              @click.stop="updateFile(scope.row)"
              v-show="scope.row.fileSuffix == 'txt'"
              >修改</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <file-dialog
      :title="title"
      :isShowDialog.sync="isShowDialog"
      :dialogWidth="dialogWidth"
      :formData.sync="formData"
      :oldFileName="oldFileName"
      :opreateType.sync="opreateType"
      :insertFileRow="insertFileRow"
    />
  </div>
</template>

<script>
/*eslint-disable*/
import { getPathExitFile, getFileOrDir, getFileContents } from "@/api/index";
import { mapGetters } from "vuex";
import { goBackCatalog } from "@/utils/toolFun.js";

export default {
  props: ["fileList", "path"],
  components: {
    fileDialog: () => import("../../components/fileDialog.vue"),
  },
  data() {
    return {
      tableTitleList: [
        { label: "文件类型", prop: "fileSuffix" },
        { label: "文件大小", prop: "fileSize" },
      ],
      title: "文件标题",
      isShowDialog: false,
      dialogWidth: "40%",
      formData: {
        fileType: 0, //文件类型为0 则代表不是文件夹 ，为1 则代表是文件夹
        fileName: "", //文件名
        fileContent: "", //文件内容
      },
      oldFileName: "", //旧文件名
      opreateType: 0, //0为直接点击table修改 或者点击修改   1为新增
      insertFileRow: {}, //点击新增时 当前行的数据
    };
  },
  computed: {
    ...mapGetters(["currentPath", "currentFileList", "currentFileContent"]),
  },
  methods: {
    //判断系统是否存在该路径（绝对路径）
    async isExitFile(path) {
      const { code, data } = await getPathExitFile(path);
      if (code == 200) {
        this.getFile(path);
      }
    },

    //路径存在，则先判断是文件 还是 文本，
    async getFile(path) {
      const { code } = await getFileOrDir(path);
      if (code == 200) {
        this.getFileContentOrCatalogue(path);
      }
    },

    //如果是文件继续返回下层目录，否则直接返回文本内容
    async getFileContentOrCatalogue(path) {
      //点击前先清空文件内容
      // this.$store.commit("getCurrentFileContent", null);
      const { data, code, isFile } = await getFileContents(path);
      //判断如果是文件  则返回文件列表，否则返回文件内容
      // console.log(data, isFile);
      if (code == 200) {
        isFile
          ? this.$store.commit("getCurrentFileList", data)
          : this.$store.commit("getCurrentFileContent", data);
      }
    },

    //点击某一行
    async rowClick(row) {
      console.log(row, "row");
      this.insertFileRow = row;
      // //操作类型为0
      // this.opreateType = 0;
      //显示编辑文本  暂只开放文本编辑
      if (row.fileSuffix == "txt" || !row.isFile) {
        let path = this.currentPath + "/" + decodeURI(row.fileName);
        await this.getFileContentOrCatalogue(path);
        //先判断点击的是否为文件夹  如果点击的内容则不进行拼接
        let isFilePath = this.currentPath;
        //重新赋值路径  判断当前点击的文件名称是文件夹还是文件，
        this.$store.commit("getCurrentPath", !row.isFile ? path : isFilePath);
        //赋值旧文件名
        this.oldFileName = row.fileName;
        this.isShowDialog = row.isFile;
        this.title = "编辑 " + row.fileName;
        this.formData = {
          fileName: row.fileName,
          fileType: row.isFile ? 0 : 1,
          fileContent: this.currentFileContent,
        };
      } else if (row.isFile) {
        this.$message({
          type: "error",
          message: "暂只开放文本预览及编辑操作",
          duration: 1000,
        });
      }
    },

    //返回上一层
    goBack() {
      let currentPath = goBackCatalog(this.currentPath);
      this.isExitFile(currentPath);
      //赋值路径
      this.$store.commit("getCurrentPath", currentPath);
      //清空内容
      this.$store.commit("getCurrentFileContent", null);
    },

    /**新增文件 或文件夹   暂时只做新增文件*/
    insertFile(params) {
      console.log(params, "新增");
      //显示dialog
      this.isShowDialog = true;
      this.title = "新增文件/文件夹";
      this.opreateType = 1;
      this.insertFileRow = params;
    },

    /**修改文件 */
    async updateFile(params) {
      // console.log(params, "修改");
      await this.rowClick(params);
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin cursor {
  cursor: pointer;
}
.side-bar {
  min-width: 900px;
  margin-left: 20px;
  .name {
    padding: 5px;
    &:hover {
      background: rgb(218, 231, 243);
      @include cursor();
    }
  }

  .file-name:hover {
    background: rgb(218, 231, 243);
    @include cursor();
  }
}
.svg-icon {
  height: 20px;
  width: 20px;
  margin-right: 5px;
}

.el-table {
  cursor: pointer;
}

.opreate-file {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
