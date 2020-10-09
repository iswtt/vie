<template>
  <div class='standardImageMsg-bar' v-bar>
    <div class="standardImageMsg-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm ref="searchFormRef" :searchIpt="searchIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button data-id="back-btn" type="primary" size="mini" @click='back'>
              {{$t('vicenter.training.common.back')}}
            </el-button>
            <el-button data-id="import-btn" type="primary" size="mini" @click='handleCreate'>
              {{$t('vicenter.training.common.import')}}
            </el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="imageTable" @listenToSelectDataEvent='selectRow' :tableData="tableData"
                      :tableGroup="tableGroup"></ComTable>
          </div>
        </div>
      </div>
      <Dialog :modalData="modalData" class="messageDialog">
        <p class="messageDialog-note">
          {{$t('vicenter.training.manager.messageDialog.note.0')}}{{importDate.count}}{{$t('vicenter.training.manager.messageDialog.item')}}{{comma}}{{$t('vicenter.training.manager.messageDialog.note.1')}}{{importDate.successCount}}{{$t('vicenter.training.manager.messageDialog.item')}}{{comma}}{{$t('vicenter.training.manager.messageDialog.note.2')}}{{importDate.failCount}}{{$t('vicenter.training.manager.messageDialog.item')}}{{fullStop}}</p>
        <div v-if="failReason.length>0">
          <div class="messageDialog-title">{{$t('vicenter.training.manager.messageDialog.title')}}：</div>
          <ul class="messageDialog-ul" data-id="messageDialog-ul">
            <li v-for="(tmp, index) in failReason" :key='index'>{{tmp.title}}：{{tmp.note}}..............</li>
          </ul>
        </div>
        <div class="resultbutton">
          <el-button data-id="closeDialog-btn" type="primary" size="medium" @click="closeDialog">
            {{$t('vicenter.training.common.confirm')}}
          </el-button>
        </div>
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
import ajax from '@/api/training/manager.js'

export default {
  name: 'demo',
  data () {
    return {
      loadingText: this.$t('vicenter.training.common.loadingTextOne'),
      modalData: {
        flag: false,
        title: this.$t('vicenter.training.common.promptMessage')
      },
      importDate: {},
      failReason: [], // 导入记录
      titleBread: {},
      panelTitle: {},
      searchIpt: [ // 查询表单
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          maxlength: this.$globalData.threshold,
          ruleProp: 'scanSerialNumber'
        },
        // {
        //   getLabel: this.$t('vicenter.training.common.hsCodes'),
        //   type: 'selectRemote',
        //   models: [],
        //   ruleProp: 'hsCodes',
        //   clearable: true,
        //   option: [],
        //   reserveKeyword: true,
        //   loading: false,
        //   change: this.serachHscodeChange,
        //   remoteMethod: this.serachGetRemoteHscode,
        //   focus: this.serachFocus,
        //   iptClass: 'traicSelect',
        //   multiple: true
        // }
        {
          models: '',
          options: [],
          ruleProp: 'hsCodes',
          type: 'treeInput',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'hsCodesInput',
          treeDataId: 'hsCodesData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.hsCodesCheckChange,
          treeRefName: 'hsCodesIptRef',
          treeIptComName: 'hsCodesTree',
          TreeProps: {
            children: 'children',
            label: function (data) {
              // 重写节点的label显示内容
              return `(${data.code}) ${data.name}`
            }
          },
          goodsOption: {
            hscodeTreeQuery: false,
            hscodePosition: true,
            isShowCheckbox: true,
            checkedKeys: [],
            maxLimit: null // 标准图最多选择一个，违规图可以多个
          }
        }
      ],
      tableGroup: [ // 表格数据列
        {
          type: 'selection',
          width: '40px'
        },
        {
          type: 'img',
          height: '50px',
          model: 'thumb',
          width: '160px'
        },
        {
          type: 'text',
          model: 'scanSerialNumber'
        },
        {
          type: 'text',
          // model: 'hsCodes'
          model: window.location.href.indexOf('standardRegulatory') !== -1 ? 'hsCodeCvs' : 'hsCodes'
        }
      ],
      formRule: { // 查询表单规则
        model: {
          scanSerialNumber: '',
          hsCodes: '',
          pageParams: {}
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
      saveImg: {
        // server_path: config.trainingUI.uploadUrl
        server_path: ''
      },
      selRowId: '',
      tempIndex: 0, // 解决查询条件和列表项重复的问题
      lang: 'zh-CN',
      // 查询hscode参数补充
      serachHsNameData: [],
      hscodeData: {
        queryTxt: '',
        selectHscode: [],
        checkedNodes: []
      }
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {
  },
  computed: {
    comma () {
      console.log(this.lang)
      return this.lang === 'zh-CN' ? '，' : ','
    },
    fullStop () {
      console.log(this.lang)
      return this.lang === 'zh-CN' ? '。' : '.'
    }
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    serachFocus () {
      this.$trainHsCodeFocus(this.searchIpt[1], this.hscodeData)
    },
    serachHscodeChange () {
      let hscodeItem = this.searchIpt[1]
      let selectNode = this.$trainHsCodeChange(hscodeItem, this.hscodeData)
      this.serachHsNameData = selectNode
    },
    serachGetRemoteHscode (query) {
      let hscodeItem = this.searchIpt[1]
      this.$trainGetRemoteHscode(query, hscodeItem, this.hscodeData)
    },
    setI18n () {
      this.lang = JSON.parse(sessionStorage.getItem('currentLang')) ? JSON.parse(sessionStorage.getItem('currentLang')).lang : window.config.conmmonLang
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
      console.log(this.$route)
      if (this.$route.path.indexOf('standardImageCode') !== -1) {
        this.searchIpt.push(
          {
            type: 'text',
            models: '',
            ruleProp: 'imageName'
          }
        )
        this.tableGroup.splice(
          3,
          0,
          {
            type: 'text',
            model: 'imageName'
          }
        )
        this.formRule.model.imageName = ''
        this.$set(this.formRule.model, 'imageName', '')
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
        if (e.ruleProp === 'imageName') {
          e.getLabel = this.$t('vicenter.training.common.imageName')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.imageName')
        } else if (e.ruleProp === 'scanSerialNumber') {
          e.getLabel = this.$t('vicenter.training.common.imageSerialNumber')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.imageSerialNumber')
        } else if (e.ruleProp === 'hsCodes') {
          e.getLabel = this.$t('vicenter.training.common.hsCodes')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.hsCodes')
          e.option = [
            {
              value: 'STANDARD',
              label: this.$t('vicenter.ImageLibrary.common.imageType.STANDARD')
            },
            {
              value: 'ILLEGAL',
              label: this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL')
            }
          ]
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'thumb') {
          e.label = this.$t('vicenter.training.common.imagePath')
        } else if (e.model === 'scanSerialNumber') {
          e.label = this.$t('vicenter.training.common.imageSerialNumber')
        } else if (e.model === 'imageName') {
          e.label = this.$t('vicenter.training.common.imageName')
        // } else if (e.model === 'hsCodes') {
        } else if (e.model === 'hsCodeCvs' || e.model === 'hsCodes') {
          e.label = this.$t('vicenter.training.common.hsCodes')
        }
      })
      this.query()
    },
    query () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      if (this.$route.path.indexOf('standardImageCode') !== -1) {
        // 典图查询调价
        params.imageType = 'STANDARD'
      } else {
        // 监管的查询条件
        params.concImgcheck = 'CONC002' // 标准图
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      params.sort = ['lastEditTime,desc']
      this.getList(params)
    },
    getList (params) {
      if (params.hsCodes && params.hsCodes.length > 0) {
        // let hsCodes = []
        // this.serachHsNameData.forEach(e => {
        //   hsCodes.push(e.hsCode)
        // })
        // params.hsCodes = hsCodes.join(',')
      } else {
        params.hsCodes = ''
      }
      ajax.getimglist(params).then((res) => {
        console.log(res)
        if (res.data.flag) {
          let {content, pageable, totalElements} = res.data.result
          this.tableData.data = content
          this.tableData.data.forEach(item => {
            item.lastScanImageAllPath = item.lastScanImage
            let oldImgsUrl = item.lastImage ? item.lastImage : item.lastScanImage
            let imgsUrl = oldImgsUrl
            // let reg = /^((https):\/\/)(([0-9]{1,3}\.){3}[0-9]{1,3})*(\/)/
            // imgsUrl = imgsUrl.replace(reg, this.saveImg.server_path)
            if (item.lastImage) {
              item.lastImage = imgsUrl
            } else {
              item.lastScanImage = imgsUrl
            }
            // 列表显示的缩略图
            item.thumb = imgsUrl
          })
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
          this.tableData.page.CurrentPage = pageable.pageNumber
          this.tableData.page.pagesize = pageable.pageSize
          this.tableData.page.Allpage = totalElements
          // 查询条件
          this.formRule.model.pageParams.page = pageable.pageNumber
          this.formRule.model.pageParams.size = pageable.pageSize
        }
      })
    },
    // 返回
    back () {
      this.$router.push({path: '/Training/manager/standardImageList'})
    },
    // 导入
    handleCreate () {
      if (!this.selRowId.length) {
        this.$NotifPrompt(this.$t('vicenter.training.manager.notImportErrorOne'))
        return
      }
      if (this.$route.path.indexOf('standardImageCode') !== -1) {
        console.log(this.selRowId)
        // 典图导入
        this.importReq({
          importStr: JSON.stringify(this.selRowId),
          pcUserId: sessionStorage.getItem('userId')
        })
      } else {
        // 监管导入
        ajax.getImgDetail({
          ids: this.selRowId.map(e => { return e.testImgApiId }).join(',')
        }).then(res => {
          /*
             * 通过列表id 获取详情中图片地址
             * 取 fileNameExt 为 img 或 uff
             * */
          let rep = res.data.result
          console.log(this.selRowId)
          this.selRowId.forEach(item => {
            // 取 name url 集合
            let a = rep[item.testImgApiId].taskAttachementObjectlist.filter(e => {
              let lowerExt = e.fileNameExt.toLowerCase()
              return ['img', 'uff', 'tif', 'tiff', 'png', 'PNG', 'urf'].indexOf(lowerExt) !== -1
            }).map(i => {
              let oldImgUrl = i.location
              return {
                imgsName: i.fileName,
                imgsUrl: oldImgUrl.substring(0, oldImgUrl.lastIndexOf('/') + 1) + i.fileName,
                imgsDocType: i.docType,
                imgMd5: i.imgMd5,
                imgsEyes: i.viewIndex,
                enegryType: i.energyType
              }
            })
            a.forEach(e => {
              item.imgsJson.push({
                imgsName: e.imgsName,
                imgsUrl: e.imgsUrl,
                imgsDocType: e.imgsDocType,
                imgMd5: e.imgMd5,
                imgsEyes: e.imgsEyes,
                enegryType: e.enegryType,
                originalThumbnail: item.lastScanImage
              })
            })
            // item.imgsJson = {
            //   imgsName: a.map(e => { return e.imgsName }).join(','),
            //   imgsUrl: a.map(e => { return e.imgsUrl }).join(','),
            //   imgsDocType: a.map(e => { return e.imgsDocType }).join(','),
            //   imgMd5: a.map(e => { return e.imgMd5 }).join(','),
            //   imgsEyes: a.map(e => { return e.imgsEyes }).join(','),
            //   enegryType: a.map(e => { return e.enegryType }).join(','),
            //   originalThumbnail: item.lastScanImage
            // }
            delete item.lastScanImage
          })
          this.importReq({
            importStr: JSON.stringify(this.selRowId),
            pcUserId: sessionStorage.getItem('userId')
          })
        })
      }
    },
    importReq (params) {
      this.openLoading(true, this.$t('vicenter.training.manager.loadingTextTwo'))
      ajax.importDate(params).then((res) => {
        console.log(res)
        this.closeLoading()
        this.modalData.flag = true
        if (res.data.flag) {
          this.importDate = res.data.result
          Object.keys(res.data.result.failReason).forEach((key) => {
            let obj = {}
            obj.title = key
            obj.note = this.$t(res.data.result.failReason[key])
            this.failReason.push(obj)
          })
        }
      })
    },
    // 列表选中行
    selectRow (data) {
      console.log(data)
      this.$data.selRowId = data.map(e => {
        let imgsJson = []
        if (this.$route.path.indexOf('standardImageCode') !== -1) {
          // 典图系统从列表数据中加载文件数据
          imgsJson = e.fileList.filter(e => {
            let lowerExt = e.fileNameExt.toLowerCase()
            return ['img', 'uff', 'tif', 'tiff', 'png', 'PNG', 'urf'].indexOf(lowerExt) !== -1
          }).map(f => { // 文件可能为多个
            let oldImgUrl = e.lastImage ? e.lastImage : e.lastScanImage
            return {
              imgsName: f.fileName,
              imgsUrl: oldImgUrl.substring(0, oldImgUrl.lastIndexOf('/') + 1) + f.fileName,
              imgsDocType: f.docType,
              imgMd5: f.imgMd5,
              imgsEyes: f.viewIndex,
              enegryType: f.energyType,
              // originalThumbnail: e.lastImage
              originalThumbnail: e.originalImage
            }
          })
        }
        return {
          imgsJson: imgsJson,
          lastScanImage: e.lastScanImageAllPath,
          testImgApiId: this.$route.path.indexOf('standardImageCode') !== -1 ? e.scanSerialNumber : e.id,
          testImgName: this.$route.path.indexOf('standardImageCode') !== -1 ? e.imageName : e.scanSerialNumber,
          testImgHashCodes: this.$route.path.indexOf('standardImageCode') !== -1 ? e.hsCodes : e.hsCodeCvs,
          hsIds: this.$route.path.indexOf('standardImageCode') !== -1 ? e.hsIds : e.hsCodeCvs,
          testImgHashNames: this.$route.path.indexOf('standardImageCode') !== -1 ? e.hsNames : e.hsNameCvs,
          testImgClass: 0,
          promptMsg: e.scanSerialNumber,
          testImgCreateSource: this.$route.path.indexOf('standardImageCode') !== -1 ? 1 : 2
        }
      })
      console.log(this.selRowId)
      // this.$data.selRowId = JSON.stringify(idArr)
    },
    closeDialog () {
      this.modalData.flag = false
      this.$router.push({
        path: '/Training/manager/standardImageList'
      })
    },
    resetForm () {
      this.hscodeData.selectHscode = []
      this.searchIpt[1].models = []
      this.searchIpt[1].option = []
      this.formRule.model.hsCodes = ''
      this.query()
    },
    getDetail (scope) {
    },
    toEdit (scope) {
    },
    handleReview (scope) {
    },
    toRelease (id) {
    },
    toUnRelease (id) {
    },
    toReject (scope) {
    },
    toDelete (id) {
    },
    handleSizeChange (val) {
      this.formRule.model.pageParams.size = val
      this.formRule.model.pageParams.page = 0
      this.$set(this.tableData.page, 'pagesize', val)
      this.SetpageQuery(0)
    },
    handleCurrentChange (val) {
      this.formRule.model.pageParams.page = val - 1
      this.SetpageQuery(this.formRule.model.pageParams.page)
    },
    SetpageQuery (page) { // 查询设置页
      let value = {
        imageName: this.formRule.model.imageName,
        scanSerialNumber: this.formRule.model.scanSerialNumber,
        hsCodes: this.formRule.model.hsCodes,
        page: page,
        size: this.tableData.page.pagesize,
        sort: ['lastEditTime,desc']
        // pageParams: {
        //   page: page,
        //   size: this.tableData.page.pagesize,
        //   sort: ['lastEditTime,desc']
        // }
      }
      if (this.$route.path.indexOf('standardImageCode') !== -1) {
        // 典图查询调价
        value.imageType = 'STANDARD'
      } else {
        // 监管的查询条件
        value.concImgcheck = 'CONC002' // 标准图
      }
      let val = Object.assign({}, value)
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
    getSort () {
    },
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
  components: {bread, ComForm, panelTitle, ComTable, Dialog}
}
</script>

<style lang="scss">
  @import '@/styles/index.scss';

  .standardImageMsg-bar {
    @extend .extend-bar;

    .standardImageMsg-M {
      padding: $margin;
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

            .el-input__inner {
              height: 32px;
              line-height: 32px;
            }
            .traicSelect {
              min-width: 260px;
              width: $all;
              .el-select__tags {
                flex-wrap: nowrap;
                .el-tag--info {
                  white-space: nowrap!important;
                }
                .el-tag--info:first-child {
                  position: relative;
                  // max-width: 60%;
                  padding-right: 10px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  .el-icon-close {
                    position: absolute;
                    top: 5px;
                    right: 0;
                  }
                }
              }
            }
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

      .messageDialog {
        .el-dialog {
          width: 50% !important;
          text-align: left;

          .messageDialog-note {
            font-size: 16px;
          }

          .messageDialog-title {
            margin: 5px 0;
            font-size: 16px;
          }

          .messageDialog-ul {
            font-size: 14px;
          }

          .resultbutton {
            text-align: center;
            margin-top: $margin;
          }
        }
      }
    }

  }
</style>
