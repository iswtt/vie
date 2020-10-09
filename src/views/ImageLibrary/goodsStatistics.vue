<template>
  <div id='goods-statistic-bar' v-bar>
    <div id="goods-statistic-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar">
           <GoodsTree :goodsOption="goodsOption" @data="currentClickGoods"></GoodsTree>
          </div>
        </div>
        <div class="panel panel-L"  v-loading="uploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
          <div class="charTable">
            <panelTitle :panelTitleInit="panelTitle.listTitleUp">
              <el-button v-if="printButton && !isChart" type="text"  :title="$t('vicenter.common.print')" @click="handlePrintType" data-id="print-btn"><span class='iconfont editTable btnClass'>&#xe68b;</span></el-button>
              <el-button type="text" :title="$t('vicenter.common.chart')" @click='tabTypeChartTable' :disabled="isChart" data-id="chart-btn"><span class='iconfont editTable btnClass' :class="{notActive: isChart}">&#xe6d4;</span></el-button>
              <el-button type="text" :title="$t('vicenter.common.list')" @click='tabTypeChartTable' :disabled="!isChart" data-id="list-btn"><span class='iconfont editTable btnClass' :class="{notActive: !isChart}">&#xe602;</span></el-button>
              <el-dropdown @command="exportTypeData">
                <el-button v-show="exportButton" data-id="exportData-btn" type="text" class='transQuery' :title="$t('vicenter.common.exportData')"><span class='iconfont editTable btnClass'>&#xe60b;</span></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="isChart" command="image" data-id="exportJpg-btn">{{$t('vicenter.ImageLibrary.common.exportJPG')}}</el-dropdown-item>
                  <el-dropdown-item v-if="!isChart" command="excel" data-id="exportExcel-btn">{{$t('vicenter.ImageLibrary.common.exportEXCEL')}}</el-dropdown-item>
                  <el-dropdown-item v-if="isChart" command="pdfChart" data-id="exportPdfChart-btn">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
                  <el-dropdown-item v-if="!isChart" command="pdfTable" data-id="exportPdfTable-btn">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </panelTitle>
            <div class="chartBox" v-bar>
              <div class="innerbox">
                <div v-show="isChart" class="chartHeight">
                  <div v-show="!imageTypeNoData" :id="imageTypeData.id" class="chart">
                  </div>
                  <div v-show="imageTypeNoData" class="noData">
                    {{$t('vicenter.ImageLibrary.common.NoData')}}
                  </div>
                </div>
                <ComTable v-show="!isChart" id="typeTable" :tableData="typeTableData" :tableGroup="typeTableGroup" ></ComTable>
              </div>
            </div>
          </div>
          <div class="charTable">
            <panelTitle :panelTitleInit="panelTitle.listTitleDown">
              <el-button v-if="printButton && !isChartStatus" type="text"  :title="$t('vicenter.common.print')" @click="handlePrintStatus" data-id="print-btn"><span class='iconfont editTable btnClass'>&#xe68b;</span></el-button>
              <el-button type="text" :title="$t('vicenter.common.chart')" @click='tabStatusChartTable' :disabled="isChartStatus" data-id="statusChart-btn"><span class='iconfont editTable btnClass' :class="{notActive: isChartStatus}">&#xe6d4;</span></el-button>
              <el-button type="text" :title="$t('vicenter.common.list')" @click='tabStatusChartTable' :disabled="!isChartStatus" data-id="statusList-btn"><span class='iconfont editTable btnClass' :class="{notActive: !isChartStatus}">&#xe602;</span></el-button>
              <el-dropdown @command="exportStatusData">
                <el-button v-show="exportButton" data-id="statusExportData-btn" type="text" class='transQuery' :title="$t('vicenter.common.exportData')"><span class='iconfont editTable btnClass'>&#xe60b;</span></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="isChartStatus" command="image" data-id="statusExportJpg-btn">{{$t('vicenter.ImageLibrary.common.exportJPG')}}</el-dropdown-item>
                  <el-dropdown-item v-if="!isChartStatus" command="excel" data-id="statusExportExcel-btn">{{$t('vicenter.ImageLibrary.common.exportEXCEL')}}</el-dropdown-item>
                  <el-dropdown-item v-if="isChartStatus" command="pdfChart" data-id="statusExportPdfChart-btn">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
                  <el-dropdown-item v-if="!isChartStatus" command="pdfTable" data-id="statusExportPdfTable-btn">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </panelTitle>
            <div class="chartBox" v-bar>
              <div class="innerbox">
                <div v-show="isChartStatus" class="chartHeight">
                  <div v-show="!imageStatusNoData" :id="imageStatusData.id" class="chart">
                  </div>
                  <div v-show="imageStatusNoData" class="noData">
                    {{$t('vicenter.ImageLibrary.common.NoData')}}
                  </div>
                </div>
                <ComTable v-show="!isChartStatus" id="statusTable" :tableData="statusTableData" :tableGroup="statusTableGroup" ></ComTable>
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
import comAjax from '@/api/background/HSCode.js' // 接口文件
import ajax from '@/api/imageLibrary/goodsStatistics.js' // 接口文件
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import exportExcel from '@/lib/exportExcel/export2Excel.js'
import GoodsTree from './common/goodsTree'
export default {
  name: 'goodsStatistics',
  data () {
    return {
      printButton: false,
      exportButton: false,
      printTable: {},
      printTableType: {
        allColsNum: 3,
        title: this.$t('vicenter.ImageLibrary.common.imageTypeDetail'),
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 3,
            infoType: 'typeStatisticDetails',
            label: this.$t('vicenter.reports.common.statisticDetails')
          },
          {
            type: 'content',
            infoType: 'typeStatisticDetails',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.goodsStatistics.classification'),
                ruleProp: 'hsName'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.imageType.STANDARD'),
                ruleProp: 'standard'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL'),
                ruleProp: 'irregular'
              }
            ]
          }
        ]
      },
      printTableStatus: {
        allColsNum: 5,
        title: this.$t('vicenter.ImageLibrary.common.imageStatusDetail'),
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 5,
            infoType: 'statusStatisticDetails',
            label: this.$t('vicenter.reports.common.statisticDetails')
          },
          {
            type: 'content',
            infoType: 'statusStatisticDetails',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.goodsStatistics.classification'),
                ruleProp: 'hsName'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.imageStatus.TEMPORARY'),
                ruleProp: 'temporary'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.imageStatus.SUBMIT'),
                ruleProp: 'submitted'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.imageStatus.PUBLISHED'),
                ruleProp: 'published'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.imageStatus.REJECTED'),
                ruleProp: 'rejected'
              }
            ]
          }
        ]
      },
      uploading: false,
      uploadingTxt: this.$t('vicenter.common.loading'),
      goodsOption: {
        isShowCheckbox: false
      },
      isChart: true,
      isChartStatus: true,
      exportFileName: '',
      statusTHeader: [],
      statusFields: [],
      typeTHeader: [],
      typeFields: [],
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/ImageLibrary/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.ImageLibrary.goodsStatistics.goodsType')
        },
        listTitleUp: {
          title: this.$t('vicenter.ImageLibrary.goodsStatistics.imageTypeStatistics')
        },
        listTitleDown: {
          title: this.$t('vicenter.ImageLibrary.goodsStatistics.imageStatusStatistics')
        }
      },
      option: {
        title: {
          show: true,
          text: '',
          left: 'center',
          textStyle: {
            fontSize: 18
          }
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: 0,
          top: 0,
          data: [],
          type: 'scroll',
          textStyle: {
            color: '#606266'
          }
        },
        tooltip: {
          trigger: 'item',
          textStyle: {
            align: 'left'
          },
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        grid: {
          top: '10%',
          bottom: '5%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            data: [],
            label: {
              normal: {
                formatter: '{b}: {c} ({d}%)'
              }
            },
            labelLine: {
              smooth: true
            }
          }
        ],
        color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32']
      },
      imageTypeData: {
        id: 'imageTypeChart',
        title: {
          text: ''
        },
        legend: {
          data: [this.$t('vicenter.ImageLibrary.common.imageType.STANDARD'), this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL')]
        },
        series: {
          data: [
            {
              value: 0,
              name: this.$t('vicenter.ImageLibrary.common.imageType.STANDARD')
            },
            {
              value: 0,
              name: this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL')
            }
          ]
        }
      },
      imageTypeNoData: false,
      imageStatusData: {
        id: 'imageStatusChart',
        title: {
          text: ''
        },
        legend: {
          data: [
            this.$t('vicenter.ImageLibrary.common.imageStatus.TEMPORARY'),
            this.$t('vicenter.ImageLibrary.common.imageStatus.SUBMIT'),
            this.$t('vicenter.ImageLibrary.common.imageStatus.PUBLISHED'),
            this.$t('vicenter.ImageLibrary.common.imageStatus.REJECTED')
          ]
        },
        series: {
          data: [
            {
              value: 0,
              name: this.$t('vicenter.ImageLibrary.common.imageStatus.TEMPORARY')
            },
            {
              value: 0,
              name: this.$t('vicenter.ImageLibrary.common.imageStatus.SUBMIT')
            },
            {
              value: 0,
              name: this.$t('vicenter.ImageLibrary.common.imageStatus.PUBLISHED')
            },
            {
              value: 0,
              name: this.$t('vicenter.ImageLibrary.common.imageStatus.REJECTED')
            }
          ]
        }
      },
      imageStatusNoData: false,
      typeTableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.ImageLibrary.goodsStatistics.classification'),
          type: 'text',
          model: 'hsName',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.imageType.STANDARD'),
          type: 'text',
          model: 'standard',
          width: '280px'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL'),
          type: 'text',
          model: 'irregular',
          width: '280px'
        }
      ],
      typeTableData: { // 表格数据
        refName: 'goodsTypeTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort
      },
      statusTableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.ImageLibrary.goodsStatistics.classification'),
          type: 'text',
          model: 'hsName',
          width: ''
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.imageStatus.TEMPORARY'),
          type: 'text',
          model: 'temporary',
          width: '140px'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.imageStatus.SUBMIT'),
          type: 'text',
          model: 'submitted',
          width: '140px'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.imageStatus.PUBLISHED'),
          type: 'text',
          model: 'published',
          width: '140px'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.imageStatus.REJECTED'),
          type: 'text',
          model: 'rejected',
          width: '140px'
        }
      ],
      statusTableData: { // 表格数据
        refName: 'goodsStatusTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort
      },
      HSCodeId: '' // 当前选中的节点id
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
  },
  mounted () {
    this.initTreeData()
  },
  methods: {
    getInfoType () {
      if (this.typeTableData.data && this.typeTableData.data.length > 0) {
        this.printTableType.infoData.splice(2)
        this.typeTableData.data.forEach(item => {
          let obj = {
            type: 'content',
            infoType: 'typeStatisticDetails',
            data: [
              {
                type: 'text',
                value: item.hsName,
                ruleProp: 'hsName'
              },
              {
                type: 'text',
                value: item.standard,
                ruleProp: 'standard'
              },
              {
                type: 'text',
                value: item.irregular,
                ruleProp: 'irregular'
              }
            ]
          }
          this.printTableType.infoData.push(obj)
        })
      }
      this.printTable = {}
      this.printTable = this.printTableType
    },
    getInfoStatus () {
      if (this.statusTableData.data && this.statusTableData.data.length > 0) {
        this.printTableStatus.infoData.splice(2)
        this.statusTableData.data.forEach(item => {
          let obj = {
            type: 'content',
            infoType: 'statusStatisticDetails',
            data: [
              {
                type: 'text',
                value: item.hsName,
                ruleProp: 'hsName'
              },
              {
                type: 'text',
                value: item.temporary,
                ruleProp: 'temporary'
              },
              {
                type: 'text',
                value: item.submitted,
                ruleProp: 'submitted'
              },
              {
                type: 'text',
                value: item.published,
                ruleProp: 'published'
              },
              {
                type: 'text',
                value: item.rejected,
                ruleProp: 'rejected'
              }
            ]
          }
          this.printTableStatus.infoData.push(obj)
        })
      }
      this.printTable = {}
      this.printTable = this.printTableStatus
    },
    handlePrintType () {
      this.getInfoType()
      this.$refs.printTableRef.handlePrint()
    },
    handleExportType () {
      this.getInfoType()
      this.$refs.printTableRef.handleExport()
    },
    handlePrintStatus () {
      this.getInfoStatus()
      this.$refs.printTableRef.handlePrint()
    },
    handleExportStatus () {
      this.getInfoStatus()
      this.$refs.printTableRef.handleExport()
    },
    getAjaxData () {
      let params = {
        id: this.HSCodeId
      }
      this.getDataForChart(params)
      this.getDataForTable(params)
    },
    getDataForChart (params) {
      this.uploading = true
      ajax.getDataForChart(params).then(res => {
        if (res.data.flag) {
          this.uploading = false
          let data = []
          Object.assign(data, res.data.result)
          if (data.length > 0) {
            let { hsCode, hsName, standard, irregular, temporary, published, rejected, submitted } = data[0]
            this.imageTypeData.title.text = hsCode ? `(${hsCode})${hsName}` : ''
            this.imageTypeData.series.data[0].value = standard || null
            this.imageTypeData.series.data[1].value = irregular || null
            this.imageStatusData.title.text = hsCode ? `(${hsCode})${hsName}` : ''
            this.imageStatusData.series.data[0].value = temporary || null
            this.imageStatusData.series.data[1].value = submitted || null
            this.imageStatusData.series.data[2].value = published || null
            this.imageStatusData.series.data[3].value = rejected || null
            if (standard === 0 && irregular === 0) {
              this.imageTypeNoData = true
            } else {
              this.imageTypeNoData = false
              this.initTypeChart()
            }
            if (submitted === 0 && rejected === 0 && published === 0 && temporary === 0) {
              this.imageStatusNoData = true
            } else {
              this.imageStatusNoData = false
              this.initStatusChart()
            }
          } else {
            this.imageStatusNoData = true
            this.imageTypeNoData = true
          }
        }
      }).catch(() => {})
    },
    getDataForTable (params) {
      this.uploading = true
      ajax.getDataForTable(params).then(res => {
        if (res.data.flag) {
          this.uploading = false
          let data = []
          Object.assign(data, res.data.result)
          this.typeTableData.data = data
          if (this.typeTableData.data.length > 0) {
            this.typeTableData.data.forEach(item => {
              for (let i in item) {
                if (!item[i] && i !== 'hsName') {
                  item[i] = 0
                } else if (!item[i] && i === 'hsName') {
                  item[i] = 'No Classification'
                }
              }
            })
          }
          this.statusTableData.data = data
          if (this.statusTableData.data.length > 0) {
            this.statusTableData.data.forEach(item => {
              for (let i in item) {
                if (!item[i] && i !== 'hsName') {
                  item[i] = 0
                } else if (!item[i] && i === 'hsName') {
                  item[i] = 'No Classification'
                }
              }
            })
          }
          this.initTypeTable()
          this.initStatusTable()
        }
      }).catch(() => {})
    },
    tabTypeChartTable () {
      this.isChart = !this.isChart
      if (this.isChart) {
        this.initTypeChart()
      } else {
        this.initTypeTable()
      }
    },
    tabStatusChartTable () {
      this.isChartStatus = !this.isChartStatus
      if (this.isChartStatus) {
        this.initStatusChart()
      } else {
        this.initStatusTable()
      }
    },
    exportTypeData (command) { // 导出
      this.exportFileName = this.$t('vicenter.ImageLibrary.goodsStatistics.imageTypeStatistics')
      if (command === 'excel') {
        this.handleExportExcel('type')
        // exportExcel({exportArray: this.typeTableData.data, tHeader: this.typeTHeader, filterFields: this.typeFields, fileName: this.exportFileName})
      } else if (command === 'pdfChart') {
        this.getPdf(document.getElementById(`${this.imageTypeData.id}`), this.exportFileName, false)
      } else if (command === 'pdfTable') {
        this.handleExportType()
        // this.getPdf(document.getElementById('typeTable'), this.exportFileName, false)
      } else if (command === 'image') {
        this.getPdf(document.getElementById(`${this.imageTypeData.id}`), this.exportFileName, true)
      }
    },
    exportStatusData (command) { // 导出
      this.exportFileName = this.$t('vicenter.ImageLibrary.goodsStatistics.imageStatusStatistics')
      if (command === 'excel') {
        this.handleExportExcel('status')
        // exportExcel({exportArray: this.statusTableData.data, tHeader: this.statusTHeader, filterFields: this.statusFields, fileName: this.exportFileName})
      } else if (command === 'pdfChart') {
        this.getPdf(document.getElementById(`${this.imageStatusData.id}`), this.exportFileName, false)
      } else if (command === 'pdfTable') {
        this.handleExportStatus()
        // this.getPdf(document.getElementById('statusTable'), this.exportFileName, false)
      } else if (command === 'image') {
        this.getPdf(document.getElementById(`${this.imageStatusData.id}`), this.exportFileName, true)
      }
    },
    handleExportExcel (type) {
      let url = ''
      if (type === 'status') {
        url = '/imagelibrary/statistics/exportExcelForStatus'
      } else {
        url = '/imagelibrary/statistics/exportExcelForType'
      }
      const {lang} = this.$store.state
      let params = {
        lang: lang,
        model: { id: this.HSCodeId },
        sysMenu: '',
        allDataNum: this.statusTableData.data.length,
        url: url
      }
      this.$commonExportExcel(params)
    },
    initTypeChart () {
      if (!document.getElementById(this.imageTypeData.id)) {
        return
      }
      let myChart = this.$echarts.init(document.getElementById(this.imageTypeData.id))
      let myOption = this.option
      myOption.title.text = this.imageTypeData.title.text
      myOption.legend.data = this.imageTypeData.legend.data
      myOption.series.name = this.imageTypeData.title.text
      myOption.series[0].data = this.imageTypeData.series.data
      myOption.series[0].name = this.imageTypeData.title.text
      myChart.setOption(myOption)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initTypeTable () {
      this.typeTHeader = []
      this.typeFields = []
      this.typeTableGroup.forEach((item) => {
        this.typeTHeader.push(item.label)
        this.typeFields.push(item.model)
      })
    },
    initStatusChart () {
      if (!document.getElementById(this.imageStatusData.id)) {
        return
      }
      let myChart = this.$echarts.init(document.getElementById(this.imageStatusData.id))
      let myOption = this.option
      myOption.title.text = this.imageStatusData.title.text
      myOption.legend.data = this.imageStatusData.legend.data
      myOption.series.name = this.imageStatusData.title.text
      myOption.series[0].data = this.imageStatusData.series.data
      myOption.series[0].name = this.imageStatusData.title.text
      myChart.setOption(myOption)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initStatusTable () {
      this.statusTHeader = []
      this.statusFields = []
      this.statusTableGroup.forEach((item) => {
        this.statusTHeader.push(item.label)
        this.statusFields.push(item.model)
      })
    },
    currentClickGoods (data) {
      this.HSCodeId = data.id
      this.getAjaxData()
    },
    initTreeData () {
      let params = {}
      params.hsCode = 0
      comAjax.getNodeAndChildren(params).then(res => {
        if (res.data.flag) {
          // 默认为根节点
          if (res.data.result.length > 0) {
            res.data.result.forEach(e => {
              if (e.pid === '-1' || e.pid === null || e.pid.indexOf('-1') === 0) {
                this.HSCodeId = e.id
              }
            })
          }
          this.getAjaxData()
        }
      }).catch(() => {})
    },
    getSort () {
      console.log('')
    }
  },
  components: { bread, panelTitle, ComTable, GoodsTree }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#goods-statistic-bar {
  @extend .extend-bar;
  #goods-statistic-M {
    padding:$margin;
    @include box-sizing;
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        // overflow: hidden;
        overflow: auto;
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
        .charTable {
          width: $all;
          height: $all/2;
          .chartBox {
            width: $all;
            height: calc(100% - 35px);
            overflow: hidden;
            .innerbox {
              width: $all;
              height: $all;
              .chartHeight {
                position: relative;
                width: $all;
                min-height: 300px;
                height: $all;
                @include box-sizing();
                padding-top: $dis10;
                background: none;
                .chart {
                  width: $all;
                  height: calc(100% - 35px);
                }
                .noData {
                  width: $all;
                  height: $all;
                  @include flex(row, center, center);
                  color: #606266;
                }
              }
              @media screen and (max-width: 1640px) {
                .chartHeight {
                  height: 300px;
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
        .charTable:last-child {
          #panelTitle {
            border-top: 1px solid #ddd;
          }
        }
        .el-table {
          .cell {
            white-space: normal;
          }
        }
      }
    }
  }
}
</style>
