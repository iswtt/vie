<template>
  <div id="error-page">
    <div class="err-container">
      <div class="err-logo"></div>
      <div class="err-title">{{$t('vicenter.common.errorPageTitle')}}</div>
      <div class="err-line">
        <div class="line">
          <div class="line-t"></div>
          <div class="line-b"></div>
        </div>
      </div>
      <div class="err-tips">{{$t('vicenter.common.errorPageInfo')}}</div>
      <div class="err-line">
        <div class="line">
          <div class="line-t"></div>
          <div class="line-b"></div>
        </div>
      </div>
      <div class="err-back">
        <el-button type="primary" @click="back">{{$t('vicenter.common.back')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error-page',
  data () {
    return {}
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';
#error-page {
  width: $all;
  height: $all;
  @include loginBg();
  @include flex();
  .err-container {
    width: $all;
    height: $all;
    .err-logo {
      background: $logo no-repeat $logoSize auto;
      height: $headerHeight;
      margin-bottom: $margin * 6;
    }
    .err-title {
      font-size: $welcomeTitle;
      font-weight: bold;
      color: $white;
      margin-bottom: $margin * 10;
    }
    .err-line {
      @include flex();
      .line {
        @include flex();
        width: $all / 2;
        .line-t, .line-b {
          height: $dis10 / 2;
          width: $all;
        }
        .line-t {
          background: $topLine;
        }
        .line-b {
          background: $bottomLine;
        }
      }
    }
    .err-tips {
      padding: $margin * 2 0;
      font-size: $margin * 2;
      height: $margin * 2;
      line-height: $margin * 2;
      color: $white;
    }
    .err-back {
      margin-top: $margin * 10;
      .el-button {
        padding: 12px 80px;
      }
    }
  }
}
</style>
