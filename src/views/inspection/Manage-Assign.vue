<template>
  <div class='Manage-Assign-bar' v-bar>
    <div class="Manage-Assign-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="assignInfo">
          <div class="statisticInfo">
            <span>{{$t('vicenter.inspection.manageAssign.notAssignTaskNum')}}:<i data-id="totalNumNotAssignTaskNum-i">{{totalNum.notAssignTaskNum}}</i></span>
            <span>{{$t('vicenter.inspection.manageAssign.assignedTaskNum')}}:<i data-id="totalNumAssignedTaskNum-i">{{totalNum.assignedTaskNum}}</i></span>
            <span>{{$t('vicenter.inspection.manageAssign.analysedTaskNum')}}:<i data-id="totalNumAnalysedTaskNum-i">{{totalNum.analysedTaskNum}}</i></span>
          </div>
          <div class="panel panel-L">
            <panelTitle :panelTitleInit="panelTitle.listTitle">
              <el-button type="primary" size="mini" data-id="startAssign-btn" @click='handleStartOrStop("1")'>{{$t('vicenter.inspection.manageAssign.startAssign')}}</el-button>
              <el-button type="white" size="mini" data-id="stopAssign-btn" @click='handleStartOrStop("0")'>{{$t('vicenter.inspection.manageAssign.stopAssign')}}</el-button>
              <el-button type="primary" size="mini" data-id="taskRecovery-btn" @click='handleRecovery("Multiple")'>{{$t('vicenter.inspection.manageAssign.taskRecovery')}}</el-button>
            </panelTitle>
            <div class="form-bar" v-bar>
              <ComTable ref="analystTable" @listenToSelectDataEvent='selectRow' :tableData='tableData' :tableGroup='tableGroup'></ComTable>
            </div>
          </div>
        </div>
     </div>
  </div>
</template>
<script>
import breadCrumb from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import ajax from '@/api/inspection/Manage-Assign.js'
import commonAjax from '@/api/common/common.js'
import { Checkbox } from 'element-ui'
export default {
  name: 'ManageAssign',
  data () {
    return {
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Inspection/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: { // title组件数据
        listTitle: {
          title: this.$t('vicenter.common.menus.inspectionChild.manageAssign')
        }
      },
      selRowId: '',
      selRowStatus: [],
      totalNum: {
        notAssignTaskNum: 0,
        assignedTaskNum: 0,
        analysedTaskNum: 0
      },
      tableGroup: [
        {
          type: 'selection',
          width: ''
        },
        {
          label: this.$t('vicenter.inspection.manageAssign.analystNo'),
          type: 'text',
          model: 'analystAccount',
          width: ''
        },
        // {
        //   label: this.$t('vicenter.inspection.manageAssign.analystName'),
        //   type: 'text',
        //   model: 'analystName',
        //   width: ''
        // },
        {
          label: this.$t('vicenter.inspection.manageAssign.assignedTaskNum'),
          type: 'text',
          model: 'allocationTaskNum'
        },
        {
          label: this.$t('vicenter.inspection.manageAssign.completedTaskNum'),
          type: 'text',
          model: 'completedTaskNum'
        },
        {
          label: this.$t('vicenter.inspection.manageAssign.uncompletedTaskNum'),
          type: 'text',
          model: 'uncompletedTaskNum'
        },
        {
          label: this.$t('vicenter.inspection.manageAssign.status'),
          type: 'text',
          model: 'statusName'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation'
        }
      ],
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'taskAssignTable',
        sortMethod: this.getSort,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        }
      },
      refresh: ''
    }
  },
  created () {
    this.getTaskStatistic()
  },
  mounted () {
    this.query(true)
    this.refresh = setInterval(() => {
      this.getTaskStatistic()
      this.query(true)
    }, window.config.refreshTime * 1000)
  },
  methods: {
    getTaskStatistic () {
      ajax.getTaskStatistic().then((res) => {
        if (res.data.flag) {
          let { waitAllocationTaskNum, allocationTaskNum, completedTaskNum } = res.data.result
          this.totalNum = {
            notAssignTaskNum: waitAllocationTaskNum || 0,
            assignedTaskNum: allocationTaskNum || 0,
            analysedTaskNum: completedTaskNum || 0
          }
        }
      }).catch(() => {})
    },
    getList (params) {
      ajax.getList(params).then((res) => {
        if (res.data.flag) {
          this.tableData.isPage = false
          this.tableData.page.Allpage = res.data.result.totalElements
          this.tableData.data = res.data.result.content
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
            this.tableData.data.forEach(e => {
              // 处理审图员状态（0 离岗-》停止分派、1 在岗-》分派中、2 在线、3 离线）
              e.statusName = this.statusFilter(e.status)
              e.operation = [
                {
                  func: this.handleRecovery,
                  label: `<span class='iconfont editTable'>&#xe679;</span>`,
                  title: this.$t('vicenter.inspection.manageAssign.taskRecovery'),
                  show: true
                }
              ]
            })
          }
        }
      }).catch(() => {})
    },
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.$data.selRowId = idArr.join(',')
      this.selRowStatus = data.map(el => {
        return el.status
      })
    },
    handleStartOrStop (data) {
      if (this.$refs.analystTable.selectedData.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.inspection.manageAssign.noSelected'))
        return false
      }
      // 验证用户状态能否进行操作  开始分派仅能选择在线2和停止分派0  停止分派仅能选择分派中1的审图员
      // 审图员状态（0 离岗-》停止分派、1 在岗-》分派中、2 在线、3 离线）
      let startFlag = this.selRowStatus.indexOf('1') === -1 && this.selRowStatus.indexOf('3') === -1
      let stopFlag = this.selRowStatus.indexOf('0') === -1 && this.selRowStatus.indexOf('2') === -1 && this.selRowStatus.indexOf('3') === -1
      let msg = ''
      if (data === '1' && !startFlag) {
        msg = this.$t('vicenter.inspection.manageAssign.startAssignTip')
      }
      if (data === '0' && !stopFlag) {
        msg = this.$t('vicenter.inspection.manageAssign.stopAssignTip')
      }
      if (msg !== '') {
        this.$NotifPrompt(msg)
        return false
      }
      let params = {
        type: data,
        ids: this.$data.selRowId
      }
      let confirmInfo = (data === '1') ? this.$t('vicenter.inspection.manageAssign.confirmStartAssign') : this.$t('vicenter.inspection.manageAssign.confirmStopAssign')
      let successInfo = (data === '1') ? this.$t('vicenter.inspection.manageAssign.successAssign') : this.$t('vicenter.inspection.manageAssign.successStopAssign')
      this.$ConfirmBox(confirmInfo, () => {
        ajax.doStart(params).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(successInfo)
            this.query(true)
            this.getTaskStatistic()
          }
        }).catch(() => {})
      })
    },
    handleRecovery (data) {
      let params = {
        ids: ''
      }
      if (data === 'Multiple') {
        if (this.$refs.analystTable.selectedData.length === 0) {
          this.$NotifPrompt(this.$t('vicenter.inspection.manageAssign.noSelected'))
          return
        } else {
          params.ids = this.$data.selRowId
        }
      } else {
        params.ids = data.row.id
      }
      this.$ConfirmBox(this.$t('vicenter.inspection.manageAssign.confirmRecoveryTask'), () => {
        ajax.recoveryTask(params).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.inspection.manageAssign.successRecovery'))
            this.query(true)
            this.getTaskStatistic()
          }
        }).catch(() => {})
      })
    },
    // 状态转换  // 审图员状态（0 离岗-》停止分派、1 在岗-》分派中、2 在线、3 离线）
    statusFilter (status) {
      let res = ''
      switch (status) {
        case '0': res = 'vicenter.inspection.manageAssign.stopAssign'; break
        case '1': res = 'vicenter.inspection.manageAssign.assigning'; break
        case '2': res = 'vicenter.inspection.manageAssign.online'; break
        case '3': res = 'vicenter.inspection.manageAssign.offline'; break
      }
      return this.$t(res)
    },
    getSort () {
    },
    query (isPage = true) { // huoqu
      let params = {}
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      this.getList(params)
      if (isPage) {
        // 清空已勾选的表格行
        this.$refs.analystTable.$refs['taskAssignTable'].clearSelection()
      }
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
  beforeRouteLeave (to, from, next) {
    this.$clearRefresh(this.refresh)
    next()
  },
  components: { breadCrumb, panelTitle, ComTable }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.Manage-Assign-bar {
  @extend .extend-bar;
  .Manage-Assign-M {
    padding:$margin;
    @include box-sizing;
    .assignInfo {
      @include flex(column, flex-start, flex-start);
      height: calc(100% - 35px);
      .statisticInfo {
        text-align: left;
        margin: $dis10*2;
        span {
          i {
            font-style: normal;
            margin: 0 $dis10;
          }
        }
      }
      .panel {
        @extend .extend-panel;
        height: calc(100% - 50px);
      }
      .panel-L {
        width: $all;
        .form-bar {
          width: $all;
          @media screen and (min-width: 1640px) {
            height: $all;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
