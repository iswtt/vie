<template>
  <div class='trainingList-bar' v-bar>
    <div class="trainingList-M">
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
            <ComTable ref="trainingListTable" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'

import req from '@/api/training/teacher'
export default {
  name: 'demo',
  data () {
    return {
      modalData: {
        flag: false,
        title: this.$t('vicenter.training.common.add')
      },
      titleBread: {}, // 面包屑
      panelTitle: {}, // 标题栏
      searchIpt: [ // 查询表单
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'traClass'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'traCourType'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          maxlength: 50,
          ruleProp: 'traName'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          maxlength: this.$globalData.threshold,
          subKey: 'traCourTrueName',
          ruleProp: 'traCourTrueName'
        },
        {
          type: 'datetimerange',
          models: '',
          valueFormat: 'timestamp',
          ruleProp: 'createTime',
          editable: false,
          blur: this.blur,
          focus: this.focus
        }
      ],
      tableGroup: [ // 表格数据列
        {
          type: 'index',
          model: 'serialNumber'
        },
        {
          type: 'text',
          model: 'className'
        },
        {
          type: 'text',
          model: 'typeName'
        },
        {
          type: 'text',
          model: 'traName'
        },
        {
          type: 'text',
          model: 'traUsreCount'
        },
        {
          type: 'text',
          model: 'traCourCount'
        },
        {
          type: 'text',
          model: 'traCourTrueName'
        },
        {
          type: 'text',
          model: 'createTime'
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
          func: this.handleDelete, // 删除
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          show: true
        }
      ],
      formRule: { // 查询表单规则
        model: {
          traClass: '',
          traCourType: '',
          traName: '',
          traCourTrueName: '',
          createTime: []
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
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
      selRowId: '',
      isList: true,
      selectObj: {
        hsCodes: '',
        siteId: '',
        deviceId: ''
      },
      seizedGoodsData: [
        {
          ruleProp: 'contrabandType',
          option: []
        },
        {
          ruleProp: 'contrabandLocation',
          option: []
        }
      ],
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
      this.getOptions()
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
          title: this.$t('vicenter.training.common.dialogTitleOne')
        },
        dialogTitleTwo: {
          title: this.$t('vicenter.training.common.dialogTitleTwo')
        },
        dialogTitleThree: {
          title: this.$t('vicenter.training.common.dialogTitleThree')
        }
      }
      // 查询和重置按钮
      this.SearchFunc.queryText = this.$t('vicenter.common.query')
      this.SearchFunc.resetText = this.$t('vicenter.common.reset')
      // 操作列按钮提示
      let operateTitle = [
        this.$t('vicenter.common.detail'),
        this.$t('vicenter.common.fix'),
        this.$t('vicenter.common.delete')
      ]
      operateTitle.forEach((e, index) => {
        this.operation[index].title = e
      })
      // 查询条件
      this.searchIpt.forEach((e) => {
        if (e.ruleProp === 'traClass') {
          e.getLabel = this.$t('vicenter.training.common.trainingClassification')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingClassification')
        } else if (e.ruleProp === 'traCourType') {
          e.getLabel = this.$t('vicenter.training.common.trainingType')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingType')
        } else if (e.ruleProp === 'traName') {
          e.getLabel = this.$t('vicenter.training.common.trainingName')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName')
        } else if (e.ruleProp === 'traCourTrueName') {
          e.getLabel = this.$t('vicenter.training.common.founder')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.founder')
        } else if (e.ruleProp === 'createTime') {
          e.getLabel = this.$t('vicenter.training.common.createTime')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.createTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'serialNumber') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'className') {
          e.label = this.$t('vicenter.training.common.trainingClassification')
        } else if (e.model === 'typeName') {
          e.label = this.$t('vicenter.training.common.trainingType')
        } else if (e.model === 'traName') {
          e.label = this.$t('vicenter.training.common.trainingName')
        } else if (e.model === 'traUsreCount') {
          e.label = this.$t('vicenter.training.common.numberOfStudents')
        } else if (e.model === 'traCourCount') {
          e.label = this.$t('vicenter.training.common.numberOfCourseware')
        } else if (e.model === 'traCourTrueName') {
          e.label = this.$t('vicenter.training.common.founder')
        } else if (e.model === 'createTime') {
          e.label = this.$t('vicenter.training.common.createTime')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
    },
    /**
     * 初始化下拉值
     */
    getOptions () {
      let loadCase = this.$initLoading()
      let reqArr = [req.getTraDictInfo({dictId: '100'}), req.getTraDictInfo({dictId: '200'})]
      Promise.all(reqArr)
        .then(res => {
          console.log(res)
          let _type = res[0].data.result
          let _classify = res[1].data.result
          // 培训分类
          this.searchIpt[0].option = _classify.map(e => { return {value: e.dictId, label: this.$t(`vicenter.training.common.trainingClassificationList.${e.dictId.toString()}`)} })
          // 培训类型
          this.searchIpt[1].option = _type.map(e => { return {value: e.dictId, label: this.$t(`vicenter.training.common.trainingTypeList.${e.dictId.toString()}`)} })
          this.query()
          loadCase.close()
        })
        .catch(err => {
          loadCase.close()
          console.log(err)
        })
    },
    // 重置
    resetForm () {
      this.formRule.model = {
        traClass: '',
        traCourType: '',
        traName: '',
        tarCreateUser: '',
        createTime: []
      }
      // this.query()
    },
    // 搜索
    query () {
      let params = {}
      // this.formRule.model
      params = JSON.parse(JSON.stringify(this.formRule.model))
      let { createTime } = this.formRule.model
      delete params.createTime
      if (createTime != null && createTime.length === 2) {
        params.starTime = this.$options.filters['formatDate'](createTime[0], this.$t('vicenter.common.formatDate'))
        params.endTime = this.$options.filters['formatDate'](createTime[1], this.$t('vicenter.common.formatDate'))
      }
      this.getList(params)
    },
    getList (params) {
      req.getTraPageInfo({ ...params, page: this.tableData.page.CurrentPage, size: this.tableData.page.pagesize })
        .then(res => {
          let tableData = res.data.result
          if (tableData) {
            tableData.content.forEach(item => {
              item.createTime = this.$options.filters['formatDate'](item.traCreateTime, this.$t('vicenter.common.formatDate'))
              item.className = this.$t(`vicenter.training.common.trainingClassificationList.${item.traClass.toString()}`)
              item.typeName = this.$t(`vicenter.training.common.trainingTypeList.${item.traCourType.toString()}`)
              // 只可以修改和删除自己创建的培训
              item.operation = sessionStorage.getItem('userId') === item.tarCreateUser ? this.operation : [this.operation[0]]
            })
            this.tableData.data = tableData.content
            if (this.tableData.data.length > 0) {
              this.tableData.isPage = true
            }
            this.tableData.page.Allpage = tableData.totalElements
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 新增
    handleCreate () {
      sessionStorage.removeItem('traId')
      sessionStorage.removeItem('traType')
      this.$router.push({
        path: '/Training/teacher/trainingAdd'
      })
    },
    // 详情
    getDetail (scope) {
      sessionStorage.setItem('traId', scope.row.traId)
      sessionStorage.setItem('traType', 'detail')
      this.$router.push({
        path: '/Training/teacher/trainingMsg'
      })
    },
    // 修改
    toEdit (scope) {
      sessionStorage.setItem('traId', scope.row.traId)
      sessionStorage.setItem('traType', 'edit')
      this.$router.push({
        path: '/Training/teacher/trainingEdit'
      })
    },
    // 删除
    handleDelete (scope) {
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toDelete'), () => {
        req.delTraInfo({ traId: scope.row.traId })
          .then(res => {
            if (res.data.message) {
              this.$NotifError(this.$t('vicenter.training.common.notDelete'))
            } else {
              this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
              this.query()
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    // 分页数据 页改变
    handleCurrentChange (val) {
      console.log(val)
      this.tableData.page.CurrentPage = val - 1
      this.query()
    },
    // 分页数据 每页条数改变
    handleSizeChange (val) {
      console.log(val)
      this.tableData.page.pagesize = val
      this.query()
    },
    getSort () {}
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/ImageLibrary/imageManagement/imageDetails' && to.path !== '/ImageLibrary/imageManagement/ImageEdit' && to.path !== '/ImageLibrary/imageManagement/ImageCreate' && to.path !== '/ImageLibrary/imageManagement/imagePreview') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        traClass: '',
        traCourType: '',
        traName: '',
        tarCreateUser: '',
        createTime: []
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { bread, ComForm, panelTitle, ComTable, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.trainingList-bar {
  @extend .extend-bar;
  .trainingList-M {
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
