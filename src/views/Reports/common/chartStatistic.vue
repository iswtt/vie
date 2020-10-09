<template>
  <div class="chart-statistic" :class="{leftAndRight: !layout, topAndBottom: layout}">
    <div v-for="(item, index) in statisticData" :key="index" class="chart-outer" :style="{width: item.width}">
      <div class="chart-container">
        <div class="chart-title">{{item.title}}</div>
        <div class="chart-box">
          <!-- 单个图表 -->
          <div v-if="!item.multiple && !item.noData" :id="item.id" :style="{width: '100%', height: item.height || '300px'}"></div>
          <!-- 多个图表 -->
          <div v-if="item.multiple && !item.noData" class="multipleChart" :style="{height: item.height || '300px'}">
            <div v-for="(multi, multiIndex) in item.multipleData" :key="multiIndex" :id="multi.id" :style="{width: multi.width, height: item.height || '300px'}"></div>
          </div>
          <div v-if="item.noData" class="noData" :style="{height: item.height || '300px'}">{{$t('vicenter.common.nodata')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      statisticData: [],
      layout: false // 布局方向
    }
  },
  created () {
  },
  mounted () {
    this.getData()
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    getData () {
      this.statisticData = this.$props.chartStatisticData
      if (this.statisticData && this.statisticData.length > 0) {
        this.statisticData.forEach(item => {
          if (item.multiple || item.column) {
            // 如果一个页签有多个图表或者两个页签纵向排列的时候，需要修改布局方式
            this.layout = true
          }
          if (item.multiple) {
            // 一个页签多个图表
            if (item.multipleData && item.multipleData.length > 0) {
              item.multipleData.forEach(mul => {
                this.loadChart(mul)
              })
            }
          } else {
            // 一个页签一个图表
            this.loadChart(item)
          }
        })
      }
    },
    loadChart (item) {
      if (item.chartType === 'bar') {
        this.initBarChart(item.id, item.data, item.yAxisData, item.colors, item.hideLegend, item.dataZoom)
      } else if (item.chartType === 'pie') {
        this.initPieChart(item.id, item.data, item.colors)
      } else if (item.chartType === 'ring') {
        this.initRingChart(item.id, item.data, item.colors)
      } else if (item.chartType === 'barAndLine') {
        this.initBarAndLineChart(item.id, item.data, item.xAxisData, item.colors, item.isLegendChange, item.isHasLine)
      } else if (item.chartType === 'line') {
        this.initLineChart(item.id, item.data, item.xAxisData, item.colors)
      }
    },
    initBarChart (chartId, data, yAxisData, colors, hideLegend = false, dataZoom = false) {
      if (!document.getElementById(chartId)) {
        return
      }
      let legendData = []
      let seriesData = []
      if (data && data.length > 0) {
        legendData = data.map(item => {
          return item.name
        })
        seriesData = data.map(item => {
          return {
            name: item.name,
            type: 'bar',
            stack: item.stack || '',
            data: item.seriesData
          }
        })
      }
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left'
        },
        legend: {
          show: !hideLegend,
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: colors,
        dataZoom: [
          {
            disabled: !dataZoom,
            type: 'inside',
            yAxisIndex: [0]
          },
          {
            show: dataZoom,
            type: 'slider',
            yAxisIndex: [0],
            showDetail: false,
            right: 0
          }
        ],
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: yAxisData
          }
        ],
        grid: {
          top: '2%',
          bottom: '10%',
          left: '2%',
          right: '3%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initPieChart (chartId, data, colors) {
      if (!document.getElementById(chartId)) {
        return
      }
      let legends = []
      let seriesData = []
      if (data && data.length > 0) {
        legends = data.map(item => {
          return {
            icon: 'circle',
            name: item.name
          }
        })
        seriesData = data.map(item => {
          return {
            value: item.value ? item.value : null, // 数据为0时不显示
            name: item.name,
            label: {
              normal: {
                align: 'left',
                formatter: '{b}\n{d}%'
                // formatter: '{dot|}{b}\n{d}%',
                // rich: {
                //   dot: {
                //     width: 10,
                //     height: 10,
                //     borderRadius: 10,
                //     backgroundColor: '#333333'
                //   }
                // }
              }
            }
          }
        })
      }
      let myChart = this.$echarts.init(document.getElementById(chartId))
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
          bottom: 5,
          left: 'center',
          itemWidth: 14,
          data: legends
        },
        color: colors,
        series: [
          {
            type: 'pie',
            center: ['50%', '45%'],
            radius: ['45%', '65%'],
            selectedMode: 'single',
            data: seriesData
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initRingChart (chartId, data, colors) {
      if (!document.getElementById(chartId)) {
        return
      }
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        tooltip: {
          show: false
        },
        legend: {
          show: true,
          bottom: 5,
          left: 'center',
          itemWidth: 14,
          selectedMode: false,
          data: [
            {
              icon: 'circle',
              name: data.name
            }
          ]
        },
        color: [colors, '#bcbcbc'],
        graphic: [{
          type: 'text',
          left: 'center',
          top: '40%',
          z: 99,
          style: {
            text: Math.round(data.value * 100) + '%',
            textAlign: 'center',
            fill: '#bcbcbc',
            fontSize: 26,
            fontFamily: 'Microsoft YaHei'
          }
        }],
        series: [
          {
            type: 'pie',
            center: ['50%', '45%'],
            radius: ['40%', '65%'],
            clockWise: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: data.value,
                name: data.name
              },
              {
                value: 1 - data.value,
                name: ''
              }
            ]
          },
          {
            name: 'core',
            type: 'pie',
            center: ['50%', '45%'],
            radius: ['0%', '40%'],
            hoverAnimation: false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                itemStyle: {
                  color: '#ffffff'
                }
              }
            ]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initBarAndLineChart (chartId, data, xAxisData, colors, isLegendChange, isHasLine) {
      if (!document.getElementById(chartId)) {
        return
      }
      let legendData = []
      let seriesData = []
      if (data && data.length > 0) {
        legendData = data.map(item => {
          return item.name
        })
        seriesData = data.map(item => {
          return {
            name: item.name,
            type: item.type || 'bar',
            label: {
              normal: {
                show: item.type !== 'line', // 柱状图和折线图混合时，折线图不显示数值
                position: 'top',
                textStyle: {
                  color: '#6b6b6b'
                },
                formatter: function (params) {
                  if (item.stack) {
                    // 堆叠柱状图显示总和
                    let datavalue = 0
                    for (var i = 0; i < seriesData.length; i++) {
                      if (seriesData[i].type !== 'line') {
                        // 柱状图和折线图混合时，折线数值不计算入总数
                        if (seriesData[i] && seriesData[i].data) {
                          datavalue += seriesData[i].data[params.dataIndex]
                        }
                      }
                    }
                    return datavalue
                  } else {
                    return params.value
                  }
                }
              }
            },
            yAxisIndex: item.yAxisIndex || 0,
            stack: item.stack || '',
            data: item.seriesData,
            barMaxWidth: 80
          }
        })
      }
      let myChart = this.$echarts.init(document.getElementById(chartId))
      myChart.clear()
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left',
          formatter: function (item) {
            let tipStr = `${item[0].axisValueLabel}`
            item.forEach(i => {
              if (i.seriesType === 'line') {
                tipStr += `<br/>${i.marker}${i.seriesName}: ${i.value}%`
              } else {
                tipStr += `<br/>${i.marker}${i.seriesName}: ${i.value}`
              }
            })
            return tipStr
          }
        },
        legend: {
          show: true,
          selectedMode: false,
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: colors,
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisLabel: {
              rotate: -30
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          top: '4%',
          bottom: '10%',
          left: '2%',
          right: '3%',
          containLabel: true
        },
        series: seriesData
      }
      if (isLegendChange) {
        option.legend = {
          show: true,
          selectedMode: false,
          orient: 'vertical',
          right: 5,
          top: 10,
          data: legendData
        }
        option.xAxis[0].axisLabel = {}
        option.grid.right = '8%'
        option.grid.bottom = '2%'
      }
      if (isHasLine) {
        option.yAxis.push({
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}%'
          }
        })
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initLineChart (chartId, data, xAxisData, colors) {
      if (!document.getElementById(chartId)) {
        return
      }
      let legendData = []
      let seriesData = []
      if (data && data.length > 0) {
        legendData = data.map(item => {
          return item.name
        })
        seriesData = data.map(item => {
          return {
            name: item.name,
            type: 'line',
            stack: item.stack || '',
            data: item.seriesData,
            barMaxWidth: 80
          }
        })
      }
      let myChart = this.$echarts.init(document.getElementById(chartId))
      myChart.clear()
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left'
        },
        legend: {
          show: true,
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: colors,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true, // 两边留白
            data: xAxisData,
            axisLabel: {
              rotate: -30
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          top: '2%',
          bottom: '10%',
          left: '2%',
          right: '3%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  },
  watch: {
  },
  components: {},
  props: {
    'chartStatisticData': {
      type: Array,
      default: []
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.chart-statistic {
  width: $all;
  height: calc(100% - 120px);
  .chart-outer {
    padding: 6px 10px;
    @include box-sizing();
    .chart-container {
      width: $all;
      border: 1px solid #e9e9e9;
      border-radius: 4px;
      .chart-title {
        border-bottom: 1px solid #e9e9e9;
        text-align: left;
        line-height: 44px;
        padding-left: 25px;
        font-size: 14px;
        font-weight: bold;
      }
      .chart-box {
        padding-top: 10px;
      }
      .chart-box>div {
        width: calc(100% - 10px);
      }
      .chart-box>.multipleChart {
        @include flex(row, center, center);
      }
      .noData {
        line-height: 300px;
        text-align: center;
        color: #909399;
        font-size: 14px;
      }
    }
  }
}
.leftAndRight {
  @include flex(row, center, flex-start);
}
.topAndBottom {
  @include flex(column, flex-start, flex-start);
}
</style>
