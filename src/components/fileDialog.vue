<template>
  <div class="file-dialog">
    <el-dialog
      :title="title"
      :visible.sync="isShowDialog"
      :width="dialogWidth"
      :before-close="beforeClose"
    >
      <el-form :model="formData" size="small" label-width="95px" ref="formData">
        <el-form-item
          label="文件类型："
          prop="fileType"
          :rules="[{ required: true, message: '请输入文件类型' }]"
        >
          <el-select v-model="formData.fileType" @change="handleFileType">
            <el-option
              v-for="(item, index) in fileTypeList"
              :key="index"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="文件名称："
          prop="fileName"
          :rules="[{ required: true, message: '请输入文件名称' }]"
        >
          <el-input v-model.trim="formData.fileName"></el-input>
        </el-form-item>

        <el-form-item
          label="文件内容："
          prop="fileContent"
          :rules="[
            { required: isRequiredFileContent, message: '请输入文件内容' },
          ]"
          v-show="isShowFileContent"
        >
          <el-input
            type="textarea"
            v-model="formData.fileContent"
            :autosize="{
              minRows: 8,
              maxRows: 10,
            }"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="btn-list" slot="footer">
        <el-button type="primary" @click="determine('formData')"
          >确定</el-button
        >
        <el-button @click="cancel('formData')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*eslint-disable*/
import {
  opreateFile,
  getPathExitFile,
  getFileOrDir,
  getFileContents,
} from "@/api/index";
import { mapGetters } from "vuex";
export default {
  props: [
    "title",
    "isShowDialog",
    "dialogWidth",
    "formData",
    "oldFileName",
    "opreateType",
    "insertFileRow",
  ],
  data() {
    return {
      fileTypeList: [
        { key: 0, label: "文本" },
        { key: 1, label: "文件夹" },
      ],
      //   formData: {
      //     fileType: 0,
      //     fileName: "",
      //     fileContent: "",
      //   },
      isRequiredFileContent: true, //文本内容必填
      isShowFileContent: true, //文本内容是否 隐藏 默认不隐藏
    };
  },
  computed: {
    ...mapGetters(["currentPath"]),
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
      console.log(data, isFile);
      if (code == 200) {
        isFile
          ? this.$store.commit("getCurrentFileList", data)
          : this.$store.commit("getCurrentFileContent", data);
      }
    },
    //关闭dialog前的回调
    beforeClose() {
      //清空表单
      this.$emit("update:formData", {
        fileType: 0, //文件类型为0 则代表不是文件夹 ，为1 则代表是文件夹
        fileName: "", //文件名
        fileContent: "", //文件内容
      });
      this.cancel("formData");
      this.isShowFileContent = true;
      this.isRequiredFileContent = true;
      this.$emit("update:isShowDialog", false);
    },

    //点击确定
    determine(formName) {
      //获取文件的绝对路径   旧文件名
      this.formData.oldFilePath = this.currentPath + "/" + this.oldFileName;
      //如果是在文件夹中新增文本或文件夹  则重新赋值
      if (this.insertFileRow.isFile) {
        this.formData.newFilePath =
          this.currentPath + "/" + this.formData.fileName;
      } else {
        this.formData.newFilePath =
          this.currentPath +
          "/" +
          this.insertFileRow.fileName +
          "/" +
          this.formData.fileName;
      }

      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //0为修改文件  1为新增文件
          this.opreateType == 0
            ? (this.formData.opreateType = 0)
            : (this.formData.opreateType = 1);

          const { msg, code } = await opreateFile(this.formData);
          if (code == 200) {
            this.$message.success(msg);
            //清空表单 并关闭
            this.cancel(formName);
            //重新刷新页面
            // console.log(this.currentPath);
            await this.getFileContentOrCatalogue(this.currentPath);
          } else {
            this.$message.error("修改失败");
          }
        } else {
          // Message.error("存在必填项")
          return false;
        }
      });
    },

    //点击取消
    cancel(formName) {
      this.$emit("update:isShowDialog", false);
      this.$refs[formName].resetFields();
    },

    //修改文件类型
    handleFileType(e) {
      //如果选择的是文件夹  1  则文件内容不必填 且隐藏
      if (e == 1) {
        this.isShowFileContent = false;
        this.isRequiredFileContent = false;
      }else{
        this.isShowFileContent = true;
        this.isRequiredFileContent = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-list {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
