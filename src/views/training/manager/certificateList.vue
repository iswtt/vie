<template>
  <div class='certificateList-bar' v-bar>
    <div class="certificateList-M">
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
            <ComTable ref="certificateListTable" @listenToSelectDataEvent='selectRow' :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
        <Dialog :modalData="detailData">
          <div class="certificatePreview-img" data-id="certificatePreview-div">
            <img :src="imgUrl" alt="">
          </div>
          <div class="resultbutton">
            <el-button data-id="download-btn" type="warning" size="medium" @click="download">{{$t('vicenter.training.common.download')}}</el-button>
            <el-button data-id="print-btn" type="primary" size="medium" @click="print">{{$t('vicenter.training.common.print')}}</el-button>
          </div>
        </Dialog>
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
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajax from '@/api/training/manager.js'
import printJS from 'print-js'
import vm from '../../../main'
export default {
  name: 'demo',
  data () {
    const config = window.config
    return {
      detailData: {
        flag: false,
        title: this.$t('vicenter.training.common.msg')
      },
      imgUrl: '',
      downLoadUrl: '',
      titleBread: {},
      panelTitle: {},
      searchIpt: [ // 查询表单
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'pcUserName'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'account'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'type'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          maxlength: 12,
          ruleProp: 'certificateNumber'
        },
        {
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'createTime',
          editable: false,
          blur: this.blur,
          focus: this.focus
        }
      ],
      formRule: { // 查询表单规则
        model: {
          pcUserName: '',
          account: '',
          type: '',
          certificateNumber: '',
          createTime: []
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
          model: 'index',
          width: '60px'
        },
        {
          type: 'text',
          model: 'pcUserName'
        },
        {
          type: 'text',
          model: 'pcUserNo'
        },
        {
          type: 'text',
          model: 'credNo'
        },
        {
          type: 'text',
          model: 'credType'
        },
        {
          type: 'text',
          model: 'credTime'
        },
        {
          type: 'operation',
          model: 'operation',
          width: '150',
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
      // 操作列按钮提示
      let operateTitle = [
        this.$t('vicenter.common.detail'),
        this.$t('vicenter.common.delete')
      ]
      operateTitle.forEach((e, index) => {
        this.operation[index].title = e
      })
      // 查询条件
      this.searchIpt.forEach((e) => {
        if (e.ruleProp === 'pcUserName') {
          e.getLabel = this.$t('vicenter.training.common.name')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.name')
        } else if (e.ruleProp === 'account') {
          e.getLabel = this.$t('vicenter.training.common.account')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.account')
        } else if (e.ruleProp === 'type') {
          e.getLabel = this.$t('vicenter.training.common.certificateType')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.certificateType')
          e.option = [
            {
              value: 0,
              label: this.$t('vicenter.training.common.certificateTypeList.0')
            },
            {
              value: 1,
              label: this.$t('vicenter.training.common.certificateTypeList.1')
            }
          ]
        } else if (e.ruleProp === 'certificateNumber') {
          e.getLabel = this.$t('vicenter.training.common.certificateNo')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.certificateNo')
        } else if (e.ruleProp === 'createTime') {
          e.getLabel = this.$t('vicenter.training.common.dateOfIssue')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'index') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'pcUserName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.model === 'pcUserNo') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.model === 'credNo') {
          e.label = this.$t('vicenter.training.common.certificateNo')
        } else if (e.model === 'credType') {
          e.label = this.$t('vicenter.training.common.certificateType')
        } else if (e.model === 'credTime') {
          e.label = this.$t('vicenter.training.common.dateOfIssue')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.query()
    },
    // 查询
    query () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      let { createTime } = this.formRule.model
      if (createTime != null && createTime.length === 2) {
        params.startTime = this.$options.filters['formatDate'](createTime[0], this.$t('vicenter.common.formatDate'))
        params.endTime = this.$options.filters['formatDate'](createTime[1], this.$t('vicenter.common.formatDate'))
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      this.getList(params)
    },
    getList (params) {
      this.openLoading()
      ajax.getCertificate(params).then((res) => {
        // console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result
          console.log(content)
          this.tableData.data = content
          this.tableData.data.forEach(item => {
            item.operation = this.operation
            item.credType = this.$t(`vicenter.training.common.certificateTypeList.${item.credType}`)
            item.credTime = this.$options.filters['formatDate'](item.credTime, this.$t('vicenter.common.formatDate'))
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
    handleCreate () {
      this.$router.push(
        {
          path: '/Training/manager/certificateMsg'
        }
      )
    },
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.$data.selRowId = idArr.join(',')
    },
    resetForm () {
      // this.query()
    },
    // 详情
    getDetail (scope) {
      let url = scope.row.credFileOne
      if (!url) {
        return this.$NotifError(this.$t('vicenter.training.common.certificateNotGenerated'))
      }
      this.imgUrl = config.trainingUI.fileUrl + url
      this.downLoadUrl = scope.row.credFileTwo
      this.detailData.flag = true
    },
    // 删除
    handleDelete (scope) {
      // console.log(scope)
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toDelete'), () => {
        let params = {}
        params.credId = scope.row.credId
        ajax.deleteCertificate(params).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
            this.query()
          }
        })
      })
    },
    // 打印
    print () {
      printJS(this.imgUrl, 'image')
    },
    // 下载
    download () {
      // let fileName = this.imgUrl.substring(this.imgUrl.lastIndexOf('/') + 1, this.imgUrl.length)
      let fileName = this.downLoadUrl
      console.log(fileName)
      var url = config.trainingUI.baseUrl + `/api/downFile?fileName=${fileName}&type=attachment`
      window.open(url)
    },
    toEdit (scope) {},
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
      if (this.formRule.model.createTime === null || this.formRule.model.createTime.length === 0) {
        times = {}
      } else {
        times = {
          startTime: this.$options.filters['formatDate'](this.formRule.model.createTime[0], this.$t('vicenter.common.formatDate')),
          endTime: this.$options.filters['formatDate'](this.formRule.model.createTime[1], this.$t('vicenter.common.formatDate'))
        }
      }
      var value = {
        pcUserName: this.formRule.model.pcUserName,
        account: this.formRule.model.account,
        type: this.formRule.model.type,
        certificateNumber: this.formRule.model.certificateNumber,
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
  components: { bread, ComForm, panelTitle, ComTable, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.certificateList-bar {
  @extend .extend-bar;
  .certificateList-M {
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
    .certificatePreview-img{
      @include flex(row, center, center);
      img{
        width: 30%;
      }
    }
    .resultbutton {
      margin-top: $margin;
    }
  }

}
</style>
