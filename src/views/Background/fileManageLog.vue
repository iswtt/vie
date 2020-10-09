<template>
  <div id='background-fileManageLog-bar' v-bar>
    <div class="background-fileManageLog-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="formIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
         <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='exportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/background/fileManage.js' // 接口文件
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
export default {
  name: 'fileManageLog',
  data () {
    return {
      exportButton: false,
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Background/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      formRule: { // 查询表单规则
        model: {
          operaTime: []
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formIpt: [ // 查询表单初始化
        {
          // 归档日期
          getLabel: this.$t('vicenter.Background.fileManage.operaTime'),
          startPlace: this.$t('vicenter.common.startTime'),
          endPlace: this.$t('vicenter.common.endTime'),
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          editable: false,
          ruleProp: 'operaTime'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        }
      },
      tableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          // 执行开始时间
          label: this.$t('vicenter.Background.fileManage.operaStartTime'),
          type: 'text',
          model: 'operaStartTime'
        },
        {
          // 执行结束时间
          label: this.$t('vicenter.Background.fileManage.operaEndTime'),
          model: 'operaEndTime',
          type: 'text'
        },
        {
          // 归档任务最早时间
          label: this.$t('vicenter.Background.fileManage.arcEndTime'),
          type: 'text',
          model: 'arcStartTime'
        },
        {
          // 归档任务数量
          label: this.$t('vicenter.Background.fileManage.quantity'),
          type: 'text',
          model: 'quantity'
        }
      ]
    }
  },
  created () {
    this.exportButton = this.$getSystemConfig('exportEnable')
  },
  mounted () {
    this.query()
  },
  methods: {
    query (isPage = true) { // 用于form表单查询方法
      let params = this.setParams()
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      ajax.getLogList(params).then((res) => {
        if (res.data.flag) {
          this.tableData.isPage = false
          this.tableData.page = {
            pageGroup: [10, 20, 50, 100], // 分页数据
            CurrentPage: res.data.result.pageable.pageNumber, // 当前页码
            pagesize: res.data.result.pageable.pageSize, // 当前分页条数
            Allpage: res.data.result.totalElements, // 总数据
            handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.handleCurrentChange // 当前页码改变触发改函数
          }
          this.tableData.data = res.data.result.content
          this.tableData.data.forEach(e => {
            e.operaStartTime = this.$options.filters['formatDate'](e.operaStartTime, this.$t('vicenter.common.formatDate'))
            e.operaEndTime = this.$options.filters['formatDate'](e.operaEndTime, this.$t('vicenter.common.formatDate'))
            e.arcStartTime = this.$options.filters['formatDate'](e.arcStartTime, this.$t('vicenter.common.formatDate'))
          })
          this.formRule.model.page = res.data.result.pageable.pageNumber
          this.formRule.model.size = res.data.result.pageable.pageSize
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    exportExcel () {
      const {lang} = this.$store.state
      let model = this.setParams()
      let params = {
        lang: lang,
        model: model,
        sysMenu: '',
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/management/arcopera/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    setParams () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.operaTime
      let times = {}
      if (this.formRule.model.operaTime !== null || this.formRule.model.operaTime.length > 0) {
        times = {
          operaStartTime: this.formRule.model.operaTime[0],
          operaEndTime: this.formRule.model.operaTime[1]
        }
      }
      params = Object.assign({}, params, times)
      return params
    },
    handleSizeChange (val) { // 表格分页
      this.$set(this.tableData.page, 'pagesize', val)
      this.query(false)
    },
    handleCurrentChange (val) { // 表格分页
      this.$set(this.tableData.page, 'CurrentPage', val - 1)
      this.query(false)
    },
    getSort () {
      console.log(this.formRule)
    }
  },
  components: {bread, ComForm, panelTitle, ComTable}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#background-fileManageLog-bar {
  @extend .extend-bar;
  .background-fileManageLog-M {
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
          @include layout(2);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
      }
    }
  }
}
</style>
