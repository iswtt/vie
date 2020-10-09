<template>
  <div class='demo-bar' v-bar>
    <div class="demo-M">
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
            <el-button type="primary" size="mini" @click='handleCreate'>{{$t('vicenter.ImageLibrary.HSCodeManagement.Create')}}</el-button>
            <el-button type="danger" size="mini" @click='handleDeleteAll'>{{$t('vicenter.common.delete')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="imageTable" @listenToSelectDataEvent='selectRow' :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
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
export default {
  name: 'demo',
  data () {
    return {
      titleBread: {},
      panelTitle: {},
      searchIpt: [ // 查询表单
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
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'createTime',
          editable: false,
          blur: this.blur,
          focus: this.focus
        },
        {
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'imgPublishTime',
          editable: false,
          blur: this.blur,
          focus: this.focus
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
          model: 'deviceName',
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
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 0,
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
      this.searchIpt.forEach((e) => {
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
        } else if (e.ruleProp === 'siteCode') {
          e.getLabel = this.$t('vicenter.ImageLibrary.common.siteCode')
          e.placeHolder = this.$t('vicenter.ImageLibrary.common.checkSiteCode')
        } else if (e.ruleProp === 'deviceCode') {
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
      // 查询列
      this.tableGroup.forEach((e) => {
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
        } else if (e.model === 'deviceName') {
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
      this.query()
    },
    handleCreate () {},
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.$data.selRowId = idArr.join(',')
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
    query () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.createTime
      delete params.imgPublishTime
      let { createTime, imgPublishTime } = this.formRule.model
      if (createTime != null && createTime.length === 2) {
        params.createTimeFrom = createTime[0]
        params.createTimeTo = createTime[1]
      }
      if (imgPublishTime != null && imgPublishTime.length === 2) {
        params.imgPublishTimeFrom = imgPublishTime[0]
        params.imgPublishTimeTo = imgPublishTime[1]
      }
      params.siteId = this.selectObj.siteId
      params.deviceId = this.selectObj.deviceId
      params.hsCodes = this.formRule.model.hsCodes
      this.getList(params)
    },
    getList (params) {
      this.$data.tableData.data = [
        {
          id: '1234567890'
        },
        {
          id: '234234635746'
        }
      ]
      this.tableData.isPage = true
      this.tableData.data.forEach(item => {
        item.operation = this.operation
      })
    },
    getDetail (scope) {},
    toEdit (scope) {},
    handleReview (scope) {},
    toRelease (id) {},
    toUnRelease (id) {},
    toReject (scope) {},
    toDelete (id) {
      let params = {
        id: id
      }
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.deleteSuccess'))
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
        siteId: this.selectObj.siteId,
        deviceId: this.selectObj.deviceId,
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
  components: { bread, ComForm, panelTitle, ComTable }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.demo-bar {
  @extend .extend-bar;
  .demo-M {
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
      }
    }
  }

}
</style>
