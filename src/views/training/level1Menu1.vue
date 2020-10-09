<template>
  <div class=''>
     一级菜单1内容
     <el-button type="primary" size="mini" @click="toDetail">进入详情页面</el-button>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    toDetail () {
      this.$router.push({
        path: 'level1Menu1-detail'
      })
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
</style>
