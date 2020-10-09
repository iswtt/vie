<template>
  <div class='Image-statistics-bar' v-bar>
    <div class="Image-statistics-M">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread"/>
      </div>
      <div class="infolist">
        <div class='panel right'>
          <panelTitle :panelTitleInit="panelTitle.statusTitle"></panelTitle>
          <div class="pie">
            <div class="pieTitle">{{panelTitle.statusTitle.title}}</div>
            <ve-pie :data="statusChart.data" height='350px' :grid='statusChart.grid' :colors='statusChart.colors' :extend='statusChart.extend'></ve-pie>
          </div>
        </div>
        <div class='panel'>
          <panelTitle :panelTitleInit="panelTitle.typeTitle"></panelTitle>
          <div class="pie">
            <div class="pieTitle">{{panelTitle.typeTitle.title}}</div>
            <ve-pie :data="typeChart.data" height='350px' :colors='typeChart.colors' :extend='typeChart.extend'></ve-pie>
          </div>
        </div>
        <div class='panel all'>
          <panelTitle :panelTitleInit="panelTitle.topTitle"></panelTitle>
          <div class="pie">
            <div class="pieTitle">{{panelTitle.topTitle.title}}</div>
            <ve-histogram :legend-visible="false" :data="topChart.data" height='350px' :colors='topChart.colors' :extend='topChart.extend' :settings="topChart.chartSettings"></ve-histogram>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import breadCrumb from '../../components/breadCrumb'
import panelTitle from '../../components/title'
import ajax from '../../api/tip/Statistics.js'
export default {
  data () {
    return {
      titleBread: {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Tip/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: { // title组件数据
        statusTitle: {
          title: this.$t('vicenter.tip.imageStatistics.imageStateDistributionMap')
        },
        typeTitle: {
          title: this.$t('vicenter.tip.imageStatistics.imageTypeDistributionMap')
        },
        topTitle: {
          title: this.$t('vicenter.tip.imageStatistics.imageClassificationTop')
        }
      },
      statusChart: {
        data: {
          columns: [],
          rows: []
        },
        grid: {
          bottom: 'bottom'
        },
        colors: ['#c33430', '#2e4454'],
        extend: {
          series (v) {
            if (v) {
              v.forEach(i => {
                i.label = {
                  normal: {
                    formatter: '{b}: {c} ({d}%)'
                  }
                }
              })
            }
            return v
          }
        }
      },
      typeChart: {
        data: {
          columns: [],
          rows: []
        },
        colors: ['#60a1a9', '#d58364'],
        extend: {
          series (v) {
            if (v) {
              v.forEach(i => {
                i.label = {
                  normal: {
                    formatter: '{b}: {c} ({d}%)'
                  }
                }
              })
            }
            return v
          }
        }
      },
      topChart: {
        chartSettings: {
          labelMap: {
            'data': this.$t('vicenter.tip.imageStatistics.amount')
          }
        },
        data: {
          columns: [],
          rows: []
        },
        colors: ['#c33430', '#2e4454', '#60a1a9', '#d58364'],
        extend: {
          yAxis: {
            minInterval: 1 // Y轴最小刻度1
          },
          series: {
            type: 'bar',
            label: { show: true, position: 'top' },
            barMaxWidth: 40
          },
          tooltip: {
            textStyle: {
              align: 'left'
            }
          },
          'xAxis.0.axisLabel.rotate': 0,
          'xAxis.0.axisLabel.interval': 0,
          'xAxis.0.axisLabel.formatter': function (value) {
            var newParamsName = ''
            var paramsNameNumber = value.length
            var provideNumber = 15
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
            if (newParamsName.length > 3 * provideNumber) {
              return newParamsName.substring(0, 3 * provideNumber) + '...'
            } else {
              return newParamsName
            }
          }
        }
      }
    }
  },
  created () {
    this.statisticsStatus()
    this.statisticsType()
    this.statisticsCategory()
  },
  methods: {
    statisticsStatus () { // 获取图像状态分布
      ajax.statisticsStatus().then((res) => {
        this.$StatisticsResult(this.statusChart, res, 'status', [this.$t('vicenter.tip.imageStatistics.notRelease'), this.$t('vicenter.tip.imageStatistics.release')])
      }).catch(() => {})
    },
    statisticsType () { // 已发布图像类型分布
      ajax.statisticsType().then((res) => {
        this.$StatisticsResult(this.typeChart, res, 'type', [this.$t('vicenter.tip.imageStatistics.singleEnergy'), this.$t('vicenter.tip.imageStatistics.doubleEnergy')])
      }).catch(() => {})
    },
    statisticsCategory () { // 图像分类top10
      ajax.statisticsCategory().then((res) => {
        res.data.result.category.forEach((e, index) => {
          res.data.result.category[index] = this.$t('vicenter.DIC.T_TIP_IMAGE_CATEGORY.C_' + e)
        })
        console.log(res)
        this.$StatisticsResult(this.topChart, res, 'top10', [])
      }).catch(() => {})
    }
  },
  components: { breadCrumb, panelTitle }
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.Image-statistics-bar {
  @extend .extend-bar;
  .Image-statistics-M {
    padding:$margin;
    @include box-sizing;
    .infolist {
      @media screen and (max-width: 1640px) {
          @include flex(row, flex-start, flex-start);
      }
      flex-wrap: wrap;
      .panel {
        border: #dddddd solid 1px;
        overflow: hidden;
        margin-bottom: $dis10;
        border-radius: 4px;
        @include flex(column, flex-start, flex-start);
        width: $all* .49;
        @media screen and (max-width: 1320px) {
            width: $all* .48;
        }
        @media screen and (max-width: 740px) {
            width: $all* .47;
        }
        height: $all*.55;
        min-height: 420px;
      }
      .all {
        width: calc(100% - 15px);
      }
      .right {
        margin-right: $margin;
      }
      .pie {
        width: $all;
        .pieTitle {
          margin: $margin 0 10px;
          font-size: $headerRight;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
