<template>
  <div id='background-international-bar' v-bar>
    <div class="background-international-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <!-- <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="formIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div> -->
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <ComForm :searchIpt="formIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          <div class="form-bar" v-bar>
            <ComTable :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <div class="modal-dialog">
        <Dialog :modalData="modalData">
          <ComForm ref="modalForm" :searchIpt="modalItem" :searchFunc="modalFn" :formRule='modalRule'></ComForm>
          <div class="resultbutton">
            <el-button :disabled="isSaving" @click="saveEdit" type="primary" size="mini" >{{$t('vicenter.common.save')}}</el-button>
            <el-button @click="closeModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
          </div>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/background/international.js' // 接口文件
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
export default {
  name: 'international',
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
          modulePath: '',
          i18nKey: '',
          i18nValue: ''
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
        // {
        //   getLabel: this.$t('vicenter.Background.international.common.modulePath'),
        //   type: 'text',
        //   placeHolder: '',
        //   models: '',
        //   ruleProp: 'modulePath'
        // },
        // {
        //   getLabel: this.$t('vicenter.Background.international.common.i18nKey'),
        //   type: 'text',
        //   placeHolder: '',
        //   models: '',
        //   ruleProp: 'i18nKey'
        // },
        {
          getLabel: this.$t('vicenter.Background.international.common.i18nValue'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'i18nValue'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort
      },
      tableGroup: [ // 表格数据列
        // {
        //   label: this.$t('vicenter.common.No'),
        //   type: 'index'
        // },
        {
          label: this.$t('vicenter.Background.international.common.modulePath'),
          type: 'text',
          model: 'modulePath'
        },
        {
          label: this.$t('vicenter.Background.international.common.i18nKey'),
          type: 'text',
          model: 'i18nKey'
        },
        {
          label: this.$t('vicenter.Background.international.common.i18nValueUS'),
          type: 'text',
          model: 'i18nValueUS'
        },
        {
          label: this.$t('vicenter.Background.international.common.i18nValueCN'),
          type: 'text',
          model: 'i18nValueCN'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation'
        }
      ],
      operation: [
        {
          func: this.getEdit,
          label: `<span class='iconfont editTable'>&#xe650;</span>`,
          title: this.$t('vicenter.common.fix'),
          show: true
        }
      ],
      modalData: {
        title: '',
        flag: false,
        resetModal: this.resetModal
      },
      modalFn: { // 弹窗表单确定方法
        query: this.saveNull
      },
      modalItem: [
        {
          getLabel: this.$t('vicenter.Background.international.common.modulePath'),
          type: 'text',
          placeHolder: '',
          disabled: true,
          models: '',
          ruleProp: 'modulePath'
        },
        {
          getLabel: this.$t('vicenter.Background.international.common.i18nKey'),
          type: 'text',
          placeHolder: '',
          disabled: true,
          models: '',
          ruleProp: 'i18nKey'
        },
        {
          getLabel: this.$t('vicenter.Background.international.common.i18nValueUS'),
          type: 'text',
          placeHolder: '',
          disabled: false,
          models: '',
          ruleProp: 'i18nValueUS'
        },
        {
          getLabel: this.$t('vicenter.Background.international.common.i18nValueCN'),
          type: 'text',
          placeHolder: '',
          disabled: false,
          models: '',
          ruleProp: 'i18nValueCN'
        }
      ],
      modalRule: {
        refName: 'modalForm',
        rule: {
          i18nValueUS: [
            { required: true, message: this.$t('vicenter.Background.international.modal.inputI18nValueUS'), trigger: 'blur' }
            // { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: this.$t('') }
          ],
          i18nValueCN: [
            { required: true, message: this.$t('vicenter.Background.international.modal.inputI18nValueCN'), trigger: 'blur' }
            // { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: this.$t('') }
          ]
        },
        model: {
          modulePath: '',
          i18nKey: '',
          i18nValueUS: '',
          i18nValueCN: ''
        }
      },
      isSaving: false
    }
  },
  mounted () {
    this.getTable('')
  },
  methods: {
    getTable (val) {
      this.tableData.data = [
        {
          id: '1111111',
          modulePath: 'vicenter.mgmt',
          i18nKey: 'vicenter.Background.international.common.modulePath',
          i18nValueUS: 'Module Path',
          i18nValueCN: '所属模块路径'
        },
        {
          id: '2222222',
          modulePath: 'vicenter.mgmt',
          i18nKey: 'vicenter.Background.international.common.modulePath',
          i18nValueUS: 'Module Path',
          i18nValueCN: '所属模块路径'
        },
        {
          id: '3333333',
          modulePath: 'vicenter.mgmt',
          i18nKey: 'vicenter.Background.international.common.modulePath',
          i18nValueUS: 'Module Path',
          i18nValueCN: '所属模块路径'
        },
        {
          id: '4444444',
          modulePath: 'vicenter.mgmt',
          i18nKey: 'vicenter.Background.international.common.modulePath',
          i18nValueUS: 'Module Path',
          i18nValueCN: '所属模块路径'
        }
      ]
      this.tableData.data.forEach(e => {
        e.operation = this.operation
      })
      // ajax.getList(val).then((res) => {
      //   if (res.data.flag) {
      //     this.tableData.isPage = false
      //     this.tableData.page = {
      //       pageGroup: [10, 20, 50, 100], // 分页数据
      //       CurrentPage: res.data.result.pageable.pageNumber, // 当前页码
      //       pagesize: res.data.result.pageable.pageSize, // 当前分页条数
      //       Allpage: res.data.result.totalElements, // 总数据
      //       handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
      //       handleCurrentChange: this.handleCurrentChange // 当前页码改变触发改函数
      //     }
      //     this.tableData.data = res.data.result.content
      //     this.tableData.data.forEach(e => {
      //       e.operation = this.operation
      //     })
      //     this.formRule.model.page = res.data.result.pageable.pageNumber
      //     this.formRule.model.size = res.data.result.pageable.pageSize
      //     if (this.tableData.data.length > 0) {
      //       this.tableData.isPage = true
      //     }
      //   }
      // }).catch(() => {})
    },
    getEdit (scope) {
      if (this.$refs.modalForm) {
        this.$refs.modalForm.reset()
      }
      this.modalData.flag = true
      this.isSaving = false
      this.modalData.title = this.$t('vicenter.Background.international.modal.modifyTitle')
      // ajax.getDetail({'id': scope.row.id}).then(res => {
      //   if (res.data.flag) {
      //   }
      // })
    },
    saveEdit () {},
    closeModal () { // 弹窗非保存关闭
      this.$data.modalData.flag = false
    },
    resetModal () { // 点×号关闭弹窗并且清空数据
      this.$refs.modalForm.reset()
    },
    saveNull () {
      return false
    },
    handleSizeChange (val) { // 页码跳转
      this.formRule.model.size = val
      this.formRule.model.page = 0
      this.$set(this.tableData.page, 'pagesize', val)
      this.SetpageQuery(0)
    },
    handleCurrentChange (val) { // 页码跳转
      this.SetpageQuery(this.formRule.model.page)
    },
    SetpageQuery (page) {
      var value = {
        modulePath: this.formRule.model.modulePath,
        i18nKey: this.formRule.model.i18nKey,
        i18nValue: this.formRule.model.i18nValue,
        page: page,
        size: this.tableData.page.pagesize
      }
      var val = Object.assign({}, value)
      this.getTable(val)
    },
    query () { // 总体查询
      this.SetpageQuery(0)
    },
    getSort () {
      console.log(this.formRule)
    }
  },
  components: { bread, ComForm, panelTitle, ComTable, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#background-international-bar {
  @extend .extend-bar;
  .background-international-M {
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
          @include layout(1, 'fasle');
          height: auto;
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        width: $all;
        justify-content: flex-start;
      }
    }
    .modal-dialog {
      .el-dialog {
        width: 30%;
        .search-form {
          @include layout(1);
          justify-content: flex-start!important;
          .search-form-btn .el-form-item__content {
            display: none;
          }
        }
        .resultbutton {
          padding-top: 5px;
          text-align: right;
        }
      }
    }
  }
}
</style>
