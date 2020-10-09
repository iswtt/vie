<template>
  <div class='welcome-page'>
     {{message}}
  </div>
</template>
<script>
export default {
  name: 'Welcome',
  data () {
    return {
      message: this.$t(this.$route.matched[0].meta.title)
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.welcome-page {
  width: $all;
  height: $all;
  @include welcomeBg();
  background-size:$all $all;
  @include flex(row, center, center);
  @include setTextColor();
  font-size: $welcomeTitle;
  font-weight: bold;
}
</style>
