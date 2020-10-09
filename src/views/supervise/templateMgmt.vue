<template>
  <div id='template-management-bar' v-bar>
    <div class="template-management-M">
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
      <Dialog :modalData="modalData">
        <div v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)">
          <div class="template-modify-content">
            <div class="left">
              <panelTitle :panelTitleInit="panelTitle.treeTitle"></panelTitle>
              <div class="tree-box" v-bar>
                <div>
                  <el-tree
                    ref="componentTypeTree"
                    :data="treeData"
                    :props="defaultProps"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    @check-change="handleCheckChangeTree"
                    @check="handleCheckTree"
                  ></el-tree>
                </div>
              </div>
            </div>
            <div class="right">
              <panelTitle :panelTitleInit="panelTitle.layoutTitle"></panelTitle>
              <div v-if="!isDetail" class="name-edit">
                <span>{{$t('vicenter.dashboard.common.templateName')}}</span>
                <el-input v-model.trim="templateName" :placeholder="$t('vicenter.dashboard.common.enterTemplateName')" :maxlength="textMaxLength"></el-input>
              </div>
              <div ref="layout-outer" class="layout-box" :class="{layoutH: isDetail}">
                <LayoutCommon v-if="showGridLayout" ref="layoutRef" :type="layoutType" :data="layoutData" :mapPos="layoutMapPosition" :totalHeight="layoutHeight" :isDraggable="layoutIsDraggable" @allData="getLayoutData"></LayoutCommon>
              </div>
            </div>
          </div>
          <div class="template-modify-button">
            <el-button v-if="!isDetail" data-id="save-btn" @click="handleSave" type="primary" size="mini" >{{$t('vicenter.common.save')}}</el-button>
            <el-button v-if="!isDetail" data-id="cancel-btn" @click="closeModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
            <el-button v-if="isDetail" data-id="back-btn" @click="closeModal" size="mini" >{{$t('vicenter.common.back')}}</el-button>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/supervise/templateMgmt'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
import Dialog from '@/components/dialogCommon'
import LayoutCommon from '@/components/gridLayout'
export default {
  name: 'templateMgmt',
  data () {
    return {
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        },
        treeTitle: {
          title: this.$t('vicenter.dashboard.common.componentsType')
        },
        layoutTitle: {
          title: this.$t('vicenter.dashboard.common.largeScreen')
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
        refName: 'templateQueryForm',
        model: {
          templateName: '',
          status: ''
        },
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formIpt: [ // 查询表单初始化
        {
          getLabel: this.$t('vicenter.dashboard.common.templateName'),
          placeHolder: this.$t('vicenter.dashboard.common.enterTemplateName'),
          type: 'text',
          models: '',
          ruleProp: 'templateName'
        },
        {
          getLabel: this.$t('vicenter.dashboard.common.status'),
          placeHolder: this.$t('vicenter.dashboard.common.selectTemplateStatus'),
          type: 'select',
          models: '',
          ruleProp: 'status',
          option: [
            {
              label: this.$t('vicenter.dashboard.status.published'),
              value: '1'
            },
            {
              label: this.$t('vicenter.dashboard.status.unpublished'),
              value: '0'
            }
          ]
        }
      ],
      tableData: { // 表格数据
        refName: 'templateTable',
        data: [
          {
            id: 1,
            templateName: 'aaa',
            proportion: '3:4',
            status: '1'
          },
          {
            id: 2,
            templateName: 'bbb',
            proportion: '3:5',
            status: '0'
          },
          {
            id: 3,
            templateName: 'ccc',
            proportion: '4:4',
            status: '0'
          }
        ],
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
        }
      },
      tableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index',
          width: '100px'
        },
        {
          label: this.$t('vicenter.dashboard.common.templateName'),
          type: 'text',
          model: 'templateName'
        },
        {
          label: this.$t('vicenter.dashboard.common.proportion'),
          type: 'text',
          model: 'proportion'
        },
        {
          label: this.$t('vicenter.dashboard.common.status'),
          type: 'text',
          model: 'statusVal'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation'
        }
      ],
      modalData: {
        width: '85%',
        top: '50px',
        title: '',
        flag: false,
        closeModal: this.closeModal
      },
      loading: false,
      isDetail: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      componentsType: [], // 选中的组件类型
      showGridLayout: false,
      layoutData: [],
      layoutType: '', // 模板比例
      layoutMapPosition: {},
      layoutHeight: 0,
      layoutIsDraggable: false,
      templateName: '',
      textMaxLength: 50,
      templateId: ''
    }
  },
  mounted () {
    this.query()
    this.getTreeData()
  },
  methods: {
    query (isPage = true) {
      let params = JSON.parse(JSON.stringify(this.formRule.model))
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      ajax.getList(params).then((res) => {
        if (res.data.flag) {
          this.tableData.isPage = false
          this.tableData.page.CurrentPage = res.data.result.pageable.pageNumber
          this.tableData.page.pagesize = res.data.result.pageable.pageSize
          this.tableData.page.Allpage = res.data.result.totalElements
          this.tableData.data = res.data.result.content
          this.tableData.data.forEach(e => {
            if (e.status === '1' || e.status.endsWith('C_1')) {
              e.statusVal = this.$t('vicenter.dashboard.status.published')
              e.operation = [
                {
                  func: this.handleDetail,
                  label: `<span class='iconfont editTable'>&#xe610;</span>`,
                  title: this.$t('vicenter.common.detail'),
                  show: true
                }
              ]
              // 3:4为默认发布模板，不允许取消发布
              if (e.proportion !== '3:4') {
                e.operation.push(
                  {
                    func: this.handleUnpublish,
                    label: `<span class='iconfont editTable bigFont'>&#xe712;</span>`,
                    title: this.$t('vicenter.common.unpublish'),
                    show: true
                  }
                )
              }
            } else if (e.status === '0' || e.status.endsWith('C_0')) {
              e.statusVal = this.$t('vicenter.dashboard.status.unpublished')
              e.operation = [
                {
                  func: this.handleDetail,
                  label: `<span class='iconfont editTable'>&#xe610;</span>`,
                  title: this.$t('vicenter.common.detail'),
                  show: true
                },
                {
                  func: this.handleModify,
                  label: `<span class='iconfont editTable'>&#xe650;</span>`,
                  title: this.$t('vicenter.common.fix'),
                  show: true
                },
                {
                  func: this.handlePublish,
                  label: `<span class='iconfont editTable bigFont'>&#xe702;</span>`,
                  title: this.$t('vicenter.common.publish'),
                  show: true
                }
              ]
            }
          })
          this.formRule.model.page = res.data.result.pageable.pageNumber
          this.formRule.model.size = res.data.result.pageable.pageSize
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    handleDetail (scope) {
      this.openDialog(this.$t('vicenter.common.detail'), true, scope)
    },
    handleModify (scope) {
      this.openDialog(this.$t('vicenter.common.fix'), false, scope)
    },
    /**
     * 查看详情和修改模态框的公共处理部分
     * @param {string} modalTitle 模态框标题
     * @param {boolean} isDetail 是否详情模态框。详情的话树节点不可勾选，模板不可拖拽，只有返回操作
     * @param {string} scope 当前模板的数据
    */
    openDialog (modalTitle, isDetail, scope) {
      ajax.getTemplateDetail({id: scope.row.id}).then((res) => {
        if (res.data.flag) {
          let result = res.data.result
          this.showGridLayout = false
          this.layoutData = []
          // 模态框标题
          this.modalData.title = modalTitle
          // 标识详情页面or编辑页面
          this.isDetail = isDetail
          // tree节点复选框是否禁用。详情页面全部禁用
          this.treeData.forEach(item => {
            if (!item.pId) {
              item.disabled = isDetail
            }
            if (item.children && item.children.length > 0) {
              item.children.forEach(e => {
                e.disabled = isDetail
              })
            }
          })
          // 模板是否可拖拽。详情页面不可拖拽
          this.layoutIsDraggable = !isDetail
          // 模板id
          this.templateId = scope.row.id
          // 模板名称
          this.templateName = scope.row.templateName
          // 模板类型
          this.layoutType = scope.row.proportion
          // 模板地图位置
          this.layoutMapPosition = this.$filterLayoutType(scope.row.proportion).layoutMapPosition
          // 模板数据源
          let checkedNodeIds = []
          let componentsData = []
          if (result.componentObjects && result.componentObjects.length > 0) {
            componentsData = result.componentObjects.map(e => {
              return {
                x: e.beginposx,
                y: e.beginposy,
                w: e.width,
                h: e.height,
                i: e.id,
                static: false,
                label: e.componentName,
                imgUrl: e.imgUrl
              }
            })
            this.layoutData = componentsData.concat(this.layoutMapPosition)
            this.layoutData.forEach(e => {
              if (e.i !== 'MAP') {
                checkedNodeIds.push(e.i)
              }
            })
          }
          this.modalData.flag = true
          this.$nextTick(() => {
            // tree节点默认选中项
            this.$refs.componentTypeTree.setCheckedKeys(checkedNodeIds)
            this.componentsType = checkedNodeIds
            // 模板栅格行高度设置
            let timer = setInterval(() => {
              this.layoutHeight = this.$refs['layout-outer'].offsetHeight
              if (this.layoutHeight > 0) {
                clearInterval(timer)
                this.showGridLayout = true
              }
            }, 10)
          })
        }
      }).catch(() => {})
    },
    handleUnpublish (scope) {
      this.$ConfirmBox(this.$t('vicenter.common.unpublishConfirm'), () => {
        let params = {
          id: scope.row.id,
          status: '0'
        }
        ajax.updateTemplateStatus(params).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.unpublishSuccess'))
            this.query()
          }
        }).catch(() => {})
      })
    },
    handlePublish (scope) {
      this.$ConfirmBox(this.$t('vicenter.common.publishConfirm'), () => {
        let params = {
          id: scope.row.id,
          status: '1'
        }
        ajax.updateTemplateStatus(params).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.publishSuccess'))
            this.query()
          }
        }).catch(() => {})
      })
    },
    closeModal () {
      this.templateId = ''
      this.templateName = ''
      this.componentsType = []
      this.modalData.flag = false
    },
    handleCheckChangeTree (data, checked, childChecked) {
      let maxComponentsQty = this.$filterLayoutType(this.layoutType).componentsQty
      let currentCheckedLen = this.$refs.componentTypeTree.getCheckedKeys(true).length
      if (currentCheckedLen > maxComponentsQty) {
        // 最多只能选择maxComponentsQty个组件
        this.$refs.componentTypeTree.setChecked(data.id, false)
        return
      }
      // 取消勾选的情况
      if (!data.children && !checked) {
        this.layoutData.forEach(e => {
          if (data.id === e.i) {
            e.i = `${e.x}-${e.y}`
            e.label = ''
            e.imgUrl = ''
          }
        })
      }
      // 勾选的情况
      if (!data.children && checked) {
        let flag = false
        this.layoutData.forEach(e => {
          if (!e.label && !flag) {
            flag = true
            e.i = data.id
            e.label = data.label
            e.imgUrl = data.imgUrl
          }
        })
      }
    },
    handleCheckTree (data, checkedObj) {
      let { checkedNodes } = checkedObj
      if (checkedNodes.length > 0) {
        // 组件类型树勾选的组件（二级节点）
        this.componentsType = checkedNodes.filter(e => e.pId)
      } else {
        // 当取消所有勾选项时，重置栅格布局，清空栅格元素内容
        this.clearVal()
      }
    },
    clearVal () {
      this.$refs.layoutRef.resetGridLayout()
    },
    handleSave () {
      let maxComponentsQty = this.$filterLayoutType(this.layoutType).componentsQty
      if (!this.templateName) {
        // 模板名称不能为空
        this.$NotifPrompt(this.$t('vicenter.dashboard.common.enterTemplateName'))
        return
      }
      if ((this.componentsType.length < maxComponentsQty) || this.componentsType.length === 0) {
        // 组件类型树勾选的节点数必须填充满栅格区域才能保存
        this.$NotifPrompt(this.$t('vicenter.dashboard.common.componentsTypeQtyTip'))
        return
      }
      let params = {
        id: this.templateId,
        templateName: this.templateName,
        componentArrStr: ''
      }
      let componentList = []
      this.layoutData.forEach(item => {
        if (item.i !== 'MAP') {
          componentList.push({
            id: item.i,
            beginposx: item.x,
            beginposy: item.y,
            width: item.w,
            height: item.h,
            imgUrl: item.imgUrl
          })
        }
      })
      params.componentArrStr = JSON.stringify(componentList)
      this.loading = true
      ajax.updateTemplate(params).then((res) => {
        this.loading = false
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
          this.closeModal()
          this.query()
        }
      }).catch(() => {})
    },
    getLayoutData (data) {
      this.layoutData = data
    },
    getTreeData () {
      ajax.getComponentTree().then((res) => {
        if (res.data.flag) {
          this.treeData = this.$getComponentTypeTree(res.data.result)
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
    getSort () {}
  },
  components: {bread, panelTitle, ComForm, ComTable, Dialog, LayoutCommon}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#template-management-bar {
  @extend .extend-bar;
  .template-management-M {
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
.template-modify-content {
  width: $all;
  height: 650px;
  @include flex(row, center, flex-start);
  margin-top: -20px;
  .left,.right {
    height: $all;
    border: 1px solid #dddddd;
  }
  .left {
    width: 29%;
    margin-right: 1%;
    .tree-box {
      height: calc(100% - 35px);
    }
  }
  .right {
    width: 70%;
    .name-edit {
      width: $all;
      height: 35px;
      padding: 0 10px;
      @include box-sizing();
      @include flex(row, flex-start, center);
      span {
        margin-right: 10px;
        white-space: nowrap;
      }
      .el-input__inner {
        height: 30px;
      }
    }
    .layout-box {
      height: calc(100% - 70px);
    }
    .layoutH {
      height: calc(100% - 35px);
    }
  }
}
@media screen and (max-width: 1400px) {
  .template-modify-content {
    height: 500px;
  }
}
.template-modify-button {
  text-align: right;
  margin-top: 20px;
}
</style>
