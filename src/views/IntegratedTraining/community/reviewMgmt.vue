<template>
  <div class='review-management-bar' v-bar>
    <div class="review-management-M">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread"/>
      </div>
      <div class="review-list">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
          <el-tab-pane :label="$t('vicenter.IntegratedTraining.community.allReview')" name="allReview">
            <ComTable :tableData='allReviewData' :tableGroup='allReviewGroup'></ComTable>
          </el-tab-pane>
          <el-tab-pane :label="$t('vicenter.IntegratedTraining.community.reviewed')" name="reviewed">
            <ComTable :tableData='reviewedData' :tableGroup='allReviewGroup'></ComTable>
          </el-tab-pane>
          <el-tab-pane :label="$t('vicenter.IntegratedTraining.community.noReview')" name="noReview">
            <ComTable :tableData='noReviewData' :tableGroup='allReviewGroup'></ComTable>
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
  name: 'reviewMgmt',
  data () {
    return {
      activeName: 'allReview',
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/IntegratedTraining/index' // 跳转路径
          }, {
            label: this.$t(this.$route.name)
          }
        ]
      },
      allReviewData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        refName: 'allReviewTable',
        sortMethod: '',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        }
      },
      allReviewGroup: [
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
          label: this.$t('vicenter.IntegratedTraining.community.reviewer'),
          type: 'text',
          model: 'reviewer'
        }, {
          label: this.$t('vicenter.IntegratedTraining.community.reviewTime'),
          type: 'text',
          model: 'reviewTime'
        }, {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation'
        }
      ],
      reviewedData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        refName: 'reviewedTable',
        sortMethod: '',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        }
      },
      noReviewData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        refName: 'noReviewTable',
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
    }
  },
  components: {breadCrumb, ComForm, ComTable, panelTitle}
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.review-management-bar {
  @extend .extend-bar;
    .review-management-M {
      padding: $margin;
      @include box-sizing;
      .review-list {
        padding-top: $margin;
      }
    }
}
</style>
