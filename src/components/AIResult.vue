<template>
  <el-dialog :width="AIResultModal.width" @close="AIResultModal.resetModal" :title="AIResultModal.title" :visible.sync="AIResultModal.flag" :close-on-click-modal='false' :close-on-press-escape='false' :modal-append-to-body='false' :append-to-body='true' :custom-class="AIResultModal.customClass" @open="dialogOpen()">
    <div id="AIResultBox">
      <div class="resultInfo">
        <div class="conclusion" :class="{red: resultConclusion.conclusion !== 'NO_SUSPECT', green: resultConclusion.conclusion === 'NO_SUSPECT'}">
          {{resultConclusion.description}}
          <span class="status" :class="{bgRed: resultConclusion.conclusion !== 'NO_SUSPECT', bgGreen: resultConclusion.conclusion === 'NO_SUSPECT'}"></span>
        </div>
        <ul>
          <li v-for="(item, index) in resultItems" :key="index" :class="{red: item.result_type !== 'NO_SUSPECT', green: item.result_type === 'NO_SUSPECT'}">
            <span>{{index + 1}}.</span>
            {{item.description}}
          </li>
        </ul>
        <img @click="LookImg" ref="resultCanvas" id="resultCanvas"/>
      </div>
      <div class="AIResultBtnClass">
        <el-button @click="closeAIResultModal" size="mini">{{$t('vicenter.common.close')}}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Dialog from '@/components/dialogCommon'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'AIResult',
  data () {
    return {
      AIResultModal: {
        title: this.$t('vicenter.common.AIResult'),
        flag: false,
        resetModal: this.closeAIResultModal,
        width: '60%'
      },
      imgSrc: '',
      resultConclusion: {
        conclusion: '',
        description: ''
      },
      resultItems: [],
      markArr: [],
      markColor: '#0000FF',
      markLineWidth: 4,
      fontStyle: '46px arial',
      fontColor: '#FF0000',
      fontBgColor: '#FFFFFF',
      fontMarginTop: 20,
      // contrabandType: ['GUN', 'HIGHZ', 'KNIFE', 'CIGAR', 'LIQUOR'],
      contrabandType: ['Gun', 'Highz', 'Knife', 'Cigar', 'Liquor']
    }
  },
  created () {
    let jsonData = JSON.parse(this.$props.AIResultData.jsonData)
    this.resultConclusion = {
      conclusion: this.$props.AIResultData.conclusion,
      description: jsonData.overall_result['overall_result_description']
    }
    this.resultItems = jsonData.overall_result['result_items']
    this.imgSrc = this.$props.AIResultData.imgSrc
    // 根据不同业务结论显示标记
    if (this.resultItems.length > 0) {
      this.resultItems.forEach(item => {
        if (item.item_name === 'hiding' && item.result_type !== 'NO_SUSPECT' && jsonData['foreign_spot_result']['foreign_bboxes'] && jsonData['foreign_spot_result']['foreign_bboxes'].length > 0) { // 夹藏
          jsonData['foreign_spot_result']['foreign_bboxes'].forEach(e => {
            e.bbox.description = 'Hiding'
            this.markArr.push(e.bbox)
          })
        }
        if (item.item_name === 'contraband' && item.result_type !== 'NO_SUSPECT' && jsonData['detection_result']['detect_bboxes'] && jsonData['detection_result']['detect_bboxes'].length > 0) { // 违禁品、异物
          jsonData['detection_result']['detect_bboxes'].forEach(e => {
            e.bbox.description = this.contrabandType[e['bbox_type'] - 1]
            this.markArr.push(e.bbox)
          })
        }
        if (item.item_name === 'empty' && jsonData['empty_det_result'] && jsonData['empty_det_result']['empty_det_bboxes'] && jsonData['empty_det_result']['empty_det_bboxes'].length > 0) { // 空箱
          jsonData['empty_det_result']['empty_det_bboxes'].forEach(e => {
            e.bbox.description = item.description
            this.markArr.push(e.bbox)
          })
        }
      })
    }
  },
  mounted () {
  },
  methods: {
    LookImg () {
      var viewer = new Viewer(document.getElementById('resultCanvas'))
      this.$nextTick().then(() => {
        viewer.update()
      })
      viewer.view(0)
    },
    dialogOpen () {
      this.$nextTick(() => {
        this.setImagePath(this.$props.AIResultData.imgSrc)
      })
    },
    setImagePath (url) {
      let _this = this
      let base64Data = ''
      let img = new Image()
      let dataURL = ''
      img.src = url
      img.setAttribute('crossOrigin', 'Anonymous')
      img.onload = function () {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        if (_this.markArr.length > 0) {
          _this.markArr.forEach(e => {
            // 计算描述文本字号和文本背景高度
            let bgHigh = 0
            let bgTop = 0
            if (canvas.width > 4500) {
              bgHigh = 85
              bgTop = 85
              _this.fontStyle = '70px arial'
            } else {
              bgHigh = 50
              bgTop = 60
              _this.fontStyle = '46px arial'
            }
            ctx.font = _this.fontStyle
            // 计算描述文本宽度
            let fontWidth = ctx.measureText(e.description).width
            // 居中显示描述文本和文本背景
            let fontMarginLeft = (e.x2 - e.x1) / 2 - fontWidth / 2
            ctx.fillStyle = _this.fontBgColor
            ctx.fillRect(e.x1 + fontMarginLeft, img.height - e.y2 - bgTop, fontWidth, bgHigh)
            ctx.fillStyle = _this.fontColor
            ctx.fillText(e.description, e.x1 + fontMarginLeft, img.height - e.y2 - _this.fontMarginTop)
            // 画矩形 strokeRect(x, y, w, h)
            ctx.lineWidth = _this.markLineWidth
            ctx.strokeStyle = _this.markColor
            ctx.strokeRect(e.x1, img.height - e.y2, e.x2 - e.x1, e.y2 - e.y1)
          })
        }
        base64Data = canvas.toDataURL('image/jpeg')
        let imgCanvas = document.getElementById('resultCanvas')
        imgCanvas.src = base64Data
      }
    },
    closeAIResultModal () {
      this.AIResultModal.flag = false
    }
  },
  props: {
    'AIResultData': {
      type: Object,
      default: {
        jsonData: '',
        imgSrc: ''
      }
    }
  },
  watch: {},
  components: { Dialog }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
#AIResultBox {
  margin-top: -20px;
  .resultInfo {
    .conclusion {
      position: relative;
      padding-left: $dis10*2;
      margin-bottom: $dis10;
      .status {
        position: absolute;
        top: $all/2;
        left: 0;
        transform: translate(0, -50%);
        width: 16px;
        height: 16px;
        border-radius: 8px;
      }
    }
    ul {
      padding-left: $dis10*2;
      li {
        line-height: 30px;
        span {
          margin-right: 5px;
        }
      }
    }
    #resultCanvas {
      width: $all;
      margin-top: $dis10;
    }
    .red {
      color: red;
    }
    .bgRed {
      background: red;
    }
    .green {
      color: green;
    }
    .bgGreen {
      background: green;
    }
    .viewer-title{
      display: none!important;
    }
  }
  .AIResultBtnClass {
    text-align: right;
    margin-top: $dis10 * 2;
  }
}
</style>
