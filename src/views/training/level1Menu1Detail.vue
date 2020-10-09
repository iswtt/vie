<template>
  <div class=''>
     一级菜单1详情内容
     <el-button type="primary" size="mini" @click="backList">返回列表页面</el-button>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    backList () {
      this.$router.push({
        path: 'level1Menu1'
      })
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
</style>
