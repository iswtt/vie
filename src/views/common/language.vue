<template>
<div></div>
</template>

<script>
import locale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
export default {
  name: 'loading',
  mounted() {
    const lang = this.$store.state.lang
    // 切换语言
    this.$i18n.locale = lang
    if (lang === 'zh-CN') {
      locale.use(zhLocale)
    } else if (lang === 'en-US') {
      locale.use(enLocale)
    }
    const loading = this.$loading({
      lock: true,
      text: this.$t('vicenter.common.changeLang'),
      spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,.5)'
    })
    const path = this.$store.state.path
    this.$router.push({
      path: path
    })
    setTimeout(function () {
      loading.close()
    }, 2000)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
.el-loading-mask {
  background-color: rgba(0, 0, 0, .5);
}
</style>
