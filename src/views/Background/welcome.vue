<template>
  <div class='background-welcome'>
     {{message}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      message: this.$t('vicenter.Background.welcome.backgroundManagementsubsystem')
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.background-welcome {
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
