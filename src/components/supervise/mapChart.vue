<template>
  <div class="chartHeightM">
    <span class="smallBox top-left"></span>
    <span class="smallBox top-right"></span>
    <span class="smallBox bottom-left"></span>
    <span class="smallBox bottom-right"></span>
    <div class="container">
      <div class='supervise-title'>
        <span class="title">
          <i class="iconfont arrow">&#xe6c9;</i>
          {{data.title}}
        </span>
        <!-- <span v-if="data.unit" class="unit">{{data.unit}}</span> -->
      </div>
      <div class="chart">
        <!-- <el-tooltip class="item" effect="dark" placement="left">
          <div slot="content">
            <ul class="legendSettingCss">
              <li v-for="(item, index) in data.legendSetting" :key="index"><span class="color" :style="{background: item.color}"></span><span class="text">{{item.text}}</span></li>
            </ul>
          </div>
          <ul v-show="data.isShowLegend" class="hideLegend">
            <li v-for="(item, index) in data.legendSetting" :key="index" :style="{background: item.color}"></li>
            <span class="legendTxt">{{$t('vicenter.common.legend')}}</span>
          </ul>
        </el-tooltip> -->
        <div v-show="data.isShowLegend" class="hideLegend">
          <div class="tooltiptext legendSettingCss">
            <div v-for="(item, index) in data.legendSetting" :key="index">
              <span class="color" :style="{background: item.color}"></span><span class="text">{{item.text}}</span>
              <br>
            </div>
          </div>
          <ul>
            <li v-for="(item, index) in data.legendSetting" :key="index" :style="{background: item.color}"></li>
            <span class="legendTxt">{{$t('vicenter.common.legend')}}</span>
          </ul>
        </div>
        <div v-if="data.totalStatistic" class="totalStatistic">
          <ul>
            <li v-for="(e, index) in data.totalStatisticData" :key="index">
              <span>{{e.label}}</span>
              <span :data-id="e.ruleprop+'-span'">{{e.value}}</span>
            </li>
          </ul>
          <div v-show="data.noData" class="chartBox" :style="{height: data.height}">{{$t('vicenter.common.nodata')}}</div>
          <div v-show="!data.noData" :id="data.id" class="chartBox" :style="{height: data.height}"></div>
        </div>
        <div v-show="!data.totalStatistic && !data.noData" :id="data.id" :style="{height: data.height}"></div>
        <div v-show="!data.totalStatistic && data.noData" class="chartNoData" :style="{height: data.height}">{{$t('vicenter.common.nodata')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: ['data']
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.chartHeightM{
  padding: 1px;
  position: relative;
  margin-top: $dis10;
  .container {
    width: $all;
    @include mapChartBorder();
    @include box-sizing();
    .supervise-title {
      padding: 5px 0;
      width: $all;
      text-align: left;
      color: $white;
      @include mapChartTitleBg();
      position: relative;
      .title{
        padding-left: $dis10;
        font-size: 15px;
        .arrow {
          @include iconfontColor();
          font-weight: bold;
        }
      }
      .unit{
        position: absolute;
        top: $all/2;
        right: $dis10*2;
        font-size: 10px;
        transform: translate(0, -50%);
      }
    }
    .chart{
      background: #030407;
      position: relative;
      .hideLegend {
        width: auto;
        position: absolute;
        top: $dis10;
        right: $dis10;
        z-index: 10;
        cursor: pointer;
        li {
          width: 18px;
          height: 3px;
          margin: 0 auto 1px;
          border-radius: 2px;
        }
        .legendTxt {
          color: $white;
          font-size: 12px;
        }
      }
      .totalStatistic {
        width: $all;
        height: $all;
        @include flex(row, space-between, center);
        ul {
          width: 40%;
          color: $white;
          text-align: left;
          @include box-sizing();
          padding: 0 $dis10 0 $dis10*2;
          li {
            font-size: 18px;
            font-weight: bold;
            padding: $dis10 0;
            @include flex(row, space-between, center);
            span:last-child {
              display: inline-block;
              min-width: 40px;
              text-align: left;
            }
          }
        }
        .chartBox {
          width: 60%;
          @include flex(row, center, center);
          color: $white;
        }
      }
      .chartNoData {
        color: $white;
        @include flex(row, center, center);
      }
    }
  }
  .smallBox {
    display: inline-block;
    width: 15px;
    height: 15px;
    @include box-sizing();
    @include mapChartBorder();
    position: absolute;
  }
  .top-left {
    top: 0;
    left: 0;
  }
  .top-right {
    top: 0;
    right: 0;
  }
  .bottom-left {
    bottom: 0;
    left: 0;
    border-top: none!important;
    border-right: none!important;
  }
  .bottom-right {
    bottom: 0;
    right: 0;
    border-top: none!important;
    border-left: none!important;
  }
  .tooltiptext {
    visibility: hidden;
    background-color: #303133;
    color: #fff;
    text-align: center;
    padding: 10px;
    border-radius: 6px;
    position: absolute;
    z-index: 999;
    width: max-content;
    right: 100%;
    top: -100%;
  }
  .hideLegend:hover .tooltiptext {
    visibility: visible;
  }
}
@media screen and (max-width: 1640px) {
}
.legendSettingCss {
  div {
    @include flex(row, flex-start, flex-start);
    margin-bottom: 5px;
    .color {
      width: 27px;
      height: 16px;
      border-radius: 3px;
      margin-right: $dis10;
    }
    .text {
      font-size: 14px;
      color: $white;
    }
  }
}
</style>
