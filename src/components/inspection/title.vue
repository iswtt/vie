<template>
  <div class='ins-title'>
    <span class="title">{{title}}</span>
  </div>
</template>
<script>
export default {
  props: ['title']
}
</script>
<style lang="scss">
  .ins-title {
    padding: 5px 0;
    background-color: #f2f2f2 !important;
    width: 100%;
    text-align: left;
    font-weight: bold;
    .title{
      padding-left: 5px;
    }
  }
</style>
