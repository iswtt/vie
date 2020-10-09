/* eslint-disable */
const barMaxWidthCom = 30
const textStyleCom = {
  color: '#333',
  fontWeight: 'bold',
  fontSize: 14,
  lineHeight: 40
}
const componentsConfig = {
	data () {
		return {
			allComponentsInfo: [
				// code {string} 对应组件的componentCode
        // type {string} 图表类型
        // -----数据块 BLOCK
        // -----数据块集 BLOCKSET
        // -----X轴柱状图 X_BAR
        // -----X轴堆叠柱状图 X_STACK_BAR
        // -----Y轴柱状图 Y_BAR
        // -----Y轴堆叠柱状图 Y_STACK_BAR
        // -----环状图 CIRCLE
        // -----半环状图 HARF_CIRCLE
        // -----内饼外环图 PIE_CIRCLE
        // -----玫瑰图 ROSE
        // -----折线图 LINE
        // -----X轴柱状+折线图 X_BAR_LINE
        // -----X轴堆叠柱状+折线图 X_STACK_BAR_LINE
        // loadFunc {function} 加载图表的方法
        // search {array} 查询参数
				// colors {array} 图表颜色列表
				// isLegend {boolean} 图表是否显示图例
        // legendData {array} 图表图例数据
        // isTotal {boolean} 图表是否为累计统计类型
        // totalData {array} 累计统计数据
        // isTitle {boolean} 图表是否包含title
        // titleData {array} 包含title图表的统计数据
				{ // 累计任务总量
					code: 'CN001',
          type: 'BLOCK',
          loadFunc: this.loadCN001,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: false,
					legendData: [],
					isTotal: true,
					totalData: [
						{
              label: this.$t('vicenter.dashboard.chart.totalScanQty'),
              value: '',
              ruleprop: 'scanNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.totalImageCheckQty'),
              value: '',
              ruleprop: 'checkNum'
            }
					]
				},
				{ // 总览任务量
					code: 'CN002',
          type: 'BLOCKSET',
          loadFunc: this.loadCN002,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: false,
					legendData: [],
					isTotal: true,
					totalData: [
						{
              label: this.$t('vicenter.dashboard.chart.scanQty'),
              value: '',
              ruleprop: 'scanNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.imageCheckQty'),
              value: '',
              ruleprop: 'checkNum',
              isSub: true
            },
            {
              label: this.$t('vicenter.dashboard.chart.recheckQty'),
              value: '',
              ruleprop: 'recheckNum',
              isSub: true
            },
            {
              label: this.$t('vicenter.dashboard.chart.manualQty'),
              value: '',
              ruleprop: 'manualNum',
              isSub: true
            },
            {
              label: this.$t('vicenter.dashboard.chart.auditQty'),
              value: '',
              ruleprop: 'auditNum',
              isSub: true
            }
					]
				},
				{ // 查验任务量
					code: 'CN003',
          type: 'BLOCKSET',
          loadFunc: this.loadCN003,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: false,
					legendData: [],
					isTotal: true,
					totalData: [
						{
              label: this.$t('vicenter.dashboard.chart.imageCheckQty'),
              value: '',
              ruleprop: 'checkNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.recheckQty'),
              value: '',
              ruleprop: 'recheckNum',
              isSub: true
            },
            {
              label: this.$t('vicenter.dashboard.chart.manualQty'),
              value: '',
              ruleprop: 'manualNum',
              isSub: true
            }
					]
        },
        { // 审图任务量
					code: 'CN004',
          type: 'Y_STACK_BAR',
          loadFunc: this.loadCN004,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.suspectQty'),
              value: '',
              ruleprop: 'checkSuspectNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectQty'),
              value: '',
              ruleprop: 'checkNoSuspectNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 复审任务量
					code: 'CN005',
          type: 'Y_BAR',
          loadFunc: this.loadCN005,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.suspectQty'),
              value: '',
              ruleprop: 'recheckSuspectNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectQty'),
              value: '',
              ruleprop: 'recheckNoSuspectNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 手检任务量
					code: 'CN006',
          type: 'X_STACK_BAR',
          loadFunc: this.loadCN006,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.seizedQty'),
              value: '',
              ruleprop: 'seizedNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSeizedQty'),
              value: '',
              ruleprop: 'noSeizedNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 稽核任务量
					code: 'CN007',
          type: 'X_BAR',
          loadFunc: this.loadCN007,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.passQty'),
              value: '',
              ruleprop: 'passNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.notPassQty'),
              value: '',
              ruleprop: 'noPassNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 任务比率
					code: 'CN008',
          type: 'HARF_CIRCLE',
          loadFunc: this.loadCN008,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: false,
					legendData: [],
					isTotal: false,
          totalData: [],
          isTitle: true,
          titleData: [
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectRate'),
              value: '',
              ruleprop: 'noSuspectRate'
            },
            {
              label: this.$t('vicenter.dashboard.chart.seizedRate'),
              value: '',
              ruleprop: 'seizedRate'
            },
            {
              label: this.$t('vicenter.dashboard.chart.auditPassRate'),
              value: '',
              ruleprop: 'auditPassRate'
            },
            {
              label: this.$t('vicenter.dashboard.chart.auditRate'),
              value: '',
              ruleprop: 'auditRate'
            }
          ]
        },
        { // 任务占比
					code: 'CN009',
          type: 'ROSE',
          loadFunc: this.loadCN009,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.imageCheckQty'),
              value: '',
              ruleprop: 'checkTotal'
            },
            {
              label: this.$t('vicenter.dashboard.chart.recheckQty'),
              value: '',
              ruleprop: 'recheckTotal'
            },
            {
              label: this.$t('vicenter.dashboard.chart.manualQty'),
              value: '',
              ruleprop: 'manualTotal'
            },
            {
              label: this.$t('vicenter.dashboard.chart.auditQty'),
              value: '',
              ruleprop: 'auditTotal'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 查验结论占比
					code: 'CN010',
          type: 'PIE_CIRCLE',
          loadFunc: this.loadCN010,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.suspectQty'),
              value: '',
              ruleprop: 'recheckSuspectNum',
              pos: 'outer'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectQty'),
              value: '',
              ruleprop: 'recheckNoSuspectNum',
              pos: 'outer'
            },
            {
              label: this.$t('vicenter.dashboard.chart.seizedQty'),
              value: '',
              ruleprop: 'seizedNum',
              pos: 'inner'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSeizedQty'),
              value: '',
              ruleprop: 'noSeizedNum',
              pos: 'inner'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 实时任务量
          code: 'CN011',
          type: 'BLOCK',
          loadFunc: this.loadCN011,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: false,
					legendData: [],
					isTotal: true,
					totalData: [
						{
              label: this.$t('vicenter.dashboard.chart.imageCheckQty'),
              value: '',
              ruleprop: 'checkNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.recheckQty'),
              value: '',
              ruleprop: 'recheckNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.manualQty'),
              value: '',
              ruleprop: 'manualNum'
            }
					]
        },
        // { // 任务状态占比
				// 	code: 'CN011',
        //   type: 'CIRCLE',
        //   loadFunc: this.loadCN011,
        //   search: ['type', 'idStr', 'dateType'],
				// 	colors: [],
				// 	isLegend: true,
				// 	legendData: [
        //     {
        //       label: this.$t('vicenter.dashboard.chart.locked'),
        //       value: '',
        //       ruleprop: 'LockNum'
        //     },
        //     {
        //       label: this.$t('vicenter.dashboard.chart.unlocked'),
        //       value: '',
        //       ruleprop: 'UnlockNum'
        //     }
        //   ],
				// 	isTotal: false,
        //   totalData: [],
        //   isTitle: true,
        //   titleData: [
        //     {
        //       label: this.$t('vicenter.dashboard.chart.imageCheck'),
        //       value: '',
        //       ruleprop: 'check'
        //     },
        //     {
        //       label: this.$t('vicenter.dashboard.chart.recheck'),
        //       value: '',
        //       ruleprop: 'recheck'
        //     },
        //     {
        //       label: this.$t('vicenter.dashboard.chart.manual'),
        //       value: '',
        //       ruleprop: 'manual'
        //     }
        //   ]
        // },
        { // 审图员工作量
					code: 'CN012',
          type: 'Y_BAR',
          loadFunc: this.loadCN012,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.suspectQty'),
              value: '',
              ruleprop: 'checkSuspectNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectQty'),
              value: '',
              ruleprop: 'checkNoSuspectNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 复审员工作量
					code: 'CN013',
          type: 'Y_STACK_BAR',
          loadFunc: this.loadCN013,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.suspectQty'),
              value: '',
              ruleprop: 'recheckSuspectNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectQty'),
              value: '',
              ruleprop: 'recheckNoSuspectNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 手检员工作量
					code: 'CN014',
          type: 'Y_BAR',
          loadFunc: this.loadCN014,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.seizedQty'),
              value: '',
              ruleprop: 'seizedNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSeizedQty'),
              value: '',
              ruleprop: 'noSeizedNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 稽核员工作量
					code: 'CN015',
          type: 'Y_STACK_BAR',
          loadFunc: this.loadCN015,
          search: ['type', 'idStr', 'dateType'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.passQty'),
              value: '',
              ruleprop: 'passNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.notPassQty'),
              value: '',
              ruleprop: 'noPassNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 扫描任务量趋势
					code: 'CN016',
          type: 'LINE',
          loadFunc: this.loadCN016,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.scanQty'),
              value: '',
              ruleprop: 'scanNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 审图任务量趋势
					code: 'CN017',
          type: 'X_BAR_LINE',
          loadFunc: this.loadCN017,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.imageCheckQty'),
              value: '',
              ruleprop: 'total'
            },
            {
              label: this.$t('vicenter.dashboard.chart.suspectQty'),
              value: '',
              ruleprop: 'checkSuspectNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectQty'),
              value: '',
              ruleprop: 'checkNoSuspectNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 复审任务量趋势
					code: 'CN018',
          type: 'X_BAR_LINE',
          loadFunc: this.loadCN018,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.recheckQty'),
              value: '',
              ruleprop: 'total'
            },
            {
              label: this.$t('vicenter.dashboard.chart.suspectQty'),
              value: '',
              ruleprop: 'recheckSuspectNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectQty'),
              value: '',
              ruleprop: 'recheckNoSuspectNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 手检任务量趋势
					code: 'CN019',
          type: 'X_BAR_LINE',
          loadFunc: this.loadCN019,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.manualQty'),
              value: '',
              ruleprop: 'total'
            },
            {
              label: this.$t('vicenter.dashboard.chart.seizedQty'),
              value: '',
              ruleprop: 'seizedNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSeizedQty'),
              value: '',
              ruleprop: 'noSeizedNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 已稽核任务量趋势
					code: 'CN020',
          type: 'X_BAR_LINE',
          loadFunc: this.loadCN020,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.auditedQty'),
              value: '',
              ruleprop: 'total'
            },
            {
              label: this.$t('vicenter.dashboard.chart.passQty'),
              value: '',
              ruleprop: 'passNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.notPassQty'),
              value: '',
              ruleprop: 'noPassNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 查验业务趋势
					code: 'CN021',
          type: 'X_STACK_BAR_LINE',
          loadFunc: this.loadCN021,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.suspectRate'),
              value: '',
              ruleprop: 'rate'
            },
            {
              label: this.$t('vicenter.dashboard.chart.suspectQty'),
              value: '',
              ruleprop: 'recheckSuspectNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.noSuspectQty'),
              value: '',
              ruleprop: 'recheckNoSuspectNum'
            }
          ],
					isTotal: false,
					totalData: []
        },
        { // 稽核业务趋势
					code: 'CN022',
          type: 'X_STACK_BAR_LINE',
          loadFunc: this.loadCN022,
          search: ['type', 'idStr'],
					colors: [],
					isLegend: true,
					legendData: [
            {
              label: this.$t('vicenter.dashboard.chart.auditRate'),
              value: '',
              ruleprop: 'rate'
            },
            {
              label: this.$t('vicenter.dashboard.chart.auditedQty'),
              value: '',
              ruleprop: 'auditedNum'
            },
            {
              label: this.$t('vicenter.dashboard.chart.notAuditedQty'),
              value: '',
              ruleprop: 'notAuditedNum'
            }
          ],
					isTotal: false,
					totalData: []
        }
			]
		}
	},
  methods: {
    // 数据块（BLOCK, BLOCKSET）
    initBlockData (data) {
      console.log(data)
    },
    /**
     * 柱状图（X_BAR、X_STACK_BAR、Y_BAR、Y_STACK_BAR）
     * @param domId {string} 图表id
     * @param legendData {array} 图表图例，来源自componentsConfig
     * @param result {array} ajax数据
     * @param colors {array} 图表颜色列表
     * @param isXAxis {boolean} X轴是否为主轴（类目轴），X轴主轴为true，Y轴主轴为false
     * @param isStack {boolean} 是否堆叠展示
    */
    initBar (domId, legendData, result, colors, isXAxis, isStack) {
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initBar(domId, legendData, result, colors, isXAxis, isStack)
        })
        return
      }
      let myChart = this.$echarts.init(chartDom)
      myChart.clear()
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left',
          position: function (pos, params, dom, rect, size) { // 设置提示框位置
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 30
            return obj
          }
        },
        legend: {
          type: 'scroll',
          bottom: 0,
          left: 'center',
          data: []
        },
        grid: {
          top: '5%',
          bottom: '15%',
          left: '3%',
          right: '3%',
          containLabel: true
        },
        series: []
      }
      // 颜色
      if (colors.length > 0) {
        option.color = colors
      }
      // 主轴数据
      let axisData = result.map(e => e.name)
      if (isXAxis) {
        option.xAxis = [
          {
            type: 'category',
            data: axisData
          }
        ]
        option.yAxis = [
          {
            type: 'value',
            minInterval: 1
          }
        ]
      } else {
        option.xAxis = [
          {
            type: 'value',
            minInterval: 1
          }
        ]
        option.yAxis = [
          {
            type: 'category',
            data: axisData
          }
        ]
      }
      // 图例
      option.legend.data = legendData.map(e => e.label)
      // 系列数据
      option.series = legendData.map(e => {
        return {
          name: e.label,
          type: 'bar',
          barMaxWidth: barMaxWidthCom,
          stack: isStack ? 'total' : '',
          data: result.map(r => r[e.ruleprop] || 0)
        }
      })
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    /**
     * 折线图（LINE）
     * @param domId {string} 图表id
     * @param legendData {array} 图表图例，来源自componentsConfig
     * @param result {array} ajax数据
     * @param colors {array} 图表颜色列表
    */
    initLine (domId, legendData, result, colors) {
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initLine(domId, legendData, result, colors)
        })
        return
      }
      let myChart = this.$echarts.init(chartDom)
      myChart.clear()
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left',
          position: function (pos, params, dom, rect, size) { // 设置提示框位置
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 30
            return obj
          }
        },
        legend: {
          type: 'scroll',
          bottom: 0,
          left: 'center',
          data: []
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true, // 两边留白
            data: [],
            axisLabel: {
              rotate: -30
            },
            minInterval: 1
          }
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1
          }
        ],
        grid: {
          top: '5%',
          bottom: '15%',
          left: '3%',
          right: '3%',
          containLabel: true
        },
        series: []
      }
      // 颜色
      if (colors.length > 0) {
        option.color = colors
      }
      // 主轴数据
      let axisData = result.map(e => {
        let times = e.longTime ? this.$options.filters['formatDate'](e.longTime, this.$t('vicenter.common.dayFormat')) : ''
        return times
      })
      option.xAxis[0].data = axisData
      // 图例
      option.legend.data = legendData.map(e => e.label)
      // 系列数据
      option.series = legendData.map(e => {
        return {
          name: e.label,
          type: 'line',
          data: result.map(r => r[e.ruleprop] || 0)
        }
      })
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    /**
     * 折线+柱状图（X_BAR_LINE、X_STACK_BAR_LINE）
     * @param domId {string} 图表id
     * @param legendData {array} 图表图例，来源自componentsConfig
     * @param result {array} ajax数据
     * @param colors {array} 图表颜色列表
     * @param isStack {boolean} 是否堆叠展示
     * @param isRate {boolean} 折线是否表示比率，折线比率为true，折线数值为false
    */
    initLineAndBar (domId, legendData, result, colors, isStack, isRate) {
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initLineAndBar(domId, legendData, result, colors, isStack, isRate)
        })
        return
      }
      let myChart = this.$echarts.init(chartDom)
      myChart.clear()
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left',
          position: function (pos, params, dom, rect, size) { // 设置提示框位置
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 30
            return obj
          },
          formatter: function (item) {
            // 格式化tooltip提示框内容
            let tipStr = `${item[0].axisValueLabel}`
            item.forEach(i => {
              if (i.seriesType === 'line' && isRate) {
                tipStr += `<br/>${i.marker}${i.seriesName}: ${i.value}%`
              } else {
                tipStr += `<br/>${i.marker}${i.seriesName}: ${i.value}`
              }
            })
            return tipStr
          }
        },
        legend: {
          type: 'scroll',
          bottom: 0,
          left: 'center',
          data: []
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true, // 两边留白
            data: [],
            axisLabel: {
              rotate: -30
            },
            minInterval: 1
          }
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1
          },
          {
            type: 'value'
          }
        ],
        grid: {
          top: '5%',
          bottom: '15%',
          left: '3%',
          right: '3%',
          containLabel: true
        },
        series: []
      }
      // 颜色
      if (colors.length > 0) {
        option.color = colors
      }
      // 主轴数据
      let axisData = result.map(e => {
        let times = e.longTime ? this.$options.filters['formatDate'](e.longTime, this.$t('vicenter.common.dayFormat')) : ''
        return times
      })
      option.xAxis[0].data = axisData
      // 图例
      option.legend.data = legendData.map(e => e.label)
      // 系列数据
      option.series = []
      legendData.forEach((e, index) => {
        if ((e.ruleprop === 'total') || (e.ruleprop === 'rate')) {
          option.series.push({
            name: e.label,
            type: 'line',
            yAxisIndex: 1,
            data: []
          })
        } else {
          option.series.push({
            name: e.label,
            type: 'bar',
            data: result.map(r => r[e.ruleprop] || 0),
            stack: isStack ? 'total' : '',
            barMaxWidth: barMaxWidthCom
          })
        }
      })
      if (isRate) {
        // 折线表示比率
        option.series[0].data = result.map(r => {
          let total = 0
          let num = 0
          legendData.forEach((e, index) => {
            if ((e.ruleprop !== 'total') && (e.ruleprop !== 'rate')) {
              total += r[e.ruleprop] || 0
            }
            if (index === 1) {
              num = r[e.ruleprop] || 0
            }
          })
          return total ? (num / total).toFixed(4) * 100 : 0
        })
        // 右侧Y轴显示百分比
        option.yAxis[1] = {
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}%'
          }
        }
      } else {
        // 折线表示总量
        option.series[0].data = result.map(r => {
          let total = 0
          legendData.forEach((e, index) => {
            if ((e.ruleprop !== 'total') && (e.ruleprop !== 'rate')) {
              total += (r[e.ruleprop] || 0)
            }
          })
          return total
        })
        // 右侧Y轴显示数值
        option.yAxis[1] = {
          type: 'value',
          minInterval: 1
        }
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    /**
     * 环状图、玫瑰图（CIRCLE、ROSE）
     * @param domId {string} 图表id
     * @param legendData {array} 图表图例，来源自componentsConfig
     * @param titleText {string} 图表标题
     * @param colors {array} 图表颜色列表
     * @param isRose {boolean} 是否玫瑰图
    */
    initCircle (domId, legendData, titleText, colors, isRose) {
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initCircle(domId, legendData, titleText, colors, isRose)
        })
        return
      }
      let myChart = this.$echarts.init(chartDom)
      myChart.clear()
      let option = {
        title: {
          text: '',
          left: 'center',
          textStyle: textStyleCom
        },
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
          type: 'scroll',
          bottom: 0,
          left: 'center',
          data: []
        },
        series: [
          {
            name: '',
            type: 'pie',
            roseType: false,
            radius: ['40%', '55%'],
            label: {
              show: true
            },
            labelLine: {
              length: 5,
              length2: 5,
              smooth: true
            },
            data: []
          }
        ]
      }
      // 标题
      if (titleText) {
        option.title.text = titleText
      }
      // 颜色
      if (colors.length > 0) {
        option.color = colors
      }
      // 是否玫瑰图
      if (isRose) {
        option.series[0].roseType = true
      }
      // 图例
      option.legend.data = legendData.map(e => e.label)
      // 系列数据
      legendData.forEach(e => {
        option.series[0].data.push({
          name: e.label,
          value: e.value
        })
      })
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    /**
     * 半环状图（HARF_CIRCLE）
     * @param domId {string} 图表id
     * @param datas {array} 图表数据
     * @param titleText {string} 图表标题
     * @param color {string} 图表颜色
    */
    initHalfCircle (domId, datas, titleText, color) {
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initHalfCircle(domId, datas, titleText, color)
        })
        return
      }
      let myChart = this.$echarts.init(chartDom)
      myChart.clear()
      let option = {
        title: {
          text: '',
          left: 'center',
          textStyle: textStyleCom
        },
        color: ['#cccccc', 'transparent'],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: '57%',
            style: {
              text: '0.00%',
              textAlign: 'center',
              fill: '#333',
              fontSize: 14
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'pie',
            silent: true, // 不响应和触发鼠标事件
            center: ['50%', '60%'],
            radius: ['65%', '90%'],
            hoverAnimation: false,
            label: {
              show: false
            },
            data: []
          }
        ]
      }
      // 标题
      if (titleText) {
        option.title.text = titleText
      }
      // 颜色
      if (color) {
        option.color[0] = color
      }
      // 图表中心数值
      if (datas[0] + datas[1]) {
        option.graphic[0].style.text = `${((datas[0] / (datas[0] + datas[1])).toFixed(4) * 100).toFixed(2)}%`
      } else {
        // datas[0] + datas[1] = 0 的情况
        option.color[1] = option.color[0]
      }
      // 系列数据
      option.series[0].data = datas.map(e => {
        return {
          value: e
        }
      })
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    /**
     * 内饼外环图（PIE_CIRCLE）
     * @param domId {string} 图表id
     * @param legendData {array} 图表图例，来源自componentsConfig
     * @param colors {array} 图表颜色列表
    */
    initPieAndCircle (domId, legendData, colors) {
      let chartDom = document.getElementById(domId)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initPieAndCircle(domId, legendData, colors)
        })
        return
      }
      let myChart = this.$echarts.init(chartDom)
      myChart.clear()
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
          type: 'scroll',
          orient: 'vertical',
          right: 'right',
          top: 'center',
          data: []
        },
        series: [
          {
            name: '',
            pos: 'inner', // 内层
            type: 'pie',
            selectedMode: 'single',
            center: ['40%', '50%'],
            radius: [0, '50%'],
            label: {
              show: false
            },
            data: []
          },
          {
            name: '',
            pos: 'outer', // 外层
            type: 'pie',
            center: ['40%', '50%'],
            radius: ['60%', '80%'],
            label: {
              show: false
            },
            data: []
          }
        ]
      }
      // 颜色
      if (colors.length > 0) {
        option.color = colors
      }
      // 图例
      option.legend.data = legendData.map(e => e.label)
      // 系列数据
      legendData.forEach(e => {
        option.series.forEach(s => {
          if (e.pos === s.pos) {
            s.data.push({
              name: e.label,
              value: e.value
            })
          }
        })
      })
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
export default componentsConfig
