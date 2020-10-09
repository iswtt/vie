<template>
  <div class="imageLibrary-dashboard">
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread"/>
    </div>
    <div class="statistic-container" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)">
      <div v-for="(chart, index) in allCharts" class="chart-outer" :style="{width: chart.width, height: chart.height}" :key="index">
        <div class="chart-box">
          <div class="chart-border">
            <div class="chartTitle">{{chart.title}}</div>
            <div v-if="!chart.noData" :id="chart.id" class="chart"></div>
            <div v-if="chart.noData" class="chartNoData">{{$t('vicenter.common.nodata')}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import ComTable from '@/components/table'
import ajax from '@/api/imageLibrary/imageStatistics.js'
export default {
  name: 'dashboard',
  data () {
    return {
      loading: false,
      ajaxNum: 0,
      titleBread: {
        font: '/',
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title)
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      allCharts: [
        {
          width: '50%',
          height: '50%',
          title: this.$t('vicenter.ImageLibrary.dashboard.recommendTop'),
          id: 'recommendTopChart',
          type: 'recommend',
          colors: [],
          legend: [],
          noData: true
        },
        {
          width: '50%',
          height: '50%',
          title: this.$t('vicenter.ImageLibrary.dashboard.usageTop'),
          id: 'usageTopChart',
          type: 'usage',
          colors: [],
          legend: [],
          noData: true
        },
        {
          width: '33.33%',
          height: '50%',
          title: this.$t('vicenter.ImageLibrary.dashboard.imageTypeStatistics'),
          id: 'imageTypeChart',
          type: 'type',
          colors: ['#52c2d0', '#f5497a'],
          legend: ['STANDARD', 'ILLEGAL'],
          noData: true
        },
        {
          width: '33.33%',
          height: '50%',
          title: this.$t('vicenter.ImageLibrary.dashboard.imageStatusStatistics'),
          id: 'imageStatusChart',
          type: 'status',
          colors: [],
          legend: ['TEMPORARY', 'SUBMIT', 'PUBLISHED', 'REJECTED'],
          noData: true
        },
        {
          width: '33.34%',
          height: '50%',
          title: this.$t('vicenter.ImageLibrary.dashboard.imageSourceStatistics'),
          id: 'imageSourceChart',
          type: 'source',
          colors: [],
          legend: ['MANNUAL', 'SUPERVISION'],
          noData: true
        }
      ],
      colors: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa'],
      commonObj: {
        STANDARD: {
          label: this.$t('vicenter.ImageLibrary.common.imageType.STANDARD'),
          model: 'standardNum'
        },
        ILLEGAL: {
          label: this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL'),
          model: 'irregularNum'
        },
        PUBLISHED: {
          label: this.$t('vicenter.ImageLibrary.common.imageStatus.PUBLISHED'),
          model: 'publishedNum'
        },
        REJECTED: {
          label: this.$t('vicenter.ImageLibrary.common.imageStatus.REJECTED'),
          model: 'rejectedNum'
        },
        SUBMIT: {
          label: this.$t('vicenter.ImageLibrary.common.imageStatus.SUBMIT'),
          model: 'submittedNum'
        },
        TEMPORARY: {
          label: this.$t('vicenter.ImageLibrary.common.imageStatus.TEMPORARY'),
          model: 'temporaryNum'
        },
        MANNUAL: {
          label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.MANNUAL'),
          model: 'mannualNum'
        },
        INSPECTION: {
          label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.INSPECTION'),
          model: 'inspectionNum'
        },
        SUPERVISION: {
          label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.SUPERVISION'),
          model: 'supervisionNum'
        }
      },
      timer: null
    }
  },
  mounted () {
    this.getData()
    this.timer = setInterval(() => {
      this.getData()
    }, window.config.boardRefreshTime)
  },
  methods: {
    getData () {
      this.loading = true
      // 获取推荐数量统计数据
      ajax.queryByImgRecommend().then(res => {
        if (res.data.flag) {
          if (res.data.result && res.data.result.length > 0) {
            this.allCharts[0].noData = false
            this.initBar(this.allCharts[0].id, res.data.result, this.allCharts[0].type)
          } else {
            this.allCharts[0].noData = true
          }
        }
        this.ajaxNum++
      }).catch(() => {})
      // 获取使用情况统计数据
      ajax.queryByImgUse().then(res => {
        if (res.data.flag) {
          if (res.data.result && res.data.result.length > 0) {
            this.allCharts[1].noData = false
            this.initBar(this.allCharts[1].id, res.data.result, this.allCharts[1].type)
          } else {
            this.allCharts[0].noData = true
          }
        }
        this.ajaxNum++
      }).catch(() => {})
      // 获取图像类型、状态和来源统计数据
      ajax.queryByImgDistribution().then(res => {
        if (res.data.flag && res.data.result) {
          if (res.data.result) {
            this.allCharts.forEach((e, index) => {
              if (index > 1) {
                e.noData = false
                this.initPie(e.id, res.data.result, e.colors, e.type)
              }
            })
          } else {
            this.allCharts.forEach((e, index) => {
              if (index > 1) {
                e.noData = true
              }
            })
          }
        }
        this.ajaxNum++
      }).catch(() => {})
    },
    initBar (domId, data, type) {
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initBar(domId, data, type)
        })
        return
      }
      let legendData = []
      let seriesData = []
      if (data.length > 0) {
        // Top7只取前七条数据
        if (data.length > 7) {
          data.splice(7)
        }
        if (type === 'recommend') {
          legendData = data.map(item => item.userAccount)
          seriesData = data.map((item, index) => {
            let obj = {
              name: item.userAccount,
              type: 'bar',
              barMaxWidth: 80,
              barGap: '100%',
              data: [(item.imgTypeItem.standardNum || 0) + (item.imgTypeItem.irregularNum || 0)]
            }
            return obj
          })
        } else if (type === 'usage') {
          legendData = data.map(item => item.imgName)
          seriesData = data.map((item, index) => {
            let obj = {
              name: item.imgName,
              type: 'bar',
              barMaxWidth: 80,
              barGap: '100%',
              data: [item.useNum]
            }
            return obj
          })
        }
      }
      let myChart = this.$echarts.init(chartDom)
      let option = {
        tooltip: {
          trigger: 'item',
          extraCssText: 'text-align: left'
        },
        legend: {
          type: 'scroll',
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: this.colors,
        xAxis: [
          {
            type: 'category'
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          top: '8%',
          bottom: '10%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initPie (domId, data, color, type) {
      let _this = this
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        setTimeout(() => {
          _this.initPie(domId, data, color, type)
        })
        return
      }
      let { standardStatusItem, irregularStatusItem, standardCollectModeItem, irregularCollectModeItem } = data
      let legendData = []
      let seriesData = []
      if (type === 'type') {
        let standardNum = 0
        let irregularNum = 0
        for (let s in standardStatusItem) {
          standardNum += standardStatusItem[s] || 0
        }
        for (let i in irregularStatusItem) {
          irregularNum += irregularStatusItem[i] || 0
        }
        legendData = this.allCharts[2].legend.map(e => this.commonObj[e].label)
        seriesData = [
          {
            name: legendData[0],
            value: standardNum,
            label: {
              normal: {
                align: 'left',
                formatter: '{b}: {c} ({d}%)'
              }
            }
          },
          {
            name: legendData[1],
            value: irregularNum,
            label: {
              normal: {
                align: 'left',
                formatter: '{b}: {c} ({d}%)'
              }
            }
          }
        ]
      } else if (type === 'status') {
        legendData = this.allCharts[3].legend.map(e => this.commonObj[e].label)
        seriesData = this.allCharts[3].legend.map(e => {
          return {
            name: this.commonObj[e].label,
            value: (standardStatusItem[this.commonObj[e].model] || 0) + (irregularStatusItem[this.commonObj[e].model] || 0),
            label: {
              normal: {
                align: 'left',
                formatter: '{b}: {c} ({d}%)'
              }
            }
          }
        })
      } else if (type === 'source') {
        legendData = this.allCharts[4].legend.map(e => this.commonObj[e].label)
        seriesData = this.allCharts[4].legend.map(e => {
          return {
            name: this.commonObj[e].label,
            value: (standardCollectModeItem[this.commonObj[e].model] || 0) + (irregularCollectModeItem[this.commonObj[e].model] || 0),
            label: {
              normal: {
                align: 'left',
                formatter: '{b}: {c} ({d}%)'
              }
            }
          }
        })
      }
      let myChart = this.$echarts.init(chartDom)
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          position: function (pos, params, dom, rect, size) { // 设置提示框位置
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 30
            return obj
          }
        },
        legend: {
          show: true,
          type: 'scroll',
          icon: 'circle',
          bottom: 5,
          left: 'center',
          itemWidth: 14,
          data: legendData
        },
        color: color.length > 0 ? color : this.colors,
        series: [
          {
            type: 'pie',
            center: ['50%', '45%'],
            selectedMode: 'single',
            data: seriesData
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  },
  watch: {
    ajaxNum: {
      handler (newVal, oldVal) {
        if (newVal === 3) {
          this.loading = false
          this.ajaxNum = 0
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.timer)
    next()
  },
  components: { ComTable, breadCrumb }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.imageLibrary-dashboard {
  width: $all;
  height: $all;
  padding: 15px;
  @include box-sizing();
  .statistic-container {
    height: calc(100% - 35px);
    @include flex(row, flex-start, flex-start);
    flex-wrap: wrap;
    .chart-outer {
      @include box-sizing();
      padding: 5px;
      .chart-box {
        height: $all;
        background-color: #f7fafd;
        @include box-sizing();
        padding: 8px;
        .chart-border {
          padding: 0 10px;
          width: $all;
          height: $all;
          border: 1px solid #e9edf5;
          border-radius: 10px;
          @include box-sizing();
          background-color: $white;
          .chartTitle {
            font-size: 14px;
            font-weight: bold;
            height: 40px;
            line-height: 40px;
            text-align: left;
            border-bottom: 1px solid #e9edf5;
            @include box-sizing();
          }
          .chart {
            width: $all;
            height: calc(100% - 40px);
          }
          .chartNoData {
            width: $all;
            height: calc(100% - 40px);
            @include flex(row, center, center);
            color: #909399;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
