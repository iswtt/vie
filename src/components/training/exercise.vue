<template>
  <div class="exercise">
    <table class="exercise-top">
      <tr>
        <td class="exercise-top-left">
          <table class="exercise-top-left-table" data-id="exerciseBasicInformation-table">
            <tr v-for="(tmpA, i) in testList" :key="i">
              <td v-for="(tmpB, ii) in tmpA" :key="ii">
                <table v-if="tmpB.ruleProp !== 'testImgHashCodes'" class="exercise-top-left-table-table"
                       :data-id="tmpB.ruleProp + '-table'">
                  <tr>
                    <td :style="styleObject">{{tmpB.label}}</td>
                    <td v-if="tmpB.ruleProp !== 'testImgHashCodes'">{{tmpB.models}}</td>
                    <td v-else style="padding: 0">
                      <div style="max-height: 72px;overflow-y: scroll">
                        <span v-for="item in tmpB.models.split(',')" :key="item">{{item}}<br></span>
                      </div>
                    </td>
                  </tr>
                </table>
                <div v-else class="table-hs-code">
                  <div class="table-hs-code-label">{{tmpB.label}}</div>
                  <div class="table-hs-code-value">
                    <span v-for="item in tmpB.models.split(',')" :key="item">{{item}}<br></span>
                  </div>
                </div>
                <!--                <table class="exercise-top-left-table-table" :data-id="tmpB.ruleProp + '-table'">-->
                <!--                  <tr>-->
                <!--                    <td :style="styleObject">{{tmpB.label}}</td>-->
                <!--                    <td v-if="tmpB.ruleProp !== 'testImgHashCodes'">{{tmpB.models}}</td>-->
                <!--                    <td v-else style="padding: 0">-->
                <!--                      <div>-->
                <!--                        <span v-for="item in tmpB.models.split(',')" :key="item">{{item}}</span>-->
                <!--                      </div>-->
                <!--                    </td>-->
                <!--                  </tr>-->
                <!--                </table>-->
              </td>
            </tr>
          </table>
        </td>
        <td class="exercise-top-middle" v-if="params.isExerciseRight"></td>
        <!-- 考试时 -->
        <td class="exercise-top-right" v-if="params.isExerciseRight && params.exerciseType === 3">
          <div class="countDown">
            <div class="countDown-left">{{$t('vicenter.training.common.countDown')}}：</div>
            <div class="countDown-right">{{countDown}}</div>
          </div>
          <div class="countDown-button">
            <el-button data-id="carryOut-btn" type="primary" @click="endPractice(null, true)">
              {{$t('vicenter.training.common.carryOut')}}
            </el-button>
          </div>
        </td>
        <!-- 练习时 -->
        <td class="exercise-top-right" v-if="params.isExerciseRight && params.exerciseType !== 3">
          <div class="countDown">
            <div class="countDown-left">{{$t('vicenter.training.common.timeCost')}}：</div>
            <div class="countDown-right">{{countDown}}</div>
          </div>
          <div class="countDown-button">
            <el-button data-id="end-btn" type="primary" @click="endPractice">{{$t('vicenter.training.common.end')}}
            </el-button>
          </div>
        </td>
      </tr>
    </table>
    <div class="exercise-bottom">
      <table>
        <tr>
          <td class="exercise-bottom-left">
            <table data-id="testDetail-table">
              <thead>
              <tr>
                <th :colspan="params.colSpan" class="exercise-bottom-title" data-id="testImgName-th">{{currentTestImg}}.
                  {{msgTestImg.testImgName}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="params.isAnswer">
                <td>
                  <ul class="exercise-bottom-thumbnail" data-id="examThumbnail-ul">
                    <li v-for="(tmp, index) in exam.thumbnail" :key="index"><img :src="tmp" alt=""></li>
                  </ul>
                </td>
              </tr>
              <tr v-else>
                <td>
                  <div class="exercise-bottom-look" @click="lookTeacher" v-if="params.exerciseType !== 5"><span
                    class="iconfont">&#xe62b;</span></div>
                  <ul class="exercise-bottom-thumbnail" data-id="teacherThumbnail-ul">
                    <li v-for="(tmp, index) in teacher.thumbnail" :key="index"><img :src="tmp" alt=""></li>
                  </ul>
                  <p data-id="teacherAnswer-p">
                    {{$t('vicenter.training.common.correctAnswer')}}：{{teacher.correctAnswer}}</p>
                </td>
                <td v-if="params.colSpan === 2 && (student.examRecordStatus !== 2 && student.examRecordStatus !== 3)">
                  <div class="exercise-bottom-look" @click="lookStudent"><span class="iconfont">&#xe62b;</span></div>
                  <ul class="exercise-bottom-thumbnail" data-id="studentThumbnail-ul">
                    <li v-for="(tmp, index) in student.thumbnail" :key="index"><img :src="tmp" alt=""></li>
                  </ul>
                  <p data-id="studentAnswer-p">
                    {{$t('vicenter.training.common.studentAnswer')}}：{{student.correctAnswer}}</p>
                </td>
                <td v-if="params.colSpan === 2 && (student.examRecordStatus === 2 || student.examRecordStatus === 3)">
                  <p>{{$t('vicenter.training.common.unanswered')}}</p>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td :colspan="params.colSpan">
                  <div class="exercise-bottom-td">
                    <!--<div class="exercise-bottom-page" @click="page(-1)">-->
                    <!-- 2020-07-25 上一题按钮优化 第一题不展示 -->
                    <!-- 2020-07-28 上一题按钮优化 可点为蓝色 不可点为黑色 -->
                    <div class="exercise-bottom-page" :style="{color: currentTestImg === 1 ? '#000000' : '#1782D4'}" @click="page(-1)">
                      <span>&lt; {{$t('vicenter.training.common.lastAsk')}}</span>
                    </div>
                    <div class="exercise-bottom-answer" v-if="params.isAnswer" data-id="studentChooseAnswer-div">
                      {{$t('vicenter.training.common.ChooseAnswer')}}：
                      <el-radio-group v-model="examParams.content">
                        <el-radio :label="1">{{$t('vicenter.training.common.exerciseList.C_CONC001')}}</el-radio>
                        <el-radio :label="0">{{$t('vicenter.training.common.exerciseList.C_CONC002')}}</el-radio>
                      </el-radio-group>
                      <el-button data-id="exerciseSubmit-btn" type="primary" size="mini" @click="submit">
                        {{$t('vicenter.training.common.submit')}}
                      </el-button>
                    </div>
                    <!--<div class="exercise-bottom-page" @click="page(1)">-->
                    <!-- 2020-07-25 下一题按钮优化 最后一题不展示 -->
                    <!-- 2020-07-28 下一题按钮优化 可点为蓝色 不可点为黑色 -->
                    <div class="exercise-bottom-page" :style="{color: currentTestImg === testImgOld.length ? '#000000' : '#1782D4'}" @click="page(1)">
                      <span>{{$t('vicenter.training.common.nextAsk')}} &gt;</span>
                    </div>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
          </td>
          <td class="exercise-bottom-middle"></td>
          <td class="exercise-bottom-right">
            <table data-id="testList-table">
              <tr v-for="(tmpA, i) in testImg" :key="i">
                <td v-for="(tmpB, ii) in tmpA" :key="ii" @click="handleClick(tmpB.serialNumber)"
                    :class="{'recordActived': tmpB.recordActived && currentTestImg !== tmpB.serialNumber, 'currentActived': currentTestImg === tmpB.serialNumber}">
                  <p class="exercise-bottom-num">{{tmpB.serialNumber}}</p>
                  <!-- 0:正确，1：错误 -->
                  <template v-if="params.isExamRecord">
                    <span class="iconfont hook" v-if="tmpB.examRecordStatus === 0">&#xe706;</span>
                    <span class="iconfont cross"
                          v-if="tmpB.examRecordStatus === 1 || (tmpB.examRecordStatus === 2 && params.exerciseType === 2) || (tmpB.examRecordStatus === 3 && params.exerciseType === 2)">&#xe69f;</span>
                  </template>
                  <!-- </template> -->
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajaxTeacher from '@/api/training/teacher.js'
import ajaxStudent from '@/api/training/student.js'
import ajaxIndex from '@/api/training/index.js'
import ajaxCommon from '@/api/common/common.js'

export default {
  data () {
    const config = window.config
    return {
      callBack: { // VIProbe接口回调成功变量
        one: '',
        two: ''
      },
      styleObject: {
        paddingTop: this.params.tdPadding + 'px',
        paddingBottom: this.params.tdPadding + 'px'
      },
      testListOld: [], // 试卷的原始数据
      testImgOld: [], // 试题的原始数据
      testList: [], // 试卷的二维数组
      testImg: [], // 试题的二维数组
      currentTestImg: 1,
      msgTestImg: {}, // 当前试题信息
      exam: {
        thumbnail: [],
        saveImg: {
          name: '',
          server_path: config.trainingUI.fileUrl,
          trans: config.trainingUI.trans,
          imageFiles: [],
          markFilePath: []
        }
      }, // 考试
      examParams: {
        answer: '', // 答卷百分比
        content: '', // 是否有嫌疑物
        examRecordImg: '', // 缩略图
        imgsJson: '' // 嫌疑物json
      },
      teacher: {
        thumbnail: [], // 缩略图
        imgsUrl: [], // 源文件
        correctAnswer: '',
        saveImg: {
          name: '',
          server_path: config.trainingUI.fileUrl,
          trans: config.trainingUI.trans,
          imageFiles: [],
          markFilePath: [],
          markUrl: ''
        }
      }, // 正确答案
      student: {
        thumbnail: [], // 缩略图
        imgsUrl: [], // 源文件
        examRecordStatus: '', // 0：正确，1：错误，2：未达题
        correctAnswer: '', // 学员选择的答案
        saveImg: {
          name: '',
          server_path: config.trainingUI.fileUrl,
          trans: config.trainingUI.trans,
          imageFiles: [],
          markFilePath: []
        }
      }, // 学员答题
      viprobeData: {
        timeout: 3000
      },
      isRight: false,
      countDown: '00:00:00',
      examDuration: '',
      timer: null,
      uploadJpgBackResult: null,
      serverPath: '' // uploadJpg的path
    }
  },
  props: ['testListData', 'testImgData', 'params'],
  created () {
    this.init()
    // console.log(this.params)
    if (this.params.isExerciseRight && this.params.exerciseType === 3) {
      // 使用定时器实现每一秒写一次时间
      console.log(this.params.examDuration, '考试时长')
      // this.examDuration = this.params.examDuration - this.params.examUseTime
      this.examDuration = this.params.examDuration
      this.timer = setInterval(() => {
        if (this.examDuration > 0) {
          this.countDownSetInterval()
        } else {
          clearInterval(this.timer)
        }
      }, 1000)
    } else if (this.params.isExerciseRight) {
      this.examDuration = 0
      this.timer = setInterval(() => {
        this.timeCostSetInterval()
      }, 1000)
    }
  },
  watch: {
    // 监听VIProbe回调成功
    callBack: {
      handler (newValue, oldValue) {
        // console.log(newValue)
        if (this.examParams.content === 1 && newValue.one && newValue.two) {
          console.log('有嫌疑的好了')
          this.submitQuestions()
        } else if (this.examParams.content === 0 && newValue.one) {
          console.log('无嫌疑的好了')
          this.submitQuestions()
        }
      },
      deep: true
    },
    examDuration (newValue, oldValue) {
      if (newValue === 0 && this.params.exerciseType === 3) {
        this.endPractice()
      }
    }
  },
  methods: {
    init () {
      console.log(this.params, '父组件参数')
      console.log(this.testListData)
      if (this.testListData.length > 0 && this.params.exerciseType !== 5) {
        this.testListOld = this.testListData
        this.testList = this.twoDimensionalArray(this.testListOld, 2)
      }
      console.log(this.testImgData)
      if (this.testImgData.length > 0) {
        this.testImgOld = this.testImgData
        this.testImg = this.twoDimensionalArray(this.testImgOld, 5)
        console.log(this.testImg)
        let first = this.testImgOld[this.currentTestImg - 1]
        // console.log(this.testImgOld)
        if (first.testListId && first.number) {
          this.getTestImgInfo(first.testListId, first.number)
        }
        // console.log(first, '第一个试题')
        // console.log(this.params)
        let id = this.params.examId ? this.params.examId : this.params.userExamId
        if (id && first.examRecordId && first.testImgId) {
          this.viewQuestions(id, first.examRecordId, first.testImgId)
        }
      }
    },
    // 交卷
    endPractice (isNoTime, incompleteTip) {
      if (incompleteTip) {
        this.$ConfirmBox(this.$t('vicenter.training.common.confirmEndExam'), () => {
          this.submitExam(isNoTime)
        })
      } else {
        this.submitExam(isNoTime)
      }
    },
    submitExam (isNoTime) {
      if (isNoTime === 1) {
        clearInterval(this.timer)
        this.$NotifSuccess(this.$t('vicenter.training.common.noTimeEndPractice'))
      }
      let endPracticeSuccess = this.$t('vicenter.training.common.endPracticeSuccess')
      let params = {}
      params.userExamId = this.testImgOld[0].userExamId
      // console.log(params, '交卷的参数')
      this.openLoading()
      ajaxStudent.endPractice(params).then(res => {
        console.log(res, '交卷结果')
        this.closeLoading()
        if (res.data.flag) {
          clearInterval(this.timer)
          this.$NotifSuccess(endPracticeSuccess)
          // 关闭父组件弹出层
          setTimeout(() => {
            // console.log('通知父组件')
            this.params.toFatherClose()
          }, 1500)
        }
      })
    },
    // 提交
    async submit () {
      let first = this.testImgOld[this.currentTestImg - 1]
      // 审图练习的试题已答过不可修改
      if (this.params.exerciseType === 4 && first.examRecordStatus !== 2 && first.examRecordStatus !== 3) {
        this.$NotifPrompt(this.$t('vicenter.training.common.notModify'))
        return
      }
      if (this.examParams.content === '') {
        this.$NotifPrompt(this.$t('vicenter.training.common.pleaseChooseAnswer'))
        return
      }
      this.openLoading()
      // 新建一个文件夹，上传jpg图像
      let res = await ajaxIndex.createFloder()
      if (res.data.flag) {
        this.serverPath = res.data.result
        // 考试缩略图 viprobe直接上传考试缩略图
        viProbe.generateUploadJpgCommand(this.exam.saveImg.name, this.serverPath)
        viprobeReturn.uploadJpgBackResult = null
        viprobeReturn.uploadJpgSuccess = null
        this.callBack.one = ''
        this.uploadJpgCallBack()
      } else {
        this.closeLoading()
      }
      // 考试缩略图
      // viProbe.getImageInViProbeBase64(this.exam.saveImg.name, false, true)
      // viprobeReturn.imageInViProbeSuccess = null
      // this.callBack.one = ''
      // this.getImageInViProbeBase64CallBack()
      if (this.examParams.content === 1) {
        // 考试嫌疑物json
        viProbe.getMarkAsJson(this.exam.saveImg.name, false, true)
        viprobeReturn.getMarkJsonSuccess = null
        this.callBack.two = ''
        this.getMarkAsJsonCallBack()
      } else {
        this.examParams.imgsJson = null
      }
    },
    // 上传给定name名称的图像的jpg图回调
    uploadJpgCallBack () {
      if (!viprobeReturn.uploadJpgSuccess) {
        if (viprobeReturn.uploadJpgSuccess === false) {
          this.$NotifError(this.$t('vicenter.Background.device.uploadFailure'))
          this.closeLoading()
        } else {
          setTimeout(this.uploadJpgCallBack, this.viprobeData.timeout)
        }
      } else {
        console.log('上传jpg成功')
        // uploadJpg返回的是文件名，需要拼接serverPath
        let arr = viprobeReturn.uploadJpgBackResult.files
        if (arr && arr.length > 0) {
          arr.forEach((e, index) => {
            arr[index] = `${this.serverPath}${e}`
          })
        }
        this.examParams.examRecordImg = arr.join(',')
        this.callBack.one = true
      }
    },
    // 调用获取图像回调
    getImageInViProbeBase64CallBack () {
      if (!viprobeReturn.imageInViProbeSuccess) {
        setTimeout(this.getImageInViProbeBase64CallBack, this.viprobeData.timeout)
      } else {
        console.log(viprobeReturn.isOriginal, '获取图像缩略图回调')
        let imageInViProbeBase64 = viprobeReturn.imageInViProbeBase64.join(',')
        this.base64Uplaod(imageInViProbeBase64)
      }
    },
    // base64文件上传
    base64Uplaod (strList) {
      let params = {
        strList: strList
      }
      console.log(1)
      ajaxIndex.base64Uplaod(params).then((res) => {
        console.log(res, '文件上传回参')
        if (res.data.flag) {
          this.examParams.examRecordImg = res.data.result
          this.callBack.one = true
        }
      })
    },
    // 调用获取嫌疑标记回调
    getMarkAsJsonCallBack (resolve) {
      if (!viprobeReturn.getMarkJsonSuccess) {
        setTimeout(this.getMarkAsJsonCallBack, this.viprobeData.timeout)
      } else {
        console.log(viprobeReturn.markJson, '获取嫌疑标记回调')
        if (viprobeReturn.markJson.length === 0) {
          /*
                          * 2020-03-01
                          * bug修复 我的考试 选择嫌疑 未在vp标记嫌疑时 loading未关闭
                          * */
          this.closeLoading()
          this.$NotifPrompt(this.$t('vicenter.training.common.markSuspectPrompt'))
        } else {
          this.examParams.imgsJson = JSON.stringify(viprobeReturn.markJson)
          // 考试计算嫌疑比值
          let markFilePath = null
          if (this.msgTestImg.markUrl) {
            markFilePath = ''
            markFilePath = this.msgTestImg.markUrl
          } else {
            markFilePath = []
            this.exam.saveImg.markFilePath = this.msgTestImg.listEntities.map(item => JSON.parse(item.imgsJson))
            console.log(this.msgTestImg, this.exam.saveImg.markFilePath)
            for (let tmpA of this.exam.saveImg.markFilePath) {
              if (tmpA) {
                for (let tmpB of tmpA) {
                  markFilePath.push(tmpB)
                }
              }
            }
          }
          // console.log(markFilePath, '老师标注的嫌疑标记')
          viProbe.getShapeRatioByJson(this.exam.saveImg.name, markFilePath)
          viprobeReturn.imageInViProbeSuccess = null
          this.getShapeRatioByJsonCallBack()
        }
      }
    },
    // 调用考试计算嫌疑比值回调
    getShapeRatioByJsonCallBack () {
      if (viprobeReturn.openLocalResult.flag === null) {
        setTimeout(this.getShapeRatioByJsonCallBack, this.viprobeData.timeout)
      } else {
        console.log(viprobeReturn.openLocalResult, '获取考试计算嫌疑比值回调')
        this.examParams.answer = viprobeReturn.openLocalResult.result
        this.callBack.two = true
      }
    },
    // 提交试题
    submitQuestions () {
      // console.log(this.examParams, '提交试题参数')
      if (this.params.examId) {
        this.examParams.examId = this.params.examId // 考试的时候需要传参
        this.examParams.userExamId = this.testImgOld[0].userExamId
      } else {
        this.examParams.userExamId = this.params.userExamId
      }
      ajaxStudent.submitQuestions(this.examParams).then(res => {
        // console.log(res, '提交试题结果')
        this.closeLoading()
        this.$NotifSuccess(this.$t('vicenter.training.common.answerSuccess'))
        if (res.data.flag) {
          if (this.params.exerciseType === 3) {
            this.practiceDate(this.params.examId) // 考试
          } else {
            this.practiceDate(this.params.userExamId) // 审图练习
          }
        }
      })
    },
    // 考试倒计时
    countDownSetInterval () {
      // console.log(11)
      this.examDuration -= 1000
      if (this.examDuration < 1000) {
        this.endPractice(1)
      }
      let hours = Math.floor(this.examDuration / 60 / 60 / 1000)
      let hoursmod = this.examDuration - (hours * 60 * 60 * 1000) // 减去小时后剩余的毫秒
      let minutes = Math.floor(hoursmod / 60 / 1000) // 59
      let minutesmod = hoursmod - (minutes * 60 * 1000) // 减去小时减去分钟后剩余的毫秒
      let seconds = Math.floor(minutesmod / 1000)
      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      this.countDown = hours + ':' + minutes + ':' + seconds
    },
    // 练习计时
    timeCostSetInterval () {
      // console.log(11)
      this.examDuration += 1000
      let hours = Math.floor(this.examDuration / 60 / 60 / 1000)
      let hoursmod = this.examDuration - (hours * 60 * 60 * 1000) // 减去小时后剩余的毫秒
      let minutes = Math.floor(hoursmod / 60 / 1000) // 59
      let minutesmod = hoursmod - (minutes * 60 * 1000) // 减去小时减去分钟后剩余的毫秒
      let seconds = Math.floor(minutesmod / 1000)
      if (hours < 10) hours = '0' + hours
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      this.countDown = hours + ':' + minutes + ':' + seconds
    },
    // 点击试题
    handleClick (index) {
      this.currentTestImg = index
      if (this.params.exerciseType === 5) {
        this.testImgOld[this.currentTestImg - 1].examRecordStatus = 1
        this.testImg = this.twoDimensionalArray(this.testImgOld, 5)
      }
      let first = this.testImgOld[this.currentTestImg - 1]
      if (first.testListId && first.number) {
        this.getTestImgInfo(first.testListId, first.number)
      }
      let id = this.params.examId ? this.params.examId : this.params.userExamId
      if (id && first.examRecordId && first.testImgId) {
        this.viewQuestions(id, first.examRecordId, first.testImgId)
      }
    },
    // 查看考试试题
    viewQuestions (id, examRecordId, testImgId) {
      let params = {}
      if (this.params.examId) {
        params.examId = id
      } else {
        params.userExamId = id
      }
      params.examRecordId = examRecordId
      params.testImgId = testImgId
      params.pcUserId = sessionStorage.getItem('userId')
      this.openLoading()
      ajaxTeacher.viewQuestions(params).then(async res => {
        if (res.data.flag) {
          let {testImgInfo, testList} = res.data.result
          console.log(this.msgTestImg)
          testImgInfo[0] = await this.setHsNames(testImgInfo[0])
          this.closeLoading()
          Object.assign(this.msgTestImg, testImgInfo[0])
          let first = this.testImgOld[this.currentTestImg - 1]
          console.log(first, '当前试题信息')
          // 是否答题
          if (this.params.isAnswer) {
            /*
                      * 需求变更 viProbe.openImageAndAnalysisInfoInViProbe 的第二个参数变更为 配置文件路径 + 文件夹路径
                      * 文件夹路径取 任一文件路径截取
                      * */
            let _servePath = ''
            this.exam.thumbnail = this.msgTestImg.listEntities.map(item => {
              _servePath || (_servePath = item.originalThumbnail.substring(0, item.originalThumbnail.lastIndexOf('/') + 1))
              return window.config.trainingUI.fileUrl + item.originalThumbnail
            })
            this.exam.thumbnail = Array.from(new Set(this.exam.thumbnail))
            // this.exam.thumbnail = this.msgTestImg.listEntities.map(item => window.config.trainingUI.fileUrl + item.originalThumbnail)
            this.exam.thumbnail = this.exam.thumbnail.filter(item => item)
            this.exam.saveImg.name = this.msgTestImg.testImgId.trim()
            let isUff = null
            let ext = null
            this.exam.saveImg.imageFiles = []
            // /*
            //      * 2020-03-18
            //      * 多文件修改 取 this.teacher.imgsUrl 中任一条 通过 ',' 分割
            //      * */
            // this.msgTestImg.listEntities[0].imgsName.split(',').forEach(item => {
            //   // this.msgTestImg.listEntities.forEach(item => {
            //   if (item) {
            //     let obj = {
            //       name: item
            //     }
            //     this.exam.saveImg.imageFiles.push(obj)
            //     ext = item.substring(item.lastIndexOf('.') + 1, item.length)
            //     if (ext === 'img') {
            //       isUff = false
            //     } else {
            //       isUff = true
            //     }
            //   }
            // })
            /*
                      * 2020-03-24
                      * 判断 本地新增 只有name
                      *     外部系统导入 取多个字段
                      * */
            // if (this.msgTestImg.testImgCreateSource === '0') { // 0 为本地
            //   this.msgTestImg.listEntities[0].imgsName.split(',').forEach(val => {
            //     let obj = {
            //       name: val
            //     }
            //     this.exam.saveImg.imageFiles.push(obj)
            //     ext = val.substring(val.lastIndexOf('.') + 1, val.length)
            //     isUff = ext !== 'img'
            //   })
            // } else {
            //   let _imgsEyes = Array.from(new Set(this.msgTestImg.listEntities.map(e => e.imgsEyes)))
            //   _imgsEyes.forEach(val => {
            //     let obj = {}
            //     let _files = this.msgTestImg.listEntities.filter(e => e.imgsEyes === val)
            //     obj.view_index = parseInt(val)
            //     obj.energe_type = parseInt(_files[0].enegryType || 2)
            //     _files.forEach(e => {
            //       obj[e.imgsDocType.toLowerCase()] = {
            //         name: e.imgsName,
            //         check_code: e.imgMd5 || ''
            //       }
            //     })

            //     this.exam.saveImg.imageFiles.push(obj)
            //   })
            //   let _imgName = this.msgTestImg.listEntities[0].imgsName
            //   ext = _imgName.substring(_imgName.lastIndexOf('.') + 1, _imgName.length)
            //   isUff = ext !== 'img'
            // }
            /**
             * 全部改为监管导入方式
             */
            let _imgsEyes = Array.from(new Set(this.msgTestImg.listEntities.map(e => e.imgsEyes)))
            _imgsEyes.forEach(val => {
              let obj = {}
              let _files = this.msgTestImg.listEntities.filter(e => e.imgsEyes === val)
              obj.view_index = parseInt(val)
              obj.energe_type = parseInt(_files[0].enegryType || 2)
              _files.forEach(e => {
                obj[e.imgsDocType.toLowerCase()] = {
                  name: e.imgsName,
                  check_code: e.imgMd5 || ''
                }
              })

              this.exam.saveImg.imageFiles.push(obj)
            })
            let _imgName = this.msgTestImg.listEntities[0].imgsName
            ext = _imgName.substring(_imgName.lastIndexOf('.') + 1, _imgName.length)
            isUff = ext.toLowerCase() !== 'img'
            if (first.imgsJson) {
              this.exam.saveImg.markFilePath = JSON.parse(first.imgsJson)
            } else {
              this.exam.saveImg.markFilePath = []
            }
            // 考生考试关联主键
            this.examParams.examRecordId = first.examRecordId
            this.examParams.testImgClass = this.msgTestImg.testImgClass
            this.examParams.content = first.content ? Number(first.content) : ''
            console.log(this.exam.saveImg.markFilePath, '当前试题嫌疑标记')
            viProbe.closeAllImageInViProbe()
            console.log('path: ' + this.exam.saveImg.server_path + _servePath)
            console.log(this.exam.saveImg.imageFiles)
            // 统一改成open_v2
            viProbe.openImageAndAnalysisInfoInViProbe(this.exam.saveImg.name, this.exam.saveImg.server_path + _servePath, this.exam.saveImg.imageFiles, this.exam.saveImg.markFilePath, true, true, false, isUff, false, ext, false)
            // viProbe.openImageAndAnalysisInfoInViProbe(this.exam.saveImg.name, this.exam.saveImg.server_path + _servePath, this.exam.saveImg.imageFiles, this.exam.saveImg.markFilePath, true, true, false, isUff, false, ext, this.msgTestImg.testImgCreateSource === '0')
          } else {
            // 老师答案
            if (this.msgTestImg.testImgClass === '0') {
              this.teacher.correctAnswer = this.$t('vicenter.training.common.exerciseList.C_CONC002')
              this.teacher.thumbnail = this.msgTestImg.listEntities.map(item => window.config.trainingUI.fileUrl + item.originalThumbnail)
              this.teacher.thumbnail = Array.from(new Set(this.teacher.thumbnail))
            } else {
              this.teacher.correctAnswer = this.$t('vicenter.training.common.exerciseList.C_CONC001')
              this.teacher.thumbnail = this.msgTestImg.listEntities.map(item => window.config.trainingUI.fileUrl + (item.suspectThumbnail || item.originalThumbnail))
              // this.teacher.thumbnail = this.msgTestImg.listEntities.map(item => window.config.trainingUI.fileUrl + item.originalThumbnail)
              this.teacher.thumbnail = Array.from(new Set(this.teacher.thumbnail))
            }
            this.teacher.thumbnail = this.teacher.thumbnail.filter(item => item)
            // this.teacher.imgsUrl = this.msgTestImg.listEntities.map(item => item.imgsName)
            this.teacher.imgsUrl = this.msgTestImg.listEntities.map(item => item)
            this.teacher.imgsUrl = this.teacher.imgsUrl.filter(item => item)
            this.teacher.saveImg.name = this.msgTestImg.testImgId.trim()
            if (this.msgTestImg.markUrl) {
              this.teacher.saveImg.markUrl = this.msgTestImg.markUrl
              this.teacher.saveImg.markFilePath = []
            } else {
              this.teacher.saveImg.markFilePath = this.msgTestImg.listEntities.map(item => JSON.parse(item.imgsJson))
              this.teacher.saveImg.markFilePath = this.teacher.saveImg.markFilePath.filter(item => item)
              this.teacher.saveImg.markUrl = ''
            }
            // 学员答案
            this.student.examRecordStatus = first.examRecordStatus
            this.student.correctAnswer = first.content === '0' ? this.$t('vicenter.training.common.exerciseList.C_CONC002') : this.$t('vicenter.training.common.exerciseList.C_CONC001')
            // console.log(this.student, '学员答案')
            if (first.examRecordImg) {
              this.student.thumbnail = first.examRecordImg.split(',').map(e => window.config.trainingUI.fileUrl + e)
              this.student.thumbnail = Array.from(new Set(this.student.thumbnail))
            } else {
              this.student.thumbnail = []
            }
            this.student.saveImg.name = first.examRecordId.trim()
            if (first.imgsJson) {
              this.student.saveImg.markFilePath = JSON.parse(first.imgsJson)
            } else {
              this.student.saveImg.markFilePath = []
            }
            // this.student.imgsUrl = this.msgTestImg.listEntities.map(item => item.imgsName)
            this.student.imgsUrl = this.msgTestImg.listEntities.map(item => item)
            this.student.imgsUrl = this.student.imgsUrl.filter(item => item)
          }
          // 图像学习
          if (this.params.exerciseType === 5) {
            testImgInfo[0].testImgClass = this.$t(`vicenter.training.common.imageClassificationList.${testImgInfo[0].testImgClass}`)
            this.$initSearchIpt(this.testListData, testImgInfo[0])
            this.testListOld = this.testListData
            this.testList = this.twoDimensionalArray(this.testListOld, 2)
            this.lookTeacher()
          }
          this.$forceUpdate()
        }
      })
    },
    // 根据hsids获取hscode和name
    async setHsNames (data) {
      if (!data) {
        return data
      }
      let params = {id: data.hsIds}
      let res = await ajaxCommon.getInfosByHsIds(params)
      if (res.data.flag && res.data.result) {
        let result = res.data.result
        let arr = []
        let keys = Object.keys(result)
        keys.forEach(item => {
          if (result[item]) {
            arr.push(`${result[item].hsCode}:${result[item].hsDesc}`)
          }
        })
        data.testImgHashCodes = arr.join(',')
      }
      return data
    },
    // 试题详情
    getTestImgInfo (testListId, number) {
      this.openLoading()
      ajaxTeacher.getTestImgInfo({testListId: testListId, number: number}).then(res => {
        console.log(res, '当前试题详情')
        this.closeLoading()
        if (res.data.flag) {
          Object.assign(this.msgTestImg, res.data.result)
          if (this.msgTestImg.testImgClass === '0') {
            this.teacher.correctAnswer = this.$t('vicenter.training.common.exerciseList.C_CONC002')
            this.teacher.thumbnail = this.msgTestImg.listEntities.map(item => window.config.trainingUI.fileUrl + item.originalThumbnail)
            this.teacher.thumbnail = Array.from(new Set(this.teacher.thumbnail))
          } else {
            this.teacher.correctAnswer = this.$t('vicenter.training.common.exerciseList.C_CONC001')
            this.teacher.thumbnail = this.msgTestImg.listEntities.map(item => window.config.trainingUI.fileUrl + (item.suspectThumbnail || item.originalThumbnail))
            this.teacher.thumbnail = Array.from(new Set(this.teacher.thumbnail))
          }
          this.teacher.thumbnail = this.teacher.thumbnail.filter(item => item)
          // this.teacher.imgsUrl = this.msgTestImg.listEntities.map(item => item.imgsName)
          this.teacher.imgsUrl = this.msgTestImg.listEntities.map(item => item)
          this.teacher.imgsUrl = this.teacher.imgsUrl.filter(item => item)
          console.log(this.teacher.imgsUrl)
          this.teacher.saveImg.name = this.msgTestImg.testImgId.trim()
          if (this.msgTestImg.markUrl) {
            this.teacher.saveImg.markUrl = this.msgTestImg.markUrl
            this.teacher.saveImg.markFilePath = []
          } else {
            this.teacher.saveImg.markFilePath = this.msgTestImg.listEntities.map(item => JSON.parse(item.imgsJson))
            this.teacher.saveImg.markFilePath = this.teacher.saveImg.markFilePath.filter(item => item)
            this.teacher.saveImg.markUrl = ''
          }
          this.$forceUpdate()
        }
      })
    },
    // 打开指定路径的文件
    lookTeacher () {
      viProbe.closeAllImageInViProbe()
      let isUff = null
      let ext = null
      this.teacher.saveImg.imageFiles = []
      /*
                * 2020-03-18
                * 多文件修改 取 this.teacher.imgsUrl 中任一条 通过 ',' 分割
                * 2020-03-24 已废弃
                * */
      /*
                * 2020-03-24
                * 判断 本地新增 只有name
                *     外部系统导入 取多个字段
                * */
      console.log(this.teacher)
      // if (this.msgTestImg.testImgCreateSource === '0') { // 0 为本地
      //   this.teacher.imgsUrl[0].imgsName.split(',').forEach(val => {
      //     let obj = {
      //       name: val
      //     }
      //     this.teacher.saveImg.imageFiles.push(obj)
      //     ext = val.substring(val.lastIndexOf('.') + 1, val.length)
      //     isUff = ext !== 'img'
      //   })
      // } else {
      //   let _imgsEyes = Array.from(new Set(this.teacher.imgsUrl.map(e => e.imgsEyes)))
      //   _imgsEyes.forEach(val => {
      //     let obj = {}
      //     let _files = this.teacher.imgsUrl.filter(e => e.imgsEyes === val)
      //     obj.view_index = !val ? '' : parseInt(val)
      //     obj.energe_type = parseInt(_files[0].enegryType || 2)
      //     _files.forEach(e => {
      //       obj[e.imgsDocType ? e.imgsDocType.toLowerCase() : ''] = {
      //         name: e.imgsName,
      //         check_code: e.imgMd5 || ''
      //       }
      //     })

      //     this.teacher.saveImg.imageFiles.push(obj)
      //   })
      //   let _imgName = this.teacher.imgsUrl[0].imgsName
      //   ext = _imgName.substring(_imgName.lastIndexOf('.') + 1, _imgName.length)
      //   isUff = ext !== 'img'
      // }

      let _imgsEyes = Array.from(new Set(this.teacher.imgsUrl.map(e => e.imgsEyes)))
      _imgsEyes.forEach(val => {
        let obj = {}
        let _files = this.teacher.imgsUrl.filter(e => e.imgsEyes === val)
        obj.view_index = !val ? '' : parseInt(val)
        obj.energe_type = parseInt(_files[0].enegryType || 2)
        _files.forEach(e => {
          obj[e.imgsDocType ? e.imgsDocType.toLowerCase() : ''] = {
            name: e.imgsName,
            check_code: e.imgMd5 || ''
          }
        })

        this.teacher.saveImg.imageFiles.push(obj)
      })
      let _imgName = this.teacher.imgsUrl[0].imgsName
      ext = _imgName.substring(_imgName.lastIndexOf('.') + 1, _imgName.length)
      isUff = ext.toLowerCase() !== 'img'
      let markFilePath = null
      if (this.teacher.saveImg.markUrl) {
        markFilePath = ''
        markFilePath = this.teacher.saveImg.markUrl
      } else {
        markFilePath = this.teacher.saveImg.markFilePath ? this.teacher.saveImg.markFilePath[0] : []
        // for (let tmpA of this.teacher.saveImg.markFilePath) {
        //   if (tmpA) {
        //     for (let tmpB of tmpA) {
        //       markFilePath.push(tmpB)
        //     }
        //   }
        // }
      }
      /*
                   * 需求变更 viProbe.openImageAndAnalysisInfoInViProbe 的第二个参数变更为 配置文件路径 + 文件夹路径
                   * 文件夹路径取 任一文件路径截取
                   * */
      let _serveUrl = window.config.trainingUI.fileUrl + this.msgTestImg.listEntities[0].originalThumbnail
      /*
                  * 2020-03-24
                  * 本地新增试题和导入试题 做区别
                  * openImageAndAnalysisInfoInViProbe 添加一个参数 isOpen (boolean)
                  * 用于判断 util.viProbeJsonUtil.generateCommandObj 的第一个参数 为 open (true) 还是 open_v2 (false)
                  * */
      // 统一改成open_v2
      viProbe.openImageAndAnalysisInfoInViProbe(this.teacher.saveImg.name, _serveUrl.substring(0, _serveUrl.lastIndexOf('/')), this.teacher.saveImg.imageFiles, markFilePath, false, false, false, isUff, false, ext, false)
      // viProbe.openImageAndAnalysisInfoInViProbe(this.teacher.saveImg.name, _serveUrl.substring(0, _serveUrl.lastIndexOf('/')), this.teacher.saveImg.imageFiles, markFilePath, false, false, false, isUff, false, ext, this.msgTestImg.testImgCreateSource === '0')
    },
    // 打开指定路径的文件
    lookStudent () {
      viProbe.closeAllImageInViProbe()
      let isUff = null
      let ext = null
      this.student.saveImg.imageFiles = []

      /*
                * 2020-03-24
                * 判断 本地新增 只有name
                *     外部系统导入 取多个字段
                * */
      console.log(this.msgTestImg)
      // if (this.msgTestImg.testImgCreateSource === '0') { // 0 为本地
      //   this.student.imgsUrl[0].imgsName.split(',').forEach(val => {
      //     let obj = {
      //       name: val
      //     }
      //     this.student.saveImg.imageFiles.push(obj)
      //     ext = val.substring(val.lastIndexOf('.') + 1, val.length)
      //     isUff = ext !== 'img'
      //   })
      // } else {
      //   let _imgsEyes = Array.from(new Set(this.student.imgsUrl.map(e => e.imgsEyes)))
      //   _imgsEyes.forEach(val => {
      //     let obj = {}
      //     let _files = this.student.imgsUrl.filter(e => e.imgsEyes === val)
      //     obj.view_index = parseInt(val)
      //     obj.energe_type = parseInt(_files[0].enegryType || 2)
      //     _files.forEach(e => {
      //       obj[e.imgsDocType.toLowerCase()] = {
      //         name: e.imgsName,
      //         check_code: e.imgMd5 || ''
      //       }
      //     })

      //     this.student.saveImg.imageFiles.push(obj)
      //   })
      //   let _imgName = this.student.imgsUrl[0].imgsName
      //   ext = _imgName.substring(_imgName.lastIndexOf('.') + 1, _imgName.length)
      //   isUff = ext !== 'img'
      // }
      let _imgsEyes = Array.from(new Set(this.student.imgsUrl.map(e => e.imgsEyes)))
      _imgsEyes.forEach(val => {
        let obj = {}
        let _files = this.student.imgsUrl.filter(e => e.imgsEyes === val)
        obj.view_index = parseInt(val)
        obj.energe_type = parseInt(_files[0].enegryType || 2)
        _files.forEach(e => {
          obj[e.imgsDocType.toLowerCase()] = {
            name: e.imgsName,
            check_code: e.imgMd5 || ''
          }
        })

        this.student.saveImg.imageFiles.push(obj)
      })
      let _imgName = this.student.imgsUrl[0].imgsName
      ext = _imgName.substring(_imgName.lastIndexOf('.') + 1, _imgName.length)
      isUff = ext.toLowerCase() !== 'img'
      /*
                   * 需求变更 viProbe.openImageAndAnalysisInfoInViProbe 的第二个参数变更为 配置文件路径 + 文件夹路径
                   * 文件夹路径取 任一文件路径截取
                   * */
      let _serveUrl = window.config.trainingUI.fileUrl + this.msgTestImg.listEntities[0].originalThumbnail
      // 统一改成open_v2
      viProbe.openImageAndAnalysisInfoInViProbe(this.student.saveImg.name, _serveUrl.substring(0, _serveUrl.lastIndexOf('/') + 1), this.student.saveImg.imageFiles, this.student.saveImg.markFilePath, false, false, false, isUff, false, ext, false)
      // viProbe.openImageAndAnalysisInfoInViProbe(this.student.saveImg.name, _serveUrl.substring(0, _serveUrl.lastIndexOf('/') + 1), this.student.saveImg.imageFiles, this.student.saveImg.markFilePath, false, false, false, isUff, false, ext, this.msgTestImg.testImgCreateSource === '0')
    },
    // 上一题下一题
    page (num) {
      // console.log(this.testImgOld.length)
      // 图像学习
      if (this.params.exerciseType === 5) {
        this.testImgOld[this.currentTestImg - 1].examRecordStatus = 1
        this.testImg = this.twoDimensionalArray(this.testImgOld, 5)
        // console.log(this.testImgOld, this.currentTestImg - 1)
      }
      if (num > 0) {
        if (this.currentTestImg === this.testImgOld.length) return
        this.currentTestImg = this.currentTestImg + 1
      } else {
        if (this.currentTestImg === 1) return
        this.currentTestImg = this.currentTestImg - 1
      }
      let first = this.testImgOld[this.currentTestImg - 1]
      if (first.testListId && first.number) {
        this.getTestImgInfo(first.testListId, first.number)
      }
      let id = this.params.examId ? this.params.examId : this.params.userExamId
      if (id && first.examRecordId && first.testImgId) {
        this.viewQuestions(id, first.examRecordId, first.testImgId)
      }
    },
    // 获取题目集合
    practiceDate (id) {
      let params = {}
      if (this.params.examId) {
        params.examId = id // 考试主键
      } else {
        params.userExamId = id // 考试关联表主键
      }
      params.pcUserId = sessionStorage.getItem('userId')
      // console.log(params)
      ajaxTeacher.practiceDate(params).then(res => {
        console.log(res.data.result, '获取题目集合')
        if (res.data.flag) {
          let {record} = res.data.result
          record.forEach((item, index) => {
            item.serialNumber = index + 1
          })
          this.testImgOld = record
          this.testImg = this.twoDimensionalArray(this.testImgOld, 5)
        }
      })
    },
    // 二维数组
    twoDimensionalArray (oldArr, num) {
      let newArr = []
      let arr = []
      oldArr.map((val, key) => {
        if (this.params.recordActived && val.examRecordStatus !== 2 && val.examRecordStatus !== 3) {
          val.recordActived = true
        } else {
          val.recordActived = false
        }
        arr.push(val)
        if ((key + 1) % num === 0) {
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        } else if (oldArr.length < num && oldArr.length === arr.length) { // 当传入数据的长度小于td列数时，条件：二位数组的长度等于传入数据的长度
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        } else if ((oldArr.length - 1) === key && arr.length < num) { // 当传入数据的长度除以td列数有余数时，条件：传入数据的长度-1等于遍历完成的key且二位数组的长度小于td列数
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        }
      })
      return newArr
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
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss">
  @import "../../styles/index.scss";

  .hs-code-td {
    /*display: flex;*/
    /*flex-direction: column;*/
    /*align-items: flex-start;*/
    /*justify-content: flex-start;*/
    max-height: 72px;
    overflow-y: scroll
  }

  .table-hs-code {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    width: 200%;

    .table-hs-code-label {
      width: 14%;
      background: #f2f2f2;
      border-right: 1px solid #d7d7d7;
    }

    .table-hs-code-value {
      height: 72px;

      width: 86%;
      overflow-y: scroll;
      background: #fff;
    }
  }

  .exercise {
    width: $all;

    .exercise-top {
      width: $all;

      .exercise-top-left {
        width: auto;
        vertical-align: top;

        .exercise-top-left-table {
          @include tableBorder($all, separate, 1px, #d7d7d7);

          & > tr {
            & > td {
              width: 50%;
              padding: 0;
              height: 0;

              .exercise-top-left-table-table {
                width: $all;
                height: $all;

                tr {
                  td {
                    line-height: 32px;

                    &:first-child {
                      width: 35%;
                      padding: 10px 0;
                      background: #f2f2f2;
                      border-right: 1px solid #d7d7d7;
                    }

                    &:last-child {
                      width: 60%;
                      word-break: break-word;
                      text-align: left;
                      padding: 0 5%;
                      background: #ffffff;
                    }
                  }
                }
              }
            }
          }
        }
      }

      .exercise-top-middle {
        width: 2%;
      }

      .exercise-top-right {
        width: 28%;
        vertical-align: top;
        position: relative;

        .countDown {
          font-size: 22px;
          margin-top: $margin;
          @include flex(row, center, center);

          .countDown-right {
            color: #f00;
          }
        }

        .countDown-button {
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          text-align: center;

          button {
            width: 90%;
          }
        }
      }
    }

    .exercise-bottom {
      margin-top: $margin;

      table {
        width: $all;

        .exercise-bottom-left {
          width: auto;
          vertical-align: top;

          table {
            @include tableBorder($all, separate, 1px, #e4e4e4);

            tbody {
              tr {
                td:last-child {
                  width: 50%;
                }
              }
            }

            tr {
              td {
                background: #ffffff;
                text-align: center;
                vertical-align: bottom;
                position: relative;

                img {
                  display: inline-block;
                  margin: $margin 0;
                }
              }
            }
          }

          .exercise-bottom-look {
            text-align: right;
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer;

            span {
              @include exerciseLook();
            }
          }

          .exercise-bottom-title {
            text-align: left;
            background: #e4e4e4;
            line-height: 35px;
          }

          .exercise-bottom-thumbnail {
            @include flex(row, space-around, center);

            li {
              width: 100%;

              img {
                width: 100%;
              }
            }
          }

          .exercise-bottom-td {
            @include flex(row, space-between, center);
            line-height: 35px;

            .exercise-bottom-answer {
              @extend .exercise-bottom-td;

              .el-radio-group {
                @extend .exercise-bottom-td;
                margin-right: $dis10
              }
            }

            .exercise-bottom-page {
              cursor: pointer;
            }
          }
        }

        .exercise-bottom-middle {
          width: 2%;
        }

        .exercise-bottom-right {
          width: 28%;
          vertical-align: top;

          table {
            @include tableBorder($all, separate, 1px, #d7d7d7);

            & > tr {
              & > td {
                background: #ffffff;
                width: 20%;
                line-height: 35px;
                position: relative;
                cursor: pointer;

                .exercise-bottom-num {
                  position: relative;
                  z-index: 10;
                }

                span {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);

                  &.hook {
                    @include exerciseHook();
                  }

                  &.cross {
                    @include exerciseCross();
                  }
                }
              }

              & > td.currentActived {
                background: #e4e4e4
              }

              & > td.recordActived {
                background: #3697ff
              }
            }
          }
        }
      }
    }
  }
</style>
