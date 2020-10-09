<template>
   <div class='Task-statistics-bar' v-bar>
     <div class="Task-statistics-M">
      <div class="up-down-container">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="up-down-infolist">
          <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
            <el-tab-pane :label="$t('vicenter.supervise.checkStatistics.daily')" name="day">
            </el-tab-pane>
            <el-tab-pane :label="$t('vicenter.supervise.checkStatistics.monthly')" name="month">
            </el-tab-pane>
            <el-tab-pane :label="$t('vicenter.supervise.checkStatistics.yearly')" name="year">
            </el-tab-pane>
            <div class="serach-button">
              <el-button  type="primary" size="small" @click="query(queryFn.query)" data-id="statisQuery-btn">{{queryFn.queryText}}</el-button>
              <el-button  size="small" @click="queryFn.close" data-id="statisReset-btn">{{queryFn.resetText}}</el-button>
            </div>
            <div id="exportData">
              <ComForm ref="serach-form" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
              <div class="chartTableBox">
                <div class="panel">
                  <panelTitle :panelTitleInit="panelTitle.statisTitle">
                    <el-button type="text" class='transQuery' :title="$t('vicenter.common.chart')" @click='queryChart' data-id="chart-btn"><span class='iconfont editTable btnClass' :class="{notActive: isChart}">&#xe6d4;</span></el-button>
                    <el-button type="text" class='transQuery' :title="$t('vicenter.common.list')" @click='queryTable' data-id="list-btn"><span class='iconfont editTable btnClass' :class="{notActive: isTable}">&#xe602;</span></el-button>
                    <el-dropdown @command="exportData">
                      <el-button data-id="export-btn" type="text" class='transQuery' :title="$t('vicenter.common.exportData')"><span class='iconfont editTable btnClass'>&#xe60b;</span></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="showFlag" command="image" data-id="exportJpg-btn">{{$t('vicenter.supervise.taskStatistics.exportJPG')}}</el-dropdown-item>
                        <el-dropdown-item v-else command="excel" data-id="exportExcel-btn">{{$t('vicenter.supervise.taskStatistics.exportEXCEL')}}</el-dropdown-item>
                        <el-dropdown-item v-if="showFlag" command="pdfChart" data-id="exportPdfChart-btn">{{$t('vicenter.supervise.taskStatistics.exportPDF')}}</el-dropdown-item>
                        <el-dropdown-item v-else command="pdfTable" data-id="exportPdfTable-btn">{{$t('vicenter.supervise.taskStatistics.exportPDF')}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </panelTitle>
                </div>
                <div class='chartbox'>
                  <div class="countBox">
                  <div class="content color-blue">
                    <span class="smallBox">
                      {{$t('vicenter.supervise.checkStatistics.total')}}
                      <countTo :startVal='0' :endVal='totalBusiness' :duration='3000' data-id="total-span"></countTo>
                    </span>
                  </div>
                  <div class="content color-green">
                    <span class="smallBox">
                      {{$t('vicenter.supervise.checkStatistics.imgNoSuspected')}}
                      <countTo :startVal='0' :endVal='noSuspect' :duration='3000' data-id="noSuspect-span"></countTo>
                    </span>
                  </div>
                  <div class="content color-grass">
                    <span class="smallBox">
                      {{$t('vicenter.supervise.checkStatistics.manualNoSuspected')}}
                      <countTo :startVal='0' :endVal='noCheckNum' :duration='3000' data-id="noCheckNum-span"></countTo>
                    </span>
                  </div>
                  <!-- <div class="content color-yellow">{{$t('vicenter.supervise.checkStatistics.suspectedAmount')}}
                    <countTo :startVal='0' :endVal='suspected' :duration='3000' data-id="suspected-span"></countTo>
                  </div> -->
                  <div class="content color-red">
                    <span class="smallBox">
                      {{$t('vicenter.supervise.checkStatistics.manualSuspected')}}
                      <countTo :startVal='0' :endVal='checkNum' :duration='3000' data-id="checkNum-span"></countTo>
                    </span>
                  </div>
                </div>
                <div v-if='showFlag'>
                  <div class="chartAndGaugeBox">
                    <div id="statisticChart" class="statisticChart">
                      <ve-bar :data="histogramChart.data" :settings="histogramChart.setting" :extend='histogramChart.extend' :data-empty="histogramChart.dataEmpty" :colors='histogramChart.colors' :grid='histogramChart.grid'></ve-bar>
                    </div>
                    <div class="gaugeBox">
                      <div class="gaugeWidth">
                        <div id="checkRateGauge" class="gaugeChart"></div>
                        <!-- <ve-gauge :settings="checkRate.settings" :data="checkRate.data"></ve-gauge> -->
                      </div>
                      <div class="gaugeWidth">
                        <div id="susRateGauge" class="gaugeChart"></div>
                        <!-- <ve-gauge :settings="susRate.settings" :data="susRate.data"></ve-gauge> -->
                      </div>
                      <div class="gaugeWidth">
                        <div id="susCheckRateGauge" class="gaugeChart"></div>
                        <!-- <ve-gauge :settings="susCheckRate.settings" :data="susCheckRate.data" :extend='susCheckRate.extend'></ve-gauge> -->
                      </div>
                    </div>
                  </div>
                </div>
                <ComTable id="statisticTable" :tableData='tableData' :tableGroup='tableGroup'  v-if='!showFlag'></ComTable>
                </div>
              </div>
            </div>
          </el-tabs>
        </div>
      </div>
    </div>
   </div>
</template>

<script>
import breadCrumb from '../../components/breadCrumb'
import ComForm from '../../components/form'
import ComTable from '../../components/table'
import panelTitle from '../../components/title'
import ajax from '../../api/supervise/Statistics.js'
import exportExcel from '../../lib/exportExcel/export2Excel.js'
import countTo from 'vue-count-to'
export default {
  name: 'Task-statistics',
  data () {
    let startPickerOption = {
      disabledDate: (time) => {
        let length = this.inputItem.length - 1
        if (this.inputItem[length].models !== '') {
          return time.getTime() > Date.now() || time.getTime() > this.inputItem[length].models
        } else {
          return time.getTime() > Date.now()
        }
      }
    }
    let endPickerOption = {
      disabledDate: (time) => {
        let length = this.inputItem.length - 2
        return time.getTime() < this.inputItem[length].models || time.getTime() > Date.now()
      }
    }
    return {
      totalBusiness: 0, // 业务总量
      noSuspect: 0, // 无嫌疑量
      suspected: 0, // 有嫌疑量
      checkNum: 0, // 查获量
      noCheckNum: 0, // 无查获量
      checkRate: {
        data: {
          columns: ['type', 'value'],
          rows: [
            {type: 'checkRate', value: 100}
          ]
        },
        settings: {
          dataType: {
            'checkRate': 'percent'
          },
          seriesMap: {
            'checkRate': {
              min: 0,
              max: 1,
              radius: '80%',
              title: {
                offsetCenter: [0, 120]
              },
              detail: {
                textStyle: {
                  fontSize: 26
                }
              }
            }
          },
          dataName: {
            'checkRate': this.$t('vicenter.common.checkStatistics.checkRate')
          }
        }
      },
      susRate: {
        data: {
          columns: ['type', 'value'],
          rows: [
            {type: 'susRate', value: 100}
          ]
        },
        settings: {
          dataType: {
            'susRate': 'percent'
          },
          seriesMap: {
            'susRate': {
              min: 0,
              max: 1,
              radius: '80%',
              title: {
                offsetCenter: [0, 120]
              },
              detail: {
                textStyle: {
                  fontSize: 26
                }
              }
            }
          },
          dataName: {
            'susRate': this.$t('vicenter.supervise.checkStatistics.susRate')
          }
        }
      },
      susCheckRate: {
        data: {
          columns: ['type', 'value'],
          rows: [
            {type: 'susCheckRate', value: 100}
          ]
        },
        settings: {
          dataType: {
            'susCheckRate': 'percent'
          },
          seriesMap: {
            'susCheckRate': {
              min: 0,
              max: 1,
              radius: '80%',
              title: {
                offsetCenter: [0, 120]
              },
              detail: {
                textStyle: {
                  fontSize: 26
                }
              }
            }
          },
          dataName: {
            'susCheckRate': this.$t('vicenter.supervise.checkStatistics.susCheckRate')
          }
        }
      },
      exportTHeader: [],
      exportFields: [],
      exportFileName: this.$t(this.$route.name),
      isChart: true,
      isTable: false,
      showFlag: true,
      activeName: 'day',
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
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
      panelTitle: { // title组件数据
        statisTitle: {
          title: this.$t(this.$route.name) + '（' + this.$t('vicenter.common.day') + '）'
        }
      },
      groupAll: [],
      portAll: [],
      deviceAll: [],
      groupAllModels: [],
      portAllModels: [],
      deviceAllModels: [],
      inputItem: [],
      inputItemDefault: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('vicenter.supervise.checkStatistics.dimension'),
          type: 'select',
          placeHolder: this.$t('vicenter.supervise.checkStatistics.dimensionSelected'),
          models: 'cus',
          ruleProp: 'groupType',
          option: [
            // {
            //   value: 'type',
            //   label: this.$t('vicenter.supervise.checkStatistics.TradeType')
            // },
            {
              value: 'cus', // 关区
              label: this.$t('vicenter.supervise.checkStatistics.cus')
            },
            {
              value: 'port', // 口岸
              label: this.$t('vicenter.supervise.checkStatistics.port')
            },
            {
              value: 'dev', // 设备
              label: this.$t('vicenter.supervise.checkStatistics.dev')
            }
          ],
          change: this.change
        },
        {
          getLabel: this.$t('vicenter.supervise.checkStatistics.cus'),
          type: 'select2',
          placeHolder: this.$t('vicenter.supervise.checkStatistics.cusSelect'),
          models: [],
          ruleProp: 'customIds',
          removeTag: this.removeTag, // 多选移除时触发
          option: [],
          change: this.changeGroup
        },
        {
          getLabel: this.$t('vicenter.supervise.checkStatistics.port'),
          type: 'select2',
          placeHolder: this.$t('vicenter.supervise.checkStatistics.portSelected'),
          models: [],
          ruleProp: 'portIds',
          removeTag: this.removeTag, // 多选移除时触发
          option: [],
          change: this.changePort
        },
        {
          getLabel: this.$t('vicenter.supervise.checkStatistics.dev'),
          type: 'select2',
          placeHolder: this.$t('vicenter.supervise.checkStatistics.devSelect'),
          models: [],
          ruleProp: 'devIds',
          clearable: true,
          option: [],
          removeTag: this.removeTag // 多选移除时触发
        },
        {
          getLabel: this.$t('vicenter.supervise.checkStatistics.startDate'),
          type: 'date',
          models: '',
          ruleProp: 'startDate',
          pickerOptions: startPickerOption,
          format: this.$t('vicenter.common.dayFormat')
        },
        {
          getLabel: this.$t('vicenter.supervise.checkStatistics.endDate'),
          type: 'date',
          models: '',
          ruleProp: 'endDate',
          pickerOptions: endPickerOption,
          format: this.$t('vicenter.common.dayFormat')
        }
      ],
      histogramChart: {
        setting: {
          stack: {
            'x': [
              this.$t('vicenter.supervise.checkStatistics.imgNoSuspected'),
              this.$t('vicenter.supervise.checkStatistics.manualNoSuspected'),
              this.$t('vicenter.supervise.checkStatistics.manualSuspected')
            ]
          }
        },
        grid: {
          right: '3%'
        },
        data: {
          columns: [],
          rows: [],
          dataEmpty: true
        },
        colors: ['#3dca84', '#0baf5e', '#f17680'],
        extend: {
          xAxis: {
            minInterval: 1
          },
          legend: {
            show: false,
            selectedMode: false // 取消图例上的点击事件
          },
          tooltip: {
            textStyle: {
              align: 'left'
            }
          },
          series (v) {
            if (v) {
              v.forEach(i => {
                i.barMaxWidth = 30
              })
            }
            return v
          },
          'xAxis.0.axisLabel.rotate': 0,
          'xAxis.0.axisLabel.interval': 0,
          'xAxis.0.axisLabel.formatter': function (value) {
            var newParamsName = ''
            var paramsNameNumber = value.length
            var provideNumber = 40
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
            if (newParamsName.length > 2 * provideNumber) {
              return newParamsName.substring(0, 2 * provideNumber) + '...'
            } else {
              return newParamsName
            }
          }
        }
      },
      tableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'text',
          width: '80px',
          model: 'index'
        },
        {
          label: this.$t('vicenter.supervise.checkStatistics.port'),
          type: 'text',
          model: 'itemName'
        },
        {
          label: this.$t('vicenter.supervise.checkStatistics.imgNoSuspected'),
          type: 'text',
          model: 'noSusNum'
        },
        {
          label: this.$t('vicenter.supervise.checkStatistics.manualNoSuspected'),
          type: 'text',
          model: 'noCheckNum'
        },
        {
          label: this.$t('vicenter.supervise.checkStatistics.manualSuspected'),
          type: 'text',
          model: 'checkNum'
        }
      ],
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        refName: 'multipleTable',
        isExcel: true,
        sortMethod: this.sort
      },
      queryFn: { // 页面表单查询方法
        query: this.query,
        close: this.close,
        queryText: this.$t('vicenter.common.statistics'),
        resetText: this.$t('vicenter.common.reset')
      },
      formRule: { // 表单验证和存放数据 model=> post到后台的数据
        refName: 'queryForm',
        rule: {},
        model: {
          groupType: 'cus',
          portIds: [],
          customIds: [],
          devIds: [],
          groupItems: [],
          startDate: '',
          endDate: '',
          dateType: 'day'
        }
      },
      const: {
        cus: 'cus',
        port: 'port',
        dev: 'dev'
      }
    }
  },
  created () {
    this.ajaxTree()
    this.$data.inputItemDefault.forEach((item) => {
      this.$data.inputItem.push(item)
    })
    this.$data.inputItem.splice(2, 2)
  },
  methods: {
    sort () {
      return false
    },
    ajaxTree () {
      ajax.getOrgPortDeviceTree().then(res => {
        if (res.data.flag) {
          this.$getSelectData(res.data.result, this.$data)
          this.change()
          this.tabClick()
          this.getStatics(this.formRule.model)
        }
      }).catch(() => {})
    },
    taskTable (data) {
      data.forEach((item, index) => {
        item['index'] = index + 1
      })
      this.$data.tableData.data = data
      let type = this.$data.inputItem[0].models
      if (type === this.const.dev) {
        this.$data.tableGroup[1].label = this.$t('vicenter.supervise.checkStatistics.dev')
      } else if (type === this.const.port) {
        this.$data.tableGroup[1].label = this.$t('vicenter.supervise.checkStatistics.port')
      } else if (type === this.const.cus) {
        this.$data.tableGroup[1].label = this.$t('vicenter.supervise.checkStatistics.cus')
      }
      // 总计和平均计算
      let itemNum = data.length
      if (itemNum > 0) {
        let tableArr = data
        // 有无嫌疑数量
        // 修改导出excel的total、average列
        let totalObj = {
          index: this.$t('vicenter.supervise.checkStatistics.totalNum'),
          itemName: this.$data.noSuspect,
          noSusNum: this.$data.noCheckNum,
          noCheckNum: this.$data.checkNum,
          checkNum: ''
        }
        let aveObj = {
          index: this.$t('vicenter.supervise.checkStatistics.averageNum'),
          itemName: (this.$data.noSuspect / itemNum).toFixed(2),
          noSusNum: (this.$data.noCheckNum / itemNum).toFixed(2),
          noCheckNum: (this.$data.checkNum / itemNum).toFixed(2),
          checkNum: ''
        }
        // 嫌疑物数量
        let arr = this.$data.tableArr
        tableArr.forEach((item) => {
          for (var i in arr) {
            totalObj[arr[i].code] = arr[i].value
            aveObj[arr[i].code] = (arr[i].value / itemNum).toFixed(2)
          }
        })
        this.$data.tableGroup.forEach((item) => {
          if (!totalObj.hasOwnProperty(item.model)) {
            totalObj[item.model] = 0
            aveObj[item.model] = parseInt(0).toFixed(2)
          }
        })
        this.$data.tableData.data.push(totalObj)
        this.$data.tableData.data.push(aveObj)
      }
      // 导出excel相关
      this.exportTHeader = []
      this.exportFields = []
      this.tableGroup.forEach((item) => {
        if (item.type !== 'index') {
          this.exportTHeader.push(item.label)
          this.exportFields.push(item.model)
        }
      })
    },
    getStatics (param) {
      let val = JSON.parse(JSON.stringify(param))
      if (val.groupType === '') {
        val.groupType = this.const.cus
      }
      let len = this.$data.inputItem.length
      let startDate = this.$data.inputItem[len - 2].models
      startDate = this.$options.filters['getTimeStamp'](startDate, val.groupType)
      let endDate = this.$data.inputItem[len - 1].models
      endDate = this.$options.filters['getTimeStamp'](endDate, val.groupType)
      val.dateType = this.activeName
      val.dateType = this.activeName
      let groupItems = this.$getGroupItems(val, this)
      val.groupItems = groupItems
      val.portIds = val.portIds.join(',')
      val.customIds = val.customIds.join(',')
      val.devIds = val.devIds.join(',')
      val.startDate = startDate
      val.endDate = endDate
      let validate = this.$validateMust(val, this.const)// 验证必填
      if (!validate) {
        return
      }
      this.histogramChart.data.columns = []
      this.histogramChart.data.rows = []
      ajax.getInspectStatistics(val).then(res => {
        if (res.data.flag) {
          let {insNum, susNum, noSusNum, noCheckNum, checkNum, checkRate, susRate, susCheckRate, itemList} = res.data.result
          this.totalBusiness = insNum // 业务总量
          this.suspected = susNum
          this.noSuspect = noSusNum
          this.noCheckNum = noCheckNum
          this.checkNum = checkNum
          if (this.showFlag) {
            // this.checkRate.data.rows[0].value = checkRate
            this.initGaugeChart('checkRateGauge', checkRate, this.$t('vicenter.common.checkStatistics.checkRate'))
            // this.susRate.data.rows[0].value = susRate
            this.initGaugeChart('susRateGauge', susRate, this.$t('vicenter.supervise.checkStatistics.susRate'))
            // this.susCheckRate.data.rows[0].value = susCheckRate
            this.initGaugeChart('susCheckRateGauge', susCheckRate, this.$t('vicenter.supervise.checkStatistics.susCheckRate'))
          }
          this.histogramChart.data.columns = ['x', this.$t('vicenter.supervise.checkStatistics.imgNoSuspected'),
            this.$t('vicenter.supervise.checkStatistics.manualNoSuspected'), this.$t('vicenter.supervise.checkStatistics.manualSuspected')]
          itemList.forEach(e => {
            let obj = {}
            obj['x'] = e.itemName
            obj[this.$t('vicenter.supervise.checkStatistics.imgNoSuspected')] = e.noSusNum
            obj[this.$t('vicenter.supervise.checkStatistics.manualNoSuspected')] = e.noCheckNum
            obj[this.$t('vicenter.supervise.checkStatistics.manualSuspected')] = e.checkNum
            this.histogramChart.data.rows.push(obj)
          })
          this.taskTable(itemList)
        }
      })
    },
    initGaugeChart (id, val, label) {
      let myChart = this.$echarts.init(document.getElementById(id))
      let option = {
        tooltip: {
          formatter: '{b} : {c}%'
        },
        series: [
          {
            type: 'gauge',
            radius: '100%',
            title: {
              show: true,
              offsetCenter: [0, '80%']
            },
            detail: {
              formatter: '{value}%'
            },
            data: [
              {
                value: parseFloat((val * 100).toFixed(2)),
                name: label
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
    close () { // 表单重置方法
      this.$refs['serach-form'].reset()
      this.$nextTick(() => {
        this.inputItem[0].models = 'cus'
        this.change()
        this.tabClick()
      })
    },
    changeGroup () {
      this.$changeGroup(this.$data)
    },
    changePort () {
      this.$changePort(this.$data)
    },
    tabClick () {
      this.$StatisTabClick(this.inputItem, this.activeName, this)
    },
    change () {
      this.$typeChange(this.$data)
    },
    queryChart () { // 图表展示
      this.isTable = false
      this.isChart = true
      this.showFlag = true
      this.$nextTick(() => {
        this.getStatics(this.formRule.model)
      })
    },
    queryTable () { // 表格展示
      this.isTable = true
      this.isChart = false
      this.showFlag = false
    },
    exportData (command) { // 导出
      if (command === 'excel') {
        // 修改导出excel的total、average列
        let params = this.$setExportExcel(this)
        exportExcel({exportArray: params.tableData, tHeader: params.headers, filterFields: params.filelds, fileName: this.exportFileName})
      } else if (command === 'pdfChart') {
        this.getPdf(document.getElementById('exportData'), this.exportFileName, false)
      } else if (command === 'pdfTable') {
        this.getPdf(document.getElementById('exportData'), this.exportFileName, false)
      } else if (command === 'image') {
        this.getPdf(document.getElementById('exportData'), this.exportFileName, true)
      }
      let logParams = {
        appCode: 'DMS',
        appName: 'dms',
        operateObject: this.$route.name
      }
      this.$exportLog(logParams)
    },
    query () { // 表单查询方法
      this.panelTitle.statisTitle.title = this.$t(this.$route.name) + '（' + this.$t('vicenter.common.' + this.activeName) + '）'
      this.getStatics(this.formRule.model)
    }
  },
  components: {breadCrumb, ComForm, ComTable, panelTitle, countTo}
}
</script>

<style lang="scss">
@import "../../styles/index.scss";
.Task-statistics-bar {
  @extend .extend-bar;
  .Task-statistics-M {
    @include box-sizing;
    .up-down-infolist {
      height: $all;
      .serach-button {
        position: absolute;
        right: 47px;
        top: 40px;
      }
      .search-form {
        width: calc(100% - 200px);
        padding: 0 $margin 0 $margin;
        @include box-sizing();
        @include layout(1, 'false');
        .search-form-btn {
          .el-form-item__content {
            text-align: right;
          }
        }
        .search-form-btn {
          display: none;
        }
        .el-form-item{
          margin-right: 5px;
        }
        .search-form-input {
          .el-input__inner {
            height: 40px;
            line-height: 40px;
          }
        }
        .el-input__icon {
          height: 40px;
          line-height: 40px;
        }
      }
      .panel {
        flex: 1;
        @extend .extend-panel;
        .search-form {
          @include layout(2);
        }
      }
      .chartbox {
        height: auto;
      }
      .gaugeBox{
        display: inline-flex;
        width: $all;
        .gaugeWidth{
          width: $all/3;
          .gaugeChart {
            width: $all;
            height: 300px;
            margin-top: 50px;
          }
        }
      }
      .btnClass {
        font-size: 20px
      }
    }
    .el-picker-panel{
      z-index: 2019;
      position: absolute;
    }
  }
}
.Task-statistics-bar .Task-statistics-M .up-down-infolist .search-form .el-form-item.search-form-item .el-form-item__content{
  line-height: 3 !important;
}
#panelTitle .panel-title .operate-menu .el-dropdown .el-button:last-child {
  margin-right: 0;
}
.notActive {
  color: #ccc!important;
}
.el-tabs--border-card>.el-tabs__header {
  width: $all;
  height: 34px;
  padding-top: 0;
  position: relative;
  @include flex(row, space-between, center);
  background: $titleUrlImg repeat-x 0 -15px;
}
.el-tabs__item {
  height: 35px;
  line-height: 35px;
}
.el-tabs.el-tabs--top.el-tabs--border-card {
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  .el-tabs__header.is-top {
    border-radius: 4px;
  }
  .el-tabs__content {
    height: calc(100% - 35px);
    overflow: hidden;
    padding: 0;
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
