<template>
  <div class="student-welcome" v-loading="loading" v-bar>
    <div class="student-welcome-M">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread" />
      </div>
      <div class="statistic-container">
        <div class="remind" v-if="hasTesting">
          <div class="remind-left">
            <div class="remind-title">{{$t('vicenter.training.common.examRemind.title')}}</div>
            <div class="remind-note">{{$t('vicenter.training.common.examRemind.note')}}</div>
          </div>
          <div
            data-id="lookMore-btn"
            class="remind-right"
            @click="lookMore"
          >{{$t('vicenter.training.common.examRemind.more')}} &gt;</div>
        </div>
        <div class="charts">
          <div class="chartbox" @click="getChartsCour">
            <div class="chart-border">
              <div class="chartTop">
                <div class="chartTitle">{{chartTitle.ChartOne}}</div>
              </div>
              <div v-show="!noDataChartOne" id="ChartOne"></div>
              <div
                v-show="noDataChartOne"
                class="chartNoData"
              >{{$t('vicenter.training.student.noTraining')}}</div>
            </div>
          </div>
          <div class="chartbox" @click="getCharts(1)">
            <div class="chart-border">
              <div class="chartTop">
                <div class="chartTitle">{{chartTitle.ChartTwo}}</div>
              </div>
              <div v-show="!noDataChartTwo" id="ChartTwo"></div>
              <div
                v-show="noDataChartTwo"
                class="chartNoData"
              >{{$t('vicenter.training.student.noImageLearning')}}</div>
            </div>
          </div>
          <div class="chartbox" @click="getCharts(2)">
            <div class="chart-border">
              <div class="chartTop">
                <div class="chartTitle">{{chartTitle.ChartThree}}</div>
              </div>
              <div v-show="!noDataChartThree" id="ChartThree"></div>
              <div
                v-show="noDataChartThree"
                class="chartNoData"
              >{{$t('vicenter.training.student.noReviewExercise')}}</div>
            </div>
          </div>
          <div class="chartbox" @click="getCharts(3)">
            <div class="chart-border">
              <div class="chartTop">
                <div class="chartTitle">{{chartTitle.ChartFour}}</div>
              </div>
              <div v-show="!noDataChartFour" id="ChartFour"></div>
              <div
                v-show="noDataChartFour"
                class="chartNoData"
              >{{$t('vicenter.training.student.noExam')}}</div>
            </div>
          </div>
        </div>
        <div class="panel">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="list" v-bar>
            <ComTable
              ref="trainingProgressTable"
              v-show="witchTable === 1"
              :tableData="trainTableData"
              :tableGroup="myTraniningTableGroup"
            ></ComTable>
            <ComTable
              ref="imageLearningTable"
              v-show="witchTable === 2"
              :tableData="learnTableData"
              :tableGroup="ImgLearningTableGroup"
            ></ComTable>
            <ComTable
              ref="planApprovalExerciseTable"
              v-show="witchTable === 3"
              :tableData="reviewTableData"
              :tableGroup="reviewExerciseTableGroup"
            ></ComTable>
            <ComTable
              ref="examSituationTable"
              v-show="witchTable === 4"
              :tableData="examTableData"
              :tableGroup="myExamTableGroup"
            ></ComTable>
          </div>
        </div>
        <!-- 培训弹窗 -->
        <Dialog :modalData="detailModalData" class="formDialog">
          <ComForm
            ref="detailFormRef"
            :searchIpt="detailIpt"
            :searchFunc="SearchFunc"
            :formRule="detailFormRule"
          ></ComForm>
          <ComTable
            ref="coursewareTable"
            :tableData="detailTableData"
            :tableGroup="detailTableGroup"
          ></ComTable>
        </Dialog>
        <!-- 培训学习弹窗 -->
        <el-dialog
          class="pdf-view"
          :title="$t('vicenter.training.common.eLearning')"
          :visible.sync="dialogStudyFlag"
          @close="viewClose"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
        >
          <iframe
            v-if="!videoOrPDF && dialogStudyFlag"
            :src="studyBaseUrl + studyPDF"
            frameborder="0"
          ></iframe>
          <Video
            v-if="videoOrPDF && dialogStudyFlag"
            :src="studyBaseUrl + videoSrc"
            :playerOptions="playerOptions"
            :playerFunc="playerFunc"
          ></Video>
        </el-dialog>
        <!-- 审图练习 -->
        <Dialog :modalData="examModalData" v-if="examModalData.flag" class="exerciseDialog">
          <Exercise
            data-id="examExercise"
            ref="childs"
            :testListData="examTestList"
            :testImgData="examTestImg"
            :params="examParams"
          ></Exercise>
        </Dialog>
        <Dialog :modalData="resultModalData" v-if="resultModalData.flag" class="exerciseDialog">
          <Exercise
            data-id="detailExercise"
            ref="childs"
            :testListData="resultTestList"
            :testImgData="resultTestImg"
            :params="resultParams"
          ></Exercise>
        </Dialog>
        <!-- 考试 -->
        <Dialog :modalData="detailModalDataExa" v-if="detailModalDataExa.flag" class="formDialog">
          <table class="exercise-top-left-table" data-id="detail-table">
            <tr v-for="(tmpA, i) in testList" :key="i">
              <td v-for="(tmpB, ii) in tmpA" :key="ii">
                <table class="exercise-top-left-table-table" :data-id="tmpB.ruleProp + '-table'">
                  <tr>
                    <td>{{tmpB.label}}</td>
                    <td>{{tmpB.models}}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </Dialog>
        <Dialog :modalData="examModalDataExa" v-if="examModalDataExa.flag" class="formDialog">
          <Exercise
            data-id="examExercise"
            :testListData="examTestListExa"
            :testImgData="examTestImgExa"
            :params="examParamsExa"
          ></Exercise>
        </Dialog>
        <!-- 关闭考试提示 -->
        <Dialog :modalData="promptModalData" class="formDialog">
          <!--        <p class="prompt-p">关闭考试页面将保存答卷，下次打开继续答题，超过考试时间则自动交卷。</p>-->
          <p class="prompt-p">{{$t('vicenter.training.common.examClose')}}</p>
          <el-button
            data-id="iknow-btn"
            type="primary"
            size="small"
            @click="closePromptModal"
          >{{$t('vicenter.training.common.iknow')}}</el-button>
        </Dialog>
        <Dialog :modalData="resultModalDataExa" v-if="resultModalDataExa.flag" class="formDialog">
          <Exercise
            data-id="detailExercise"
            :testListData="resultTestListExa"
            :testImgData="resultTestImgExa"
            :params="resultParamsExa"
          ></Exercise>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'

import ComForm from '@/components/form'
import Dialog from '@/components/dialog'
import Video from '@/components/video'

import Exercise from '@/components/training/exercise'
import viProbe from '@/lib/viprobe/viProbeForTra.js'

import req from '@/api/training/student'
import reqTea from '@/api/training/teacher'

export default {
  name: 'dashboard',
  data () {
    return {
      witchTable: 1,
      titleBread: {
        font: '/',
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Training/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {}, // 标题栏
      value: '',
      hasTesting: '', // 是否显示有正在进行中的考试
      noDataChartOne: false,
      noDataChartTwo: false,
      noDataChartThree: false,
      noDataChartFour: false,
      loading: false,
      timer: null,
      chartTitle: {
        ChartOne: this.$t('vicenter.training.student.studentChartOne'),
        ChartTwo: this.$t('vicenter.training.student.studentChartTwo'),
        ChartThree: this.$t('vicenter.training.student.studentChartThree'),
        ChartFour: this.$t('vicenter.training.student.studentChartFour')
      },
      myTraniningTableGroup: [
        // 我的培训表格数据列
        {
          type: 'index',
          model: 'serialNumber'
        },
        {
          type: 'text',
          model: 'className'
        },
        {
          type: 'text',
          model: 'typeName'
        },
        {
          type: 'text',
          model: 'traName'
        },
        {
          type: 'text',
          model: 'traStartTime'
        },
        {
          type: 'text',
          model: 'traEndTime'
        },
        {
          type: 'text',
          model: 'traTime'
        },
        {
          type: 'progress',
          strokeWidth: 15,
          inside: false,
          width: '200px',
          model: 'traPercent'
        },
        {
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      ImgLearningTableGroup: [
        // 图像学习表格数据列
        {
          type: 'index',
          model: 'index',
          width: '80px'
        },
        {
          type: 'text',
          model: 'userExamStartTime'
        },
        {
          type: 'text',
          model: 'userExamEndTime'
        },
        {
          type: 'text',
          model: 'userExamTime'
        },
        {
          type: 'text',
          model: 'review'
        },
        {
          type: 'progress',
          strokeWidth: 15,
          inside: false,
          model: 'userExamCumulativeProgress'
        }
      ],
      reviewExerciseTableGroup: [
        // 审图练习表格数据列
        {
          type: 'index',
          model: 'index',
          width: '80px'
        },
        {
          type: 'text',
          model: 'userExamStartTime'
        },
        {
          type: 'text',
          model: 'userExamEndTime'
        },
        {
          type: 'text',
          model: 'questionCount'
        },
        {
          type: 'text',
          model: 'userExamTime'
        },
        {
          type: 'text',
          model: 'userExamTrueCount'
        },
        {
          type: 'text',
          model: 'userExamCorrectPercentage'
        },
        {
          type: 'operation',
          model: 'operation',
          width: '150',
          fixed: 'right'
        }
      ],
      myExamTableGroup: [
        // 我的考试表格数据列
        {
          type: 'index',
          model: 'index',
          width: '60px'
        },
        {
          type: 'text',
          model: 'examName'
        },
        {
          type: 'text',
          model: 'examStartTime'
        },
        {
          type: 'text',
          model: 'examEndTime'
        },
        {
          type: 'text',
          model: 'questionCount'
        },
        {
          type: 'text',
          model: 'testListPassCount'
        },
        {
          type: 'text',
          model: 'userExamStatus'
        },
        {
          type: 'operation',
          model: 'operation',
          width: '150',
          fixed: 'right'
        }
      ],
      trainTableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChangeCour,
          handleCurrentChange: this.handleCurrentChangeCour
        },
        refName: 'dashboardTable',
        sortMethod: this.sort
      },
      learnTableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChangeImg,
          handleCurrentChange: this.handleCurrentChangeImg
        },
        refName: 'dashboardTable',
        sortMethod: this.sort
      },
      reviewTableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChangeReview,
          handleCurrentChange: this.handleCurrentChangeReview
        },
        refName: 'dashboardTable',
        sortMethod: this.sort
      },
      examTableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChangeTest,
          handleCurrentChange: this.handleCurrentChangeTest
        },
        refName: 'dashboardTable',
        sortMethod: this.sort
      },
      operation: [
        {
          func: this.getDetail, // 学习
          title: this.$t('vicenter.training.common.learn'),
          label: `<span class='iconfont editTable'>&#xe6a2;</span>`,
          show: true
        },
        {
          func: this.getDetail, // 查看
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          show: true
        },
        {
          func: this.getDetail, // 考试
          label: `<span class='iconfont editTable'>&#xe6a0;</span>`,
          show: true
        },
        {
          func: this.getDetail, // 结果
          label: `<span class='iconfont editTable'>&#xe6a4;</span>`,
          show: true
        }
      ],
      operationTra: [
        // 培训表格详情操作
        {
          func: this.studyOnline, // 在线学习
          title: this.$t('vicenter.training.common.eLearning'),
          label: `<span class='iconfont editTable'>&#xe6a2;</span>`,
          show: true
        },
        {
          func: this.getDownload, // 下载
          title: this.$t('vicenter.training.common.download'),
          label: `<span class='iconfont editTable'>&#xe69e;</span>`,
          show: true
        }
      ],
      // ============================== 培训相关数据 ↓
      SearchFunc: {
        // 查询方法
        // query: this.traQuery,
        // close: this.resetForm
      },
      detailIpt: [
        // 查询表单
        {
          getLabel: this.$t('vicenter.training.common.trainingClassification'),
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          disabled: true,
          ruleProp: 'traClass'
        },
        {
          getLabel: this.$t('vicenter.training.common.trainingType'),
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          disabled: true,
          ruleProp: 'traCourType'
        },
        {
          getLabel: this.$t('vicenter.training.common.trainingName'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          disabled: true,
          ruleProp: 'traName'
        },
        {
          getLabel: this.$t('vicenter.training.common.trainingDesc'),
          type: 'textarea',
          models: '',
          minSize: 1,
          disabled: true,
          ruleProp: 'traDesc'
        }
      ],
      detailFormRule: {
        // 查询表单规则
        model: {
          traClass: '',
          traCourType: '',
          traName: '',
          traDesc: ''
        },
        refName: 'detailFormRef',
        rule: {}
      },
      detailTableData: {
        // 表格数据
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
      detailTableGroup: [
        // 表格数据列
        {
          label: this.$t('vicenter.training.common.serialNumber'),
          type: 'index',
          model: 'serialNumber'
        },
        {
          label: this.$t('vicenter.training.common.courseware'),
          type: 'text',
          model: 'courName'
        },
        {
          label: this.$t('vicenter.training.common.trainingStatus'),
          type: 'text',
          model: 'courStatusStr'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      detailModalData: {
        flag: false,
        resetModal: this.query,
        title: this.$t('vicenter.training.common.msg')
      },
      dialogStudyFlag: false,
      studyBaseUrl: window.config.trainingUI.fileUrl,
      videoSrc: '', // 预览视频路径
      videoOrPDF: false, // true: video false: pdf
      playerOptions: {
        refName: 'video',
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{ src: '' }],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          // timeDivider: true,
          // durationDisplay: true,
          // remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      playerFunc: {
        ready: this.videoReady,
        play: this.videoPlay,
        pause: this.videoPause,
        ended: this.videoEnded,
        loadeddata: this.videoLoadeddata,
        waiting: this.videoWaiting,
        timeupdate: this.videoTimeupdate,
        canplay: this.videoCanplay,
        canplaythrough: this.videoCanplaythrough,
        statechanged: this.videoStatechanged
      },
      studyPDF: '', // 预览pdf路径
      studyTraId: '', // 培训TraId
      traCourCount: '', // 培训数量
      studyCourId: '', // 课件id
      studyIsEnd: true, // 有没有结束学习
      studyStarTime: '', // 有没有结束学习
      // ============================== 培训相关数据 ↑
      // ============================== 审图练习数据 ↓
      operationRiv: [
        // 审图联系操作
        {
          func: this.getDetailRiv, // 结果
          title: this.$t('vicenter.training.common.result'),
          label: `<span class='iconfont editTable'>&#xe6a4;</span>`,
          show: true
        }
      ],
      examParams: {
        // 考试exercise子组件参数
        toFatherClose: this.closeExamModalData,
        colSpan: 1, // 图像分几列
        tdPadding: 20, // td的内边距
        exerciseType: 4, // Exercise组件类型1：老师答案 2：学员答题结果 3：考试，4：审图练习
        isExerciseRight: true, // 是否有计时
        isAnswer: true, // 是否答题
        isExamRecord: true, // 是否显示考试结果
        recordActived: false // 是否显示已学或者已答
      },
      examModalData: {
        // 练习弹出层
        flag: false,
        width: '75%',
        resetModal: this.examResetModal,
        title: this.$t('vicenter.training.common.exercise')
      },
      examTestList: [
        {
          models: '',
          ruleProp: 'pcUserName'
        },
        {
          models: '',
          ruleProp: 'pcUserNo'
        },
        {
          models: '',
          ruleProp: 'count'
        }
      ],
      examTestImg: [],
      resultParams: {
        // 结果exercise子组件参数
        colSpan: 2, // 图像分几列
        exerciseType: 2, // Exercise组件类型1：老师答案 2：学员答题结果
        isExerciseRight: false, // 是否有计时
        isAnswer: false, // 是否答题
        isExamRecord: true // 是否显示考试结果
      },
      resultModalData: {
        // 结果弹出层
        flag: false,
        width: '70%',
        title: this.$t('vicenter.training.common.answerPreview')
      },
      resultTestList: [
        {
          models: '',
          ruleProp: 'pcName'
        },
        {
          models: '',
          ruleProp: 'account'
        },
        {
          models: '',
          ruleProp: 'questionCount'
        },
        {
          models: '',
          ruleProp: 'userExamTime'
        },
        {
          models: '',
          ruleProp: 'userExamTrueCount'
        },
        {
          models: '',
          ruleProp: 'userExamCorrectPercentage'
        }
      ],
      resultTestImg: [],
      // ============================== 审图练习数据 ↑
      // ============================== 考试数据 ↓
      testList: [],
      operationExa: [
        {
          func: this.getDetailExa,
          title: this.$t('vicenter.common.detail'),
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          show: true
        },
        {
          func: this.getExam, // 考试
          title: this.$t('vicenter.training.common.examination'),
          label: `<span class='iconfont editTable'>&#xe6a0;</span>`,
          show: true
        },
        {
          func: this.getResult, // 结果
          title: this.$t('vicenter.training.common.result'),
          label: `<span class='iconfont editTable'>&#xe6a4;</span>`,
          show: true
        }
      ],
      detailTestList: [
        {
          models: '',
          ruleProp: 'examName'
        },
        {
          models: '',
          ruleProp: 'testListName'
        },
        {
          models: '',
          ruleProp: 'testListCount'
        },
        {
          models: '',
          ruleProp: 'testListPassCount'
        },
        {
          valueFormat: 'yyyy-MM-dd hh:mm:ss',
          models: '',
          ruleProp: 'examStartTime'
        },
        {
          valueFormat: 'yyyy-MM-dd hh:mm:ss',
          models: '',
          ruleProp: 'examEndTime'
        },
        {
          models: '',
          ruleProp: 'examStatus'
        },
        {
          models: '',
          ruleProp: 'examAddr'
        },
        {
          models: '',
          ruleProp: 'examDesc'
        },
        {
          models: '',
          ruleProp: 'pcName'
        },
        {
          valueFormat: 'yyyy-MM-dd hh:mm:ss',
          type: 'datetime',
          models: '',
          ruleProp: 'examCreateTime'
        }
      ],
      detailModalDataExa: {
        // 详情弹出层
        flag: false,
        width: '65%',
        title: this.$t('vicenter.training.common.msg')
      },
      examParamsExa: {
        // 考试exercise子组件参数
        toFatherClose: this.closeExamModalData,
        colSpan: 1, // 图像分几列
        tdPadding: 20, // td的内边距
        exerciseType: 3, // Exercise组件类型1：老师答案 2：学员答题结果 3：考试
        isExerciseRight: true, // 是否有计时
        isAnswer: true, // 是否答题
        isExamRecord: false, // 是否显示考试结果
        recordActived: true // 是否显示已学或者已答
      },
      examModalDataExa: {
        // 考试弹出层
        flag: false,
        width: '75%',
        resetModal: this.examResetModal,
        title: this.$t('vicenter.training.common.examination')
      },
      promptModalData: {
        // 提示信息弹出层
        flag: false,
        title: this.$t('vicenter.training.common.promptMessage')
      },
      examTestListExa: [
        {
          models: '',
          ruleProp: 'pcName'
        },
        {
          models: '',
          ruleProp: 'account'
        },
        {
          models: '',
          ruleProp: 'testListCount'
        },
        {
          models: '',
          ruleProp: 'testListPassCount'
        }
      ],
      examTestImgExa: [],
      resultParamsExa: {
        // 结果exercise子组件参数
        colSpan: 2, // 图像分几列
        exerciseType: 2, // Exercise组件类型1：老师答案 2：学员答题结果
        isExerciseRight: false, // 是否有计时
        isAnswer: false, // 是否答题
        isExamRecord: true // 是否显示考试结果
      },
      resultModalDataExa: {
        // 结果弹出层
        flag: false,
        width: '70%',
        title: this.$t('vicenter.training.common.answerPreview')
      },
      resultTestListExa: [
        {
          models: '',
          ruleProp: 'pcName'
        },
        {
          models: '',
          ruleProp: 'account'
        },
        {
          models: '',
          ruleProp: 'userExamTrueCount'
        },
        {
          models: '',
          ruleProp: 'userExamCorrectPercentage'
        },
        {
          models: '',
          ruleProp: 'userExamTime'
        },
        {
          models: '',
          ruleProp: 'examStatus'
        }
      ],
      resultTestImgExa: []
      // ============================== 考试数据 ↑
    }
  },
  watch: {
    'detailModalData.flag': {
      handler: function (val) {
        if (!val) {
          this.getChartsCour()
        }
      }
    },
    'examModalData.flag': {
      handler: function (val) {
        if (!val) {
          this.getCharts(2)
        }
      }
    },
    'examModalDataExa.flag': {
      handler: function (val) {
        if (!val) {
          this.getCharts(3)
        }
      }
    },
    'resultModalDataExa.flag': {
      handler: function (val) {
        if (!val) {
          this.getCharts(3)
        }
      }
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
    this.getTesting()
    this.getOptions()
  },
  mounted () {
    this.getChartsCour()
    this.getCharts()
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    // 是否有正在进行的考试
    getTesting () {
      req
        .startExamData({ pcUserId: sessionStorage.getItem('userId') })
        .then(res => {
          console.log(res)
          this.hasTesting = res.data.result.length > 0
        })
        .catch(err => {
          console.log(err)
        })
    },
    setPanelTitle () {
      this.panelTitle = {
        queryTitle: {
          title: this.chartTitle[['ChartOne', 'ChartTwo', 'ChartThree', 'ChartFour'][this.witchTable - 1]]
        }
      }
    },
    setI18n () {
      this.setPanelTitle()
      // 操作列按钮提示
      let operateTitle = [
        this.$t('vicenter.training.common.msg'),
        this.$t('vicenter.training.common.examination'),
        this.$t('vicenter.training.common.result')
      ]
      operateTitle.forEach((e, index) => {
        this.operation[index].title = e
      })
      // 我的培训查询列
      this.myTraniningTableGroup.forEach(e => {
        if (e.model === 'serialNumber') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'className') {
          e.label = this.$t('vicenter.training.common.trainingClassification')
        } else if (e.model === 'typeName') {
          e.label = this.$t('vicenter.training.common.trainingType')
        } else if (e.model === 'traName') {
          e.label = this.$t('vicenter.training.common.trainingName')
        } else if (e.model === 'traStartTime') {
          e.label = this.$t('vicenter.training.common.startTrainingTime')
        } else if (e.model === 'traEndTime') {
          e.label = this.$t('vicenter.training.common.lastTrainingTime')
        } else if (e.model === 'traTime') {
          e.label = this.$t('vicenter.training.common.trainingTimes')
        } else if (e.model === 'traPercent') {
          e.label = this.$t('vicenter.training.common.trainingProgress')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      // 图像学习查询列
      this.ImgLearningTableGroup.forEach(e => {
        if (e.model === 'index') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'userExamStartTime') {
          e.label = this.$t('vicenter.training.common.startLearningTime')
        } else if (e.model === 'userExamEndTime') {
          e.label = this.$t('vicenter.training.common.lastLearningTime')
        } else if (e.model === 'userExamTime') {
          e.label = this.$t('vicenter.training.common.learningTimes')
        } else if (e.model === 'review') {
          e.label = this.$t('vicenter.training.common.numberOfLearning')
        } else if (e.model === 'userExamCumulativeProgress') {
          e.label = this.$t('vicenter.training.common.learningProgress')
        }
      })
      // 审图练习查询列
      this.reviewExerciseTableGroup.forEach(e => {
        if (e.model === 'index') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'userExamStartTime') {
          e.label = this.$t('vicenter.training.common.startPracticing')
        } else if (e.model === 'userExamEndTime') {
          e.label = this.$t('vicenter.training.common.lastPracticing')
        } else if (e.model === 'questionCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.model === 'userExamTime') {
          e.label = this.$t('vicenter.training.common.practiceTimes')
        } else if (e.model === 'userExamTrueCount') {
          e.label = this.$t('vicenter.training.common.answerNumberOfQuestions')
        } else if (e.model === 'userExamCorrectPercentage') {
          e.label = this.$t('vicenter.training.common.correctRate')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      // 我的考试查询列
      this.myExamTableGroup.forEach(e => {
        if (e.model === 'index') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'examName') {
          e.label = this.$t('vicenter.training.common.testName')
        } else if (e.model === 'examStartTime') {
          e.label = this.$t('vicenter.training.common.examStartTime')
        } else if (e.model === 'examEndTime') {
          e.label = this.$t('vicenter.training.common.examEndTime')
        } else if (e.model === 'questionCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.model === 'testListPassCount') {
          e.label = this.$t('vicenter.training.common.passNumber')
        } else if (e.model === 'userExamStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      // 审图练习
      this.examTestList.forEach(e => {
        if (e.ruleProp === 'pcUserName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.ruleProp === 'pcUserNo') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.ruleProp === 'count') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        }
      })
      // 审图练习结果
      this.resultTestList.forEach(e => {
        if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.ruleProp === 'account') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.ruleProp === 'questionCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.ruleProp === 'userExamTime') {
          e.label = this.$t('vicenter.training.common.practiceTimes')
        } else if (e.ruleProp === 'userExamTrueCount') {
          e.label = this.$t('vicenter.training.common.answerNumberOfQuestions')
        } else if (e.ruleProp === 'userExamCorrectPercentage') {
          e.label = this.$t('vicenter.training.common.correctRate')
        }
      })
      // 考试   ↓
      // 详情
      this.detailTestList.forEach(e => {
        if (e.ruleProp === 'examName') {
          e.label = this.$t('vicenter.training.common.testName')
        } else if (e.ruleProp === 'testListName') {
          e.label = this.$t('vicenter.training.common.testPaperName')
        } else if (e.ruleProp === 'testListCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.ruleProp === 'testListPassCount') {
          e.label = this.$t('vicenter.training.common.passNumber')
        } else if (e.ruleProp === 'examStartTime') {
          e.label = this.$t('vicenter.training.common.examStartTime')
        } else if (e.ruleProp === 'examEndTime') {
          e.label = this.$t('vicenter.training.common.examEndTime')
        } else if (e.ruleProp === 'examStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        } else if (e.ruleProp === 'examAddr') {
          e.label = this.$t('vicenter.training.common.examinationVenue')
        } else if (e.ruleProp === 'examDesc') {
          e.label = this.$t('vicenter.training.common.examNotes')
        } else if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.founder')
        } else if (e.ruleProp === 'examCreateTime') {
          e.label = this.$t('vicenter.training.common.createTime')
        } else if (e.ruleProp === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      // 考试
      this.examTestListExa.forEach(e => {
        if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.ruleProp === 'account') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.ruleProp === 'testListCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.ruleProp === 'testListPassCount') {
          e.label = this.$t('vicenter.training.common.passNumber')
        }
      })
      // 结果
      this.resultTestListExa.forEach(e => {
        if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.ruleProp === 'account') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.ruleProp === 'userExamTrueCount') {
          e.label = this.$t('vicenter.training.common.answerNumberOfQuestions')
        } else if (e.ruleProp === 'userExamCorrectPercentage') {
          e.label = this.$t('vicenter.training.common.correctRate')
        } else if (e.ruleProp === 'userExamTime') {
          e.label = this.$t('vicenter.training.common.examinationTimes')
        } else if (e.ruleProp === 'examStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        }
      })
    },
    /**
     * 查看更多
     */
    lookMore () {
      this.$router.push('/Training/student/myExamList')
    },
    /**
     * 学员看板图表 培训
     * @param type 有值 表格
     */
    getChartsCour (type) {
      this.witchTable = 1 // 显示培训表格
      this.setPanelTitle()
      req
        .statMeProgress({
          pcUserId: sessionStorage.getItem('userId'),
          page: this.trainTableData.page.CurrentPage,
          size: this.trainTableData.page.pagesize
        })
        .then(res => {
          console.log(res)
          let info = res.data.result
          // 没有type且有数据 才渲染图
          if (!type && info.progressInfoList && info.progressInfoList.length) {
            this.noDataChartOne = false
            this.$nextTick(() => {
              let a = []
              let b = []
              info.progressInfoList.reverse().forEach(item => {
                a.push(item.traName)
                b.push(item.traPercent)
              })
              this.initChartOne('ChartOne', a, b)
            })
          } else if (!type && !info.progressInfoList.length) {
            this.noDataChartOne = true
          }
          this.initCourTable(info.userConInfoList)
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 学员看板图表
     * @param type ''：3 1：1 2：2 3：3
     */
    getCharts (type) {
      req
        .reportApi({ pcUserId: sessionStorage.getItem('userId') })
        .then(res => {
          // console.log(res)
          let info = res.data.result
          switch (type) {
            case 1:
              this.witchTable = 2 // 显示图像学习表格
              this.initImgLeaningTable()
              this.getChartsSwitchTwo(info)
              break
            case 2:
              this.witchTable = 3 // 显示审图练习表格
              this.initReviewTable()
              this.getChartsSwitchThree(info)
              break
            case 3:
              this.witchTable = 4 // 显示考试情况表格
              this.initTestTable()
              this.getChartsSwitchFour(info)
              break
            default:
              this.getChartsSwitchTwo(info)
              this.getChartsSwitchThree(info)
              this.getChartsSwitchFour(info)
          }
          this.setPanelTitle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getChartsSwitchTwo (info) {
      console.log(info)
      // 有数据渲染图
      if (info.imgLearnDataCount.length) {
        this.noDataChartTwo = false
        this.$nextTick(() => {
          let two = { one: [], two: [], three: [] }
          info.imgLearnDataCount.sort(
            (a, b) => a.userExamStartTime - b.userExamStartTime
          )
          info.imgLearnDataCount.forEach(item => {
            two.one.push(
              this.$options.filters['formatDate'](
                item.userExamStartTime,
                this.$t('vicenter.common.formatDate')
              )
            )
            two.two.push(parseInt(item.userExamCumulativeProgress))
            two.three.push(item.review)
          })
          this.initChartTwo('ChartTwo', two)
        })
      } else {
        this.noDataChartTwo = true
      }
    },
    getChartsSwitchThree (info) {
      // 有数据渲染图
      if (info.imgExerciseDataCount.length) {
        this.noDataChartThree = false
        // console.log(info.imgExerciseDataCount)
        this.$nextTick(() => {
          let three = { one: [], two: [], three: [], four: [] }
          info.imgExerciseDataCount.sort(
            (a, b) => a.userExamStartTime - b.userExamStartTime
          )
          info.imgExerciseDataCount.forEach(item => {
            three.one.push(
              this.$options.filters['formatDate'](
                item.userExamStartTime,
                this.$t('vicenter.common.formatDate')
              )
            ) // x轴
            three.two.push(item.userExamTrueCount) // 正确数
            three.three.push(item.userExamFalseCount) // 错误数
            three.four.push(parseInt(item.userExamCorrectPercentage)) // 正确率
          })
          this.initChartThree('ChartThree', three)
        })
      } else {
        this.noDataChartThree = true
      }
    },
    getChartsSwitchFour (info) {
      console.log(info)
      // 有数据渲染图
      if (info.examDataCount.length) {
        this.noDataChartFour = false
        this.$nextTick(() => {
          let four = { one: [], two: [], three: [] }
          info.examDataCount.sort(
            (a, b) => a.userExamStartTime - b.userExamStartTime
          )
          console.log(info.examDataCount)
          info.examDataCount.forEach(item => {
            if (item.userExamStartTime) {
              four.one.push(item.examName) // x轴
              four.two.push(parseInt(item.userExamCorrectPercentage)) // 正确率
              four.three.push(parseInt(item.userExamErrorRate)) // 错误率
            }
          })
          this.initChartFour('ChartFour', four)
        })
      } else {
        this.noDataChartFour = true
      }
    },
    /**
     * 培训表格
     * @param data
     */
    initCourTable (data) {
      // TODO 培训表格
      let tableData = data
      tableData.content.forEach(item => {
        item.traEndTime = this.$options.filters['formatDate'](
          item.traEndTime,
          this.$t('vicenter.common.formatDate')
        )
        item.className = this.$t(
          `vicenter.training.common.trainingClassificationList.${item.traClass.toString()}`
        )
        item.typeName = this.$t(
          `vicenter.training.common.trainingTypeList.${item.traCourType.toString()}`
        )
        item.traStartTime = this.$options.filters['formatDate'](
          item.traStartTime,
          this.$t('vicenter.common.formatDate')
        )
      })
      this.trainTableData.data = tableData.content
      if (this.trainTableData.data.length > 0) {
        this.trainTableData.isPage = true
      }
      this.trainTableData.page.Allpage = tableData.totalElements
      this.trainTableData.data.forEach(item => {
        item.operation = [this.operation[0]]
      })
    },
    // 学习弹窗
    getDetail (scope) {
      req
        .getTraInfoByUser({
          traId: scope.row.traId,
          userId: sessionStorage.getItem('userId')
        })
        .then(res => {
          console.log(res)
          let info = res.data.result
          let tableData = info.mapList
          this.detailIpt.forEach(item => {
            item.models = info[item.ruleProp]
          })
          tableData.forEach(item => {
            let b = []
            if (!item.courIsView) {
              b = b.concat(this.operationTra[0])
            }
            if (!item.courIsDown) {
              b = b.concat(this.operationTra[1])
            }
            item.operation = b
            // item.courStatusStr = item.recordStatus ? '未学习' : '已学习'
            item.courStatusStr = this.$t(
              `vicenter.training.student.${
                item.recordStatus ? 'untrained' : 'trained'
              }`
            )
          })
          this.studyTraId = info.traId
          this.traCourCount = info.traCourCount
          this.detailTableData.data = tableData
          this.detailModalData.flag = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 初始化下拉值
     */
    getOptions () {
      let loadCase = this.$initLoading()
      let reqArr = [
        reqTea.getTraDictInfo({ dictId: '100' }),
        reqTea.getTraDictInfo({ dictId: '200' })
      ]
      Promise.all(reqArr)
        .then(res => {
          console.log(res)
          let _type = res[0].data.result.map(e => {
            return {
              value: e.dictId,
              label: this.$t(
                `vicenter.training.common.trainingTypeList.${e.dictId.toString()}`
              )
            }
          })
          let _classify = res[1].data.result.map(e => {
            return {
              value: e.dictId,
              label: this.$t(
                `vicenter.training.common.trainingClassificationList.${e.dictId.toString()}`
              )
            }
          })
          // 培训分类
          // this.searchIpt[0].option = _classify
          this.detailIpt[0].option = _classify
          // 培训类型
          // this.searchIpt[1].option = _type
          this.detailIpt[1].option = _type
          // this.query()
          loadCase.close()
        })
        .catch(err => {
          loadCase.close()
          console.log(err)
        })
    },
    // ================================================================================================培训相关操作 ↓
    // 在线学习
    studyOnline (scope) {
      console.log(scope)
      let info = scope.row
      // 更新状态
      req
        .upTraPceByUser({
          actType: '30001',
          courId: info.courId,
          traId: this.studyTraId,
          tarUserRecordStatus: info.recordStatus,
          traCourCount: this.traCourCount,
          userId: sessionStorage.getItem('userId')
        })
        .then(res => {
          console.log(res)
          this.studyIsEnd = false // 用于判断是否结束学习
          this.studyStarTime = res.data.result // 本次学习的开始时间
          this.studyCourId = info.courId // 课件id
          this.studyPDF = info.pdfFilePath // 课件预览路径
          let _a = info.pdfFilePath.split('.')
          let _type = _a[_a.length - 1]
          if (_type.indexOf('pdf') > -1) {
            this.videoOrPDF = false
            this.studyPDF = info.pdfFilePath // 课件预览路径
          } else {
            this.videoOrPDF = true
            this.videoSrc = info.pdfFilePath
          }
          this.dialogStudyFlag = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 在线学习关闭
    viewClose (t) {
      console.log('close')
      req
        .upTraPceByUser({
          actType: '30001',
          courId: this.studyCourId,
          traId: this.studyTraId,
          startTime: this.studyStarTime,
          tarUserRecordStatus: '0',
          traCourCount: this.traCourCount,
          userId: sessionStorage.getItem('userId')
        })
        .then(res => {
          console.log(res)
          this.studyIsEnd = true
          if (t) return false
          // 更新培训详情数据
          this.getDetail({ row: { traId: this.studyTraId } })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 下载
    getDownload (scope) {
      console.log(scope)
      let info = scope.row
      // 更新状态
      req
        .upTraPceByUser({
          actType: '30002',
          courId: info.courId,
          traId: this.studyTraId,
          tarUserRecordStatus: info.recordStatus,
          traCourCount: this.traCourCount,
          userId: sessionStorage.getItem('userId')
        })
        .then(res => {
          window.open(this.studyBaseUrl + info.courFilePath)
          // 更新培训详情数据
          this.getDetail({ row: { traId: this.studyTraId } })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // ================================================================================================培训相关操作 ↑
    /**
     * 图像学习表格
     */
    initImgLeaningTable () {
      // TODO 图像学习表格
      reqTea
        .learnCount({
          pcUserId: sessionStorage.getItem('userId'),
          page: this.learnTableData.page.CurrentPage,
          size: this.learnTableData.page.pagesize
        })
        .then(res => {
          let tableData = res.data.result
          tableData.content.forEach(item => {
            item.userExamStartTime =
              this.$options.filters['formatDate'](
                item.userExamStartTime,
                this.$t('vicenter.common.formatDate')
              ) || '-'
            item.userExamEndTime =
              this.$options.filters['formatDate'](
                item.userExamEndTime,
                this.$t('vicenter.common.formatDate')
              ) || '-'
            item.userExamTime = item.userExamTime || '-'
          })
          this.learnTableData.data = tableData.content
          if (this.learnTableData.data.length > 0) {
            this.learnTableData.isPage = true
          }
          this.learnTableData.page.Allpage = tableData.totalElements
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 审图练习表格
     */
    initReviewTable () {
      // TODO 审图练习表格
      reqTea
        .reviewCount({
          pcUserId: sessionStorage.getItem('userId'),
          page: this.reviewTableData.page.CurrentPage,
          size: this.reviewTableData.page.pagesize
        })
        .then(res => {
          let tableData = res.data.result
          tableData.content.forEach(item => {
            item.userExamStartTime =
              this.$options.filters['formatDate'](
                item.userExamStartTime,
                this.$t('vicenter.common.formatDate')
              ) || '-'
            item.userExamEndTime =
              this.$options.filters['formatDate'](
                item.userExamEndTime,
                this.$t('vicenter.common.formatDate')
              ) || '-'
            item.userExamTime = item.userExamTime || '-'
            item.userExamCorrectPercentage =
              item.userExamCorrectPercentage + '%'
          })
          this.reviewTableData.data = tableData.content
          if (this.reviewTableData.data.length > 0) {
            this.reviewTableData.isPage = true
          }
          this.reviewTableData.page.Allpage = tableData.totalElements
          this.reviewTableData.data.forEach(item => {
            item.operation = this.operationRiv
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // ================================================================================================审图练习相关操作 ↓
    /**
     * @msg: 审图练习 操作
     * @name: miaohongbin
     * @return: void
     */
    getDetailRiv (scope) {
      console.log(scope)
      this.$initSearchIpt(this.resultTestList, scope.row)
      this.resultParams.userExamId = scope.row.userExamId
      Promise.all([this.practiceDate(scope.row.userExamId)]).then(result => {
        this.resultTestImg = result[0]
        this.resultModalData.flag = true
      })
    },
    // 获取题目集合
    practiceDate (userExamId) {
      let params = {}
      params.userExamId = userExamId
      params.pcUserId = sessionStorage.getItem('userId')
      return new Promise(resolve => {
        reqTea.practiceDate(params).then(res => {
          // console.log(res.data.result, '获取题目集合')
          if (res.data.flag) {
            let { record } = res.data.result
            record.forEach((item, index) => {
              item.serialNumber = index + 1
            })
            resolve(record)
          }
        })
      })
    },
    // ================================================================================================审图练习相关操作 ↑
    // ================================================================================================考试相关操作 ↓
    /**
     * 考试情况表格
     */
    initTestTable () {
      // TODO 考试情况表格
      reqTea
        .examinationCount({
          pcUserId: sessionStorage.getItem('userId'),
          page: this.examTableData.page.CurrentPage,
          size: this.examTableData.page.pagesize,
          flag: 0
        })
        .then(res => {
          let tableData = res.data.result
          tableData.content.forEach(item => {
            item.userExamStartTime =
              this.$options.filters['formatDate'](
                item.userExamStartTime,
                this.$t('vicenter.common.formatDate')
              ) || '-'
            item.userExamEndTime =
              this.$options.filters['formatDate'](
                item.userExamEndTime,
                this.$t('vicenter.common.formatDate')
              ) || '-'
            item.userExamTime = item.userExamTime || '-'
            item.userExamStatus = this.$t(
              `vicenter.training.common.examinationStatusList2.${item.userExamStatus}`
            )
            item.userExamPercent = item.userExamPercent + '%'
          })
          this.examTableData.data = tableData.content
          this.examTableData.data.forEach((item, index) => {
            // console.log(item)
            // 操作
            let operation = this.operationExa.map(c => ({ ...c }))
            if (item.examStatus === 1 || item.examStatus === 2) {
              operation[1].show = false
            } else if (item.examStatus === 4 || item.status === 4) {
              operation[2].show = false
            } else if (
              (item.examStatus === 0 && item.status !== 4) ||
              item.examStatus === 3
            ) {
              operation[1].show = false
              operation[2].show = false
            }
            item.operation = operation
            // table值格式化
            item.examStartTime = this.$options.filters['formatDate'](
              item.examStartTime,
              this.$t('vicenter.common.formatDate')
            )
            // exercise 组件 examEndTime 在英文状态下 无法被new Date 解析 所以新增一个字段
            item.examEndTimeForExercise = item.examEndTime
            item.examEndTime = this.$options.filters['formatDate'](
              item.examEndTime,
              this.$t('vicenter.common.formatDate')
            )
            item.examStatus = this.$t(
              `vicenter.training.common.examinationStatusList2.${item.examStatus}`
            )
          })
          if (this.examTableData.data.length > 0) {
            this.examTableData.isPage = true
          }
          this.examTableData.page.Allpage = tableData.totalElements
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 详情
    getDetailExa (scope) {
      console.log(scope.row, '当前row')
      this.$initSearchIpt(this.detailTestList, scope.row)
      let _time = ['examStartTime', 'examEndTime', 'examCreateTime']
      this.detailTestList.forEach(item => {
        if (_time.indexOf(item.ruleProp) !== -1) {
          let _t = item.models.split(' ')[0].split('.')
          if (_t[0].length === 2) {
            // 时间格式为英文格式
            item.models = this.timeToChina(item.models)
          }
          item.models = this.$options.filters['formatDate'](
            new Date(item.models).getTime(),
            this.$t('vicenter.common.formatDate')
          )
        }
      })
      this.testList = this.twoDimensionalArray(this.detailTestList, 2)
      this.detailModalDataExa.flag = true
    },
    timeToChina (e) {
      console.log(e)
      let _t = e.split(' ')
      let _date = _t[0]
        .split('.')
        .reverse()
        .join('-')
      return _date + ' ' + _t[1]
    },
    // 考试
    getExam (scope) {
      console.log(scope.row, '当前row')
      this.examParamsExa.examId = scope.row.examId
      // console.log(this.examParams)
      this.$initSearchIpt(this.examTestListExa, scope.row)
      this.generateTestData(scope)
    },
    // 开始考试
    generateTestData (scope) {
      console.log(scope)
      let params = {}
      params.examId = scope.row.examId
      params.pcUserId = sessionStorage.getItem('userId')
      this.openLoading()
      req.generateTestData(params).then(res => {
        console.log(res.data, '开始考试')
        if (res.data.flag) {
          if (res.data.result.error) {
            this.closeLoading()
            this.$NotifError(this.$t('vicenter.training.common.examIsOver'))
            // this.query()
          } else {
            // 考试已开考时间
            this.examParamsExa.examUseTime = res.data.result.consumeTime
            this.examParamsExa.examDuration =
              new Date(scope.row.examEndTimeForExercise).getTime() -
              res.data.result.date
            Promise.all([this.practiceDateExa(scope.row.examId)]).then(result => {
              this.closeLoading()
              this.examTestImgExa = result[0]
              this.examModalDataExa.flag = true
            })
          }
        } else {
          this.closeLoading()
        }
      })
    },
    // 获取题目集合
    practiceDateExa (examId) {
      let params = {}
      params.examId = examId
      params.pcUserId = sessionStorage.getItem('userId')
      return new Promise(resolve => {
        reqTea.practiceDate(params).then(res => {
          console.log(res.data.result, '获取题目集合')
          if (res.data.flag) {
            let { record } = res.data.result
            record.forEach((item, index) => {
              item.serialNumber = index + 1
            })
            resolve(record)
          }
        })
      })
    },
    // 考试窗口点击关闭
    examResetModal () {
      this.promptModalData.flag = true
    },
    // 我知道了
    closePromptModal () {
      this.promptModalData.flag = false
    },
    // 关闭考试弹出层
    closeExamModalData () {
      // this.query()
      this.examModalDataExa.flag = false
    },
    // 结果
    getResult (scope) {
      console.log(scope.row, '当前row')
      this.resultParamsExa.examId = scope.row.examId
      this.openLoading()
      Promise.all([
        this.getMyExamResult(scope.row),
        this.practiceDateExa(scope.row.examId)
      ])
        .then(result => {
          this.closeLoading()
          this.resultTestImgExa = result[1]
          this.resultModalDataExa.flag = true
        })
        .catch(() => {
          this.closeLoading()
        })
    },
    // 考试结果信息
    getMyExamResult (row) {
      let params = {}
      params.examId = row.examId
      params.pcUserId = sessionStorage.getItem('userId')
      return new Promise(resolve => {
        req.getMyExamResult(params).then(res => {
          console.log(res, '考试结果返回')
          if (res.data.flag) {
            let { userExamInfo } = res.data.result
            let obj = {}
            Object.assign(obj, userExamInfo[0], row)
            obj.userExamCorrectPercentage = obj.userExamCorrectPercentage + '%'
            obj.userExamStatus = this.$t(
              `vicenter.training.common.examinationStatusList.${obj.userExamStatus}`
            )
            // obj.userExamTime = Math.ceil(obj.userExamTime / 1000 / 60)
            this.$initSearchIpt(this.resultTestListExa, obj)
            resolve()
          }
        })
      })
    },
    // 转换成二维数组
    twoDimensionalArray (oldArr, num) {
      let newArr = []
      let arr = []
      oldArr.map((val, key) => {
        arr.push(val)
        if ((key + 1) % num === 0) {
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        } else if (oldArr.length < num && oldArr.length === arr.length) {
          // 当传入数据的长度小于td列数时，条件：二位数组的长度等于传入数据的长度
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        } else if (oldArr.length - 1 === key && arr.length < num) {
          // 当传入数据的长度除以td列数有余数时，条件：传入数据的长度-1等于遍历完成的key且二位数组的长度小于td列数
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        }
      })
      return newArr
    },
    // ================================================================================================考试相关操作 ↑
    initChartOne (chartId, xData, yData) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let _this = this
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b} <br/>{c}%'
        },
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          containLabel: true
        },
        color: ['#3aa1ff'],
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          },
          min: 0,
          max: 100
        },
        yAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            formatter: function (value) {
              return _this.$textFormat(value, 10)
            }
          }
        },
        series: [
          {
            type: 'bar',
            data: yData
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initChartTwo (chartId, data) {
      console.log(data)
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        legend: {
          data: [
            this.$t('vicenter.training.common.numberOfLearning'),
            this.$t('vicenter.training.common.learningProgress')
          ],
          itemHeight: 10,
          bottom: -5
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b0}</br>{a0}:{c0}</br>{a1}:{c1}%'
        },
        grid: {
          top: '3%',
          bottom: '10%',
          left: '5%',
          right: 0,
          containLabel: true
        },
        color: ['#4472c4', '#ed7d31'],
        xAxis: {
          type: 'category',
          data: data.one,
          axisLabel: {
            formatter: function (value, index) {
              let isEng = value.indexOf('-') === -1
              let date = value.split(' ')[0].split(isEng ? '.' : '-')
              return `${date[isEng ? 1 : 1]}-${date[isEng ? 0 : 2]}`
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            interval: 10
          },
          {
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: this.$t('vicenter.training.common.numberOfLearning'),
            type: 'bar',
            data: data.three
          },
          {
            name: this.$t('vicenter.training.common.learningProgress'),
            yAxisIndex: 1,
            type: 'line',
            data: data.two
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initChartThree (chartId, data) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        legend: {
          data: [
            this.$t('vicenter.training.common.correctNumber'),
            this.$t('vicenter.training.common.errorsNumber'),
            this.$t('vicenter.training.common.correctRate')
          ],
          type: 'scroll',
          itemHeight: 10,
          bottom: -5
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b0}</br>{a0}:{c0}</br>{a1}:{c1}</br>{a2}:{c2}%'
        },
        grid: {
          top: '3%',
          bottom: '10%',
          left: '5%',
          right: 0,
          containLabel: true
        },
        color: ['#4472c4', '#ed7d31', '#aeaeae'],
        xAxis: {
          type: 'category',
          data: data.one,
          axisLabel: {
            formatter: function (value, index) {
              let isEng = value.indexOf('-') === -1
              let date = value.split(' ')[0].split(isEng ? '.' : '-')
              return `${date[isEng ? 1 : 1]}-${date[isEng ? 0 : 2]}`
            }
          },
          interval: 0.1
        },
        yAxis: [
          {
            type: 'value',
            interval: 20
          },
          {
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: this.$t('vicenter.training.common.correctNumber'),
            type: 'bar',
            stack: 'statistics',
            data: data.two
          },
          {
            name: this.$t('vicenter.training.common.errorsNumber'),
            type: 'bar',
            stack: 'statistics',
            data: data.three
          },
          {
            name: this.$t('vicenter.training.common.correctRate'),
            type: 'line',
            yAxisIndex: 1,
            data: data.four
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initChartFour (chartId, data) {
      console.log(data)
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        legend: {
          data: [
            this.$t('vicenter.training.common.correctRate'),
            this.$t('vicenter.training.common.errorRate')
          ],
          itemHeight: 10,
          bottom: -5
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b0}</br>{a0}:{c0}%</br>{a1}:{c1}%'
        },
        grid: {
          top: '3%',
          bottom: '10%',
          left: '5%',
          right: 0,
          containLabel: true
        },
        color: ['#4472c4', '#ed7d31'],
        xAxis: {
          type: 'category',
          data: data.one,
          axisLabel: {
            formatter: function (value, index) {
              console.log('axisLabel -> formatter', value)
              return value.length > 6 ? value.substring(0, 6) + '...' : value
            }
          }
          // interval: 0.1
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: this.$t('vicenter.training.common.correctRate'),
            type: 'bar',
            stack: 'statistics',
            data: data.two
          },
          {
            name: this.$t('vicenter.training.common.errorRate'),
            type: 'bar',
            stack: 'statistics',
            data: data.three
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 培训表格 页数change
    handleSizeChangeCour (val) {
      this.trainTableData.page.pagesize = val
      this.getChartsCour(1)
    },
    // 培训表格 页码change
    handleCurrentChangeCour (val) {
      this.trainTableData.page.CurrentPage = val - 1
      this.getChartsCour(1)
    },
    // 图像学习表格 页数change
    handleSizeChangeImg (val) {
      this.learnTableData.page.pagesize = val
      this.initImgLeaningTable()
    },
    // 图像学习表格 页码change
    handleCurrentChangeImg (val) {
      this.learnTableData.page.CurrentPage = val - 1
      this.initImgLeaningTable()
    },
    // 审图练习表格 页数change
    handleSizeChangeReview (val) {
      this.reviewTableData.page.pagesize = val
      this.initReviewTable()
    },
    // 审图练习表格 页码change
    handleCurrentChangeReview (val) {
      this.reviewTableData.page.CurrentPage = val - 1
      this.initReviewTable()
    },
    // 审图练习表格 页数change
    handleSizeChangeTest (val) {
      this.examTableData.page.pagesize = val
      this.initTestTable()
    },
    // 审图练习表格 页码change
    handleCurrentChangeTest (val) {
      this.examTableData.page.CurrentPage = val - 1
      this.initTestTable()
    },
    // 管理员角色下点击折线图和柱状图，切换列表显示列及数据
    changeTable (flag) {},
    // 打开loading
    openLoading () {
      this.$initLoading()
    },
    // 关闭loading
    closeLoading () {
      this.$initLoading().close()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.loading = false
    clearInterval(this.timer)
    next()
  },
  components: {
    ComTable,
    breadCrumb,
    panelTitle,
    ComForm,
    Dialog,
    Video,
    Exercise
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';

.student-welcome {
  @extend .extend-bar;

  .student-welcome-M {
    padding: $margin;
    @include box-sizing;

    .statistic-container {
      .panel {
        @extend .extend-panel;
        margin-top: $margin;
      }

      .remind {
        background: #f7fafd;
        border-radius: 5px;
        line-height: 40px;
        width: calc(100% - 16px);
        margin: 0 auto;
        @include flex(row, space-between, center);

        .remind-left {
          @include flex(row, space-between, center);

          .remind-title {
            background: #ff0000;
            color: #fff;
            padding: 0 40px;
            border-radius: 5px 0 0 5px;
            position: relative;
            z-index: 10;

            &:after {
              content: '';
              display: inline-block;
              border-left: 15px solid #ff0000;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              height: 0;
              width: 0;
              position: absolute;
              top: 0;
              right: -15px;
              @include box-sizing();
              z-index: 2;
            }
          }

          .remind-note {
            margin-left: 25px;
          }
        }

        .remind-right {
          color: #169bd5;
          cursor: pointer;
          padding-right: 20px;
        }
      }

      .charts {
        @include flex(row, space-between, center);
        flex-wrap: wrap;

        .chartbox {
          width: calc(100% / 2 - 10px);
          margin: 10px 5px 0;
          background-color: #f7fafd;
          height: 320px;
          cursor: pointer;

          .chart-border {
            margin: 8px;
            padding: 0 10px;
            width: calc(100% - 16px);
            height: calc(100% - 16px);
            border: 1px solid #e9edf5;
            border-radius: 10px;
            @include box-sizing();
            background-color: $white;

            .chartTop {
              font-size: 14px;
              font-weight: bold;
              height: 40px;
              line-height: 40px;
              text-align: left;
              border-bottom: 1px solid #e9edf5;
              @include flex(row, space-between, center);
              @include box-sizing();

              .chartSelect {
                width: 110px;
              }
            }

            #ChartOne,
            #ChartTwo,
            #ChartThree,
            #ChartFour {
              width: $all;
              height: calc(100% - 40px);
              padding: $margin 0;
              @include box-sizing();

              canvas {
                width: $all !important;
              }
            }

            .chartNoData {
              width: $all;
              height: calc(100% - 40px);
              @include flex(row, center, center);
              color: #909399;
              font-size: 14px;
            }
          }
        }
      }

      @media screen and (min-width: 1640px) {
        .charts {
          @include flex(row, space-between, center);

          .chartbox {
            width: calc(100% / 4 - 10px);
            margin: 10px 5px 0;
            background-color: #f7fafd;
            height: 320px;
          }
        }
      }

      .list {
        width: $all;
        height: calc(100% - 420px);
        overflow: hidden;

        .el-table {
          td,
          th {
            padding: 10px 0;
          }
        }
      }

      @media screen and (min-height: 1000px) {
        .charts {
          .chartbox {
            height: 380px;
          }
        }
      }
    }
  }
}
.formDialog {
  .search-form {
    @include layout(2);
  }
  .search-form-btn .el-form-item__content {
    display: none;
  }
  .tableComp {
    padding: 0;
  }
}
.pdf-view .el-dialog {
  width: 100% !important;
  margin: 0 !important;
  height: 100vh;
  .el-dialog__body {
    height: calc(100% - 54px);
    box-sizing: border-box;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
.exercise-top-left-table{
        @include tableBorder($all, separate, 1px, #d7d7d7);
        &>tr{
          &>td{
            width: 50%;
            padding: 0;
            height: 0;
            .exercise-top-left-table-table{
              width: $all;
              height: $all;
              tr{
                td{
                  line-height: 32px;
                  &:first-child{
                    width: 35%;
                    padding: 10px 0;
                    background: #f2f2f2;
                    border-right: 1px solid #d7d7d7;
                  }
                  &:last-child{
                    width: 60%;
                    text-align: left;
                    padding: 0 5%;
                    background: #ffffff;
                    word-break: break-word;
                  }
                }
              }
            }
          }
        }
      }
</style>
