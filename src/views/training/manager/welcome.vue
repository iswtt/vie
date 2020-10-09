<template>
  <div class='training-welcome'>
    <p>{{message}}</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      message: this.$t('vicenter.training.system.name')
    }
  },
  created () {},
  methods: {}
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.training-welcome {
  width: $all;
  height: $all;
  @include welcomeBg_TRA();
  background-size:$all $all;
  @include flex(row, center, center);
  @include setTextColor();
  font-size: $welcomeTitle;
  font-weight: bold;
}
</style>
