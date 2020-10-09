<template>
   <div class='text-detail-bar' v-bar>
     <div class="up-down-container">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="up-down-infolist">
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
              <div>
                <el-button type="primary" size="mini" @click='getBack()'>{{$t('vicenter.common.back')}}</el-button>
              </div>
            </panelTitle>
            <div class="list">
               <p class="group" v-for='(item,key) in groupList' :key='key'>
                 <span class="list-title">{{item.label}}：</span>
                 <span class="list-info">{{item.value}}</span>
               </p>
               <div class="group">
                 <span class="list-title">{{$t('vicenter.tip.testStatisticsDetail.score')}}:</span>
                 <ComTable :tableData='scoreTable.tabledata' :tableGroup='scoreTable.group'></ComTable>
               </div>
            </div>
          </div>
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
            <div class="img-box">
              <img id='standardImg' :src="standardImg" @click="clickImg('standardImg')"/>
            </div>
          </div>
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.ImgTitle"></panelTitle>
            <div class="img-box">
              <img id = 'examineImg' :src="examineImg" @click="clickImg('examineImg')"/>
            </div>
          </div>
        </div>
     </div>
   </div>
</template>

<script>
import breadCrumb from '../../components/breadCrumb'
import panelTitle from '../../components/title'
import ComTable from '@/components/table'
import ajax from '../../api/tip/Assessment.js'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'demo',
  data () {
    return {
      scoreTable: {
        tabledata: {
          data: [],
          sortMethod: '',
          MaxHeight: 200
        },
        group: [
          {
            label: this.$t('vicenter.common.No'),
            type: 'text',
            model: 'imageSequence'
          },
          {
            label: this.$t('vicenter.tip.testStatisticsDetail.score'),
            type: 'text',
            model: 'score'
          }
        ]
      },
      groupList: [
        {
          label: this.$t('vicenter.tip.examinationQuery.rapporteur'),
          value: '',
          prop: 'examineeAccount'
        },
        {
          label: this.$t('vicenter.tip.testStatisticsDetail.degreeDifficulty'),
          value: '',
          prop: 'difficulty'
        },
        {
          label: this.$t('vicenter.tip.testStatisticsDetail.answerTime'),
          value: '',
          prop: 'startTime'
        },
        {
          label: this.$t('vicenter.tip.testStatisticsDetail.answerTimeLong'),
          value: '',
          prop: 'examDuration'
        },
        {
          label: this.$t('vicenter.tip.testStatisticsDetail.drawingConclusion'),
          value: '',
          prop: 'conclusion'
        }
        // {
        //   label: this.$t('vicenter.tip.testStatisticsDetail.score'),
        //   value: '',
        //   prop: 'score'
        // }
      ],
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
      panelTitle: { // title组件数据
        queryTitle: {
          title: this.$t('vicenter.tip.testStatisticsDetail.assessmentDetails')
        },
        listTitle: {
          title: this.$t('vicenter.tip.testStatisticsDetail.suspectMark')
        },
        ImgTitle: {
          title: this.$t('vicenter.tip.testStatisticsDetail.mapLocationOfSuspect')
        }
      },
      id: '',
      standardImg: '',
      examineImg: ''
    }
  },
  mounted () {
    let {id} = JSON.parse(sessionStorage.details)
    this.id = id
    this.getDetail()
  },
  methods: {
    clickImg (id) {
      var viewer = new Viewer(document.getElementById(id))
      this.$nextTick().then(() => {
        viewer.update()
      })
      viewer.view(0)
    },
    getBack () {
      this.$router.push({ path: '/Tip/Examination-Query' })
    },
    getDetail () {
      ajax.queryResultExam({id: this.id}).then(res => {
        if (res.data.flag) {
          for (var i in this.groupList) {
            let prop = this.groupList[i].prop
            if (prop === 'startTime') {
              this.groupList[i].value = this.$options.filters['formatDate'](res.data.result[prop])
            } else if (prop === 'difficulty') {
              this.groupList[i].value = this.$options.filters['difficulty'](res.data.result[prop])
            } else if (prop === 'conclusion') {
              this.groupList[i].value = this.$options.filters['conclusion'](res.data.result[prop])
            } else {
              this.groupList[i].value = res.data.result[prop]
            }
          }
          this.examineImg = res.data.result.answer
          this.standardImg = res.data.result.standardAnswer
          this.scoreTable.tabledata.data = res.data.result.resultImages
        }
      })
    }
  },
  components: {breadCrumb, panelTitle, ComTable}
}
</script>

<style lang="scss">
@import "../../styles/index.scss";
.text-detail-bar {
  @extend .extend-bar;
  .list {
    width: $all;
    margin: $margin;
    @include flex(row, flex-start, flex-start);
    flex-wrap: wrap;
    .group {
      padding: 0 $margin;
      @include box-sizing();
      @include flex(column, flex-start, flex-start);
      width: $all/5;
      text-align: left;
      line-height: 40px;
      font-size: $texts;
      .list-title {
        font-weight: bold;
        font-size: $smallTitle;
      }
    }
  }
  .img-box {
    width: $all;
    height: 300px;
    img {
      height: 100%;
      display: unset;
      cursor: pointer;
    }
  }
}
</style>
