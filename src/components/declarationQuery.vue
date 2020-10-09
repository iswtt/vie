<template>
  <div id="declaration-Query" v-bar>
    <div>
      <div class="dec-list">
        <ComTable @dbclick="selectDecRow" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
      </div>
      <div class="dec-info" v-bar v-loading="decInfoLoading">
        <div>
          <panelTitle :panelTitleInit="taskInfoTitle.imageInfoTitle"></panelTitle>
          <div class="basic-info">
            <img id="scanImg" class="scanImg" :src="taskInfo.imgSrc" @click="LookImg('scanImg')">
            <Cswiper v-if="showSwiper" :propOption='taskInfo.attachmentOption' :listData='taskInfo.attachmentData'></Cswiper>
            <detailList :listData="taskInfo.listData" :widthStyle="taskInfo.widthStyle" listRule="taskDetailList"></detailList>
          </div>
          <panelTitle :panelTitleInit="taskInfoTitle.insConclusionInfoTitle"></panelTitle>
          <ComTable :tableData='taskInfo.insConclusionTableData' :tableGroup='taskInfo.insConclusionTableGroup'></ComTable>
          <panelTitle :panelTitleInit="taskInfoTitle.documentInfoTitle"></panelTitle>
          <div class="other-info">{{$t('vicenter.common.nodata')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/inspection/History.js'
import ComTable from '@/components/table'
import panelTitle from '@/components/title'
import detailList from '@/components/detailList'
import Cswiper from '@/components/swipe'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'declarationQuery',
  data () {
    return {
      decInfoLoading: false,
      tableData: {
        refName: 'decTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort,
        layout: 'total, prev, pager, next, jumper',
        page: {
          CurrentPage: 0,
          pagesize: 5,
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange,
          Allpage: 0
        }
      },
      tableGroup: [
        {
          label: this.$t('vicenter.supervise.taskInspection.taskID'),
          type: 'text',
          model: 'scanSerialNumber',
          width: '200px'
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.site'),
          type: 'text',
          model: 'siteName',
          width: ''
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.device'),
          type: 'text',
          model: 'deviceCode',
          width: ''
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.frontLpn'),
          type: 'text',
          model: 'lpnFront',
          width: ''
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.customsDeclarationnumber'),
          type: 'text',
          model: 'decNumCvs',
          width: ''
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.containerNumber'),
          type: 'text',
          model: 'containerNumCsv',
          width: ''
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.scanTime'),
          type: 'text',
          model: 'scanTime',
          width: '200px'
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.conclusionOfdrawing'),
          type: 'text',
          model: 'concImgcheck',
          width: ''
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.concManual'),
          type: 'text',
          model: 'concManual',
          width: ''
        }
      ],
      taskInfoTitle: {
        imageInfoTitle: {
          title: this.$t('vicenter.common.findImg.scanImageInfo')
        },
        insConclusionInfoTitle: {
          title: this.$t('vicenter.common.findImg.insConclusionInfo')
        },
        documentInfoTitle: {
          title: this.$t('vicenter.common.findImg.ducumentInfo')
        }
      },
      showSwiper: false,
      taskInfo: {
        imgSrc: '',
        attachmentOption: {
          propId: 'taskAttach',
          height: '100px',
          width: '87%',
          slidesPerView: 6,
          spaceBetween: 10,
          autoplay: false,
          delay: 10,
          navigate: {
            position: 'outside',
            type: 'shadow'
          },
          hasFile: true
        },
        attachmentData: [],
        listData: [
          {
            label: this.$t('vicenter.supervise.taskInspection.site'),
            value: '',
            ruleProp: 'siteName'
          },
          {
            label: this.$t('vicenter.supervise.taskInspection.device'),
            value: '',
            ruleProp: 'deviceCode'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.checkinTime'),
            value: '',
            ruleProp: 'checkinTime'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.vehicleType'),
            value: '',
            ruleProp: 'vehicleType'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.lpnBefore'),
            value: '',
            ruleProp: 'lpnFront'
          },
          {
            label: this.$t('vicenter.inspection.common.lpnBack'),
            value: '',
            ruleProp: 'lpnBackCsv'
          }
        ],
        widthStyle: {
          width: '33.33%'
        },
        insConclusionTableData: {
          refName: 'insConclusionTable',
          data: [],
          isBorder: true,
          isStripe: true,
          isPage: false,
          sortMethod: this.getSort
        },
        insConclusionTableGroup: [
          {
            label: this.$t('vicenter.common.No'),
            type: 'index'
          },
          {
            label: this.$t('vicenter.common.findImg.insConclusionInfo'),
            type: 'text',
            model: 'conclusion'
          },
          {
            label: this.$t('vicenter.inspection.common.contrabandLocation'),
            type: 'text',
            model: 'contrabandLocation'
          },
          {
            label: this.$t('vicenter.inspection.common.contrabandType'),
            type: 'text',
            model: 'contrabandType'
          },
          {
            label: this.$t('vicenter.inspection.common.conclusionType'),
            type: 'text',
            model: 'taskLink'
          },
          {
            label: this.$t('vicenter.inspection.common.remarks'),
            type: 'text',
            model: 'remark'
          }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
    // 获取报关单联查结果列表数据
    this.getDecList(true)
  },
  methods: {
    selectDecRow (data) {
      this.getDetails(data.id)
    },
    getDetails (taskId) {
      this.decInfoLoading = true
      // 获取选中任务的详情信息
      ajax.getTaskDetail({id: taskId}).then(res => {
        if (res.data.flag) {
          let {taskObject, taskAttachementObjects, imgCheckObjects, manualCheckObject} = res.data.result
          this.taskInfo.imgSrc = taskObject.lastScanImage
          // 处理扫描图像信息
          this.initScanImageInfo(taskObject)
          // 处理查验结论信息
          this.initInsClusionInfo(imgCheckObjects, manualCheckObject)
          // 处理附件信息
          this.initAttachInfo(taskAttachementObjects)
        }
        this.decInfoLoading = false
      }).catch(() => {
        this.decInfoLoading = false
      })
    },
    getDecList (flag) {
      // 加载列表数据
      this.tableData.data = []
      this.tableData.isPage = false
      let params = {
        decNumCvs: this.$props.declarationNo,
        size: this.tableData.page.pagesize,
        page: this.tableData.page.CurrentPage
      }
      ajax.getHisTableList(params).then((res) => {
        if (res.data.flag) {
          let { content, totalElements } = res.data.result
          this.tableData.data = content
          this.tableData.data.forEach(obj => {
            obj.scanTime = this.$options.filters['formatDate'](obj.scanTime, this.$t('vicenter.common.formatDate'))
            obj.concManual = obj.concManual ? this.$t(obj.concManual) : ''
            obj.concImgcheck = obj.concImgcheck ? this.$t(obj.concImgcheck) : ''
          })
          this.tableData.page.Allpage = totalElements
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
            if (flag) {
              // 默认加载第一条任务信息
              this.getDetails(this.tableData.data[0].id)
            }
          }
        }
      }).catch(() => {})
    },
    // 处理扫描图像信息
    initScanImageInfo (data) {
      this.taskInfo.listData.forEach(e => {
        e.value = data[e.ruleProp]
        if (e.ruleProp === 'checkinTime') {
          if (data[e.ruleProp] !== null) {
            e.value = this.$options.filters['formatDate'](data[e.ruleProp])
          }
        }
        if (e.ruleProp === 'vehicleType') {
          e.value = this.$t(data[e.ruleProp])
        }
      })
    },
    // 处理查验结论信息
    initInsClusionInfo (imgCheckObjects, manualCheckObject) {
      this.taskInfo.insConclusionTableData.data = []
      this.taskInfo.insConclusionTableData.isPage = false
      if (imgCheckObjects && imgCheckObjects.length > 0) {
        imgCheckObjects.forEach(e => {
          this.taskInfo.insConclusionTableData.data.push({
            conclusion: e.conclusion ? this.$t(e.conclusion) : '',
            contrabandLocation: e.contrabandLocation ? this.$t(e.contrabandLocation) : '',
            contrabandType: e.contrabandType ? this.$t(e.contrabandType) : '',
            taskLink: e.taskLink ? this.$t(e.taskLink) : '',
            remark: e.remark
          })
        })
      }
      if (manualCheckObject != null) {
        let contrabandTypeArr = []
        let contrabandLocationArr = []
        // 查获物
        if (manualCheckObject.seizedObjects && manualCheckObject.seizedObjects.length > 0) {
          contrabandTypeArr = manualCheckObject.seizedObjects.map(e => {
            return this.$t(e.seizedType)
          })
        }
        // 查获位置
        contrabandLocationArr = manualCheckObject.contrabandLocation ? manualCheckObject.contrabandLocation.split(',').map(e => { return this.$t(e) }) : []
        this.taskInfo.insConclusionTableData.data.push({
          conclusion: manualCheckObject.conclusion ? this.$t(manualCheckObject.conclusion) : '',
          contrabandLocation: contrabandLocationArr.length ? contrabandLocationArr.join(',') : '',
          contrabandType: contrabandTypeArr.length > 0 ? contrabandTypeArr.join(',') : '',
          taskLink: this.$t('vicenter.DIC.T_TIMELINE_NODE.C_MANUAL_CHECK'),
          remark: manualCheckObject.remark
        })
      }
    },
    // 处理附件信息
    initAttachInfo (data) {
      if (data == null) {
        return
      }
      this.showSwiper = false
      this.taskInfo.attachmentData = []
      let {CHECKIN, SCANNING, MANUAL_CHECK} = data
      if (CHECKIN != null) {
        CHECKIN.forEach(e => {
          let swipeType = this.$options.filters['attachType'](e.fileNameExt)
          let imgObj = {
            type: swipeType,
            src: e.location
          }
          if (e.docType === 'CCR') { // 集装箱附件
            this.taskInfo.attachmentData.push(imgObj)
          } else if (e.docType === 'LPR') { // 车牌号附件
            this.taskInfo.attachmentData.push(imgObj)
          } else { // 其他附件
            this.taskInfo.attachmentData.push(imgObj)
          }
        })
      }
      if (MANUAL_CHECK != null) {
        MANUAL_CHECK.forEach(e => {
          let swipeType = this.$options.filters['attachType'](e.fileNameExt)
          let imgObj = {
            type: swipeType,
            src: e.location
          }
          this.taskInfo.attachmentData.push(imgObj)
        })
      }
      if (this.taskInfo.attachmentData.length > 0) {
        this.showSwiper = true
      }
    },
    handleSizeChange () {},
    handleCurrentChange (val) {
      this.tableData.page.CurrentPage = val - 1
      this.getDecList()
    },
    LookImg (id) {
      var viewer = new Viewer(document.getElementById(id))
      this.$nextTick().then(() => {
        viewer.update()
      })
    },
    getSort () {}
  },
  props: {
    'declarationNo': { // 报关单号
      type: String,
      default: ''
    }
  },
  watch: {
  },
  components: { ComTable, panelTitle, detailList, Cswiper }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';
#declaration-Query {
  width: $all;
  height: 800px;
  margin-top: -20px;
  .dec-list {
    .el-table__row {
      cursor: pointer;
    }
  }
  .dec-info {
    .scanImg {
      width: $all;
      margin-bottom: 10px;
      cursor: pointer;
    }
    .swiper-container-box {
      .swiper-slide-container {
        height: $all;
        .fileIcon {
          font-size: 70px!important;
        }
        .fileName {
          width: 150px;
          padding: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
        .swiper-button-prev,.swiper-button-next  {
          margin-top: 0;
          transform: translate(0, -45%);
        }
      }
    }
  }
}
</style>
