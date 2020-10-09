<template>
  <div class='testPaperList-bar' v-bar>
    <div class="testPaperList-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm ref="searchFormRef"  :searchIpt="searchIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button data-id="add-btn" type="primary" size="mini" @click='handleCreate'>{{$t('vicenter.training.common.add')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="testPaperListTable"  :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <Dialog :modalData="modalData" v-if="modalData.flag" class="formDialog">
        <Exercise  data-id="detailExercise" :testListData="testList" :testImgData="testImg" :params="exerciseParams"></Exercise>
      </Dialog>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import Exercise from '@/components/training/exercise'
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajax from '@/api/training/teacher.js'
export default {
  name: 'demo',
  data () {
    return {
      modalData: {
        flag: false,
        width: '65%',
        title: this.$t('vicenter.training.common.msg')
      },
      titleBread: {}, // 面包屑
      panelTitle: {}, // 标题栏
      searchIpt: [ // 查询表单
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'testListClass'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'testListName'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'testListStatus'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          maxlength: this.$globalData.threshold,
          ruleProp: 'testListCreateUser'
        },
        {
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'testListCreateTime',
          editable: false,
          blur: this.blur,
          focus: this.focus
        }
      ],
      formRule: { // 查询表单规则
        model: {
          testListClass: '',
          testListName: '',
          testListStatus: '',
          testListCreateUser: '',
          testListCreateTime: []
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
      tableGroup: [ // 表格数据列
        {
          type: 'index',
          model: 'serialNumber'
        },
        {
          type: 'text',
          model: 'testListClassTableGroup'
        },
        {
          type: 'text',
          model: 'testListName'
        },
        {
          type: 'text',
          model: 'testListStatus'
        },
        {
          type: 'text',
          model: 'testListCount'
        },
        {
          type: 'text',
          model: 'testListPassCount'
        },
        {
          type: 'text',
          model: 'pcName'
        },
        {
          type: 'text',
          model: 'testListCreateTime'
        },
        {
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      operation: [
        {
          func: this.getDetail, // 查看
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          show: true
        },
        {
          func: this.toEdit, // 修改
          label: `<span class='iconfont editTable'>&#xe650;</span>`,
          show: true
        },
        {
          func: this.handleRelease, // 发布
          label: `<span class='iconfont editTable'>&#xe702;</span>`,
          show: true
        },
        {
          func: this.handleDelete, // 删除
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          show: true
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange
        },
        sortMethod: this.getSort
      },
      testList: [
        {
          models: '',
          ruleProp: 'testListClassTableGroup'
        },
        {
          models: '',
          ruleProp: 'testListName'
        },
        {
          models: '',
          ruleProp: 'testListCount'
        },
        {
          models: '',
          ruleProp: 'testListPassCount'
        },
        {
          models: '',
          ruleProp: 'testListDesc'
        },
        {
          models: '',
          ruleProp: 'testListStatus'
        },
        {
          models: '',
          ruleProp: 'pcName'
        },
        {
          models: '',
          ruleProp: 'testListCreateTime'
        }
      ], // 试卷数据
      testImg: [], // 试题列表
      exerciseParams: { // exercise子组件参数
        colSpan: 1, // 图像分几列
        exerciseType: 1, // Exercise组件类型1：老师答案
        isExerciseRight: false, // 是否有计时
        isAnswer: false, // 是否答题
        isExamRecord: false // 是否显示考试结果
      },
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {},
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            // path: '/Training/teacher/index' // 跳转路径
            path: '/Training/index' // 跳转路径
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
        },
        dialogTitleOne: {
          title: this.$t('vicenter.training.common.basicInformation')
        }
      }
      // 查询和重置按钮
      this.SearchFunc.queryText = this.$t('vicenter.common.query')
      this.SearchFunc.resetText = this.$t('vicenter.common.reset')
      // 操作列按钮提示
      let operateTitle = [
        this.$t('vicenter.common.detail'),
        this.$t('vicenter.common.fix'),
        this.$t('vicenter.training.common.release'),
        this.$t('vicenter.common.delete')
      ]
      // console.log(this.operation)
      operateTitle.forEach((e, index) => {
        this.operation[index].title = e
      })
      // 查询条件
      this.searchIpt.forEach((e) => {
        if (e.ruleProp === 'testListClass') {
          e.getLabel = this.$t('vicenter.training.common.testPaperClassification')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.testPaperClassification')
          e.option = [
            {
              value: 0,
              label: this.$t('vicenter.training.common.testPaperClassificationList.0')
            },
            {
              value: 1,
              label: this.$t('vicenter.training.common.testPaperClassificationList.1')
            }
          ]
        } else if (e.ruleProp === 'testListName') {
          e.getLabel = this.$t('vicenter.training.common.testPaperName')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testPaperName')
        } else if (e.ruleProp === 'testListStatus') {
          e.getLabel = this.$t('vicenter.training.common.testPaperStatus')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.testPaperStatus')
          e.option = [
            {
              value: 2,
              label: this.$t('vicenter.training.common.testPaperStatusList.2')
            },
            {
              value: 0,
              label: this.$t('vicenter.training.common.testPaperStatusList.0')
            }
          ]
        } else if (e.ruleProp === 'testListCreateUser') {
          e.getLabel = this.$t('vicenter.training.common.founder')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.founder')
        } else if (e.ruleProp === 'testListCreateTime') {
          e.getLabel = this.$t('vicenter.training.common.createTime')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.createTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'serialNumber') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'testListClassTableGroup') {
          e.label = this.$t('vicenter.training.common.testPaperClassification')
        } else if (e.model === 'testListName') {
          e.label = this.$t('vicenter.training.common.testPaperName')
        } else if (e.model === 'testListStatus') {
          e.label = this.$t('vicenter.training.common.testPaperStatus')
        } else if (e.model === 'testListCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.model === 'testListPassCount') {
          e.label = this.$t('vicenter.training.common.passNumber')
        } else if (e.model === 'pcName') {
          e.label = this.$t('vicenter.training.common.founder')
        } else if (e.model === 'testListCreateTime') {
          e.label = this.$t('vicenter.training.common.createTime')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      // exercise
      this.testList.forEach((e) => {
        if (e.ruleProp === 'testListClassTableGroup') {
          e.label = this.$t('vicenter.training.common.testPaperClassification')
        } else if (e.ruleProp === 'testListName') {
          e.label = this.$t('vicenter.training.common.testPaperName')
        } else if (e.ruleProp === 'testListStatus') {
          e.label = this.$t('vicenter.training.common.testPaperStatus')
        } else if (e.ruleProp === 'testListCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.ruleProp === 'testListPassCount') {
          e.label = this.$t('vicenter.training.common.passNumber')
        } else if (e.ruleProp === 'testListDesc') {
          e.label = this.$t('vicenter.training.common.testPaperDescription')
        } else if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.founder')
        } else if (e.ruleProp === 'testListCreateTime') {
          e.label = this.$t('vicenter.training.common.createTime')
        } else if (e.ruleProp === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.query()
    },
    query () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      // console.log(this.searchIpt[this.searchIpt.length - 1].models)
      let testListCreateTime = this.searchIpt[this.searchIpt.length - 1].models
      if (testListCreateTime.length > 0) {
        params.startTime = this.$options.filters['formatDate'](testListCreateTime[0], this.$t('vicenter.common.formatDate'))
        params.endTime = this.$options.filters['formatDate'](testListCreateTime[1], this.$t('vicenter.common.formatDate'))
        delete params.testListCreateTime
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      // console.log(params)
      this.getList(params)
    },
    getList (params) {
      this.openLoading()
      ajax.getTestPaper(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result
          this.tableData.data = content
          this.tableData.data.forEach(item => {
            // console.log(item)
            let operation = this.operation.map(item => ({...item}))
            // 操作
            if (item.testListStatus === 0 || item.testListCreateUser !== sessionStorage.getItem('userId')) {
              for (let [key, val] of operation.entries()) {
                if (key !== 0) {
                  val.show = false
                }
              }
              item.operation = operation
            } else if (item.testListStatus !== 0 && item.testListCreateUser === sessionStorage.getItem('userId')) {
              item.operation = operation
            }
            // 创建时间
            item.testListCreateTime = this.$options.filters['formatDate'](item.testListCreateTime, this.$t('vicenter.common.formatDate'))
            // 试卷分类
            item.testListClassTableGroup = this.$t(`vicenter.training.common.testPaperClassificationList.${item.testListClass}`)
            // 试卷状态
            item.testListStatus = this.$t(`vicenter.training.common.testPaperStatusList.${item.testListStatus}`)
          })

          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
          this.tableData.page.CurrentPage = pageable.pageNumber
          this.tableData.page.pagesize = pageable.pageSize
          this.tableData.page.Allpage = totalElements
          // 查询条件
          this.formRule.model.page = pageable.pageNumber
          this.formRule.model.size = pageable.pageSize
        }
      })
    },
    // 新增
    handleCreate () {
      this.$router.push({
        path: '/Training/teacher/testPaperMsgAdd'
      })
    },
    // 发布
    handleRelease (scope) {
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toRelease'), () => {
        let params = {}
        params.testListId = scope.row.testListId
        params.testListStatus = 0
        this.updateState(params)
      })
    },
    // 删除
    handleDelete (scope) {
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toDelete'), () => {
        console.log(1111)
        let params = {}
        params.testListId = scope.row.testListId
        params.testListStatus = 1
        this.updateState(params)
      })
    },
    // 更改试卷状态
    updateState (params) {
      ajax.updateTestPaperStatus(params).then((res) => {
        console.log(res)
        if (res.data.flag) {
          if (params.testListStatus === 0) {
            this.$NotifSuccess(this.$t('vicenter.training.common.releaseSuccess'))
          } else {
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
          }
          this.query()
        }
      })
    },
    resetForm () {
      // this.query()
    },
    // 详情
    getDetail (scope) {
      console.log(scope.row)
      this.$initSearchIpt(this.testList, scope.row)
      this.getTestPaperInfo(scope.row.testListId)
    },
    // 查看试卷详情
    getTestPaperInfo (testListId) {
      this.openLoading()
      ajax.getTestPaperInfo({testListId: testListId}).then(res => {
        // console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          let {conEntities} = res.data.result
          conEntities.forEach((item, index) => {
            item.serialNumber = index + 1
          })
          console.log(conEntities)
          this.testImg = conEntities
          this.modalData.flag = true
        }
      })
    },
    toEdit (scope) {
      console.log(scope.row)
      sessionStorage.setItem('testListId', scope.row.testListId)
      this.$router.push({
        path: '/Training/teacher/testPaperMsgEdit'
      })
    },
    handleReview (scope) {},
    toRelease (id) {},
    toUnRelease (id) {},
    toReject (scope) {},
    toDelete (id) {},
    handleSizeChange (val) {
      this.formRule.model.size = val
      this.formRule.model.page = 0
      this.$set(this.tableData.page, 'pagesize', val)
      this.SetpageQuery(0)
    },
    handleCurrentChange (val) {
      this.formRule.model.page = val - 1
      this.SetpageQuery(this.formRule.model.page)
    },
    SetpageQuery (page) { // 查询设置页
      var times = {}
      if (this.formRule.model.testListCreateTime === null || this.formRule.model.testListCreateTime.length === 0) {
        times = {}
      } else {
        times = {
          startTime: this.$options.filters['formatDate'](this.formRule.model.testListCreateTime[0], this.$t('vicenter.common.formatDate')),
          endTime: this.$options.filters['formatDate'](this.formRule.model.testListCreateTime[1], this.$t('vicenter.common.formatDate'))
        }
      }
      var value = {
        testListClass: this.formRule.model.testListClass,
        testListName: this.formRule.model.testListName,
        testListStatus: this.formRule.model.testListStatus,
        testListCreateUser: this.formRule.model.testListCreateUser,
        // testListCreateTime: this.formRule.model.testListCreateTime,
        page: page,
        size: this.tableData.page.pagesize
      }
      var val = Object.assign({}, value, times)
      this.getList(val)
    },
    focus () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      if (picker) {
        picker.addEventListener('click', function () {
          for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
            picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
          }
        })
      }
    },
    blur () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      picker.addEventListener('click', function () {
        for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
          picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
        }
      })
    },
    getSort () {},
    treeClick (data) {
    },
    // 打开loading
    openLoading () {
      this.$initLoading()
    },
    // 关闭loading
    closeLoading () {
      this.$initLoading().close()
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Training/teacher/testPaperMsgAdd' && to.path !== '/Training/teacher/testPaperMsgEdit') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        testListClass: '',
        testListName: '',
        testListStatus: '',
        testListCreateUser: '',
        testListCreateTime: []
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { bread, ComForm, panelTitle, ComTable, Exercise, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.testPaperList-bar {
  @extend .extend-bar;
  .testPaperList-M {
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
          @include layout(3);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
        .editTable {
          margin: 0 5px;
        }
      }
    }
  }
}
</style>
