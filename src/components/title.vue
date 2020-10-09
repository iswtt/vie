<template>
  <div id="panelTitle">
    <div class="panel-title">
      <div class="panel-title-left">
        {{panelTitleInit.title}}
      </div>
      <div class="operate-menu">
        <slot></slot>
        <div class="toggle-menu" @click="togglePanel(panelTitleInit.flag)" v-if='panelTitleInit.close || false'>
          <i class="iconfont" v-show="panelTitleInit.flag">&#xe66d;</i>
          <i class="iconfont" v-show="!panelTitleInit.flag">&#xe696;</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'panelTitle',
  methods: {
    togglePanel (val) {
      this.panelTitleInit.flag = !val
    }
  },
  props: ['panelTitleInit']
}
</script>

<style lang="scss">
@import "../styles/index.scss";
#panelTitle {
  width: $all;
  .panel-title {
    @extend .extend-panel-title;
    background: $titleUrl repeat-x 0 -15px;
    .operate-menu {
      &:hover {
        cursor: pointer;
      }
      @include flex();
      .toggle-menu {
        display: none;
        padding-right: 20px;
      }
    }
    .el-button--mini {
      padding: 4px 15px;
    }
    .el-button:last-child {
      margin-right: $dis10;
    }
    .panel-title-left {
      @include panelTitleLeft();
      @extend .extend-panel-title-left;
    }
    .panel-title-right {
      @extend .extend-panel-title-right;
    }
  }
}
</style>
