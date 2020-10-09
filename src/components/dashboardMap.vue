<template>
  <div id='supervise-dashboard-map'>
    <MapCommon
      @getProperty='handleFeatureClick'
      ref="map">
    </MapCommon>
    <!-- 返回上一层按钮 -->
    <i v-show="backBtnObj.isShowBack" class="iconfont back-previous-button" :title="backBtnObj.text" @click="backBtnObj.func">&#xe6c7;</i>
  </div>
</template>
<script>
import ajax from '@/api/supervise/Statistics.js'
import MapCommon from '@/components/map/views/map' // 只包含简单功能地图组件
import icons from '@/components/map/lib/importIcon.js' // 所有图标
// 各级别范围[左下角经度,左下角纬度,右上角经度,右上角纬度]
let centerExtent = []
let regionExtent = []
let stationExtent = []
// 中心点坐标[中心点经度,中心点纬度]
let centerCoords = [] // 当前总署中心点
let regionCoords = [] // 当前关区中心点
let stationCoords = [] // 当前总口岸中心点
let extentArr = [] // 用于记录坐标范围
export default {
  name: 'dashboard-map',
  data () {
    return {
      backBtnObj: { // 返回按钮相关
        isShowBack: false,
        func: this.backBtnFunc,
        text: ''
      },
      willToView: 'Center', // 点击按钮将要切换到的视图(上一次暂时的地图显示级别)
      regionId: '', // 某关区id
      stationId: '', // 某口岸id
      allOrgData: {
        center: [],
        region: [],
        station: [],
        scanner: []
      }
    }
  },
  mounted () {
    // 获取地图上各坐标点
    this.getMapOrgNodes()
  },
  methods: {
    getMapOrgNodes () {
      this.allOrgData = {
        center: [],
        region: [],
        station: [],
        scanner: []
      }
      ajax.getOrgPortDeviceTree().then((res) => {
        if (res.data.flag) {
          this.getCoordsArr(res.data.result)
          // 总署界面只显示中心、关区，隐藏口岸、设备
          this.toogleView('', 'Center', centerCoords)
        }
      }).catch(() => {})
    },
    getCoordsArr (data) {
      data.forEach(e => {
        if (e.longitude !== null && e.latitude !== null) {
          if (e.orgType === 'admin' || (e.orgType === null && e.type === 'org')) {
            centerCoords = [e.longitude, e.latitude]
            this.allOrgData.center.push({
              lng: e.longitude,
              lat: e.latitude,
              text: e.name,
              attr: {
                id: e.id,
                type: 'Center',
                coords: centerCoords,
                extent: [],
                pid: e.pid
              },
              src: icons.centerIcon
            })
          } else if (e.orgType === 'customs') {
            this.allOrgData.region.push({
              lng: e.longitude,
              lat: e.latitude,
              text: e.name,
              attr: {
                id: e.id,
                type: 'Region',
                coords: [e.longitude, e.latitude],
                extent: [],
                pid: e.pid
              },
              src: icons.regionIcon
            })
          } else if (e.orgType === 'port') {
            this.allOrgData.station.push({
              lng: e.longitude,
              lat: e.latitude,
              text: e.name,
              attr: {
                id: e.id,
                type: 'Station',
                coords: [e.longitude, e.latitude],
                extent: [],
                pid: e.pid
              },
              src: icons.stationIcon
            })
          } else if (e.type === 'device') {
            this.allOrgData.scanner.push({
              lng: e.longitude,
              lat: e.latitude,
              text: e.name,
              attr: {
                id: e.id,
                type: 'Scanner',
                coords: [e.longitude, e.latitude],
                extent: [],
                pid: e.pid
              },
              src: icons.scannerIcon
            })
          }
        }
        if (e.children && e.children.length > 0) {
          this.getCoordsArr(e.children)
        }
      })
    },
    // 元素点击操作
    handleFeatureClick (data) {
      let { id, coords, type } = data.attr
      // 切换到对应视图，设置中心点，区域范围
      this.toogleView(id, type, coords)
    },
    // 切换地图视图
    toogleView (id, type, coords) {
      let viewData = {}
      let idArr = []
      if (type) {
        switch (type) {
          case 'Center': {
            viewData.type = 'CUSTOM'
            viewData.idStr = this.allOrgData.region.map(e => e.attr.id).join(',')
            break
          }
          case 'Region': {
            viewData.type = 'SITE'
            this.allOrgData.station.forEach(e => {
              if (e.attr.pid === id) {
                idArr.push(e.attr.id)
              }
            })
            viewData.idStr = idArr.join(',')
            break
          }
          case 'Station': {
            viewData.type = 'DEVICE'
            this.allOrgData.scanner.forEach(e => {
              if (e.attr.pid === id) {
                idArr.push(e.attr.id)
              }
            })
            viewData.idStr = idArr.join(',')
            break
          }
        }
        this.$emit('currenView', viewData)
      }
      if (type === 'Center') {
        this.clearMarkers('Station')
        this.clearMarkers('Scanner')
        this.getCenter(this.allOrgData.center)
        this.getRegion(this.allOrgData.region)
        let tempArr = []
        this.allOrgData.center.forEach(c => {
          tempArr.push(c)
        })
        this.allOrgData.region.forEach(r => {
          tempArr.push(r)
        })
        this.getExtentArr(tempArr)
        this.backBtnObj.isShowBack = false
        // 设置中心点坐标
        centerCoords = coords
        // this.setMapCenter(coords)
        // 设置缩放比例
        // this.setMapZoomLevel(9)
      } else if (type === 'Region') {
        this.regionId = id
        this.clearMarkers('Center')
        this.clearMarkers('Region')
        this.clearMarkers('Scanner')
        this.getStation(this.allOrgData.station)
        this.backBtnObj.isShowBack = true
        this.backBtnObj.text = this.$t('vicenter.supervise.map.backToCenter')
        this.willToView = 'Center'
        // 设置中心点坐标
        regionCoords = coords
        // this.setMapCenter(coords)
        // 设置缩放比例
        // this.setMapZoomLevel(15)
      } else if (type === 'Station') {
        this.stationId = id
        this.clearMarkers('Center')
        this.clearMarkers('Region')
        this.clearMarkers('Station')
        this.getScanner(this.allOrgData.scanner)
        this.backBtnObj.isShowBack = true
        this.backBtnObj.text = this.$t('vicenter.supervise.map.backToRegion')
        this.willToView = 'Region'
        // 设置中心点坐标
        stationCoords = coords
        // this.setMapCenter(coords)
        // 设置缩放比例
        // this.setMapZoomLevel(17)
      }
    },
    // 返回上一级按钮
    backBtnFunc () {
      let coords = []
      let viewId = ''
      if (this.willToView === 'Center') {
        coords = centerCoords
        viewId = ''
      } else if (this.willToView === 'Region') {
        coords = regionCoords
        viewId = this.regionId
      }
      // 切换地图视图
      this.toogleView(viewId, this.willToView, coords)
    },
    // 获取总署
    getCenter (arr) {
      this.$refs.map.addCenter(arr)
    },
    // 获取关区
    getRegion (arr) {
      this.$refs.map.addRegion(arr)
    },
    // 获取口岸
    getStation (arr) {
      let stationArr = []
      arr.forEach(e => {
        if (e.attr.pid === this.regionId) {
          stationArr.push(e)
        }
      })
      this.getExtentArr(stationArr)
      this.$refs.map.addStation(stationArr)
    },
    // 获取设备
    getScanner (arr) {
      let scannerArr = []
      arr.forEach(e => {
        if (e.attr.pid === this.stationId) {
          if (e.lat) {
            scannerArr.push(e)
          }
        }
      })
      this.getExtentArr(scannerArr)
      this.$refs.map.addScanner(scannerArr)
    },
    // 清除某图层上的元素
    clearMarkers (layerName) {
      this.$refs.map.clearMarkers(layerName)
    },
    // 获取合适范围坐标集
    getExtentArr (data) {
      extentArr = []
      data.forEach(e => {
        if (e.attr.coords && e.attr.coords[0] && e.attr.coords[1]) {
          extentArr.push(e.attr.coords)
        }
      })
      this.getBoundExtent()
    },
    // 根据元素集合获取范围
    getBoundExtent () {
      this.$refs.map.getBoundExtent(extentArr)
    },
    // 设置地图中心点
    setMapCenter (coords) {
      this.$refs.map.setMapCenter(coords)
    },
    // 设置缩放级别
    setMapZoomLevel (zoomLevel) {
      if (zoomLevel) {
        this.$refs.map.setMapZoomLevel(zoomLevel)
      }
    }
  },
  components: { MapCommon }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
#supervise-dashboard-map {
  width: $all;
  height: $all;
  overflow: hidden;
  position: relative;
  .back-previous-button {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
    color: $white;
    font-size: 28px;
    cursor: pointer;
  }
  #omapId {
    .ol-viewport {
      .ol-zoom {
        display: none;
      }
    }
  }
}
@media screen and (max-width: 1640px) {
}
</style>
