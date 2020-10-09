<template>
  <div class='Image-Analysis-bar' v-bar>
    <div class="Image-Analysis-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
          <div class="statusBtn">
            <el-button v-if="isAutoAssignImage" :disabled="isOnDuty" :type="isOnDuty ? 'info' : 'primary'" size="mini" data-id="inspectionManageAssignOnDuty-btn"  @click='handleOnOrOffDuty("1")'>{{$t('vicenter.inspection.manageAssign.startAssign')}}</el-button>
            <el-button v-if="isAutoAssignImage" :disabled="!isOnDuty" :type="!isOnDuty ? 'info' : 'primary'" size="mini" data-id="inspectionManageAssignOffDuty-btn" @click='handleOnOrOffDuty("0")'>{{$t('vicenter.inspection.manageAssign.stopAssign')}}</el-button>
          </div>
        </div>
        <!-- 表格内容 -->
        <div v-if='showView' class="infolist">
          <div class="panel panel-Q">
            <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
            <div class="form-bar" v-bar>
              <ComForm ref="searchFormRef" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
            </div>
          </div>
          <div class="panel panel-L">
            <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
            <div class="form-bar" v-bar>
              <ComTable :tableData='tableData' :tableGroup='tableGroup'></ComTable>
            </div>
          </div>
        </div>
     </div>
  </div>
</template>
<script>
import breadCrumb from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import ajax from '@/api/inspection/Image-Analysis.js'
import assignAjax from '@/api/inspection/Manage-Assign.js'
import commonAjax from '@/api/common/common.js'
import { Checkbox } from 'element-ui'
export default {
  name: 'Image-Analysis',
  data () {
    return {
      isOnDuty: true, // 当前是否在岗状态
      isAutoAssignImage: false, // 自动派图功能关闭
      showView: false,
      titleBread: { // 面包屑导航组件初始化
        // data: [
        //   {
        //     label: this.$t(this.$route.matched[0].meta.title),
        //     path: '/Inspection/index' // 跳转路径
        //   },
        //   {
        //     label: this.$t(this.$route.name)
        //   }
        // ]
      },
      panelTitle: { // title组件数据
        // queryTitle: {
        //   title: this.$t('vicenter.common.query')
        // },
        // listTitle: {
        //   title: this.$t('vicenter.common.list')
        // }
      },
      inputItem: [
        {
          // getLabel: this.$t('vicenter.inspection.common.office'),
          type: 'treeInput',
          // placeHolder: this.$t('vicenter.inspection.common.enterOffice'),
          models: '',
          ruleProp: 'siteId',
          treedata: [],
          treeView: false,
          treeIptId: 'treeInput',
          treeDataId: 'treeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.siteIdCheckChange,
          treeRefName: 'siteIdtreeIptRef'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.scannerID'),
          type: 'treeInput',
          // placeHolder: this.$t('vicenter.inspection.common.enterScannerID'),
          models: '',
          ruleProp: 'deviceId',
          treedata: [],
          treeView: false,
          treeIptId: 'deviceIdtreeInput',
          treeDataId: 'deviceIdtreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.deviceIdCheckChange,
          treeRefName: 'deviceIdtreeIptRef'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.taskID'),
          type: 'text',
          models: '',
          ruleProp: 'scanSerialNumber'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.LPN'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.common.enterLPN'),
          models: '',
          ruleProp: 'lpnFront'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.declarationNo'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.common.enterDeclarationNo'),
          models: '',
          ruleProp: 'decNumCvs'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.containerNo'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.common.enterContainerNo'),
          models: '',
          ruleProp: 'containerNumCsv'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.checkInTime'),
          type: 'datetimerange',
          // startPlace: this.$t('vicenter.common.startTime'),
          // endPlace: this.$t('vicenter.common.endTime'),
          models: [],
          ruleProp: 'checkinTime'
          // format: this.$t('vicenter.common.pickerFmt')
        }
      ],
      queryFn: { // 页面表单查询方法
        // query: this.query,
        // queryText: this.$t('vicenter.common.query'),
        // resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        refName: 'queryForm',
        model: {
          siteId: '',
          deviceId: '',
          lpnFront: '',
          containerNumCsv: '',
          decNumCvs: '',
          checkinTime: [],
          scanSerialNumber: ''
        },
        rule: {}
      },
      tableGroup: [
        {
          // label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          // label: this.$t('vicenter.inspection.common.XRayImage'),
          type: 'imgoperation',
          height: '50px',
          // model: 'signScanImg'
          model: 'lastScanImage'
        },
        {
          // label: this.$t('vicenter.inspection.common.taskID'),
          type: 'text',
          model: 'scanSerialNumber',
          width: '180px'
        },
        {
          // label: this.$t('vicenter.inspection.common.office'),
          type: 'text',
          model: 'siteName'
        },
        {
          // label: this.$t('vicenter.inspection.common.scannerID'),
          type: 'text',
          model: 'deviceCode'
        },
        {
          // label: this.$t('vicenter.inspection.common.LPN'),
          type: 'text',
          model: 'lpnFront'
        },
        {
          // label: this.$t('vicenter.inspection.common.declarationNo'),
          type: 'text',
          model: 'decNumCvs',
          width: '160px'
        },
        {
          // label: this.$t('vicenter.inspection.common.containerNo'),
          type: 'text',
          model: 'containerNumCsv'
        },
        {
          // label: this.$t('vicenter.inspection.common.checkInTime'),
          type: 'text',
          model: 'checkinTime',
          width: '140px'
        },
        {
          // label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation'
        }
      ],
      tableData: {
        data: [
        ],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'multipleTable',
        sortMethod: this.getSort,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        },
        searchData: {
          examinee: '',
          startTimeUpper: '',
          startTimeLower: '',
          size: 10,
          page: 0
        },
        detailId: -1
      },
      tempIndex: 0, // 解决查询条件和列表项重复的问题
      refresh: ''
    }
  },
  created () {
    this.tempIndex = 1
    this.isAutoAssignImage = window.config.isAutoAssignImage
    this.setI18n()
  },
  mounted () {
    // this.getRouteFlag()
    this.refresh = this.$refreshList(this.setI18n)
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
      this.refresh = this.$refreshList(this.setI18n)
    }
  },
  methods: {
    getAnalystInfo () {
      // 获取当前审图员状态（0 离岗-》停止分派、1 在岗-》分派中、2 在线、3 离线）
      assignAjax.getAnalystInfo().then((res) => {
        if (res.data.flag) {
          let status = res.data.result.status
          if (status === '1') {
            this.isOnDuty = true
          } else if (status === '0' || status === '2' || status === '3') {
            this.isOnDuty = false
          }
        }
      }).catch(() => {})
    },
    handleOnOrOffDuty (data) {
      assignAjax.doOnline({type: data}).then((res) => {
        if (res.data.flag) {
          this.isOnDuty = !this.isOnDuty
          if (data === '1') {
            this.$NotifSuccess(this.$t('vicenter.inspection.manageAssign.successAssign'))
          } else if (data === '0') {
            this.$NotifSuccess(this.$t('vicenter.inspection.manageAssign.successStopAssign'))
          }
        }
      }).catch(() => {})
    },
    setI18n () {
      this.orgAjaxTree()
      this.deviceAjaxTree()
      this.getAnalystInfo()
      // 查询条件输入框校验
      this.formRule.rule.scanSerialNumber = this.$allRules().scanSerialNumber
      this.formRule.rule.containerNumCsv = this.$allRules().containerNumCsv
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Inspection/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      }
      // 查询条件和列表title
      this.panelTitle = {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      }
      // 查询和重置按钮
      this.queryFn = {
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      }
      // 查询条件
      this.inputItem.forEach((e) => {
        if (e.ruleProp === 'siteId') {
          e.getLabel = this.$t('vicenter.inspection.common.office')
          e.placeHolder = this.$t('vicenter.inspection.common.enterOffice')
        } else if (e.ruleProp === 'deviceId') {
          e.getLabel = this.$t('vicenter.inspection.common.scannerID')
          e.placeHolder = this.$t('vicenter.inspection.common.enterScannerID')
        } else if (e.ruleProp === 'scanSerialNumber') {
          e.getLabel = this.$t('vicenter.inspection.common.taskID')
          e.placeHolder = this.$t('vicenter.inspection.common.entertaskID')
        } else if (e.ruleProp === 'lpnFront') {
          e.getLabel = this.$t('vicenter.inspection.common.LPN')
          e.placeHolder = this.$t('vicenter.inspection.common.enterLPN')
        } else if (e.ruleProp === 'containerNumCsv') {
          e.getLabel = this.$t('vicenter.inspection.common.containerNo')
          e.placeHolder = this.$t('vicenter.inspection.common.enterContainerNo')
        } else if (e.ruleProp === 'decNumCvs') {
          e.getLabel = this.$t('vicenter.inspection.common.declarationNo')
          e.placeHolder = this.$t('vicenter.inspection.common.enterDeclarationNo')
        } else if (e.ruleProp === 'checkinTime') {
          e.getLabel = this.$t('vicenter.inspection.common.checkInTime')
          e.startPlace = this.$t('vicenter.common.startTime')
          e.endPlace = this.$t('vicenter.common.endTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'lastScanImage') {
          e.label = this.$t('vicenter.inspection.common.XRayImage')
        } else if (e.model === 'scanSerialNumber') {
          e.label = this.$t('vicenter.inspection.common.taskID')
        } else if (e.model === 'siteName') {
          e.label = this.$t('vicenter.inspection.common.office')
        } else if (e.model === 'deviceCode') {
          e.label = this.$t('vicenter.inspection.common.scannerID')
        } else if (e.model === 'lpnFront') {
          e.label = this.$t('vicenter.inspection.common.LPN')
        } else if (e.model === 'decNumCvs') {
          e.label = this.$t('vicenter.inspection.common.declarationNo')
        } else if (e.model === 'containerNumCsv') {
          e.label = this.$t('vicenter.inspection.common.containerNo')
        } else if (e.model === 'checkinTime') {
          e.label = this.$t('vicenter.inspection.common.checkInTime')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        } else if (e.type === 'index') {
          e.label = this.$t('vicenter.common.No')
        }
      })
      this.getRouteFlag()
    },
    getRouteFlag () {
      ajax.getuserlockimagcheck().then((res) => {
        if (res.data.flag) {
          if (res.data.result.hasLockTask) {
            this.detailId = res.data.result.taskId
            this.getDetail(null)
          } else {
            this.query()
          }
        }
      }).catch(() => {
      })
    },
    getList (params = {}) {
      this.tableData.data = []
      this.tableData.isPage = false
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      ajax.getList(params).then((res) => {
        if (res.data.flag) {
          this.tableData.data = res.data.result.content
          this.tableData.data.forEach(obj => {
            obj.checkinTime = this.$options.filters['formatDate'](obj.checkinTime)
            obj.operation = [
              {
                func: this.getDetail,
                label: `<span class='iconfont editTable'>&#xe60a;</span>`,
                title: this.$t('vicenter.inspection.btn.imageAnalysis'),
                show: true
              }
            ]
            obj.lastScanImage = {
              src: obj.lastScanImage,
              func: this.getDetail
            }
          })
          this.tableData.page.Allpage = res.data.result.totalElements
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
          this.showView = true
        } else {
          // this.$ConfirmMsgBox(data.message)
        }
      }).catch(() => {})
    },
    treeClick (data) {
      // console.log(this.inputItem[0].models)
    },
    /**
     * 获取机构树方法
     */
    orgAjaxTree () {
      commonAjax.orgNodesTree({all: true}).then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
          this.$data.inputItem.forEach(e => {
            if (e.ruleProp === 'siteId') {
              e.treedata = res.data.result
            }
          })
        }
      }).catch(() => {})
    },
    /**
     * 获取设备树方法
     */
    deviceAjaxTree () {
      commonAjax.deviceNodesTree().then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pid')
          this.$data.inputItem.forEach(e => {
            if (e.ruleProp === 'deviceId') {
              e.treedata = res.data.result
            }
          })
        }
      }).catch(() => {})
    },
    /**
     * 机构树点击节点
     */
    siteIdCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'siteId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['siteId'] = checkedValue.ids
      }
    },
    /**
     * 设备树点击节点
     */
    deviceIdCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkNodeChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'deviceId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['deviceId'] = checkedValue.ids
      }
    },
    getSort () {
      // console.log(this.formRule)
    },
    query (isPage = true) { // 页面查询
      let params = {}
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.checkinTime
      let checkinTime = this.formRule.model.checkinTime
      if (checkinTime != null && checkinTime.length === 2) {
        params.checkinTimeStart = checkinTime[0].getTime()
        params.checkinTimeEnd = checkinTime[1].getTime()
      }
      this.getList(params)
    },
    handleSizeChange (value) { // 修改一页显示多少
      this.$set(this.tableData.page, 'pagesize', value)
      this.query(false)
    },
    handleCurrentChange (value) { // 翻页
      this.$set(this.tableData.page, 'CurrentPage', value - 1)
      this.query(false)
    },
    getDetail (scope) { // 获取详情
      this.$router.push({
        path: 'Image-Analysis-detail'
      })
      let detailId = 0
      if (scope === null) {
        detailId = this.detailId
      } else {
        detailId = scope.row.id
      }
      sessionStorage.setItem('detailId', JSON.stringify(detailId))
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Inspection/Image-Analysis-detail') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        siteId: '',
        deviceId: '',
        lpnFront: '',
        containerNumCsv: '',
        decNumCvs: '',
        checkinTime: [],
        scanSerialNumber: ''
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.$clearRefresh(this.refresh)
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { breadCrumb, ComForm, panelTitle, ComTable }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.Image-Analysis-bar {
  @extend .extend-bar;
  .Image-Analysis-M {
    .breadCrumb {
      position: relative;
      .statusBtn {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    padding:$margin;
    @include box-sizing;
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
    }
    .infolist {
      .panel {
        @extend .extend-panel;
        .search-form {
          @include layout(2);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
      }
    }
  }
}
.el-tooltip__popper {
  max-width: 500px;
  word-break: break-all;
}
</style>
