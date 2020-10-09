<template>
  <div id='supervise-map' ref="mapContainer" @dblclick="handleFullScreen">
    <!-- 地图区域 -->
    <div class="map">
      <!-- 标题 -->
      <div class="head-title">{{headTitle}}</div>
      <Map
        @getProperty='handleFeatureClick'
        ref="map">
      </Map>
      <!-- 返回按钮区域 -->
      <el-button v-show="backBtnObj.isShowBack" class="back-button" type="white" size="mini" @click="backBtnObj.func">{{backBtnObj.text}}</el-button>
      <i class="iconfont full-screen-button" @click="handleFullScreen" v-html="fullscreen? '&#xe6b2;' : '&#xe6b1;'"></i>
    </div>
    <!-- 统计区域 -->
    <div class="info-preview">
      <div class="info-container" v-bar>
        <div class="info">
          <div>
            <SuperviseChart :data="allTaskData"></SuperviseChart>
            <SuperviseChart :data="chartData"></SuperviseChart>
            <!-- 查验业务量趋势统计 -->
            <SuperviseChart :data="taskTrend"></SuperviseChart>
            <!-- 最新查验有嫌疑查验数据 -->
            <chartList :data="latestList"></chartList>
            <!-- 只在口岸级别显示 -->
            <SuperviseChart v-if="willToView === 'Region'" :data="analysisChartData"></SuperviseChart>
            <SuperviseChart v-if="willToView === 'Region'" :data="physicalChartData"></SuperviseChart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ajax from '@/api/supervise/Statistics.js'
import Map from '@/components/map/views/map' // 只包含简单功能地图组件
import icons from '@/components/map/lib/importIcon.js' // 所有图标
import SuperviseChart from '@/components/supervise/mapChart'
import chartList from '@/components/supervise/chartList'
// 各级别范围[左下角经度,左下角纬度,右上角经度,右上角纬度]
let centerExtent = []
let regionExtent = []
let stationExtent = []
// 中心点坐标[中心点经度,中心点纬度]
let centerCoords = [] // 当前总署中心点
let regionCoords = [] // 当前关区中心点
let stationCoords = [] // 当前总口岸中心点
let extentArr = [] // 用于记录坐标范围
export default {
  name: 'map',
  data () {
    return {
      fullscreen: false, // 是否全屏
      headTitle: '',
      backBtnObj: { // 返回按钮相关
        isShowBack: false,
        func: this.backBtnFunc,
        text: ''
      },
      willToView: 'Center', // 点击按钮将要切换到的视图(上一次暂时的地图显示级别)
      regionId: '', // 某关区id
      stationId: '', // 某口岸id
      allOrgData: {
        center: [],
        region: [],
        station: [],
        scanner: []
      },
      allTaskData: {
        totalStatistic: true,
        totalStatisticData: [
          {
            label: this.$t('vicenter.supervise.map.totalBusVolume'),
            value: '0',
            ruleprop: 'insNum'
          },
          {
            label: this.$t('vicenter.supervise.map.totalNoSuspectQty'),
            value: '0',
            ruleprop: 'noSusNum'
          },
          {
            label: this.$t('vicenter.supervise.map.totalSeizedQty'),
            value: '0',
            ruleprop: 'checkNum'
          }
        ],
        height: '190px',
        title: this.$t('vicenter.supervise.map.dailylBusVolume'),
        id: 'taskStatistic',
        unit: this.$t('vicenter.supervise.port.unit1'),
        noData: false,
        isShowLegend: false,
        legendSetting: [
          {
            color: '#3dca84',
            text: this.$t('vicenter.supervise.map.imgAnalysisNoSuspect')
          },
          {
            color: '#f2cc10',
            text: this.$t('vicenter.supervise.map.imgAnalysisSuspect')
          },
          {
            color: '#45aadd',
            text: this.$t('vicenter.supervise.map.phyInspectionNoSuspect')
          },
          {
            color: '#f17680',
            text: this.$t('vicenter.supervise.map.phyInspectionSeized')
          }
        ]
      },
      chartData: {
        totalStatistic: false,
        height: '190px',
        title: this.$t('vicenter.supervise.map.dailyRegionBusVolume'),
        id: 'regionStatistics',
        unit: this.$t('vicenter.supervise.port.unit1'),
        noData: false,
        chartName: ''
      },
      // 最新有嫌疑列表
      latestList: {
        height: '190px',
        title: this.$t('vicenter.supervise.map.latestList'),
        id: 'latestList',
        unit: this.$t('vicenter.supervise.port.unit1'),
        noData: false,
        list: []
      },
      // 查验业务量趋势统计
      taskTrend: {
        totalStatistic: false,
        height: '190px',
        title: this.$t('vicenter.supervise.map.taskTrend'), // 查验业务量趋势统计
        id: 'taskTrendStatistics',
        unit: this.$t('vicenter.supervise.port.unit1'),
        noData: false,
        chartName: ''
      },
      analysisChartData: {
        totalStatistic: false,
        height: '190px',
        title: this.$t('vicenter.supervise.map.dailyInspectorWork'),
        id: 'analysisStatistics',
        unit: this.$t('vicenter.supervise.port.unit1'),
        noData: false,
        chartName: 'analysis'
      },
      physicalChartData: {
        totalStatistic: false,
        height: '190px',
        title: this.$t('vicenter.supervise.map.dailyManualInspectorWork'),
        id: 'physicalStatistics',
        unit: this.$t('vicenter.supervise.port.unit1'),
        noData: false,
        chartName: 'physical'
      },
      type: [
        this.$t('vicenter.supervise.map.totalNoSuspectQty'), this.$t('vicenter.supervise.map.seizedQty')
      ],
      manualType: [
        this.$t('vicenter.supervise.checkStatistics.noCheckNum'), this.$t('vicenter.supervise.map.seizedQty')
      ],
      analysisType: [
        this.$t('vicenter.supervise.map.totalNoSuspectQty'), this.$t('vicenter.supervise.map.suspectQty')
      ],
      groupItems: [], // 存放当前机构下的子机构id和name
      inspectorGroup: [], // 存放当前机构下的所有审图员
      physicalGroup: [], // 存放当前机构下的所有手检员
      refresh: '',
      refreshData: {
        id: '',
        type: ''
      }
    }
  },
  mounted () {
    // 获取地图上各坐标点
    this.getMapOrgNodes()
    this.refresh = this.$refreshList(this.refreshFuc)
  },
  methods: {
    refreshFuc () {
      this.getStatisticsData(this.refreshData.id, this.refreshData.type)
    },
    handleFullScreen () {
      let element = this.$refs.mapContainer
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.fullscreen = false
      } else {
        if (element.requestFullscreen) {
          let _this = this
          element.requestFullscreen()
          document.addEventListener('fullscreenchange', function () {
            if (document.fullscreenElement != null) {
              _this.fullscreen = true
            } else {
              _this.fullscreen = false
            }
          })
        } else if (element.webkitRequestFullScreen) {
          let _this = this
          element.webkitRequestFullScreen()
          document.addEventListener('webkitfullscreenchange', function () {
            if (document.webkitFullScreenElement != null) {
              _this.fullscreen = true
            } else {
              _this.fullscreen = true
            }
          })
        } else if (element.mozRequestFullScreen) {
          let _this = this
          document.addEventListener('mozfullscreenchange', function () {
            if (document.mozFullScreenElement != null) {
              _this.fullscreen = true
            } else {
              _this.fullscreen = true
            }
          })
        } else if (element.msRequestFullscreen) {
          let _this = this
          element.msRequestFullscreen() // IE11
          document.addEventListener('MSFullscreenChange', function () {
            if (document.msFullscreenElement != null) {
              _this.fullscreen = true
            } else {
              _this.fullscreen = true
            }
          })
        }
      }
    },
    getMapOrgNodes () {
      this.allOrgData = {
        center: [],
        region: [],
        station: [],
        scanner: []
      }
      ajax.getOrgPortDeviceTree().then((res) => {
        if (res.data.flag) {
          this.getCoordsArr(res.data.result)
          // 总署界面只显示中心、关区，隐藏口岸、设备
          this.toogleView('', 'Center', centerCoords)
          // 初始化统计图表数据
          this.getStatisticsData('', 'Center')
        }
      }).catch(() => {})
    },
    getCoordsArr (data) {
      data.forEach(e => {
        if (e.orgType === 'admin' || (e.orgType === null && e.type === 'org')) {
          centerCoords = [e.longitude, e.latitude]
          this.allOrgData.center.push({
            lng: e.longitude,
            lat: e.latitude,
            text: e.name,
            attr: {
              id: e.id,
              type: 'Center',
              coords: centerCoords,
              extent: [],
              pid: e.pid
            },
            src: icons.centerIcon
          })
        } else if (e.orgType === 'customs') {
          this.allOrgData.region.push({
            lng: e.longitude,
            lat: e.latitude,
            text: e.name,
            attr: {
              id: e.id,
              type: 'Region',
              coords: [e.longitude, e.latitude],
              extent: [],
              pid: e.pid
            },
            src: icons.regionIcon
          })
        } else if (e.orgType === 'port') {
          this.allOrgData.station.push({
            lng: e.longitude,
            lat: e.latitude,
            text: e.name,
            attr: {
              id: e.id,
              type: 'Station',
              coords: [e.longitude, e.latitude],
              extent: [],
              pid: e.pid
            },
            src: icons.stationIcon
          })
        } else if (e.type === 'device') {
          this.allOrgData.scanner.push({
            lng: e.longitude,
            lat: e.latitude,
            text: e.name,
            attr: {
              id: e.id,
              type: 'Scanner',
              coords: [e.longitude, e.latitude],
              extent: [],
              pid: e.pid
            },
            src: icons.scannerIcon
          })
        }
        if (e.children && e.children.length > 0) {
          this.getCoordsArr(e.children)
        }
      })
    },
    getPersonAndPort (roleCode, data) {
      let params = {
        roleCode: roleCode
      }
      this.inspectorGroup = []
      this.physicalGroup = []
      ajax.getPersonAndPort(params).then((res) => {
        if (res.data.flag && res.data.result && res.data.result.length > 0) {
          res.data.result.forEach(e => {
            if (params.roleCode === 'INSPECTOR' && e.orgId === this.stationId) {
              // 审图员
              this.inspectorGroup.push({
                id: e.id,
                name: e.name
              })
            } else if (params.roleCode === 'PHYSICAL-INSPECTOR' && e.orgId === this.stationId) {
              // 手检员
              this.physicalGroup.push({
                id: e.id,
                name: e.name
              })
            }
          })
          if (params.roleCode === 'INSPECTOR') {
            data.groupItems = this.filterParamsFormate(this.inspectorGroup)
            // 加载审图员工作量统计图表数据
            ajax.getAnalysisReport(data).then((res) => {
              if (res.data.flag) {
                this.analysisChartData.noData = false
                let result = []
                Object.assign(result, res.data.result)
                this.initChartData(this.analysisChartData, result, this.analysisType, 'Analysis')
              } else {
                this.analysisChartData.noData = true
              }
            }).catch(() => {})
          } else if (params.roleCode === 'PHYSICAL-INSPECTOR') {
            data.groupItems = this.filterParamsFormate(this.physicalGroup)
            // 加载手检员工作量统计图表数据
            ajax.getPhysicalReport(data).then((res) => {
              if (res.data.flag) {
                this.physicalChartData.noData = false
                let result = []
                Object.assign(result, res.data.result)
                this.initChartData(this.physicalChartData, result, this.manualType, 'Physical')
              } else {
                this.physicalChartData.noData = true
              }
            }).catch(() => {})
          }
        }
      }).catch(() => {})
    },
    filterParamsFormate (params) {
      let paramsStr = ''
      let tempArr = []
      if (params.length > 0) {
        params.forEach(e => {
          tempArr.push(`{id:'${e.id}',name:'${e.name}'}`)
        })
      } else {
        return '[]'
      }
      paramsStr = `[${tempArr.join(',')}]`
      return paramsStr
    },
    // 元素点击操作
    handleFeatureClick (data) {
      let { id, coords, type } = data.attr
      // 切换到对应视图，设置中心点，区域范围
      this.toogleView(id, type, coords)
      // 加载统计信息
      this.getStatisticsData(id, type)
    },
    // 切换地图视图
    toogleView (id, type, coords) {
      if (type === 'Center') {
        this.clearMarkers('Station')
        this.clearMarkers('Scanner')
        this.getCenter(this.allOrgData.center)
        this.getRegion(this.allOrgData.region)
        let tempArr = []
        this.allOrgData.center.forEach(c => {
          tempArr.push(c)
        })
        this.allOrgData.region.forEach(r => {
          tempArr.push(r)
        })
        this.getExtentArr(tempArr)
        this.headTitle = this.allOrgData.center[0].text
        this.backBtnObj.isShowBack = false
        // 图表标题
        this.chartData.title = this.$t('vicenter.supervise.map.dailyRegionBusVolume')
        // 设置中心点坐标
        centerCoords = coords
        // this.setMapCenter(coords)
        // 设置缩放比例
        // this.setMapZoomLevel(9)
      } else if (type === 'Region') {
        this.regionId = id
        this.clearMarkers('Center')
        this.clearMarkers('Region')
        this.clearMarkers('Scanner')
        this.getStation(this.allOrgData.station)
        this.allOrgData.region.forEach(e => {
          if (e.attr.id === this.regionId) {
            this.headTitle = e.text
          }
        })
        this.backBtnObj.isShowBack = true
        this.backBtnObj.text = this.$t('vicenter.supervise.map.backToCenter')
        this.willToView = 'Center'
        // 图表标题
        this.chartData.title = this.$t('vicenter.supervise.map.dailyPortBusVolume')
        // 设置中心点坐标
        regionCoords = coords
        // this.setMapCenter(coords)
        // 设置缩放比例
        // this.setMapZoomLevel(15)
      } else if (type === 'Station') {
        this.stationId = id
        this.clearMarkers('Center')
        this.clearMarkers('Region')
        this.clearMarkers('Station')
        this.getScanner(this.allOrgData.scanner)
        this.allOrgData.station.forEach(e => {
          if (e.attr.id === this.stationId) {
            this.headTitle = e.text
          }
        })
        this.backBtnObj.isShowBack = true
        this.backBtnObj.text = this.$t('vicenter.supervise.map.backToRegion')
        this.willToView = 'Region'
        // 图表标题
        this.chartData.title = this.$t('vicenter.supervise.map.dailyDeviceScanVolume')
        // 设置中心点坐标
        stationCoords = coords
        // this.setMapCenter(coords)
        // 设置缩放比例
        // this.setMapZoomLevel(17)
      }
    },
    getStatisticsData (id, type) {
      this.refreshData.id = id
      this.refreshData.type = type
      let params = {}
      if (type === 'Region') {
        params = {
          groupType: 'port',
          customIds: id,
          groupItems: this.filterParamsFormate(this.groupItems)
        }
      } else if (type === 'Station') {
        params = {
          groupType: 'dev',
          portIds: id,
          groupItems: this.filterParamsFormate(this.groupItems)
        }
      } else if (type === 'Center') {
        params = {
          groupType: 'cus',
          groupItems: this.filterParamsFormate(this.groupItems)
        }
      } else if (type === 'Scanner') {
        return
      }
      // 当日0点0分0秒
      params.startDate = new Date(new Date().toLocaleDateString()).getTime()
      // 当日23点59分59秒
      params.endDate = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
      ajax.getInspectStatistics(params).then((res) => {
        if (res.data.flag) {
          this.chartData.noData = false
          let result = {}
          Object.assign(result, res.data.result)
          this.allTaskData.totalStatisticData.forEach(e => {
            e.value = result[e.ruleprop]
            if (e.ruleprop === 'noSusNum') {
              e.value = result.noSusNum + result.noCheckNum // 无嫌疑量=审图无嫌疑量+手检无查获量
            }
          })
          // 初始化当日业务量数据和图表
          this.initTotalStatisticsData(this.allTaskData.id, result)
          // 初始化其他图表数据
          this.initChartData(this.chartData, result.itemList, this.type)
        } else {
          this.chartData.noData = true
        }
      }).catch(() => {})
      if (type === 'Station') {
        this.getPersonAndPort('INSPECTOR', params)
        this.getPersonAndPort('PHYSICAL-INSPECTOR', params)
      }
      let data = {
        dateType: 'year',
        startDate: params.startDate,
        endDate: params.endDate
      }
      ajax.taskTrendReport({}).then((res) => {
        if (res.data.flag) {
          // 初始化业务量趋势统计
          this.initTaskTrend(this.taskTrend, res.data.result)
        }
      })
      ajax.maplistpage({page: 0, size: 6, concImgcheck: 'CONC001'}).then((res) => {
        if (res.data.flag) {
          this.initLatestList(res.data.result.content)
        }
      })
      this.initLatestList()
    },
    // 初始化最新有嫌疑列表
    initLatestList (data) {
      this.latestList.list = data
    },
    // 初始化业务量趋势统计
    initTaskTrend (taskTrend, result) {
      if (!result) {
        return
      }
      let susNums = []
      let noSusNums = []
      let susRates = []
      let dataArr = []
      result.forEach(e => {
        dataArr.push(this.$t(e.smouth))
        susNums.push(e.susNum)
        noSusNums.push(e.noSusNum)
        susRates.push(Math.round(e.susRate * Math.pow(10, 2) * 100) / Math.pow(10, 2))
      })
      let myChart = this.$echarts.init(document.getElementById(taskTrend.id))
      let legendData = [this.$t('vicenter.supervise.checkStatistics.noSus'), this.$t('vicenter.supervise.checkStatistics.sus'), this.$t('vicenter.supervise.checkStatistics.susRate')]
      taskTrend.noData = false
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            align: 'left'
          },
          position: function (pos, params, dom, rect, size) { // 设置提示框位置
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 10
            return obj
          },
          formatter: function (params) {
            var tip = ''
            if (params) {
              tip = `${params[0].name}<br/>`
              params.forEach((e, index) => {
                tip += e.marker
                if (index === (params.length - 1)) {
                  tip += `${e.seriesName}: ${e.value}%<br/>`
                } else {
                  tip += `${e.seriesName}: ${e.value}<br/>`
                }
              })
            }
            return tip
          }
        },
        grid: {
          top: '10%',
          bottom: '5%',
          left: '2%',
          right: '2%',
          containLabel: true
        },
        legend: {
          data: legendData,
          textStyle: {
            color: '#e7e7e9'
          },
          selectedMode: false // 取消图例上的点击事件
        },
        xAxis: [
          {
            type: 'category',
            data: dataArr,
            axisPointer: {
              type: 'shadow'
            },
            axisLine: {
              lineStyle: {
                color: '#e7e7e9',
                width: 1
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#151f22'],
                width: 1,
                type: 'solid'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#e7e7e9',
                width: 1
              }
            }
          },
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#151f22'],
                width: 1,
                type: 'solid'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#e7e7e9',
                width: 1
              }
            }
          }
        ],
        series: [
          {
            name: legendData[0],
            type: 'bar',
            stack: 'total',
            data: noSusNums,
            color: '#07ac4d'
          },
          {
            name: legendData[1],
            type: 'bar',
            stack: 'total',
            data: susNums,
            color: '#e1803a'
          },
          {
            name: legendData[2],
            type: 'line',
            yAxisIndex: 1,
            data: susRates,
            color: '#f0bf2e'
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 初始化当日业务量图表
    initTotalStatisticsData (chartId, dataObj) {
      let noSusST = (dataObj.insNum - dataObj.susNum) || 0 // 审图无嫌疑
      let susST = dataObj.susNum || 0 // 审图有嫌疑
      let noSusSJ = dataObj.noCheckNum || 0 // 手检无查获
      let checkSJ = dataObj.checkNum || 0 // 手检有查获
      let innerData = []
      let outerData = []
      if (dataObj.insNum === 0) {
        // 当没有查验数据的时候显示暂无数据
        this.allTaskData.noData = true
        this.allTaskData.isShowLegend = false
        return
      } else {
        this.allTaskData.noData = false
        this.allTaskData.isShowLegend = true
      }
      if (susST === 0) {
        // 当审图有嫌疑量为0时不显示里面的饼图
        innerData = [{}, {}]
      } else {
        innerData = [
          {
            value: checkSJ,
            name: this.$t('vicenter.supervise.map.phyInspectionSeized'),
            selected: !(noSusSJ === 0)
          },
          {
            value: noSusSJ,
            name: this.$t('vicenter.supervise.map.phyInspectionNoSuspect')
          }
        ]
      }
      outerData = [
        {
          value: susST,
          name: this.$t('vicenter.supervise.map.imgAnalysisSuspect')
        },
        {
          value: noSusST,
          name: this.$t('vicenter.supervise.map.imgAnalysisNoSuspect')
        }
      ]
      let _this = this
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (params) { // 格式化提示框
            return `
              <div class="toolTipStyle">
                <span>${params.seriesName}</span>
                <div>${params.name}: ${params.value}(${params.percent}%)</div>
              </div>
            `
          },
          position: function (pos, params, dom, rect, size) { // 设置提示框位置
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 10
            return obj
          }
        },
        grid: {
          top: 'middle'
        },
        color: ['#f17680', '#45aadd', '#f2cc10', '#3dca84'],
        legend: {
          show: false,
          data: [this.$t('vicenter.supervise.map.imgAnalysisSuspect'), this.$t('vicenter.supervise.map.imgAnalysisNoSuspect'),
            this.$t('vicenter.supervise.map.phyInspectionSeized'), this.$t('vicenter.supervise.map.phyInspectionNoSuspect')],
          textStyle: {
            color: '#e7e7e9'
          },
          selectedMode: false // 取消图例上的点击事件
        },
        series: [
          {
            name: '',
            type: 'pie',
            selectedMode: 'single',
            selectedOffset: 5,
            radius: ['0%', '30%'],
            label: {
              show: false
            },
            data: innerData
          },
          {
            name: '',
            type: 'pie',
            radius: ['45%', '65%'],
            label: {
              show: false
            },
            data: outerData
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 初始化柱状图表
    initChartData (chartData, dataArr, legendData, type = '') {
      let seriesData0 = []
      let seriesData1 = []
      let area = []
      if (dataArr && dataArr.length > 0) {
        dataArr.forEach(e => {
          area.push(e.itemName)
          if (type === 'Analysis') {
            // 无嫌疑量
            seriesData0.push(e.noSusNum)
            // 有嫌疑量
            seriesData1.push(e.susNum)
          } else if (type === 'Physical') {
            // 无嫌疑量
            seriesData0.push(e.noCheckNum)
            // 查获量
            seriesData1.push(e.checkNum)
          } else {
            // 无嫌疑量
            seriesData0.push(e.noSusNum + e.noCheckNum)
            // 查获量
            seriesData1.push(e.checkNum)
          }
        })
      } else {
        // 图表没数据的时候显示暂无数据
        if ((this.willToView === 'Center' || this.willToView === 'Region') && chartData.id === 'regionStatistics') {
          this.chartData.noData = true
        }
        if (this.willToView === 'Region' && chartData.chartName === 'analysis') {
          this.analysisChartData.noData = true
        }
        if (this.willToView === 'Region' && chartData.chartName === 'physical') {
          this.physicalChartData.noData = true
        }
        return
      }
      let myChart = this.$echarts.init(document.getElementById(chartData.id))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            align: 'left'
          },
          position: function (pos, params, dom, rect, size) { // 设置提示框位置
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 10
            return obj
          }
        },
        legend: {
          show: true,
          orient: 'horizontal',
          type: 'scroll',
          data: legendData,
          textStyle: {
            color: '#e7e7e9'
          },
          selectedMode: false // 取消图例上的点击事件
        },
        grid: {
          top: '10%',
          bottom: '5%',
          left: '2%',
          right: '2%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#151f22'],
              width: 1,
              type: 'solid'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e7e7e9',
              width: 1
            }
          }
        },
        yAxis: {
          type: 'category',
          data: area,
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#151f22'],
              width: 1,
              type: 'solid'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e7e7e9',
              width: 1
            }
          }
        },
        series: [
          {
            name: legendData[0],
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: seriesData0,
            itemStyle: {
              color: '#3dca84'
            }
          },
          {
            name: legendData[1],
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: seriesData1,
            itemStyle: {
              color: '#f17680'
            },
            barMaxWidth: 20
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 返回上一级按钮
    backBtnFunc () {
      let coords = []
      let viewId = ''
      if (this.willToView === 'Center') {
        coords = centerCoords
        viewId = ''
      } else if (this.willToView === 'Region') {
        coords = regionCoords
        viewId = this.regionId
      }
      // 切换地图视图
      this.toogleView(viewId, this.willToView, coords)
      // 加载图表数据
      if (viewId) {
        this.getStatisticsData(viewId, 'Region')
      } else {
        this.getStatisticsData(viewId, 'Center')
      }
    },
    // 获取总署
    getCenter (arr) {
      this.$refs.map.addCenter(arr)
    },
    // 获取关区
    getRegion (arr) {
      this.groupItems = []
      if (arr.length > 0) {
        arr.forEach(e => {
          this.groupItems.push({
            id: e.attr.id,
            name: e.text
          })
        })
      }
      this.$refs.map.addRegion(arr)
    },
    // 获取口岸
    getStation (arr) {
      let stationArr = []
      this.groupItems = []
      arr.forEach(e => {
        if (e.attr.pid === this.regionId) {
          stationArr.push(e)
          this.groupItems.push({
            id: e.attr.id,
            name: e.text
          })
        }
      })
      this.getExtentArr(stationArr)
      this.$refs.map.addStation(stationArr)
    },
    // 获取设备
    getScanner (arr) {
      let scannerArr = []
      this.groupItems = []
      arr.forEach(e => {
        if (e.attr.pid === this.stationId) {
          if (e.lat) {
            scannerArr.push(e)
          }
          this.groupItems.push({
            id: e.attr.id,
            name: e.text
          })
        }
      })
      this.getExtentArr(scannerArr)
      this.$refs.map.addScanner(scannerArr)
    },
    // 清除某图层上的元素
    clearMarkers (layerName) {
      this.$refs.map.clearMarkers(layerName)
    },
    // 获取合适范围坐标集
    getExtentArr (data) {
      extentArr = []
      data.forEach(e => {
        if (e.attr.coords) {
          extentArr.push(e.attr.coords)
        }
      })
      this.getBoundExtent()
    },
    // 根据元素集合获取范围
    getBoundExtent () {
      this.$refs.map.getBoundExtent(extentArr)
    },
    // 设置地图中心点
    setMapCenter (coords) {
      this.$refs.map.setMapCenter(coords)
    },
    // 设置缩放级别
    setMapZoomLevel (zoomLevel) {
      if (zoomLevel) {
        this.$refs.map.setMapZoomLevel(zoomLevel)
      }
    },
    // 图表文字太长换行显示
    chartsFormat (value, len) {
      if (value.length > len) {
        let valueAar = value.split(' ')
        let valueArrlen = valueAar.length
        let curQ = 0
        let unitStr = ''
        let unitStrs = ''
        let newValue = ''
        for (let q = 0; q < valueArrlen; q++) {
          if (q === 0) {
            unitStr = valueAar[0]
          } else {
            unitStrs = unitStr
            unitStr += ' ' + valueAar[q]
          }
          if (unitStr.length > len) {
            curQ = curQ + 1
            unitStr = valueAar[q]
            if (curQ === 2) {
              newValue += unitStrs + '...'
              break
            } else {
              newValue += unitStrs + '\n'
              if (q === valueArrlen - 1) {
                newValue += unitStr
              }
            }
          }
        }
        return newValue
      } else {
        return value
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$clearRefresh(this.refresh)
    next()
  },
  components: { Map, SuperviseChart, chartList }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
#supervise-map {
  width: $all;
  height: $all;
  overflow: hidden;
  @include flex(row, flex-start, flex-start);
  position: relative;
  .map {
    .head-title {
      width: $all;
      height: 100px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 50;
      @include mapTitleBg();
      color: $white;
      font-weight: bold;
      font-size: 20px;
      line-height: 55px;
    }
    width: 70%;
    height: $all;
    position: relative;
    .back-button {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100;
    }
    .full-screen-button {
      position: absolute;
      bottom: 15px;
      left: 15px;
      z-index: 99;
      cursor: pointer;
      color: #fff;
      font-size: 36px;
    }
    #omapId {
      .ol-viewport {
        .ol-zoom {
          display: none;
        }
      }
    }
  }
  .info-preview {
    width: 30%;
    height: $all;
    overflow: hidden;
    background: rgba(0, 0, 0, .7);
    @include box-sizing();
    padding: 0 $dis10;
    @include transition(right);
    .info-container {
      width: $all;
      height: $all;
      overflow: hidden;
      .info {
      }
    }
  }
}
@media screen and (max-width: 1640px) {
}
.toolTipStyle {
  max-width: 400px;
  white-space: normal;
  text-align: left;
}
</style>
