<template>
<div class="port-bar" v-bar>
  <div class="port-M">
    <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread"/>
        <el-button class="goBack" type="white" size="small" @click='goBack'>{{$t('vicenter.common.back')}}</el-button>
    </div>
    <div class="port">
      <div class="port-Main">
        <div class="left">
          <div class="yearTask solidHeight">
            <superviseChart :data="yearTask"></superviseChart>
          </div>
          <div class="yearCheck solidHeight">
            <superviseChart :data="yearCheck"></superviseChart>
          </div>
          <div class="yearCheckRate solidHeight">
            <superviseChart :data="yearCheckRate"></superviseChart>
          </div>
          <div class="yearAveTime solidHeight">
            <superviseChart :data="yearAveTime"></superviseChart>
          </div>
        </div>
        <div class="center">
          <div class="headTitle">{{$t('vicenter.supervise.port.title')}}</div>
          <div class="box1">
            <div v-for='(item, index, key) in staticList' :key="key" class="row-list">
              <div class="iconLeft">
                <img :src='item.img'/>
              </div>
              <div class="list">
                <div class="box1-title">{{item.label}}：</div>
                <div class="box1-info">{{item.value}}{{$t('vicenter.supervise.port.unit3')}}</div>
              </div>
            </div>
          </div>
          <div class="box2">
            <div class="box2-title">
              {{passTotal.label}}
            </div>
            <div class="box2-info">
              <span class="big-font">{{passTotal.value}}</span>
              <span class="small-font">{{$t('vicenter.supervise.port.unit3')}}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="dayTask solidHeight">
            <superviseChart :data="dayTask"></superviseChart>
          </div>
          <div class="dayVitrickNum solidHeight">
            <superviseChart :data="dayCheck"></superviseChart>
          </div>
          <div class="dayCheckRate solidHeight">
            <superviseChart :data="dayCheckRate"></superviseChart>
          </div>
          <div class="dayTaskStyle solidHeight">
            <superviseChart :data="dayAveTime"></superviseChart>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import superviseChart from '@/components/supervise/chart'
import breadCrumb from '../../components/breadCrumb'
import ajax from '../../api/supervise/Port-show.js'
export default {
  data () {
    const unit1 = this.$t('vicenter.supervise.port.unit1')
    const unit2 = this.$t('vicenter.supervise.port.unit2')
    return {
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Supervise/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      passTotal: {
        label: this.$t('vicenter.supervise.port.totalClearance'),
        value: 0
      },
      staticList: [
        {
          label: this.$t('vicenter.supervise.port.totalImport'),
          value: 0,
          img: require('@/assets/img/blue/supervise/one.png')
        },
        {
          label: this.$t('vicenter.supervise.port.totalSeized'),
          value: 0,
          img: require('@/assets/img/blue/supervise/two.png')
        },
        {
          label: this.$t('vicenter.supervise.port.totalExport'),
          value: 0,
          img: require('@/assets/img/blue/supervise/three.png')
        },
        {
          label: this.$t('vicenter.supervise.port.totalTrack'),
          value: 0,
          img: require('@/assets/img/blue/supervise/four.png')
        }
      ],
      xAxisLableWrap: function (value) {
        var ret = ''// 拼接加\n返回的类目项
        var maxLength = 15// 每项显示文字个数
        var valLength = value.length// X轴类目项的文字个数
        var rowN = Math.ceil(valLength / maxLength)// 类目项需要换行的行数
        if (rowN > 1) { // 如果类目项的文字大于3,
          for (var i = 0; i < rowN; i++) {
            var temp = ''// 每次截取的字符串
            var start = i * maxLength// 开始截取的位置
            var end = start + maxLength// 结束截取的位置
            // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
            temp = value.substring(start, end) + '\n'
            ret += temp// 凭借最终的字符串
          }
          return ret
        } else {
          return value
        }
      },
      yearTask: {
        title: this.$t('vicenter.supervise.port.yearBusinessStatistics'),
        id: 'yearTaskChart',
        seriesData: [],
        xAxisData: [],
        type: 'bar',
        barWidth: 30,
        itemStyle: {
          normal: {
            color: '#00b4ff'
          }
        },
        markLine: {
          flag: false,
          value: 0
        },
        unit: unit1
      },
      yearCheck: {
        title: this.$t('vicenter.supervise.port.yearSeizedStatistics'),
        id: 'yearCheckChart',
        seriesData: [],
        xAxisData: [],
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          normal: {
            color: '#00f9f5'
          }
        },
        markLine: {
          flag: false,
          value: 0
        },
        unit: unit1
      },
      yearCheckRate: {
        title: this.$t('vicenter.supervise.port.yearSeizedRate'),
        id: 'yearCheckRate',
        series: [
          {
            type: 'gauge',
            // 半径
            radius: 130,
            // 起始角度。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            startAngle: 180,
            // 结束角度。
            endAngle: 0,
            center: ['50%', '90%'],
            // 仪表盘轴线相关配置。
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                width: 40,
                color: [[0, '#ff8290'], [0, '#485560'], [1, '#2e4b85']]
              }
            },
            // 分隔线样式。
            splitLine: {
              show: false
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            pointer: {
              // 指针长度
              length: '90%',
              width: 0
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show: false
            },
            data: [{
              value: 1,
              name: ''
            }]
          },
          {
            type: 'gauge',
            // 半径
            radius: 100,
            // 起始角度。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            startAngle: 180,
            // 结束角度。
            endAngle: 0,
            center: ['50%', '90%'],
            // 仪表盘轴线相关配置。
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                width: 40,
                color: [[0, '#242b31'], [0, '#485560'], [1, '#030408']]
              }
            },
            // 分隔线样式。
            splitLine: {
              show: false
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            pointer: {
              // 指针长度
              length: '90%',
              width: 0
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show: false
            },
            data: [{
              value: 1,
              name: ''
            }]
          },
          {
            type: 'gauge',
            // 半径
            radius: 100,
            // 起始角度。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            startAngle: 180,
            // 结束角度。
            endAngle: 0,
            center: ['50%', '90%'],
            // 仪表盘轴线相关配置。
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                width: 1,
                color: [[0, '#242b31'], [0, '#485560'], [1, '#030408']]
              }
            },
            // 分隔线样式。
            splitLine: {
              show: true,
              length: 8,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            pointer: {
              // 指针长度
              length: '90%',
              width: 0
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show: false
            },
            data: [{
              value: 1,
              name: ''
            }]
          },
          {
            type: 'gauge',
            // 半径
            radius: 85,
            // 起始角度。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            startAngle: 180,
            // 结束角度。
            endAngle: 0,
            center: ['50%', '90%'],
            // 仪表盘轴线相关配置。
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                width: 5,
                color: [[0, '#c7edfa']]
              }
            },
            // 分隔线样式。
            splitLine: {
              show: false
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            pointer: {
              // 指针长度
              length: '90%',
              width: 0
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show: true,
              offsetCenter: [0, '-30%'],
              formatter: function (value) {
                return value.toFixed(2) + '%'
              },
              textStyle: {
                fontSize: 30
              }
            },
            data: [{
              value: 0,
              name: ''
            }]
          }
        ],
        xAxisData: [],
        type: 'gauge'
      },
      yearAveTime: {
        title: this.$t('vicenter.supervise.port.yearAveTime'),
        id: 'yearAveTime',
        seriesData: [],
        xAxisData: [],
        type: 'line',
        smooth: false,
        itemStyle: {
          normal: {
            color: '#032527',
            lineStyle: {
              color: '#4dedef'
            }
          }
        },
        markLine: {
          flag: true,
          value: 0
        },
        unit: unit2
      },
      dayTask: {
        title: this.$t('vicenter.supervise.port.dayBusinessStatistics'),
        id: 'dayTask',
        seriesData: [],
        xAxisData: [],
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          normal: {
            color: '#0777db',
            barBorderRadius: 30
          }
        },
        markLine: {
          flag: false,
          value: 0
        },
        unit: unit1
      },
      dayCheck: {
        title: this.$t('vicenter.supervise.port.daySeizedStatistics'),
        id: 'dayVitrickNum',
        seriesData: [],
        xAxisData: [],
        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            color: '#035376',
            lineStyle: {
              color: '#0481b6'
            }
          }
        },
        markLine: {
          flag: false,
          value: 0
        },
        unit: unit1
      },
      dayCheckRate: {
        title: this.$t('vicenter.supervise.port.daySeizedRate'),
        id: 'dayCheckRate',
        series: [
          {
            type: 'gauge',
            // 半径
            radius: 130,
            // 起始角度。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            startAngle: 180,
            // 结束角度。
            endAngle: 0,
            center: ['50%', '90%'],
            // 仪表盘轴线相关配置。
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                width: 15,
                color: [[1, '#03141c']]
              }
            },
            // 分隔线样式。
            splitLine: {
              show: false
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            pointer: {
              // 指针长度
              length: '90%',
              width: 0
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show: false
            },
            data: [{
              value: 1,
              name: ''
            }]
          },
          {
            type: 'gauge',
            // 半径
            radius: 115,
            // 起始角度。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            startAngle: 180,
            // 结束角度。
            endAngle: 0,
            center: ['50%', '90%'],
            // 仪表盘轴线相关配置。
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                width: 30,
                color: [[0, '#4c7bd3'], [1, '#162d3f']]
              }
            },
            // 分隔线样式。
            splitLine: {
              show: false
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            pointer: {
              // 指针长度
              length: '90%',
              width: 0
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show: false
            },
            data: [{
              value: 1,
              name: ''
            }]
          },
          {
            type: 'gauge',
            // 半径
            radius: 74,
            // 起始角度。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            startAngle: 180,
            // 结束角度。
            endAngle: 0,
            center: ['50%', '90%'],
            // 仪表盘轴线相关配置。
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                width: 2,
                color: [[1, '#01648e']]
              }
            },
            // 分隔线样式。
            splitLine: {
              length: 8,
              lineStyle: {
                width: 1,
                type: 'solid',
                color: '#01648e'
              }
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            pointer: {
              // 指针长度
              length: '90%',
              width: 0
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show: false
            },
            data: [{
              value: 1,
              name: ''
            }]
          },
          {
            type: 'gauge',
            // 半径
            radius: 75,
            // 起始角度。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            startAngle: 180,
            // 结束角度。
            endAngle: 0,
            center: ['50%', '90%'],
            // 仪表盘轴线相关配置。
            axisLine: {
              show: true,
              // 属性lineStyle控制线条样式
              lineStyle: {
                width: 2,
                color: [[0.001, '#e5f4fb'], [1, '#014a6b']]
              }
            },
            // 分隔线样式。
            splitLine: {
              show: false
            },
            // 刻度样式。
            axisTick: {
              show: false
            },
            // 刻度标签。
            axisLabel: {
              show: false
            },
            // 仪表盘指针。
            pointer: {
              // 指针长度
              length: '90%',
              width: 0
            },
            // 仪表盘详情，用于显示数据。
            detail: {
              show: true,
              offsetCenter: [0, '-30%'],
              formatter: function (value) {
                return value.toFixed(2) + '%'
              },
              textStyle: {
                fontSize: 30,
                color: '#fff'
              }
            },
            data: [{
              value: 0,
              name: ''
            }]
          }
        ],
        xAxisData: [],
        type: 'gauge'
      },
      dayAveTime: {
        title: this.$t('vicenter.supervise.port.dayAveTime'),
        id: 'dayTaskStyle',
        seriesData: [],
        xAxisData: [],
        type: 'bar',
        barWidth: 30,
        itemStyle: {
          normal: {
            color: '#1bbfe9'
          }
        },
        markLine: {
          flag: true,
          value: 0
        },
        unit: unit2
      },
      xAxisLable: 20
    }
  },
  mounted () {
    this.drawCharts()
    this.getData()
  },
  methods: {
    goBack () {
      this.$router.push({ path: '/Supervise/Kolzhat-custom-show' })
    },
    initDayStaticChart (data) {
      let dayAveTime = 0
      let indexD = 0
      let dTotalSeized = 0
      let dTotalBusiness = 0
      if (data.length > 0) {
        data.forEach((item) => {
          if (item.staGroup !== null && item.staGroup !== undefined && item.staGroup !== '') {
            this.$data.dayTask.seriesData.push(item.inspectionData)
            this.$data.dayTask.xAxisData.push(this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_' + item.staGroup))
            this.$data.dayCheck.seriesData.push(item.seizeData)
            this.$data.dayCheck.xAxisData.push(this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_' + item.staGroup))
            this.$data.dayAveTime.seriesData.push(item.evgeMinu)
            this.$data.dayAveTime.xAxisData.push(this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_' + item.staGroup))
            dayAveTime += item.evgeMinu
            dTotalSeized += item.seizeData
            dTotalBusiness += item.inspectionData
            indexD++
          }
          this.$data.dayAveTime.markLine.value = (dayAveTime / indexD).toFixed(1)
          // 日统计仪表盘数值
          this.$data.dayCheckRate.series[3].data[0].value = (dTotalSeized / dTotalBusiness) * 100
          // 日统计仪表盘刻度线
          this.$data.dayCheckRate.series[1].axisLine.lineStyle.color[0][0] = (dTotalSeized / dTotalBusiness).toFixed(2)
        })
      }
    },
    getData () {
      ajax.getStatisticalData({statisType: 2}).then((res) => {
        if (res.data.flag) {
          // 日统计
          this.initDayStaticChart(res.data.result[0].listSiteBeanDto)
          // 年统计
          let yearAveTime = 0
          let indexY = 0
          let TotalSeized = 0
          let TotalBusiness = 0
          let TotalImport = 0
          let TotalExport = 0
          let TotalTracked = 0
          if (res.data.result[1].listSiteBeanDto.length > 0) {
            res.data.result[1].listSiteBeanDto.forEach((item) => {
              if (item.staGroup !== null && item.staGroup !== undefined && item.staGroup !== '') {
                this.$data.yearTask.seriesData.push(item.inspectionData)
                this.$data.yearTask.xAxisData.push(this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_' + item.staGroup))
                this.$data.yearCheck.seriesData.push(item.seizeData)
                this.$data.yearCheck.xAxisData.push(this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_' + item.staGroup))
                this.$data.yearAveTime.seriesData.push(item.evgeMinu)
                this.$data.yearAveTime.xAxisData.push(this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_' + item.staGroup))
                yearAveTime += item.evgeMinu
                TotalSeized += item.seizeData
                TotalBusiness += item.inspectionData
                indexY++
                TotalTracked += item.trackedDate
              } else {
                // 把staGroup为空的情况归到出境数据里
                TotalExport += item.inspectionData
              }
              if (item.staGroup === 'EXPORT') {
                TotalExport += item.inspectionData
              } else if (item.staGroup !== null && item.staGroup !== undefined && item.staGroup !== '') {
                TotalImport += item.inspectionData
              }
            })
            if (indexY === 0) {
              this.$data.yearAveTime.markLine.value = Number(0).toFixed(1)
            } else {
              this.$data.yearAveTime.markLine.value = (yearAveTime / indexY).toFixed(1)
            }
            if (TotalBusiness === 0) {
              // 年统计仪表盘数值
              this.$data.yearCheckRate.series[3].data[0].value = 0
              // 年统计仪表盘刻度线
              this.$data.yearCheckRate.series[0].axisLine.lineStyle.color[0][0] = Number(0).toFixed(2)
              this.$data.yearCheckRate.series[0].axisLine.lineStyle.color[1][0] = Number(0).toFixed(2)
              this.$data.yearCheckRate.series[1].axisLine.lineStyle.color[0][0] = Number(0).toFixed(2)
              this.$data.yearCheckRate.series[1].axisLine.lineStyle.color[1][0] = Number(0).toFixed(2)
              this.$data.yearCheckRate.series[3].axisLine.lineStyle.color[0][0] = Number(0).toFixed(2)
              this.$data.yearCheckRate.series[3].axisLine.lineStyle.color[0][0] = Number(0).toFixed(2)
            } else {
              // 年统计仪表盘数值
              this.$data.yearCheckRate.series[3].data[0].value = (TotalSeized / TotalBusiness) * 100
              // 年统计仪表盘刻度线
              this.$data.yearCheckRate.series[0].axisLine.lineStyle.color[0][0] = (TotalSeized / TotalBusiness).toFixed(2)
              this.$data.yearCheckRate.series[0].axisLine.lineStyle.color[1][0] = (TotalSeized / TotalBusiness).toFixed(2)
              this.$data.yearCheckRate.series[1].axisLine.lineStyle.color[0][0] = (TotalSeized / TotalBusiness).toFixed(2)
              this.$data.yearCheckRate.series[1].axisLine.lineStyle.color[1][0] = (TotalSeized / TotalBusiness).toFixed(2)
              this.$data.yearCheckRate.series[3].axisLine.lineStyle.color[0][0] = (TotalSeized / TotalBusiness).toFixed(2)
              this.$data.yearCheckRate.series[3].axisLine.lineStyle.color[0][0] = (TotalSeized / TotalBusiness).toFixed(2)
            }
          }
          // 进境总量
          this.$data.staticList[0].value = TotalImport
          // 出境总量
          this.$data.staticList[2].value = TotalExport
          // 通关总量
          this.$data.passTotal.value = this.$data.staticList[0].value + this.$data.staticList[2].value
          // 查获总量
          this.$data.staticList[1].value = TotalSeized
          // 物流监管总量
          this.$data.staticList[3].value = TotalTracked
        }
        this.drawCharts()
      }).catch(() => {})
    },
    drawCharts () {
      this.draw(this.yearTask)
      this.draw(this.yearCheck)
      this.draw(this.yearCheckRate)
      this.draw(this.yearAveTime)
      this.draw(this.dayTask)
      this.draw(this.dayCheck)
      this.draw(this.dayCheckRate)
      this.draw(this.dayAveTime)
    },
    draw (item) {
      let _this = this
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(item.id))
      var option = {}
      // 绘制图表
      if (item.type === 'pie') {
        option = {
          xAxis: {
            show: false,
            axisLabel: {
              formatter: function (value) {
                return value
                // return _this.chartsFormat(value, 10)
              }
            }
          },
          yAxis: {
            show: false
          },
          series: [{
            name: '',
            type: item.type,
            data: item.seriesData,
            radius: ['50%', '70%'],
            startAngle: 180,
            center: ['50%', '60%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }]
        }
      } else if (item.type === 'bar') {
        option = {
          tooltip: {
            confine: true,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            position: function (pos, params, dom, rect, size) {
              // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
              var obj = {top: 60}
              obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 200
              return pos
            }
          },
          xAxis: {
            type: 'category',
            data: item.xAxisData,
            axisTick: {
              show: false
            },
            splitLine: {
              show: true
            },
            axisLabel: {
              interval: 0,
              rotate: this.xAxisLable,
              formatter: function (value) {
                return _this.chartsFormat(value, 15)
              }
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            }
          },
          series: [{
            data: item.seriesData,
            type: item.type,
            barWidth: item.barWidth, // 柱图宽度
            itemStyle: item.itemStyle
          }]
        }
      } else if (item.type === 'line') {
        option = {
          tooltip: {
            confine: true,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            position: function (pos, params, dom, rect, size) {
              // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
              var obj = {top: 60}
              obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 200
              return pos
            }
          },
          legend: {
            show: false,
            data: []
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: true,
              data: item.xAxisData,
              axisTick: {
                show: false
              },
              splitLine: {
                show: true
              },
              axisLabel: {
                interval: 0,
                rotate: 20,
                formatter: function (value) {
                  return _this.chartsFormat(value, 15)
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false
              }
            }
          ],
          series: [
            {
              symbolSize: 8, // 设定实心点的大小
              type: item.type,
              areaStyle: {normal: {}},
              data: item.seriesData,
              smooth: false,
              itemStyle: item.itemStyle
            }
          ]
        }
        if (item.smooth) {
          option.series.smooth = true
        }
      } else if (item.type === 'gauge') {
        option = {
          series: item.series
        }
      }
      option.grid = {
        top: '5%',
        bottom: '13%',
        left: '4%',
        right: '8%',
        containLabel: true
      }
      if (item.type === 'bar') {
        option.xAxis.axisLine = {
          lineStyle: {
            color: '#e7e7e9',
            width: 1// 这里是为了突出显示加上的
          }
        }
        option.xAxis.splitLine = {
          show: true,
          lineStyle: {
            color: ['#151f22'],
            width: 1,
            type: 'solid'
          }
        }
        option.yAxis.axisLine = {
          lineStyle: {
            color: '#e7e7e9',
            width: 1// 这里是为了突出显示加上的
          }
        }
        option.yAxis.splitLine = {
          show: true,
          lineStyle: {
            color: ['#151f22'],
            width: 1,
            type: 'solid'
          }
        }
      }
      if (item.type === 'line') {
        option.xAxis[0].axisLine = {
          lineStyle: {
            color: '#e7e7e9',
            width: 1// 这里是为了突出显示加上的
          }
        }
        option.xAxis[0].splitLine = {
          show: true,
          lineStyle: {
            color: ['#151f22'],
            width: 1,
            type: 'solid'
          }
        }
        option.yAxis[0].axisLine = {
          lineStyle: {
            color: '#e7e7e9',
            width: 1// 这里是为了突出显示加上的
          }
        }
        option.yAxis[0].splitLine = {
          show: true,
          lineStyle: {
            color: ['#151f22'],
            width: 1,
            type: 'solid'
          }
        }
      }
      if (item.type === 'bar' || item.type === 'line') {
        if (item.markLine.flag) {
          option.series[0].markLine = {
            lineStyle: {
              type: 'solid',
              color: 'red'
            },
            data: [{
              yAxis: item.markLine.value
            }]
          }
        }
      }
      if (item.id === 'yearCheckChart') {
        option.series[0].markPoint = {
          data: [{type: 'max'}],
          symbolSize: [20, 20],
          itemStyle: {
            normal: {
              label: {
                show: false
              }
            }
          }
        }
        option.grid.top = '12%'
      }
      myChart.setOption(option)
    },
    chartsFormat (value, len) { // 图表文字太长换行显示
      var newParamsName = ''
      var paramsNameNumber = value.length
      var provideNumber = len
      var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
      if (paramsNameNumber > provideNumber) {
        for (var p = 0; p < rowNumber; p++) {
          var tempStr = ''
          var start = p * provideNumber
          var end = start + provideNumber
          if (p === rowNumber - 1) {
            tempStr = value.substring(start, paramsNameNumber)
          } else {
            tempStr = value.substring(start, end) + '\n'
          }
          newParamsName += tempStr
        }
      } else {
        newParamsName = value
      }
      if (newParamsName.length > 2 * len) {
        return newParamsName.substring(0, 2 * len) + '...'
      } else {
        return newParamsName
      }
    }
  },
  components: { superviseChart, breadCrumb }
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.port-bar{
  @extend .extend-bar;
  .port-M{
    z-index: 50;
    position: relative;
    width: $all;
    height: $all;
    background: $dmsStatisticBg;
    .breadCrumb{
      background: $dmsStatisticBreadBg no-repeat;
      background-size:100% 100%;
      -moz-background-size:100%;
      margin-top: 10px;
      margin-left: 10px;
      margin-right: 10px;
      padding: 15px;
      line-height: 30px;
      position: relative;
      .margins{
        margin: 0;
      }
      .margins .el-breadcrumb__inner.is-link{
        color: #02caf4;
      }
      .margins span:last-child .el-breadcrumb__inner.is-link{
        color: white;
      }
      .goBack {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(-20%, 23%);
      }
    }
    .port{
      // z-index: -101;
      // position: relative;
      @include box-sizing;
      width: 100%;
      height: calc(100% - 50px);
      min-height: 750px;
      .port-Main{
        .solidHeight{
          height: calc(25% - 12px);
        }
        height: $all;
        color: white;
        width: $all;
        padding: 10px 10px 0 10px;
        display: -webkit-inline-box;
        .left{
          height: $all;
          width: calc(100%*3/11 - 10px);
          margin-right: 10px;
          .yearTask{
            .chartHeight{
              margin-top:0px;
            }
          }
        }
        .center{
          width: calc(100%*5/11 - 20px);
          height: 97.4%;
          border: 1px solid #1582d4;
          background: $dmsStatisticPortBg no-repeat;
          background-size:104% 125%;
          -moz-background-size:104% 125%;
          .headTitle {
            width: 100%;
            height: 100px;
            left: 0;
            right: 0;
            background: $dmsMapTitleBg no-repeat;
            background-position: center -9px;
            color: #00d5ff;
            font-weight: bold;
            font-size: 20px;
            line-height: 55px;
          }
          .box1{
            opacity:0.8;
            filter:alpha(opacity=80);
            background: $dmsChartBg no-repeat;
            background-size:100% 100%;
            -moz-background-size:100%;
            float: left;
            // width: 190px;
            width: 255px;
            height: 315px;
            margin: -10px 0 0 17px;
            padding-bottom: 20px;
            .row-list{
              padding-top: 10px;
              height: calc(25% - 13px);
              .iconLeft{
                width: $all/4;
                height: 100%;
                float: left;
                margin-left: 10px;
                padding-top: 10px;
                .img{
                  width: 100%;
                }
              }
              .list{
                width: calc(75% - 10px);
                float: left;
                text-align: left;
                .box1-title{
                  width: $all;
                  color: #5387ff;
                  font-size: 18px;
                }
                .box1-info{
                  font-size: 25px;
                }
              }
            }
          }
          .box2{
            opacity:0.8;
            filter:alpha(opacity=80);
            background: $dmsChartBg no-repeat;
            background-size:100% 100%;
            -moz-background-size:100%;
            float: right;
            // width: 195px;
            width: 275px;
            border: 1px solid #5574c3;
            height: 90px;
            margin: -10px 15px 0 0;
            padding: 10px;
            background-color: #101e27;
            .box2-title{
              height: $all/3;
              font-size: 25px;
              color: #5387ff;
            }
            .box2-info{
              height: $all*2/3;
              .big-font{
                font-size: 50px;
                font-family: Helvetica;
              }
              .small-font{
                font-size: 20px;
              }
            }
          }
        }
        .right{
          height: $all;
          width: calc(100%*3/11 - 10px);
          margin-left: 5px;
          .dayTask{
            .chartHeight{
              // z-index: -100;
              position: relative;
              margin-top : 0px;
            }
          }
        }
        .chartHeight .supervise-title .title{
          display: inline-block;
          width: 46%;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
