<template>
  <div id='Image-Statistics-bar' v-bar>
    <div id="Image-Statistics-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar">
            <ComForm ref="searchFormRef" :searchIpt="searchIpt" :searchFunc="searchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L" v-loading="uploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
          <panelTitle :panelTitleInit="panelTitle.chartTitle">
            <el-button data-id="print-btn" v-if="printButton && !isChart" type="text"  :title="$t('vicenter.common.print')" @click="handlePrint"><span class='iconfont editTable btnClass'>&#xe68b;</span></el-button>
            <el-button data-id="chart-btn" type="text" :title="$t('vicenter.common.chart')" @click='tabChartTable' :disabled="isChart"><span class='iconfont editTable btnClass' :class="{notActive: isChart}">&#xe6d4;</span></el-button>
            <el-button data-id="list-btn" type="text" :title="$t('vicenter.common.list')" @click='tabChartTable' :disabled="!isChart"><span class='iconfont editTable btnClass' :class="{notActive: !isChart}">&#xe661;</span></el-button>
            <el-dropdown @command="exportData">
              <el-button v-show="exportButton" data-id="export-btn" type="text" class='transQuery' :title="$t('vicenter.common.exportData')"><span class='iconfont editTable btnClass'>&#xe60b;</span></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item data-id="exportImage-btn" v-if="isChart" command="image">{{$t('vicenter.ImageLibrary.common.exportJPG')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportExcel-btn" v-if="!isChart" command="excel">{{$t('vicenter.ImageLibrary.common.exportEXCEL')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportPdfChart-btn" v-if="isChart" command="pdfChart">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportPdfTable-btn" v-if="!isChart" command="pdfTable">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </panelTitle>
          <div class="chartBox" v-bar>
            <div class="chartBox-content">
              <div id="export-container">
                <div v-if="currentType && isChart" class="charts">
                  <div class="chart-container" v-for="(item, index) in chartData" :key="index" :style="{width: item.width}">
                    <div class="chart-title">{{item.title}}</div>
                    <div class="chart-box">
                      <div :id="item.id" :style="{width: '100%', height: item.height}" :key="Math.random()"></div>
                    </div>
                  </div>
                </div>
                <ComTable v-if="currentType && !isChart" :tableData="tableData" :tableGroup="tableGroup" :key="Math.random()"></ComTable>
                <ComTable v-if="currentType === 'DISTRIBUTED' && !isChart" :tableData="tableDataSecond" :tableGroup="tableGroupSecond" :key="Math.random()"></ComTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <printTable ref="printTableRef" :printTable="printTable"></printTable>
  </div>
</template>

<script>
import ajax from '@/api/imageLibrary/imageStatistics.js'
import hscodeAjax from '@/api/background/HSCode.js'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
export default {
  name: 'imageStatistics',
  data () {
    return {
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 0,
        title: this.$t(this.$route.name),
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 0,
            infoType: 'statisticConditionInfo',
            label: this.$t('vicenter.reports.common.statisticCondition')
          },
          {
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageStatistics.statisticsType'),
                ruleProp: 'type'
              },
              {
                type: 'value',
                value: '',
                ruleProp: 'type'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageStatistics.imageStatus'),
                ruleProp: 'imgStatus'
              },
              {
                type: 'value',
                value: '',
                ruleProp: 'imgStatus'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageStatistics.imageSource'),
                ruleProp: 'imageSource'
              },
              {
                type: 'value',
                value: '',
                ruleProp: 'imageSource'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.hsCodes'),
                ruleProp: 'hsCodes'
              },
              {
                type: 'value',
                value: '',
                ruleProp: 'hsCodes'
              }
            ]
          },
          {
            type: 'title',
            colspan: 0,
            infoType: 'statisticDetailsInfo',
            label: this.$t('vicenter.reports.common.statisticDetails')
          },
          {
            type: 'content',
            infoType: 'statisticDetailsTitleInfo',
            data: []
          }
        ]
      },
      titleBread: {
        font: '/',
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Reports/index'
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.reports.common.statisticCondition')
        },
        chartTitle: {
          title: this.$t('vicenter.reports.common.statisticDetails')
        }
      },
      currentType: 'DISTRIBUTED',
      currentImageStatus: [],
      currentImageSource: [],
      searchIpt: [
        {
          getLabel: this.$t('vicenter.ImageLibrary.imageStatistics.statisticsType'),
          type: 'select',
          models: 'DISTRIBUTED',
          ruleProp: 'type',
          placeHolder: '',
          option: [
            {
              value: 'DISTRIBUTED', // 图像分布统计
              label: this.$t('vicenter.ImageLibrary.imageStatistics.imageDistribution')
            },
            {
              value: 'RECOMMEND', // 图像推荐统计
              label: this.$t('vicenter.ImageLibrary.imageStatistics.imageRecommend')
            },
            {
              value: 'USAGE', // 图像使用统计
              label: this.$t('vicenter.ImageLibrary.imageStatistics.imageUsage')
            }
          ],
          change: this.changeDimension,
          KeepDefault: true, // 保留默认值
          defaultValue: 'DISTRIBUTED', // 默认值
          hiden: false
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.imageStatistics.imageStatus'),
          placeHolder: this.$t('vicenter.ImageLibrary.imageStatistics.imageStatusSelect'),
          type: 'select2',
          filterable: true,
          models: [],
          ruleProp: 'imgStatus',
          option: [
            {
              value: 'TEMPORARY',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.TEMPORARY')
            },
            {
              value: 'SUBMIT',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.SUBMIT')
            },
            {
              value: 'PUBLISHED',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.PUBLISHED')
            },
            {
              value: 'REJECTED',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.REJECTED')
            }
          ],
          KeepDefault: true,
          defaultValue: [],
          change: this.changeImageStatus,
          hiden: false
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.imageStatistics.imageSource'),
          placeHolder: this.$t('vicenter.ImageLibrary.imageStatistics.imageSourceSelect'),
          type: 'select2',
          filterable: true,
          models: [],
          ruleProp: 'imgCollectMode',
          option: [
            {
              value: 'MANNUAL',
              label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.MANNUAL')
            },
            {
              value: 'SUPERVISION',
              label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.SUPERVISION')
            }
            // {
            //   value: 'INSPECTION',
            //   label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.INSPECTION')
            // }
          ],
          KeepDefault: true,
          defaultValue: [],
          change: this.changeImageSource,
          hiden: false
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.common.hsCodes'),
          placeHolder: this.$t('vicenter.ImageLibrary.common.selectHsCodes'),
          models: '',
          options: [],
          ruleProp: 'hsCodes',
          type: 'treeInput',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'hsCodesInput',
          treeDataId: 'hsCodesData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.hsCodesCheckChange,
          treeRefName: 'hsCodesIptRef',
          treeIptComName: 'hsCodesTree',
          TreeProps: {
            children: 'children',
            label: function (data) {
              // 重写节点的label显示内容
              return `(${data.code}) ${data.name}`
            }
          },
          goodsOption: {
            hscodeTreeQuery: false,
            hscodePosition: true,
            isShowCheckbox: true,
            checkedKeys: [],
            defaultExpandedKeys: []
          }
        }
      ],
      searchFunc: {
        query: this.query,
        close: this.resetForm,
        queryText: this.$t('vicenter.common.statistics'),
        resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        model: {
          type: 'DISTRIBUTED',
          imgStatus: [],
          imgCollectMode: [],
          hsCodes: ''
        },
        refName: 'imageStatisticQueryForm',
        rule: {
          imgStatus: [
            { required: true, message: this.$t('vicenter.ImageLibrary.imageStatistics.imageStatusSelect'), trigger: 'change' }
          ],
          imgCollectMode: [
            { required: true, message: this.$t('vicenter.ImageLibrary.imageStatistics.imageSourceSelect'), trigger: 'change' }
          ]
        }
      },
      colors: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa'],
      distributionChartData: [
        {
          id: 'statusBarChart',
          type: 'barStack',
          width: '59%',
          height: '300px',
          title: this.$t('vicenter.ImageLibrary.imageStatistics.imageStatusDistribution'),
          data: []
        },
        {
          id: 'statusPieChart',
          type: 'pie',
          width: '39%',
          height: '300px',
          title: this.$t('vicenter.ImageLibrary.imageStatistics.imageStatusProportion'),
          data: []
        },
        {
          id: 'sourceBarChart',
          type: 'barStack',
          width: '59%',
          height: '300px',
          title: this.$t('vicenter.ImageLibrary.imageStatistics.imageSourceDistribution'),
          data: []
        },
        {
          id: 'sourcePieChart',
          type: 'pie',
          width: '39%',
          height: '300px',
          title: this.$t('vicenter.ImageLibrary.imageStatistics.imageSourceProportion'),
          data: []
        }
      ],
      recommendChartData: [
        {
          id: 'recommendBarChart',
          type: 'barStack',
          width: '59%',
          height: '350px',
          title: this.$t('vicenter.ImageLibrary.imageStatistics.referrerStatistics'),
          data: []
        },
        {
          id: 'recommendPieChart',
          type: 'pie',
          width: '39%',
          height: '350px',
          title: this.$t('vicenter.ImageLibrary.imageStatistics.referrerProportion'),
          data: []
        }
      ],
      usageChartData: [
        {
          id: 'usageBarChart',
          type: 'bar',
          width: '100%',
          height: '500px',
          title: this.$t('vicenter.ImageLibrary.imageStatistics.usageTop10'),
          data: []
        }
      ],
      chartData: [],
      distributionTableGroup: [
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.imageStatus'),
          type: 'text',
          model: 'series1',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.standardQty'),
          type: 'text',
          model: 'series2',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.irregularQty'),
          type: 'text',
          model: 'series3',
          width: ''
        }
      ],
      recommendTableGroup: [
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.referrer'),
          type: 'text',
          model: 'series1',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.standardQty'),
          type: 'text',
          model: 'series2',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.irregularQty'),
          type: 'text',
          model: 'series3',
          width: ''
        }
      ],
      usageTableGroup: [
        {
          label: this.$t('vicenter.ImageLibrary.common.ImageName'),
          type: 'text',
          model: 'series1',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.usageQty'),
          type: 'text',
          model: 'series2',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.referrer'),
          type: 'text',
          model: 'series3',
          width: ''
        }
      ],
      tableGroup: [],
      tableData: {
        refName: 'firstTableRef',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false
      },
      tableGroupSecond: [
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.imageSource'),
          type: 'text',
          model: 'series1',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.standardQty'),
          type: 'text',
          model: 'series2',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageStatistics.irregularQty'),
          type: 'text',
          model: 'series3',
          width: ''
        }
      ],
      tableDataSecond: {
        refName: 'secondTableRef',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false
      },
      uploading: false,
      uploadingTxt: this.$t('vicenter.common.loading'),
      isChart: true,
      exportFileName: '',
      exportExcelParams: {},
      resultData: [],
      commonObj: {
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
      }
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    // 获取hscode信息
    this.hscodeAjaxTree()
    // 图像状态和图像来源默认全部选中
    this.defaultSelectAll()
    this.query()
  },
  mounted () {
  },
  methods: {
    loadchart () {
      if (this.currentType === 'DISTRIBUTED') {
        this.chartData = [...this.distributionChartData]
        this.tableGroup = [...this.distributionTableGroup]
        let { irregularCollectModeItem, standardCollectModeItem, irregularStatusItem, standardStatusItem } = this.resultData
        this.initBarStack('statusBarChart', [standardStatusItem, irregularStatusItem], 'status')
        this.initBarStack('sourceBarChart', [standardCollectModeItem, irregularCollectModeItem], 'source')
        this.initPie('statusPieChart', [standardStatusItem, irregularStatusItem], 'status')
        this.initPie('sourcePieChart', [standardCollectModeItem, irregularCollectModeItem], 'source')
        this.initTable([standardStatusItem, irregularStatusItem, standardCollectModeItem, irregularCollectModeItem], true)
      } else if (this.currentType === 'RECOMMEND') {
        this.chartData = [...this.recommendChartData]
        this.tableGroup = [...this.recommendTableGroup]
        this.initBarStack('recommendBarChart', this.resultData, 'recommend')
        this.initPie('recommendPieChart', this.resultData, 'recommend')
        this.initTable(this.resultData)
      } else if (this.currentType === 'USAGE') {
        this.chartData = [...this.usageChartData]
        this.tableGroup = [...this.usageTableGroup]
        this.initBar('usageBarChart', this.resultData)
        this.initTable(this.resultData)
      }
    },
    handlePrint () {
      this.initPrintInfo()
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.initPrintInfo()
      this.$refs.printTableRef.handleExport()
    },
    query () {
      this.uploading = true
      // 处理请求参数
      let params = {}
      let {type, imgStatus, imgCollectMode, hsCodes} = this.formRule.model
      this.currentType = type
      params.imgStatus = imgStatus.join(',')
      params.imgCollectMode = imgCollectMode.join(',')
      params.hsCode = hsCodes || ''
      this.currentImageStatus = params.imgStatus.split(',')
      this.currentImageSource = params.imgCollectMode.split(',')
      this.exportExcelParams = params
      if (this.currentType === 'DISTRIBUTED') {
        ajax.queryByImgDistribution(params).then(res => {
          if (res.data.flag && res.data.result) {
            if (res.data.result) {
              this.resultData = res.data.result
            } else {
              this.resultData = {}
            }
            this.tabChartTable(false)
            this.uploading = false
          }
        }).catch(() => {})
      } else if (this.currentType === 'RECOMMEND') {
        ajax.queryByImgRecommend(params).then(res => {
          if (res.data.flag) {
            if (res.data.result && res.data.result.length > 0) {
              this.resultData = res.data.result
            } else {
              this.resultData = []
            }
            this.tabChartTable(false)
            this.uploading = false
          }
        }).catch(() => {})
      } else if (this.currentType === 'USAGE') {
        ajax.queryByImgUse(params).then(res => {
          if (res.data.flag) {
            if (res.data.result && res.data.result.length > 0) {
              this.resultData = res.data.result
            } else {
              this.resultData = []
            }
            this.tabChartTable(false)
            this.uploading = false
          }
        }).catch(() => {})
      }
    },
    initBar (domId, data) {
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initBar(domId, data)
        })
        return
      }
      let legendData = data.map(item => item.imgName)
      let seriesData = data.map((item, index) => {
        let obj = {
          name: item.imgName,
          type: 'bar',
          barMaxWidth: 80,
          barGap: '100%',
          data: [item.useNum]
        }
        return obj
      })
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
          top: '2%',
          bottom: '10%',
          left: '2%',
          right: '2%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initBarStack (domId, data, type) {
      let _this = this
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        setTimeout(() => {
          _this.initBarStack(domId, data, type)
        })
        return
      }
      let legendData = [
        this.$t('vicenter.ImageLibrary.common.imageType.STANDARD'),
        this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL')
      ]
      let yAxisData = []
      let seriesData = [
        {
          name: legendData[0],
          type: 'bar',
          barMaxWidth: 80,
          stack: 'total',
          data: []
        },
        {
          name: legendData[1],
          type: 'bar',
          barMaxWidth: 80,
          stack: 'total',
          data: []
        }
      ]
      if (type === 'status') {
        this.currentImageStatus.forEach(e => {
          yAxisData.push(this.commonObj[e].label)
          seriesData[0].data.push(data[0][this.commonObj[e].model])
          seriesData[1].data.push(data[1][this.commonObj[e].model])
        })
      } else if (type === 'source') {
        this.currentImageSource.forEach(e => {
          yAxisData.push(this.commonObj[e].label)
          seriesData[0].data.push(data[0][this.commonObj[e].model])
          seriesData[1].data.push(data[1][this.commonObj[e].model])
        })
      } else if (type === 'recommend') {
        data.forEach(e => {
          yAxisData.push(e.userAccount)
          seriesData[0].data.push(e.imgTypeItem.standardNum)
          seriesData[1].data.push(e.imgTypeItem.irregularNum)
        })
      }
      let myChart = this.$echarts.init(chartDom)
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left'
        },
        legend: {
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: ['#2ec7c9', '#b6a2de'],
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: yAxisData,
            axisLabel: {
              formatter: function (value) {
                return _this.chartsFormat(value, 20)
              }
            }
          }
        ],
        grid: {
          top: '2%',
          bottom: '10%',
          left: '2%',
          right: '2%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initPie (domId, data, type) {
      let _this = this
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        setTimeout(() => {
          _this.initPie(domId, data, type)
        })
        return
      }
      let legendData = []
      let seriesData = []
      let itemQtyArr = []
      if (type === 'status') {
        this.currentImageStatus.forEach(e => {
          let itemQty = data[0][this.commonObj[e].model] + data[1][this.commonObj[e].model]
          itemQtyArr.push(itemQty)
          legendData.push(this.commonObj[e].label)
        })
      } else if (type === 'source') {
        this.currentImageSource.forEach(e => {
          let itemQty = data[0][this.commonObj[e].model] + data[1][this.commonObj[e].model]
          itemQtyArr.push(itemQty)
          legendData.push(this.commonObj[e].label)
        })
      } else if (type === 'recommend') {
        data.forEach(e => {
          let itemQty = e.imgTypeItem.standardNum + e.imgTypeItem.irregularNum
          itemQtyArr.push(itemQty)
          legendData.push(e.userAccount)
        })
      }
      itemQtyArr.forEach((e, index) => {
        seriesData.push({
          name: legendData[index],
          value: e,
          label: {
            normal: {
              align: 'left',
              formatter: '{b}: {c} ({d}%)'
            }
          }
        })
      })
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
        color: this.colors,
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
    },
    initTable (data, flag) {
      this.tableData.data = []
      this.tableDataSecond.data = []
      if (this.currentType === 'DISTRIBUTED') {
        this.currentImageStatus.forEach(item => {
          this.tableData.data.push({
            series1: this.commonObj[item].label,
            series2: data[0][this.commonObj[item].model],
            series3: data[1][this.commonObj[item].model]
          })
        })
      }
      if (this.currentType === 'RECOMMEND') {
        data.forEach(e => {
          this.tableData.data.push({
            series1: e.userAccount,
            series2: e.imgTypeItem.standardNum,
            series3: e.imgTypeItem.irregularNum
          })
        })
      }
      if (this.currentType === 'USAGE') {
        data.forEach(e => {
          this.tableData.data.push({
            series1: e.imgName,
            series2: e.useNum,
            series3: e.userAccount
          })
        })
      }
      if (flag) {
        this.currentImageSource.forEach(item => {
          this.tableDataSecond.data.push({
            series1: this.commonObj[item].label,
            series2: data[2][this.commonObj[item].model],
            series3: data[3][this.commonObj[item].model]
          })
        })
      }
    },
    // 统计维度切换
    changeDimension () {
      let type = this.searchIpt[0].models
      this.$refs.searchFormRef.reset()
      this.searchIpt[0].models = type
    },
    // 图表列表切换
    tabChartTable (flag = true) {
      if (flag) {
        this.isChart = !this.isChart
      }
      let type = this.currentType
      this.currentType = ''
      this.$nextTick(() => {
        this.currentType = type
        this.loadchart()
      })
    },
    // 导出
    exportData (command) {
      // 导出文件名称
      this.exportFileName = this.$t(this.$route.name)
      if (command === 'excel') {
        this.handleExportExcel()
      } else if (command === 'pdfChart') {
        this.getPdf(document.getElementById('export-container'), this.exportFileName, false)
      } else if (command === 'pdfTable') {
        this.handleExport()
      } else if (command === 'image') {
        this.getPdf(document.getElementById('export-container'), this.exportFileName, true)
      }
    },
    handleExportExcel () {
      const {lang} = this.$store.state
      let params = {
        lang: lang,
        model: this.exportExcelParams,
        sysMenu: '',
        allDataNum: this.tableData.data.length,
        url: ''
      }
      if (this.currentType === 'DISTRIBUTED') {
        params.url = '/imagelibrary/imgStatistics/exportExcelByImgDistribution'
      } else if (this.currentType === 'RECOMMEND') {
        params.url = '/imagelibrary/imgStatistics/exportExcelByImgRecommend'
      } else if (this.currentType === 'USAGE') {
        params.url = '/imagelibrary/imgStatistics/exportExcelByImgUse'
      }
      this.$commonExportExcel(params)
    },
    initPrintInfo () {
      let infoObj = {}
      infoObj.allColsNum = 4
      infoObj.detailsTitleInfo = this.tableGroup.map((item, index) => {
        return {
          type: 'label',
          colspan: index === 0 ? 2 : 1,
          value: item.label,
          ruleProp: item.model
        }
      })
      infoObj.detailsInfo = this.tableData.data.map((item, index) => {
        let rowsInfo = [
          {
            type: 'text',
            colspan: 2,
            value: item.series1,
            ruleProp: ''
          },
          {
            type: 'text',
            value: item.series2,
            ruleProp: ''
          },
          {
            type: 'text',
            value: item.series3,
            ruleProp: ''
          }
        ]
        return rowsInfo
      })
      if (this.currentType === 'DISTRIBUTED') {
        infoObj.detailsSecondTitleInfo = this.tableGroupSecond.map((item, index) => {
          return {
            type: 'label',
            colspan: index === 0 ? 2 : 1,
            value: item.label,
            ruleProp: item.model
          }
        })
        infoObj.detailsSecondInfo = this.tableDataSecond.data.map((item, index) => {
          let rowsInfo = [
            {
              type: 'text',
              colspan: 2,
              value: item.series1,
              ruleProp: ''
            },
            {
              type: 'text',
              value: item.series2,
              ruleProp: ''
            },
            {
              type: 'text',
              value: item.series3,
              ruleProp: ''
            }
          ]
          return rowsInfo
        })
      }
      this.getPrintInfo(infoObj, 5)
    },
    getPrintInfo (infoObj, n) {
      let { allColsNum, conditionInfo, detailsTitleInfo, detailsInfo, detailsSecondTitleInfo, detailsSecondInfo } = infoObj
      this.printTable.allColsNum = allColsNum
      // 前n-1行的数据是保持不变的
      this.printTable.infoData.splice(n)
      this.printTable.infoData.forEach(item => {
        if (item.type === 'title') {
          item.colspan = allColsNum
        }
        if (item.infoType === 'statisticDetailsTitleInfo') {
          item.data = detailsTitleInfo
        }
      })
      detailsInfo.forEach(itemArr => {
        this.printTable.infoData.push({
          type: 'content',
          infoType: 'statisticDetailsInfo',
          data: itemArr
        })
      })
      if (detailsSecondTitleInfo && detailsSecondInfo) {
        this.printTable.infoData.push({
          type: 'content',
          infoType: 'statisticDetailsSecondTitleInfo',
          data: detailsSecondTitleInfo
        })
        detailsSecondInfo.forEach(itemArr => {
          this.printTable.infoData.push({
            type: 'content',
            infoType: 'statisticDetailSecondsInfo',
            data: itemArr
          })
        })
      }
      this.printTable.infoData[1].data[1].value = this.getSelectedLabel(this.searchIpt[0].option, this.currentType)
      this.printTable.infoData[1].data[3].value = this.getSelectedLabel(this.searchIpt[1].option, this.exportExcelParams.imgStatus)
      this.printTable.infoData[2].data[1].value = this.getSelectedLabel(this.searchIpt[2].option, this.exportExcelParams.imgCollectMode)
      this.printTable.infoData[2].data[3].value = this.exportExcelParams.hsCode.split(',').join(', ')
    },
    /**
     * 获取hscode树方法
     */
    hscodeAjaxTree () {
      let params = {
        hsCode: 0
      }
      hscodeAjax.getNodeAndChildren(params).then(res => {
        if (res.data.flag) {
          let treeData = this.$json2treeData(res.data.result, 'id', 'pid')
          this.$data.searchIpt.forEach(e => {
            if (e.ruleProp === 'hsCodes') {
              e.treedata = treeData
            }
          })
        }
      }).catch(() => {})
    },
    /**
     * hscode树点击节点
     */
    hsCodesCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$hscodeCheckChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.searchIpt.forEach(e => {
          if (e.ruleProp === 'hsCodes') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['hsCodes'] = checkedValue.codes
      }
    },
    defaultSelectAll () {
      this.currentImageStatus = []
      this.currentImageSource = []
      this.searchIpt.forEach(item => {
        if (item.ruleProp === 'imgStatus' || item.ruleProp === 'imgCollectMode') {
          item.models = item.option.map(e => e.value)
          item.defaultValue = item.option.map(e => e.value)
          this.formRule.model[item.ruleProp] = item.models
          if (item.ruleProp === 'imgStatus') {
            this.currentImageStatus = item.option.map(e => e.value)
          }
          if (item.ruleProp === 'imgCollectMode') {
            this.currentImageSource = item.option.map(e => e.value)
          }
        }
        if (item.ruleProp === 'hsCodes') {
          this.formRule.model['hsCodes'] = ''
        }
      })
    },
    // 日期查询条件获得焦点
    focus () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      if (picker) {
        picker.addEventListener('click', function () {
          for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
            picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
          }
        })
      }
    },
    // 日期查询条件失去焦点
    blur () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      picker.addEventListener('click', function () {
        for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
          picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
        }
      })
    },
    changeImageSource () {
      this.$changeSelectValidateField('searchFormRef', this, 'imgStatus')
    },
    changeImageStatus () {
      this.$changeSelectValidateField('searchFormRef', this, 'imgCollectMode')
    },
    resetForm () {},
    getSelectedLabel (option, selectedOption) {
      let labelsArr = []
      option.forEach(o => {
        if (selectedOption.split(',').indexOf(o.value) > -1) {
          labelsArr.push(o.label)
        }
      })
      return labelsArr.join(', ')
    },
    treeClick () {},
    getSort () {},
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
  components: { bread, panelTitle, ComForm, ComTable }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#Image-Statistics-bar {
  @extend .extend-bar;
  #Image-Statistics-M {
    padding:$margin;
    @include box-sizing;
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
      }
      .search-form {
        .el-form-item {
          margin-bottom: 16px;
          .el-form-item__label {
            line-height: 32px;
          }
          .el-input__inner {
            height: 32px!important;
          }
          .el-button {
            padding: 8px 20px;
          }
          .el-input__icon {
            line-height: 26px;
          }
          .el-date-editor {
            .el-range__icon,.el-range-separator,.el-range__close-icon {
              line-height: 26px;
            }
          }
        }
      }
    }
    .infolist {
      .panel {
        @extend .extend-panel;
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
        .chartBox {
          width: $all;
          height: calc(100% - 35px);
          overflow: hidden;
          .chartBox-content {
            height: $all;
            overflow: hidden;
            .charts {
              @include flex(row, center, flex-start);
              flex-wrap: wrap;
              .chart-container {
                border: 1px solid #e9e9e9;
                border-radius: 4px;
                margin: 0.5%;
                @include box-sizing();
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
              }
            }
          }
        }
        .notActive {
          color: #ccc!important;
          cursor: not-allowed;
        }
        .operate-menu {
          button {
            margin: 0!important;
          }
        }
      }
    }
  }
}
</style>
