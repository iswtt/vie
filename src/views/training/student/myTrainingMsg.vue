<template>
  <div class='myTrainingList-bar' v-bar>
    <div class="myTrainingList-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button data-id="back-btn" type="white" size="mini" @click='goBack'>{{$t('vicenter.common.back')}}</el-button>
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
            <ComTable @listenToSelectDataEvent="rowSelection" ref="publicClassTable" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
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
import upload from '@/components/uploadPreview'
import Dialog from '@/components/dialog'
import Exercise from '@/components/training/exercise'

import req from '@/api/training/teacher'
import reqStu from '@/api/training/student'
import error from '../../common/error'
export default {
  name: 'demo',
  data () {
    return {
      titleBread: {},
      panelTitle: {},
      searchIpt: [ // 查询表单
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
          ruleProp: 'traName'
        }
      ],
      tableGroup: [ // 表格数据列
        {
          type: 'selection',
          width: '40px'
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
          model: 'traCourTrueName'
        },
        {
          type: 'text',
          model: 'createTime'
        }
      ],
      formRule: { // 查询表单规则
        model: {
          traCourType: '',
          traName: ''
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
      tableData: { // 表格数据
        refName: 'publicClassTableChildrenTable',
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
      selectCour: [], // 选中的公开课
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {},
  activated () {
    this.$refs.publicClassTable.$refs.publicClassTableChildrenTable.clearSelection() // keep-alive 重新进入清除之前选中数据
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
            // path: '/Training/student/index' // 跳转路径
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
        }
      }
      // 查询和重置按钮
      this.SearchFunc.queryText = this.$t('vicenter.common.query')
      this.SearchFunc.resetText = this.$t('vicenter.common.reset')
      // 查询条件
      this.searchIpt.forEach((e) => {
        if (e.ruleProp === 'traCourType') {
          e.getLabel = this.$t('vicenter.training.common.trainingType')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingType')
        } else if (e.ruleProp === 'traName') {
          e.getLabel = this.$t('vicenter.training.common.trainingName')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'typeName') {
          e.label = this.$t('vicenter.training.common.trainingType')
        } else if (e.model === 'traName') {
          e.label = this.$t('vicenter.training.common.trainingName')
        } else if (e.model === 'traCourTrueName') {
          e.label = this.$t('vicenter.training.common.founder')
        } else if (e.model === 'createTime') {
          e.label = this.$t('vicenter.training.common.createTime')
        }
      })
      this.query()
    },
    /**
     * 初始化下拉值
     */
    getOptions () {
      let loadCase = this.$initLoading()
      req.getTraDictInfo({dictId: '100'})
        .then(res => {
          this.searchIpt[0].option = res.data.result.map(e => { return {value: e.dictId, label: this.$t(`vicenter.training.common.trainingTypeList.${e.dictId.toString()}`)} })
          loadCase.close()
        })
        .catch(err => {
          loadCase.close()
          console.log(err)
        })
    },
    // 新增
    handleCreate () {
      // console.log(this.selectCour)
      if (this.selectCour.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.training.manager.notAddErrorOne'))
        return
      }
      let obj = {}
      obj.traInfoList = JSON.stringify(this.selectCour.map(e => { return {traId: e.traId, traUsreCount: e.traUsreCount} }))
      obj.userId = sessionStorage.getItem('userId')
      obj.pcUserName = sessionStorage.getItem('account')
      obj.pcTyueName = sessionStorage.getItem('userName')
      reqStu.addGkCourInfoByStu(obj)
        .then(res => {
          console.log(res)
          this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
          this.goBack()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 返回
    goBack () {
      this.$router.push({path: '/Training/student/myTrainingList'})
    },
    resetForm () {
      this.formRule.model = {
        traCourType: '',
        traName: ''
      }
      this.query()
    },
    query () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      this.getList(params)
    },
    getList (params) {
      reqStu.getTraGkCourPageInfoByStu({ ...params, page: this.tableData.page.CurrentPage, size: this.tableData.page.pagesize, userId: sessionStorage.getItem('userId') })
        .then(res => {
          console.log(res)
          let tableData = res.data.result
          if (tableData) {
            tableData.content.forEach(item => {
              item.createTime = this.$options.filters['formatDate'](item.traCreateTime, this.$t('vicenter.common.formatDate'))
              item.typeName = this.$t(`vicenter.training.common.trainingTypeList.${item.traCourType.toString()}`)
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
    handleSizeChange (val) {
      this.tableData.page.pagesize = val
      this.query()
    },
    handleCurrentChange (val) {
      this.tableData.page.CurrentPage = val - 1
      this.query()
    },
    rowSelection (d) {
      this.selectCour = d
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
        imageName: '',
        scanSerialNumber: '',
        imageStatus: '',
        imageType: '',
        imageCollectMode: '',
        siteId: '',
        deviceId: '',
        seizedType: '',
        seizedLocation: '',
        createTime: [],
        imgPublishTime: [],
        imageDesc: '',
        hsCodes: ''
      }
      this.selectObj = {
        hsCodes: '',
        siteId: '',
        deviceId: ''
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { bread, ComForm, panelTitle, ComTable, upload, Dialog, Exercise }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.myTrainingList-bar {
  @extend .extend-bar;
  .myTrainingList-M {
    padding:$margin;
    @include box-sizing;
    .operation-group {
      @include flex(row, flex-end, center);
      margin-bottom: $dis10;
    }
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
    .formDialog {
      .search-form {
        // @include layout(3);
      }
      .tableComp{
        padding: 0
      }
    }
  }

}
</style>
