<template>
  <div class='training-community-bar' v-bar>
    <div class="training-community-M">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread"/>
      </div>
      <div class="search-panel">
        <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
        <ComForm :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
      </div>
      <div class="answer-list">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
          <el-tab-pane :label="$t('vicenter.IntegratedTraining.community.allAnswers')" name="allAnswers">
            <ComTable :tableData='allAnswerData' :tableGroup='allAnswerGroup'></ComTable>
          </el-tab-pane>
          <el-tab-pane :label="$t('vicenter.IntegratedTraining.community.answered')" name="answered">
            <ComTable :tableData='answeredData' :tableGroup='allAnswerGroup'></ComTable>
          </el-tab-pane>
          <el-tab-pane :label="$t('vicenter.IntegratedTraining.community.noAnswer')" name="noAnswer">
            <ComTable :tableData='noAnswerData' :tableGroup='allAnswerGroup'></ComTable>
          </el-tab-pane>
          <el-tab-pane :label="$t('vicenter.IntegratedTraining.community.myQuestion')" name="myQuestion">
            <ComTable :tableData='myQuestionData' :tableGroup='myQuestionGroup'></ComTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
import panelTitle from '@/components/title'
export default {
  name: 'community',
  data () {
    return {
      activeName: 'allAnswers',
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/IntegratedTraining/index' // 跳转路径
          }
        ]
      },
      panelTitle: { // title组件数据
        listTitle: {
          title: this.$t('vicenter.IntegratedTraining.community.query')
        }
      },
      inputItem: [
        {
          type: 'iconText',
          models: '',
          disabled: false,
          ruleProp: 'searchText',
          icon: 'iconfont icon-chaxun',
          iconFunc: () => {}
        }
      ],
      queryFn: {
        query: this.askNow,
        close: this.goReview,
        queryText: this.$t('vicenter.IntegratedTraining.community.askNow'),
        resetText: this.$t('vicenter.IntegratedTraining.community.reviewMgm')
      },
      formRule: {
        refName: 'queryForm',
        rule: {},
        model: {
          searchText: ''
        }
      },
      allAnswerData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        refName: 'allAnswerTable',
        sortMethod: '',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        }
      },
      allAnswerGroup: [
        {
          label: this.$t('vicenter.IntegratedTraining.community.topicName'),
          type: 'text',
          model: 'topicName'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.ownSection'),
          type: 'text',
          model: 'ownSection'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.topicCreator'),
          type: 'text',
          model: 'topicCreator'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.createTime'),
          type: 'text',
          model: 'createTime'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.latestRespondent'),
          type: 'text',
          model: 'latestRespondent'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.latestReplyTime'),
          type: 'text',
          model: 'latestReplyTime'
        }
      ],
      myQuestionData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        refName: 'questionTable',
        sortMethod: '',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        }
      },
      myQuestionGroup: [
        {
          label: this.$t('vicenter.IntegratedTraining.community.topicName'),
          type: 'text',
          model: 'topicName'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.ownSection'),
          type: 'text',
          model: 'ownSection'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.reviewStatus'),
          type: 'text',
          model: 'reviewStatus'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.topicCreator'),
          type: 'text',
          model: 'topicCreator'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.createTime'),
          type: 'text',
          model: 'createTime'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.latestRespondent'),
          type: 'text',
          model: 'latestRespondent'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.latestReplyTime'),
          type: 'text',
          model: 'latestReplyTime'
        }
      ],
      answeredData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        refName: 'answeredTable',
        sortMethod: '',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        }
      },
      noAnswerData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        refName: 'noAnswerTable',
        sortMethod: '',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        }
      }
    }
  },
  created () {},
  methods: {
    handleSizeChange (value) { // 修改一页显示多少
      // this.$handleSizeChange(value, this.tableData.searchData, this.getList)
    },
    handleCurrentChange (value) { // 翻页
      // this.$handleCurrentChange(value, this.tableData.searchData, this.getList)
    },
    tabClick (tab, event) {
      console.log(tab, event)
    },
    askNow () {
      this.$router.push({ path: '/IntegratedTraining/askNow' })
    },
    goReview () {
      this.$router.push({ path: '/IntegratedTraining/reviewMgmt' })
    }
  },
  components: {breadCrumb, ComForm, ComTable, panelTitle}
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.training-community-bar {
  @extend .extend-bar;
  .training-community-M {
    padding:$margin;
    @include box-sizing;
    .breadCrumb {
    }
    .search-panel {
      width: $all;
      .search-form {
        display: flex;
        align-items: flex-end;
        .search-form-item {
          margin-right: 30px;
          width: 400px;
          position: relative;
          margin-bottom: 0;
        }
        .search-form-btn{
          margin-bottom: 0;
          .el-form-item__content {
            display: flex;
            align-items: flex-start;
          }
        }
      }
    }
    .answer-list {
      padding-top: $margin;
    }
  }
}
</style>
