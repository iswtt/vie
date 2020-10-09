<template>
  <div id="map-div">
    <div id="omapId"></div>
    <div id="popup" class="ol-popup ol-popup-shadow">
      <div class="pophead" >
        <div id="popup-title" class="popup-title"></div>
        <a href="#" id="popup-closer" :title="$t('vicenter.common.close')" style="color: aliceblue;" class="ol-popup-closer popup-closer-new" >×</a>
      </div>
      <div class="popup-content-outer" v-bar>
        <div id="popup-content"></div>
      </div>
    </div>
  </div>
</template>

<script>
const olmap = require('@/components/map/lib/omap')
let nucMap, centerLayer, regionLayer, stationLayer, scannerLayer, imageLayer, gmapLayer, lineLayer, polygonLayer, track
let popContent, popupInfo // 自定义信息框
let alarmLayer = []
let fitExtent
export default {
  data () {
    return {
    }
  },
  computed: {},
  props: [],
  watch: {},
  mounted () {
    this.initMap() // 初始化地图
    this.mapChange() // 加载google底图
  },
  methods: {
    /**
     * @description 切换成图片底图(指定范围区域)
     * @param imgOpts 图片底图参数
     * */
    switchImageMap (imgOpts) {
      // 清除所有图层
      // nucMap.removeAllLayers()
      // 清除报警点图层
      // this.removeAlarmGifMarker()
      // 创建google底图
      nucMap.createGoogleLayer()
      // 创建图片底图
      nucMap.createImageLayer(imgOpts)
      // 获取extent的中心位置
      let center = nucMap.getNucCenter(imgOpts.imageExtent)
      // 设置地图中心
      this.setMapCenter(center)
      // 口岸缩放级别
      this.setMapZoomLevel(imgOpts.zoom)
    },
    /**
     * @description 切换成google底图(指定范围区域)
     * @param opts 参数
     * */
    switchGoogleMap (opts) {
      // nucMap.removeAllLayers()
      nucMap.createGoogleLayer()
      nucMap.fitView({
        extent: opts.extent
      })
    },
    /**
     * @description 创建google底图(去掉所有元素，只有底图)
     * */
    createGoogleLayer () {
      // nucMap.removeAllLayers()
      nucMap.createGoogleLayer()
    },
    /**
     * @description 根据元素集合获取范围
     * @param opts 参数
     * */
    getBoundExtent (extentArr) {
      if (extentArr.length > 0) {
        fitExtent = nucMap.getBoundExtent(extentArr)
        nucMap.fitView({
          extent: fitExtent
        })
        window.onresize = function () {
          var resize
          if (resize) {
            clearTimeout(resize)
          }
          resize = setTimeout(function () {
            // 重新实现视图自适应
            nucMap.fitView({
              extent: fitExtent
            })
          }, 50)
        }
      }
    },
    /**
     * @description 清除所有图层
     * */
    removeAllLayers () {
      nucMap.removeAllLayers()
    },
    /**
     * @description 设置地图中心点
     * @param coords 中心点经纬度(Array)
     * */
    setMapCenter (coords) {
      nucMap.setCenter(coords)
    },
    /**
     * @description 设置地图缩放级别
     * @param zoomLevel 缩放级别(Number)
     * */
    setMapZoomLevel (zoomLevel) {
      nucMap.setZoomLevel(zoomLevel)
    },
    /**
     * @description 获取地图缩放级别
     * */
    getZoomLevel () {
      return nucMap.getZoomLevel()
    },
    /**
     * @description 获取地图缩放级别(鼠标滚轮缩放回调)
     * @param
     * */
    zoomchange (level) {
      // console.log(level)
    },
    /**
     * @description 添加线元素
     * @param pathArr 线元素相关配置
     * */
    addLineFeature (lineOpts) {
      let line = nucMap.createNucline(lineOpts)
      // 创建线图层
      lineLayer = nucMap.createNucLayer()
      // 图层添加线
      nucMap.addFeatures2Layer(line, lineLayer)
    },
    /**
     * @description 添加面元素
     * @param
     * */
    addPolygonFeature (polygonOpts) {
      // 创建多边形
      var polygon = nucMap.createNucPolygon(polygonOpts)
      // 创建多边形图层
      polygonLayer = nucMap.createNucLayer()
      // 图层添加多边形
      nucMap.addFeatures2Layer(polygon, polygonLayer)
    },
    /**
     * @description 绘制中心(添加点元素)
     * @param centerArr 中心集合
     * */
    addCenter (centerArr) {
      var opts = {
        offsetX: 0,
        offsetY: 30,
        scale: 1,
        fillColor: '#ff0000',
        font: '20px microsoft yahei,arial',
        strokeColor: 'rgba(255,255,255,1)',
        strokeWidth: 2
      }
      if (this.isNotEmpty(centerLayer)) {
        nucMap.removeNucLayer(centerLayer)
      }
      centerLayer = nucMap.createNucLayer()
      nucMap.setLayerZIndex(centerLayer, 100)
      centerArr.forEach((obj) => {
        Object.assign(opts, obj)
        // extentArr.push([opts.lng, opts.lat])
        var Marker = nucMap.createMarker(opts)
        nucMap.addFeatures2Layer(Marker, centerLayer)
      })
    },
    /**
     * @description 绘制关区(添加点元素)
     * @param regionArr 关区集合
     * */
    addRegion (regionArr) {
      var opts = {
        offsetX: 0,
        offsetY: 30,
        scale: 1,
        fillColor: '#0000ff',
        font: '14px microsoft yahei,arial',
        strokeColor: 'rgba(255,255,255,1)',
        strokeWidth: 1
      }
      if (this.isNotEmpty(regionLayer)) {
        nucMap.removeNucLayer(regionLayer)
      }
      regionLayer = nucMap.createNucLayer()
      nucMap.setLayerZIndex(regionLayer, 90)
      regionArr.forEach((obj) => {
        Object.assign(opts, obj)
        // extentArr.push([opts.lng, opts.lat])
        var Marker = nucMap.createMarker(opts)
        nucMap.addFeatures2Layer(Marker, regionLayer)
      })
    },
    /**
     * @description 绘制站点(添加点元素)
     * @param stationArr 站点集合
     * */
    addStation (stationArr) {
      var opts = {
        offsetX: 0,
        offsetY: 30,
        scale: 1,
        fillColor: '#0000ff',
        font: '14px microsoft yahei,arial',
        strokeColor: 'rgba(255,255,255,1)',
        strokeWidth: 1
      }
      if (this.isNotEmpty(stationLayer)) {
        nucMap.removeNucLayer(stationLayer)
      }
      stationLayer = nucMap.createNucLayer()
      nucMap.setLayerZIndex(stationLayer, 90)
      stationArr.forEach((obj) => {
        Object.assign(opts, obj)
        // extentArr.push([opts.lng, opts.lat])
        var Marker = nucMap.createMarker(opts)
        nucMap.addFeatures2Layer(Marker, stationLayer)
      })
    },
    /**
     * @description 绘制设备(添加点元素)
     * @param scannerArr 设备集合
     * */
    addScanner (scannerArr) {
      var opts = {
        offsetX: 0,
        offsetY: 30,
        scale: 1,
        fillColor: '#0000ff',
        font: '14px microsoft yahei,arial',
        strokeColor: 'rgba(255,255,255,1)',
        strokeWidth: 1
      }
      if (this.isNotEmpty(scannerLayer)) {
        nucMap.removeNucLayer(scannerLayer)
      }
      scannerLayer = nucMap.createNucLayer()
      nucMap.setLayerZIndex(scannerLayer, 90)
      scannerArr.forEach((obj) => {
        Object.assign(opts, obj)
        // extentArr.push([opts.lng, opts.lat])
        var Marker = nucMap.createMarker(opts)
        nucMap.addFeatures2Layer(Marker, scannerLayer)
      })
    },
    /**
     * @description 绘制设备(添加点元素，可修改)
     * @param scannerArr 设备集合
     * */
    addScannerModify (scannerArr) {
      var opts = {
        offsetX: 0,
        offsetY: 30,
        scale: 1,
        fillColor: '#0000ff',
        font: '14px microsoft yahei,arial',
        strokeColor: 'rgba(255,255,255,1)',
        strokeWidth: 1
      }
      if (this.isNotEmpty(scannerLayer)) {
        nucMap.removeNucLayer(scannerLayer)
      }
      scannerLayer = nucMap.createNucLayer()
      nucMap.setLayerZIndex(scannerLayer, 90)
      scannerArr.forEach((obj) => {
        Object.assign(opts, obj)
        var modifyMarker = new olmap.maptalks.NucModify({
          mondifyback: this.getModifyFeas
        })
        // extentArr.push([opts.lng, opts.lat])
        var Marker = nucMap.createMarker(opts)
        modifyMarker.featureToModify(Marker)
      })
    },
    /**
     * @description 创建报警点gifMarker
     * @param gifOpts 配置
     * */
    createAlarmGifMarker (gifOpts) {
      let gifmarker = nucMap.createAlarmGifMarker(gifOpts)
      alarmLayer.push(gifmarker)
    },
    /**
     * @description 删除报警点gifMarker
     * */
    removeAlarmGifMarker () {
      if (alarmLayer.length > 0) {
        nucMap.removeOverlays(alarmLayer)
      }
    },
    /**
     * @description 控制元素显示或者隐藏
     * @param layerName 图层名, status 显示或隐藏
     */
    showOrHiddenMarkers (layerName, status) {
      if (layerName === 'Region') {
        nucMap.setNucVisible(regionLayer, status)
      } else if (layerName === 'Station') {
        nucMap.setNucVisible(stationLayer, status)
      } else if (layerName === 'Scanner') {
        nucMap.setNucVisible(scannerLayer, status)
      }
    },
    /**
     * @description 删除图层上所有元素
     * @param layerName 图层名
     */
    clearMarkers (layerName) {
      if (layerName === 'Region' && regionLayer) {
        nucMap.clearLayerMarkers(regionLayer)
      } else if (layerName === 'Station' && stationLayer) {
        nucMap.clearLayerMarkers(stationLayer)
      } else if (layerName === 'Scanner' && scannerLayer) {
        nucMap.clearLayerMarkers(scannerLayer)
      } else if (layerName === 'Center' && centerLayer) {
        nucMap.clearLayerMarkers(centerLayer)
      }
    },
    /**
     * @description 单击元素操作处理
     */
    getPropertyByclick (fea) {
      if (fea) {
        let attr = nucMap.getFeatureAttr(fea)
        this.$emit('getProperty', {
          feature: fea,
          attr: attr
        })
        // 判断点击元素是否显示弹出框
        if (attr.showDialog) {
          this.createPopup(fea, attr)
        }
      }
    },
    /**
     * @description 修改元素操作处理
     */
    getModifyFeas (fea) {
      let data = nucMap.getCoodsByFeature(fea)
      this.$emit('getProperty', data)
    },
    /**
     * @description 添加自定义信息框
     */
    createPopup (fea, attr) {
      let coods = nucMap.getCoodsByFeature(fea)
      // 创建弹出框信息内容
      let html = this.createPopupInfo()
      // 给弹出框内容部分赋值
      popContent.innerHTML = html
      document.getElementById('popup-title').innerHTML = attr.name
      // 给弹出框设置位置
      nucMap.setOverlaysPostion(popupInfo, coods[0], coods[1])
    },
    /**
     * @description 自定义信息框内容创建
     */
    createPopupInfo () {
      var str = `
        <div class="innerBox">
          <div>111</div>
          <div>222</div>
        </div>
      `
      return str
    },
    /**
     * @description 设置元素图标
     * @param fea 元素, src 元素图标路径
     */
    setFeatureImge (fea, src) {
      nucMap.setFeatureImge(fea, src)
    },
    /**
     * @description 重置所有元素图标
     * @param src 元素图标路径
     */
    resetAllFeatureImge (srcObj) {
      let layersArr = [centerLayer, regionLayer, stationLayer, scannerLayer]
      let feaArr = []
      layersArr.forEach((e, index) => {
        feaArr = nucMap.getFeatures(e)
        if (index === 0 && srcObj.center) {
          feaArr.forEach(fea => {
            nucMap.setFeatureImge(fea, srcObj.center)
          })
        } else if (index === 1 && srcObj.region) {
          feaArr.forEach(fea => {
            nucMap.setFeatureImge(fea, srcObj.region)
          })
        } else if (index === 2 && srcObj.station) {
          feaArr.forEach(fea => {
            nucMap.setFeatureImge(fea, srcObj.station)
          })
        } else if (index === 3 && srcObj.scanner) {
          feaArr.forEach(fea => {
            nucMap.setFeatureImge(fea, srcObj.scanner)
          })
        }
      })
    },
    /**
     * @description 轨迹回放
     * @param paths 轨迹点坐标[{lng:xxx,lat:xxx}], imgSrc 图标
     */
    trackReplay (paths, imgSrc) {
      track = new olmap.maptalks.NucTrack()
      track.addLineTrack(paths, imgSrc)
    },
    /**
     * @description 轨迹回放开始
     **/
    start () {
      let _this = this
      // 增加回调函数，返回当前关锁信息
      track.play(function (attr) {
        _this.$emit('start', attr)
      })
    },
    /**
     * @description 轨迹回放加速
     * @param speed 加速倍数
     * @param isForward 是否正向加速 true为正向加速 false为回退加速
     * @param isPlay 是否正在播放 true为播放 false为暂停
     **/
    fast (speed, isForward, isPlay) {
      let _this = this
      track.fast(speed, isForward, isPlay, function (attr) {
        _this.$emit('fast', attr)
      })
    },
    /**
     * @description 轨迹回放减速
     * @param speed 减速倍数
     * @param isForward 是否正向减速 true为正向减速 false为回退减速
     * @param isPlay 是否正在播放 true为播放 false为暂停
     **/
    slow (speed, isForward, isPlay) {
      let _this = this
      track.slow(speed, isForward, isPlay, function (attr) {
        _this.$emit('slow', attr)
      })
    },
    /**
     * @description 回退
     **/
    back () {
      let _this = this
      track.back(function (attr) {
        _this.$emit('back', attr)
      })
    },
    /**
     * @description 停止
     **/
    stop () {
      track.stop()
    },
    /**
     * @description 暂停
     **/
    pause () {
      track.pause()
    },
    /**
     * @description 清除轨迹
     **/
    clear () {
      track.clearTrack()
    },
    /**
     * @description 初始化地图
     */
    initMap () {
      // （本例主要用于地图自适应，地图分辨率改变地图范围改变）
      // let extent = [115.728942, 39.603449, 117.240212, 40.246503]
      nucMap = new olmap.maptalks.NucMap()
      let opts = {
        // extent地图定义范围（也可为空，通过中心点和缩放级别确定显示范围）
        // extent: extent,
        // 中心点经度
        centerlng: 116.710124,
        // 中心点经维度
        centerlat: 39.455392,
        // 缩放级别
        zoomlevel: 10,
        // 地图容器div的id
        mapId: 'omapId',
        // 缩放级别回调
        zoomchangeback: this.zoomchange,
        selectBack: this.getPropertyByclick // 定义单击元素时的回调函数
      }
      // 地图初始化
      nucMap.init(opts)
      // 初始化自定义信息框
      popContent = document.getElementById('popup-content')
      popupInfo = nucMap.createPopup({
        autoPanAnimation: 250, // 自动偏移时间
        positioning: 'center-center', // 显示位置
        domId: 'popup', // 弹出框div的id
        closedomId: 'popup-closer' // 弹出框关闭按钮
      })
    },
    /**
     * @description 判断参数是否为空
     */
    isNotEmpty (exp) {
      if (exp && typeof (exp) !== 'undefined' && exp !== '') {
        return true
      }
      return false
    },
    /**
     * @description 地图类型切换
     */
    mapChange (type) {
      if (type === 'statllite') {
        nucMap.changeGoogleSatelliteMap()
      } else {
        nucMap.changeGoogleRoadMap()
      }
    }
  },
  components: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/styles/index.scss";
#map-div {
  height: $all;
  #omapId {
    width: $all;
    height: $all;
    right: 0;
    bottom: 0;
    background: #ffffff;
    position: relative;
    .ol-control {
      z-index: 100;
    }
    #popup {
      min-width: 300px;
      height: auto;
      background: rgba(0, 0, 0, .6);
      border-radius: $dis10/2;
      padding: $dis10;
      position: absolute;
      bottom: $dis10;
      z-index: 1000;
      @include box-sizing();
      box-shadow: 4px 6px 10px #666;
      .pophead {
        position: relative;
        color: #ffffff;
        height: 25px;
        #popup-title {
          text-align: left;
          padding-right: $dis10;
        }
        #popup-closer {
          font-weight: bold;
          position: absolute;
          top: -5px;
          right: 0;
          text-decoration: none;
          font-size: 22px;
        }
      }
      .popup-content-outer {
        width: $all;
        height: 300px;
        overflow: hidden;
        background: #ffffff;
        #popup-content {
          .innerBox {
            text-align: left;
          }
        }
      }
    }
    // 报警点样式开始
    .dot {
      animation: sploosh 2.5s cubic-bezier(0.165, 0.84, 0.44, 0.7);
    }
    .dot2 {
      animation: sploosh2 2.5s cubic-bezier(0.165, 0.84, 0.44, 0.7);
    }
    .dot3 {
      animation: sploosh3 2.5s cubic-bezier(0.165, 0.84, 0.44, 0.7);
    }
    .dot, .dot2, .dot3 {
      height: 15px;
      width: 15px;
      border-radius: 100%;
      animation-iteration-count: infinite;
      cursor: pointer;
    }
    @keyframes sploosh {
      0% {
        box-shadow: 0 0 0 0px rgba(255, 0, 1, 0.7);
        background: rgba(255, 0, 1, 0.7);
      }
      100% {
        box-shadow: 0 0 0 30px rgba(255, 0, 1, 0);
        background: rgba(255, 0, 1, 0);
      }
    }
    @keyframes sploosh2 {
      0% {
        box-shadow: 0 0 0 0px rgba(255, 0, 1, 0.7);
        background: rgba(255, 0, 1, 0.7);
      }
      100% {
        box-shadow: 0 0 0 20px rgba(255, 0, 1, 0);
        background: rgba(255, 0, 1, 0.3);
      }
    }
    @keyframes sploosh3 {
      0% {
        box-shadow: 0 0 0 0px rgba(255, 0, 1, 0.7);
        background: rgba(255, 0, 1, 0.7);
      }
      100% {
        box-shadow: 0 0 0 10px rgba(255, 0, 1, 0);
        background: rgba(255, 0, 1, 1);
      }
    }
    // 报警点样式结束
  }
}
</style>
