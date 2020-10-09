/* eslint-disable */
/**
 * Created by liqingxian on 2017/11/6.
 */
// import { selectStyleFunction } from './../omap/cluster.js'

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (factory((global.maptalks = global.maptalks || {})));
}(this, (function (exports) {
  'use strict';
  const ol = require('../../../../static/openlayers/ol.js')
  /**点聚合图标 */
  const img1 = require('../images/m1.png')
  const img2 = require('../images/m2.png')
  const img3 = require('../images/m3.png')
  const img4 = require('../images/m4.png')
  const img5 = require('../images/m5.png')
  const car = require('../images/car.png')
  let modify
  /**
   * 判断参数是否为空
   *
   * @param exp 
   */
  var isNotEmpty = function isNotEmpty$(exp) {
    if (exp && typeof (exp) !== 'undefined' && exp !== '') {
      return true
    }
    return false
  }
  var ATTR = 'attr'
  function isObj(object) {
    return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
  }

  function isArray(object) {
    return object && typeof (object) == 'object' && object.constructor == Array;
  }

  function getLength(object) {
    var count = 0;
    for (var i in object) count++;
    return count;
  }
  // 判断json字符串相等
  function Compare(objA, objB) {
    if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
    if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
    return CompareObj(objA, objB, true); //默认为true
  }
  function CompareObj(objA, objB, flag) {
    for (var key in objA) {
      if (!flag) //跳出整个循环
        break;
      if (!objB.hasOwnProperty(key)) {
        flag = false;
        break;
      }
      if (!isArray(objA[key])) { //子级不是数组时,比较属性值
        if (objB[key] != objA[key]) {
          flag = false;
          break;
        }
      } else {
        if (!isArray(objB[key])) {
          flag = false;
          break;
        }
        var oA = objA[key],
          oB = objB[key];
        if (oA.length != oB.length) {
          flag = false;
          break;
        }
        for (var k in oA) {
          if (!flag) //这里跳出循环是为了不让递归继续
            break;
          flag = CompareObj(oA[k], oB[k], flag);
        }
      }
    }
    return flag;
  }

  var draw // global so we can remove it later
  //var drawLayer // global so we can remove it later
  var drawSource = new ol.source.Vector();
  var snap = new ol.interaction.Snap({ source: drawSource });
  var styles = {};
  var draw_style = (function () {

    styles['Polygon'] = [new ol.style.Style({
      fill: new ol.style.Fill({
        color: [172, 172, 172, 0.5]
      })
    }), new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 1],
        width: 3
      })
    }), new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 255, 0, 1],
        width: 4
      })
    }), new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0.5]
        }),
        stroke: new ol.style.Stroke({
          color: [0, 255, 0, 1],
          width: 1
        })
      }),
      geometry: function (feature) {
        var coordinates = [];
        var geo;
        if (feature.getGeometry() instanceof ol.geom.Circle) {
          var geo = feature.getGeometry();
          coordinates = [geo.getCenter(), geo.getLastCoordinate()]
        } else {
          geo = feature.getGeometry();
          coordinates = geo.getCoordinates()[0]
        }
        return new ol.geom.MultiPoint(coordinates)
      }
    })];
    styles['Circle'] = styles['Polygon'];
    styles['MultiPolygon'] = styles['Polygon'];
    styles['LineString'] = [new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 255, 0, 1],
        width: 4
      })
    })];
    styles['MultiLineString'] = styles['LineString'];
    styles['Point'] = [new ol.style.Style({
      image: new ol.style.Icon({
        src: 'assets/img/map/move.png',
        scale: 0.5
      }),
      zIndex: 100000
    })];
    styles['MultiPoint'] = styles['Point'];
    styles['GeometryCollection'] = styles['Polygon'].concat(styles['Point']);
    return function (feature) {
      return styles[feature.getGeometry().getType()]
    }
  })();
  let drawLayer = new ol.layer.Vector({
    source: drawSource,
    style: draw_style
  });

  function NucMap$() {
    // 定义map对象
    this._map = null
    // 被选中的元素,用户记录当前被选中元素
    this._selectFea = null
    this._gmapLayer = null
    this._satellitelayer = null
  }
  NucMap$.prototype = {
    /**
     * 地图初始化
     * @param _opts
     */
    init: function (_opts) {
      var opts = {
        isFeaChange: true,
        isZoomchange: false,
        isModify: true,
        popupId: 'popup',
        mapId: 'track-player-omap1',
        mapurl: 'css/default/images/miyun.png',
        zoomlevel: 11,
        extent: [-180, -90, 180, 90],
        selectBack: null,
        zoomOnWheel: false,
        isSelect: true,
        isCluster: false,
        isFeaHover: false
      }
      Object.assign(opts, _opts)
      // var osm = new ol.layer.Tile({
      //  source: new ol.source.OSM()
      // })
      if (opts.isModify) {
        // 新建元素编辑组件
        modify = new ol.interaction.Modify({
          source: drawSource
        })
        if (isNotEmpty(opts.mondifyback)) {
          // 编辑结束，获取坐标信息，对坐标进行保存，与数据库交互，关闭此次编辑状态
          modify.on('modifyend', function (event) {
            var feas = event.features.getArray()
            // 关闭编辑工具
            // modify.setActive(false);
            // 返回编辑的第一个元素
            return opts.mondifyback(feas[0])
          })
        }
      }
      var osm = new ol.layer.Tile({
        source: new ol.source.OSM()
      })
      // var googleMapLayer = new ol.layer.Tile({
      //   source: new ol.source.XYZ({
      //     url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2sen-US!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
      //   })
      // })
      this._map = new ol.Map({
        // {mouseWheelZoom: false}
        interactions: ol.interaction.defaults({
          attribution: false
        }),
        target: opts.mapId,
        layers: [
          //googleMapLayer
        ],
        controls: ol.control.defaults({
          attribution: false
        }).extend([
          // new ol.control.FullScreen(),
          // new ol.control.MousePosition({
          //   undefinedHTML: 'outside',
          //   projection: 'EPSG:4326',
          //   coordinateFormat: function (coordinate) {
          //     return ol.coordinate.format(coordinate, '{x}, {y}', 4)
          //   }
          // })
        ]),
        view: new ol.View({
          extent: ol.proj.transformExtent(opts.extent, 'EPSG:4326', 'EPSG:3857'),
          projection: 'EPSG:3857',
          center: ol.proj.fromLonLat([opts.centerlng, opts.centerlat]), // ol.extent.getCenter(opts.extent),
          zoom: opts.zoomlevel,
          minZoom: 6,
          maxZoom: opts.zoomlevel + 20,
          zoomFactor: 1.5
        })
      })
      this._map.addInteraction(snap);
      this._map.addInteraction(modify);
      this._map.addLayer(drawLayer);
      window.omap = this._map
      window.drawLayer = drawLayer;
      // 缩放级别是否回调
      if (isNotEmpty(opts.zoomchangeback)) {
        this._map.getView().on('change:resolution', function () {
          opts.zoomchangeback(window.omap.getView().getZoom())
        }) // 监听缩放级别
      }
      if (opts.isCluster) {
        var _this = this
        this._map.on('singleclick', function (evt) {
          var pixel = window.omap.getEventPixel(evt.originalEvent)
          var feature = window.omap.forEachFeatureAtPixel(pixel, function (
            feature, layer) {
            return feature
          })
          var viewArr = []
          if (feature) {
            var originalFeatures = feature.get('features')
            if (originalFeatures) {
              if (originalFeatures.length > 1) {
                originalFeatures.forEach(function (fea) {
                  var coods = ol.proj.toLonLat(fea.get('geometry').getCoordinates())
                  viewArr.push(coods)
                })
                var extent = _this.getBoundExtent(viewArr)
                _this.fitView({
                  extent: extent, // 自适应范围
                  size: _this._map.getSize(),
                  duration: 20,
                  padding: [110, 110, 130, 110],
                  constrainResolution: false
                })
              }
            }
          }


        })
        // 启动ol3选择功能
        //   var modifySelect = new ol.interaction.Select({
        //     condition: function(evt) {
        //       return  evt.type == 'pointermove' 
        //     },
        //     style: selectStyleFunction
        //   })
        //  this._map.addInteraction(modifySelect)
      }
      if(opts.mousemoveback){
        this._map.on('pointermove', function (evt) {
          if( evt.dragging ){
            return
          }
          var pixel = window.omap.getEventPixel(evt.originalEvent)
          //var coods = ol.proj.toLonLat(window.omap.getCoordinateFromPixel(pixel))
          var feature = window.omap.forEachFeatureAtPixel(pixel, function (
            feature) {
            return feature
          })
          if (isNotEmpty(feature)) {
            // 回调函数，返回选中要素
            opts.mousemoveback(feature)
          }else{
            opts.mousemoveback(feature)
          }
        })
      }
      // 地图单击事件判断是否选中元素，并可进行回调
      this._map.on('singleclick', function (evt) {
        var pixel = window.omap.getEventPixel(evt.originalEvent)
        var coods = ol.proj.toLonLat(window.omap.getCoordinateFromPixel(pixel))
        var feature = window.omap.forEachFeatureAtPixel(pixel, function (
          feature, layer) {
          return feature
        })
        if (isNotEmpty(feature) && opts.selectBack != null) {
          // 回调函数，返回选中要素
          opts.selectBack(feature)
        }
        if (opts.clickCoodsBack != null) {
          opts.clickCoodsBack(coods)
        }
      })
      return this._map
    },
    /**
     * @description 用于显示元素进入编辑状态
     */
    featureToModify: function (fea, polygonLayer) {
      if (fea) {
        var feaStyle = fea.getGeometry().getType()
        fea.setStyle(styles[feaStyle])
        drawLayer.getSource().addFeatures([fea])
      }
    },
    clearAllMapInteraction: function () {
      var interactions = this._map.getInteractions();
      var length = interactions.getLength();
      for (var i = 9; i < length; i++) {
        var interaction = interactions.item(9);
        if (interaction instanceof ol.interaction.Select) {
          interaction.getFeatures().clear()
        }
        this._map.removeInteraction(interaction)
      }
    },
    /**
     * 视图自适应
     *
     * @param _opts
     */
    fitView: function (_opts) {
      var opts = {
        // 自适应范围
        extent: [-180, -90, 180, 90],
        // 地图的尺寸
        size: 10,
        // 过渡时间
        duration: 2000,
        nearest: true,
        // 边缘距离
        padding: [300, 300, 300, 300],
        constrainResolution: true,
        maxZoom: 28
      }
      Object.assign(opts, _opts)
      var extentTransfer;
      // 若显示墨卡托投影 范围需转换
      extentTransfer = ol.proj.transformExtent(opts.extent, 'EPSG:4326', 'EPSG:3857')
      this._map.getView().fit(extentTransfer, {
        maxZoom: opts.maxZoom,
        size: this._map.getSize(),
        duration: opts.duration,
        padding: opts.padding,
        constrainResolution: opts.constrainResolution
      })
    },
    /**
     * 删除某个图层
     *
     * @param layer
     */
    removeNucLayer: function (layer) {
      this._map.removeLayer(layer)
    },
    /**
     * 删除所有图层
     */
    removeAllLayers: function () {
      var layers = this._map.getLayers()
      let laryersArr = []
      Object.assign(laryersArr, layers.getArray())
      laryersArr.forEach(function (layer) {
        window.omap.removeLayer(layer)
      })
    },
    /**
     * 设置图层显隐
     */
    setNucVisible: function (layer, flag) {
      layer.setVisible(flag)
    },
    /**
     * 获取缩放级别
     */
    getZoomLevel: function () {
      return this._map.getView().getZoom()
    },
    getMap: function () {
      if (window.omap) {
        return window.omap
      }
      return null
    },
    /**
     * 设置缩放级别
     */
    setZoomLevel: function (zoomLevel) {
      this._map.getView().setZoom(zoomLevel)
    },
    /**
     * 定位
     *
     * @param coords|Array
     */
    setCenter: function (coords) {
      try {
        coords = ol.proj.fromLonLat(coords)
        this._map.getView().setCenter(coords)
      } catch (err) {
        alert(err.description)
      }
    },
    /**
     * 创建画图工具
     *
     * @param type
     *            // Point Polygon Circle LineString none
     */
    createDrawTool: function (_opts) {
      this._map.removeInteraction(draw);
      this._map.removeInteraction(snap);
      var opts = {
        type: 'Point',
        style: ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
              color: [0, 0, 255, 0.6]
            })
          })
        }),
        callback: null
      }

      Object.assign(opts, _opts)
      var typeArr = ['Point', 'Polygon', 'Circle', 'LineString']
      //  每次绘制之前
      // this._map.removeInteraction(draw)
      if (!(typeArr.indexOf(opts.type) >= 0)) {
        return null
      }
      if (isNotEmpty(drawLayer)) {
        this.clearLayerMarkers(drawLayer);
      }
      //  地图添加该图层
      draw = new ol.interaction.Draw({
        source: drawSource,
        type: opts.type,
        /** @type {ol.geom.GeometryType} */
        style: draw_style
      })
      this._map.addInteraction(draw)
      //  若需要回调函数
      if (opts.callback) {
        draw.on('drawend', function (event) {
          // if (opts.style) {
          //   event.feature.setStyle(opts.style)
          // }
          opts.callback(event.feature)
          draw.setActive(false)
        }.bind(this))
      }
    },
    removeDraw: function () {
      this._map.removeInteraction(draw)
    },
    /**
     * 创建图片底图
     *
     * @param _opts
     */
    createImageLayer: function (_opts) {
      var opts = {
        imageExtent: [-180, -90, 180, 90]
      }
      Object.assign(opts, _opts)
      var imageLayer = new ol.layer.Image({
        source: new ol.source.ImageStatic({
          url: opts.url,
          // projection: opts.projection,
          imageExtent: ol.proj.transformExtent(opts.imageExtent, 'EPSG:4326', 'EPSG:3857')
        })
      })
      this._map.addLayer(imageLayer)
      return imageLayer
    },
    /**
     * 创建google底图
     */
    createGoogleLayer: function () {
      this._gmapLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2sen-US!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
        })
      })
      this._gmapLayer.setZIndex(-100000)
      this.addNucLayer(this._gmapLayer)
    },
    /**
     * 创建离线图层
     *
     * @param options
     * @returns {ol.layer.Tile}
     */
    createOffLineLayer: function (options) {
      var layer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          attributions: [options.attribution],
          url: options.url,
          tilePixelRatio: options.tilePixelRatio, // THIS IS IMPORTANT
          minZoom: options.mapMinZoom,
          maxZoom: options.mapMaxZoom
        })
      })
      this._map.addLayer(layer)
      return layer
    },
    /**
     * 根据坐标集合获取范围
     *
     * @param coods
     *            坐标集合
     */
    getBoundExtent: function (coods) {
      return ol.extent.boundingExtent(coods)
    },
    /**
     * 返回extent的中心位置
     * center为坐标数组
     */
    getNucCenter : function(extent){
      return ol.extent.getCenter(extent)
    },
    /**
     * 创建元素类型
     *
     * @param _opts
     */
    createMarkerStyle: function (_opts) {
      var opts = {
        src: 'css/default/images/alarm.gif',
        scale: 1,
        align: 'center', // 文字位置Text alignment. Possible values: 'left',
        baseline: 'middle', // Possible values: 'bottom', 'top', 'middle',
        font: '12px serif', // Font style as CSS 'font' value
        text: '', // 文字内容
        fillColor: '#0000ff', // '#004198',//文字颜色
        strokeColor: '#fff', // 文字边界颜色
        strokeWidth: 0, // 文字边界宽度
        offsetX: -10, // 水平方向文字偏移 Horizontal text offset in pixels. A
        offsetY: 15, // 竖向文字偏移 Vertical text offset in pixels. A positive
        rotation: 0,
        backgroundFill: "rgba(42,44,82,0)",
        padding:[0, 10, 0, 10],
        backgroundStroke:"rgba(42,44,82,0)"
      }
      Object.assign(opts, _opts)
      var txtStyle = new ol.style.Text({
        textAlign: opts.align,
        textBaseline: opts.baseline,
        font: opts.font,
        text: opts.text,
        fill: new ol.style.Fill({
          color: opts.fillColor
        }),
        stroke: new ol.style.Stroke({
          color: opts.strokeColor,
          width: opts.strokeWidth
        }),
        backgroundFill: new ol.style.Fill({
          color: opts.backgroundFill
        }),
        backgroundStroke: new ol.style.Stroke({
          // lineCap: "butt",
          // lineJoin: "round",
          color: opts.backgroundStroke,
          width:0.5
        }),
        offsetX: opts.offsetX,
        offsetY: opts.offsetY,
        rotation: 0,
        padding: opts.padding
      })
      // 创建点图层样式
      var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
          src: opts.src,
          rotation: getRad(opts.rotation),
          scale: opts.scale
        })),
        text: txtStyle
      })
      return iconStyle
    },
    setLayerZIndex (layer, index) {
      if (layer) {
        layer.setZIndex(index)
      }
    },
    /**
     * 创建google街道底图
     */
    changeGoogleRoadMap() {
      if(this._satellitelayer){
        this.setNucVisible(this._satellitelayer,false)
        //this._satellitelayer.setZIndex(-100000)
      }
      if(this._gmapLayer){
        this.setNucVisible(this._gmapLayer,true)
        this._gmapLayer.setZIndex(-99999)
      }else{
        this._gmapLayer = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://mt2.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i427129704!3m8!2sen!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425!23i1358757'
          })
        })
        this._gmapLayer.setZIndex(-100000)
        this.addNucLayer(this._gmapLayer)
      }  
    },
    /**
     * 创建google卫星底图
     */
    changeGoogleSatelliteMap() {
      if(this._gmapLayer){
        this.setNucVisible(this._gmapLayer,false)
        //this._gmapLayer.setZIndex(-100000)
      } 
      if(this._satellitelayer){
        this.setNucVisible(this._satellitelayer,true)
        this._satellitelayer.setZIndex(-99999)
      }else{
        this._satellitelayer = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'http://mt2.google.cn/vt/lyrs=y&hl=en-US&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'
          })
        })
        this._satellitelayer.setZIndex(-99999)
        this.addNucLayer(this._satellitelayer)
      }
    },
    addFullMap(css) {
      this._map.addControl(new ol.control.FullScreen({
        className: css
      }))
    },
    /**
     * 创建线样式
     *
     * @param _opts
     */
    createLineStyle: function (_opts) {
      var opts = {
        fillcolor: '#00ff00',
        strokecolor: 'rgba(0, 255, 0, 0.4)',
        strokewidth: 2
      }
      Object.assign(opts, _opts)
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: opts.fillcolor
        }),
        stroke: new ol.style.Stroke({
          color: opts.strokecolor,
          width: opts.strokewidth
        })
      })
    },
    /**
     * 创建多边形样式
     *
     * @param _opts
     */
    createPolygonStyle: function (_opts) {
      var opts = {
        fillcolor: 'rgba(255,255,255,0.3)',
        strokecolor: '#ffcc33',
        strokewidth: 2
      }
      Object.assign(opts, _opts)
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: opts.fillcolor
        }),
        stroke: new ol.style.Stroke({
          color: opts.strokecolor,
          width: opts.strokewidth
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#ffcc33'
          })
        })
      })
    },
    /**
     * 元素赋样式
     *
     * @param style
     * @param feature
     */
    setStyle2Feature: function (style, feature) {
      feature.setStyle(style)
    },
    setFeatureImge: function (fea, src) {
      if (src && fea) {
        var style = fea.getStyle().getImage()
        var styleImage = new ol.style.Icon({
          src: src,
          rotation: getRad(style.getRotation()),
          scale: style.getScale()
        })
        fea.getStyle().setImage(styleImage)
        fea.setStyle(fea.getStyle())
      }
    },
    /**
     * 创建圆
     *
     * @param centerlng中心点经度
     * @param centerlat
     *            中心点纬度
     * @param radius
     *            半径
     */
    createCircle: function (centerlng, centerlat, radius) {
      if (isNotEmpty(centerlng) && isNotEmpty(centerlat)) {
        // var circlegeo = new ol.geom.Circle([centerlng,centerlat],radius);
        // var wgs84Sphere = new ol.Sphere(6378137)
        // var center = ol.proj .fromLonLat([ centerlng, centerlat ])
        var circle = new ol.geom.Circle(ol.proj.transform([centerlng,
          centerlat], 'EPSG:4326', 'EPSG:3857'), radius, 'XY')
        // var circularPolygon = ol.geom.Polygon.circular(wgs84Sphere, center, radius, 64)
        return new ol.Feature({
          geometry: circle
        })
      }
    },
    /**
     * 创建覆盖物
     *
     * @param _opts
     * @returns {ol.Overlay}
     */
    createOverlay: function (_opts) {
      var opts = {
        positioning: 'bottom-center',
        domId: 'domId'
      }
      Object.assign(opts, _opts)
      var overlay = new ol.Overlay({
        element: opts.dom,
        positioning: opts.positioning
      })
      overlay.setMap(this._map)
      return overlay
    },
    /**
     * 隐藏overlay
     */
    removeOverlays: function (overlays) {
      for (var int = 0; int < overlays.length; int++) {
        overlays[int].setMap(null)
      }
    },
    /**
     * 覆盖物位置变化
     */
    setOverlaysPostion: function (overlay, lng, lat) {
      var position = ol.proj.fromLonLat([lng, lat])
      overlay.setPosition(position)
    },
    /**
     * 创建marker点
     *
     * @param _opts
     * @returns
     */
    createMarker: function (_opts) {
      var opts = {
        src: 'css/default/images/alarm.gif',
        rotation: 0,
        scale: 1
      }
      Object.assign(opts, _opts)
      var iconStyle = this.createMarkerStyle(opts)
      var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([opts.lng, opts.lat]))
      })
      if (opts.attr) {
        iconFeature.set('attr', opts.attr)
      }
      iconFeature.setStyle(iconStyle)
      return iconFeature
    },
    /**
     * 创建线元素
     *
     * @param _opts
     * @returns {gr.http://www.opengis.net/wfs.Feature}
     */
    createNucline: function (_opts) {
      var opts = {
        // 线坐标集合默认值
        paths: [],
        // 填充颜色 暂时没用
        fillcolor: '#00ff00',
        // 边界颜色默认值
        strokecolor: 'rgba(0, 255, 0, 0.4)',
        // 边界宽度默认值
        strokewidth: 2
      }
      Object.assign(opts, _opts)
      var paths = []
      // 若为墨卡托投影 需要转换
      opts.paths.forEach(function (value) {
        paths.push(ol.proj.fromLonLat([value[0] || value.lng, value[1] || value.lat]))
      })
      var featureLine1 = new ol.Feature({
        geometry: new ol.geom.LineString(paths)
      })
      if (opts.attr) {
        featureLine1.set('attr', opts.attr)
      }
      // 创建线样式
      var lineStyle = this.createLineStyle(opts)
      featureLine1.setStyle(lineStyle)
      return featureLine1
    },
    /**
     * 创建多边形
     */
    createNucPolygon: function (_opts) {
      var opts = {
        // 多边形坐标集合
        paths: [],
        // 填充颜色默认值
        fillcolor: '#00ff00',
        // 边框颜色默认值
        strokecolor: 'rgba(0, 255, 0, 0.4)',
        // 边框宽度默认值
        strokewidth: 2
      }
      Object.assign(opts, _opts)
      var paths = []
      var polygon
      opts.paths.forEach(function (value) {
        paths.push([value.lng, value.lat])
      })
      // 若为墨卡托投影 需要转换
      polygon = new ol.Feature({
        geometry: new ol.geom.Polygon([paths]).transform('EPSG:4326', 'EPSG:3857')
      })
      if (opts.attr) {
        polygon.set('attr', opts.attr)
      }
      // 创建多边形样式
      var Style = this.createPolygonStyle(opts)
      polygon.setStyle(Style)
      return polygon
    },
    /**
     * 创建文字样式
     *
     * @param _opts
     * @returns {xj}
     */
    createTextStyle: function (_opts) {
      var opts = {
        align: 'center', // 文字位置Text alignment. Possible values: 'left',
        // 'right', 'center', 'end' or 'start'. Default is
        // 'start'.
        baseline: 'middle', // Possible values: 'bottom', 'top', 'middle',
        // 'alphabetic', 'hanging', 'ideographic'.
        // Default is 'alphabetic'.
        font: '16px serif', // Font style as CSS 'font' value
        text: 'undefined', // 文字内容
        fillColor: '#004198', // '#004198',//文字颜色
        strokeColor: '#fff', // 文字边界颜色
        strokeWidth: 0, // 文字边界宽度
        offsetX: -10, // 水平方向文字偏移 Horizontal text offset in pixels. A
        // positive will shift the text right. Default is 0.
        offsetY: 15, // 竖向文字偏移 Vertical text offset in pixels. A positive
        // will shift the text down. Default is 0.
        rotation: 0
        // 旋转角度 Rotation in radians (positive rotation clockwise). Default is 0.
      }
      Object.assign(opts, _opts)
      return new ol.style.Text({
        textAlign: opts.align,
        textBaseline: opts.baseline,
        font: opts.font,
        text: opts.text,
        fill: new ol.style.Fill({
          color: opts.fillColor
        }),
        stroke: new ol.style.Stroke({
          color: opts.strokeColor,
          width: opts.strokeWidth
        }),
        offsetX: opts.offsetX,
        offsetY: opts.offsetY,
        rotation: opts.rotation
      })
    },
    /**
     * 创建弹出框
     *
     * @param _opts
     */
    createPopup: function (_opts) {
      var opts = {
        autoPanAnimation: 250, // 自动偏移时间
        positioning: 'center-center', // 显示位置
        domId: 'domId', // 弹出框div的id
        closedomId: 'closedomId' // 弹出框关闭按钮
      }
      Object.assign(opts, _opts)
      var pop_container = document.getElementById(opts.domId)
      var pop_closer = document.getElementById(opts.closedomId)
      var overlay = new ol.Overlay({
        element: pop_container,
        autoPan: true,
        autoPanAnimation: {
          duration: opts.autoPanAnimation
        }
      })
      pop_closer.onclick = function () {
        overlay.setPosition(undefined)
        pop_closer.blur()
        return false
      }
      this._map.addOverlay(overlay)
      return overlay
    },
    /**
     * 获取图层所有元素
     */
    getFeatures: function (layer) {
      if (layer) {
        return layer.getSource().getFeatures()
      }
    },
    /**
     * 获取元素属性
     *
     * @param feature
     */
    getFeatureAttr: function (feature) {
      if (feature) {
        //  'attr'为根据实际情况
        return feature.get('attr')
      }
    },
    // updateRoute (fea, coods) {
    //   var paths = []
    //   if(coods && fea){
    //     fea.getGeometry().getCoordinates().forEach(function (coodinate) {
    //       paths.push(ol.proj.toLonLat(coodinate))
    //     })
    //     paths.push([coods.lng, coods.lat]);
    //     // var featureLine1 = new ol.Feature({
    //     //   geometry: new ol.geom.LineString(paths)
    //     // })
    //     return paths
    //   }
    //   return [];
    // },
    /**
     * 获取元素坐标集合 fea 元素
     */
    getCoodsByFeature: function (fea) {
      var coods = []
      if (!isNotEmpty(fea)) {
        return coods
      }
      // 根据元素类型判断
      if (fea.getGeometry().getType() === 'Point') {
        // 返回点的坐标
        coods = ol.proj.toLonLat(fea.getGeometry().getCoordinates())
        // 线元素
      } else if (fea.getGeometry().getType() === 'LineString') {
        fea.getGeometry().getCoordinates().forEach(function (coodinate) {
          coods.push(ol.proj.toLonLat(coodinate))
        })
        // 多边形元素
      } else if (fea.getGeometry().getType() === 'Polygon') {
        // 多边形有可能会有很多块组成 首先遍历循环多边形个数
        fea.getGeometry().getCoordinates().forEach(function (coodinate) {
          // 然后遍历循环每个多边形的元素集合
          coodinate.forEach(function (cood) {
            coods.push(ol.proj.toLonLat(cood))
          })
        }) // 圆
      } else if (fea.getGeometry().getType() === 'Circle') {
        // 圆相对特殊 获取的是中心点和半径
        coods = ol.proj.toLonLat(fea.getGeometry().getCenter())
        // var radius = fea.getGeometry().getRadius()
      }
      return coods
    },
    /**
     * 添加图层（离线||在线）
     *
     * @param layer
     */
    addNucLayer: function (layer) {
      this._map.addLayer(layer)
    },
    /**
     * 创建报警点gifmarker
     *
     * @param _opts
     */
    createAlarmGifMarker: function (_opts) {
      var opts = {
        src: 'css/default/images/alarm.gif',
        rotation: 0,
        scale: 1
      }
      Object.assign(opts, _opts)
      var div = document.createElement('div')
      div.id = opts.domId
      div.setAttribute('class', 'dot')
      document.getElementById('omapId').appendChild(div)
      document.getElementById(opts.domId).innerHTML = '<div class="dot2"><div class="dot3"></div></div>'
      var pos = ol.proj.fromLonLat([opts.lng, opts.lat])
      var overlay = new ol.Overlay({
        // 给每一个overlay赋值dom元素
        position: pos,
        element: document.getElementById(opts.domId),
        positioning: 'center-center'
      })
      // 给dom元素附属性
      if (opts.attr) {
        overlay.set('attr', opts.attr)
      }
      this._map.addOverlay(overlay)
      // overlay.setMap(this._map)
      // var position = ol.proj.fromLonLat([ opts.lng, opts.lat ])
      // overlay.setPosition(position)
      document.getElementById(opts.domId).onclick = function (evt) {
        // var overs = window.omap.getOverlays().getArray()
        // var coordinate = window.omap.getEventCoordinate(evt)
        opts.callback(overlay)
      }
      return overlay
    },
    /**
     * 创建图层
     *
     * @returns {ol.layer.Vector}
     */
    createNucLayer: function () {
      var layer = new ol.layer.Vector()
      this._map.addLayer(layer)
      return layer
    },
    /**
     * 删除a元素
     *
     * @param layer
     * @param feature
     */
    /**
     * 删除图层
     * @param layer
     * @param feature
     */
    removeFeature: function (feature, layer) {
      if (layer.getSource().getFeatures().length > 0 && this.isLayerContainerFea(feature, layer)) {
        layer.getSource().removeFeature(feature)
      }
    },
    /**
     * 判断图层中是否包含该元素
     */
    isLayerContainerFea: function (feature, layer) {
      var features = layer.getSource().getFeatures()
      if (features.length > 0) {
        for (var j = 0; j < features.length; j++) {
          if (features[j] === feature) {
            return true
          }
        }
        return false
      }
    },
    /**
     * 清除图层上的所有marker
     *
     * @param layer
     */
    clearLayerMarkers: function (layer) {
      if (layer.getSource()) {
        var fs = layer.getSource().getFeatures()
        for (var i = 0; i < fs.length; i++) {
          if (fs[i]) {
            layer.getSource().removeFeature(fs[i])
          }
        }
      }
    },
    /**
     * 图层中添加元素
     *
     * @param features
     * @param nuclayer
     */
    addFeatures2Layer: function (features, nuclayer) {
      var featureArr = []
      if (Object.prototype.toString.call(features) === '[object Array]') {
        featureArr = features
      } else {
        featureArr.push(features)
      }
      if (nuclayer.getSource() === null) {
        nuclayer.setSource(new ol.source.Vector({
          features: featureArr
        }))
      } else {
        nuclayer.getSource().addFeatures(featureArr)
      }
    }
  };






  var textFill = new ol.style.Fill({
    color: '#fff'
  })
  var textStroke = new ol.style.Stroke({
    color: 'rgba(0, 0, 0, 0.6)',
    width: 3
  })
  var invisibleFill = new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.01)'
  })

  // 创建聚合
  function NucCluster$(_opts) {
    this._features = null
    this._source = null  // 数据源
    this._clusterSource = null // 聚合图层数据源
    this._currentResolution = 0
    this._maxFeatureCount = 0
    this.feaLength = 0
    this._nucvector = null
    this._feasArr = []
    this._nucMap = new NucMap$()
    this._distance = 20
    this.cluster(_opts)
  }

  NucCluster$.prototype = {
    /**
     * 初始化
     */
    init: function (_opts) {
      var opts = {
        features: [],
        distance: 60
      }
      Object.assign(opts, _opts)
      this._distance = opts.distance
      if (!opts.features) return
      this._features = new Array(opts.features.length)
      this._feasArr = opts.features
      this.feaLength = this._feasArr.length
      for (var i = 0; i < this._feasArr.length; ++i) {
        var coordinates = ol.proj.fromLonLat([this._feasArr[i].lng, this._feasArr[i].lat])
        this._features[i] = new ol.Feature(new ol.geom.Point(coordinates))
        this._features[i].set('attr', this._feasArr[i])
      }
    },
    /**
     * ͨ聚合
     */
    cluster: function (_opts) {
      this.init(_opts)
      this._source = new ol.source.Vector({
        features: this._features
      })
      this._clusterSource = new ol.source.Cluster({
        distance: this._distance,
        source: this._source,
        extent: [116, 40, 117, 41]
      })
      // if(this._nucvector&&this._nucvector.getSource()){
      //   var fs = this._nucvector.getSource().getFeatures()
      //   for (var i = 0; i < fs.length; i++) {
      //     if (fs[i]) {
      //       this._nucvector.getSource().removeFeature(fs[i])
      //     }
      //   }
      //   this._nucvector.setSource(this._clusterSource)
      // } else 
      {
        this._nucvector = new ol.layer.Vector({
          source: this._clusterSource,
          style: this.styleFunction.bind(this)
        })
        window.omap.addLayer(this._nucvector)
      }
    },
    clear: function () {
      window.omap.removeLayer(this._nucvector)
      this._nucvector = null
    },
    createImageLevel(size) {
      var iconsrc
      if (size >= 160) {
        iconsrc = img5
      }
      if (size >= 80 && size < 160) {
        iconsrc = img4
      }
      if (size >= 20 && size < 80) {
        iconsrc = img3
      }
      if (size >= 5 && size < 20) {
        iconsrc = img2
      }
      // if (size>4&&size<1000) iconsrc = "images/m1.png"
      if (size <= 5) {
        iconsrc = img1
      }
      return iconsrc
    },
    /**
     * ���ۺ�Ԫ�ظ���ʽ
     * @param feature
     * @param resolution
     * @returns {*}
     */
    styleFunction: function (feature, resolution) {
      if (resolution !== this._currentResolution) {
        this.calculateClusterInfo(resolution)
        this._currentResolution = resolution
      }
      var style
      var size = feature.get('features').length
      if (size > 1) {
        var iconsrc = this.createImageLevel(size)
        if (!iconsrc) return
        style = new ol.style.Style(
          {
            image: new ol.style.Icon(({
              src: iconsrc,
              rotation: 0,
              scale: 0.6
            })),
            text: new ol.style.Text({
              text: size.toString(),
              fill: textFill,
              stroke: textStroke,
              scale: 0.6
            })
          })
      } else {
        var originalFeature = feature.get('features')[0]
        style = this.createEarthquakeStyle(originalFeature)
      }
      return style
    },
    calculateClusterInfo: function (resolution) {
      this._maxFeatureCount = 0
      var features = this._nucvector.getSource().getFeatures()
      var feature, radius
      for (var i = features.length - 1; i >= 0; --i) {
        feature = features[i]
        var originalFeatures = feature.get('features')
        var extent = ol.extent.createEmpty()
        var j, jj
        for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
          ol.extent.extend(extent, originalFeatures[j].getGeometry()
            .getExtent())
        }
        this._maxFeatureCount = Math.max(this._maxFeatureCount, jj)
        radius = 0.25 * (ol.extent.getWidth(extent) + ol.extent.getHeight(extent)) / resolution
        feature.set('radius', radius)
      }
    },
    addFeature: function (_opts) {
      if (_opts) {
        var coordinates = ol.proj.fromLonLat([_opts.lng, _opts.lat])
        var fea = new ol.Feature(new ol.geom.Point(coordinates))
        fea.set('attr', _opts)
        this.createEarthquakeStyle(fea)
        this._source.addFeatures([fea])
        this._clusterSource.refresh()
      }
    },
    removeFeature: function (_opts) {
      if (_opts) {
        var feaArr = this._source.getFeatures()
        feaArr.forEach(element => {
          var attr = element.get('attr')
          // 判断车辆属性是否相同, 相同则删除该元素，  实际应用中应有唯一标识
          if (Compare(attr.attr, _opts.attr)) {
            this._source.removeFeature(element)
            this._clusterSource.refresh()
          }
        });
      }
    },
    /**
     * ÿ��Ԫ�ظ���ʽ
     * @param feature
     * @returns {*|c|e}
     */
    createEarthquakeStyle: function (feature) {
      var opts = {
        src: '',
        scale: 1,
        align: 'center', // 文字位置Text alignment. Possible values: 'left',
        baseline: 'middle', // Possible values: 'bottom', 'top', 'middle',
        font: '16px serif', // Font style as CSS 'font' value
        text: '', // 文字内容
        fillColor: '#004198', // '#004198',//文字颜色
        strokeColor: '#fff', // 文字边界颜色
        strokeWidth: 0, // 文字边界宽度
        offsetX: -10, // 水平方向文字偏移 Horizontal text offset in pixels. A
        offsetY: 15, // 竖向文字偏移 Vertical text offset in pixels. A positive
        rotation: 0
      }
      var nucMap = new NucMap$()
      var net
      if (feature) {
        net = feature.get('attr') || opts
      }
      var iconStyle = nucMap.createMarkerStyle(net)
      iconStyle.setGeometry(feature.getGeometry())
      return iconStyle
    },
    /**
     * 改变选中元素大小
     *
     * @param feature
     */
    selectStyleFunction: function (feature) {
      var styles = [new ol.style.Style({
        image: new ol.style.Circle({
          radius: feature.get('radius'),
          fill: invisibleFill
        })
      })]
      var originalFeatures = feature.get('features')
      var originalFeature
      if (!isNotEmpty(originalFeatures)) return
      for (var i = originalFeatures.length - 1; i >= 0; --i) {
        originalFeature = originalFeatures[i]
        styles.push(this.createEarthquakeStyle(originalFeature))
      }
      return styles
    }
  }

  var NucHeatLayer$ = function () {
    this._heatLayer = null
  }

  NucHeatLayer$.prototype = {
    heat: function (heatArr) {
      // 创建热力图图层
      this._heatLayer = new ol.layer.Heatmap({
        source: new ol.source.Vector(),
        // 斑点清晰度
        blur: parseInt(10, 20),
        // 半径
        radius: parseInt(20, 10)
      })
      window.omap.addLayer(this._heatLayer)
      for (var i = 0; i < heatArr.length; i++) {
        // 转化为墨卡托坐标
        var coods = ol.proj.fromLonLat([heatArr[i].lng, heatArr[i].lat])
        var feature = new ol.Feature({
          geometry: new ol.geom.Point(coods)
        })
        // 热力图层添加元素
        this._heatLayer.getSource().addFeature(feature)
      }
    },
    //改变模糊度
    setBlur: function (value) {
      this._heatLayer.setBlur(parseInt(value, 10))
    },
    setRadis: function (value) {
      this._heatLayer.setRadius(parseInt(value, 10))
    }
  }



  /**
     * 地球半径
     */
  var EARTHRADIUS = 6370996.81
  /**
   * @exports GeoUtils as OMapLib.GeoUtils
   */
  var OMapLib$ = window.OMapLib$ = OMapLib$ || {};
  var GeoUtils =
    /**
     * GeoUtils类，静态类，勿需实例化即可使用
     * @class GeoUtils类的<b>入口</b>。
     * 该类提供的都是静态方法，勿需实例化即可使用。
     */
    OMapLib$.GeoUtils = function () {
      this.nucMap = new NucMap$()
    }

  /**
   * 判断点是否在矩形内
   * @param {Point} point 点对象
   * @param {Bounds} extent 矩形边界对象
   * @returns {Boolean} 点在矩形内返回true,否则返回false
   */
  GeoUtils.prototype.isPointInRect = function (lng, lat, extent) {
    // 检查类型是否正确
    if (!isNotEmpty(lat) || !isNotEmpty(lng) || !isNotEmpty(extent)) {
      return false
    } else {
      return ol.extent.containsCoordinate(extent, [lng, lat])
    }
  }

  /**
   * 判断点是否在圆形内
   * @param lng,lat 点对象
   * @param {Circle} circle 圆形对象
   * @returns {Boolean} 点在圆形内返回true,否则返回false
   */
  GeoUtils.prototype.isPointInCircle = function (lng, lat, centerlng, centerlat, radius) {
    // 检查类型是否正确
    // 检查类型是否正确
    if (!isNotEmpty(lat) || !isNotEmpty(lng) || !isNotEmpty(centerlng) || !isNotEmpty(centerlat) || !isNotEmpty(radius)) {
      return false
    }
    // point与圆心距离小于圆形半径，则点在圆内，否则在圆外

    var dis = this.getDistance({ lng: lng, lat: lat }, { lng: centerlng, lat: centerlat })
    if (dis <= radius) {
      return true
    } else {
      return false
    }
  }

  /**
   * 判断点是否在折线上
   * @param {Point} point 点对象
   * @param {Polyline} polyline 折线对象
   * @returns {Boolean} 点在折线上返回true,否则返回false
   */
  GeoUtils.prototype.isPointOnPolyline = function (lng, lat, paths) {
    // 检查类型
    //             if (!(point.getGeometry().getType() === "Point" ) ||
    //                  !(polyline.getGeometry().getType() === "LineString")) {
    //                 return false
    //             }

    //             // 首先判断点是否在线的外包矩形内，如果在，则进一步判断，否则返回false
    //             var lineBounds = polyline.getExtent()
    //             if (!this.isPointInRect(point, lineBounds)) {
    //                 return false
    //             }
    if (!isNotEmpty(lat) || !isNotEmpty(lng) || !isNotEmpty(paths)) {
      return false
    }
    // 判断点是否在线段上，设点为Q，线段为P1P2 ，
    // 判断点Q在该线段上的依据是：( Q - P1 ) × ( P2 - P1 ) = 0，且 Q 在以 P1，P2为对角顶点的矩形内
    var pts = paths
    for (var i = 0; i < pts.length - 1; i++) {
      var curPt = pts[i]
      var nextPt = pts[i + 1]
      // 首先判断point是否在curPt和nextPt之间，即：此判断该点是否在该线段的外包矩形内
      if (lng >= Math.min(curPt.lng, nextPt.lng) && lng <= Math.max(curPt.lng, nextPt.lng) &&
        lat >= Math.min(curPt.lat, nextPt.lat) && lat <= Math.max(curPt.lat, nextPt.lat)) {
        // 判断点是否在直线上公式
        var precision = (curPt.lng - lng) * (nextPt.lat - lat) - (nextPt.lng - lng) * (curPt.lat - lat)
        if (precision < 2e-10 && precision > -2e-10) { //  实质判断是否接近0
          return true
        }
      }
    }
    return false
  }

  /**
   * 判断点是否多边形内
   * @param {Point} point 点对象
   * @param {Polyline} polygon 多边形对象
   * @returns {Boolean} 点在多边形内返回true,否则返回false
   */
  GeoUtils.prototype.isPointInPolygon = function (lng, lat, paths) {
    // 检查类型
    if (!isNotEmpty(lat) || !isNotEmpty(lng) || !isNotEmpty(paths)) {
      return false
    }

    var pts = paths // 获取多边形点

    // 下述代码来源：http:// paulbourke.net/geometry/insidepoly/，进行了部分修改
    // 基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
    // 在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。

    var N = pts.length
    var boundOrVertex = true // 如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
    var intersectCount = 0 // cross points count of x
    var precision = 2e-10 // 浮点类型计算时候与0比较时候的容差
    var p1, p2 // neighbour bound vertices
    var p = { lng: lng, lat: lat } // 测试点

    p1 = pts[0] // left vertex
    for (var i = 1; i <= N; ++i) { //  check all rays
      p2 = pts[i % N] // right vertex
      if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) { //  ray is outside of our interests
        p1 = p2
        continue // next ray left point
      }
      if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) { //  ray is crossing over by the algorithm (common part of)
        if (p.lng <= Math.max(p1.lng, p2.lng)) { //  x is before of ray
          if (p1.lat === p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) { //  overlies on a horizontal ray
            return boundOrVertex
          }
          if (p1.lng === p2.lng) { //  ray is vertical
            if (p1.lng === p.lng) { //  overlies on a vertical ray
              return boundOrVertex
            } else { //  before ray
              ++intersectCount
            }
          } else { //  cross point on the left side
            var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng // cross point of lng

            if (Math.abs(p.lng - xinters) < precision) { //  overlies on a ray
              return boundOrVertex
            }

            if (p.lng < xinters) { //  before ray
              ++intersectCount
            }
          }
        }
      } else { //  special case when ray is crossing through the vertex
        if (p.lat === p2.lat && p.lng <= p2.lng) { //  p crossing over p2
          var p3 = pts[(i + 1) % N] // next vertex

          if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) { //  p.lat lies between p1.lat & p3.lat
            ++intersectCount
          } else {
            intersectCount += 2
          }
        }
      }
      p1 = p2 // next ray left point
    }

    if (intersectCount % 2 === 0) { //  偶数在多边形外
      return false
    } else { // 奇数在多边形内
      return true
    }
  }

  /**
   * 将度转化为弧度
   * @param {degree} Number 度
   * @returns {Number} 弧度
   */
  GeoUtils.prototype.degreeToRad = function (degree) {
    return Math.PI * degree / 180
  }

  /**
   * 将弧度转化为度
   * @param {radian} Number 弧度
   * @returns {Number} 度
   */
  GeoUtils.prototype.radToDegree = function (rad) {
    return (180 * rad) / Math.PI
  }

  /**
   * 将v值限定在a,b之间，纬度使用
   */
  function _getRange(v, a, b) {
    if (a !== null) {
      v = Math.max(v, a)
    }
    if (b !== null) {
      v = Math.min(v, b)
    }
    return v
  }

  /**
   * 将v值限定在a,b之间，经度使用
   */
  function _getLoop(v, a, b) {
    while (v > b) {
      v -= b - a
    }
    while (v < a) {
      v += b - a
    }
    return v
  }

  /**
   * 计算两点之间的距离,两点坐标必须为经纬度
   * @param {point1} Point 点对象
   * @param {point2} Point 点对象
   * @returns {Number} 两点之间距离，单位为米
   */
  GeoUtils.prototype.getDistance = function (point1, point2) {
    // 判断类型
    if (!isNotEmpty(point1) || !isNotEmpty(point2)) {
      return 0
    }
    point1.lng = _getLoop(point1.lng, -180, 180)
    point1.lat = _getRange(point1.lat, -74, 74)
    point2.lng = _getLoop(point2.lng, -180, 180)
    point2.lat = _getRange(point2.lat, -74, 74)

    var x1, x2, y1, y2
    x1 = this.degreeToRad(point1.lng)
    y1 = this.degreeToRad(point1.lat)
    x2 = this.degreeToRad(point2.lng)
    y2 = this.degreeToRad(point2.lat)

    return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)))
  }

  /**
   * 计算折线或者点数组的长度
   * @param {Polyline|Array<Point>} polyline 折线对象或者点数组
   * @returns {Number} 折线或点数组对应的长度
   */
  GeoUtils.prototype.getPolylineDistance = function (polyline) {
    // 检查类型
    var totalDis = 0
    if (polyline instanceof Array || polyline.getGeometry().getType() === 'LineString') {
      // 将polyline统一为数组
      var pts
      // 遍历所有线段将其相加，计算整条线段的长度
      if (polyline instanceof Array) {
        pts = polyline
        if (pts.length < 2) { //  小于2个点，返回0
          return 0
        }
        for (var i = 0; i < pts.length - 1; i++) {
          var curPt = { lng: pts[i].lng, lat: pts[i].lat }
          var nextPt = { lng: pts[i + 1].lng, lat: pts[i + 1].lat }
          var dis = this.getDistance(curPt, nextPt)
          totalDis += dis
        }
      } else if (polyline.getGeometry().getType() === 'LineString') {

        pts = this.nucMap.getCoodsByFeature(polyline)// polyline.getCoordinates()
        if (pts.length < 2) { //  小于2个点，返回0
          return 0
        }
        for (var i = 0; i < pts.length - 1; i++) {
          var curPt = { lng: pts[i][0], lat: pts[i][1] }
          var nextPt = { lng: pts[i + 1][0], lat: pts[i + 1][1] }
          var dis = this.getDistance(curPt, nextPt)
          totalDis += dis
        }
      }
      return totalDis
    } else {
      return 0
    }
  }

  /**
   * 计算多边形面或点数组构建图形的面积,注意：坐标类型只能是经纬

   度，且不适合计算自相交多边形的面积
   * @param {Polygon|Array<Point>} polygon 多边形面对象或者点数

   组
   * @returns {Number} 多边形面或点数组构成图形的面积
   */
  GeoUtils.prototype.getPolygonArea = function (polygon) {
    // 检查类型

    var pts = []
    if (polygon instanceof Array) {
      pts = polygon
    } else if (polygon.getGeometry().getType() === 'Polygon') {
      var coods = this.nucMap.getCoodsByFeature(polygon)//
      coods.forEach((value) => {
        pts.push({
          lng: value[0],
          lat: value[1]
        })
      })
    } else {
      return 0
    }

    if (pts.length < 3) { //  小于3个顶点，不能构建面
      return 0
    }

    var totalArea = 0 // 初始化总面积
    var LowX = 0.0
    var LowY = 0.0
    var MiddleX = 0.0
    var MiddleY = 0.0
    var HighX = 0.0
    var HighY = 0.0
    var AM = 0.0
    var BM = 0.0
    var CM = 0.0
    var AL = 0.0
    var BL = 0.0
    var CL = 0.0
    var AH = 0.0
    var BH = 0.0
    var CH = 0.0
    var CoefficientL = 0.0
    var CoefficientH = 0.0
    var ALtangent = 0.0
    var BLtangent = 0.0
    var CLtangent = 0.0
    var AHtangent = 0.0
    var BHtangent = 0.0
    var CHtangent = 0.0
    var ANormalLine = 0.0
    var BNormalLine = 0.0
    var CNormalLine = 0.0
    var OrientationValue = 0.0
    var AngleCos = 0.0
    var Sum1 = 0.0
    var Sum2 = 0.0
    var Count2 = 0
    var Count1 = 0
    var Sum = 0.0
    var Radius = EARTHRADIUS // 6378137.0,WGS84椭球半径
    var Count = pts.length
    for (var i = 0; i < Count; i++) {
      if (i === 0) {
        LowX = pts[Count - 1].lng * Math.PI / 180
        LowY = pts[Count - 1].lat * Math.PI / 180
        MiddleX = pts[0].lng * Math.PI / 180
        MiddleY = pts[0].lat * Math.PI / 180
        HighX = pts[1].lng * Math.PI / 180
        HighY = pts[1].lat * Math.PI / 180
      } else if (i === Count - 1) {
        LowX = pts[Count - 2].lng * Math.PI / 180
        LowY = pts[Count - 2].lat * Math.PI / 180
        MiddleX = pts[Count - 1].lng * Math.PI / 180
        MiddleY = pts[Count - 1].lat * Math.PI / 180
        HighX = pts[0].lng * Math.PI / 180
        HighY = pts[0].lat * Math.PI / 180
      } else {
        LowX = pts[i - 1].lng * Math.PI / 180
        LowY = pts[i - 1].lat * Math.PI / 180
        MiddleX = pts[i].lng * Math.PI / 180
        MiddleY = pts[i].lat * Math.PI / 180
        HighX = pts[i + 1].lng * Math.PI / 180
        HighY = pts[i + 1].lat * Math.PI / 180
      }
      AM = Math.cos(MiddleY) * Math.cos(MiddleX)
      BM = Math.cos(MiddleY) * Math.sin(MiddleX)
      CM = Math.sin(MiddleY)
      AL = Math.cos(LowY) * Math.cos(LowX)
      BL = Math.cos(LowY) * Math.sin(LowX)
      CL = Math.sin(LowY)
      AH = Math.cos(HighY) * Math.cos(HighX)
      BH = Math.cos(HighY) * Math.sin(HighX)
      CH = Math.sin(HighY)
      CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL)
      CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH)
      ALtangent = CoefficientL * AL - AM
      BLtangent = CoefficientL * BL - BM
      CLtangent = CoefficientL * CL - CM
      AHtangent = CoefficientH * AH - AM
      BHtangent = CoefficientH * BH - BM
      CHtangent = CoefficientH * CH - CM
      AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent))
      AngleCos = Math.acos(AngleCos)
      ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent
      BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent)
      CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent
      if (AM !== 0) {
        OrientationValue = ANormalLine / AM
      } else if (BM !== 0) {
        OrientationValue = BNormalLine / BM
      } else {
        OrientationValue = CNormalLine / CM
      }
      if (OrientationValue > 0) {
        Sum1 += AngleCos
        Count1++
      } else {
        Sum2 += AngleCos
        Count2++
      }
    }
    var tempSum1
    var tempSum2
    tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2)
    tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2
    if (Sum1 > Sum2) {
      if ((tempSum1 - (Count - 2) * Math.PI) < 1) {
        Sum = tempSum1
      } else {
        Sum = tempSum2
      }
    } else {
      if ((tempSum2 - (Count - 2) * Math.PI) < 1) {
        Sum = tempSum2
      } else {
        Sum = tempSum1
      }
    }
    totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius
    return totalArea // 返回总面积
  }


  var PI = Math.PI
  function getRad(d) {
    return d * PI / 180.0
  }
  /**
   * 轨迹回放
   */
  function NucTrack$() {
    this._marker = null
    this._currentCount = 0 //记录当前点的位置
    this._count = 0 // 记录轨迹线点集合的长度
    this._intervalFlag = null
    this._nucMap = new NucMap$()
    this._trackLine = null
    this._lineCoordinates = []
    this._trackLineLayer = new ol.layer.Vector()
    this._speed = 1000
    this._caricon = car
    this._isZoomMap = false
    this._callbackObj = {}
    this._percent = "" 
    this._extentArr = []
  }
  //清除轨迹
  NucTrack$.prototype.toPercent = function () {
    return (((this._currentCount + 1) / this._count) * 100).toFixed(2) + '%';
  }
  //清除轨迹
  NucTrack$.prototype.clearTrack = function () {
    this.clearInterval()
    if (this._trackLine &&  this._trackLineLayer.getSource().getFeatures().length > 0) {
      this._trackLineLayer.getSource().removeFeature(this._trackLine)
    }
    if (this._marker &&  this._trackLineLayer.getSource().getFeatures().length > 0) {
      this._trackLineLayer.getSource().removeFeature(this._marker)
    }
  }
  //改变间隔时间
  NucTrack$.prototype._setSpeed = function (speed) {
    if (speed) {
      this._speed = speed
    }
  }
  //清除轨迹
  NucTrack$.prototype.addMarker = function (_opts) {
    var opts = {
      src: this._caricon,
      rotation: 0,
      scale: 0.8
    }
    Object.assign(opts, _opts)
    var marker = this._nucMap.createMarker(opts)
    return marker
  }
  NucTrack$.prototype._setMarker = function (pos) {
    if (pos) {
      let geometry = new ol.geom.Point(ol.proj.fromLonLat([pos.lng, pos.lat]))
      this._marker.setGeometry(geometry)
      let rotation = pos.rotation - 90 || 0
      this._marker.getStyle().getImage().setRotation(getRad(rotation))
      this._marker.set(ATTR, pos.attr)
    }
  }
  // 添加轨迹线条
  NucTrack$.prototype.addLineTrack = function (pointsArr, carIcon) {
    this._caricon = carIcon
    this._count = pointsArr.length
    this._nucMap._map = window.omap
    if (pointsArr) {
      this._lineCoordinates = []
      this._extentArr = []
      for (var i = 0; i < pointsArr.length; i++) {
        var point = pointsArr[i];
        if (point) {
          this._lineCoordinates.push({ lng: point.lng || point[0], lat: point.lat || point[1], rotation: point.direction || point[3], attr: point });
          this._extentArr.push([point.lng || point[0], point.lat || point[1]])
        }
      }
      // 添加车辆图标
      this._marker = this.addMarker({
        lng: this._lineCoordinates[0].lng,
        lat: this._lineCoordinates[0].lat,
        rotation: this._lineCoordinates[0].rotation || 0,
        attr: this._lineCoordinates[0].attr
      })
      // 创建线元素图层，用于加载线元素
      var lineOpts = {
        // 线元素坐标集合
        paths: this._lineCoordinates,
        // 线填充颜色
        fillcolor: 'blue', // blue || '#ff0000' ||rgba(237, 212, 0, 0.7)
        // 线颜色
        strokecolor: 'rgba(0, 0, 255, 0.7)',
        // 线宽度
        strokewidth: 3
      }
      // 创建线
      this._trackLine = this._nucMap.createNucline(lineOpts)
      this._setBestView(this._extentArr)
      this._nucMap.addNucLayer(this._trackLineLayer)
      this._nucMap.addFeatures2Layer(this._trackLine, this._trackLineLayer)
      this._nucMap.addFeatures2Layer(this._marker, this._trackLineLayer)
    }
  }
  // 轨迹回放线路最佳视角
  NucTrack$.prototype._setBestView = function (extentArr) {
    let extent =  this._nucMap.getBoundExtent(extentArr)
    this._nucMap.fitView({ extent:extent })
  }
  NucTrack$.prototype._move = function (callback) {
    let pos = this._lineCoordinates[this._currentCount]
    this._setMarker(pos)
    if(this._isZoomMap){
      // let extent =  this._nucMap.getBoundExtent([])
      this._nucMap.setCenter([ pos.lng ||pos[0],pos.lat ||pos[1] ])
    }
    if (callback) {
      this._callbackObj = {}
      this._callbackObj.property = this._nucMap.getFeatureAttr(this._marker)
      this._callbackObj.percent = this.toPercent()
      callback(this._callbackObj)
    }
    this._currentCount++
  }
  NucTrack$.prototype._getCount = function () {
    return this._currentCount
  }
  // 轨迹回放开始
  NucTrack$.prototype.play = function (callback) {
    this.clearInterval()
    this._intervalFlag = window.setInterval(function () {
      // 两点之间当前位置大于等于总路线长度的时候，则说明已经完成移动
      if (this._currentCount >= this._count) {
        clearInterval(this._intervalFlag)
        // this._currentCount = 0
      } else {
        this._move(callback)
      }
    }.bind(this), this._speed);
  }
  // 回退操作
  NucTrack$.prototype.stepback = function (callback) {
    this.clearInterval()
    this._currentCount --
    this._intervalFlag = window.setInterval(function () {
      // 两点之间当前位置大于等于总路线长度的时候，则说明已经完成移动
      if ( 0 > this._currentCount) {
        clearInterval(this._intervalFlag)
        // this._currentCount = this._count
      } else {
        this._backmove(callback)
      }
    }.bind(this), this._speed);
  }
  NucTrack$.prototype._backmove = function (callback) {
    let pos = this._lineCoordinates[this._currentCount]
    this._setMarker(pos)
    if(this._isZoomMap){
      // let extent =  this._nucMap.getBoundExtent([])
      this._nucMap.setCenter([ pos.lng ||pos[0],pos.lat ||pos[1] ])
    }
    if (callback) {
      this._callbackObj = {}
      this._callbackObj.property = this._nucMap.getFeatureAttr(this._marker)
      this._callbackObj.percent = this.toPercent()
      callback(this._callbackObj)
    }
    this._currentCount --
  }
  NucTrack$.prototype.clearInterval = function () {
    clearInterval(this._intervalFlag)
  }
  // 轨迹回放暂停之后续播
  NucTrack$.prototype.continuePlay = function (callback) {
    this.clearInterval()
    this.play(callback)
  }
  // 暂停
  NucTrack$.prototype.pause = function () {
    this.clearInterval()
  }
  // 停止车辆复位
  NucTrack$.prototype.stop = function () {
    this.clearInterval()
    this._currentCount = 0
    let pos = this._lineCoordinates[0]
    // 添加车辆图标
    this._setMarker(pos)
  }
  // 加速
  NucTrack$.prototype.fast = function (speed, isForward, isPlay, callback) {
    this.clearInterval()
    this._speed = 1000;
    // 添加车辆图标
    this._setSpeed(this._speed / speed)
    if (isPlay) {
      if (isForward) {
        this.play(callback)
      } else {
        this.stepback(callback)
      }
    }
  }
  // 减速
  NucTrack$.prototype.slow = function (speed, isForward, isPlay, callback) {
    this.clearInterval()
    // 添加车辆图标
    this._speed = 1000;
    this._setSpeed(this._speed * speed)
    if (isPlay) {
      if (isForward) {
        this.play(callback)
      } else {
        this.stepback(callback)
      }
    }
  }
  // 回退
  NucTrack$.prototype.back = function (callback) {
    this.clearInterval()
    // 添加车辆图标
    // this._speed = 1000;
    this._setSpeed(this._speed )
    this.stepback(callback)
  }
  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
  };
// 元素编辑
var NucModify = function NucModify$(_NucMap) {
  inherits(NucModify, _NucMap)
  function NucModify(opts) {
    this._modifyLayer = null
    this._modify = null
    this._modifySource = null // 
    this._snap = null // 
    this._map = null
    this._dragCoods = null
    this.init(opts)
  }
  NucModify.prototype.init = function (opts) {
    this._modifySource = new ol.source.Vector()
    this._snap = new ol.interaction.Snap({ source: this._modifySource });
    this._modify = new ol.interaction.Modify({
      source: this._modifySource
    })
    this._modifyLayer = new ol.layer.Vector({
      source: this._modifySource,
      style: draw_style
    });
    this._map = this.getMap()
    if (this._map) {
      this._map.addInteraction(this._snap)
      this._map.addInteraction(this._modify)
      this._map.addLayer(this._modifyLayer)
      // 新建元素编辑组件
      if (isNotEmpty(opts) && opts.mondifyback) {
        // 编辑结束，获取坐标信息，对坐标进行保存，与数据库交互，关闭此次编辑状态
        this._modify.on('modifyend', function (event) {
          var coordinate = ol.proj.toLonLat(event.mapBrowserEvent.coordinate)
          this._dragCoods = coordinate
          var feas = event.features.getArray()
          // 关闭编辑工具
          // modify.setActive(false);
          // 返回编辑的第一个元素
          return opts.mondifyback(feas[0])
        }.bind(this))
      }
    }
  }
  // 清除编辑图层
  NucModify.prototype.getDragCoords = function () {
    if(this._dragCoods){
      return this._dragCoods
    }
    return null
  }
  // 清除编辑图层
  NucModify.prototype.clearFeature = function () {
    if(this._modifyLayer){
      this.clearLayerMarkers(this._modifyLayer)
      //this._modifyLayer.getSource().removeFeature(fea)
    }
  }
  NucModify.prototype.featureToModify = function (fea) {
    if (fea) {
      var feaStyle = fea.getGeometry().getType()
      if (feaStyle === 'Point') {
        if (fea.getStyle()) {
          var iconsrc = fea.getStyle().getImage().getSrc()
          var scale = fea.getStyle().getImage().getScale()
          var style = new ol.style.Style({
            image: new ol.style.Icon({
              src: iconsrc,
              scale: scale
            }),
            zIndex: 100000
          })
          fea.setStyle(style)
        } else {

        }
      } else {
        if(feaStyle === 'LineString'){
          var style = fea.getStyle()
          var feaStyle = fea.getGeometry().getType()
          fea.setStyle(style ? style : styles[feaStyle])
        }else{
          fea.setStyle(styles[feaStyle])
        }
      }
      this._modifyLayer.getSource().addFeature(fea)
    }
  }
  return NucModify;
}(NucMap$)

var NucDraw = function NucDraw$(_NucMap) {
  inherits(NucDraw, _NucMap)
  function NucDraw(opts) {
    this._typeArr = ['Point', 'Polygon', 'Circle', 'LineString']
    this._drawSource = null
    this._draw // 
    this._drawLayer = null
    this._snap = null // 
    this._map = null
    this.init(opts)
    if(opts.mondifyback){
      this._nucModify = new NucModify({
        mondifyback: opts.mondifyback
      })
    }
  }
  NucDraw.prototype.init = function (_opts) {
    this._map = this.getMap()
    this._map.removeInteraction(this._draw);
    var opts = {
      type: 'Point',
      style: ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: [0, 0, 255, 0.6]
          })
        })
      }),
      callback: null
    }

    Object.assign(opts, _opts)

    //  每次绘制之前
    // this._map.removeInteraction(draw)
    if (!(this._typeArr.indexOf(opts.type) >= 0)) {
      return null
    }
    if (isNotEmpty(this._drawLayer)) {
      this.clearLayerMarkers(this._drawLayer);
    }
    this._drawSource = new ol.source.Vector();
    this._drawLayer = new ol.layer.Vector({
      source: this._drawSource,
      style: draw_style
    })
    var stylePt = null
    if (opts.src) {
      stylePt = new ol.style.Style({
        image: new ol.style.Icon({
          src: opts.src
        }),
        zIndex: 100000
      })
    } else {
      stylePt = new ol.style.Style({
        image: new ol.style.Icon({
          src: "src"
        }),
        zIndex: 100000
      })
    }
    styles['Point'] = stylePt
    //  地图添加该图层
    this._draw = new ol.interaction.Draw({
      source: this._drawSource,
      type: opts.type,
      /** @type {ol.geom.GeometryType} */
      // style: draw_style
    })

    this._map.addInteraction(this._draw)
    this.addNucLayer(this._drawLayer)
    //  若需要回调函数
    if (opts.callback) {
      this._draw.on('drawend', function (event) {
        // if (opts.style) {
        //   event.feature.setStyle(opts.style)
        // }
        opts.callback(event.feature)
        if (opts.mondifyback) {
          this._nucModify.featureToModify(event.feature)
        }
        this._draw.setActive(false)
      }.bind(this))
    }
  }
  // 清除编辑图层
  NucDraw.prototype.clear = function () {
    this.removeNucLayer(this._drawLayer)
    if(this._nucModify){
      this.removeNucLayer(this._nucModify._modifyLayer)
    }
    this.clearAllMapInteraction()
  }
  return NucDraw;
}(NucMap$)


/**
 * Format length output.
 *
 * @param {ol.geom.LineString}
 *            line The line.
 * @return {string} The formatted length.
 */
function formatLength (line) {
  var length = ol.Sphere.getLength(line)
  var output
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km'
  } else {
    output = (Math.round(length * 100) / 100) + ' ' + 'm'
  }
  return output
}

/**
 * Format area output.
 *
 * @param {ol.geom.Polygon}
 *            polygon The polygon.
 * @return {string} Formatted area.
 */
function formatArea (polygon) {
  var area = ol.Sphere.getArea(polygon)
  var output
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>'
  } else {
    output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>'
  }
  return output
}
var NucMeasure = function NucMeasure$(_NucMap) {
  inherits(NucMeasure, _NucMap)
  function NucMeasure(opts) {
    this.sketch = null
    /**
     * The help tooltip element.
     *
     * @type {Element}
     */
    this.helpTooltipElement = null
    
    /**
     * Overlay to show the help messages.
     *
     * @type {ol.Overlay}
     */
    this.helpTooltip = null
    
    /**
     * The measure tooltip element.
     *
     * @type {Element}
     */
    this.measureTooltipElement = null
    
    /**
     * Overlay to show the measurement.
     *
     * @type {ol.Overlay}
     */
    this.measureTooltip = null
    
    /**
     * Message to show when the user is drawing a polygon.
     *
     * @type {string}
     */
    this.continuePolygonMsg = 'Click to continue drawing the polygon'
    
    /**
     * Message to show when the user is drawing a line.
     *
     * @type {string}
     */
    this.continueLineMsg = 'Click to continue drawing the line'
    
    this.draw // global so we can remove it later
    this._map = null
    this.source = null
    this.vector = null
    this._measureToolsArray = []
    //this.__init()
  }
  NucMeasure.prototype.init = function () {   
    this._map = this.getMap()  
    this.source = new ol.source.Vector()
    this.vector = new ol.layer.Vector({
      source: this.source,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 255, 0.3)', // '#ffcc33',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.5)'
          })
        })
      })
    })
    this._map.addLayer(this.vector)
    /**
     * Handle pointer move.
     *
     * @param {ol.MapBrowserEvent}
     *            evt The event.
     */
    // var pointerMoveHandler = function (evt) {
      
    // }.bind(this)
  
    this._map.on('pointermove', this.pointerMoveHandler.bind(this))
  
    this._map.getViewport().addEventListener('mouseout', function () {
      if(this.helpTooltipElement){
        this.helpTooltipElement.classList.add('hidden')
      }
    }.bind(this))
    
  }
  NucMeasure.prototype.pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return
    }
    var helpMsg
    if (sessionStorage.getItem('locale') === 'ru-RU'){
      helpMsg = 'Нажмите, чтобы начать рисовать'
      this.continueLineMsg = 'Нажмите, чтобы продолжить рисование линии'
      this.continuePolygonMsg = 'Нажмите, чтобы продолжить рисование многоугольника'
    } else {
      helpMsg = 'Click to start drawing'
      this.continueLineMsg = 'Click to continue drawing the line'
      this.continuePolygonMsg = 'Click to continue drawing the polygon'
    }
    /** @type {string} */
    if (this.sketch) {
      var geom = (this.sketch.getGeometry())
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = this.continuePolygonMsg
      } else if (geom instanceof ol.geom.LineString) {
        helpMsg = this.continueLineMsg
      }
    }
    if(this.helpTooltipElement){
      this.helpTooltipElement.innerHTML = helpMsg
      this.helpTooltip.setPosition(evt.coordinate)
  
      this.helpTooltipElement.classList.remove('hidden')
    }

  }
   // 创建测量工具
   NucMeasure.prototype.creatMeasureTool = function (_opts) {
    if(this.helpTooltip){
      this.removeOverlays([this.helpTooltip])
    }
    if(this.measureTooltip){
      this.removeOverlays([this.measureTooltip])
    }
    this.createMeasureTooltip()
    this.createHelpTooltip()
    this.helpTooltip.setMap(this._map)
    this.measureTooltip.setMap(this._map)
    var opts = {
      type: 'LineString'
    }
    Object.assign(opts, _opts)
    var type = opts.type
  
    if (isNotEmpty(this.draw)) {
      this._map.removeInteraction(this.draw)
    }
    // 添加绘制工具
    this.creatDrawTool(type)
    // if (isNotEmpty(this.vector)) {
    //   this._map.removeLayer(this.vector)
    // }
    if (type !== 'LineString' && type !== 'Polygon') {
      this._map.removeInteraction(this.draw)
      this.helpTooltip.setMap(null)
      return
    }

  }
  NucMeasure.prototype.creatDrawTool = function (type) {
    var type = (type === 'Polygon' ? 'Polygon' : 'LineString')
    this.draw = new ol.interaction.Draw({
      source: this.source,
      type: /** @type {ol.geom.GeometryType} */
        (type),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [ 10, 10 ],
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    })
    this._map.addInteraction(this.draw)
  
    var listener
    this.draw.on('drawstart', function (evt) {
      // set sketch
      this.sketch = evt.feature
  
      /** @type {ol.Coordinate|undefined} */
      var tooltipCoord = evt.coordinate
  
      listener = this.sketch.getGeometry().on('change', function (evt) {
        var geom = evt.target
        var output
        if (geom instanceof ol.geom.Polygon) {
          output = formatArea(geom)
          tooltipCoord = geom.getInteriorPoint().getCoordinates()
        } else if (geom instanceof ol.geom.LineString) {
          output = formatLength(geom)
          tooltipCoord = geom.getLastCoordinate()
        }
        this.measureTooltipElement.innerHTML = output
        this.measureTooltip.setPosition(tooltipCoord)
      }.bind(this))
    }.bind(this), this)
  
    this.draw.on('drawend', function () {
      this.measureTooltipElement.className = 'tooltip tooltip-static'
      this.measureTooltip.setOffset([ 0, -7 ])
      // unset sketch
      this.sketch = null
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null
      this.createMeasureTooltip()
      ol.Observable.unByKey(listener)
    }, this)
  }
  // 创建测量提示
  NucMeasure.prototype.createMeasureTooltip = function () {
    // if (this.measureTooltipElement) {
    //   this.measureTooltipElement.parentNode.removeChild(measureTooltipElement)
    // }
    this.measureTooltipElement = document.createElement('div')
    this.measureTooltipElement.className = 'tooltip tooltip-measure'
    this.measureTooltip = new ol.Overlay({
      element: this.measureTooltipElement,
      offset: [ 0, -15 ],
      positioning: 'bottom-center'
    })
    this._measureToolsArray.push(this.measureTooltip)
    this._map.addOverlay(this.measureTooltip)
  }
  /**
  * Creates a new help tooltip
  */
  NucMeasure.prototype.createHelpTooltip = function () {
    // if (this.helpTooltipElement) {
    //   this.helpTooltipElement.parentNode.removeChild(helpTooltipElement)
    // }
    this.helpTooltipElement = document.createElement('div')
    this.helpTooltipElement.className = 'tooltip hidden'
    this.helpTooltip = new ol.Overlay({
      element: this.helpTooltipElement,
      offset: [ 15, 0 ],
      positioning: 'center-left'
    })
    this._measureToolsArray.push(this.helpTooltip)
    this._map.addOverlay(this.helpTooltip)
  }
  // 清除编辑图层
  NucMeasure.prototype.clear = function () {
    this.clearLayerMarkers(this.vector)
    this._map.removeInteraction(this.draw)
    this.removeOverlays([this.helpTooltip])
    this.removeOverlays(this._measureToolsArray)
  }

  return NucMeasure;
}(NucMap$)

  exports.NucMap = NucMap$;
  exports.NucHeatLayer = NucHeatLayer$;
  exports.NucCluster = NucCluster$;
  exports.NucGeoUtils = OMapLib$.GeoUtils;
  exports.NucTrack = NucTrack$;
  exports.NucDraw = NucDraw;
  exports.NucModify = NucModify;
  exports.NucMeasure = NucMeasure;
  // export { NucMap }
  Object.defineProperty(exports, '__esModule', { value: true });

  typeof console !== 'undefined' && console.log('nucMap v0.1.1');

})));

