<template>
  <div class='training-welcome'>
     {{message}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      message: this.$t('vicenter.training.system.name')
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.training-welcome {
  width: $all;
  height: $all;
  @include welcomeBg();
  background-size: $all $all;
  @include flex();
  @include setTextColor();
  font-size: $welcomeTitle;
  font-weight: bold;
}
</style>
