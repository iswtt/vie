<template>
   <div class='setting-detail-bar' v-bar>
     <div class="up-down-container">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="up-down-infolist">
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
              <div>
                <el-button type="primary" size="mini" @click='getBack()' data-id="back-btn">{{$t('vicenter.common.back')}}</el-button>
              </div>
            </panelTitle>
            <div class="list">
               <p class="group" v-for='(item,key) in groupList' :key='key'>
                 <span class="list-title">{{item.label}}：</span>
                 <span class="list-info" :title="item.value" :data-id="'item' + key + '-span'">{{item.value}}</span>
               </p>
            </div>
          </div>
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
            <ComTable :tableData='tableData' :tableGroup='tableGroup'></ComTable>
          </div>
        </div>
     </div>
   </div>
</template>

<script>
import breadCrumb from '../../components/breadCrumb'
import panelTitle from '../../components/title'
import ComTable from '../../components/table'
import ajax from '../../api/tip/Assessment.js'
export default {
  name: 'demo',
  data () {
    return {
      id: '',
      groupList: [],
      tableLoading: true,
      CurrentChageFlag: false, // 分页切换标志位
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
          title: this.$t('vicenter.tip.setingDdetail.assessmentInformation')
        },
        listTitle: {
          title: this.$t('vicenter.tip.setingDdetail.draftsmanInformation')
        }
      },
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'settingTable',
        sortMethod: this.getSortTable, // 新增排序方法
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        },
        searchData: {
          page: 0,
          size: 10
        }
      },
      tableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.tip.setingDdetail.rapporteur'),
          type: 'text',
          model: 'examineeAccount'
        },
        {
          label: this.$t('vicenter.tip.setingDdetail.lastAssessmentTime'),
          type: 'text',
          model: 'lastTestTime'
        },
        {
          label: this.$t('vicenter.tip.setingDdetail.assessedQty'),
          type: 'text',
          model: 'amount'
        },
        {
          label: this.$t('vicenter.tip.setingDdetail.LastAppliedQuestion'),
          type: 'text',
          model: 'lastApplyTime'
        },
        {
          label: this.$t('vicenter.tip.setingDdetail.assessmentState'),
          type: 'showTooltip',
          model: 'status'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          width: '150px',
          model: 'operation',
          fixed: 'right'
        }
      ]
    }
  },
  created () {
    let {id} = JSON.parse(sessionStorage.details)
    this.id = id
    this.getDetail()
    this.getExaminneList()
  },
  methods: {
    getDetail () {
      ajax.queryExam({id: this.id}).then(res => {
        if (res.data.flag) {
          let {name, frequency, startTime, endTime, createTime, frequencyType, difficulty, status, lastEditor, lastEditTime, imageQty, imageCategories} = res.data.result
          startTime = this.$options.filters['formatDate'](startTime)
          endTime = this.$options.filters['formatDate'](endTime)
          createTime = this.$options.filters['formatDate'](createTime)
          frequency = this.$options.filters['frequency'](frequency, frequencyType)
          difficulty = this.$options.filters['difficulty'](difficulty)
          let formatStatus = this.$options.filters['status'](status)
          lastEditTime = this.$options.filters['formatDate'](lastEditTime)
          let imageCategoryArr = []
          if (imageCategories !== null && imageCategories !== '') {
            imageCategoryArr = imageCategories.split(',')
            imageCategoryArr.forEach((e, index) => {
              imageCategoryArr[index] = this.$t('vicenter.DIC.T_TIP_IMAGE_CATEGORY.C_' + e)
            })
          }
          this.groupList = [{
            label: this.$t('vicenter.tip.setingDdetail.examName'),
            value: name
          },
          {
            label: this.$t('vicenter.tip.setingDdetail.testDate'),
            value: startTime + '~' + endTime
          },
          {
            label: this.$t('vicenter.tip.setingDdetail.examinationFrequency'),
            value: frequency
          },
          {
            label: this.$t('vicenter.tip.setingDdetail.degreeDifficulty'),
            value: difficulty
          },
          {
            label: this.$t('vicenter.tip.setingDdetail.assessmentState'),
            value: formatStatus
          },
          {
            label: this.$t('vicenter.tip.common.imageQty'),
            value: imageQty
          },
          {
            label: this.$t('vicenter.tip.imageManagement.imageCategory'),
            value: imageCategoryArr.join(',')
          },
          {
            label: this.$t('vicenter.tip.assessmentSettings.createTime'),
            value: createTime
          }]
          if (status === '3') { // 状态为强制停止，页面显示停止人和停止时间
            this.groupList.push(
              {
                label: this.$t('vicenter.tip.assessmentSettings.stopPerson'),
                value: lastEditor
              },
              {
                label: this.$t('vicenter.tip.assessmentSettings.stopTime'),
                value: lastEditTime
              }
            )
          }
        }
      })
    },
    getExaminneList () {
      ajax.queryexamineelist({examParamId: this.id}).then(res => {
        this.tableData.data = []
        if (res.data.flag) {
          this.tableData.isPage = false
          this.tableData.data = res.data.result.content
          this.tableData.data.forEach(e => {
            e.lastTestTime = this.$options.filters['formatDate'](e.lastTestTime)
            e.lastApplyTime = this.$options.filters['formatDate'](e.lastApplyTime)
            e.operateTime = this.$options.filters['formatDate'](e.operateTime)
            if (e.status === '0' || e.status === '1') { // 考核状态为未开始和考核中，显示停止按钮
              e.operation = [ // 表格操作
                {
                  func: this.getStop,
                  label: `<span class='iconfont editTable'>&#xe704;</span>`,
                  title: this.$t('vicenter.tip.setingDdetail.stopIt'),
                  show: true
                }
              ]
            }
            if (e.status === '3') { // 强制停止，需要显示停止人和停止时间
              e.status = {
                label: `<span>${this.$options.filters['status'](e.status)}</span>`,
                title: this.$t('vicenter.tip.assessmentSettings.stopPerson') + ' ' + e.operatorAccount + ' ' + this.$t('vicenter.tip.assessmentSettings.stopTime') + ' ' + e.operateTime,
                show: true
              }
            } else {
              e.status = {
                label: `<span>${this.$options.filters['status'](e.status)}</span>`,
                show: false
              }
            }
          })
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
            this.$page(this.tableData.page, res.data.result)
          }
        }
      })
    },
    query () { // 表单查询方法
      console.log('this.$data.formRule.model', this.$data.formRule.model)
    },
    getSortTable ({column, prop, order}) { // 表格排序
      console.log(column, prop, order)
    },
    getBack () {
      this.$router.push({ path: '/Tip/Assessment-settings' })
    },
    getStop (scope) { // 停止
      this.$ConfirmBox(this.$t('vicenter.tip.setingDdetail.sureStop'), () => {
        ajax.stopexaminee({id: scope.row.id}).then(res => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.tip.setingDdetail.stopSuccess'))
            this.getExaminneList(this.id)
          } else {
            this.$NotifPrompt(res.data.message)
          }
        })
      })
    },
    handleSizeChange (value) { // 修改一页显示多少
      this.$handleSizeChange(value, this.tableData.searchData, this.getExaminneList)
    },
    handleCurrentChange (value) { // 翻页
      this.$handleCurrentChange(value, this.tableData.searchData, this.getExaminneList)
    }
  },
  components: { breadCrumb, panelTitle, ComTable }
}
</script>

<style lang="scss">
@import "../../styles/index.scss";
.setting-detail-bar {
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
      width: $all/4;
      text-align: left;
      line-height: 40px;
      font-size: $texts;
      .list-title {
        font-weight: bold;
        font-size: $smallTitle;
      }
      .list-info {
        width: 100%;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
      }
    }
  }
}
</style>
