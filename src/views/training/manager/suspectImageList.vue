<template>
  <div class='suspectImageList-bar'  v-bar>
    <div class="suspectImageList-M">
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
            <el-button data-id="typicalMapImport-btn" type="primary" size="mini" @click='handleImport(1)'>{{$t('vicenter.training.common.imageSourceList.1')}}{{$t('vicenter.training.common.import')}}</el-button>
            <el-button data-id="supervisionImport-btn" type="primary" size="mini" @click='handleImport(2)'>{{$t('vicenter.training.common.imageSourceList.2')}}{{$t('vicenter.training.common.import')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="suspectImageTable" @listenToSelectDataEvent='selectRow' :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <Dialog :modalData="modalData"  class="formDialog">
        <ComForm ref="addForm" id="addForm" :searchIpt="addInputItem" :searchFunc="{}" :formRule='addFormRule'></ComForm>
        <div class="review">
          <p>{{$t('vicenter.training.common.imageFile')}}</p>
          <div class="uploadBox">
            <div class="uploadButton" v-if="!(showBtns === false && switchBtns === false)">
              <el-button data-id="openVIProbe-btn" type="primary" @click="openVIProbe">{{$t('vicenter.training.common.selectDocument')}}<i class="el-icon-upload el-icon--right"></i></el-button>
            </div>
            <ul class="swiperPreview" data-id="swiperPreview-ul">
              <li v-for="(tmp, index) in saveImg.image_files" :key='index'>
                <i class="iconfont">&#xe804;</i>{{tmp.name}}
              </li>
            </ul>
          </div>
        </div>
        <div class="resultbutton" v-if="showBtns">
          <el-button data-id="temporary-btn" type="warning" size="medium" @click="temporary">{{$t('vicenter.training.common.temporary')}}</el-button>
          <el-button data-id="release-btn" type="primary" size="medium" @click="release">{{$t('vicenter.training.common.release')}}</el-button>
        </div>
        <div class="resultbutton" v-if="switchBtns">
          <el-button data-id="temporary-btn" type="warning" size="medium" @click="submit(2)">{{$t('vicenter.training.common.temporary')}}</el-button>
          <el-button data-id="release-btn" type="primary" size="medium" @click="submit(0)">{{$t('vicenter.training.common.release')}}</el-button>
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
import upload from '@/components/uploadPreview'
import Dialog from '@/components/dialog'
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajaxIndex from '@/api/training/index.js'
import ajax from '@/api/training/manager.js'
import commonAjax from '@/api/background/HSCode.js'
import { reject, resolve } from 'q'
export default {
  name: 'demo',
  data () {
    const config = window.config
    return {
      timer: { // VIProbe接口回调成功变量
        one: '',
        two: '',
        three: ''
      },
      type: '', // 区别暂存、发布、提交
      status: '', // 0：新增1：编辑
      modalData: {
        flag: false,
        resetModal: this.customReset,
        title: ''
      },
      showBtns: true,
      switchBtns: false,
      titleBread: {},
      panelTitle: {},
      searchIpt: [ // 查询表单
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'testImgName'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'testImgCreateSource'
        },
        // {
        //   getLabel: this.$t('vicenter.training.common.hsCodes'),
        //   type: 'selectRemote',
        //   models: [],
        //   ruleProp: 'testImgHashCodes',
        //   clearable: true,
        //   option: [],
        //   reserveKeyword: true,
        //   loading: false,
        //   change: this.serachHscodeChange,
        //   remoteMethod: this.serachGetRemoteHscode,
        //   focus: this.serachFocus,
        //   iptClass: 'traicSelect',
        //   multiple: true,
        //   disabled: false
        // },
        {
          getLabel: this.$t('vicenter.training.common.hsCodes'),
          placeHolder: ' ',
          models: [],
          options: [],
          ruleProp: 'testImgHashCodes',
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
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'testImgXyType'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'testImgStatus'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'testImgForWhat'
        }
      ],
      formRule: { // 查询表单规则
        model: {
          testImgName: '',
          testImgCreateSource: '',
          testImgHashCodes: '',
          testImgStatus: '',
          testImgForWhat: ''
        },
        refName: 'queryForm',
        rule: {}
      },
      addInputItem: [ // 基础表单
        {
          type: 'select2',
          clearable: true,
          models: '',
          option: [],
          change: () => { this.changeDeviceType('addForm', 'testImgXyType') },
          getLabel: this.$t('vicenter.training.common.suspect'),
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.suspect'),
          ruleProp: 'testImgXyType'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          getLabel: this.$t('vicenter.training.common.imageName'),
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.imageName'),
          ruleProp: 'testImgName'
        },
        {
          type: 'textarea',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          minSize: 1,
          maxlength: 100,
          getLabel: this.$t('vicenter.training.common.imageDesc'),
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.imageDesc'),
          ruleProp: 'testImgDesc'
        },
        // {
        //   getLabel: this.$t('vicenter.training.common.hsCodes'),
        //   type: 'selectRemote',
        //   models: [],
        //   ruleProp: 'testImgHashCodes',
        //   clearable: true,
        //   option: [],
        //   reserveKeyword: true,
        //   loading: false,
        //   change: this.addHscodeChange,
        //   remoteMethod: this.addGetRemoteHscode,
        //   focus: this.addFocus,
        //   iptClass: 'addtraicSelect',
        //   multiple: true
        // },
        {
          getLabel: this.$t('vicenter.training.common.hsCodes'),
          placeHolder: ' ',
          models: [],
          options: [],
          ruleProp: 'testImgHashCodes',
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
            maxLimit: 10 // 标准图最多选择一个，违规图可以多个
          }
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          change: () => { this.changeDeviceType('addForm', 'testImgForWhat') },
          getLabel: this.$t('vicenter.training.common.scopeOfApplication'),
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.scopeOfApplication'),
          ruleProp: 'testImgForWhat'
        }
      ],
      strJson: {
        imgsName: [],
        imgsUrl: [],
        originalThumbnail: [],
        suspectThumbnail: [],
        imgsJson: []
      },
      addFormRule: { // 查询表单规则
        model: {
          testImgXyType: '',
          testImgName: '',
          testImgDesc: '',
          testImgHashCodes: '',
          testImgForWhat: '',
          strJson: []
        },
        refName: 'addForm',
        rule: {
          testImgXyType: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.suspect'), trigger: 'change' }
          ],
          testImgForWhat: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.scopeOfApplication'), trigger: 'change' }
          ]
        }
      },
      tableGroup: [ // 表格数据列
        {
          type: 'index',
          model: 'index',
          width: '80px'
        },
        {
          type: 'img',
          height: '50px',
          model: 'thumbnail',
          width: '160px'
        },
        {
          type: 'text',
          model: 'testImgCreateSource'
        },
        {
          type: 'text',
          model: 'testImgName'
        },
        {
          type: 'text',
          model: 'testImgHashCodes'
        },
        {
          type: 'text',
          model: 'testImgXyTypeTableGroup'
        },
        {
          type: 'text',
          model: 'testImgForWhatTableGroup'
        },
        {
          type: 'text',
          model: 'testImgStatus'
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
      viprobeData: {
        timeout: 3000
      },
      saveImg: {
        name: '',
        server_path: config.trainingUI.fileUrl,
        trans: config.trainingUI.trans,
        image_files: []
      },
      rowData: {},
      typeCodeArr: [],
      tempIndex: 0, // 解决查询条件和列表项重复的问题
      hscodeData: {
        queryTxt: '',
        selectHscode: [],
        checkedNodes: []
      },
      addHscodeData: {
        queryTxt: '',
        selectHscode: [],
        checkedNodes: []
      },
      // 查询hscode参数补充
      serachHsNameData: [],
      // 查询hscode参数补充
      addHsNameData: [],
      markJson: [], // 嫌疑标记参数
      localVipStr: null, // viprobe接口返回数据
      relativeFolder: '' // 获取文件夹路径  新增接口获取
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
  watch: {
    // 监听VIProbe回调成功
    timer: {
      handler (newValue, oldValue) {
        console.log(newValue)
        if (newValue.one && newValue.two && newValue.three) {
          console.log('全部好了')
          this.addStrJson()
          if (this.status === 1) {
            this.updateQuestion()
          } else {
            this.addFormRule.model.testImgStatus = newValue.type
            this.addQuestion()
          }
        }
      },
      deep: true
    }
  },
  methods: {
    serachFocus () {
      this.$trainHsCodeFocus(this.searchIpt[2], this.hscodeData)
    },
    addFocus () {
      this.$trainHsCodeFocus(this.addInputItem[3], this.addHscodeData)
    },
    addHscodeChange () {
      let hscodeItem = this.addInputItem[3]
      let selectNode = this.$trainHsCodeChange(hscodeItem, this.addHscodeData)
      this.addHsNameData = selectNode
    },
    addGetRemoteHscode (query) {
      let hscodeItem = this.addInputItem[3]
      this.$trainGetRemoteHscode(query, hscodeItem, this.addHscodeData)
    },
    serachHscodeChange () {
      let hscodeItem = this.searchIpt[2]
      let selectNode = this.$trainHsCodeChange(hscodeItem, this.hscodeData)
      this.serachHsNameData = selectNode
    },
    serachGetRemoteHscode (query) {
      let hscodeItem = this.searchIpt[2]
      this.$trainGetRemoteHscode(query, hscodeItem, this.hscodeData)
    },
    setI18n () {
      this.$getDataByTypecode(['CONTRABAND_TYPE'], ['testImgXyType'], this.searchIpt)
      this.$getDataByTypecode(['CONTRABAND_TYPE'], ['testImgXyType'], this.addInputItem)
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
        this.$t('vicenter.common.fix'),
        this.$t('vicenter.training.common.release'),
        this.$t('vicenter.common.delete')
      ]
      operateTitle.forEach((e, index) => {
        this.operation[index].title = e
      })
      // 查询条件
      this.searchIpt.forEach((e) => {
        if (e.ruleProp === 'testImgName') {
          e.getLabel = this.$t('vicenter.training.common.imageName')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.imageName')
        } else if (e.ruleProp === 'testImgCreateSource') {
          e.getLabel = this.$t('vicenter.training.common.imageSource')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.imageSource')
          e.option = []
          for (let i in this.$t('vicenter.training.common.imageSourceList')) {
            let obj = {}
            obj.value = Number(i)
            obj.label = this.$t('vicenter.training.common.imageSourceList')[i]
            e.option.push(obj)
          }
        } else if (e.ruleProp === 'testImgHashCodes') {
          e.getLabel = this.$t('vicenter.training.common.hsCodes')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.hsCodes')
        } else if (e.ruleProp === 'testImgStatus') {
          e.getLabel = this.$t('vicenter.training.common.testStatus')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.testStatus')
          e.option = []
          for (let i in this.$t('vicenter.training.common.testStatusList')) {
            let obj = {}
            obj.value = Number(i)
            obj.label = this.$t('vicenter.training.common.testStatusList')[i]
            e.option.push(obj)
          }
        } else if (e.ruleProp === 'testImgXyType') {
          e.getLabel = this.$t('vicenter.training.common.suspect')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.suspect')
        } else if (e.ruleProp === 'testImgForWhat') {
          e.getLabel = this.$t('vicenter.training.common.scopeOfApplication')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.scopeOfApplication')
          e.option = []
          for (let i in this.$t('vicenter.training.common.scopeOfApplicationList')) {
            let obj = {}
            obj.value = Number(i)
            obj.label = this.$t('vicenter.training.common.scopeOfApplicationList')[i]
            e.option.push(obj)
          }
        }
      })
      // 新增条件
      this.addInputItem.forEach((e) => {
        if (e.ruleProp === 'testImgXyType') {
          e.option = []
          for (let i in this.$t('vicenter.training.common.suspectList')) {
            let obj = {}
            obj.value = Number(i)
            obj.label = this.$t('vicenter.training.common.suspectList')[i]
            e.option.push(obj)
          }
        } else if (e.ruleProp === 'testImgForWhat') {
          e.option = []
          for (let i in this.$t('vicenter.training.common.scopeOfApplicationList')) {
            let obj = {}
            obj.value = Number(i)
            obj.label = this.$t('vicenter.training.common.scopeOfApplicationList')[i]
            e.option.push(obj)
          }
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'index') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'thumbnail') {
          e.label = this.$t('vicenter.training.common.imagePath')
        } else if (e.model === 'testImgCreateSource') {
          e.label = this.$t('vicenter.training.common.imageSource')
        } else if (e.model === 'testImgName') {
          e.label = this.$t('vicenter.training.common.imageName')
        } else if (e.model === 'testImgHashCodes') {
          e.label = this.$t('vicenter.training.common.hsCodes')
        } else if (e.model === 'testImgXyTypeTableGroup') {
          e.label = this.$t('vicenter.training.common.suspect')
        } else if (e.model === 'testImgForWhatTableGroup') {
          e.label = this.$t('vicenter.training.common.scopeOfApplication')
        } else if (e.model === 'testImgStatus') {
          e.label = this.$t('vicenter.training.common.testStatus')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.query()
    },
    // 查询
    query () {
      let params = {}
      // console.log(this.tableData)
      params = JSON.parse(JSON.stringify(this.formRule.model))
      params.testImgClass = 1
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      // console.log(this.searchIpt)
      this.getList(params)
    },
    getList (params) {
      console.log(params)
      // if (params.testImgHashCodes !== '' && params.testImgHashCodes.length > 0) {
      //   params.hsIds = params.testImgHashCodes.join(',')
      //   let testImgHashCodes = []
      //   let hsNames = []
      //   this.serachHsNameData.forEach(e => {
      //     testImgHashCodes.push(e.hsCode)
      //     hsNames.push(e.name)
      //   })
      //   params.testImgHashCodes = testImgHashCodes.join(',')
      //   params.hsNames = hsNames.join(',')
      // }
      this.openLoading()
      ajax.getQuestionBank(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result
          this.tableData.data = content
          this.tableData.data.forEach(item => {
            // console.log(item)
            let operation = this.operation.map(item => ({...item}))
            // 操作
            if (item.testImgStatus === 0) {
              for (let [key, val] of operation.entries()) {
                if (key !== 0) {
                  val.show = false
                }
              }
              item.operation = operation
            } else {
              item.operation = operation
            }
            // 图像
            item.thumbnail = item.listEntities.length > 0 ? window.config.trainingUI.fileUrl + item.listEntities[0].suspectThumbnail : ''
            // 图像来源
            item.testImgCreateSource = this.$t(`vicenter.training.common.imageSourceList.${item.testImgCreateSource}`)
            // 嫌疑物
            item.testImgXyTypeTableGroup = ''
            if (item.testImgXyType) {
              let ctArr = item.testImgXyType.split(',').map(ct => this.$t(`vicenter.DIC.T_CONTRABAND_TYPE.C_${ct}`))
              item.testImgXyTypeTableGroup = ctArr.join(',')
            }
            // 适用范围
            item.testImgForWhatTableGroup = this.$t(`vicenter.training.common.scopeOfApplicationList.${item.testImgForWhat}`)
            // 试题状态
            item.testImgStatus = this.$t(`vicenter.training.common.testStatusList.${item.testImgStatus}`)
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
    // 本地文件打开viprobe
    openVIProbe () {
      viProbe.closeAllImageInViProbe()
      this.saveImg.name = new Date().getTime().toString()
      viProbe.openLocalImageInViProbe(this.saveImg.name)
      viprobeReturn.openLocalResult.flag = null
      this.openLocalImageInViProbeCallBack()
    },
    // 本地文件打开viprobe回调
    openLocalImageInViProbeCallBack () {
      if (viprobeReturn.openLocalResult.flag === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
          this.resetImgFrom()
          return false
        } else {
          setTimeout(this.openLocalImageInViProbeCallBack, this.viprobeData.timeout)
        }
      } else if (viprobeReturn.openLocalResult.flag === true) {
        console.log(viprobeReturn.openLocalResult, '打开本地文件回调')
        let files = viprobeReturn.openLocalResult.result.filter(e => {
          let imgext = e.substr(e.lastIndexOf('.') + 1)
          imgext = imgext.toLowerCase()
          return ['img', 'uff', 'tif', 'tiff', 'png'].includes(imgext)
        }) // 【考培】新增标准图像库、嫌疑图像库添加图像，图像素材上传，目前可上传jpg文件，建议只允许上传img和uff
        this.saveImg.image_files = []
        if (files.length > 0) {
          files.forEach(e => {
            let name = e.substring(e.lastIndexOf('/') + 1, e.length)
            this.saveImg.image_files.push({name: name, sign: ''})
          })
        } else {
          // 2020-07-25 上传不支持图像文件，建议添加提示信息
          this.$NotifError(this.$t('vicenter.training.common.formatNotSupported'))
        }
      } else if (viprobeReturn.openLocalResult.flag === false) {
        // 弹出提示框，提示用户，与ViProbe交互失败
        this.resetImgFrom()
        this.closeLoading()
        this.$NotifError(this.$t('vicenter.common.viprobe.openLocalError'))
      }
    },
    // 调用获取嫌疑标记回调
    getMarkAsJsonCallBack (resolve) {
      if (!viprobeReturn.getMarkJsonSuccess) {
        setTimeout(this.getMarkAsJsonCallBack, this.viprobeData.timeout)
      } else {
        console.log(viprobeReturn.markJson, '获取嫌疑标记回调')
        // let arr1 = []
        // let arr2 = []
        // viprobeReturn.markJson.forEach(item => {
        //   if (item.view) {
        //     if (item.view === 0) {
        //       arr1.push(item)
        //     } else {
        //       arr2.push(item)
        //     }
        //   } else {
        //     arr1.push(item)
        //   }
        // })
        // this.strJson.imgsJson[0] = arr1
        // if (arr2.length > 0) {
        //   this.strJson.imgsJson[1] = arr2
        // }
        // this.markJson[0] = arr1
        // if (arr2.length > 0) {
        //   this.markJson[1] = arr2
        // }

        this.markJson = viprobeReturn.markJson
        if (viprobeReturn.markJson.length === 0) {
          this.$NotifPrompt(this.$t('vicenter.training.common.notMarkJson'))
          this.closeLoading()
          return
        }
        // 无需业务端上传base64缩略图，直接上传
        this.timer.one = true
        this.viprobeUploadNew()
        this.timer.two = ''
        // 有标记在上传
        // viProbe.getImageInViProbeBase64(this.saveImg.name, true, false)
        // viprobeReturn.imageInViProbeSuccess = null
        // this.timer.two = ''
        // this.getImageInViProbeBase64CallBack()
        // this.timer.one = true
      }
    },
    async viprobeUploadNew () {
      let res = await ajaxIndex.createFloder()
      if (res.data.flag) {
        this.timer.one = true
        let url = res.data.result
        this.relativeFolder = url
        // 改为调用upload_images_v2
        viProbe.uploadLocalImageNew(this.saveImg.name, url)
        // 解决多次调用bug
        viprobeReturn.uploadLocalImageSuccess = null
        viprobeReturn.uploadLocalv2Res = ''
        this.timer.two = ''
        this.uploadLocalImageNewCallBack(url)
      } else {
        this.closeLoading()
      }
    },
    // 本地文件上传viprobe回调
    uploadLocalImageNewCallBack (url) {
      if (!viprobeReturn.uploadLocalImageSuccess) {
        if (viprobeReturn.uploadLocalImageSuccess === false) {
          this.$NotifError(this.$t('vicenter.Background.device.uploadFailure'))
          this.closeLoading()
        } else {
          setTimeout(this.uploadLocalImageNewCallBack, this.viprobeData.timeout, url)
        }
      } else {
        this.localVipStr = JSON.stringify(viprobeReturn.uploadLocalv2Res)
        this.timer.two = true
        this.timer.three = true
      }
    },
    // 调用获取图像回调
    getImageInViProbeBase64CallBack () {
      if (!viprobeReturn.imageInViProbeSuccess) {
        setTimeout(this.getImageInViProbeBase64CallBack, this.viprobeData.timeout)
      } else {
        console.log(viprobeReturn.isOriginal, '获取图像缩略图回调')
        let imageInViProbeBase64 = viprobeReturn.imageInViProbeBase64.join(',')
        this.base64Uplaod(imageInViProbeBase64, viprobeReturn.isOriginal)
      }
    },
    // base64文件上传
    base64Uplaod (strList, isOriginal) {
      let params = {
        strList: strList
      }
      ajaxIndex.base64Uplaod(params).then((res) => {
        // console.log(res)
        if (res.data.flag) {
          if (isOriginal) {
            // let arr = res.data.result.split(',')
            // arr.forEach((item, index) => {
            //   this.addFormRule.model.strJson[index].originalThumbnail = item
            // })
            this.strJson.originalThumbnail = res.data.result.split(',')
            // 解决多次调用bug
            viProbe.getImageInViProbeBase64(this.saveImg.name, false, true)
            viprobeReturn.imageInViProbeSuccess = null
            this.getImageInViProbeBase64CallBack()
          } else {
            // let arr = res.data.result.split(',')
            // arr.forEach((item, index) => {
            //   this.addFormRule.model.strJson[index].suspectThumbnail = item
            // })
            this.strJson.suspectThumbnail = res.data.result.split(',')
            this.timer.two = true
            /*
            * viProbe.uploadLocalImage 第三个参数修改为 后台返回的路径 （截取到最后一个文件夹）
            * 原参数为： this.saveImg.server_path
            * */
            let url = this.strJson.originalThumbnail[0]
            // url = this.saveImg.server_path + url.substring(0, url.lastIndexOf('/') + 1)
            /*
             * 2020-03-18 陈凯说 去除 this.saveImg.server_path
             * */
            url = url.substring(0, url.lastIndexOf('/') + 1)
            viProbe.uploadLocalImage(this.saveImg.name, this.saveImg.trans, this.saveImg.server_path + url, this.saveImg.image_files)
            // 解决多次调用bug
            viprobeReturn.uploadLocalImageSuccess = null
            this.timer.three = ''
            this.uploadLocalImageCallBack(url)
          }
        } else {
          this.closeLoading()
        }
      })
    },
    // 本地文件上传viprobe回调
    uploadLocalImageCallBack (url) {
      if (!viprobeReturn.uploadLocalImageSuccess) {
        setTimeout(this.uploadLocalImageCallBack, this.viprobeData.timeout, url)
      } else {
        // this.saveImg.image_files.forEach((item, index) => {
        //   // this.addFormRule.model.strJson[index].imgsUrl = this.saveImg.server_path + item.name
        //   this.addFormRule.model.strJson[index].imgsUrl = item.name
        //   this.addFormRule.model.strJson[index].imgsName = item.name
        // })
        console.log(this.saveImg.image_files)
        this.strJson.imgsUrl = this.saveImg.image_files.map((item, index) => {
          return url + item.name
          // return item.name
        })
        this.strJson.imgsName = this.saveImg.image_files.map((item, index) => {
          return item.name
        })
        this.timer.three = true
      }
    },
    resetImgFrom () {
      if (this.saveImg.image_files.length === 0) {
        this.addFormRule.model.strJson = []
      }
    },
    // 重置
    resetForm () {
      this.hscodeData.selectHscode = []
      this.searchIpt[2].models = []
      this.searchIpt[2].option = []
      this.formRule.model.testImgHashCodes = ''
      // this.query()
    },
    // 自定义重置
    customReset () {
      if (this.$refs['addForm']) {
        this.$refs['addForm'].reset()
      }
      this.saveImg.image_files = []
    },
    // 表单进行校验
    validate (num, submitType = null) {
      this.$refs['addForm'].$refs[this.addFormRule.refName].validate((valid) => {
        console.log(valid)
        if (valid) {
          // console.log(this.addFormRule)
          if (submitType !== null) {
            this.type = submitType
          } else {
            this.type = num
          }
          this.next(num)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 本地文件上传viprobe、获取嫌疑标记、获取缩略图
    next (num) {
      // console.log(viprobeReturn.openLocalResult.flag)
      this.openLoading()
      if (num === 3 && viprobeReturn.openLocalResult.flag !== true) {
        console.log(this.addFormRule.model)
        this.updateQuestion()
      } else {
        if (this.saveImg.image_files.length === 0) {
          this.$NotifPrompt(this.$t('vicenter.training.common.selectLocalError'))
          this.closeLoading()
          return false
        }
        viProbe.getMarkAsJson(this.saveImg.name, false, true)
        // 解决多次调用bug
        viprobeReturn.getMarkJsonSuccess = null
        this.timer.one = ''
        this.getMarkAsJsonCallBack()
        /*
        解决未标记vp依旧上传的bug
        放到getMarkAsJsonCallBack成功之后调用
        // 解决多次调用bug
        viProbe.getImageInViProbeBase64(this.saveImg.name, true, false)
        viprobeReturn.imageInViProbeSuccess = null
        this.timer.two = ''
        this.getImageInViProbeBase64CallBack()
        * */
        // viProbe.uploadLocalImage(this.saveImg.name, this.saveImg.trans, this.saveImg.server_path, this.saveImg.image_files)
        // // 解决多次调用bug
        // viprobeReturn.uploadLocalImageSuccess = null
        // this.timer.three = ''
        // this.uploadLocalImageCallBack()
      }
    },
    // 暂存
    temporary () {
      this.status = 0
      this.validate(2)
    },
    // 发布
    release () {
      this.status = 0
      this.validate(0)
    },
    // 提交
    submit (submitType) {
      this.status = 1
      this.validate(3, submitType)
    },
    // 上传文件后参数配置
    addStrJson () {
      console.log(this.strJson)
      if (this.strJson.originalThumbnail.length > 0) {
        this.addFormRule.model.strJson = []
        for (let i = 0; i < this.strJson.originalThumbnail.length; i++) {
          /*
            * 多文件变更
            * 一个 base64 => 一个 jpg(originalThumbnail) => 多个 img( imgsName/imgsUrl )
            * */
          this.addFormRule.model.strJson.push({
            imgsJson: this.strJson.imgsJson[i],
            imgsName: this.strJson.imgsName.join(','),
            imgsUrl: this.strJson.imgsUrl.join(','),
            originalThumbnail: this.strJson.originalThumbnail[i],
            suspectThumbnail: this.strJson.suspectThumbnail[i]
          })
          // let obj = {}
          // for (let key in this.strJson) {
          //   obj[key] = this.strJson[key][i]
          // }
          // this.addFormRule.model.strJson.push(obj)
        }
      }
    },
    // 新增试题
    addQuestion () {
      let params = JSON.parse(JSON.stringify(this.addFormRule.model))
      params.testImgClass = 1 // 图像种类
      params.testImgCreateSource = 0 // 图像来源
      params.pcUserId = sessionStorage.getItem('userId') // 创建人id
      params.strJson = JSON.stringify(params.strJson)
      params.testImgStatus = this.type
      if (params.testImgHashCodes && params.testImgHashCodes !== '' && params.testImgHashCodes.length > 0) {
        // params.hsIds = params.testImgHashCodes.join(',')
        // let testImgHashCodes = []
        // let hsNames = []
        // this.addHsNameData.forEach(e => {
        //   testImgHashCodes.push(e.hsCode)
        //   hsNames.push(e.name)
        // })
        // params.testImgHashCodes = testImgHashCodes.join(',')
        // params.hsNames = hsNames.join(',')
      } else {
        params.testImgHashCodes = ''
      }
      if (this.localVipStr) {
        params.localVipStr = this.localVipStr
      }
      params.relativeFolder = this.relativeFolder
      if (this.markJson) {
        params.markJson = JSON.stringify(this.markJson)
      }
      // console.log(params, '新增试题参数')
      params.testImgXyType = params.testImgXyType.join(',')
      ajax.addQuestion(params).then((res) => {
        this.closeLoading()
        console.log(res, '新增试题返回')
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
          this.query()
          setTimeout(() => {
            this.modalData.flag = false
          }, 2000)
        }
      })
    },
    // 更改试题内容
    updateQuestion () {
      let params = JSON.parse(JSON.stringify(this.addFormRule.model))
      params.strJson = JSON.stringify(params.strJson)
      params.testImgStatus = this.type
      if (params.testImgHashCodes && params.testImgHashCodes !== '' && params.testImgHashCodes.length > 0) {
        // params.hsIds = params.testImgHashCodes.join(',')
        // let testImgHashCodes = []
        // let hsNames = []
        // this.addHsNameData.forEach(e => {
        //   testImgHashCodes.push(e.hsCode)
        //   hsNames.push(e.name)
        // })
        // params.testImgHashCodes = testImgHashCodes.join(',')
        // params.hsNames = hsNames.join(',')
      } else {
        params.testImgHashCodes = ''
      }
      if (this.localVipStr) {
        params.localVipStr = this.localVipStr
      }
      params.relativeFolder = this.relativeFolder
      if (this.markJson) {
        params.markJson = JSON.stringify(this.markJson)
      }
      params.testImgXyType = params.testImgXyType.join(',')
      console.log(params, '更新试题参数')
      ajax.updateQuestion(params).then((res) => {
        this.closeLoading()
        console.log(res)
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
          this.query()
          setTimeout(() => {
            this.modalData.flag = false
          }, 2000)
        }
      })
    },
    // 选择器校验
    changeDeviceType (ref, param) {
      this.$changeSelectValidateField(ref, this, param)
    },
    // 典图和监管系统导入入口
    handleImport (num) {
      if (num === 1) {
        this.$router.push({
          path: '/Training/manager/suspectCode'
        })
      } else if (num === 2) {
        this.$router.push({
          path: '/Training/manager/suspectRegulatory'
        })
      }
    },
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.$data.selRowId = idArr.join(',')
    },
    // 新增
    handleCreate () {
      this.modalData.title = this.$t('vicenter.training.common.add')
      this.modalData.flag = true
      this.showBtns = true
      this.switchBtns = false
      if (viprobeReturn.openLocalResult) {
        viprobeReturn.openLocalResult.flag = null
      }
      this.addHscodeData.selectHscode = []
      this.$initSearchIpt(this.addInputItem, {}, false)
      this.changeInputItemType(false)
    },
    // 数组扁平化
    flatten (arr) {
      return arr.reduce((result, item) => {
        return result.concat(Array.isArray(item) ? this.flatten(item) : item)
      }, [])
    },
    // 详情
    getDetail (scope) {
      this.modalData.title = this.$t('vicenter.training.common.msg')
      this.modalData.flag = true
      this.showBtns = false
      this.switchBtns = false
      /*
      * 2020-02-27
      * bug修改 适用范围没有正确回显
      * */
      scope.row.testImgForWhat = JSON.parse(scope.row.testImgForWhat)
      this.rowData = scope.row
      console.log(this.rowData)
      this.$initSearchIpt(this.addInputItem, scope.row, true)
      this.addInputItem.forEach(e => {
        if (e.type === 'select2' && e.ruleProp === 'testImgXyType') { // 嫌疑物支持多选
          e.models = scope.row[e.ruleProp] ? scope.row[e.ruleProp].split(',') : ''
        }
      })
      /*
       * 2020-03-18
       * 多文件修改
       * */
      // this.saveImg.image_files = scope.row.listEntities[0].imgsName.split(',').map(e => { return { name: e, sign: '' } })
      /*
     * 2020-20-53
     * 全部遍历split去重
     * */
      let files = scope.row.listEntities.map(item => {
        return item.imgsName.split(',').map(e => ({ name: e, sign: '' }))
      })
      this.saveImg.image_files = Array.from(new Set(this.flatten(files).map(e => JSON.stringify(e)))).map(e => JSON.parse(e)) // 去重
      // let files = scope.row.listEntities
      // this.saveImg.image_files = []
      // if (files.length > 0) {
      //   files.forEach(e => {
      //     if (e.imgsUrl) {
      //       let name = e.imgsUrl.substring(e.imgsUrl.lastIndexOf('/') + 1, e.imgsUrl.length)
      //       this.saveImg.image_files.push({name: name, sign: ''})
      //     }
      //   })
      // }
      // console.log(this.addInputItem)
      /*
      hscode回显
      */
      this.addFormRule.model.testImgId = scope.row.testImgId
      this.addFormRule.model.testImgHashCodes = scope.row.testImgHashCodes
      this.addFormRule.model.hsIds = scope.row.hsIds
      // console.log(this.addFormRule.model)
      this.addInputItem[3].option = this.$trainSetHscodeEdit(scope.row)
      this.addInputItem[3].disabled = true
      this.$nextTick(() => {
        if (scope.row.hsIds) {
          this.addInputItem[3].models = scope.row.hsIds.split(',')
        }
        this.changeInputItemType(true, scope.row)
      })
    },
    // 编辑
    toEdit (scope) {
      this.modalData.title = this.$t('vicenter.training.common.edit')
      this.modalData.flag = true
      this.showBtns = false
      this.switchBtns = true
      viprobeReturn.openLocalResult.flag = null
      /*
      * 2020-02-27
      * bug修改 适用范围没有正确回显
      * */
      scope.row.testImgForWhat = JSON.parse(scope.row.testImgForWhat)
      this.rowData = scope.row
      console.log(this.rowData)
      this.$nextTick(() => {
        this.$initSearchIpt(this.addInputItem, scope.row)
        this.addInputItem.forEach(e => {
          if (e.type === 'select2' && e.ruleProp === 'testImgXyType') { // 嫌疑物支持多选
            e.models = scope.row[e.ruleProp] ? scope.row[e.ruleProp].split(',') : ''
          }
        })
      })
      this.addFormRule.model.strJson = JSON.parse(JSON.stringify(scope.row.listEntities))
      /*
       * 2020-03-18
       * 多文件修改
       * */
      // this.saveImg.image_files = scope.row.listEntities[0].imgsName.split(',').map(e => { return { name: e, sign: '' } })
      /*
    * 2020-20-53
    * 全部遍历split去重
    * */
      let files = scope.row.listEntities.map(item => {
        return item.imgsName.split(',').map(e => ({ name: e, sign: '' }))
      })
      this.saveImg.image_files = Array.from(new Set(this.flatten(files).map(e => JSON.stringify(e)))).map(e => JSON.parse(e)) // 去重

      // let files = scope.row.listEntities
      // this.saveImg.image_files = []
      // if (files.length > 0) {
      //   files.forEach(e => {
      //     if (e.imgsUrl) {
      //       let name = e.imgsUrl.substring(e.imgsUrl.lastIndexOf('/') + 1, e.imgsUrl.length)
      //       this.saveImg.image_files.push({name: name, sign: ''})
      //     }
      //   })
      // }
      this.addFormRule.model.testImgId = scope.row.testImgId
      this.addFormRule.model.testImgHashCodes = scope.row.testImgHashCodes
      this.addFormRule.model.hsIds = scope.row.hsIds
      this.addFormRule.model.hsNames = scope.row.hsNames
      // console.log(this.addFormRule.model)
      this.addInputItem[3].option = this.$trainSetHscodeEdit(scope.row)
      this.addHscodeData.selectHscode = this.$trainGetSelectHscode(this.addInputItem[3].option)
      this.$nextTick(() => {
        if (scope.row.hsIds) {
          this.addInputItem[3].models = scope.row.hsIds.split(',')
        }
        this.changeInputItemType(false, scope.row)
      })
    },
    cancel () {
      this.modalData.flag = false
    },
    // 发布
    handleRelease (scope) {
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toRelease'), () => {
        let params = {}
        params.testImgId = scope.row.testImgId
        params.testImgStatus = 0
        this.updateState(params)
      })
    },
    // 删除
    handleDelete (scope) {
      console.log(scope)
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toDelete'), () => {
        let params = {}
        params.testImgId = scope.row.testImgId
        params.testImgStatus = 1
        this.updateState(params)
      })
    },
    // 更改试题状态
    updateState (params) {
      ajax.updateState(params).then((res) => {
        console.log(res)
        if (res.data.flag) {
          if (params.testImgStatus === 0) {
            this.$NotifSuccess(this.$t('vicenter.training.common.releaseSuccess'))
          } else {
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
          }
          this.query()
        }
      })
    },
    toRelease (id) {},
    toUnRelease (id) {},
    toReject (scope) {},
    toDelete (scope) {},
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
      var value = {
        testImgName: this.formRule.model.testImgName,
        testImgCreateSource: this.formRule.model.testImgCreateSource,
        testImgHashCodes: this.formRule.model.testImgHashCodes,
        testImgStatus: this.formRule.model.testImgStatus,
        testImgForWhat: this.formRule.model.testImgForWhat,
        page: page,
        size: this.tableData.page.pagesize,
        testImgClass: 1
      }
      var val = Object.assign({}, value)
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
      console.log(data)
    },
    // 打开loading
    openLoading () {
      this.$initLoading()
    },
    // 关闭loading
    closeLoading () {
      this.$initLoading().close()
    },
    changeInputItemType (isDetail, data) {
      if (isDetail) {
        this.addInputItem[0].type = 'textarea'
        this.addInputItem[3].type = 'textarea'
        this.addInputItem[0].models = data.testImgXyTypeTableGroup
        this.addInputItem[3].models = data.testImgHashCodes
      } else {
        this.addInputItem[0].type = 'select2'
        this.addInputItem[3].type = 'treeInput'
        if (data) {
          this.addInputItem[0].models = data.testImgXyType ? data.testImgXyType.split(',') : []
          this.addInputItem[3].models = data.hsIds ? data.hsIds.split(',') : []
          this.addInputItem[3].options = data.testImgHashCodes.split(',').map((val, index) => {
            let obj = {
              opsLabel: val,
              opsValue: this.addInputItem[3].models[index]
            }
            return obj
          })
          this.addInputItem[3].goodsOption.checkedKeys = this.addInputItem[3].models
        } else {
          this.customReset()
        }
      }
    }
  },
  components: { bread, ComForm, panelTitle, ComTable, upload, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.suspectImageList-bar {
  @extend .extend-bar;
  .suspectImageList-M {
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
          .el-input__inner{
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
    .formDialog {
      .el-dialog {
        min-width: 556px;
        width: 50% !important;
      }
      .search-form {
        @include layout(2);
      }
      .search-form-btn .el-form-item__content {
        display: none;
      }
      .review{
        width: $all;
        text-align: left;
        margin-bottom: $margin;
        @include box-sizing;
        p{
          &:after{
            content: "*";
            color: #f56c6c;
            margin-left: 4px;
          }
        }
        .uploadBox{
          width: $all;
          margin-top: $dis10;
          .uploadButton{
            ul{
              display: none;
            }
          }
          .swiperPreview{
            li{
              line-height: 30px;
            }
          }
        }
      }
      .resultbutton {
        padding-top: 5px;
        text-align: right;
      }
      .addtraicSelect {
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
        .reset-option-width{
          max-width: unset;
        }
        .el-select-dropdown{
          width: 47%;
        }
      }
    }
  }
}
</style>
