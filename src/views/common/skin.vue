<template>
  <div></div>
</template>

<script>
export default {
  name: 'skin',
  mounted () {
    var link = document.getElementById('skinCss')
    if (sessionStorage.getItem('skin') === 'blue') {
      link.href = './static/elementBLUE/index.css'
    } else if (sessionStorage.getItem('skin') === 'red') {
      link.href = './static/elementRED/index.css'
    }
    const loading = this.$loading({
      lock: true,
      text: this.$t('vicenter.common.changeSkin'),
      spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,.5)'
    })
    document.getElementById('initBody').setAttribute('data-theme', sessionStorage.getItem('skin'))
    const path = this.$store.state.path
    this.$router.push({ path: path })
    setTimeout(function () {
      loading.close()
    }, 2000)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-loading-mask{
    background-color: rgba(0,0,0,.5);
  }
</style>
