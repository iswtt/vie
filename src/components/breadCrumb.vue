<template>
  <el-breadcrumb :separator="breadcrumb.font" :separator-class='breadcrumb.class' class="margins">
    <el-breadcrumb-item v-for='(item, index) in breadcrumb.data'  :to="{ path: item.path }" :replace="item.replace" :key="index">{{item.label}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'breadcrumb',
  props: ['breadcrumb']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../styles/index.scss";
.margins {
  margin-bottom: $margin;
  .el-breadcrumb__inner.is-link {
    @include setColor();
    font-weight: normal;
    font-size: 14px;
  }
  span:last-child {
    .el-breadcrumb__inner.is-link {
      color: $black
    }
  }
}
</style>
