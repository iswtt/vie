<template>
  <div class="chartList">
    <div class="container">
      <div class='supervise-title'>
        <span class="title">
          <i class="iconfont arrow">&#xe6c9;</i>
          {{data.title}}
        </span>
      </div>
      <!-- <div v-if="data.unit" class="unit">{{data.unit}}</div> -->
      <div :id="data.id" :style="{height: data.height}" class="list" >
        <div class="imgBox" v-for = "(e, index) in data.list" :key='index' @click="getDetail(e.id)">
          <i class="iconfont bell">&#xe688;</i>
          <img :src = "e.lastScanImage"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    'data': {
      type: Object,
      default: {}
    }
  },
  methods: {
    getDetail (id) {
      this.$router.push({
        path: '/Supervise/supervise-map/Task-inspection-detail'
      })
      let details = {
        id: id,
        reviewFlag: false,
        backFlag: 'map'
      }
      sessionStorage.setItem('details', JSON.stringify(details))
    }
  }
}
</script>
<style lang="scss">
  @import "@/styles/index.scss";
.chartList{
  padding: 1px;
  position: relative;
  margin-top: $dis10;
  .container {
    width: $all;
    @include mapChartBorder();
    @include box-sizing();
    .unit{
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 10px;
    }
    .list{
      color: white;
      background: #030407;
      position: relative;
      @include flex(row, flex-start, flex-start);
      flex-wrap: wrap;
      .imgBox{
        cursor: pointer;
        height: calc(50% - 5px);
        width: calc(33% - 5px);
        padding: 3px;
        position: relative;
        .bell{
          position: absolute;
          z-index: 2;
          color: red;
          right: 5px;
          top: 5px;
          font-size: 25px;
        }
        img{
          height: 100%;
          width: 100%;
        }
      }
    }
    @media screen and (max-width: 1400px) {
    }
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
    }
  }
}
</style>
