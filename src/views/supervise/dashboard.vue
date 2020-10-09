<template>
<div id="supervision-dashboard">
  <div class="breadCrumb">
    <bread :breadcrumb="titleBread"></bread>
  </div>
  <div id="statistic-container" ref="chartsContainerRef" @dblclick="handleFullScreen">
    <div class="header-title">
      <span class="title">{{$t('vicenter.common.titleInfo')}}</span>
      <div class="toggle">
        <div v-for="(item, index) in toggleData" :key="index" class="toggle-item">
          <span class="label">{{item.label}}</span>
          <el-select v-model="item.models" :popper-append-to-body="false" @change="item.change">
            <el-option v-for="o in item.option" :key="o.value" :label="o.label" :value="o.value"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="dashboard-layout" ref="dashboard-layout-outer">
      <LayoutCommon v-if="showGridLayout" ref="dashboardLayoutRef" :type="layoutType" :dateType="currentDateType" :data="layoutData" :mapPos="layoutMapPosition" :totalHeight="layoutHeight" :isDraggable="layoutIsDraggable" @allData="getLayoutData"></LayoutCommon>
    </div>
  </div>
</div>
</template>

<script>
import ajax from '@/api/supervise/templateMgmt'
import bread from '@/components/breadCrumb'
import LayoutCommon from '@/components/gridLayout'
export default {
  data () {
    return {
      toggleData: [
        {
          label: this.$t('vicenter.dashboard.common.template'),
          models: '',
          option: [],
          change: this.templateChange
        },
        {
          label: this.$t('vicenter.dashboard.common.time'),
          models: 'DAY',
          option: [
            {
              label: this.$t('vicenter.dashboard.dateType.day'),
              value: 'DAY'
            },
            {
              label: this.$t('vicenter.dashboard.dateType.week'),
              value: 'WEEK'
            },
            {
              label: this.$t('vicenter.dashboard.dateType.month'),
              value: 'MONTH'
            },
            {
              label: this.$t('vicenter.dashboard.dateType.year'),
              value: 'YEAR'
            }
          ],
          change: this.dateTypeChange
        }
      ],
      titleBread: {
        font: '/',
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Supervise/index'
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      currentDateType: 'DAY', // 当前统计的日期类型
      currentOrgType: 'CUSTOM', // 当前统计的地区级别，关区CUSTOM、口岸SITE、设备DEVICE
      currentOrgIds: '', // 当前地区级别下的所有id
      showGridLayout: false,
      layoutType: '',
      layoutData: [],
      layoutMapPosition: {},
      layoutHeight: '',
      layoutIsDraggable: false, // 预览页面不允许拖拽
      fullscreen: false
    }
  },
  created () {
    // 获取模板select框下拉项并加载默认已发布模板(3:4)
    this.getAllPublishedTemplate()
  },
  mounted () {
    if (document.addEventListener) {
      document.addEventListener('webkitfullscreenchange', this.handleEscExit, false)
      document.addEventListener('fullscreenchange', this.handleEscExit, false)
      document.addEventListener('mozfullscreenchange', this.handleEscExit, false)
      document.addEventListener('MSFullscreenChange', this.handleEscExit, false)
    }
  },
  methods: {
    updateTemplate () {
      let currentTemplateId = this.toggleData[0].option.filter(e => e.value === this.layoutType)[0].id
      ajax.getTemplateDetail({id: currentTemplateId}).then((res) => {
        if (res.data.flag) {
          let result = res.data.result
          this.showGridLayout = false
          this.layoutData = []
          // 模板地图位置
          this.layoutMapPosition = this.$filterLayoutType(this.layoutType).layoutMapPosition
          // 模板数据源
          let componentsData = []
          if (result.componentObjects && result.componentObjects.length > 0) {
            componentsData = result.componentObjects.map(e => {
              return {
                x: e.beginposx,
                y: e.beginposy,
                w: e.width,
                h: e.height,
                i: e.id,
                static: true,
                label: e.componentName, // 组件名称
                url: e.url, // 数据请求地址
                componentCode: e.componentCode // 组件code
              }
            })
            this.layoutData = componentsData.concat(this.layoutMapPosition)
            this.layoutData.forEach(e => {
              e.chartId = e.i
              e.dateType = this.currentDateType
              e.type = this.currentOrgType
              e.idStr = this.currentOrgIds
            })
          }
          this.showLayout()
        }
      }).catch(() => {})
    },
    templateChange (data) {
      this.layoutType = data
      // 更新模板
      this.updateTemplate()
    },
    dateTypeChange (data) {
      this.currentDateType = data
      this.layoutData.forEach(e => {
        e.dateType = this.currentDateType
      })
    },
    getAllPublishedTemplate () {
      let params = {
        status: '1'
      }
      ajax.getList(params).then((res) => {
        if (res.data.flag) {
          if (res.data.result.content.length > 0) {
            this.toggleData[0].option = res.data.result.content.map(e => {
              return {
                label: e.templateName,
                value: e.proportion,
                id: e.id
              }
            })
            // 3:4为默认发布模板
            this.toggleData[0].models = '3:4'
            this.layoutType = '3:4'
            // 加载模板
            this.updateTemplate()
          }
        }
      }).catch(() => {})
    },
    handleFullScreen () {
      let element = this.$refs.chartsContainerRef
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          let _this = this
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          let _this = this
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          let _this = this
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          let _this = this
          element.msRequestFullscreen() // IE11
        }
      }
      this.fullscreen = !this.fullscreen
      console.log('fullscreen: ' + this.fullscreen)
    },
    handleEscExit () {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreenElement && !document.msFullscreenElement) {
        this.fullscreen = false
        console.log('fullscreen: ' + this.fullscreen)
      }
    },
    showLayout () {
      let _this = this
      setTimeout(() => {
        // 模板栅格行高度设置
        _this.layoutHeight = _this.$refs['dashboard-layout-outer'].offsetHeight
        _this.showGridLayout = true
      }, 100)
    },
    getLayoutData (data) {
      this.layoutData = data
    }
  },
  watch: {
    'fullscreen': {
      handler (newVal, oldVal) {
        this.showGridLayout = false
        this.showLayout()
      }
    }
  },
  components: { bread, LayoutCommon }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
// 非全屏公共配置
$FontSize: 14px;
$IptHeight: 26px;
$TitleHeight: 30px;
$TitleFontSize: 20px;
// 全屏公共配置
$fullFontSize: 14px;
$fullIptHeight: 26px;
$fullTitleHeight: 50px;
$fullTitleFontSize: 26px;
@mixin fullStyle () {
  .header-title {
    height: $fullTitleHeight;
    margin-top: -$fullTitleHeight;
    .title {
      font-size: $fullTitleFontSize;
      line-height: $fullTitleHeight;
    }
    .toggle {
      .toggle-item {
        span.label {
          font-size: $fullFontSize;
        }
        .el-select {
          .el-input__inner {
            height: $fullIptHeight;
          }
        }
      }
    }
  }
}
#supervision-dashboard {
  width: $all;
  height: $all;
  padding: 20px;
  @include box-sizing();
}
#statistic-container {
  width: $all;
  height: calc(100% - 36px);
  padding-top: $TitleHeight;
  @include box-sizing();
  background: #fff;
  .header-title {
    width: $all;
    height: $TitleHeight;
    margin-top: -$TitleHeight;
    position: relative;
    .title {
      font-weight: bold;
      font-size: $TitleFontSize;
      line-height: $TitleHeight;
    }
    .toggle {
      height: $all;
      position: absolute;
      top: 0;
      right: 10px;
      @include flex(row, flex-end, center);
      .toggle-item {
        span.label {
          font-size: $FontSize;
          margin-left: 10px;
        }
        .el-select {
          width: 100px;
          .el-input__inner {
            height: $IptHeight;
          }
          .el-input__icon {
            line-height: 0;
          }
        }
      }
    }
  }
  .dashboard-layout {
    height: $all;
  }
}
@media screen and (max-width: 1640px) {
}
#statistic-container:fullscreen {
  padding-top: $fullTitleHeight;
  @include fullStyle();
}
#statistic-container:-webkit-full-screen {
  padding-top: $fullTitleHeight;
  @include fullStyle();
}
#statistic-container:-moz-full-screen {
  padding-top: $fullTitleHeight;
  @include fullStyle();
}
#statistic-container:-ms-fullscreen {
  padding-top: $fullTitleHeight;
  @include fullStyle();
}
</style>
