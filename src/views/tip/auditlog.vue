<template>
  <div class='tip-auditlog-bar' v-bar>
    <div class="tip-auditlog-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="formIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComTable :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <div class="modal-dialog">
        <el-dialog :title="$t('vicenter.Background.auditLog.log.logInfo')" :visible.sync="detailDia.flag" class='detailLog' :show-close='falseflag' :close-on-click-modal='falseflag' :close-on-press-escape='falseflag'>
          <ComTable :tableData="DetailTableData" :tableGroup="DetailTableGroup" ></ComTable>
          <div slot="footer" class="dialog-footer">
            <el-button @click="detailDia.flag = false" size="mini" data-id="close-btn">{{$t('vicenter.common.close')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/tip/log.js' // 接口文件
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
export default {
  name: 'audit-log',
  data () {
    return {
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      falseflag: false,
      detailDia: {
        flag: false,
        id: '',
        pageflag: false
      },
      DetailTableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'auditLogDetailTable',
        sortMethod: this.getSort
      },
      DetailTableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.operationTime'),
          type: 'text',
          model: 'operationTime'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.fieldName'),
          type: 'text',
          model: 'fieldName'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.oldValue'),
          type: 'text',
          model: 'oldValue'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.newValue'),
          type: 'text',
          model: 'newValue'
        }
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
      formRule: { // 查询表单规则
        model: {
          operationTime: [],
          clientIp: '',
          operateAccount: '',
          operateObject: '',
          action: '',
          result: ''
        },
        refName: 'auditLogForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formIpt: [ // 查询表单初始化
        {
          getLabel: this.$t('vicenter.Background.auditLog.log.operationTime'),
          type: 'datetimerange',
          startPlace: this.$t('vicenter.common.startTime'),
          endPlace: this.$t('vicenter.common.endTime'),
          models: [],
          valueFormat: 'timestamp',
          // format: this.$t('vicenter.common.pickerFmt'),
          ruleProp: 'operationTime',
          editable: false,
          pickerOptions: {
            // disabledDate: (time) => {
            //   return time.getTime() > Date.now()
            // }
          },
          blur: this.blur,
          focus: this.focus
        },
        {
          getLabel: this.$t('vicenter.Background.auditLog.log.clientIp'),
          type: 'text',
          isFilterSpecialChar: true, // 过滤特殊字符
          filterRule: 'onlyDP', // 过滤特殊字符规则（只允许数字和点）
          placeHolder: this.$t('vicenter.Background.auditLog.log.clientIpPlace'),
          models: '',
          ruleProp: 'clientIp'
        },
        {
          getLabel: this.$t('vicenter.Background.auditLog.log.operateAccount'),
          type: 'text',
          isFilterSpecialChar: true, // 过滤特殊字符
          filterRule: 'onlyDL', // 过滤特殊字符规则（只允许数字和字母）
          placeHolder: this.$t('vicenter.Background.auditLog.log.operateAccountPlace'),
          models: '',
          ruleProp: 'operateAccount'
        },
        {
          getLabel: this.$t('vicenter.Background.auditLog.log.operateObject'),
          type: 'select',
          placeHolder: this.$t('vicenter.Background.auditLog.log.selectOperateObject'),
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'operateObject'
        },
        {
          getLabel: this.$t('vicenter.Background.auditLog.log.action'),
          type: 'select',
          placeHolder: this.$t('vicenter.Background.auditLog.log.selectAction'),
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'action'
        },
        {
          getLabel: this.$t('vicenter.Background.auditLog.log.result'),
          type: 'select',
          placeHolder: this.$t('vicenter.Background.auditLog.log.resultPlace'),
          clearable: true,
          models: '',
          option: [
            {
              value: 'SUCCESS',
              label: this.$t('vicenter.Background.auditLog.op.success')
            },
            {
              value: 'FAILURE',
              label: this.$t('vicenter.Background.auditLog.op.failure')
            }
          ],
          ruleProp: 'result'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'auditLogTable',
        sortMethod: this.getSort
      },
      tableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.operationTime'),
          type: 'text',
          model: 'operationTime'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.clientIp'),
          type: 'text',
          model: 'clientIp'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.operateAccount'),
          type: 'text',
          model: 'operateAccount'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.operateObject'),
          type: 'text',
          model: 'operateObject'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.action'),
          type: 'text',
          model: 'action'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.result'),
          type: 'locale',
          model: 'result'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.reasonCode'),
          type: 'text',
          model: 'reasonCode'
        },
        {
          label: this.$t('vicenter.Background.auditLog.log.operateContent'),
          type: 'text',
          model: 'operateContent'
        }
        // {
        //   label: this.$t('vicenter.common.operation'),
        //   type: 'operation',
        //   model: 'operation'
        // }
      ],
      operation: [
        {
          func: this.getDetail,
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          title: this.$t('vicenter.common.detail'),
          show: true
        }
      ]
    }
  },
  created () {
    let params = {
      appCode: 'TIP'
    }
    // 获取操作对象下拉框数据
    this.getOperateObjectData(params)
    // 获取操作类别下拉框数据
    this.getOperateTypeData(params)
  },
  mounted () {
    this.getTable('')
  },
  methods: {
    getOperateObjectData (params) {
      ajax.getOperateObject(params).then((res) => {
        if (res.data.flag) {
          this.formIpt.forEach(item => {
            if (item.ruleProp === 'operateObject') {
              item.option = []
              res.data.result.forEach(e => {
                item.option.push({
                  label: this.$t(e),
                  value: e
                })
              })
            }
          })
        }
      }).catch(() => {})
    },
    getOperateTypeData (params) {
      ajax.getOperateType(params).then((res) => {
        if (res.data.flag) {
          this.formIpt.forEach(item => {
            if (item.ruleProp === 'action') {
              item.option = []
              res.data.result.forEach(e => {
                item.option.push({
                  label: this.$t(e),
                  value: e
                })
              })
            }
          })
        }
      }).catch(() => {})
    },
    focus () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      if (picker) {
        picker.addEventListener('click', function () {
          for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
            picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
          }
        })
      }
    },
    blur () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      picker.addEventListener('click', function () {
        for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
          picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
        }
      })
    },
    getTable (val) {
      this.tableData.data = []
      this.tableData.isPage = false
      ajax.AduitLog(val).then((res) => {
        if (res.data.flag) {
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
            if (e.operationTime) {
              e.operationTime = this.$options.filters['formatDate'](e.operationTime, this.$t('vicenter.common.formatDate'))
            }
            // var reg = /^[IWE]{1}[0-9]{6}$/
            // if (reg.test(e.reasonCode)) {
            //   e.reasonCode = this.$t('vicenter.Background.auditLog.ajax.' + e.reasonCode)
            // }
            if (e.reasonCode) {
              e.reasonCode = this.$t('vicenter.error.' + e.reasonCode)
            }
            if (e.operateObject) {
              e.operateObject = this.$t(e.operateObject)
            }
            // if (e.action.indexOf('action.add') !== -1 || e.action.indexOf('action.update') !== -1 || e.action.indexOf('action.submit') !== -1) {
            //   e.operation = this.operation
            // }
            if (e.action) {
              e.action = this.$t(e.action)
            }
            if (e.result) {
              e.result = this.$t('vicenter.Background.auditLog.op.' + e.result.toLowerCase())
            }
          })
          this.formRule.model.page = res.data.result.pageable.pageNumber
          this.formRule.model.size = res.data.result.pageable.pageSize
          this.formRule.model.flag = false // 防止分页事件冲突
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    handleSizeChange (val) { // 页码跳转
      this.formRule.model.size = val
      this.formRule.model.page = 0
      this.formRule.model.flag = true
      this.$set(this.tableData.page, 'pagesize', val)
      this.SetpageQuery(0)
    },
    handleCurrentChange (val) { // 页码跳转
      if (!this.formRule.model.flag) {
        this.formRule.model.page = val - 1
      }
      this.SetpageQuery(this.formRule.model.page)
    },
    SetpageQuery (page) { // 查询设置页码
      console.log()
      var times = {}
      if (this.formRule.model.operationTime === null || this.formRule.model.operationTime.length === 0) {
        times = {}
      } else {
        times = {
          operationTimeStart: this.formRule.model.operationTime[0],
          operationTimeEnd: this.formRule.model.operationTime[1]
        }
      }
      var value = {
        operateAccount: this.formRule.model.operateAccount,
        operateObject: this.formRule.model.operateObject,
        action: this.formRule.model.action,
        result: this.formRule.model.result,
        page: page,
        clientIp: this.formRule.model.clientIp,
        size: this.tableData.page.pagesize
      }
      var val = Object.assign({}, value, times)
      this.getTable(val)
    },
    query () { // 总体查询
      this.SetpageQuery(0)
    },
    getDetail (scope) {
      this.getdetailFunction({auditLogId: scope.row.id})
    },
    getdetailFunction (val) {
      ajax.auditDetail(val).then((res) => {
        if (res.data.flag) {
          this.DetailTableData.isPage = false
          this.DetailTableData.page = {
            pageGroup: [10, 20, 50, 100], // 分页数据
            CurrentPage: res.data.result.pageable.pageNumber, // 当前页码
            pagesize: res.data.result.pageable.pageSize, // 当前分页条数
            Allpage: res.data.result.totalElements, // 总数据
            handleSizeChange: this.DetailSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.DetailCurrentChange // 当前页码改变触发改函数
          }
          this.DetailTableData.data = res.data.result.content
          this.DetailTableData.data.forEach(e => {
            e.operationTime = this.$options.filters['formatDate'](e.operationTime, this.$t('vicenter.common.formatDate'))
          })
          this.detailDia.page = res.data.result.pageable.pageNumber
          this.detailDia.size = res.data.result.pageable.pageSize
          this.detailDia.id = val.auditLogId
          this.detailDia.pageflag = false // 防止分页事件冲突
          if (this.DetailTableData.data.length > 0) {
            this.DetailTableData.isPage = true
          }
          this.detailDia.flag = true
        }
      }).catch(() => {})
    },
    DetailSizeChange (val) { // 详情页码跳转
      this.detailDia.size = val
      this.detailDia.page = 0
      this.detailDia.pageflag = true
      const values = {
        auditLogId: this.detailDia.id,
        size: this.detailDia.size,
        page: this.detailDia.page
      }
      this.getdetailFunction(values)
    },
    DetailCurrentChange (val) { // 详情页码跳转
      if (!this.detailDia.pageflag) {
        this.detailDia.page = val - 1
      }
      const values = {
        auditLogId: this.detailDia.id,
        size: this.detailDia.size,
        page: this.detailDia.page
      }
      this.getdetailFunction(values)
    },
    getSort () {
      console.log(this.formRule)
    }
  },
  components: { bread, ComForm, panelTitle, ComTable }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.tip-auditlog-bar {
  @extend .extend-bar;
  .tip-auditlog-M {
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
    .modal-dialog {
      .search-form {
        @include layout(3);
        justify-content: flex-start!important;
        .search-form-btn .el-form-item__content {
          display: none;
        }
      }
      .resultbutton {
        padding-top: 5px;
        text-align: right;
      }
      .review{
        width: $all;
        text-align: left;
        .uploadBox{
          width: $all;
          height: 150px;
          display: flex;
          .uploadButton{
            width: 50%;
            text-align: center;
            ul{
              display: none;
            }
          }
          .swiperPreview{
            width: 50%
          }
        }
      }
      .divShow {
        text-align: left;
        height: 150px;
        padding: 20px;
        .imgShow {
          max-width: 100%;
          height: 100%;
          margin: 0 auto;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
