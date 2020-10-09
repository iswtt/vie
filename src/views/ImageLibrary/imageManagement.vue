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
            <el-button v-if="getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.ADD)" type="primary" size="mini" @click='handleCreate' data-id="create-btn">{{$t('vicenter.common.add')}}</el-button>
            <!-- <el-button v-if="getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.IMPORT)" type="primary" size="mini" @click='handleBatchImport' data-id="batchImport-btn">{{$t('vicenter.ImageLibrary.common.batchImport')}}</el-button> -->
            <el-button v-if="getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.DELETE)" type="danger" size="mini" @click='handleDeleteAll' data-id="delete-btn">{{$t('vicenter.common.delete')}}</el-button>
            <el-button v-if="getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.RELEASE)" type="primary" size="mini" @click='handlePublishAll' data-id="publish-btn">{{$t('vicenter.ImageLibrary.HSCodeManagement.Publish')}}</el-button>
            <el-button v-if="getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.UNRELEASE)" type="primary" size="mini" @click='handleUnpublishAll' data-id="unpublish-btn">{{$t('vicenter.ImageLibrary.HSCodeManagement.Unpublish')}}</el-button>
            <div class="tabViewBtn">
              <el-button type="text" @click='tabView' :title="$t('vicenter.ImageLibrary.common.List')" :disabled="isList"><span class='iconfont editTable btnClass viewClass' :class="{notActive: isList}" data-id="list-btn">&#xe661;</span></el-button>
              <el-button type="text" @click='tabView' :title="$t('vicenter.ImageLibrary.common.Thumbnail')" :disabled="!isList"><span class='iconfont editTable btnClass viewClass' :class="{notActive: !isList}" data-id="thumbnail-btn">&#xe65f;</span></el-button>
            </div>
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
import ajax from '@/api/imageLibrary/imageManagement.js'
import commonAjax from '@/api/common/common.js'
import hscodeAjax from '@/api/background/HSCode.js'
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import $prmCode from '@/lib/common/code.js'
export default {
  name: 'imageManagement',
  data () {
    return {
      exportButton: false,
      sysMenu: 'IMAGE_MANAGEMENT',
      $prmCode: {},
      defaultImg: require('@/assets/img/common/ViCenter.png'),
      titleBread: {},
      panelTitle: {},
      inputItemRes: [ // 查询表单
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'scanSerialNumber'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'imageName'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'imageType'
        },
        {
          models: '',
          ruleProp: 'siteId',
          type: 'treeInput',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'siteCodeTreeInput',
          treeDataId: 'siteCodeTreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.siteCodeCheckChange,
          treeRefName: 'siteCodeTreeIptRef'
        },
        {
          models: '',
          ruleProp: 'deviceId',
          type: 'treeInput',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'deviceCodeTreeInput',
          treeDataId: 'deviceCodeTreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.deviceCodeCheckChange,
          treeRefName: 'deviceCodeTreeIptRef'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'imageCollectMode'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'imageStatus'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'seizedType'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'seizedLocation'
        },
        {
          type: 'datetimerange',
          startPlace: this.$t('vicenter.common.startTime'),
          endPlace: this.$t('vicenter.common.endTime'),
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'createTime',
          editable: false,
          blur: this.blur,
          focus: this.focus
        },
        {
          type: 'datetimerange',
          startPlace: this.$t('vicenter.common.startTime'),
          endPlace: this.$t('vicenter.common.endTime'),
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'imgPublishTime',
          editable: false,
          blur: this.blur,
          focus: this.focus
        },
        // {
        //   type: 'text',
        //   models: '',
        //   ruleProp: 'imageDesc'
        // },
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
            defaultExpandedKeys: []
          }
        }
      ],
      tableGroupRes: [ // 表格数据列
        // {
        //   type: 'selection',
        //   width: '40px'
        // },
        {
          type: 'img',
          height: '50px',
          model: 'lastImage',
          width: '160px'
        },
        {
          type: 'text',
          model: 'scanSerialNumber',
          width: '180px'
        },
        {
          type: 'text',
          model: 'imageName',
          width: '180px'
        },
        {
          type: 'text',
          model: 'imageType',
          width: '110px'
        },
        {
          type: 'text',
          model: 'siteName',
          width: '90px'
        },
        {
          type: 'text',
          model: 'deviceCode',
          width: '100px'
        },
        {
          type: 'text',
          model: 'imageCollectMode',
          width: '110px'
        },
        {
          type: 'text',
          model: 'imageStatus',
          width: '110px'
        },
        {
          type: 'text',
          model: 'seizedType',
          width: '110px'
        },
        {
          type: 'text',
          model: 'seizedLocation',
          width: '110px'
        },
        // {
        //   type: 'text',
        //   model: 'imageDesc',
        //   width: '110px'
        // },
        {
          type: 'text',
          model: 'createTime',
          width: '140px'
        },
        {
          type: 'text',
          model: 'imgPublishTime',
          width: '140px'
        },
        {
          type: 'text',
          model: 'hsCodes',
          width: '80px'
        },
        {
          type: 'text',
          model: 'hsNames',
          width: '80px'
        }
        // {
        //   type: 'operation',
        //   model: 'operation',
        //   width: '150',
        //   fixed: 'right'
        // }
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
          func: this.handleReview, // 审核
          label: `<span class='iconfont editTable'>&#xe60a;</span>`,
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
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
      tableData: { // 表格数据
        refName: 'imageMgmtTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        isThumbnail: false, // 是否缩略图模式，默认为列表模式
        toDetailHash: '/ImageLibrary/imageManagement/imageDetails', // 缩略图视图跳转路由
        flag: false, // 针对图像检索(true)或图像管理(false)设置
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
      inputItemOrigin: [],
      inputItem: [],
      tableGroupOrigin: [],
      tableOper: {
        type: 'operation',
        model: 'operation',
        fixed: 'right',
        width: ''
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
          data: []
        }
      },
      listTransfer: {
        flag: false,
        transfer: {
          model: [],
          data: []
        }
      },
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.tempIndex = 1
    this.$prmCode = $prmCode
    this.orgAjaxTree()
    this.deviceAjaxTree()
    this.hscodeAjaxTree()
    // 加载用户默认选择的视图
    let isThumbnailView = false
    if (sessionStorage.isThumbnail === 'true') {
      isThumbnailView = true
    } else if (sessionStorage.isThumbnail === 'false') {
      isThumbnailView = false
    }
    this.isList = !isThumbnailView
    this.tableData.isThumbnail = isThumbnailView
    this.setI18n()
  },
  mounted () {},
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    // 判断按钮权限
    getPrmFlag (code) {
      if (this.$PrmCodeList.indexOf(code) !== -1) {
        return true
      } else {
        return false
      }
    },
    setI18n () {
      this.$getDataByTypecode(['CONTRABAND_TYPE', 'CONTRABAND_LOCATION'], ['contrabandType', 'contrabandLocation'], this.seizedGoodsData)
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/ImageLibrary/index' // 跳转路径
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
        this.$t('vicenter.ImageLibrary.imageManagement.review'),
        this.$t('vicenter.common.delete')
      ]
      operateTitle.forEach((e, index) => {
        this.operation[index].title = e
      })
      // 查询条件
      this.inputItemRes.forEach((e) => {
        if (e.ruleProp === 'imageName') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.ImageName')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.inputImageName')
        } else if (e.ruleProp === 'scanSerialNumber') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.taskSerialNumber')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.inputTaskSerialNumber')
        } else if (e.ruleProp === 'imageStatus') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.ImageStatus')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.checkStatus')
          e.option = [
            {
              value: 'TEMPORARY',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.TEMPORARY')
            },
            {
              value: 'SUBMIT',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.SUBMIT')
            },
            {
              value: 'PUBLISHED',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.PUBLISHED')
            },
            {
              value: 'REJECTED',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.REJECTED')
            }
          ]
        } else if (e.ruleProp === 'imageType') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.Imagetype')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.checkImagetype')
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
        } else if (e.ruleProp === 'imageCollectMode') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.acquisitionMode')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.checkAcquisitionMode')
          e.option = [
            {
              value: '1',
              label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.MANNUAL')
            },
            {
              value: '2',
              label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.SUPERVISION')
            }
          ]
        } else if (e.ruleProp === 'siteId') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.siteCode')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.checkSiteCode')
        } else if (e.ruleProp === 'deviceId') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.deviceCode')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.checkDeviceCode')
        } else if (e.ruleProp === 'seizedType') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.seizedGoods')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.selectSeizedGoods')
        } else if (e.ruleProp === 'seizedLocation') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.selectSeizedGoodsLocation')
        } else if (e.ruleProp === 'createTime') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.recommendedDate')
          // e.format = this.$t('vicenter.common.pickerFmt')
        } else if (e.ruleProp === 'imgPublishTime') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.releaseDate')
          // e.format = this.$t('vicenter.common.pickerFmt')
        } else if (e.ruleProp === 'imageDesc') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.imageDesc')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.inputImageDesc')
        } else if (e.ruleProp === 'hsCodes') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.hsCodes')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.selectHsCodes')
        }
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
      // 查询列
      this.tableGroupRes.forEach((e) => {
        if (e.model === 'lastImage') {
          e.label = this.$t('vicenter.ImageLibrary.common.imagePath')
        } else if (e.model === 'scanSerialNumber') {
          e.label = this.$t('vicenter.ImageLibrary.common.taskSerialNumber')
        } else if (e.model === 'imageName') {
          e.label = this.$t('vicenter.ImageLibrary.common.ImageName')
        } else if (e.model === 'imageType') {
          e.label = this.$t('vicenter.ImageLibrary.common.Imagetype')
        } else if (e.model === 'siteName') {
          e.label = this.$t('vicenter.ImageLibrary.common.siteCode')
        } else if (e.model === 'deviceCode') {
          e.label = this.$t('vicenter.ImageLibrary.common.deviceCode')
        } else if (e.model === 'imageCollectMode') {
          e.label = this.$t('vicenter.ImageLibrary.common.acquisitionMode')
        } else if (e.model === 'seizedType') {
          e.label = this.$t('vicenter.ImageLibrary.common.seizedGoods')
        } else if (e.model === 'seizedLocation') {
          e.label = this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation')
        } else if (e.model === 'imageDesc') {
          e.label = this.$t('vicenter.ImageLibrary.common.imageDesc')
        } else if (e.model === 'imageStatus') {
          e.label = this.$t('vicenter.ImageLibrary.common.ImageStatus')
        } else if (e.model === 'createTime') {
          e.label = this.$t('vicenter.ImageLibrary.common.recommendedDate')
        } else if (e.model === 'imgPublishTime') {
          e.label = this.$t('vicenter.ImageLibrary.common.releaseDate')
        } else if (e.model === 'hsCodes') {
          e.label = this.$t('vicenter.ImageLibrary.common.hsCodes')
        } else if (e.model === 'hsNames') {
          e.label = this.$t('vicenter.ImageLibrary.common.goodsDesc')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      // this.query()
      this.getSearchTransferOrigin()
    },
    tabView () {
      this.isList = !this.isList
      this.tableData.isThumbnail = !this.isList
      sessionStorage.setItem('isThumbnail', this.tableData.isThumbnail)
    },
    handleCreate () {
      this.$router.push({
        path: '/ImageLibrary/imageManagement/ImageCreate'
      })
    },
    handleBatchImport () {},
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
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
        this.$NotifPrompt(this.$t('vicenter.ImageLibrary.imageManagement.promptInfo.selectData'))
      } else {
        this.toRelease(this.selRowId)
      }
    },
    handleUnpublishAll () {
      if (this.$refs.imageTable.selectedData.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.ImageLibrary.imageManagement.promptInfo.selectData'))
      } else {
        this.toUnRelease(this.selRowId)
      }
    },
    handleDeleteAll () {
      if (this.$refs.imageTable.selectedData.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.ImageLibrary.imageManagement.promptInfo.selectData'))
      } else {
        this.toDelete(this.selRowId)
      }
    },
    resetForm () {
      this.selectObj = {
        hsCodes: '',
        siteId: '',
        deviceId: ''
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
        url: '/imagelibrary/image/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    setParams () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.createTime
      delete params.imgPublishTime
      let keys = Object.keys(params)
      keys.forEach(e => {
        if (this.userDefine.indexOf(e) < 0 && e !== 'page' && e !== 'size') {
          delete params[e]
        }
      })
      if (this.userDefine.indexOf('createTime') > -1) {
        let createTime = this.formRule.model.createTime
        if (createTime != null && createTime.length === 2) {
          params.createTimeStart = createTime[0]
          params.createTimeEnd = createTime[1]
        }
      }
      if (this.userDefine.indexOf('imgPublishTime') > -1) {
        let imgPublishTime = this.formRule.model.imgPublishTime
        if (imgPublishTime != null && imgPublishTime.length === 2) {
          params.imgPublishTimeStart = imgPublishTime[0]
          params.imgPublishTimeEnd = imgPublishTime[1]
        }
      }
      params.siteId = this.selectObj.siteId
      params.deviceId = this.selectObj.deviceId
      params.hsCodes = this.formRule.model.hsCodes
      return params
    },
    query () {
      let params = this.setParams()
      if (this.$refs.imageTable && this.$refs.imageTable.$refs['imageMgmtTable']) {
        this.$refs.imageTable.$refs['imageMgmtTable'].clearSelection()
      }
      this.getList(params)
    },
    getList (params) {
      this.$data.tableData.data = []
      this.tableData.isPage = false
      ajax.getImageList(params).then(res => {
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
            item.deviceCode = item.deviceName
            item.imageStatus = item.imageStatus.toUpperCase()
            if (item.showImageName === null || item.showImageName === undefined || item.showImageName === '') {
              // 加载默认图片
              item.showImageName = this.defaultImg
            }
            // 根据不同的图像状态设置操作按钮
            item.operation = []
            let operateArr = []
            this.operation.forEach((e, index) => {
              if (this.getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.DETAIL)) {
                operateArr.push(0)
              }
              if (item.imageStatus === 'TEMPORARY') {
                // 暂存
                if (this.getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.EDIT)) {
                  operateArr.push(1)
                }
                if (this.getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.DELETE)) {
                  operateArr.push(3)
                }
              } else if (item.imageStatus === 'SUBMIT') {
                // 待审核
                if (this.getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.AUDIT)) {
                  // 管理员账号可以审核
                  operateArr.push(2)
                }
              } else if (item.imageStatus === 'REJECTED') {
                // 已拒绝
                if (this.getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.DELETE)) {
                  operateArr.push(3)
                }
              }
              // 已发布只有详情
              if (operateArr.indexOf(index) !== -1) {
                item.operation.push(e)
              }
            })
            // 采集方式
            if (item.imageCollectMode === '1') {
              item.imageCollectMode = this.$t(`vicenter.ImageLibrary.common.AcquisitionMode.MANNUAL`)
            } else if (item.imageCollectMode === '2') {
              item.imageCollectMode = this.$t(`vicenter.ImageLibrary.common.AcquisitionMode.SUPERVISION`)
            }
            // 图像类型
            item.imageType = item.imageType ? this.$t(`vicenter.ImageLibrary.common.imageType.${item.imageType}`) : ''
            // 图像状态
            item.imageStatus = item.imageStatus ? this.$t(`vicenter.ImageLibrary.common.imageStatus.${item.imageStatus}`) : ''
            // 嫌疑物类型
            if (item.seizedType !== '' && item.seizedType !== 'null' && item.seizedType) {
              let typeArr = item.seizedType.split(',')
              let _typeArr = []
              typeArr.forEach(e => {
                _typeArr.push(this.$t(`vicenter.DIC.T_CONTRABAND_TYPE.C_${e}`))
              })
              item.seizedType = _typeArr.join(',')
            } else {
              item.seizedType = ''
            }
            // 嫌疑物位置
            if (item.seizedLocation !== '' && item.seizedLocation !== 'null' && item.seizedLocation) {
              let localArr = item.seizedLocation.split(',')
              let _localArr = []
              localArr.forEach(e => {
                _localArr.push(this.$t(`vicenter.DIC.T_CONTRABAND_LOCATION.C_${e}`))
              })
              item.seizedLocation = _localArr.join(',')
            } else {
              item.seizedLocation = ''
            }
            // 推荐时间
            item.createTime = this.$options.filters['formatDate'](item.createTime, this.$t('vicenter.common.formatDate'))
            // 图像发布时间
            item.imgPublishTime = this.$options.filters['formatDate'](item.imgPublishTime, this.$t('vicenter.common.formatDate'))
            // 缩略图数据
            item.infoData = [
              {
                label: this.$t('vicenter.ImageLibrary.common.ImageName'),
                value: item.imageName
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
                value: item.imageType
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.acquisitionMode'),
                value: item.imageCollectMode
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.status'),
                value: item.imageStatus
              }
            ]
          })
        }
      }).catch(() => {})
    },
    getDetail (scope) {
      this.$router.push({
        path: '/ImageLibrary/imageManagement/imageDetails'
      })
      let details = {
        id: scope.row.id,
        flag: false
      }
      sessionStorage.setItem('details', JSON.stringify(details))
    },
    toEdit (scope) {
      this.$router.push({
        path: '/ImageLibrary/imageManagement/ImageEdit'
      })
      let Edit = {
        id: scope.row.id
      }
      sessionStorage.setItem('details', JSON.stringify(Edit))
    },
    handleReview (scope) {
      this.$router.push({
        path: '/ImageLibrary/imageManagement/imagePreview'
      })
      let preview = {
        id: scope.row.id
      }
      sessionStorage.setItem('details', JSON.stringify(preview))
    },
    toRelease (id) {
      let params = {
        id: id
      }
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toRelease'), () => {
        ajax.releaseImage(params).then(res => {
          if (res.data.flag) {
            this.query()
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.releaseSuccess'))
          }
        }).catch(() => {})
      })
    },
    toUnRelease (id) {
      let params = {
        id: id
      }
      console.log(params)
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toUnRelease'), () => {
        ajax.unreleaseImage(params).then(res => {
          if (res.data.flag) {
            this.query()
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.unReleaseSuccess'))
          }
        }).catch(() => {})
      })
    },
    toReject (scope) {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toReject'), () => {
        ajax.rejectImage({ids: [scope.row.id]}).then(res => {
          if (res.data.flag) {
            this.query()
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.rejectSuccess'))
          }
        }).catch(() => {})
      })
    },
    toDelete (id) {
      let params = {
        id: id
      }
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        ajax.deleteImage(params).then(res => {
          if (res.data.flag) {
            this.query()
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.deleteSuccess'))
          }
        }).catch(() => {})
      })
    },
    /**
     * 获取机构树方法
     */
    orgAjaxTree () {
      commonAjax.orgNodesTree({all: true}).then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
          this.$data.inputItemRes.forEach(e => {
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
          this.$data.inputItemRes.forEach(e => {
            if (e.ruleProp === 'deviceId') {
              e.treedata = res.data.result
            }
          })
        }
      }).catch(() => {})
    },
    /**
     * 获取hscode树方法
     */
    hscodeAjaxTree () {
      let params = {
        hsCode: 0
      }
      hscodeAjax.getNodeAndChildren(params).then(res => {
        if (res.data.flag) {
          let treeData = this.$json2treeData(res.data.result, 'id', 'pid')
          this.$data.inputItemRes.forEach(e => {
            if (e.ruleProp === 'hsCodes') {
              e.treedata = treeData
            }
          })
        }
      }).catch(() => {})
    },
    /**
     * 机构树点击节点
     */
    siteCodeCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'siteId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['siteId'] = checkedValue.ids
        this.selectObj.siteCode = checkedValue.codes
        this.selectObj.siteId = checkedValue.ids
      }
    },
    /**
     * 设备树点击节点
     */
    deviceCodeCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkNodeChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'deviceId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['deviceId'] = checkedValue.ids
        this.selectObj.deviceCode = checkedValue.codes
        this.selectObj.deviceId = checkedValue.ids
      }
    },
    /**
     * hscode树点击节点
     */
    hsCodesCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$hscodeCheckChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'hsCodes') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['hsCodes'] = checkedValue.ids
        this.selectObj.hsCodes = checkedValue.codes
      }
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
      if (this.formRule.model.createTime === null || this.formRule.model.createTime.length === 0) {
        times = {}
      } else {
        times = {
          createTimeFrom: this.formRule.model.createTime[0],
          createTimeTo: this.formRule.model.createTime[1]
        }
      }
      var value = {
        imageName: this.formRule.model.imageName,
        imageDesc: this.formRule.model.imageDesc,
        scanSerialNumber: this.formRule.model.scanSerialNumber,
        seizedLocation: this.formRule.model.seizedLocation,
        seizedType: this.formRule.model.seizedType,
        imageType: this.formRule.model.imageType,
        imageCollectMode: this.formRule.model.imageCollectMode,
        hsCodes: this.formRule.model.hsCodes,
        siteId: this.formRule.model.siteId,
        deviceId: this.formRule.model.deviceId,
        imageStatus: this.formRule.model.imageStatus,
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
          this.formRule.rule = {}
          res.data.result.userDefineSc.forEach(e => {
            this.$data.inputItemOrigin.forEach(orgin => {
              if (orgin.ruleProp === e.taskField) {
                this.$data.inputItem.push(orgin)
                this.userDefine.push(e.taskField)
              }
            })
            // 添加查询条件校验规则
            let rules = this.$allRules()
            let allRulesKeys = Object.keys(rules)
            if (allRulesKeys.length > 0 && allRulesKeys.includes(e.taskField)) {
              this.formRule.rule[e.taskField] = rules[e.taskField]
            }
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
            type: 'selection',
            width: '40px'
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
  components: { bread, ComForm, panelTitle, ComTable },
  watch: {
    'seizedGoodsData': {
      handler (newValue, oldValue) {
        for (let k = 0; k < newValue.length; k++) {
          if (newValue[k].ruleProp === 'contrabandType') {
            this.inputItemRes.forEach(e => {
              if (e.ruleProp === 'seizedType') {
                e.option = newValue[k].option
              }
            })
          }
          if (newValue[k].ruleProp === 'contrabandLocation') {
            this.inputItemRes.forEach(e => {
              if (e.ruleProp === 'seizedLocation') {
                e.option = newValue[k].option
              }
            })
          }
        }
      },
      deep: true
    }
  }
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
          cursor: not-allowed;
        }
        .viewClass {
          margin: 0;
        }
        .tabViewBtn {
          margin-left: $dis10;
          button {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
