<template>
  <div id="dialog">
    <el-dialog :width="modalData.width?modalData.width:'50%'" :top="modalData.top?modalData.top:'15vh'" @close="closeModal(modalData.resetModal)" :title="modalData.title" :visible.sync="modalData.flag" :close-on-click-modal='false' :close-on-press-escape='false'>
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'modalDialog',
  methods: {
    closeModal (fn) { // ×号关闭弹窗并且清空数据
      if (fn) {
        fn()
      }
    }
  },
  props: [ 'modalData' ]
}
</script>

<style lang="scss">
@import '../styles/index.scss';
#dialog {
  .el-dialog {
    .el-dialog__header {
      text-align: left
    }
  }
  .search-form {
    @include flex(row, space-between, flex-start);
    flex-wrap: wrap
  }
}
</style>
