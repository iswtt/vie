<template>
  <div class='tip-welcome'>
     {{message}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      message: this.$t('vicenter.tip.welcome.dangerousImage')
    }
  }
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.tip-welcome {
  width: 100%;
  height: 100%;
  @include welcomeBg();
  background-size:100% 100%;
  @include flex();
  @include setTextColor();
  font-size: $welcomeTitle;
  font-weight: bold;
}
</style>
