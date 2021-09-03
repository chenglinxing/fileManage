<template>
  <div class="home-index">
    <!--头部-->
    <header-title></header-title>
    <!-- 内容 -->
    <div class="content">
      <!-- 文件列表 -->
      <side-bar class="side-bar" />
      <!--文件内容-->
      <!-- <div class="file-content">
        <el-input type="textarea" v-model="currentFileContent"></el-input>
      </div> -->
      {{ test | format()}}
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from "vuex";
export default {
  components: {
    HeaderTitle: () => import("@/components/header.vue"),
    SideBar: () => import("@/components/sideBar/sideBar.vue"),
  },
  data() {
    return {
      test: "20200101",
    };
  },
  computed: {
    ...mapGetters(["currentFileContent"]),
  },
  filters: {
    format(str) {
      return (
        str.substring(0, 4) +
        "-" +
        str.substring(4, 6) +
        "-" +
        str.substring(6, 8)
      );
    },
  },
  methods: {
    move(e) {
      let odiv = e.target;
      // console.log(odiv);
      // console.log(
      //   "client",
      //   e.clientX,
      //   e.clientY,
      //   "page",
      //   e.pageX,
      //   e.pageY,
      //   "layer",
      //   e.layerX,
      //   e.layerY,
      //   "offset",
      //   e.offsetX,
      //   e.offsetY
      // );
      // console.log(odiv.offsetLeft, odiv.offsetTop);
      // //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onclick = (e) => {
        console.log(e, "ee");
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //绑定元素位置到positionX和positionY上面
        this.positionX = top;
        this.positionY = left;
        //移动当前元素
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.home-index {
  .content {
  }
}
</style>
