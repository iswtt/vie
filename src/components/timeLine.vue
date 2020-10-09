<template>
  <div class="time-line">
    <div v-if="!nodata" class="left">
      <p class="begin iconfont" :title="$t('vicenter.supervise.taskInspectionDetail.start')">&#xe68a;</p>
      <div class="row" v-for='(item,index,key) in timeLineData' :key='key'>
        <div class="time">
          <div class="rangeDay" v-if="parseInt(item.startTime/(24*60*60*1000)) === parseInt(item.endTime/(24*60*60*1000))">
            <span class="up">{{item.startTime | formatDate($t('vicenter.common.formatDate').substr(0, 10))}}</span>
            <span class="down">{{item.startTime | formatDate($t('vicenter.common.formatDate').substr(11))}}<span v-show="item.startTime && item.endTime">~</span>{{item.endTime | formatDate($t('vicenter.common.formatDate').substr(11))}}</span>
          </div>
          <div class="rangeNotDay" v-else>
            <span class="timeNode">
              <i class="up">{{item.startTime | formatDate($t('vicenter.common.formatDate').substr(0, 10))}}</i>
              <i class="down">{{item.startTime | formatDate($t('vicenter.common.formatDate').substr(11))}}</i>
            </span>
            <span class="timelink" v-show="item.startTime && item.endTime">~</span>
            <span class="timeNode">
              <i class="up">{{item.endTime | formatDate($t('vicenter.common.formatDate').substr(0, 10))}}</i>
              <i class="down">{{item.endTime | formatDate($t('vicenter.common.formatDate').substr(11))}}</i>
            </span>
          </div>
        </div>
        <div class="indexLine">
          <div class="index"></div>
          <div class="line">
            <!-- <span v-if="index === timeLineData.length - 1" class="arrow"></span> -->
          </div>
          <div class="indexBox">
            <div class="num">{{index+1}}</div>
            <span></span>
          </div>
        </div>
        <div class="label">{{item.taskNode}}</div>
        <div class="iconBox">
          <div class="status minwidth">
            <i class="iconfont green" :title='item.statusMsg' v-show="item.status === 1">&#xe621;</i>
            <i class="iconfont red" :title='item.statusMsg' v-show="item.status === 2">&#xe65b;</i>
          </div>
          <div class="videoIcon minwidth">
            <el-button type="text" @click="changeSwipe(item, 'video')" v-if="item.haveVideo">
              <i class="iconfont blue videoIcon">&#xe655;</i>
            </el-button>
            <el-button type="text" disabled v-else>
              <i class="iconfont disabledIcon videoIcon">&#xe655;</i>
            </el-button>
          </div>
          <div class="img minwidth">
            <el-button type="text" @click="changeSwipe(item, 'img')" v-if="item.haveImg">
              <i class="iconfont blue">&#xe60d;</i>
            </el-button>
            <el-button type="text" disabled v-else >
              <i class="iconfont disabledIcon">&#xe60d;</i>
            </el-button>
          </div>
        </div>
      </div>
      <p class="begin end iconfont" :title="$t('vicenter.supervise.taskInspectionDetail.end')">&#xe66f;</p>
    </div>
    <div v-if="nodata" class="left">
      <span>{{$t('vicenter.common.nodata')}}</span>
    </div>
    <div class="right" v-if="rightFlag">
       <Cswiper @changeImg="changeImg" ref="timeLineSwipe" :propOption='swipeOption' :listData='swipeData'></Cswiper>
       <div class="img-box"  v-if="ImgFlag">
         <Cswiper ref="timeLineSwipeDown" :propOption='swipeOptionDown' :listData='swipeData'></Cswiper>
          <!-- <img :src="swipeData[imgIndex].src" @click="Look"> -->
        </div>
    </div>
  </div>
</template>
<script>
import Cswiper from './swipe'
export default {
  name: 'timeLine',
  data () {
    return {
      imgIndex: 0,
      rightFlag: false,
      ImgFlag: false,
      swipeOption: {
        propId: 'timeLineSwipe',
        height: '120px',
        width: '70%',
        slidesPerView: 4,
        spaceBetween: 20,
        navigate: {
          position: 'outside',
          type: 'shadow'
        },
        showImg: false,
        hasFile: true
      },
      swipeOptionDown: {
        propId: 'timeLineSwipeDown',
        height: '530px',
        slidesPerView: 1,
        showImg: true
      },
      swipeData: [
      ],
      nodata: false
    }
  },
  created () {
    let timeLineData = this.$props.timeLineData
    if (timeLineData == null || timeLineData.length === 0) {
      this.nodata = true
    }
  },
  methods: {
    changeSwipe (item, type) {
      this.ImgFlag = false
      this.rightFlag = false
      if (type === 'img') {
        this.swipeData = item.imgList
        this.ImgFlag = true
      } else {
        this.swipeData = item.videoList
      }
      this.$nextTick(() => {
        this.rightFlag = true
      })
      if (this.$refs.timeLineSwipeDown) {
        this.$refs.timeLineSwipeDown.slideTo(0)
      }
      if (this.$refs.timeLineSwipe) {
        this.$refs.timeLineSwipe.slideTo(0)
      }
    },
    changeImg () {
      this.imgIndex = this.$refs.timeLineSwipe.propOption.index
      this.$refs.timeLineSwipeDown.slideTo(this.imgIndex)
    }
    // Look () {
    //   this.$refs.timeLineSwipe.LookImg()
    // }
  },
  props: ['timeLineData'],
  components: { Cswiper }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../styles/index.scss";
.time-line{
  width: 100%;
  display: -webkit-box;
  // min-height: 618px;
  .left{
    width: 43%;
    float: left;
    @media screen and (max-width: 1460px) {
      width: 48%;
    }
    .begin{
      border: 4px solid #b0d1e7;
      border-radius: 50%;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      width: 28px;
      height: 28px;
      line-height: 28px;
      margin-left: 192px;
      margin-top: 4px;
      background-color: #0199e2;
      color: #fff;
      font-size: 18px;
      // cursor: pointer;
    }
    .end {
      margin-top: -4px;
    }
    .row{
      overflow: hidden;
      .time{
        float: left;
        height: 90px;
        width: 190px;
        display: block;
        font-size: 16px;
        @include flex(row, flex-end, center);
        .rangeDay {
          @include flex(column, center, flex-end);
          .down {
            font-size: 14px;
            margin-top: 5px;
          }
        }
        .rangeNotDay {
          @include flex(row, flex-end, center);
          .timeNode {
            width: 85px;
            padding: 0 5px;
            display: inline-block;
            @include flex(column, center, flex-end);
            .up {
              font-style: normal!important;
            }
            .down {
              font-style: normal!important;
              font-size: 14px;
              margin-top: 5px;
            }
          }
          .timelink {
            vertical-align: middle;
            display: inline-block;
          }
        }
      }
      .indexLine{
        float: left;
        display: block;
        width: 40px;
        height: 90px;
        position: relative;
        .index{
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #0199e2;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border: 4px solid #b0d1e7;
        }
        .line{
          position: absolute;
          left: calc(50% - 1px);
          top: 0;
          width: 2px;
          height: 100%;
          background: #0199e2;
          // .arrow {
          //   width: 0;
          //   height: 0;
          //   border-width: 10px 4px 0 4px;
          //   border-style: solid;
          //   border-color: #0199e2 transparent transparent transparent;
          //   position: absolute;
          //   bottom: 0;
          //   left: 50%;
          //   transform: translate(-50%, 2px);
          // }
        }
        .indexBox {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(45px, -50%);
          border: 2px solid #0199e2;
          @include flex(row, center, center);
          .num {
            width: 26px;
            height: 26px;
            display: block;
            background: #0199e2;
            border-radius: 50%;
            font-weight: bold;
            color: #fff;
            line-height: 26px;
            border: 2px solid #b0d1e7;
            z-index: 2;
          }
          span {
            display: inline-block;
            position: absolute;
            top: 5px;
            left: -15px;
            width: 0;
            height: 0;
            border-width: 10px 18px 10px 0;
            border-style: solid;
            border-color: transparent #0199e2 transparent transparent;
            z-index: 1;
          }
        }
      }
      .label{
        float: left;
        margin-left: 65px;
        width: 210px;
        text-align: left;
        // word-break: break-all;
        height: 90px;
        font-weight: bold;
        color: #606266;
        @include flex(row, flex-start, center);
        @media screen and (max-width: 1640px) {
          width: 135px;
        }
      }
      .iconBox{
        // float: right;
        display: block;
        height: 90px;
        @include flex(row, flex-start, center);
        .iconfont{
          font-size: 30px;
        }
        .green{
          color: #3c0
        }
        .red{
          color: #f00;
        }
        .blue{
          color: #1296db;
        }
        .disabledIcon {
          color: #ccc;
        }
        .iconfont.videoIcon{
          margin-top: 20px;
          font-size: 28px;
        }
        .minwidth{
          width: 45px;
        }
        .status{
          cursor: pointer;
        }
      }
    }
  }
  .right{
    width: 55%;
    float: right;
    margin-right: 20px;
    @media screen and (max-width: 1460px) {
      width: 50%;
    }
    .img-box{
      width: 100%;
      // height: 300px;
      margin-top: 50px;
      padding: 10px 0;
      display: inline-block;
      .swiper-slide-container {
        height: auto;
        max-height: 100%;
      }
    }
    .swiper-slide-container{
      max-width: 100%;
      width: unset!important;
    }
    .video{
      margin: 0 auto;
      height: 100%;
    }
    img{
      margin: 0 auto;
      height: 100%;
    }
  }
}
</style>
