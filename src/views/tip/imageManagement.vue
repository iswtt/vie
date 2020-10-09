<template>
  <div class='image-management-bar' v-bar>
    <div class="image-management-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle">
            <el-button type="primary" size="mini" data-id="querySet-btn" @click='openSearchDialog'>{{$t('vicenter.common.set')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComForm ref="searchFormRef" :searchIpt="inputItem" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='exportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
            <el-button type="primary" size="mini" data-id="listSet-btn" @click='openListDialog'>{{$t('vicenter.common.set')}}</el-button>
            <el-button type="primary" size="mini" @click='handleCreate' data-id="add-btn">{{$t('vicenter.common.add')}}</el-button>
            <el-button type="danger" size="mini" @click='handleDeleteAll' data-id="delete-btn">{{$t('vicenter.common.delete')}}</el-button>
            <el-button type="primary" size="mini" @click='handlePublishAll' data-id="publish-btn">{{$t('vicenter.common.publish')}}</el-button>
            <el-button type="primary" size="mini" @click='handleUnpublishAll' data-id="unpublish-btn">{{$t('vicenter.common.unpublish')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="imageTable" @listenToSelectDataEvent='selectRow' :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
        <el-dialog :title="searchTransfer.title" :visible.sync="searchTransfer.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag' class='searchTransfer'>
          <div class="transfer-box" v-loading="isSavingSearch" element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-transfer v-if="isOpenSearch" v-model="searchTransfer.transfer.model" :data="searchTransfer.transfer.data" :titles="searchTransfer.transfer.title" :button-texts="searchTransfer.transfer.button" target-order="push" :right-default-checked="transferDefaultS"></el-transfer>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="searchTransfer.transfer.model.length === 0 || isSavingSearch" @click="saveSearchTranfer">{{this.$t('vicenter.common.save')}}</el-button>
            <el-button :disabled="isSavingSearch" @click="dontSaveSearchTranfer">{{this.$t('vicenter.common.back')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="listTransfer.title" :visible.sync="listTransfer.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag' class='searchTransfer'>
          <div class="transfer-box" v-loading="isSavingList" element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-transfer v-if="isOpenList" v-model="listTransfer.transfer.model" :data="listTransfer.transfer.data" :titles="listTransfer.transfer.title" :button-texts="listTransfer.transfer.button" target-order="push" :right-default-checked="transferDefaultL"></el-transfer>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="listTransfer.transfer.model.length === 0 || isSavingList" @click="saveListTranfer">{{this.$t('vicenter.common.save')}}</el-button>
            <el-button :disabled="isSavingList" @click="dontSaveListTranfer">{{this.$t('vicenter.common.back')}}</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/tip/Image-Manage.js'
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import commonAjax from '@/api/common/common.js'
import ComTable from '@/components/table'
export default {
  name: 'imageManagement',
  data () {
    const status = {
      release: '1',
      unRelease: '0'
    }
    const type = {
      single: '1',
      double: '2'
    }
    return {
      exportButton: false,
      sysMenu: 'IMAGE_MANAGE',
      const: {
        status: status,
        type: type
      },
      statusArr: [],
      defaultImg: require('@/assets/img/common/ViCenter.png'),
      titleBread: { // 面包屑导航组件初始化
        // font: '/', // 中间分隔字符，可以是文字，也可以是符号
        // data: [
        //   {
        //     label: this.$t(this.$route.matched[0].meta.title),
        //     path: '/Tip/index' // 跳转路径
        //   },
        //   {
        //     label: this.$t(this.$route.name)
        //   }
        // ]
      },
      panelTitle: {
        // queryTitle: {
        //   title: this.$t('vicenter.common.query')
        // },
        // listTitle: {
        //   title: this.$t('vicenter.common.list')
        // }
      },
      inputItemRes: [ // 查询表单
        {
          // getLabel: this.$t('vicenter.tip.imageManagement.imageName'),
          // placeHolder: this.$t('vicenter.tip.imageManagement.enterImageName'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'name' // 图像名称
        },
        {
          // getLabel: this.$t('vicenter.tip.imageManagement.imageType'),
          // placeHolder: this.$t('vicenter.tip.imageManagement.selectImageType'),
          type: 'select',
          clearable: true,
          models: '',
          option: [
            // {
            //   value: type.single,
            //   label: this.$t('vicenter.tip.imageStatistics.singleEnergy')
            // },
            // {
            //   value: type.double,
            //   label: this.$t('vicenter.tip.imageStatistics.doubleEnergy')
            // }
          ],
          ruleProp: 'imageEnergyType'
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.imageCategory'),
          // placeHolder: this.$t('vicenter.tip.imageManagement.selectImageCategory'),
          models: [],
          ruleProp: 'imageCategory',
          type: 'select2',
          option: [],
          change: this.changeImageCategories
        },
        {
          // getLabel: this.$t('vicenter.tip.imageManagement.describe'),
          type: 'text',
          // placeHolder: this.$t('vicenter.tip.imageManagement.enterDescribe'),
          models: '',
          ruleProp: 'describe'
        },
        {
          // getLabel: this.$t('vicenter.tip.imageManagement.imageStatus'),
          // placeHolder: this.$t('vicenter.tip.imageManagement.selectImageStatus'),
          type: 'select',
          clearable: true,
          models: '',
          option: [
            // {
            //   value: status.release,
            //   label: this.$t('vicenter.tip.imageStatistics.release')
            // },
            // {
            //   value: status.unRelease,
            //   label: this.$t('vicenter.tip.imageStatistics.notRelease')
            // }
          ],
          ruleProp: 'status'
        },
        {
          // getLabel: this.$t('vicenter.tip.imageManagement.lastEditTime'),
          type: 'datetimerange',
          // startPlace: this.$t('vicenter.common.startTime'),
          // endPlace: this.$t('vicenter.common.endTime'),
          models: [],
          valueFormat: 'timestamp',
          // format: this.$t('vicenter.common.formatDate'),
          ruleProp: 'lastEditTime',
          editable: false,
          pickerOptions: {
            // disabledDate: (time) => {
            //   return time.getTime() > Date.now()
            // }
          },
          blur: this.blur,
          focus: this.focus
        },
        {
          // getLabel: this.$t('vicenter.tip.imageManagement.lastEditor'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.tip.imageManagement.enterLastEditor'),
          models: '',
          ruleProp: 'lastEditor'
        }
      ],
      tableGroupRes: [ // 表格数据列
        // {
        //   type: 'selection'
        // },
        {
          // label: this.$t('vicenter.tip.imageManagement.imageName'),
          type: 'text',
          model: 'name',
          width: ''
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.picNo'),
          type: 'text',
          model: 'picNo',
          width: ''
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.imageType'),
          type: 'text',
          model: 'imageEnergyType',
          width: ''
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.imageCategory'),
          type: 'text',
          model: 'imageCategory',
          width: ''
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.describe'),
          type: 'text',
          model: 'describe',
          width: ''
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.imageStatus'),
          type: 'text',
          model: 'status',
          width: ''
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.lastEditTime'),
          type: 'text',
          model: 'lastEditTime',
          width: ''
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.lastEditor'),
          type: 'text',
          model: 'lastEditor',
          width: ''
        },
        {
          // label: this.$t('vicenter.tip.imageManagement.image'),
          height: '50px',
          type: 'img',
          model: 'tipImagePath'
        }
        // {
        //   // label: this.$t('vicenter.common.operation'),
        //   type: 'operation',
        //   model: 'operation',
        //   width: '150'
        // }
      ],
      operation: [
        {
          func: this.getDetail,
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          // title: this.$t('vicenter.common.detail'),
          show: true
        },
        {
          func: this.toEdit,
          label: `<span class='iconfont editTable'>&#xe650;</span>`,
          // title: this.$t('vicenter.common.fix'),
          show: true
        },
        {
          func: this.handlePublish,
          label: `<span class='iconfont editTable bigFont'>&#xe702;</span>`,
          // title: this.$t('vicenter.common.publish'),
          show: true
        },
        {
          func: this.handleUnpublish,
          label: `<span class='iconfont editTable bigFont'>&#xe712;</span>`,
          // title: this.$t('vicenter.common.unpublish'),
          show: true
        },
        {
          func: this.handleDelete,
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          // title: this.$t('vicenter.common.delete'),
          show: true
        }
      ],
      formRule: { // 查询表单规则
        model: {
          name: '',
          imageEnergyType: '',
          imageCategory: '',
          describe: '',
          status: '',
          lastEditTime: [],
          lastEditor: ''
        },
        refName: 'imageManageQueryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query
        // queryText: this.$t('vicenter.common.query'),
        // resetText: this.$t('vicenter.common.reset')
      },
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'imageManageTable',
        flag: false, // 针对图像检索(true)或图像管理(false)设置
        sortMethod: this.getSort
      },
      selRowId: '',
      isList: true,
      inputItemOrigin: [],
      inputItem: [],
      tableGroupOrigin: [],
      tableOper: {
        type: 'operation',
        model: 'operation',
        fixed: 'right'
      },
      tableGroup: [],
      userDefine: [],
      isSavingSearch: false,
      isSavingList: false,
      transferDefaultS: [],
      transferDefaultL: [],
      isOpenSearch: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      isOpenList: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      showInput: false,
      falseFlag: true,
      searchTransfer: {
        flag: false,
        transfer: {
          model: [],
          data: [],
          title: [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')],
          button: [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
        },
        title: this.$t('vicenter.common.definedQuery')
      },
      listTransfer: {
        flag: false,
        transfer: {
          model: [],
          data: [],
          title: [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')],
          button: [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
        },
        title: this.$t('vicenter.common.definedList')
      },
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.exportButton = this.$getSystemConfig('exportEnable')
    // this.queryListImage()
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {
    // this.queryListImage()
    // this.getList('')
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    changeImageCategories () {
      return null
    },
    setI18n () {
      // 面包屑导航
      this.titleBread = {
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Tip/index' // 跳转路径
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
        this.$t('vicenter.common.fix'),
        this.$t('vicenter.common.publish'),
        this.$t('vicenter.common.unpublish'),
        this.$t('vicenter.common.delete')
      ]
      operateTitle.forEach((e, index) => {
        this.operation[index].title = e
      })
      // 操作列
      this.tableOper.label = this.$t('vicenter.common.operation')
      // 自定义查询条件弹框
      this.searchTransfer.title = this.$t('vicenter.common.definedQuery')
      this.searchTransfer.transfer.title = [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')]
      this.searchTransfer.transfer.button = [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
      // 自定义列表弹框
      this.listTransfer.title = this.$t('vicenter.common.definedList')
      this.listTransfer.transfer.title = [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')]
      this.listTransfer.transfer.button = [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
      // 查询条件
      this.inputItemRes.forEach((e) => {
        if (e.ruleProp === 'name') {
          e.getLabel = this.$t('vicenter.tip.imageManagement.imageName')
          e.placeHolder = this.$t('vicenter.tip.imageManagement.enterImageName')
        } else if (e.ruleProp === 'imageEnergyType') {
          e.getLabel = this.$t('vicenter.tip.imageManagement.imageType')
          e.placeHolder = this.$t('vicenter.tip.imageManagement.selectImageType')
          e.option = [
            {
              value: this.const.type.single,
              label: this.$t('vicenter.tip.imageStatistics.singleEnergy')
            },
            {
              value: this.const.type.double,
              label: this.$t('vicenter.tip.imageStatistics.doubleEnergy')
            }
          ]
        } else if (e.ruleProp === 'imageCategory') {
          e.getLabel = this.$t('vicenter.tip.imageManagement.imageCategory')
          e.placeHolder = this.$t('vicenter.tip.imageManagement.selectImageCategory')
        } else if (e.ruleProp === 'describe') {
          e.getLabel = this.$t('vicenter.tip.imageManagement.describe')
          e.placeHolder = this.$t('vicenter.tip.imageManagement.enterDescribe')
        } else if (e.ruleProp === 'status') {
          e.getLabel = this.$t('vicenter.tip.imageManagement.imageStatus')
          e.placeHolder = this.$t('vicenter.tip.imageManagement.selectImageStatus')
          e.option = [
            {
              value: this.const.status.release,
              label: this.$t('vicenter.tip.imageStatistics.release')
            },
            {
              value: this.const.status.unRelease,
              label: this.$t('vicenter.tip.imageStatistics.notRelease')
            }
          ]
        } else if (e.ruleProp === 'lastEditTime') {
          e.getLabel = this.$t('vicenter.tip.imageManagement.lastEditTime')
          e.startPlace = this.$t('vicenter.common.startTime')
          e.endPlace = this.$t('vicenter.common.endTime')
          e.format = this.$t('vicenter.common.formatDate')
        } else if (e.ruleProp === 'lastEditor') {
          e.getLabel = this.$t('vicenter.tip.imageManagement.lastEditor')
          e.placeHolder = this.$t('vicenter.tip.imageManagement.enterLastEditor')
        }
      })
      // 查询列
      this.tableGroupRes.forEach((e) => {
        if (e.model === 'name') {
          e.label = this.$t('vicenter.tip.imageManagement.imageName')
        } else if (e.model === 'picNo') {
          e.label = this.$t('vicenter.tip.imageManagement.picNo')
        } else if (e.model === 'imageEnergyType') {
          e.label = this.$t('vicenter.tip.imageManagement.imageType')
        } else if (e.model === 'imageCategory') {
          e.label = this.$t('vicenter.tip.imageManagement.imageCategory')
        } else if (e.model === 'describe') {
          e.label = this.$t('vicenter.tip.imageManagement.describe')
        } else if (e.model === 'status') {
          e.label = this.$t('vicenter.tip.imageManagement.imageStatus')
        } else if (e.model === 'lastEditTime') {
          e.label = this.$t('vicenter.tip.imageManagement.lastEditTime')
        } else if (e.model === 'lastEditor') {
          e.label = this.$t('vicenter.tip.imageManagement.lastEditor')
        } else if (e.model === 'tipImagePath') {
          e.label = this.$t('vicenter.tip.imageManagement.image')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.$getDataByTypecode(['TIP_IMAGE_CATEGORY'], ['imageCategory'], this.inputItemRes)
      // this.query()
      this.getSearchTransferOrigin()
    },
    // queryListImage () { // 获取类别树
    //   ajax.queryListImage({isAll: true}).then((res) => {
    //     if (res.data.flag) {
    //       this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
    //       this.inputItemRes[2].treedata = res.data.result
    //     }
    //   }).catch(() => {})
    // },
    tabView () {
      this.isList = !this.isList
      this.tableData.isThumbnail = !this.isList
      sessionStorage.setItem('isThumbnail', this.tableData.isThumbnail)
    },
    handleCreate () {
      this.$router.push({
        path: '/Tip/imageManagement/ImageCreate'
      })
    },
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.statusArr = data.map(el => {
        return el.statusValue
      })
      this.$data.selRowId = idArr.join(',')
    },
    handlePublish (scope) {
      this.toRelease(scope.row.id)
    },
    handleUnpublish (scope) {
      this.toUnRelease(scope.row.id)
    },
    handleDelete (scope) {
      this.toDelete(scope.row.id)
    },
    handlePublishAll () {
      if (this.$refs.imageTable.selectedData.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.tip.imageManagement.selectData'))
      } else {
        this.toRelease(this.selRowId)
      }
    },
    handleUnpublishAll () {
      if (this.$refs.imageTable.selectedData.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.tip.imageManagement.selectData'))
      } else {
        this.toUnRelease(this.selRowId)
      }
    },
    handleDeleteAll () {
      if (this.$refs.imageTable.selectedData.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.tip.imageManagement.selectData'))
      } else {
        let flag = false
        this.statusArr.forEach(e => {
          if (!flag) {
            if (e === '1') {
              flag = true
              this.$NotifPrompt(this.$t('vicenter.tip.imageManagement.publishNotDelete'))
            }
          }
        })
        if (!flag) {
          this.toDelete(this.selRowId)
        }
      }
    },
    exportExcel () {
      const {lang} = this.$store.state
      let model = this.setParams()
      let params = {
        lang: lang,
        model: model,
        sysMenu: '',
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/tip/image/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    setParams () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.lastEditTime
      let keys = Object.keys(params)
      keys.forEach(e => {
        if (this.userDefine.indexOf(e) < 0 && e !== 'page' && e !== 'size') {
          delete params[e]
        }
      })
      if (this.userDefine.indexOf('lastEditTime') > -1) {
        let lastEditTime = this.formRule.model.lastEditTime
        if (lastEditTime != null && lastEditTime.length === 2) {
          params.lastEditTimeUpper = lastEditTime[0]
          params.lastEditTimeLower = lastEditTime[1]
        }
      }
      if (params.imageCategory) {
        params.imageCategory = params.imageCategory.join(',')
      }
      return params
    },
    query () {
      let params = this.setParams()
      if (this.$refs.imageTable && this.$refs.imageTable.$refs['imageManageTable']) {
        this.$refs.imageTable.$refs['imageManageTable'].clearSelection()
      }
      this.getList(params)
    },
    getList (params) {
      this.tableData.data = []
      this.tableData.isPage = false
      ajax.querylist(params).then(res => {
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result
          this.tableData.data = content
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          } else {
            this.tableData.isPage = false
            this.tableData.page.Allpage = 0
            return
          }
          this.tableData.page = {
            pageGroup: [10, 20, 50, 100],
            CurrentPage: pageable.pageNumber,
            pagesize: pageable.pageSize,
            Allpage: totalElements,
            handleSizeChange: this.handleSizeChange,
            handleCurrentChange: this.handleCurrentChange
          }
          this.formRule.model.page = pageable.pageNumber
          this.formRule.model.size = pageable.pageSize
          this.tableData.data.forEach(item => {
            if (item.showImageName === null || item.showImageName === undefined || item.showImageName === '') {
              // 加载默认图片
              item.showImageName = this.defaultImg
            }
            item.lastEditTime = this.$options.filters['formatDate'](item.lastEditTime, this.$t('vicenter.common.formatDate'))
            item.imageEnergyType = this.$options.filters['tipImgManageType'](item.imageEnergyType)
            item.imageCategory = this.$t('vicenter.DIC.T_TIP_IMAGE_CATEGORY.C_' + item.imageCategory)
            item.operation = []
            let operateArr = []
            // 根据不同的图像状态设置操作按钮
            if (item.status === this.const.status.unRelease) {
              operateArr = [0, 1, 2, 4]
            } else if (item.status === this.const.status.release) {
              operateArr = [0, 3]
            }
            item.statusValue = item.status
            item.status = this.$options.filters['tipImgManageStatus'](item.status)
            this.operation.forEach((e, index) => {
              if (operateArr.indexOf(index) !== -1) {
                item.operation.push(e)
              }
            })
          })
        }
      }).catch(() => {})
    },
    getDetail (scope) {
      this.$router.push({
        path: '/Tip/imageManagement/imageDetails'
      })
      let details = {
        id: scope.row.id,
        flag: false
      }
      sessionStorage.setItem('details', JSON.stringify(details))
    },
    toEdit (scope) {
      this.$router.push({
        path: '/Tip/imageManagement/ImageEdit'
      })
      let Edit = {
        id: scope.row.id,
        status: scope.row.imageStatus
      }
      sessionStorage.setItem('Edit', JSON.stringify(Edit))
    },
    toRelease (id) {
      let params = {
        imageIds: id
      }
      this.$ConfirmBox(this.$t('vicenter.tip.imageManagement.confirmRelease'), () => {
        ajax.release(params).then(res => {
          if (res.data.flag) {
            // this.getList('')
            this.query()
            this.$NotifSuccess(this.$t('vicenter.tip.imageManagement.releaseSuccess'))
          } else {
            this.$NotifError(this.$t('vicenter.tip.imageManagement.releaseError'))
          }
        }).catch(() => {})
      })
    },
    toUnRelease (id) {
      let params = {
        imageIds: id
      }
      this.$ConfirmBox(this.$t('vicenter.tip.imageManagement.confirmUnRelease'), () => {
        ajax.unrelease(params).then(res => {
          if (res.data.flag) {
            // this.getList('')
            this.query()
            this.$NotifSuccess(this.$t('vicenter.tip.imageManagement.unReleaseSuccess'))
          } else {
            this.$NotifError(this.$t('vicenter.tip.imageManagement.unReleaseError'))
          }
        }).catch(() => {})
      })
    },
    toDelete (id) {
      let params = {
        imageIds: id
      }
      this.$ConfirmBox(this.$t('vicenter.tip.imageManagement.confirmDelete'), () => {
        ajax.deleteImage(params).then(res => {
          if (res.data.flag) {
            // this.getList('')
            this.query()
            this.$NotifSuccess(this.$t('vicenter.tip.imageManagement.deleteSuccess'))
          } else {
            this.$NotifError(this.$t('vicenter.tip.imageManagement.deleteError'))
          }
        }).catch(() => {})
      })
    },
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
      if (this.formRule.model.lastEditTime === null || this.formRule.model.lastEditTime.length === 0) {
        times = {}
      } else {
        times = {
          lastEditTimeUpper: this.formRule.model.lastEditTime[0],
          lastEditTimeLower: this.formRule.model.lastEditTime[1]
        }
      }
      var value = {
        name: this.formRule.model.name,
        imageEnergyType: this.formRule.model.imageEnergyType,
        imageCategory: this.formRule.model.imageCategory,
        describe: this.formRule.model.describe,
        status: this.formRule.model.status,
        lastEditor: this.formRule.model.lastEditor,
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
    getSort () {
      console.log('')
    },
    openSearchDialog () {
      this.searchTransfer.flag = true
      this.isOpenSearch = true
    },
    openListDialog () {
      this.listTransfer.flag = true
      this.isOpenList = true
    },
    // 针对检入时间增加默认值增加了flag参数，表示保存查询条件之前是否有检入时间项
    getSearchTransferOrigin (flag = true) {
      this.userDefine = []
      this.$data.inputItemOrigin = []
      this.$data.inputItem = []
      let params = {
        ufType: 1,
        sysMenu: this.sysMenu
      }
      commonAjax.getSearchCondition(params).then((res) => {
        if (res.data.flag) {
          res.data.result.allEnableSc.forEach(e => {
            this.$data.inputItemRes.forEach(orgin => {
              if (orgin.ruleProp === e.taskField) {
                orgin.id = e.id
                this.$data.inputItemOrigin.push(orgin)
              }
            })
          })
          res.data.result.userDefineSc.forEach(e => {
            this.$data.inputItemOrigin.forEach(orgin => {
              if (orgin.ruleProp === e.taskField) {
                this.$data.inputItem.push(orgin)
                this.userDefine.push(e.taskField)
              }
            })
          })
          // 如果用户自定义的查询条件中没有检入时间，就删除检入时间默认值
          let searchArr = res.data.result.userDefineSc.map(obj => { return obj.taskField })
          if (searchArr.indexOf('checkinTime') === -1) {
            this.formRule.model.checkinTime = []
            this.$data.inputItem.forEach(obj => {
              if (obj.ruleProp === 'checkinTime') {
                obj.models = []
              }
            })
          } else {
            if (this.formRule.model.checkinTime.length === 0 && !flag) {
              this.formRule.model.checkinTime = [
                new Date(new Date(new Date().setMonth(new Date().getMonth() - 3)).toLocaleDateString()),
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
              ]
              this.$data.inputItem.forEach(obj => {
                if (obj.ruleProp === 'checkinTime') {
                  obj.models = obj.defaultValue
                }
              })
            }
          }
          this.showInput = true
          this.getSearchTransfer()
        }
        this.getListTransferOrigin()
      }).catch(() => {})
    },
    getListTransferOrigin () {
      this.$data.tableGroupOrigin = []
      this.$data.tableGroup = []
      let params = {
        ufType: 2,
        sysMenu: this.sysMenu
      }
      commonAjax.getSearchCondition(params).then((res) => {
        if (res.data.flag) {
          res.data.result.allEnableSc.forEach(e => {
            this.tableGroupRes.forEach(orgin => {
              if (orgin.model === e.taskField) {
                orgin.id = e.id
                this.$data.tableGroupOrigin.push(orgin)
              }
            })
          })
          res.data.result.userDefineSc.forEach(e => {
            this.$data.tableGroupOrigin.forEach(orgin => {
              if (orgin.model === e.taskField) {
                this.$data.tableGroup.push(orgin)
              }
            })
          })
          this.$data.tableGroup.unshift({
            type: 'selection'
          })
          this.getListTransfer()
        }
      }).catch(() => {})
    },
    saveSearchcondation (ufType) {
      this.isSavingSearch = true
      this.isSavingList = true
      let params = {}
      params.ufType = ufType
      params.sysMenu = this.sysMenu
      let arr = []
      if (ufType === '1') {
        arr = this.searchTransfer.transfer.model
      } else if (ufType === '2') {
        arr = this.listTransfer.transfer.model
      }
      params.strSearchCondations = arr.join(',')
      commonAjax.updateSearchCondition(params).then((res) => {
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
            let isHasCheckinTime = false
            this.inputItem.forEach(e => {
              if (e.ruleProp === 'checkinTime') {
                isHasCheckinTime = true
              }
            })
            this.getSearchTransferOrigin(isHasCheckinTime)
            this.listTransfer.flag = false
            this.searchTransfer.flag = false
          }
          this.isOpenSearch = false
          this.isOpenList = false
          this.isSavingSearch = false
          this.isSavingList = false
        }
      }).catch(() => {})
    },
    saveSearchTranfer () {
      this.saveSearchcondation('1')
    },
    dontSaveSearchTranfer () {
      this.searchTransfer.flag = false
      this.isOpenSearch = false
      this.searchTransfer.transfer.model = []
      this.inputItem.forEach(ele => {
        this.searchTransfer.transfer.model.push(ele.id)
      })
    },
    getSearchTransfer () {
      this.searchTransfer.transfer.data = []
      this.searchTransfer.transfer.model = []
      this.inputItemOrigin.forEach(ele => {
        this.searchTransfer.transfer.data.push({
          key: ele.id,
          label: ele.getLabel
        })
        if (this.userDefine.indexOf(ele.ruleProp) === -1) {
          ele.models = ''
          this.formRule.model[ele.ruleProp] = ''
        }
      })
      this.inputItem.forEach(e => {
        this.searchTransfer.transfer.model.push(e.id)
        if (e.type === 'treeInput') {
          e.checkedOption = this.formRule.model[e.ruleProp].split(',')
        }
      })
      this.query()
    },
    dontSaveListTranfer () {
      this.listTransfer.flag = false
      this.isOpenList = false
      this.listTransfer.transfer.model = []
      this.tableGroup.forEach(ele => {
        if (ele.type !== 'operation' && ele.type !== 'selection') {
          this.listTransfer.transfer.model.push(ele.id)
        }
      })
    },
    getListTransfer () {
      this.listTransfer.transfer.data = []
      this.listTransfer.transfer.model = []
      this.tableGroupOrigin.forEach(ele => {
        this.listTransfer.transfer.data.push({
          key: ele.id,
          label: ele.label
        })
      })
      this.tableGroup.forEach(e => {
        if (e.type !== 'selection') {
          this.listTransfer.transfer.model.push(e.id)
        }
      })
      this.tableGroup.push(this.tableOper)
    },
    saveListTranfer () {
      this.saveSearchcondation('2')
    }
    // treeClick (data) {
    // },
    /**
     * tip类别点击节点
     */
    // checkChange (nodeObj, checkedObj) {
    //   console.log('checkChange')
    //   let checkedValue = this.$checkTreeChange(nodeObj, checkedObj)
    //   if (checkedValue !== null) {
    //     this.inputItemRes[2].models = checkedValue.name
    //     this.formRule.model['imageCategory'] = checkedValue.ids
    //   }
    // }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Tip/imageManagement/imageDetails' && to.path !== '/Tip/imageManagement/ImageEdit' && to.path !== '/Tip/imageManagement/ImageCreate') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        name: '',
        imageEnergyType: '',
        imageCategory: '',
        describe: '',
        status: '',
        lastEditTime: [],
        lastEditor: ''
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { bread, ComForm, panelTitle, ComTable }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.image-management-bar {
  @extend .extend-bar;
  .image-management-M {
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
        .editTable {
          margin: 0 5px;
        }
        .bigFont {
          font-size: 22px;
        }
        .notActive {
          color: #ccc!important;
        }
        .viewClass {
          margin: 0;
        }
      }
    }
  }
}
</style>
