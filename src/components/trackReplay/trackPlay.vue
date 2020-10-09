<template>
  <div class="track-replay-wrap">
    <!-- 地图组件，只实现地图功能 -->
    <Map
      @start='startM'
      @slow='slowM'
      @fast='fastM'
      @back='backM'
      @getAlarmProperty='getAlarmProperty'
      ref="map">
    </Map>
    <!-- 控制按钮 -->
    <Controller
      @start='startC'
      @pause='pauseC'
      @back='backC'
      @stop='stopC'
      @speedDown='speedDownC'
      @speedUp='speedUpC'
      ref='controller'>
    </Controller>
    <!-- 右下角终端状态显示 -->
    <div class="elock-state">
      <el-row>
        <el-col :span="9">{{$t('vitracking.kazTrackPlay.electricQuantity')}}</el-col>
        <el-col :span="15">{{elockState.electricQuantity}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="9">{{$t('vitracking.kazTrackPlay.altitude')}}</el-col>
        <el-col :span="15">{{elockState.altitude}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="9">{{$t('vitracking.kazTrackPlay.speed')}}</el-col>
        <el-col :span="15">{{elockState.speed}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="9">{{$t('vitracking.kazTrackPlay.latitude')}}</el-col>
        <el-col :span="15">{{elockState.latitude}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="9">{{$t('vitracking.kazTrackPlay.longitude')}}</el-col>
        <el-col :span="15">{{elockState.longitude}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="9">{{$t('vitracking.kazTrackPlay.time')}}</el-col>
        <el-col :span="15">{{elockState.time}}</el-col>
      </el-row>
    </div>
    <!-- 报警弹出框 -->
    <div class="alarm-info" v-if="alarmData.flag">
      <div class="manage">
        <div class="manage-title">
          <div class="manage-title-left">
            {{$t('vitracking.kazTrackPlay.alarmInfo')}}
          </div>
        </div>
        <div class="manage-content">
          <el-row>
            <el-col :span="10">{{$t('vitracking.kazTrackPlay.alarmType')}}</el-col>
            <el-col :span="14">{{alarmData.alarmType}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">{{$t('vitracking.kazTrackPlay.alarmTime')}}</el-col>
            <el-col :span="14">{{alarmData.alarmTime | formatDate}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">{{$t('vitracking.kazTrackPlay.processResult')}}</el-col>
            <el-col :span="14">{{alarmData.processResult}}</el-col>
          </el-row>
        </div>
      </div>
      <i class="el-icon-close close-button" @click="colseAlarmInfo"></i>
    </div>
  </div>
</template>

<script>
import Map from './components/map' // 只包含简单功能地图组件
import Controller from './components/controller' // 回放处理组件
import ajax from './api/trackReplay.js' // api
import alarmIcons from './components/importAlarmIcons.js' // 导入报警图标
import icons from './components/importIcon.js' // 其他图标

export default {
  data () {
    return {
      /* 右下角终端状态显示 */
      elockState: {
        electricQuantity: '',
        altitude: '',
        speed: '',
        latitude: '',
        longitude: '',
        time: ''
      },
      /* 报警弹出框的数据 */
      alarmData: {
        flag: false,
        alarmType: '',
        alarmTime: '',
        processResult: ''
      },
      /* 地图交互数据 */
      mapData: {
        vehicleIcon: '',
        isForward: true, // 是否正向回放，false为回退
        isPaly: false, // 是否正在播放，用于加速减速
        times: 1,
        maxTimes: 8 // 最高倍数
      }
    }
  },
  created () {
    this.getSite()
    this.getAlarm()
    this.getTrip()
    this.getLandarea()
    this.getVehicleTrip()
  },
  methods: {
    /*
    和控制条交互的方法
    */
    startC () {
      this.$data.mapData.isForward = true
      this.$data.mapData.isPaly = true
      this.$refs.map.start()
    },
    pauseC () {
      this.$data.mapData.isPaly = false
      this.$refs.map.pause()
    },
    backC () {
      this.$data.mapData.isForward = false
      this.$data.mapData.isPaly = true
      this.$refs.map.back()
    },
    stopC () {
      this.resetData()
      this.$data.mapData.isPaly = false
      this.$refs.map.stop()
    },
    speedDownC () {
      this.$data.mapData.times = this.$data.mapData.times / 2
      if (this.$data.mapData.times < (1 / this.$data.mapData.maxTimes)) {
        this.$data.mapData.times = 1
      }
      this.$refs.controller.changeTimes(this.$data.mapData.times)
      this.$refs.map.slow((1 / this.$data.mapData.times), this.$data.mapData.isForward, this.$data.mapData.isPaly)
    },
    speedUpC () {
      this.$data.mapData.times = this.$data.mapData.times * 2
      if (this.$data.mapData.times > this.$data.mapData.maxTimes) {
        this.$data.mapData.times = 1
      }
      this.$refs.controller.changeTimes(this.$data.mapData.times)
      this.$refs.map.fast(this.$data.mapData.times, this.$data.mapData.isForward, this.$data.mapData.isPaly)
    },
    /*
    地图的监听事件
    */
    startM (data) {
      this.setData(data)
    },
    slowM (data) {
      this.setData(data)
    },
    fastM (data) {
      this.setData(data)
    },
    backM (data) {
      this.setData(data)
    },
    getAlarmProperty (data) {
      this.alarmData.alarmTime = data.alarmTime
      this.alarmData.alarmType = data.type.name
      if (data.status === 'NORMAL') {
        this.alarmData.processResult = this.$t('vitracking.kazTrackPlay.notSolved')
      } else {
        this.alarmData.processResult = this.$t('vitracking.kazTrackPlay.solved')
      }
      this.alarmData.flag = true
    },
    setData (data) { // 提取的放回过程中给页面数据赋值的方法
      this.$refs.controller.changeProgress(data.percent)
      this.$data.elockState.electricQuantity = data.property[5] + '%'
      this.$data.elockState.altitude = data.property[2] + 'm'
      this.$data.elockState.speed = data.property[4] + 'km/h'
      this.$data.elockState.latitude = this.formatterLat(data.property[0])
      this.$data.elockState.longitude = this.formatterLog(data.property[1])
      this.$data.elockState.time = this.$options.filters['formatDate'](data.property[8], this.$t('vicenter.common.formatDate'))
    },
    resetData () {
      this.$refs.controller.changeProgress('0')
      this.$data.elockState.electricQuantity = ''
      this.$data.elockState.altitude = ''
      this.$data.elockState.speed = ''
      this.$data.elockState.latitude = ''
      this.$data.elockState.longitude = ''
      this.$data.elockState.time = ''
    },
    /*
    地图数据处理
    */
    async getSite () { // 获取口岸
      let obj = {pageable: false}
      let res = await ajax.getSite(obj)
      if (res.data.flag && res.data.result && (res.data.result.length > 0)) {
        let arr = []
        res.data.result.forEach(element => {
          let obj = {
            lat: element.latitude,
            lng: element.longitude,
            text: element.name,
            attr: {id: element.id},
            src: element.icon ? element.icon : icons.porticon
          }
          arr.push(obj)
        })
        this.addPorts(arr)
      }
    },
    async getAlarm () { // 获取报警数据
      let obj = {
        pageable: false,
        tripId: this.$props.tripId,
        elockId: this.$props.elockId
      }
      let res = await ajax.getAlarm(obj)
      if (res.data.flag && res.data.result && (res.data.result.length > 0)) {
        let arr = []
        res.data.result.forEach(element => {
          arr.push({
            lat: element.latitude,
            lng: element.longitude,
            src: this.getAlarmIcon(element.type, element.status),
            attr: element
          })
        })
        this.addVehicleAlarms(arr)
      }
    },
    async getTrip () { // 获取行程信息,以获取规划路线
      let id = this.$props.tripId
      let res = await ajax.getTrip(id)
      if (res.data.flag) {
        if (res.data.result.route) {
          let routeId = res.data.result.route.id
          await this.getRoute(routeId)
        }
      }
    },
    async getVehicleTrip (topAlarmLevelCode) { // 获取车辆行程，以获取车辆图标
      let obj = {tripId: this.$props.tripId}
      let res = await ajax.getVehicleTrip(obj)
      if (res.data.flag) {
        if (res.data.result.content.length > 0) {
          let data = res.data.result.content[0]
          if (data.vehicle && data.vehicle.type && data.topAlarmLevelCode) {
            this.$data.mapData.vehicleIcon = this.getVehicleIcon(data.vehicle.type, data.topAlarmLevelCode)
          } else {
            this.$data.mapData.vehicleIcon = this.getVehicleIcon('TRUCK', '')
          }
          await this.getTrack()
        }
      }
    },
    async getTrack () { // 获取真实轨迹
      let obj = {
        tripId: this.$props.tripId,
        elockId: this.$props.elockId
      }
      let res = await ajax.getTrack(obj)
      if (res.data.flag) {
        if (res.data.result && res.data.result.pointInfo) {
          this.addRealRoute(JSON.parse(res.data.result.pointInfo))
        } else {
          this.openNoGPS()
        }
      }
    },
    async getRoute (id) { // 获取规划路线
      let res = await ajax.getRoute(id)
      if (res.data.flag && res.data.result) {
        this.addPlanRoute(JSON.parse(res.data.result.coordinates), {fillcolor: res.data.result.color, strokecolor: res.data.result.color})
      }
    },
    async getLandarea () { // 获取电子围栏
      let id = this.$props.tripId
      let res = await ajax.getLandarea(id)
      if (res.data.flag && res.data.result) {
        let arr = []
        res.data.result.forEach(element => {
          arr.push({paths: JSON.parse(element)})
        })
        this.addLandAreas(arr)
      }
    },
    /*
    调用地图方法，绘制口岸
      arr = [{
        lat: latitude,
        lng: longitude,
        text: name,
        attr: {id: id},
        src: icon ? icon : icons.landmarkericon0 默认的地点图标
      }]
    */
    addPorts (arr) {
      this.$refs.map.addPorts(arr)
    },
    /*
    调用地图方法，绘制真实轨迹
      arr = [[
        经度,维度,海拔,方向，速度，电量，温度，湿度，时间 九个属性，都是后端返回，直接传接即可
      ]]
      icon 车辆图标 需要根据最后的报警级别来确定颜色
    */
    addRealRoute (arr) {
      this.$refs.map.addRealRoute(arr, this.mapData.vehicleIcon)
    },
    /*
    调用地图方法，绘制规划路线
      arr = [
        [][][][]
      ]
      option = {}
    */
    addPlanRoute (arr, option = {}) {
      this.$refs.map.addPlanRoute(arr, option)
    },
    /*
    调用地图方法，绘制电子围栏
      arr = [{
        paths: [
          [][][][]
        ]
      }]
    */
    addLandAreas (arr) {
      this.$refs.map.addLandAreas(arr)
    },
    /*
    调用地图方法，绘制报警图标
      arr = [{
        lat:
        lng:
        src:
        attr:
      }]
    */
    addVehicleAlarms (arr) {
      this.$refs.map.addVehicleAlarms(arr)
    },
    /*
    其他方法
    */
    colseAlarmInfo () { // 关闭报警弹出框
      this.$data.alarmData.flag = false
    },
    getAlarmIcon (alarmType, status) { // 获取报警图标方法
      let icon = icons.alarmicon
      if (status === 'SOLVED') {
        icon = icons.alarmSolvedIcon
      }
      if (alarmType.level && alarmType.level.code && alarmType.level.code.id && alarmType.icon) {
        let index // 0：一般，1：警告，2：严重，3：已处理
        let codeId = alarmType.level.code.id
        switch (codeId) {
          case 'GENERAL':
            index = 0
            break
          case 'WARNING':
            index = 1
            break
          case 'SERIOUS':
            index = 2
            break
        }
        icon = alarmIcons[`alarmicon${alarmType.icon}`][index]
        if (status === 'SOLVED') {
          icon = alarmIcons[`alarmicon${alarmType.icon}`][3]
        }
      }
      return icon
    },
    getVehicleIcon (type, topAlarmLevelCode) { // 取得地图上描绘的车辆的图标
      let grade
      if (!topAlarmLevelCode) {
        grade = ''
      } else {
        grade = topAlarmLevelCode.grade
      }
      let vehicleIcon = icons.truckGreenIcon // 默认为绿色的卡车
      if (type === 'TRAIN') {
        if (!grade) {
          vehicleIcon = icons.trainGreenIcon
        } else if (grade === 0) {
          vehicleIcon = icons.trainBlueIcon
        } else if (grade === 1) {
          vehicleIcon = icons.trainYellowIcon
        } else if (grade === 2) {
          vehicleIcon = icons.trainRedIcon
        }
      } else {
        if (!grade) {
          vehicleIcon = icons.truckGreenIcon
        } else if (grade === 0) {
          vehicleIcon = icons.truckBlueIcon
        } else if (grade === 1) {
          vehicleIcon = icons.truckYellowIcon
        } else if (grade === 2) {
          vehicleIcon = icons.truckRedIcon
        }
      }
      return vehicleIcon
    },
    openNoGPS () { // 没有轨迹的提示
      this.$alert(this.$t('vitracking.kazTrackPlay.openNoGPS'), '',
        {
          confirmButtonText: this.$t('vitracking.common.sure'),
          callback: () => {}
        }
      )
    },
    // 格式话经度
    formatterLog (cellValue) {
      if (cellValue === null || cellValue === undefined || cellValue === '') {
        return '-' // 这里的空白文本被替换为 -
      } else {
        if (cellValue > 0) {
          return `${cellValue}E`
        } else if (cellValue < 0) {
          return `${cellValue}W`
        } else {
          return cellValue
        }
      }
    },
    // 格式话纬度
    formatterLat (cellValue) {
      if (cellValue === null || cellValue === undefined || cellValue === '') {
        return '-' // 这里的空白文本被替换为 -
      } else {
        if (cellValue > 0) {
          return `${cellValue}N`
        } else if (cellValue < 0) {
          return `${cellValue}S`
        } else {
          return cellValue
        }
      }
    }
  },
  props: ['tripId', 'elockId'],
  components: {
    Controller,
    Map
  }
}
</script>

<style lang="scss" scoped>
@import './styles/index.scss';
.track-replay-wrap {
  position: relative;
  height: 100%;
  .elock-state {
    width: 220px;
    height: 192px;
    position: absolute;
    bottom: 10px;
    right: 10px;
    border-radius: 5px;
    background: rgba(25, 23, 17, 0.39);
    // background: -moz-linear-gradient(top, #fbfbfa 0%, #e3e5e6 100%);
    // background: -webkit-linear-gradient(top, #fbfbfa 0%,#e3e5e6 100%);
    // background: linear-gradient(to bottom, #fbfbfa 0%,#e3e5e6 100%);
    border: #cdcdcd solid 1px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.52);
    padding: 0 10px;
    .el-col-9, .el-col-15 {
      color:#fff;
      text-align: center;
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid #dadcdb;
    }
  }
  .alarm-info {
    width: 30%;
    min-width: 300px;
    background: #fbfbfa;
    position: absolute;
    top: 20%;
    left: 20%;
    padding: 0;
    .manage{
      @extend .extend-manage;
      .manage-title {
        @extend .extend-manage-title;
        background: url($titleUrl)repeat-x 0 -3px;
        .manage-title-left {
          background: url($titleLeftUrl)no-repeat right -9px;
          @extend .extend-manage-title-left;
        };
        .manage-title-right{
          @extend .extend-manage-title-right;
        }
      }
      .manage-content {
        width: 100%;
        padding: 10px;
        padding-top: 0;
        @include box-sizing;
        .el-col-14, .el-col-10 {
          text-align: center;
          height: 32px;
          line-height: 32px;
          border-bottom: 1px solid #bbb;
        }
        .el-col-10 {
          background: #e1e1e1;
          border-left: 1px solid #bbb;
        }
        .el-col-14 {
          border-right: 1px solid #bbb;
        }
      }
    }
    .close-button {
      position: absolute;
      top: 7px;
      right: 7px;
      cursor: pointer;
    }
  }
}
</style>
