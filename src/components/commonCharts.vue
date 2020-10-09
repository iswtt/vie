<template>
<div class="charts-statistic">
  <div v-if="componentInfo.type === 'BLOCK'" class="data-block">
    <ul>
      <li v-for="(item, index) in componentInfo.totalData" :key="index">
        <span class="item-label">{{item.label}}</span>
        <span class="item-value">{{item.value}}</span>
      </li>
    </ul>
  </div>
  <div v-if="componentInfo.type === 'BLOCKSET'" class="data-block-set">
    <ul>
      <li v-for="(item, index) in componentInfo.totalData" :key="index" :class="{notSubLi: !item.isSub, subLi: item.isSub}">
        <div class="item-container">
          <span class="item-label">{{item.label}}</span>
          <span class="item-value">{{item.value}}</span>
        </div>
      </li>
    </ul>
  </div>
  <div v-else-if="componentInfo.type === 'CIRCLE' || componentInfo.type === 'HARF_CIRCLE'" class="charts">
    <div v-for="(item, index) in componentInfo.titleData" :id="item.ruleprop" :key="index" class="chart-item"></div>
  </div>
  <div v-else :id="chartInfo.chartId" class="chart"></div>
</div>
</template>
<script>
import ajax from '@/api/supervise/templateMgmt'
import componentsConfig from '@/components/mixins/componentsConfig'
export default {
  data () {
    return {
      chartInfo: {},
      componentInfo: {}
    }
  },
  created () {
    this.chartInfo = this.$props.chartData
    this.componentInfo = this.allComponentsInfo.find(e => e.code === this.chartInfo.componentCode)
    if (this.chartInfo.idStr) {
      this.componentInfo.loadFunc()
    }
  },
  mounted () {},
  methods: {
    // 获取请求参数
    getParams () {
      let obj = {
        param: {},
        url: '',
        id: '',
        legendData: [],
        titleData: [],
        totalData: [],
        colors: []
      }
      this.componentInfo.search.forEach(e => {
        obj.param[e] = this.chartInfo[e]
      })
      obj.url = this.chartInfo.url || ''
      obj.id = this.chartInfo.chartId
      obj.legendData = this.componentInfo.legendData
      obj.titleData = this.componentInfo.titleData
      obj.totalData = this.componentInfo.totalData
      obj.colors = this.componentInfo.colors
      return obj
    },
    loadCN001 () {
      let { param, url, totalData } = this.getParams()
      ajax.getComponentStatistic(param, url).then((res) => {
        totalData.forEach(e => {
          e.value = 0
        })
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            let result = res.data.result.items
            totalData.forEach(e => {
              e.value = result.reduce((total, item) => total + (item[e.ruleprop] || 0), 0)
            })
          }
        }
        this.initBlockData(totalData)
      }).catch(() => {})
    },
    loadCN002 () {
      this.loadCN001()
    },
    loadCN003 () {
      this.loadCN001()
    },
    loadCN004 (isXAxisFlag = false, isStackFlag = true) {
      let { param, url, id, legendData, colors } = this.getParams()
      ajax.getComponentStatistic(param, url).then((res) => {
        let result = []
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            result = res.data.result.items
          }
        }
        this.initBar(id, legendData, result, colors, isXAxisFlag, isStackFlag)
      }).catch(() => {})
    },
    loadCN005 () {
      this.loadCN004(false, false)
    },
    loadCN006 () {
      this.loadCN004(true, true)
    },
    loadCN007 () {
      this.loadCN004(true, false)
    },
    loadCN008 () {
      let { param, url, id, titleData, colors } = this.getParams()
      titleData.forEach(e => {
        e.value = [0, 0]
      })
      ajax.getComponentStatistic(param, url).then((res) => {
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            let result = res.data.result.items
            titleData.forEach((e, index) => {
              if (e.ruleprop === 'noSuspectRate') {
                let suspectNum = result.reduce((total, item) => total + (item.recheckSuspectNum || 0), 0)
                let noSuspectNum = result.reduce((total, item) => total + (item.recheckNoSuspectNum || 0), 0)
                e.value = [noSuspectNum, suspectNum]
              }
              if (e.ruleprop === 'seizedRate') {
                let seizedNum = result.reduce((total, item) => total + (item.seizedNum || 0), 0)
                let noSeizedNum = result.reduce((total, item) => total + (item.noSeizedNum || 0), 0)
                e.value = [seizedNum, noSeizedNum]
              }
              if (e.ruleprop === 'auditPassRate') {
                let passNum = result.reduce((total, item) => total + (item.passNum || 0), 0)
                let noPassNum = result.reduce((total, item) => total + (item.noPassNum || 0), 0)
                e.value = [passNum, noPassNum]
              }
              if (e.ruleprop === 'auditRate') {
                // 未稽核量=复审量-已稽核量
                // let totalNum = result.reduce((total, item) => total + (item.scanNum || 0), 0)
                let totalNum = result.reduce((total, item) => total + (item.recheckSuspectNum || 0) + (item.recheckNoSuspectNum || 0), 0)
                let auditedNum = result.reduce((total, item) => total + (item.passNum || 0) + (item.noPassNum || 0), 0)
                // let notAuditedNum = totalNum - auditedNum
                let notAuditedNum = totalNum - auditedNum
                e.value = [auditedNum, notAuditedNum]
              }
            })
          }
        }
        titleData.forEach((e, index) => {
          this.initHalfCircle(e.ruleprop, e.value, e.label, colors[index])
        })
      }).catch(() => {})
    },
    loadCN009 () {
      let { param, url, id, legendData, colors } = this.getParams()
      legendData.forEach(e => {
        e.value = 0
      })
      ajax.getComponentStatistic(param, url).then((res) => {
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            let result = res.data.result.items
            legendData.forEach((e, index) => {
              if (e.ruleprop === 'checkTotal') {
                e.value = result.reduce((total, item) => total + (item.checkSuspectNum || 0) + (item.checkNoSuspectNum || 0), 0)
              }
              if (e.ruleprop === 'recheckTotal') {
                e.value = result.reduce((total, item) => total + (item.recheckSuspectNum || 0) + (item.recheckNoSuspectNum || 0), 0)
              }
              if (e.ruleprop === 'manualTotal') {
                e.value = result.reduce((total, item) => total + (item.seizedNum || 0) + (item.noSeizedNum || 0), 0)
              }
              if (e.ruleprop === 'auditTotal') {
                e.value = result.reduce((total, item) => total + (item.passNum || 0) + (item.noPassNum || 0), 0)
              }
            })
          }
        }
        this.initCircle(id, legendData, '', colors, true)
      }).catch(() => {})
    },
    loadCN010 () {
      let { param, url, id, legendData, colors } = this.getParams()
      legendData.forEach(e => {
        e.value = 0
      })
      ajax.getComponentStatistic(param, url).then((res) => {
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            let result = res.data.result.items
            legendData.forEach(e => {
              e.value = result.reduce((total, item) => total + (item[e.ruleprop] || 0), 0)
            })
          }
        }
        this.initPieAndCircle(id, legendData, colors)
      }).catch(() => {})
    },
    loadCN011 () {
      let { param, url, totalData } = this.getParams()
      ajax.getComponentStatistic(param, url).then((res) => {
        totalData.forEach(e => {
          e.value = 0
        })
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            let result = res.data.result.items
            totalData.forEach(e => {
              e.value = result.reduce((total, item) => total + (item[e.ruleprop] || 0), 0)
            })
          }
        }
        this.initBlockData(totalData)
      }).catch(() => {})
    },
    // loadCN011 () {
    //   let { param, url, id, legendData, titleData, colors } = this.getParams()
    //   titleData.forEach(e => {
    //     e.value = []
    //   })
    //   legendData.forEach(l => {
    //     l.value = 0
    //     titleData.forEach(e => {
    //       e.value.push({
    //         label: l.label,
    //         value: 0
    //       })
    //     })
    //   })
    //   ajax.getComponentStatistic(param, url).then((res) => {
    //     if (res.data.flag && res.data.result) {
    //       if (res.data.result.items && res.data.result.items.length > 0) {
    //         let result = res.data.result.items
    //         legendData.forEach((l, index) => {
    //           titleData.forEach(e => {
    //             e.value[index].value = result.reduce((total, item) => total + (item[`${e.ruleprop}${l.ruleprop}`] || 0), 0)
    //           })
    //         })
    //       }
    //     }
    //     titleData.forEach((e, index) => {
    //       this.initCircle(e.ruleprop, e.value, e.label, colors)
    //     })
    //   }).catch(() => {})
    // },
    loadCN012 (isXAxisFlag = false, isStackFlag = false) {
      let { param, url, id, legendData, colors } = this.getParams()
      ajax.getComponentStatistic(param, url).then((res) => {
        let result = []
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            result = res.data.result.items
            result.forEach(e => {
              e.name = e.account
            })
          }
        }
        this.initBar(id, legendData, result, colors, isXAxisFlag, isStackFlag)
      }).catch(() => {})
    },
    loadCN013 () {
      this.loadCN012(false, true)
    },
    loadCN014 () {
      this.loadCN012(false, false)
    },
    loadCN015 () {
      this.loadCN012(false, true)
    },
    loadCN016 () {
      let { param, url, id, legendData, colors } = this.getParams()
      ajax.getComponentStatistic(param, url).then((res) => {
        let result = []
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            result = res.data.result.items
          }
        }
        this.initLine(id, legendData, result, colors)
      }).catch(() => {})
    },
    loadCN017 (isStackFlag = false, isRateFlag = false) {
      let { param, url, id, legendData, colors } = this.getParams()
      ajax.getComponentStatistic(param, url).then((res) => {
        let result = []
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            result = res.data.result.items
          }
        }
        this.initLineAndBar(id, legendData, result, colors, isStackFlag, isRateFlag)
      }).catch(() => {})
    },
    loadCN018 () {
      this.loadCN017()
    },
    loadCN019 () {
      this.loadCN017()
    },
    loadCN020 () {
      this.loadCN017()
    },
    loadCN021 () {
      this.loadCN017(true, true)
    },
    loadCN022 () {
      let { param, url, id, legendData, colors } = this.getParams()
      ajax.getComponentStatistic(param, url).then((res) => {
        let result = []
        if (res.data.flag && res.data.result) {
          if (res.data.result.items && res.data.result.items.length > 0) {
            result = res.data.result.items
            result.forEach(e => {
              e.auditedNum = (e.passNum || 0) + (e.noPassNum || 0)
              // e.notAuditedNum = (e.scanNum || 0) - e.auditedNum
              // 未稽核量=复审量-已稽核量
              e.notAuditedNum = (e.recheckNum || 0) - e.auditedNum
            })
          }
        }
        this.initLineAndBar(id, legendData, result, colors, true, true)
      }).catch(() => {})
    }
  },
  mixins: [ componentsConfig ],
  props: {
    'chartData': {
      type: Object,
      required: true
    },
    'mapData': {
      type: Object,
      required: true
    },
    'dateType': {
      type: String,
      required: true
    }
  },
  watch: {
    'mapData': {
      handler (newVal, oldVal) {
        if (newVal.type && newVal.idStr) {
          // 根据地图级别展示图表数据
          this.chartInfo.type = newVal.type
          this.chartInfo.idStr = newVal.idStr
          this.componentInfo.loadFunc()
        }
      },
      deep: true
    },
    'dateType': {
      handler (newVal, oldVal) {
        // 根据日期类型展示图表数据
        this.chartInfo.dateType = newVal
        this.componentInfo.loadFunc()
      }
    },
    'chartData': {
      handler (newVal, oldVal) {
        this.chartInfo = newVal
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss">
@import'@/styles/index.scss';
.charts-statistic {
  width: $all;
  height: $all;
  .data-block,.charts,.chart {
    width: $all;
    height: $all;
  }
  .data-block {
    @include flex(row, center, center);
    ul {
      li {
        @include flex(row, flex-start, center);
        margin: 15px 0;
        font-size: 16px;
        .item-label {
          padding: 10px 50px;
          border-radius: 30px;
          background: #2D7DD2;
          font-weight: bold;
          color: #fff;
          margin-right: 15px;
        }
        .item-value {
          color: #333;
        }
      }
    }
  }
  .data-block-set {
    ul {
      width: $all;
      position: relative;
      @include flex(row, flex-start, center);
      flex-wrap: wrap;
      li {
        .item-label {
          padding: 10px 50px;
          border-radius: 30px;
          background: #2D7DD2;
          font-weight: bold;
          color: #fff;
        }
        .item-value {
          color: #333;
        }
      }
      .notSubLi {
        position: absolute;
        top: 30px;
        left: 30px;
        font-size: 16px;
      }
      .subLi {
        width: 50%;
        font-size: 14px;
        margin: 10px 0;
        transform: translateY(70px);
        .item-container {
          @include flex(column, center, center);
          .item-label {
            padding: 5px 30px;
          }
        }
      }
    }
  }
  .charts {
    @include flex(row, space-around, center);
    .chart-item {
      width: $all;
      height: $all;
    }
  }
}
</style>
