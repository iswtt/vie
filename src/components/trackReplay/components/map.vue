<template>
  <div id="track-player-map-div">
    <div id="track-player-omap1"></div>
  </div>
</template>

<script>
/* eslint-disable */

// 地图所需各类控件及变量
const olmap = require("../lib/omap/omap");
let nucMap, track, portLayer, vehicleLayer, realRouteLayer, polygonLayer, planRouteLayer, alarmLayer;
export default {
  data() {
    return {
    };
  },
  computed: {},
  props: [],
  watch: {},
  mounted() {
    this.initMap(); // 初始化地图
    this.mapChange(); // 加载google底图
  },
  methods: {
    /**
     * @augments
     * @author lqx
     * @description 绘制口岸站点
     * @param portArr 口岸集合
     * */
    addPorts (portArr) {
      var opts = {
          offsetX: 5,
          offsetY: 30,
          scale: 1,
          backgroundFill: "#ffffff",
          padding: [0, 10, 0, 10],
          font: "14px microsoft yahei,Verdana",
          strokeColor: "rgba(255,255,0,0)",
          backgroundStroke: "#0000ff"
      }
      if (this.isNotEmpty(portLayer)) {
        nucMap.removeNucLayer(portLayer);
      }
      portLayer = nucMap.createNucLayer();
      portArr.forEach((obj) => {
        Object.assign(opts, obj)
        var Marker = nucMap.createMarker(opts);
        nucMap.addFeatures2Layer(Marker, portLayer);
      });
    },
    /**
     * @augments
     * @author lqx
     * @description 添加规划路线  目前规划路线只需要一条
     * @param paths 规划路线坐标集合
     * @param _opts 规划路线属性---颜色、线宽
     * */
    addPlanRoute (paths, _opts) {
      if (this.isNotEmpty(planRouteLayer)) {
        nucMap.removeNucLayer(planRouteLayer)
      }
       // 创建线元素图层，用于加载线元素
      planRouteLayer = nucMap.createNucLayer()
      // 线元素坐标集合
      var lineOpts = {
        paths: paths,
        // 线填充颜色
        fillcolor: 'blue', // blue || '#ff0000' ||rgba(237, 212, 0, 0.7)
        // 线颜色
        strokecolor: 'rgba(0, 255, 0, 0.5)',
        // 线宽度
        strokewidth: 5
      }
      // 接收外部画线参数（线宽、颜色）
      Object.assign(lineOpts, _opts)
      // 创建线
      var line = nucMap.createNucline(lineOpts)
      // 图层添加线
      nucMap.addFeatures2Layer(line, planRouteLayer)
    },
    /**
     * @author lqx
     * @description 添加车辆所有报警点
     * @param 报警点集合
     */
    addVehicleAlarms (alarmArr) {
      // 报警点默认属性，已有固定值
      var opts = {} 
      if (this.isNotEmpty(alarmLayer)) {
        nucMap.removeNucLayer(alarmLayer);
      }
      alarmLayer = nucMap.createNucLayer();
      nucMap.setLayerZIndex(alarmLayer, 100);
      for (let i = 0; i < alarmArr.length; i++) {
        Object.assign(opts, alarmArr[i]);
        var Marker = nucMap.createMarker(opts);
        nucMap.addFeatures2Layer(Marker, alarmLayer);
      }
    },
    /**
     * @author lqx
     * @description 取得电子围栏
     * @param pathsArr 电子围栏坐标集合
     * 
     */
    addLandAreas (pathsArr) {
      var opts = {
          paths: [],
          // 填充颜色
          fillcolor: "rgba(255, 0, 0, 0.5)", // blue || "#ff0000" ||rgba(237, 212, 0, 0.7)
          // 边界颜色
          strokecolor: "rgba(0, 0, 255, 0)",
          // 边界宽度
          strokewidth: 3
      };
      if (this.isNotEmpty(polygonLayer)) {
        nucMap.removeNucLayer(polygonLayer);
      }
      polygonLayer = nucMap.createNucLayer();
      // 循环遍历画面 
      pathsArr.forEach((obj) => {
        Object.assign(opts, obj)
        // 创建多边形
        var polygon = nucMap.createNucPolygon(opts);
        // 图层添加多边形
        nucMap.addFeatures2Layer(polygon, polygonLayer);
      })
    },
    /**
     * @author lqx
     * @description 画真实路线
     * @param trackpaths 真实轨迹坐标集合
     * @param trafficIcon
     */
    addRealRoute (trackpaths, trafficIcon) {
      // 若track对象已创建 则清空定时任务和车辆
      if (track) {
        track.clearTrack();
      }
      track.addLineTrack(trackpaths, trafficIcon);
    },
    /**
     * @author lqx
     * @description 轨迹回放开始
     * 
     **/
    start () {
      let _this = this
      // 增加回调函数，返回当前关锁信息
      track.play(function(attr) {
        _this.$emit('start', attr)
      });
    },
    // 停止
    stop () {
      track.stop();
    },
    // 暂停
    pause () {
      track.pause();
    },
   /**
     * @author lqx
     * @description 轨迹回放加速
     * @param speed 加速倍数
     * @param isForward 是否正向加速 true为正向加速 false为回退加速
     * @param isPlay 是否正在播放 true为播放 false为暂停
     **/
    fast (speed, isForward, isPlay) {
      let _this = this
      track.fast(speed, isForward, isPlay, function(attr) {
         _this.$emit('fast', attr)
      });
    },
     /**
     * @author lqx
     * @description 轨迹回放减速
     * @param speed 减速倍数
     * @param isForward 是否正向减速 true为正向减速 false为回退减速
     * @param isPlay 是否正在播放 true为播放 false为暂停
     **/
    slow (speed, isForward, isPlay) {
      let _this = this
      track.slow(speed, isForward, isPlay, function(attr) {
        _this.$emit('slow', attr)
      });
    },
    // 回退
    back () {
      let _this = this
      track.back(function(attr) {
        _this.$emit('back', attr)
      });
    },
    clear() {
      track.clearTrack();
    },
    /**
     * @author lqx
     * @description 单击报警
     */
    getPropertyByclick (fea) {
      if (fea) {
         let attr = nucMap.getFeatureAttr(fea)
         this.$emit('getAlarmProperty', attr)
      }
    },
    /**
     * 判断参数是否为空
     *
     * @param exp
     */
    isNotEmpty (exp) {
      if (exp && typeof (exp) !== 'undefined' && exp !== '') {
        return true
      }
      return false
    },
    /**
     * @augments
     * 地图初始化
     */
    initMap() {
      // （本例主要用于地图自适应，地图分辨率改变地图范围改变）
      // let extent = [115.728942, 39.603449, 117.240212, 40.246503]
      nucMap = new olmap.maptalks.NucMap();
      let opts = {
        // extent地图定义范围（也可为空，通过中心点和缩放级别确定显示范围）
        // extent: extent,
        // 中心点经度
        centerlng: 116.397125,
        // 中心点经维度
        centerlat: 39.917445,
        // 缩放级别
        zoomlevel: 18,
        // 地图容器div的id
        mapId: "track-player-omap1",
        selectBack: this.getPropertyByclick, // 定义单击元素时的回调函数
      };
      // 地图初始化
      nucMap.init(opts);
      track = new olmap.maptalks.NucTrack();
    },
    /**
     * @augments
     * @author lqx
     * @description 清除图层用于切换
     */
    clearLayers() {
      if (this.isNotEmpty(vehicleLayer)) {
        nucMap.clearLayerMarkers(vehicleLayer);
      }
      if (this.isNotEmpty(polygonLayer)) {
        nucMap.clearLayerMarkers(polygonLayer);
      }

      if (this.isNotEmpty(planRouteLayer)) {
        nucMap.clearLayerMarkers(planRouteLayer);
      }

      if (this.isNotEmpty(realRouteLayer)) {
        nucMap.clearLayerMarkers(realRouteLayer);
      }
      if (this.isNotEmpty(alarmLayer)) {
        nucMap.clearLayerMarkers(alarmLayer);
      }
    },
    // 地图类型切换
    mapChange (type) {
      if (type === "statllite") {
        nucMap.changeGoogleSatelliteMap();
      } else {
        nucMap.changeGoogleRoadMap();
      }
    },
    /**
     * @augments
     * @author lqx
     * @description 合适视图
     */
    fitView(extentArr) {
      // 根据元素集合获取范围
      let extent = nucMap.getBoundExtent(extentArr);
      nucMap.fitView({
        extent: extent, // 自适应范围
        // size: 10,
        duration: 20,
        //padding: [170, 150, 130, 100],
        constrainResolution: false
      });
    },

  },
  destroyed() {
    // 释放资源
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#track-player-map-div {
  height: 100%;
}
#track-player-map-div #track-player-omap1 {
  width: 100%;
  height: 100%;
  right: 0;
  bottom: 0;
  background: #d3f5b3;
}
</style>
