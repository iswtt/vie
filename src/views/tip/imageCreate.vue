<template>
  <div class='image-Edit-Tip-bar'>
    <div class="image-Edit-Tip-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button type="white" size="mini" @click='goBack' data-id="back-btn">{{$t('vicenter.common.back')}}</el-button>
        <el-button type="primary" size="mini" @click='handleSave' data-id="save-btn">{{$t('vicenter.common.save')}}</el-button>
      </div>
      <div class="info-group">
        <!-- 上传图像 -->
        <div class="panel panel-up">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="containerBox">
            <div class="dataBox">
              <div class="imgSelect">
                <detailList ref="imagefrom" :formData="imgFrom.data" :isEdit="isEdit" :formRule="imgFrom.formRule"></detailList>
              </div>
              <div class="fileNames">
                <fileNames @deleteThen = 'deleteImgFile' :data="saveImg.files" :source="fileSource" :isManualAdd="isManualAdd"></fileNames>
              </div>
            </div>
          </div>
        </div>
        <!-- 图像详情 -->
        <div class="panel panel-down">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <detailList ref="imageAttributeForm" :formData="imageFormData" :isEdit="isEdit" :formRule="formRule"></detailList>
          </div>
        </div>
      </div>
      <div class="modal-dialog">
        <Dialog :modalData="insData">
          <div class="hscodeSearch">
            <ComForm :searchIpt="hscodeList.data" :searchFunc="hscodeList.searchFunc.ins" :formRule='hscodeList.formRule'></ComForm>
          </div>
          <div class="ins-table">
            <label>{{$t('vicenter.tip.imageManagement.imageList')}}</label>
            <ComTable ref="imageTable" @dbclick = 'insDbclick' :tableData="ins.tableData" :tableGroup="ins.tableGroup" ></ComTable>
          </div>
        </Dialog>
        <Dialog :modalData="imgLibData">
          <div class="hscodeSearch">
            <ComForm :searchIpt="hscodeList.data" :searchFunc="hscodeList.searchFunc.imgLib" :formRule='hscodeList.formRule'></ComForm>
          </div>
          <div class="ins-table">
            <label>{{$t('vicenter.tip.imageManagement.imageList')}}</label>
            <ComTable ref="imageTable" @dbclick = 'imgLibDbclick' :tableData="imgLib.tableData" :tableGroup="imgLib.tableGroup" ></ComTable>
          </div>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import ComForm from '@/components/form'
import ajax from '@/api/tip/Image-Manage.js'
import insCommonAjax from '@/api/inspection/common.js'
import hscodeAjax from '@/api/background/HSCode.js'
import bread from '@/components/breadCrumb'
import ComTable from '@/components/table'
import panelTitle from '@/components/title'
import detailList from './common/detailList'
import fileNames from './common/fileNames'
import Dialog from '@/components/dialogCommon'
import viProbe from '@/lib/viprobe/viProbeForTip.js'
export default {
  name: 'imageCreate',
  data () {
    const status = {
      release: '1',
      unRelease: '0'
    }
    const type = {
      single: '0',
      double: '1'
    }
    return {
      imgLibData: {
        title: this.$t('vicenter.tip.imageManagement.imageLibrary'),
        flag: false,
        width: '60%',
        resetModal: this.resetHscodes
      },
      hscodeList: {
        data: [
          {
            getLabel: this.$t('vicenter.tip.imageManagement.hsCode'),
            placeHolder: '',
            models: '',
            ruleProp: 'hsCodes',
            type: 'treeInput',
            treedata: [],
            checkedOption: [],
            treeView: false,
            treeIptId: 'hsCodesInput',
            treeDataId: 'hsCodesData',
            readonly: true,
            disabled: false,
            treeClick: this.hsCodestreeClick,
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
        searchFunc: {
          ins: {
            query: this.insQuery,
            queryText: this.$t('vicenter.common.query'),
            resetText: this.$t('vicenter.common.reset')
          },
          imgLib: {
            query: this.imgLibQuery,
            queryText: this.$t('vicenter.common.query'),
            resetText: this.$t('vicenter.common.reset')
          }
        },
        formRule: {
          refName: 'hscodeList',
          rule: {
          },
          model: {
            hsCodes: ''
          }
        }
      },
      insData: {
        title: this.$t('vicenter.tip.imageManagement.ins'),
        flag: false,
        width: '60%',
        resetModal: this.resetHscodes
      },
      falseFlag: true,
      isEdit: true,
      fileSource: '',
      isManualAdd: false,
      titleBread: { // 面包屑导航组件初始化
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
      },
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.tip.imageManagement.tipImage')
        },
        listTitle: {
          title: this.$t('vicenter.tip.imageManagement.imageProperties')
        }
      },
      imgFrom: {
        formRule: {
          refName: 'imgFrom',
          rule: {
            imgFrom: [
              { required: true, message: this.$t('vicenter.tip.imageManagement.selectImageSource'), trigger: 'blur' }
            ]
          },
          model: {
            imgFrom: ''
          }
        },
        data: [
          {
            change: this.imgFromChange,
            type: 'select',
            model: '',
            label: this.$t('vicenter.tip.imageManagement.imageSource'),
            ruleProp: 'imgFrom', // 图像名称
            option: [
              {
                value: 'local',
                label: this.$t('vicenter.tip.imageManagement.local')
              },
              {
                value: 'ins',
                label: this.$t('vicenter.tip.imageManagement.ins')
              },
              {
                value: 'imageLibrary',
                label: this.$t('vicenter.tip.imageManagement.imageLibrary')
              }
            ]
          }
        ]
      },
      imageFormData: [
        {
          label: this.$t('vicenter.tip.imageManagement.imageName'),
          placeHolder: this.$t('vicenter.tip.imageManagement.enterImageName'),
          type: 'text',
          value: '',
          ruleProp: 'name' // 图像名称
        },
        {
          label: this.$t('vicenter.tip.imageManagement.imageStatus'),
          placeHolder: this.$t('vicenter.tip.imageManagement.selectImageStatus'),
          type: 'select',
          clearable: true,
          value: '',
          option: [
            {
              value: status.release,
              label: this.$t('vicenter.tip.imageStatistics.release')
            },
            {
              value: status.unRelease,
              label: this.$t('vicenter.tip.imageStatistics.notRelease')
            }
          ],
          ruleProp: 'status',
          change: this.changeStatus
        },
        {
          label: this.$t('vicenter.tip.imageManagement.imageCategory'),
          placeHolder: this.$t('vicenter.tip.imageManagement.selectImageCategory'),
          value: '',
          ruleProp: 'imageCategory',
          type: 'select',
          option: [],
          change: this.changeImageCategories
        },
        {
          label: this.$t('vicenter.tip.imageManagement.describe'),
          type: 'textarea',
          placeHolder: this.$t('vicenter.tip.imageManagement.enterDescribe'),
          value: '',
          ruleProp: 'describe',
          maxlength: 500
        }
      ],
      formRule: {
        refName: 'imageForm',
        rule: {
          name: [
            { required: true, message: this.$t('vicenter.tip.imageManagement.enterImageName'), trigger: 'blur' }
          ],
          status: [
            { required: true, message: this.$t('vicenter.tip.imageManagement.selectImageStatus'), trigger: 'blur' }
          ],
          imageCategory: [
            { required: true, message: this.$t('vicenter.tip.imageManagement.selectImageCategory'), trigger: 'blur' }
          ]
        },
        model: {
          name: '',
          status: '',
          imageEnergyType: '',
          imageCategory: '',
          describe: ''
        }
      },
      showDailog: '',
      ins: {
        tableData: {
          data: [],
          isBorder: true,
          isStripe: true,
          isPage: false,
          isSort: true,
          refName: 'insTable',
          tableCellClassName: this.tableCellClass,
          sortMethod: this.getSortTable,
          page: {
            pageGroup: [5],
            CurrentPage: 0,
            pagesize: 5,
            handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
            Allpage: 0
          }
        },
        tableGroup: [
          {
            label: this.$t('vicenter.inspection.common.taskID'),
            type: 'text',
            model: 'scanSerialNumber'
          },
          {
            label: this.$t('vicenter.tip.imageManagement.hsCode'),
            type: 'text',
            model: 'hsCodeCvs'
          },
          {
            label: this.$t('vicenter.tip.imageManagement.goodsName'),
            type: 'text',
            model: 'goodsName'
          },
          {
            label: this.$t('vicenter.inspection.history.scanImg'),
            type: 'img',
            height: '50px',
            model: 'lastScanImage'
          }
        ],
        formRule: {
          refName: 'imageForm',
          rule: {
          },
          model: {
            name: ''
          }
        },
        suspected: 'CONC001' // 有嫌疑
      },
      imgLib: {
        tableData: {
          data: [],
          isBorder: true,
          isStripe: true,
          isPage: false,
          isSort: true,
          refName: 'imgLibTable',
          tableCellClassName: this.tableCellClass,
          sortMethod: this.getSortTable,
          page: {
            pageGroup: [5],
            CurrentPage: 0,
            pagesize: 5,
            handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
            Allpage: 0
          }
        },
        tableGroup: [
          {
            label: this.$t('vicenter.inspection.common.taskID'),
            type: 'text',
            model: 'scanSerialNumber'
          },
          {
            label: this.$t('vicenter.tip.imageManagement.hsCode'),
            type: 'text',
            model: 'hsCodes'
          },
          {
            label: this.$t('vicenter.tip.imageManagement.goodsName'),
            type: 'text',
            model: 'hsNames'
          },
          {
            label: this.$t('vicenter.inspection.history.scanImg'),
            type: 'img',
            height: '50px',
            model: 'lastImage'
          }
        ],
        formRule: {
          refName: 'imageForm',
          rule: {
          },
          model: {
            name: ''
          }
        },
        illegal: 'ILLEGAL' // 违规图
      },
      saveImg: {
        isUff: false,
        scanSerialNumber: '',
        scanImagePath: '',
        files: [],
        tipImagePath: ''
      },
      loading: {},
      openViprobeFlag: false,
      viprobeData: {
        timeout: 3000
      }
    }
  },
  created () {
    this.$getDataByTypecode(['TIP_IMAGE_CATEGORY'], ['imageCategory'], this.imageFormData)
    this.hscodeAjaxTree()
    // this.queryListImage()
  },
  methods: {
    resetImgFrom () {
      if (this.saveImg.files.length === 0) {
        this.imgFrom.data[0].value = ''
      }
    },
    deleteImgFile (prevImgNo) {
      this.saveImg.scanImagePath = ''
      this.saveImg.files = []
      this.saveImg.tipImagePath = ''
      // this.imgFrom.data[0].value = ''
      this.closeViprobe(prevImgNo)
    },
    insDbclick (row, $event) { // 监管选图
      let {id, scanSerialNumber, lastScanImage, scanImagePath, taskMarks} = row
      ajax.getSuperviseDetail({id: id}).then((res) => {
        if (res.data.flag) {
          this.deleteImgFile()
          let taskAttachementObjects = res.data.result
          let SCANNING = taskAttachementObjects
          let files = this.$getScanningData(SCANNING)
          this.saveImg.isUff = this.$isUFF(SCANNING)
          this.saveImg.scanSerialNumber = scanSerialNumber
          this.saveImg.scanImagePath = this.getScanImagePath(SCANNING, 'location')
          if (files.length > 0) {
            if (files.length === 2) { // TIP不支持双视角,打开图像时只传第一个视角
              files = [files[0]]
            }
            // this.fileSource = this.imgFrom.data[0].value
            this.fileSource = 'ins'
            this.saveImg.files = files
            this.openViprobe(this.saveImg, taskMarks)
            this.insData.flag = false
            // 在viprobe中打开查验
          } else {
            this.$NotifPrompt(this.$t('vicenter.tip.imageManagement.noImg'))
          }
        }
      }).catch(() => {})
    },
    imgLibDbclick (row, $event) { // 典图选图
      this.deleteImgFile()
      console.log('imgLibDblclick')
      let {scanSerialNumber, lastImage, fileList, imageCollectMode, imageType, taskMarks} = row
      this.isManualAdd = false
      // if (imageCollectMode === '1') {
      //   // 手工录入的典图
      //   let markFile = imageType === 'ILLEGAL'
      //   let scanImagePath = lastImage.substring(0, lastImage.lastIndexOf('/') + 1)
      //   let scanningImgFiles = []
      //   fileList.forEach(f => {
      //     if (f.docType === 'LOCAL') {
      //       scanningImgFiles.push(
      //         {
      //           name: f.fileName,
      //           sign: '',
      //           md5: ''
      //         }
      //       )
      //     }
      //   })
      //   this.isManualAdd = true
      //   this.fileSource = this.imgFrom.data[0].value
      //   this.saveImg.files = scanningImgFiles
      //   this.saveImg.scanSerialNumber = scanSerialNumber
      //   viProbe.openRemoteImageInViProbe(scanSerialNumber, scanImagePath, scanningImgFiles, markFile, false, false)
      //   this.imgLibData.flag = false
      //   return
      // }
      let files = this.$getScanningData(fileList)
      this.saveImg.isUff = this.$imgLibIsUFF(fileList)
      this.saveImg.scanSerialNumber = scanSerialNumber
      this.saveImg.scanImagePath = this.getScanImagePath(fileList, 'url')
      if (files.length > 0) {
        if (files.length === 2) { // TIP不支持双视角,打开图像时只传第一个视角
          files = [files[0]]
        }
        // this.fileSource = this.imgFrom.data[0].value
        this.fileSource = 'imageLibrary'
        this.saveImg.files = files
        this.openViprobe(this.saveImg, taskMarks)
        this.imgLibData.flag = false
        // 在viprobe中打开典图
      } else {
        this.$NotifPrompt(this.$t('vicenter.tip.imageManagement.noImg'))
      }
    },
    getScanImagePath (data, fieldName) {
      let path = ''
      let flag = false
      if (data.length > 0) {
        data.forEach(e => {
          if (!flag) {
            if (e.docType === 'HIGH') {
              path = e[fieldName] ? e[fieldName].substring(0, e[fieldName].lastIndexOf('/')) : ''
              flag = true
            } else if (e.docType === 'LOW') {
              path = e[fieldName] ? e[fieldName].substring(0, e[fieldName].lastIndexOf('/')) : ''
              flag = true
            }
          }
        })
      }
      return path
    },
    resetHscodes () {
      this.hscodeList.formRule.model.hsCodes = ''
      this.hscodeList.data[0].model = []
      this.hscodeList.data[0].option = []
      this.resetImgFrom()
    },
    imgLibQuery () {
      let hsCodes = this.hscodeList.formRule.model.hsCodes
      let params = {}
      params.hsCodes = hsCodes
      this.getImgLibList(params)
    },
    insQuery () {
      let hsCodes = this.hscodeList.formRule.model.hsCodes
      let params = {}
      params.hsCodes = hsCodes
      this.getSuperviseList(params)
    },
    hsCodesReset () {
      this.hscodeList.formRule.model.hsCodes = ''
      this.hscodeList.data[0].model = []
    },
    getSortTable ({column, prop, order}) { // 表格排序
    },
    // 列表选中行
    selectRow (data) {
    },
    // queryListImage () { // 获取类别树
    //   ajax.queryListImage({isAll: true}).then((res) => {
    //     if (res.data.flag) {
    //       this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
    //       this.imageFormData[2].treedata = res.data.result
    //     }
    //   }).catch(() => {})
    // },
    goBack () {
      this.$router.push({ path: '/Tip/imageManagement' })
    },
    getSort () {
    },
    handleSave () {
      if (this.formRule.rule !== '{}') {
        this.$refs['imagefrom'].$refs[this.imgFrom.formRule.refName].validate((valid) => {
          this.$refs['imageAttributeForm'].$refs[this.formRule.refName].validate((valid) => {
            if (valid) {
              // 判断图像名称是否已存在
              let params = JSON.parse(JSON.stringify(this.formRule.model))
              ajax.checkImageName(params).then(res => {
                if (res.data.flag) {
                  this.$ConfirmBox(this.$t('vicenter.common.confirmSave'), () => {
                    this.setLoading()
                    this.saveTip()
                  })
                }
              }).catch(() => {})
            }
          })
        })
      }
    },
    saveTip () {
      console.log(window.viprobeReturn)
      viprobeReturn.saveTipResult = {}
      viprobeReturn.saveTipResult.flag = null
      let {files} = this.saveImg
      if (files.length === 0) {
        this.$NotifError(this.$t('vicenter.tip.imageManagement.noSelectImg'))
        this.setButtonEnable()
        return
      }
      ajax.getuploadpath().then(res => {
        if (res.data.flag) {
          let tipImagePath = res.data.result
          this.saveImg.tipImagePath = tipImagePath
          this.viprobeSaveTip()
        }
      }).catch(() => {})
    },
    createImage () {
      let params = JSON.parse(JSON.stringify(this.formRule.model))
      params.picNo = this.saveImg.scanSerialNumber
      let {path, originalFiles, tipFiles, fileType, geometry} = viprobeReturn.saveTipResult.result
      params.path = path
      params.originalImage = JSON.stringify(originalFiles)
      params.tipImage = JSON.stringify(tipFiles)
      params.tipPosition = JSON.stringify(geometry)
      params.fileType = fileType
      // params.source = this.imgFrom.formRule.model.imgFrom
      params.source = this.fileSource
      ajax.createImage(params).then(res => {
        this.setButtonEnable()
        // this.closeViprobe() // 保存完后页面会跳转到列表页面，会执行beforeDestroy方法，此方法已经调用this.closeViprobe()，此处不需要再调
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
          this.$router.push({ path: '/Tip/imageManagement' })
        }
      }).catch(() => {
        this.setButtonEnable()
      })
    },
    imgFromChange () {
      let orginImgFrom = this.imgFrom.formRule.model.imgFrom
      this.$nextTick(() => {
        this.$changeSelectValidateField('imagefrom', this, 'imgFrom')
        let {imgFrom} = this.imgFrom.formRule.model
        this.hsCodesReset()
        // if (this.saveImg.files.length > 0) {
        //   this.$NotifPrompt(this.$t('vicenter.tip.imageManagement.hasSelectedImg'))
        //   if (orginImgFrom !== imgFrom) {
        //     this.imgFrom.data[0].value = orginImgFrom
        //     this.imgFrom.formRule.model.imgFrom = orginImgFrom
        //   }
        //   return
        // }
        if (imgFrom === 'local') {
          let now = new Date().getTime()
          let prevImgNo = this.saveImg.scanSerialNumber
          this.saveImg.scanSerialNumber = now.toString()
          viProbe.openLocalImageInViProbe(this.saveImg.scanSerialNumber)
          viprobeReturn.openLocalResult.flag = null
          this.getOpenLocalFileName(prevImgNo)
        } else if (imgFrom === 'ins') {
          // 清除上一次hscode选中值
          this.hscodeList.data[0].models = []
          this.hscodeList.data[0].options = []
          this.ins.tableData.page.CurrentPage = 0
          this.getSuperviseList()
          this.insData.flag = true
        } else if (imgFrom === 'imageLibrary') {
          // 清除上一次hscode选中值
          this.hscodeList.data[0].models = []
          this.hscodeList.data[0].options = []
          this.imgLib.tableData.page.CurrentPage = 0
          this.getImgLibList()
          this.imgLibData.flag = true
        }
      })
    },
    getOpenLocalFileName (prevImgNo) {
      if (viprobeReturn.openLocalResult.flag === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
          this.resetImgFrom()
          return false
        } else {
          setTimeout(this.getOpenLocalFileName, this.viprobeData.timeout, prevImgNo)
        }
      } else if (viprobeReturn.openLocalResult.flag === true) {
        console.log(viprobeReturn.openLocalResult)
        this.deleteImgFile(prevImgNo)
        let files = viprobeReturn.openLocalResult.result
        this.saveImg.files = []
        if (files.length > 0) {
          // this.fileSource = this.imgFrom.data[0].value
          this.fileSource = 'local'
          files.forEach(e => {
            let name = e.substring(e.lastIndexOf('/') + 1, e.length)
            this.saveImg.files.push({name: name})
          })
        }
      } else if (viprobeReturn.openLocalResult.flag === false) {
        // 弹出提示框，提示用户，与ViProbe交互失败
        this.saveImg.scanSerialNumber = prevImgNo
        this.resetImgFrom()
        this.$NotifError(this.$t('vicenter.common.viprobe.openLocalError'))
      }
    },
    getSuperviseList (params = {}) {
      params.page = this.ins.tableData.page.CurrentPage
      params.size = this.ins.tableData.page.pagesize
      params.concImgcheck = this.ins.suspected // 只获取有嫌疑的数据
      ajax.getSuperviseList(params).then((res) => {
        if (res.data.flag) {
          this.ins.tableData.isPage = false
          this.ins.tableData.data = res.data.result.content
          this.ins.tableData.page.Allpage = res.data.result.totalElements
          if (this.ins.tableData.data.length > 0) {
            this.ins.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    getImgLibList (params = {}) {
      params.page = this.imgLib.tableData.page.CurrentPage
      params.size = this.imgLib.tableData.page.pagesize
      params.imageType = this.imgLib.illegal // 只获取违规图的数据
      ajax.getImgLibList(params).then((res) => {
        if (res.data.flag) {
          this.imgLib.tableData.isPage = false
          this.imgLib.tableData.data = res.data.result.content
          this.imgLib.tableData.page.Allpage = res.data.result.totalElements
          if (this.imgLib.tableData.data.length > 0) {
            this.imgLib.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    /**
     * 获取hscode树方法
     */
    hscodeAjaxTree () {
      hscodeAjax.getHSCodeTree().then(res => {
        if (res.data.flag) {
          let treeData = this.$json2treeData(res.data.result, 'id', 'pid')
          this.hscodeList.data[0].treedata = treeData
        }
      }).catch(() => {})
    },
    hsCodestreeClick () {

    },
    /**
     * hscode树点击节点
     */
    hsCodesCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$hscodeCheckChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.hscodeList.data[0].models = checkedValue.name
        this.hscodeList.formRule.model.hsCodes = checkedValue.codes
      }
    },
    /**
     * tip类别点击节点
     */
    treeClick (nodeObj, allNode) {
      this.imageFormData[2].value = nodeObj.name
      this.formRule.model.imageCategory = nodeObj.id
      this.$changeSelectValidateField('imageAttributeForm', this, 'imageCategory')
    },
    handleSizeChange (val) {
    },
    handleCurrentChange (val) {
      let imgFrom = this.imgFrom.formRule.model.imgFrom
      val = val - 1
      if (imgFrom === 'imageLibrary') {
        this.imgLib.tableData.page.CurrentPage = val
        this.getImgLibList()
      } else if (imgFrom === 'ins') {
        this.ins.tableData.page.CurrentPage = val
        this.getSuperviseList()
      }
    },
    viprobeSaveTip (params) {
      let tipImagePath = this.saveImg.tipImagePath
      let name = this.saveImg.scanSerialNumber
      if (tipImagePath === '' || name === '') {
        this.$$NotifError(this.$t('vicenter.tip.imageManagement.pathNotExist'))
        this.setButtonEnable()
        return false
      }
      if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
        this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
        this.setButtonEnable()
        return false
      } else {
        viProbe.saveTipInViProbe(name, tipImagePath, false)
        console.info('upload ViProbe info not finished, waiting...')
        this.saveTipData()
      }
    },
    saveTipData () {
      if (viprobeReturn.saveTipResult.flag === null) {
        setTimeout(this.saveTipData, this.viprobeData.timeout)
      } else if (viprobeReturn.saveTipResult.flag === true) {
        console.debug('end validate Upload ViProbe info, submit conclusion')
        this.createImage()
      } else if (viprobeReturn.saveTipResult.flag === false) {
        // 弹出提示框，提示用户，与ViProbe交互失败
        if (viprobeReturn.errorCode !== 24578) { // viProbe返回的错误码，在viProbeForTip.js已经有提示“未抠图，请处理图片”
          this.$NotifError(this.$t('vicenter.common.viprobe.uploadError'))
        }
        this.setButtonEnable()
        return false
      }
    },
    openViprobe (params, taskMarks) {
      let {scanSerialNumber, scanImagePath, files, isUff} = params
      let markFilePath = scanImagePath + '/suspects_json.mark'
      let stepFilePath = scanImagePath + '/history.steps'
      let data = {
        paths: `${markFilePath},${stepFilePath}`
      }
      insCommonAjax.getFullSignPath(data).then((res) => {
        if (res.data.flag) {
          res.data.result.forEach(e => {
            if (e.indexOf('suspects_json.mark') !== -1) {
              markFilePath = e
            } else if (e.indexOf('history.steps') !== -1) {
              stepFilePath = e
            }
          })
        }
        let _taskMarks = taskMarks ? JSON.parse(taskMarks.replace(/'/g, '"')) : null
        let _markFile = _taskMarks || markFilePath
        viProbe.openImageAndAnalysisInfoInViProbe(scanSerialNumber, scanImagePath, files, _markFile, stepFilePath, isUff)
      })
    },
    closeViprobe (prevImgNo) {
      // 关闭ViProbe中已打开的此任务的图像
      var name = this.saveImg.scanSerialNumber // 图像 流水号
      if (prevImgNo === undefined) {
        viProbe.closeImageInViProbe(name)
        this.saveImg.scanSerialNumber = ''
      } else if (prevImgNo !== '') {
        viProbe.closeImageInViProbe(prevImgNo)
      }
    },
    setButtonEnable () {
      this.loading.close()
    },
    setLoading () {
      this.loading = this.$loading({
        lock: true,
        text: this.$t('vicenter.inspection.common.waiting'),
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.5)'
      })
    },
    changeStatus () {
      this.$changeSelectValidateField('imageAttributeForm', this, 'status')
    },
    changeImageCategories () {
      this.$changeSelectValidateField('imageAttributeForm', this, 'imageCategory')
    }
  },
  beforeDestroy () {
    if (viprobeUtilReturn.reconnectToViProbeFailed === false) {
      // this.closeViprobe()
      viProbe.closeAllImageInViProbe()
    }
  },
  components: {bread, panelTitle, detailList, ComTable, Dialog, fileNames, ComForm}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.serOperation{
  padding-left: 401px;
  margin-top: -45px;
}
.ins-table {
  margin-top: 10px;
  width: $all;
  min-height: 450px;
  @media screen and (min-width: 1640px) {
    min-height: 350px;
    overflow: hidden;
  }
  label{
    padding: 20px;
  }
}
.hscodeSearch {
  .search-form {
    @include flex(row, flex-start, flex-start);
    .search-form-item {
      @include box-sizing();
      padding-right: $dis10;
      width: 50%;
      .pack {
        @include flex(row, flex-start, flex-start);
        .el-form-item__label {
          width: auto;
          min-width: 80px;
        }
        .list-label {
          width: 80px;
        }
        .treeClass {
          text-align: left;
          width: calc(100% - 80px);
          position: absolute;
          top: 37px;
          right: 0;

        }
      }
    }
    .search-form-btn {
      margin-left: 30px;
      width: 15%!important;
      button {
        padding: 6px 10px;
      }
    }
  }
}
.image-Edit-Tip-bar {
  @extend .extend-bar;
  .image-Edit-Tip-M {
      height: $all;
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
    .info-group {
      @include flex(column, flex-start, flex-start);
      height: calc(100% - 65px);
      .panel-up {
        width: $all;
        height: 40%;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
        @include box-sizing;
        .containerBox {
          width: $all;
          height: calc(100% - 35px);
          @include flex(row, space-between, flex-start);
          .dataBox {
            width: $all;
            height: $all;
            @include flex(column, flex-start, flex-start);
            .imgSelect{
              width: $all
            }
          }
        }
      }
      .panel-down {
        width: $all;
        height: calc(60% - 10px);
        border-radius: 4px;
        border: 1px solid #ddd;
        @include box-sizing;
        .form-bar {
          height: calc(100% - 35px);
        }
      }
      #panelTitle {
        .panel-title {
          border-radius: 4px;
        }
      }
    }
    @media screen and (max-width: 1640px) {
      .info-group {
        @include flex(row, space-between, flex-start);
        .panel-up {
          width: 60%;
          height: $all;
        }
        .panel-down {
          width: calc(40% - 10px);
          height: $all;
        }
      }
    }
  }
}
</style>
