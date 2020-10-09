<template>
  <div id='background-appVersion-bar' v-bar>
    <div class="background-appVersion-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="formIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
         <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button data-id="addApp-btn" type="primary" size="mini" @click="handleAdd">{{$t('vicenter.common.add')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <Dialog :modalData="modalData">
        <div v-loading="addLoading" element-loading-background="rgba(255, 255, 255, 0.8)">
          <el-upload
            class="upload-application"
            ref="appUpload"
            name='attachFile'
            drag
            with-credentials
            :accept="uploadOption.accept"
            :limit="uploadOption.limit"
            :action="uploadOption.action"
            :headers='uploadOption.headers'
            :on-change="uploadOption.handleChange"
            :on-success='uploadOption.handleUploadSuccess'
            :on-remove="uploadOption.handleRemove"
            :on-exceed="uploadOption.handleExceed"
            :auto-upload="false"
            :multiple="false">
            <div slot="trigger">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{$t('vicenter.common.uploadPreview.dropFile')}} <em>{{$t('vicenter.common.uploadPreview.clickToUpload')}}</em></div>
              <div class="el-upload__fileType">({{$t('vicenter.common.uploadPreview.typeLimitFileTip', {msg: uploadOption.accept})}})</div>
            </div>
          </el-upload>
          <div class="add-application-button">
            <el-button data-id="save-btn" @click="submitUpload" :disabled="!hasFile" type="primary" size="mini" >{{$t('vicenter.common.save')}}</el-button>
            <el-button data-id="cancel-btn" @click="closeModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/background/appVersion.js'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
import Dialog from '@/components/dialogCommon'
export default {
  name: 'appVersion',
  data () {
    return {
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Background/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      formRule: {
        refName: 'appVersionQueryForm',
        model: {
          appName: ''
        },
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formIpt: [ // 查询表单初始化
        {
          getLabel: this.$t('vicenter.Background.appVersionMgmt.appName'),
          type: 'select',
          models: '',
          ruleProp: 'appName',
          clearable: true, // 可清除
          option: []
        }
      ],
      tableData: { // 表格数据
        refName: 'appVersionTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        }
      },
      tableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.Background.appVersionMgmt.appName'),
          type: 'text',
          model: 'appName'
        },
        {
          label: this.$t('vicenter.Background.appVersionMgmt.versionNo'),
          type: 'text',
          model: 'appVersion'
        },
        {
          label: this.$t('vicenter.Background.appVersionMgmt.releaseDate'),
          type: 'text',
          model: 'releaseTime'
        },
        {
          label: this.$t('vicenter.Background.appVersionMgmt.uploadDate'),
          type: 'text',
          model: 'uploadTime'
        },
        {
          label: this.$t('vicenter.Background.appVersionMgmt.versionType'),
          type: 'text',
          model: 'appType'
        },
        {
          label: this.$t('vicenter.Background.appVersionMgmt.operator'),
          type: 'text',
          model: 'operatorAccount'
        },
        {
          label: this.$t('vicenter.Background.appVersionMgmt.fileSize'),
          type: 'text',
          model: 'fileSize'
        },
        {
          label: this.$t('vicenter.Background.appVersionMgmt.versionInfo'),
          type: 'text',
          model: 'remark'
        }
        // {
        //   label: this.$t('vicenter.common.operation'),
        //   type: 'operation',
        //   model: 'operation'
        // }
      ],
      modalData: {
        width: '600px',
        title: this.$t('vicenter.common.add'),
        flag: false,
        closeModal: this.closeModal
      },
      uploadOption: {
        accept: '.zip',
        limit: 1,
        action: window.config.baseUrl + '/management/systemappversion/upload',
        headers: {
          'X-CSRF-TOKEN': localStorage.getItem('Xcsrftoken'),
          'X-APP-UACCOUNT': sessionStorage.getItem('account')
        },
        handleUploadSuccess: this.handleUploadSuccess,
        handleRemove: this.handleRemove,
        handleExceed: this.handleExceed,
        handleChange: this.handleChange
      },
      addLoading: false,
      hasFile: false
    }
  },
  mounted () {
    this.query()
    this.getAppName()
  },
  methods: {
    query (isPage = true) {
      let params = JSON.parse(JSON.stringify(this.formRule.model))
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      ajax.getList(params).then((res) => {
        if (res.data.flag) {
          this.tableData.isPage = false
          this.tableData.page = {
            pageGroup: [10, 20, 50, 100], // 分页数据
            CurrentPage: res.data.result.pageable.pageNumber, // 当前页码
            pagesize: res.data.result.pageable.pageSize, // 当前分页条数
            Allpage: res.data.result.totalElements, // 总数据
            handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.handleCurrentChange // 当前页码改变触发改函数
          }
          this.tableData.data = res.data.result.content
          this.tableData.data.forEach(e => {
            e.releaseTime = e.releaseTime ? this.$options.filters['formatDate'](e.releaseTime, this.$t('vicenter.common.dayFormat')) : ''
            e.uploadTime = e.uploadTime ? this.$options.filters['formatDate'](e.uploadTime, this.$t('vicenter.common.formatDate')) : ''
            e.appType = e.appType === '0' ? this.$t('vicenter.Background.appVersionMgmt.incremental') : this.$t('vicenter.Background.appVersionMgmt.full')
            e.operation = [
              {
                func: this.handleDownload,
                label: `<span class='iconfont editTable'>&#xe69e;</span>`,
                title: this.$t('vicenter.common.download'),
                show: true
              },
              {
                func: this.handleDelete,
                label: `<span class='iconfont editTable'>&#xe658;</span>`,
                title: this.$t('vicenter.common.delete'),
                show: true
              }
            ]
          })
          this.formRule.model.page = res.data.result.pageable.pageNumber
          this.formRule.model.size = res.data.result.pageable.pageSize
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    getAppName () {
      ajax.getAppName().then((res) => {
        if (res.data.flag) {
          if (res.data.result && res.data.result.length > 0) {
            this.formIpt[0].option = res.data.result.map(item => {
              return {
                label: item,
                value: item
              }
            })
          } else {
            this.formIpt[0].option = []
          }
        }
      }).catch(() => {})
    },
    handleAdd () {
      this.hasFile = false
      this.modalData.flag = true
    },
    submitUpload () {
      this.addLoading = true
      this.$refs.appUpload.submit()
    },
    handleDownload (scope) {
      this.$ConfirmBox(this.$t('vicenter.common.downloadConfirm'), () => {
        let fileUrl = scope.row.src
        let fileName = fileUrl.substring(fileUrl.lastIndexOf('/'), fileUrl.indexOf('.'))
        let a = document.createElement('a')
        a.setAttribute('href', fileUrl)
        a.setAttribute('download', fileName)
        a.click()
      })
    },
    handleDelete (scope) {
      this.$ConfirmBox(this.$t('vicenter.common.deleteConfirm'), () => {
        ajax.deleteInfo({id: scope.row.id}).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
            this.query()
          }
        }).catch(() => {})
      })
    },
    handleChange (file, fileList) {
      let type = file.name.substring(file.name.lastIndexOf('.'))
      let acceptType = this.uploadOption.accept
      if (acceptType.indexOf(type) === -1) {
        this.$NotifError(this.$t('vicenter.common.uploadPreview.typeLimitFileTip', {msg: this.uploadOption.accept}))
        this.$refs.appUpload.clearFiles()
      }
      if (fileList.length > 0) {
        this.hasFile = true
      } else {
        this.hasFile = false
      }
    },
    handleUploadSuccess (response, file, fileList) {
      if (response.flag) {
        this.$NotifSuccess(this.$t('vicenter.common.uploadSuccess'))
        this.addLoading = false
        this.closeModal()
        this.query()
        this.getAppName()
      } else {
        if (response.errorCode) {
          this.$NotifError(this.$t('vicenter.error.' + response.errorCode))
        }
        this.$refs.appUpload.clearFiles()
        this.hasFile = false
        this.addLoading = false
      }
    },
    handleRemove () {
      this.hasFile = false
      this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
    },
    handleExceed (files, fileList) {
      if ((files && files.length > this.uploadOption.limit) || fileList.length === this.uploadOption.limit) {
        this.$NotifError(this.$t('vicenter.common.uploadPreview.overLimitFileTip', {msg: this.uploadOption.limit}))
      }
    },
    handleSizeChange (val) {
      this.$set(this.tableData.page, 'pagesize', val)
      this.query(false)
    },
    handleCurrentChange (val) {
      this.$set(this.tableData.page, 'CurrentPage', val - 1)
      this.query(false)
    },
    closeModal () {
      this.hasFile = false
      this.modalData.flag = false
    },
    getSort () {}
  },
  components: {bread, panelTitle, ComForm, ComTable, Dialog}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#background-appVersion-bar {
  @extend .extend-bar;
  .background-appVersion-M {
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
.upload-application {
  @include flex(column, flex-start, center);
  .el-upload-dragger,.el-upload-list {
    display: block;
    padding: 0;
    width: 500px;
    .el-upload__fileType {
      color: #606266!important;
    }
  }
}
.add-application-button {
  text-align: right;
  margin-top: 20px;
}
</style>
