<template>
   <div class='demo-bar' v-bar>
     <div class="demo-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="infolist">
          <div class="panel panel-Q">
            <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
            <div class="form-bar" v-bar>
              <ComForm :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
            </div>
          </div>
          <div class="panel panel-L">
            <panelTitle :panelTitleInit="panelTitle.listTitle">
              <div>
                <el-button type="primary" size="mini" @click="showModal">显示</el-button>
                <el-button type="primary" size="mini" @click="showModal">显示</el-button>
                <el-button type="primary" size="mini" @click="showModal">显示</el-button>
              </div>
            </panelTitle>
            <ComTable :tableData='tableData' :tableGroup='tableGroup'></ComTable>
          </div>
        </div>
        <div class="modal-dialog">
          <Dialog :modalData="modalData">
            <ComForm ref="modalForm" :searchIpt="modalItem" :searchFunc="modalFn" :formRule='modalRule'></ComForm>
          </Dialog>
        </div>
     </div>
   </div>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import api from '@/api/demo/index.js'
export default {
  name: 'demo',
  data () {
    return {
      tableLoading: true,
      CurrentChageFlag: false, // 分页切换标志位
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$route.matched[0].meta.title,
            path: '/Tip/home' // 跳转路径
          },
          {
            label: this.$route.name
          }
        ]
      },
      panelTitle: { // title组件数据
        queryTitle: {
          title: 'Query'
        },
        listTitle: {
          title: 'List'
        }
      },
      queryFn: { // 页面表单查询方法
        query: this.query,
        queryText: 'query',
        resetText: 'reset'
      },
      modalFn: { // 弹窗表单确定方法
        query: this.sure,
        close: this.closeModal,
        queryText: '确定',
        resetText: this.$t('vicenter.common.cancel')
      },
      formRule: { // 表单验证和存放数据 model=> post到后台的数据
        refName: 'queryForm',
        rule: {
          a: [ // 序列号校验
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 1, max: 50, message: '请输入正确的项', trigger: 'blur' }
          ],
          b: [ // 序列号校验
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 1, max: 50, message: '请输入正确的项', trigger: 'blur' }
          ],
          e: [ // 序列号校验
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 1, max: 50, message: '请输入正确的项', trigger: 'blur' }
          ]
        },
        model: {
          a: '',
          b: '',
          c: '',
          d: '',
          e: ''
        }
      },
      modalRule: { // 弹窗表单验证和存放数据 model=> post到后台的数据
        refName: 'modalQueryForm',
        rule: {
          a: [ // 序列号校验
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 1, max: 50, message: '请输入正确的项', trigger: 'blur' }
          ]
        },
        model: {
          a: '',
          b: ''
        }
      },
      modalItem: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: 'a',
          type: 'text',
          placeHolder: 'a',
          models: '',
          ruleProp: 'a'
        },
        {
          getLabel: 'a',
          type: 'text',
          placeHolder: 'a',
          models: '',
          ruleProp: 'a'
        },
        {
          getLabel: 'b',
          type: 'text',
          placeHolder: 'b',
          models: '',
          ruleProp: 'b'
        }
      ],
      inputItem: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: 'a',
          type: 'text',
          placeHolder: 'a',
          models: '',
          ruleProp: 'a'
        },
        {
          getLabel: 'b',
          type: 'text',
          placeHolder: 'b',
          models: '',
          ruleProp: 'b'
        },
        {
          getLabel: 'c',
          type: 'text',
          placeHolder: 'c',
          models: '',
          ruleProp: 'c'
        },
        {
          getLabel: 'd',
          type: 'text',
          placeHolder: 'd',
          models: '',
          ruleProp: 'd'
        },
        {
          getLabel: 'd',
          type: 'text',
          placeHolder: 'd',
          models: '',
          ruleProp: 'd'
        },
        {
          getLabel: 'd',
          type: 'text',
          placeHolder: 'd',
          models: '',
          ruleProp: 'd'
        },
        {
          getLabel: 'd',
          type: 'text',
          placeHolder: 'd',
          models: '',
          ruleProp: 'd'
        },
        {
          getLabel: 'd',
          type: 'text',
          placeHolder: 'd',
          models: '',
          ruleProp: 'd'
        },
        {
          getLabel: 'd',
          type: 'text',
          placeHolder: 'd',
          models: '',
          ruleProp: 'd'
        },
        {
          getLabel: 'e',
          type: 'text',
          placeHolder: 'e',
          models: '',
          ruleProp: 'e'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'multipleTable',
        sortMethod: this.getSortTable // 新增排序方法
      },
      tableGroup: [ // 表格数据列
        {
          type: 'selection'
        },
        {
          label: 'id',
          type: 'text',
          model: 'id',
          sortable: 'custom'
        },
        {
          label: 'a1',
          type: 'text',
          model: 'a1'
        },
        {
          label: 'b1',
          type: 'text',
          model: 'b1'
        },
        {
          label: 'c1',
          type: 'text',
          model: 'c1'
        },
        {
          label: 'd1',
          type: 'text',
          model: 'd1'
        },
        {
          label: 'e1',
          type: 'text',
          model: 'e1'
        },
        {
          label: 'f1',
          type: 'text',
          model: 'f1'
        },
        {
          label: 'g1',
          type: 'text',
          model: 'g1'
        },
        {
          label: 'h',
          type: 'text',
          model: 'h1'
        },
        {
          label: '操作',
          type: 'operation',
          width: '150px',
          model: 'operation',
          fixed: 'right'
        }
      ],
      operation: [ // 表格操作
        {
          func: this.getEdit,
          label: `<span class='editTable'>${this.$t('vicenter.common.fix')}</span>`,
          title: this.$t('vicenter.common.fix'),
          show: true
        },
        {
          func: this.getDelete,
          label: `<span class='editTable'>${this.$t('vicenter.common.delete')}</span>`,
          title: this.$t('vicenter.common.delete'),
          show: true
        }
      ],
      modalData: {
        title: '这是标题',
        flag: false,
        resetModal: this.resetModal
      }
    }
  },
  created () {
    this.getTableData()
  },
  mounted () {},
  methods: {
    async getTableData () { // 获取表格初始数据 模拟请求回来的数据
      let res = await api.getTableData({pageable:false})
      res

          this.$data.tableData.data = [
        {
          id: 0,
          a1: 'q1lshgfgfgsgfgfshgfkjhagdliUJHFCEWR9YKJ FWE IUFIHL HUP',
          b1: 'w1',
          c1: 'e1',
          d1: 'r1',
          e1: 't1',
          f1: 'y1',
          g1: 'qu1',
          h1: 'last1'
        },
        {
          id: 1,
          a1: 'q2',
          b1: 'w2',
          c1: 'e2',
          d1: 'r2',
          e1: 't2',
          f1: 'y2',
          g1: 'qu2',
          h1: 'last2'
        },
        {
          id: 2,
          a1: 'q2',
          b1: 'w2',
          c1: 'e2',
          d1: 'r2qweqeqeqedfisuyfoicynfoicwuormw',
          e1: 't2',
          f1: 'y2',
          g1: 'qu2',
          h1: 'last2'
        }
      ]
      let {data} = this.$data.tableData
      data.forEach(e => {
        e.operation = this.$data.operation
      })
      if (data.length) {
        this.$data.tableData.isPage = true
      } else {
        this.$data.tableData.isPage = false
      }
      this.$data.tableData.page = {
        CurrentPage: 1,
        pagesize: 1,
        handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
        handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
        Allpage: data.length
      }
    },
    query () { // 表单查询方法
      console.log('this.$data.formRule.model', this.$data.formRule.model)
    },
    sure () {},
    closeModal () { // 取消关闭弹窗
      this.$data.modalData.flag = false
    },
    getSortTable ({column, prop, order}) { // 表格排序
      console.log(column, prop, order)
      if (!prop) {
        this.$data.formRule.model.sort = ''
      } else {
        if (order === 'descending') {
          this.$data.tableData.data.reverse()
          // const orde = 'desc'    // 注释的地方为后端排序
          // this.$data.formRule.model.sort = prop + ',' + orde
        } else {
          this.$data.tableData.data.reverse()
          // this.$data.formRule.model.sort = `${prop}`
        }
      }
      // this.getTableData()
    },
    getEdit () { // 操作
    },
    getDelete () { // 删除
    },
    handleSizeChange (val) { // 分页条数改变触发该函数
      console.log(val)
      // this.$data.CurrentChageFlag = true
      // const handlesize = Object.assign(this.$data.formRule.model, {size: val, page: 0})
      // this.getTableData(handlesize)
    },
    handleCurrentChange (val) { // 当前页码改变触发改函数
      // if (!this.$data.CurrentChageFlag) {
      console.log(val)
      // const pagesize = this.$data.tableData.page.pagesize
      // const obj = Object.assign(this.$data.formRule.model, {size: pagesize, page: parseInt(val - 1)})
      // this.getTableData(obj)
      // }
    },
    showModal () { // 显示弹窗
      this.$data.modalData.flag = true
    },
    resetModal () { // 点×号关闭弹窗并且清空数据
      this.$refs.modalForm.reset()
    }
  },
  components: { breadCrumb, ComForm, panelTitle, ComTable, Dialog }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.demo-bar {
  @extend .extend-bar;
  .demo-M {
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
          @include layout(3);
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
      }
    }
  }
}
</style>
