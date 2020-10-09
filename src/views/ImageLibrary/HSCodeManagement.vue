<template>
  <div class='HSCode-management-bar' v-bar>
    <div class="HSCode-management-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar">
            <div class="query">
              <div class="title">{{$t('vicenter.ImageLibrary.HSCodeManagement.HSCode')}}</div>
              <el-autocomplete
                class="inline-input"
                v-model="queryText"
                :fetch-suggestions="querySearch"
                :placeholder="$t('vicenter.ImageLibrary.common.inputHsCodes')"
                :trigger-on-focus="false"
                @select="handleSelectHsCode"
              ></el-autocomplete>
            </div>
            <GoodsTree ref="GoodsTreeRef" :goodsOption="goodsOption" @data="currentClickGoods"></GoodsTree>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitleUp">
            <!-- <el-button v-if="!isRoot" type="danger" size="mini" @click='deleteHSCode'>{{$t('vicenter.common.delete')}}</el-button> -->
            <el-button type="primary" size="mini" data-id="add-btn" @click='showAddModel'>{{$t('vicenter.common.add')}}</el-button>
            <el-button type="primary" size="mini" data-id="fix-btn" @click='showEditModel'>{{$t('vicenter.common.fix')}}</el-button>
          </panelTitle>
          <div class="formTableBox">
            <FormTable :formTableData="formData" :formRule="formRule"></FormTable>
          </div>
        </div>
      </div>
      <div class="modal-dialog">
        <Dialog :modalData="addModalData">
          <FormTable ref="addFormModel" :formTableData="addFormData" :formRule="addFormRule"></FormTable>
          <div class="operationBtn">
            <el-button :disabled="isAdding" data-id="addModalSave-btn" @click="handleAdd" type="primary" size="mini" >{{$t('vicenter.common.save')}}</el-button>
            <el-button data-id="addModalCancel-btn" @click="closeAddModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
          </div>
        </Dialog>
        <Dialog :modalData="editModalData">
          <FormTable ref="editFormModel" :formTableData="editFormData" :formRule="editFormRule"></FormTable>
          <div class="operationBtn">
            <el-button data-id="editModalSave-btn" @click="handleEdit" type="primary" size="mini" >{{$t('vicenter.common.save')}}</el-button>
            <el-button data-id="editModalCancel-btn" @click="closeEditModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
          </div>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/background/HSCode.js' // 接口文件
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import GoodsTree from '@/views/ImageLibrary/common/goodsTree'
import FormTable from '@/views/ImageLibrary/common/formTable'
import { setTimeout } from 'timers'
export default {
  name: 'HSCodeManagement',
  data () {
    return {
      isRoot: true, // 当前选中节点是否为根节点
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
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.ImageLibrary.goodsStatistics.goodsType')
        },
        listTitleUp: {
          title: this.$t('vicenter.ImageLibrary.HSCodeManagement.GoodsTypeInfo')
        }
      },
      formData: [
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.HSCode'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'hsCode',
          disabled: true
        },
        // {
        //   getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.GoodsName'),
        //   type: 'readOnlyText',
        //   placeHolder: '',
        //   models: '',
        //   ruleProp: 'hsDesc'
        // },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.GoodsDescription'),
          type: 'textarea',
          placeHolder: '',
          models: '',
          ruleProp: 'hsDesc',
          disabled: true
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.Creator'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'createUserAccount',
          disabled: true
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.CreatingTime'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'createDate',
          disabled: true
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.UpdateBy'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'updateUserAccount',
          disabled: true
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.UpdatingTime'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'updateDate',
          disabled: true
        }
      ],
      addFormData: [
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.ParentHSCode'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'code',
          disabled: true
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.ParentGoodsName'),
          type: 'textarea',
          placeHolder: '',
          models: '',
          ruleProp: 'name',
          disabled: true
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.HSCode'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'hsCode',
          maxlength: 20
        },
        // {
        //   getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.HSParent'),
        //   type: 'select',
        //   placeHolder: '',
        //   models: 1,
        //   ruleProp: 'hsParent',
        //   option: [
        //     {
        //       value: 1,
        //       label: this.$t('vicenter.common.filter.yesOrNo.yes')
        //     },
        //     {
        //       value: 0,
        //       label: this.$t('vicenter.common.filter.yesOrNo.no')
        //     }
        //   ]
        // },
        // {
        //   getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.GoodsName'),
        //   type: 'text',
        //   placeHolder: '',
        //   models: '',
        //   ruleProp: 'hsName'
        // },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.GoodsDescription'),
          type: 'textarea',
          placeHolder: '',
          models: '',
          ruleProp: 'hsDesc',
          autoSize: 4
        }
      ],
      editFormData: [
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.ParentHSCode'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'pcode',
          disabled: true
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.ParentGoodsName'),
          type: 'textarea',
          placeHolder: '',
          models: '',
          ruleProp: 'pname',
          disabled: true
        },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.HSCode'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'hsCode',
          disabled: true
        },
        // {
        //   getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.GoodsName'),
        //   type: 'text',
        //   placeHolder: '',
        //   models: '',
        //   ruleProp: ''
        // },
        {
          getLabel: this.$t('vicenter.ImageLibrary.HSCodeManagement.GoodsDescription'),
          type: 'textarea',
          placeHolder: '',
          models: '',
          ruleProp: 'hsDesc',
          autoSize: 4
        }
      ],
      addModalData: {
        title: this.$t('vicenter.common.add'),
        flag: false,
        resetModal: this.closeAddModal
      },
      editModalData: {
        title: this.$t('vicenter.common.fix'),
        flag: false,
        resetModal: this.closeEditModal
      },
      formRule: {
        refName: 'formTable',
        model: {
        },
        rule: {}
      },
      editFormRule: {
        refName: 'editFormTable',
        model: {
          pcode: '',
          pname: '',
          hsCode: '',
          hsDesc: ''
        },
        rule: {
          hsDesc: [
            { required: true, message: this.$t('vicenter.ImageLibrary.common.inputHsDesc'), trigger: 'blur' }
          ]
        }
      },
      addFormRule: {
        refName: 'addFormTable',
        rule: {
          hsCode: [
            { required: true, message: this.$t('vicenter.ImageLibrary.common.inputHsCodes'), trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9]*$/, message: this.$t('vicenter.common.verifyRules.onlyLD'), trigger: 'change' }
          ],
          hsDesc: [
            { required: true, message: this.$t('vicenter.ImageLibrary.common.inputHsDesc'), trigger: 'blur' }
          ]
        },
        model: {
          code: '',
          name: '',
          hsCode: '',
          hsDesc: ''
        }
      },
      goodsOption: {
        isShowCheckbox: false,
        isUpdateTreeData: false, // 实时更新树机构时使用的标志位
        isAddTreeData: false, // 实时更新树机构时使用的标志位
        addNodeId: '',
        isDeleteTreeData: false, // 实时更新树机构时使用的标志位
        currentNodeId: '', // 当前选中的节点id,
        isShowQueryIpt: true, // 是否显示搜索框
        defaultExpandedKeys: [],
        hscodeTreeQuery: false
      },
      queryText: '',
      rootId: '',
      selectNodeId: '',
      isAdding: false,
      currentSelectNode: {}, // 当前选中的节点
      allTreeData: [] // 所有的节点
    }
  },
  mounted () {
    this.initDefaultFormTableData(true)
  },
  methods: {
    searchParentIds (nodeId) {
      ajax.getHSCodeDetail({id: nodeId}).then(res => {
        if (res.data.flag) {
          let data = res.data.result
          if (this.goodsOption.defaultExpandedKeys.indexOf(data.parentId) < 0) {
            this.goodsOption.defaultExpandedKeys.push(data.parentId)
            this.searchParentIds(data.parentId)
          } else {
            setTimeout(() => {
              this.$refs.GoodsTreeRef.$refs.goodsTree.setCurrentKey(this.selectNodeId)
              this.currentSelectNode.id = this.selectNodeId
              if (this.selectNodeId === this.rootId) {
                this.isRoot = true
              } else {
                this.isRoot = false
              }
              this.initFormTableData(this.currentSelectNode.id)
              // 滚动条滚到相应位置
              let treeDom = document.getElementById('goods-tree-bar')
              let treeTop = treeDom.getBoundingClientRect().top
              treeDom.getElementsByClassName('treebox')[0].scrollTop = 0
              setTimeout(() => {
                let currentDom = treeDom.getElementsByClassName('is-current')[0].getBoundingClientRect().top
                treeDom.getElementsByClassName('treebox')[0].scrollTop = currentDom - treeTop - 50
              }, 10)
            }, 1000)
          }
        }
      }).catch(() => {})
    },
    querySearch (queryString, cb) {
      let params = {
        hsCode: queryString
      }
      let hscodesArr = []
      ajax.getNodeByCode(params).then(res => {
        if (res.data.flag && res.data.result && res.data.result.length > 0) {
          hscodesArr = []
          res.data.result.forEach(e => {
            e.value = `(${e.hsCode})${e.hsDesc}` // 必须要有value
            if (e.value.indexOf(this.queryText) !== -1) {
              hscodesArr.push(e)
            }
          })
          // 调用 callback 返回建议列表的数据
          cb(hscodesArr)
        } else if (res.data.flag && res.data.result && res.data.result.length === 0) {
          hscodesArr = []
          cb(hscodesArr)
        }
      }).catch(() => {})
    },
    handleSelectHsCode (item) {
      this.selectNodeId = item.id
      this.searchParentIds(item.id)
    },
    initDefaultFormTableData (flag, operate = '') {
      // flag为true加载根节点信息，false加载子节点信息
      let params = {}
      if (flag) {
        params.hsCode = 0
      } else {
        params.id = this.currentSelectNode.id
      }
      ajax.getNodeAndChildren(params).then(res => {
        if (res.data.flag) {
          this.allTreeData = res.data.result
          if (this.allTreeData.length > 0 && flag) {
            // 默认加载根节点的hscode信息
            this.allTreeData.forEach(e => {
              if (e.pid === '-1' || e.pid === null || e.pid.indexOf('-1') === 0) {
                this.currentSelectNode = e
              }
            })
            this.rootId = this.currentSelectNode.id
            this.initFormTableData(this.currentSelectNode.id)
          } else if (this.allTreeData.length > 0 && !flag) {
            this.allTreeData.forEach(item => {
              if (this.currentSelectNode.id === item.id) {
                Object.assign(this.currentSelectNode, item)
              }
            })
            // 解决在某一节点选中状态下，修改此节点数据后，直接在此节点上添加子节点，数据不是最新修改的问题
            this.addFormData.forEach(e => {
              if (e.ruleProp === 'code' || e.ruleProp === 'name') {
                e.models = this.currentSelectNode[e.ruleProp]
              }
            })
            this.initFormTableData(this.currentSelectNode.id)
            if (operate === 'add') {
              this.addModalData.flag = true
            } else if (operate === 'edit') {
              ajax.getHSCodeDetail(params).then(res => {
                if (res.data.flag) {
                  this.editFormData.forEach(e => {
                    e.models = res.data.result[e.ruleProp]
                  })
                  this.editModalData.flag = true
                }
              }).catch(() => {})
            }
          }
        }
      }).catch(() => {})
    },
    // 加载hscode信息
    initFormTableData (hscodeId) {
      let params = {
        id: hscodeId
      }
      ajax.getHSCodeDetail(params).then(res => {
        if (res.data.flag) {
          let hscodeObj = {}
          Object.assign(hscodeObj, res.data.result)
          this.formData.forEach(e => {
            e.models = hscodeObj[e.ruleProp]
            if ((e.ruleProp === 'createDate' || e.ruleProp === 'updateDate') && hscodeObj[e.ruleProp] !== null && hscodeObj[e.ruleProp] !== undefined && hscodeObj[e.ruleProp] !== '') {
              e.models = this.$options.filters['formatDate'](hscodeObj[e.ruleProp], this.$t('vicenter.common.formatDate'))
            }
          })
        } else {
        }
      }).catch(() => {})
    },
    // 显示添加模态框
    showAddModel () {
      this.initDefaultFormTableData(false, 'add')
    },
    // 关闭添加模态框
    closeAddModal () {
      this.addFormData.forEach(e => {
        e.models = ''
      })
      this.addModalData.flag = false
      this.$refs['addFormModel'].$refs[this.addFormRule.refName].resetFields()
    },
    // 添加操作
    handleAdd () {
      if (this.addFormRule.rule !== '{}') {
        this.$refs['addFormModel'].$refs[this.addFormRule.refName].validate((valid) => {
          if (valid) {
            this.isAdding = true
            this.addFormData.forEach(e => {
              this.addFormRule.model[e.ruleProp] = e.models
            })
            let { hsCode, hsDesc } = this.addFormRule.model
            let params = {
              hsCode: hsCode,
              hsDesc: hsDesc,
              parentId: this.currentSelectNode.id
            }
            ajax.addHSCode(params).then(res => {
              if (res.data.flag) {
                // 获取新添加的节点的id
                ajax.getHSCodeDetail({hsCode: params.hsCode}).then(res => {
                  if (res.data.flag) {
                    this.goodsOption.isAddTreeData = !this.goodsOption.isAddTreeData
                    this.isAdding = false
                    this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.saveSuccess'))
                    this.closeAddModal()
                    this.goodsOption.addNodeId = res.data.result.id
                    this.goodsOption.currentNodeId = this.currentSelectNode.id
                  }
                }).catch(() => {})
              } else {
                this.isAdding = false
                // this.$NotifError(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.saveError'))
              }
            }).catch(() => {})
          }
        })
      }
    },
    // 显示修改模态框
    showEditModel () {
      this.initDefaultFormTableData(false, 'edit')
    },
    // 关闭添加模态框
    closeEditModal () {
      this.editFormData.forEach(e => {
        e.models = ''
      })
      this.editModalData.flag = false
      this.$refs['editFormModel'].$refs[this.editFormRule.refName].resetFields()
    },
    // 修改操作
    handleEdit () {
      if (this.editFormRule.rule !== '{}') {
        this.$refs['editFormModel'].$refs[this.editFormRule.refName].validate((valid) => {
          if (valid) {
            this.editFormData.forEach(e => {
              this.editFormRule.model[e.ruleProp] = e.models
            })
            let params = {
              id: this.currentSelectNode.id,
              hsDesc: this.editFormRule.model.hsDesc
            }
            ajax.updateHSCode(params).then(res => {
              if (res.data.flag) {
                this.goodsOption.isUpdateTreeData = !this.goodsOption.isUpdateTreeData
                this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.saveSuccess'))
                // this.initFormTableData(params.id)
                this.initDefaultFormTableData(false)
                this.goodsOption.currentNodeId = params.id
                this.closeEditModal()
              } else {
                // this.$NotifError(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.saveError'))
              }
            }).catch(() => {})
          }
        })
      }
    },
    // 删除操作
    deleteHSCode () {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        let params = {
          id: this.currentSelectNode.id
        }
        ajax.deleteHSCode(params).then(res => {
          if (res.data.flag) {
            this.goodsOption.isDeleteTreeData = !this.goodsOption.isDeleteTreeData
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.deleteSuccess'))
            this.allTreeData.forEach(item => {
              if (this.currentSelectNode.pid === item.id) {
                Object.assign(this.currentSelectNode, item)
              }
            })
            this.initFormTableData(this.currentSelectNode.id)
            this.goodsOption.currentNodeId = this.currentSelectNode.id
          } else {
            // this.$NotifError(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.deleteError'))
          }
        }).catch(() => {})
      })
    },
    // hscode树当前点击节点的相关信息
    currentClickGoods (data) {
      this.queryText = ''
      this.currentSelectNode = data
      if (this.currentSelectNode.pid === '-1' || this.currentSelectNode.pid === null) {
        this.isRoot = true
      } else {
        this.isRoot = false
      }
      this.initFormTableData(data.id)
    }
  },
  components: { bread, panelTitle, ComTable, GoodsTree, FormTable, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.HSCode-management-bar {
  @extend .extend-bar;
  .HSCode-management-M {
    padding:$margin;
    @include box-sizing;
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
      .query {
        width: $all;
        height: 65px;
        @include box-sizing;
        padding-left: 15px;
        @include flex(column, flex-start , flex-start);
        .title {
          width: 70%;
          text-align: left;
          line-height: 24px;
          font-size: 14px;
          color: #606266;
        }
        .el-autocomplete {
          width: 70%;
          input {
            height: 32px;
          }
        }
      }
    }
    .infolist {
      .panel {
        @extend .extend-panel;
      }
      .panel-Q {
        @extend .extend-panel-Q;
        width: 40%;
      }
      .panel-L {
        @extend .extend-panel-L;
        width: 60%;
        .formTableBox {
          width: $all;
          padding: 20px;
          box-sizing: border-box;
        }
      }
      @media screen and (max-width: 1640px) {
        .panel-Q {
          width: $all;
        }
        .panel-L {
          width: $all;
        }
      }
    }
    .operationBtn {
      text-align: right;
    }
  }
}
</style>
