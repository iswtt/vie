<template>
  <div class="chartHeight">
    <div class='supervise-title'>
      <span class="title">
        {{data.title}}
      </span>
    </div>
    <div v-if="data.unit" class="unit">{{data.unit}}</div>
    <div :id="data.id" class="chart">
    </div>
  </div>
</template>
<script>
export default {
  props: ['data']
}
</script>
<style lang="scss">
  @import "@/styles/index.scss";
  .chartHeight{
    position: relative;
    padding: 2px;
    width: 100%;
    min-height: 180px;
    height: 100%;
    background: $dmsChartBg no-repeat;
    background-size:100% 100%;
    -moz-background-size:100%;
    margin-top: 8px;
    .unit{
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 10px;
    }
    .chart{
      height: calc(100% - 30px)
    }
    @media screen and (max-width: 1400px) {
    }
    .supervise-title {
      padding: 5px 0;
      width: 100%;
      text-align: left;
      color: white;
      background: $dmsChartTitleBg no-repeat;
      background-size:100% 100%;
      -moz-background-size:100%;
      .title{
        padding-left: 26px;
        font-size: 15px;
      }
    }
  }
</style>
