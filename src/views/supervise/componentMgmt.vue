<template>
  <div id='component-management-bar' v-bar>
    <div class="component-management-M">
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
          <!-- <div class="form-bar" v-bar>
            <el-tree
              ref="componentTypeTree"
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              node-key="id"
              highlight-current
              @node-click="handleNodeClick"
            ></el-tree>
          </div> -->
        </div>
         <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComTable :tableData="tableData" @editFunc="handleEditFunc" @saveFunc="handleSaveFunc"></ComTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/supervise/templateMgmt'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
export default {
  name: 'componentMgmt',
  data () {
    return {
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.dashboard.common.componentQuery')
        },
        listTitle: {
          title: this.$t('vicenter.dashboard.common.componentList')
        },
        treeTitle: {
          title: this.$t('vicenter.dashboard.common.componentsType')
        }
      },
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Supervise/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      formRule: {
        refName: 'componentQueryForm',
        model: {
          componentName: '',
          typeIds: []
        },
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.reset,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formIpt: [ // 查询表单初始化
        {
          getLabel: this.$t('vicenter.dashboard.common.componentName'),
          placeHolder: this.$t('vicenter.dashboard.common.enterComponentName'),
          type: 'text',
          models: '',
          ruleProp: 'componentName'
        },
        {
          getLabel: this.$t('vicenter.dashboard.common.componentsType'),
          placeHolder: this.$t('vicenter.dashboard.common.selectComponentsType'),
          type: 'select2',
          filterable: true,
          models: [],
          option: [],
          ruleProp: 'typeIds'
        }
      ],
      tableData: { // 表格数据
        refName: 'componentTable',
        isThumbnail: true,
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        },
        isEdit: true,
        editData: []
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      typeIds: '',
      oldInfo: {
        componentName: '',
        desc: ''
      },
      isSave: false
    }
  },
  mounted () {
    this.getTreeData()
    this.query()
  },
  methods: {
    query (isPage = true) {
      let params = JSON.parse(JSON.stringify(this.formRule.model))
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.typeIds = params.typeIds.join(',')
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      ajax.getComponentList(params).then((res) => {
        if (res.data.flag) {
          this.tableData.isPage = false
          this.tableData.page.CurrentPage = res.data.result.pageable.pageNumber
          this.tableData.page.pagesize = res.data.result.pageable.pageSize
          this.tableData.page.Allpage = res.data.result.totalElements
          this.tableData.data = res.data.result.content
          this.tableData.editData = []
          this.tableData.data.forEach(e => {
            e.lastImage = e.lastImage
            e.infoData = [
              {
                label: this.$t('vicenter.dashboard.common.name'),
                value: e.componentName,
                edit: true // 组件名称允许修改
              },
              {
                label: this.$t('vicenter.dashboard.common.desc'),
                value: e.desc,
                edit: true // 组件描述允许修改
              }
            ]
            // 组件信息允许编辑，显示编辑按钮
            this.tableData.editData.push({
              edit: false
            })
          })
          this.formRule.model.page = res.data.result.pageable.pageNumber
          this.formRule.model.size = res.data.result.pageable.pageSize
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    getTreeData () {
      ajax.getComponentTree().then((res) => {
        if (res.data.flag) {
          this.treeData = this.$getComponentTypeTree(res.data.result, false)
          this.formIpt[1].option = this.treeData.map(e => {
            return {
              label: e.label,
              value: e.id
            }
          })
        }
      }).catch(() => {})
    },
    handleSizeChange (val) {
      this.$set(this.tableData.page, 'pagesize', val)
      this.query(false)
    },
    handleCurrentChange (val) {
      this.$set(this.tableData.page, 'CurrentPage', val - 1)
      this.query(false)
    },
    handleNodeClick (data) {
      this.typeIds = data.id
      this.query()
    },
    reset () {
      // this.$refs.componentTypeTree.setCurrentKey(null)
      // this.typeIds = ''
      // this.formRule.model.componentName = ''
      // this.query()
    },
    // 编辑组件信息
    handleEditFunc (itemData) {
      let hasEditing = this.tableData.editData.some(e => e.edit)
      if (hasEditing) {
        // 不能同时修改多个组件
        this.$NotifPrompt(this.$t('vicenter.dashboard.common.modifyLimit'))
        return
      }
      let { data, i } = itemData
      this.oldInfo = {
        componentName: data.infoData[0].value,
        desc: data.infoData[1].value
      }
      this.tableData.editData[i].edit = true
    },
    // 保存组件修改信息
    handleSaveFunc (itemData) {
      let { data, i } = itemData
      let params = {
        id: data.id,
        componentName: data.infoData[0].value,
        desc: data.infoData[1].value
      }
      if (!params.componentName) {
        // 名称不允许为空
        this.$NotifPrompt(this.$t('vicenter.dashboard.common.nameRequired'))
        return
      }
      this.$ConfirmBox(this.$t('vicenter.common.saveConfirm'), () => {
        this.isSave = true
        ajax.saveComponent(params).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.saveSuccess'))
            this.tableData.editData[i].edit = false
            this.query()
            this.isSave = false
          }
        }).catch(() => {})
      }, () => {
        if (this.isSave) {
          return
        }
        this.tableData.data[i].infoData[0].value = this.oldInfo.componentName
        this.tableData.data[i].infoData[1].value = this.oldInfo.desc
        this.tableData.editData[i].edit = false
      })
    },
    getSort () {}
  },
  components: {bread, panelTitle, ComForm, ComTable}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#component-management-bar {
  @extend .extend-bar;
  .component-management-M {
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
        // .search-form {
        //   height: 100px;
        //   @include flex(row, flex-start, flex-end);
        //   .search-form-item {
        //     width: 60%!important;
        //   }
        //   .search-form-btn {
        //     width: 35%!important;
        //     text-align: right;
        //   }
        // }
      }
    }
  }
}
</style>
