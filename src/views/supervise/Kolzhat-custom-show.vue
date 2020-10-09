<template>
<div class="custom-bar" v-bar>
  <div class="custom-M">
    <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread"/>
    </div>
    <div class="custom">
      <div class="custom-Main">
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
          <div class="headTitle">{{$t('vicenter.supervise.kolzhatCustomShow.title')}}</div>
          <div class="box1">
            <div v-for='(item, index, key) in staticList' :key="key" class="row-list">
              <div class="iconLeft">
                <img :src='item.img'/>
              </div>
              <div class="list">
                <div class="box1-title">{{item.label}}：</div>
                <div class="box1-info">{{item.value}}{{$t('vicenter.supervise.kolzhatCustomShow.tiems')}}</div>
              </div>
            </div>
          </div>
          <div class="box2">
            <div class="box2-title">
              {{passTotal.label}}
            </div>
            <div class="box2-info">
              <span class="big-font">{{passTotal.value}}</span>
              <span class="small-font">{{$t('vicenter.supervise.kolzhatCustomShow.tiems')}}</span>
            </div>
          </div>
          <div class="portPosition" @click="showPort" :title="$t('vicenter.supervise.kolzhatCustomShow.coreyJet')"></div>
        </div>
        <div class="right">
          <div class="dayTask solidHeight">
            <superviseChart :data="dayTask"></superviseChart>
          </div>
          <div class="dayVitrickNum solidHeight">
            <superviseChart :data="dayVitrickNum"></superviseChart>
          </div>
          <div class="dayCheckRate solidHeight">
            <superviseChart :data="dayCheckRate"></superviseChart>
          </div>
          <div class="dayTaskStyle solidHeight">
            <superviseChart :data="dayTaskStyle"></superviseChart>
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
export default {
  data () {
    return {
      type: [this.$t('vicenter.supervise.kolzhatCustomShow.imported'), this.$t('vicenter.supervise.kolzhatCustomShow.exit'), this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITDOMESTIC'), this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITTARIFFUNION'), this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITNONTARIFFUNION'), this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TOLOGISTICSCENTER')],
      // type: [this.$t('vicenter.supervise.kolzhatCustomShow.imported'), this.$t('vicenter.supervise.kolzhatCustomShow.exit'), this.$t('vicenter.supervise.kolzhatCustomShow.transferTodomestic'), this.$t('vicenter.supervise.kolzhatCustomShow.transferToallies'), this.$t('vicenter.supervise.kolzhatCustomShow.transferTononalliedcountries'), this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TOLOGISTICSCENTER')],
      // this.$t('vicenter.supervise.kolzhatCustomShow.transferTologisticscountry')],
      area: [this.$t('vicenter.supervise.kolzhatCustomShow.ahTameken'), this.$t('vicenter.supervise.kolzhatCustomShow.buick'), this.$t('vicenter.supervise.kolzhatCustomShow.mHabutge'), this.$t('vicenter.supervise.kolzhatCustomShow.kerrJet'), this.$t('vicenter.supervise.kolzhatCustomShow.bakhty'), this.$t('vicenter.supervise.kolzhatCustomShow.ahFruit'), this.$t('vicenter.supervise.kolzhatCustomShow.huoerguosi')],
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
        label: this.$t('vicenter.supervise.kolzhatCustomShow.totalClearance'),
        value: 89410
      },
      staticList: [
        {
          label: this.$t('vicenter.supervise.kolzhatCustomShow.totalEntry'),
          value: 79240,
          img: require('@/assets/img/blue/supervise/one.png')
        },
        {
          label: this.$t('vicenter.supervise.kolzhatCustomShow.captureTotalamount'),
          value: 1370,
          img: require('@/assets/img/blue/supervise/two.png')
        },
        {
          label: this.$t('vicenter.supervise.kolzhatCustomShow.totalOutbound'),
          value: 10170,
          img: require('@/assets/img/blue/supervise/three.png')
        },
        {
          label: this.$t('vicenter.supervise.kolzhatCustomShow.totalLogisticssupervision'),
          value: 18900,
          img: require('@/assets/img/blue/supervise/four.png')
        }
      ],
      yearTask: {
        title: this.$t('vicenter.supervise.kolzhatCustomShow.customsClearancevolumeyear'),
        id: 'yearTaskChart',
        unit: this.$t('vicenter.supervise.port.unit1')
      },
      yearCheck: {
        title: this.$t('vicenter.supervise.kolzhatCustomShow.annualLogisticssupervisionvolume'),
        id: 'yearCheckChart',
        unit: this.$t('vicenter.supervise.port.unit1')
      },
      yearCheckRate: {
        title: this.$t('vicenter.supervise.kolzhatCustomShow.annualSeizurestatistics'),
        id: 'yearCheckRate',
        unit: this.$t('vicenter.supervise.port.unit1')
      },
      yearAveTime: {
        title: this.$t('vicenter.supervise.kolzhatCustomShow.annualBusinesstypestatistics'),
        id: 'yearAveTime',
        unit: this.$t('vicenter.supervise.port.unit1')
      },
      dayTask: {
        title: this.$t('vicenter.supervise.kolzhatCustomShow.dailyBusinessvolumeatport'),
        id: 'dayTask',
        unit: this.$t('vicenter.supervise.port.unit1')
      },
      dayVitrickNum: {
        title: this.$t('vicenter.supervise.kolzhatCustomShow.dailyLogisticssupervisionvolumeeachport'),
        id: 'dayVitrickNum',
        unit: this.$t('vicenter.supervise.port.unit1')
      },
      dayCheckRate: {
        title: this.$t('vicenter.supervise.kolzhatCustomShow.statisticsWereobtainedeachport'),
        id: 'dayCheckRate',
        unit: this.$t('vicenter.supervise.port.unit1')
      },
      dayTaskStyle: {
        title: this.$t('vicenter.supervise.kolzhatCustomShow.businessTypestatistics'),
        id: 'dayTaskStyle',
        unit: this.$t('vicenter.supervise.port.unit1')
      },
      grid: {
        top: '5%',
        bottom: '7%',
        left: '5%',
        right: '7%',
        containLabel: true
      }
    }
  },
  mounted () {
    this.drawCharts()
  },
  methods: {
    showPort () {
      this.$router.push({
        path: '/Supervise/Kolzhat-port-show'
      })
    },
    drawCharts () {
      this.drawYearTask()
      this.drawyearCheck()
      this.drawyearCheckRate()
      this.drawYearAveTime()
      this.drawdayTask()
      this.drawdayVitrick()
      this.drawdayCheckRate()
      this.drawdayTaskStyle()
    },
    drawYearTask () {
      let myChart = this.$echarts.init(document.getElementById('yearTaskChart'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          position: ['60%', '10%']
        },
        legend: {
          show: false,
          orient: 'vertical',
          right: 0,
          top: 0,
          type: 'scroll',
          data: this.type,
          textStyle: {
            color: '#e7e7e9'
          }
        },
        grid: {
          top: '2%',
          bottom: '10%',
          left: '3%',
          right: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
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
          data: this.area,
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
        // ['进口', '出口', '转关至国内', '转关至同盟国', '转关至非同盟国', '转关至物流国'],
        series: [
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_IMPORT'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [3200, 3020, 3010, 3340, 3900, 3300, 3200],
            itemStyle: {
              color: '#5da1ce'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_EXPORT'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [1200, 1320, 1010, 1340, 900, 2300, 2100],
            itemStyle: {
              color: '#3682cd'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITDOMESTIC'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [2200, 1820, 1910, 2340, 2900, 3300, 3100],
            itemStyle: {
              color: '#3440a4'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITTARIFFUNION'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [1500, 2120, 2010, 1540, 1900, 2300, 2100],
            itemStyle: {
              color: '#0b85d5'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITNONTARIFFUNION'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [1200, 1500, 2120, 2010, 3300, 3100, 2100],
            itemStyle: {
              color: '#555ac0'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TOLOGISTICSCENTER'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [2200, 1320, 1010, 1340, 1290, 1330, 1320],
            itemStyle: {
              color: '#ca4890'
            }
          }
        ]
      }
      if (window.innerWidth < 1750) {
        delete option.legend
        option.grid = {
          top: '5%',
          bottom: '12%',
          left: '3%',
          right: '5%',
          containLabel: true
        }
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        if (window.innerWidth < 1750) {
          delete option.legend
          option.grid = {
            top: '5%',
            bottom: '2%',
            left: '3%',
            right: '5%',
            containLabel: true
          }
          myChart.clear()
          myChart.setOption(option)
        } else {
        // option.legend = {
        // orient: 'vertical',
          // right: 0,
          // top: 0,
          // type: 'scroll',
          // data: this.type,
          // textStyle: {
          // color: '#e7e7e9'
          // }
        // }
          option.grid = {
            top: '5%',
            bottom: '2%',
            left: '3%',
            right: '30%',
            containLabel: true
          }
          myChart.clear()
          myChart.setOption(option)
        }
        myChart.resize()
      })
    },
    drawyearCheck () {
      let myChart = this.$echarts.init(document.getElementById('yearCheckChart'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.area,
          axisTick: {
            show: false
          },
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
          },
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        grid: this.grid,
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#e7e7e9',
              width: 1
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#151f22'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [{
          data: [2200, 3500, 3100, 1800, 2800, 2500, 3000],
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: '#00b4ff'
            }
          }
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    drawyearCheckRate () {
      let myChart = this.$echarts.init(document.getElementById('yearCheckRate'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.area,
          axisTick: {
            show: false
          },
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
          },
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        grid: this.grid,
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#e7e7e9',
              width: 1
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#151f22'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [{
          data: [320, 180, 200, 250, 230, 100, 90],
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: '#00f9f5'
            }
          },
          markPoint: {
            data: [{type: 'max'}],
            symbolSize: [20, 20],
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            }
          },
          markLine: {
            lineStyle: {
              type: 'solid',
              color: 'red'
            },
            data: [{
              yAxis: 300
            }]
          }
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    drawYearAveTime () {
      let myChart = this.$echarts.init(document.getElementById('yearAveTime'))
      let option = {
        legend: {
          show: false,
          orient: 'vertical',
          right: 0,
          top: 0,
          data: this.type,
          type: 'scroll',
          textStyle: {
            color: '#e7e7e9'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 10
            return obj
          }
        },
        grid: this.grid,
        series: [
          {
            name: this.$t('vicenter.supervise.kolzhatCustomShow.statistics'),
            type: 'pie',
            radius: [20, 45],
            center: ['50%', '47%'],
            // roseType: 'radius',
            data: [
              {value: 22970, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_IMPORT')},
              {value: 10170, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_EXPORT')},
              {value: 17570, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITDOMESTIC')},
              {value: 13470, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITTARIFFUNION')},
              {value: 15330, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITNONTARIFFUNION')},
              {value: 9810, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TOLOGISTICSCENTER')}
            ],
            label: {
              normal: {
                formatter: '{d}%'
              }
            },
            labelLine: {
              smooth: true
            }
          }
        ],
        color: ['#5da1ce', '#3682cd', '#3440a4', '#0b85d5', '#555ac0', '#ca4890']
      }
      if (window.innerWidth < 1750) {
        delete option.legend
        option.series[0].center = ['50%', '50%']
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        if (window.innerWidth < 1750) {
          delete option.legend
          option.series[0].center = ['50%', '50%']
          myChart.clear()
          myChart.setOption(option)
        } else {
        // option.legend = {
        // orient: 'vertical',
          // right: 0,
          // top: 0,
          // type: 'scroll',
          // data: this.type,
          // textStyle: {
          // color: '#e7e7e9'
          // }
        // }
          option.series[0].center = ['35%', '50%']
          myChart.clear()
          myChart.setOption(option)
        }
        myChart.resize()
      })
    },
    drawdayTask () {
      let myChart = this.$echarts.init(document.getElementById('dayTask'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          position: ['-30%', '10%']
        },
        legend: {
          show: false,
          orient: 'vertical',
          right: 0,
          top: 0,
          data: this.type,
          type: 'scroll',
          textStyle: {
            color: '#e7e7e9'
          }
        },
        grid: {
          top: '5%',
          bottom: '2%',
          left: '3%',
          right: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
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
          data: this.area,
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
        // ['进口', '出口', '转关至国内', '转关至同盟国', '转关至非同盟国', '转关至物流国'],
        series: [
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_IMPORT'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [32, 30, 30, 33, 39, 33, 32],
            itemStyle: {
              color: '#5da1ce'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_EXPORT'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [12, 13, 10, 13, 9, 23, 21],
            itemStyle: {
              color: '#3682cd'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITDOMESTIC'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [22, 18, 19, 23, 29, 33, 30],
            itemStyle: {
              color: '#3440a4'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITTARIFFUNION'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [15, 22, 20, 15, 19, 33, 40],
            itemStyle: {
              color: '#0b85d5'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITNONTARIFFUNION'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [12, 15, 21, 20, 33, 31, 21],
            itemStyle: {
              color: '#555ac0'
            }
          },
          {
            name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TOLOGISTICSCENTER'),
            type: 'bar',
            stack: this.$t('vicenter.supervise.kolzhatCustomShow.total'),
            data: [20, 8, 9, 9, 10, 13, 13],
            itemStyle: {
              color: '#ca4890'
            }
          }
        ]
      }
      if (window.innerWidth < 1750) {
        delete option.legend
        option.grid = {
          top: '5%',
          bottom: '12%',
          left: '3%',
          right: '5%',
          containLabel: true
        }
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        if (window.innerWidth < 1750) {
          delete option.legend
          option.grid = {
            top: '5%',
            bottom: '2%',
            left: '3%',
            right: '5%',
            containLabel: true
          }
          myChart.clear()
          myChart.setOption(option)
        } else {
        // option.legend = {
        // orient: 'vertical',
          // right: 0,
          // top: 0,
          // type: 'scroll',
          // data: this.type,
          // textStyle: {
          // color: '#e7e7e9'
          // }
        // }
          option.grid = {
            top: '5%',
            bottom: '2%',
            left: '3%',
            right: '30%',
            containLabel: true
          }
          myChart.clear()
          myChart.setOption(option)
        }
        myChart.resize()
      })
    },
    drawdayVitrick () {
      let myChart = this.$echarts.init(document.getElementById('dayVitrickNum'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.area,
          axisTick: {
            show: false
          },
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
          },
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        grid: this.grid,
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#e7e7e9',
              width: 1
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#151f22'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [{
          data: [122, 82, 70, 48, 38, 40, 60],
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            normal: {
              color: '#00b4ff',
              barBorderRadius: 30
            }
          }
        }]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    drawdayCheckRate () {
      let myChart = this.$echarts.init(document.getElementById('dayCheckRate'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.area,
          axisTick: {
            show: false
          },
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
          },
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        grid: {
          top: '5%',
          bottom: '8%',
          left: '8%',
          right: '6%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#e7e7e9',
              width: 1
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#151f22'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [
          {
            symbolSize: 8,
            data: [122, 82, 70, 48, 38, 40, 60],
            type: 'line',
            lineStyle: {
              color: '#00b4fc'
            },
            itemStyle: {
              color: '#00b4fc',
              borderColor: '#00b4fc'
            },
            areaStyle: {
              normal: {
                color: '#00b4fc',
                opacity: 0.5
              }
            },
            smooth: true,
            markLine: {
              lineStyle: {
                type: 'solid',
                color: 'red'
              },
              data: [{
                yAxis: 50
              }]
            }
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    drawdayTaskStyle () {
      let myChart = this.$echarts.init(document.getElementById('dayTaskStyle'))
      let option = {
        legend: {
          show: false,
          orient: 'vertical',
          right: 0,
          top: 0,
          data: this.type,
          type: 'scroll',
          textStyle: {
            color: '#e7e7e9'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        grid: this.grid,
        series: [
          {
            name: this.$t('vicenter.supervise.kolzhatCustomShow.statistics'),
            type: 'pie',
            radius: [20, 45],
            center: ['50%', '47%'],
            data: [
              {value: 200, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_IMPORT')},
              {value: 170, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_EXPORT')},
              {value: 150, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITDOMESTIC')},
              {value: 100, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITTARIFFUNION')},
              {value: 80, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITNONTARIFFUNION')},
              {value: 120, name: this.$t('vicenter.DIC.T_BUSSINESS_TYPE.C_TOLOGISTICSCENTER')}
            ],
            label: {
              normal: {
                formatter: '{d}%'
              }
            }
          }
        ],
        color: ['#5da1ce', '#3682cd', '#3440a4', '#0b85d5', '#555ac0', '#ca4890']
      }
      if (window.innerWidth < 1750) {
        delete option.legend
        option.series[0].center = ['50%', '50%']
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        if (window.innerWidth < 1750) {
          delete option.legend
          option.series[0].center = ['50%', '50%']
          myChart.clear()
          myChart.setOption(option)
        } else {
        // option.legend = {
        // orient: 'vertical',
          // right: 0,
          // top: 0,
          // type: 'scroll',
          // data: this.type,
          // textStyle: {
          // color: '#e7e7e9'
          // }
        // }
          option.series[0].center = ['35%', '50%']
          myChart.clear()
          myChart.setOption(option)
        }
        myChart.resize()
      })
    }
  },
  components: { superviseChart, breadCrumb }
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.custom-bar{
  @extend .extend-bar;
  .custom-M{
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
      .margins{
        margin: 0;
      }
      .margins .el-breadcrumb__inner.is-link{
        color: #02caf4;
      }
      .margins span:last-child .el-breadcrumb__inner.is-link{
        color: white;
      }
    }
    .custom{
      // z-index: -101;
      // position: relative;
      @include box-sizing;
      width: 100%;
      height: calc(100% - 50px);
      min-height: 750px;
      .custom-Main{
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
          .yearCheck{
          }
        }
        .center{
          width: calc(100%*5/11 - 20px);
          height: 97.4%;
          border: 1px solid #1582d4;
          background: $dmsStatisticCustomBg no-repeat;
          background-size:100% 100%;
          -moz-background-size:100%;
          position: relative;
          .headTitle {
            width: 100%;
            height: 100px;
            position: absolute;
            left: 0;
            right: 0;
            background: $dmsMapTitleBg no-repeat;
            background-position: center -9px;
            color: #00d5ff;
            font-weight: bold;
            font-size: 20px;
            line-height: 55px;
          }
          .portPosition {
            position: absolute;
            bottom: 35%;
            right: 18%;
            background: $dmsStatisticPositionBg no-repeat;
            background-size: 100% 100%;
            background-position: center center;
            width: 25px;
            height: 25px;
            cursor: pointer;
          }
          .box1{
            float: left;
            width: 373px;
            height: 294px;
            margin: 70px 0 0 5px;
            .row-list{
              width: 49%;
              float: left;
              padding-top: 10px;
              height: 60px;
              .iconLeft{
                width: $all/4;
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
            margin: 80px 5px 0 0;
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
          width: 50%;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
