<template>
  <div id="index">
    <el-container class="a-container">
      <el-header>
        <Header/>
      </el-header>
      <el-container class="b-container">
        <el-aside v-bar>
          <Aside/>
        </el-aside>
        <el-container class="c-container">
          <el-main>
            <router-view/>
          </el-main>
        </el-container>
      </el-container>
      <el-footer class="footer">{{$t('vicenter.common.footer',{msg:new Date().getFullYear()})}}</el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from './header'
import Aside from './sideMenu'
export default {
  name: 'index',
  data () {
    return {
    }
  },
  methods: {},
  components: { Header, Aside }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
#index {
  height: $all;
  width: $all;
  @include flex();
  min-width: 1200px;
  .a-container {
    height: $all;
    width: $all;
    .el-header {
      height: $headerHeight !important;
      padding: 0;
    }
    .el-container.b-container,
    .el-container.c-container {
      overflow: auto;
    }
    .b-container {
      .el-aside {
        width: $asideWidth;
      }
      .el-menu--collapse {
        width: $all;
      }
      .c-container {
        .el-main {
          @extend .extend-bar;
          padding: 0;
        }
      }
    }
    .footer {
      background: $footer;
      color: $footerText;
      font-size: 14px;
      text-align: right;
      padding: 0 15px 0 0;
      height: $footHeight !important;
      line-height: $footHeight;
    }
  }
}
</style>
