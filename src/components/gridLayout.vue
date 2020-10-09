<template>
  <div id="dashboard-container">
    <grid-layout
      :layout.sync="gridLayoutOption.layout"
      :col-num="gridLayoutOption.colNum"
      :row-height="gridLayoutOption.rowHeight"
      :margin="gridLayoutOption.margin || [10, 10]"
      :is-draggable="gridLayoutOption.isDraggable || false"
      :is-resizable="gridLayoutOption.isResizable || false"
      :useCssTransforms="false"
      @layout-mounted="handleLayoutMounted"
      @layout-updated="handleLayoutUpdated"
      >
      <grid-item
        v-for="item in gridLayoutOption.layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :static="item.static"
        :key="item.i"
        @move="handleMoveItem"
        @moved="handleMovedItem"
      >
        <div v-if="!item.chartId && item.i === 'MAP'" :class="{mapBg: !item.chartId}"></div>
        <div v-if="!item.chartId && item.i !== 'MAP'" class="poster">
          <div class="title" :title="item.label">{{item.label}}</div>
          <div class="poster-img"><img :src="item.imgUrl" /></div>
        </div>
        <div v-if="item.chartId && item.i === 'MAP'" class="map-container">
          <Map v-if="showMap" @currenView="getCurrentMapView"></Map>
        </div>
        <CommonCharts v-if="item.chartId && item.i !== 'MAP'" :chartData="item" :mapData="mapData" :dateType="currentDateType" :key="item.chartId"></CommonCharts>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'
import CommonCharts from './commonCharts'
import Map from './dashboardMap'
export default {
  name: 'grid-layout-common',
  data () {
    return {
      currentDateType: '',
      layoutType: '4:4', // 布局类型，X轴元素数量*Y轴元素数量
      mapPosition: {
        x: 1,
        y: 1,
        w: 2,
        h: 3,
        i: 'MAP',
        static: true
      }, // 地图位置，不包含地图的话，设置为null
      gridLayoutOption: {
        layout: [], // 数据源
        colNum: 0, // 栅格列数
        rowHeight: 0, // 栅格行高
        margin: [10, 10], // 栅格元素边距
        isDraggable: true // 是否可拖拽
      }, // 配置项
      ignoreBox: [], // 存放和地图区域重合的box的坐标
      clientHeight: 0, // 可视区域高度
      historyLayout: [], // 记录上一次的布局
      curBoxData: {}, // 当前拖动的box的原数据
      mapData: {},
      showMap: false
    }
  },
  created () {
    this.initGridLayout()
    window.addEventListener('resize', () => {
      this.initGridLayout()
    })
  },
  mounted () {},
  methods: {
    /**
     * 初始化整体布局
    */
    initGridLayout () {
      this.clientHeight = this.$props.totalHeight || document.documentElement.clientHeight
      // 模板比例指的是 n行*m列，布局类型指的是 每行n个元素*m行
      this.layoutType = this.$props.type.split(':').reverse().join(':')
      // 地图位置
      this.mapPosition = this.$props.mapPos
      // 是否可拖拽
      this.gridLayoutOption.isDraggable = this.$props.isDraggable === undefined ? this.gridLayoutOption.isDraggable : this.$props.isDraggable
      // 数据源
      this.gridLayoutOption.layout = this.$props.data
      this.gridLayoutOption.colNum = Number(this.layoutType.split(':')[0])
      this.gridLayoutOption.rowHeight = this.calcRowHeight(Number(this.layoutType.split(':')[1]), this.clientHeight, this.gridLayoutOption.margin[1])
      if (this.gridLayoutOption.layout.length === 0) {
        this.gridLayoutOption.layout = this.initLayoutData()
      }
      this.$emit('allData', this.gridLayoutOption.layout)
      this.historyLayout = JSON.parse(JSON.stringify(this.gridLayoutOption.layout))
    },
    resetGridLayout () {
      this.gridLayoutOption.layout = []
      this.initGridLayout()
    },
    /**
     * 初始化数据源
    */
    initLayoutData () {
      let layoutData = []
      let maxX = Number(this.layoutType.split(':')[0])
      let maxY = Number(this.layoutType.split(':')[1])
      this.ignoreBox = []
      if (this.mapPosition) {
        layoutData.push(this.mapPosition)
        let { x, y, w, h } = this.mapPosition
        for (let a = x; a < w + x; a++) {
          for (let b = y; b < h + y; b++) {
            this.ignoreBox.push(`${a},${b}`)
          }
        }
      }
      for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
          let obj = {
            x: x,
            y: y,
            w: 1,
            h: 1,
            i: `${x}-${y}`,
            static: false,
            label: '',
            imgUrl: '',
            chartId: ''
          }
          if (!this.ignoreBox.includes(`${x},${y}`)) {
            layoutData.push(obj)
          }
        }
      }
      return layoutData
    },
    /**
     * 计算栅格行的高度
     * @param {number} rowsQty 栅格行数
     * @param {number} clientHeight 可视区域高度
     * @param {number} margin 栅格元素垂直边距
     * @returns {number} 返回栅格行的高度
    */
    calcRowHeight (rowsQty, clientHeight, margin) {
      let rowHeight = (clientHeight - (rowsQty + 1) * margin) / rowsQty
      return rowHeight
    },
    handleLayoutMounted (newLayout) {
      this.$emit('allData', newLayout)
    },
    /**
     * 监听布局更新或栅格元素的位置重新计算
    */
    handleLayoutUpdated (newLayout) {
      this.$emit('allData', newLayout)
      // 栅格布局位置、大小更新结束之后再加载地图
      setTimeout(() => {
        this.showMap = true
      }, 0)
    },
    /**
     * 鼠标按下并拖动box的回调
    */
    handleMoveItem (i, newX, newY) {
      this.curBoxData = this.historyLayout.filter(e => e.i === i)[0]
      this.gridLayoutOption.layout.forEach((e, index) => {
        if (!this.ignoreBox.includes(`${newX},${newY}`)) {
          if (newX === e.x && newY === e.y && i !== e.i) {
            e.x = this.curBoxData.x
            e.y = this.curBoxData.y
          } else {
            e.x = this.historyLayout[index].x
            e.y = this.historyLayout[index].y
          }
        }
      })
    },
    /**
     * 鼠标松开当前拖动的box的回调
    */
    handleMovedItem (i, newX, newY) {
      this.historyLayout = JSON.parse(JSON.stringify(this.gridLayoutOption.layout))
    },
    /**
     * 获取当前地图显示级别
    */
    getCurrentMapView (data) {
      this.mapData = data
      this.gridLayoutOption.layout.forEach(e => {
        e.type = data.type
        e.idStr = data.idStr
      })
    }
  },
  props: {
    'type': { // 布局类型
      type: String,
      required: true,
      default: ''
    },
    'dateType': { // 日期类型
      type: String,
      required: false,
      default: ''
    },
    'mapPos': { // 地图位置
      type: Object,
      required: true,
      default: {}
    },
    'data': { // 数据源
      type: Array,
      required: true,
      default: []
    },
    'totalHeight': { // 实际容器总高度
      type: Number,
      required: false,
      default: 0
    },
    'isDraggable': { // 是否可拖拽
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    'totalHeight': {
      handler (newVal, oldVal) {
        this.clientHeight = newVal || document.documentElement.clientHeight
      },
      immediate: true
    },
    'dateType': {
      handler (newVal, oldVal) {
        this.currentDateType = newVal
      },
      immediate: true
    }
  },
  components: { GridLayout, GridItem, CommonCharts, Map }
}
</script>

<style scoped lang="scss">
@import'@/styles/index.scss';
#dashboard-container {
  width: $all;
  height: $all;
  .vue-grid-item {
    background: rgba(200, 200, 200, .5);
    @include flex(column, center, center);
    .mapBg {
      width: $all;
      height: $all;
      overflow: hidden;
      background: $templateMapBg no-repeat center;
      background-size: auto 120%;
    }
    .poster {
      width: $all;
      height: $all;
      overflow: hidden;
      padding: 8px;
      @include box-sizing();
      text-align: center;
      .title {
        width: $all;
        height: 20px;
        line-height: 20px;
        margin-bottom: 5px;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .poster-img {
        width: $all;
        height: calc(100% - 25px);
        overflow: hidden;
        img {
          width: auto;
          height: $all;
          display: inline-block;
        }
      }
    }
    .map-container {
      width: $all;
      height: $all;
    }
  }
}
</style>
