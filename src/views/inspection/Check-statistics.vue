<template>
   <div class='check-statistics-bar' v-bar>
     <div class="check-statistics-M">
      <div class="up-down-container">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="up-down-infolist">
          <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
            <el-tab-pane :label="$t('vicenter.inspection.checkStatistics.daily')" name="day">
            </el-tab-pane>
            <el-tab-pane :label="$t('vicenter.inspection.checkStatistics.monthly')" name="month">
            </el-tab-pane>
            <el-tab-pane :label="$t('vicenter.inspection.checkStatistics.yearly')" name="year">
            </el-tab-pane>
            <div class="serach-button">
              <el-button  type="primary" size="small" @click="query(queryFn.query)" class="query-button">{{queryFn.queryText}}</el-button>
              <el-button  size="small" @click="queryFn.close" class="reset-button">{{queryFn.resetText}}</el-button>
            </div>
            <div id="exportData">
              <ComForm ref="serach-form" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
              <div class="chartTableBox">
                <div class="panel">
                  <panelTitle :panelTitleInit="panelTitle.statisTitle">
                    <el-button type="text" class='transQuery query-chart' :title="$t('vicenter.common.chart')" @click='queryChart'><span class='iconfont editTable btnClass' :class="{notActive: isChart}">&#xe6d4;</span></el-button>
                    <el-button type="text" class='transQuery query-table' :title="$t('vicenter.common.list')" @click='queryTable'><span class='iconfont editTable btnClass' :class="{notActive: isTable}">&#xe602;</span></el-button>
                    <el-dropdown @command="exportData">
                      <el-button type="text" class='transQuery export-file' :title="$t('vicenter.common.exportData')"><span class='iconfont editTable btnClass'>&#xe60b;</span></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="showFlag" command="image" class="export-image-file">{{$t('vicenter.common.export', {msg: 'JPG'})}}</el-dropdown-item>
                        <el-dropdown-item v-else command="excel" class="export-excel-file">{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-dropdown-item>
                        <el-dropdown-item v-if="showFlag" command="pdfChart" class="export-pdfChart-file">{{$t('vicenter.common.export', {msg: 'PDF'})}}</el-dropdown-item>
                        <el-dropdown-item v-else command="pdfTable" class="export-pdfTable-file">{{$t('vicenter.common.export', {msg: 'PDF'})}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </panelTitle>
                </div>
                <div class='chartbox'>
                  <div class="countBox">
                  <div class="content color-blue">
                    <span class="smallBox">
                      {{$t('vicenter.inspection.checkStatistics.imageTotal')}}
                      <countTo :startVal='0' :endVal='totalBusiness' :duration='3000'></countTo>
                    </span>
                  </div>
                  <div class="content color-green">
                    <span class="smallBox">
                      {{$t('vicenter.inspection.checkStatistics.noSuspectedAmount')}}
                      <countTo :startVal='0' :endVal='noSuspect' :duration='3000'></countTo>
                    </span>
                  </div>
                  <div class="content color-yellow">
                    <span class="smallBox">
                      {{$t('vicenter.inspection.checkStatistics.suspectedAmount')}}
                      <countTo :startVal='0' :endVal='suspected' :duration='3000'></countTo>
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
                        <div id="susRateGauge" class="gaugeChart"></div>
                        <!-- <ve-gauge :settings="susRate.settings" :data="susRate.data"></ve-gauge> -->
                      </div>
                      <div class="gaugeWidth">
                        <div id="susCheckRateGauge" class="gaugeChart"></div>
                        <!-- <ve-gauge :settings="susCheckRate.settings" :data="susCheckRate.data"></ve-gauge> -->
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
import breadCrumb from '@/components/breadCrumb'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
import panelTitle from '@/components/title'
import ajax from '@/api/inspection/Statistic.js'
import exportExcel from '@/lib/exportExcel/export2Excel.js'
import chart from '@/components/supervise/chart'
import commonAjax from '@/api/common/common.js'
import countTo from 'vue-count-to'
export default {
  name: 'check-statistics',
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
              title: {
                offsetCenter: [0, 120]
              }
            }
          },
          dataName: {
            'susRate': this.$t('vicenter.inspection.checkStatistics.susRate')
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
              title: {
                offsetCenter: [0, 120]
              }
            }
          },
          dataName: {
            'susCheckRate': this.$t('vicenter.inspection.checkStatistics.susCheckRate')
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
            path: '/Inspection/index' // 跳转路径
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
      analystDefine: [], // 中心的审图员
      analystDefineModels: [], // 中心的审图员ids
      personAll: [],
      groupAll: [],
      portAll: [],
      deviceAll: [],
      groupAllModels: [],
      portAllModels: [],
      deviceAllModels: [],
      inputItem: [],
      inputItemDefault: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('vicenter.inspection.checkStatistics.dimension'),
          type: 'select',
          placeHolder: this.$t('vicenter.inspection.checkStatistics.dimensionSelected'),
          models: 'cus',
          ruleProp: 'groupType',
          option: [
            {
              value: 'cus', // 关区
              label: this.$t('vicenter.inspection.checkStatistics.cus')
            },
            {
              value: 'port', // 口岸
              label: this.$t('vicenter.inspection.checkStatistics.port')
            },
            {
              value: 'dev', // 设备
              label: this.$t('vicenter.inspection.checkStatistics.device')
            },
            {
              value: 'analyst', // 审图员
              label: this.$t('vicenter.inspection.checkStatistics.imgAnalyst')
            }
          ],
          change: this.change
        },
        {
          getLabel: this.$t('vicenter.inspection.checkStatistics.cus'),
          type: 'select2',
          placeHolder: this.$t('vicenter.inspection.checkStatistics.cusSelect'),
          models: [],
          ruleProp: 'customIds',
          removeTag: this.removeTag, // 多选移除时触发
          option: [],
          change: this.changeGroup
        },
        {
          getLabel: this.$t('vicenter.inspection.checkStatistics.port'),
          type: 'select2',
          placeHolder: this.$t('vicenter.inspection.checkStatistics.portSelected'),
          models: [],
          ruleProp: 'portIds',
          removeTag: this.removeTag, // 多选移除时触发
          option: [],
          change: this.changePort
        },
        {
          getLabel: this.$t('vicenter.inspection.checkStatistics.device'),
          type: 'select2',
          placeHolder: this.$t('vicenter.inspection.checkStatistics.deviceSelected'),
          models: [],
          ruleProp: 'devIds',
          clearable: true,
          option: [],
          removeTag: this.removeTag // 多选移除时触发
        },
        {
          getLabel: this.$t('vicenter.inspection.checkStatistics.imgAnalyst'),
          type: 'select2',
          placeHolder: this.$t('vicenter.inspection.checkStatistics.imgAnalystSelect'),
          models: [],
          ruleProp: 'analystIds',
          clearable: true,
          option: [],
          removeTag: this.removeTag // 多选移除时触发
        },
        {
          getLabel: this.$t('vicenter.inspection.checkStatistics.startDate'),
          type: 'date',
          models: '',
          ruleProp: 'startDate',
          pickerOptions: startPickerOption,
          format: this.$t('vicenter.common.dayFormat')
        },
        {
          getLabel: this.$t('vicenter.inspection.checkStatistics.endDate'),
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
              this.$t('vicenter.inspection.checkStatistics.suspectedAmount'),
              this.$t('vicenter.inspection.checkStatistics.noSuspectedAmount')
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
        colors: ['#f2cc0f', '#3dca84'],
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
          label: this.$t('vicenter.inspection.checkStatistics.port'),
          type: 'text',
          model: 'itemName'
        },
        {
          label: this.$t('vicenter.inspection.checkStatistics.suspectedAmount'),
          type: 'text',
          model: 'susNum'
        },
        {
          label: this.$t('vicenter.inspection.checkStatistics.noSuspectedAmount'),
          type: 'text',
          model: 'noSusNum'
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
          analystIds: [],
          startDate: '',
          endDate: '',
          dateType: 'day',
          searchTimeType: 'concImgcheckTime'
        }
      },
      const: {
        cus: 'cus',
        port: 'port',
        dev: 'dev',
        person: 'analyst'
      }
    }
  },
  mounted () {
    this.ajaxTree()
    this.$data.inputItemDefault.forEach((item) => {
      this.$data.inputItem.push(item)
    })
    this.$data.inputItem.splice(2, 3)
  },
  methods: {
    sort () {
      return false
    },
    ajaxTree () {
      ajax.getOrgPortDeviceTree().then(res => {
        if (res.data.flag) {
          this.$getSelectData(res.data.result, this.$data)
          let adminId = 0
          console.log('adminId')
          res.data.result.forEach((item) => {
            if (item.orgType === 'admin') {
              adminId = item.id
            }
          })
          this.getAnalyst()
          this.change()
          this.tabClick()
          this.getStatics(this.formRule.model)
        }
      }).catch(() => {})
    },
    // 获取所有审图员
    /**
     * adminId 海关总署id
     */
    getAnalyst () {
      ajax.listPortAndPersionByRoleCode({roleCode: 'INSPECTOR'}).then(res => {
        if (res.data.flag) {
          this.personAll = []
          this.analystDefine = []
          this.analystDefineModels = []
          let array = res.data.result
          array.forEach(e => {
            let obj = {
              label: e.account,
              code: e.id,
              pid: e.orgId,
              value: e.id
            }
            this.personAll.push(obj)
            this.analystDefine.push(obj)
            this.analystDefineModels.push(obj.value)
          })
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
        this.$data.tableGroup[1].label = this.$t('vicenter.inspection.checkStatistics.device')
      } else if (type === this.const.port) {
        this.$data.tableGroup[1].label = this.$t('vicenter.inspection.checkStatistics.port')
      } else if (type === this.const.cus) {
        this.$data.tableGroup[1].label = this.$t('vicenter.inspection.checkStatistics.cus')
      } else if (type === this.const.person) {
        this.$data.tableGroup[1].label = this.$t('vicenter.inspection.checkStatistics.imgAnalyst')
      }
      // 总计和平均计算
      let itemNum = data.length
      if (itemNum > 0) {
        let tableArr = data
        // 有无嫌疑数量
        // 修改导出excel的total、average列
        let totalObj = {
          index: this.$t('vicenter.inspection.checkStatistics.totalNum'),
          itemName: this.$data.suspected,
          susNum: this.$data.noSuspect,
          noSusNum: ''
        }
        let aveObj = {
          index: this.$t('vicenter.inspection.checkStatistics.averageNum'),
          itemName: (this.$data.suspected / itemNum).toFixed(2),
          susNum: (this.$data.noSuspect / itemNum).toFixed(2),
          noSusNum: ''
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
      param.searchTimeType = 'concImgcheckTime'
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
      let groupItems = this.$getGroupItems(val, this)
      val.groupItems = groupItems
      val.portIds = val.portIds.join(',')
      val.customIds = val.customIds.join(',')
      val.devIds = val.devIds.join(',')
      val.analystIds = val.analystIds.join(',')
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
          let {insNum, susNum, noSusNum, susRate, susCheckRate, itemList} = res.data.result
          this.totalBusiness = insNum // 业务总量
          this.suspected = susNum
          this.noSuspect = noSusNum
          if (this.showFlag) {
            // this.susRate.data.rows[0].value = susRate
            this.initGaugeChart('susRateGauge', susRate, this.$t('vicenter.inspection.checkStatistics.susRate'))
            // this.susCheckRate.data.rows[0].value = susCheckRate
            this.initGaugeChart('susCheckRateGauge', susCheckRate, this.$t('vicenter.inspection.checkStatistics.susCheckRate'))
          }
          this.histogramChart.data.columns = ['x', this.$t('vicenter.inspection.checkStatistics.suspectedAmount'), this.$t('vicenter.inspection.checkStatistics.noSuspectedAmount')]
          itemList.forEach(e => {
            let obj = {}
            obj['x'] = e.itemName
            obj[this.$t('vicenter.inspection.checkStatistics.suspectedAmount')] = e.susNum
            obj[this.$t('vicenter.inspection.checkStatistics.noSuspectedAmount')] = e.noSusNum
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
      this.$inspectchangeGroup(this.$data)
    },
    changePort () {
      this.$inspectchangePort(this.$data)
    },
    tabClick () {
      this.$StatisTabClick(this.inputItem, this.activeName, this)
    },
    change () {
      this.$inspectTypeChange(this.$data, this.const.person, 'analystIds')
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
        appCode: 'INS',
        appName: 'ins',
        operateObject: this.$route.name
      }
      this.$exportLog(logParams)
    },
    query () { // 表单查询方法
      this.panelTitle.statisTitle.title = this.$t(this.$route.name) + '（' + this.$t('vicenter.common.' + this.activeName) + '）'
      this.getStatics(this.formRule.model)
    }
  },
  components: { breadCrumb, ComForm, ComTable, panelTitle, chart, countTo }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.check-statistics-bar {
  @extend .extend-bar;
  .check-statistics-M {
    @include box-sizing;
    .up-down-infolist {
      .serach-button {
        position: absolute;
        right: 47px;
        top: 53px;
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
        .el-form-item {
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
          @extend .extend-panel;
          .search-form {
            @include layout(2);
          }
      }
      .color-blue {
          background: #45aadd;
      }
      .color-green {
          background: #3dca84;
      }
      .color-red {
          background: #f17680;
      }
      .pdiv {
            padding-bottom: 10px;
            text-align: left;
      }
      .btnClass {
        font-size: 20px
      }
    }
    .chartTableBox .gaugeBox .gaugeWidth {
        width: 50%;
        .gaugeChart {
          width: $all;
          height: 300px;
          margin-top: 50px;
        }
    }
    .el-picker-panel{
      z-index: 2019;
      position: absolute;
    }
  }
}
.check-statistics-bar .check-statistics-M .up-down-infolist .search-form .el-form-item.search-form-item .el-form-item__content{
  line-height: 3 !important;
}
#panelTitle .panel-title .operate-menu .el-dropdown .el-button:last-child {
  margin-right: 0;
}
.check-statistics-bar .check-statistics-M .tableComp .el-table th div {
  display: table!important;
}
</style>
