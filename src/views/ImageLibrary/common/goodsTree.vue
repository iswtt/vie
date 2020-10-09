<template>
  <div id='goods-tree-bar'>
    <el-autocomplete
    v-if="options.hscodeTreeQuery"
    name='hscodeTreeQuery'
    class="inline-input hscodeTreeQuery"
    v-model="queryText"
    :fetch-suggestions="hscodequerySearch"
    :placeholder="$t('vicenter.ImageLibrary.common.inputHsCodes')"
    :trigger-on-focus="false"
    @select="handleSelectHsCode">
    </el-autocomplete>
    <el-input v-if="options.hscodePosition" ref="hscodeFilter" class="filterIpt" name='hscodeTreeQuery' :placeholder="$t('vicenter.ImageLibrary.common.Search')" v-model="filterVal" @change="handleChangeSearch"></el-input>
    <div class="treebox" :class="{maxHeight: options.isShowQueryIpt}" v-loading="uploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
      <!-- <el-input v-if="isShowFilterIpt" class="filterIpt" :placeholder="$t('vicenter.ImageLibrary.common.Search')" v-model="filterText"></el-input> -->
      <el-tree
        ref='goodsTree'
        :props="options.default"
        :class="{checkTree: options.isShowCheckbox}"
        @node-click="options.treeClick"
        @check="options.check"
        :empty-text='options.EmptyText'
        :show-checkbox="options.isShowCheckbox"
        highlight-current
        :expand-on-click-node='false'
        :filter-node-method="filterNode"
        :check-strictly='false'
        :load="loadGoodsTreeNodes"
        lazy
        :default-expanded-keys='options.defaultExpandedKeys'
        node-key='id'>
        <span class="custom-tree-node" :data-id="'hsCodeTree'+data.code+'-span'" slot-scope="{ node, data }">{{node.label}}</span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import commonAjax from '@/api/background/HSCode.js' // 接口文件
import { setTimeout } from 'timers'
export default {
  name: 'goodsTree',
  data () {
    return {
      filterVal: '',
      queryText: '',
      isShowFilterIpt: false,
      uploading: false,
      uploadingTxt: this.$t('vicenter.common.loading'),
      filterText: '',
      trueflag: true,
      falseflag: false,
      options: {
        EmptyText: this.$t('vicenter.ImageLibrary.common.NoData'),
        data: [],
        default: {
          children: 'children',
          label: this.resetNodeLabel,
          isLeaf: 'leaf'
        },
        treeClick: this.goodsTreeClick,
        check: this.goodsTreeCheck,
        defaultExpandedKeys: [],
        rootId: '',
        currentId: '',
        parentId: '',
        isFirstLoad: true,
        treeNode: '',
        treeResolve: '',
        isShowQueryIpt: true, // 是否显示搜索框
        hscodeTreeQuery: true,
        hscodePosition: false
      },
      selectHscodeNode: ''
    }
  },
  created () {
    Object.assign(this.options, this.$props.goodsOption)
  },
  mounted () {},
  methods: {
    setCheckedNodes () {
      // console.log('checkedKeys', this.options.checkedKeys)
      this.$refs.goodsTree.setCheckedKeys(this.options.checkedKeys)
    },
    hscodequerySearch (queryString, cb) {
      let params = {
        hsCode: queryString
      }
      let hscodesArr = []
      commonAjax.getNodeByCode(params).then(res => {
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
      this.selectHscodeNode = item.id
      let params = {
        id: item.id
      }
      this.getsearchParentIds(params)
    },
    handleChangeSearch (nodeCode) {
      let params = {
        hsCode: nodeCode
      }
      this.getsearchParentIds(params)
    },
    getsearchParentIds (params) {
      commonAjax.getHSCodeDetail(params).then(res => {
        if (res.data.flag) {
          let data = res.data.result
          if (params.hsCode) {
            this.selectHscodeNode = data.id
          }
          if (this.options.defaultExpandedKeys.indexOf(data.parentId) < 0) {
            this.options.defaultExpandedKeys.push(data.parentId)
            this.getsearchParentIds({id: data.parentId})
          } else {
            setTimeout(() => {
              this.$refs.goodsTree.setCurrentKey(this.selectHscodeNode)
              if (this.selectHscodeNode === this.rootId) {
                this.isRoot = true
              } else {
                this.isRoot = false
              }
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
    goodsTreeClick (nodeObj) {
      this.currentId = nodeObj.id
      this.parentId = nodeObj.pid
      this.$emit('data', nodeObj)
    },
    goodsTreeCheck (nodeObj, checkData) {
      this.$emit('data', checkData)
      if (this.options.hscodePosition) {
        this.filterVal = ''
      }
    },
    ajaxTree () { // 获取货物分类树方法
      commonAjax.getHSCodeTree().then(res => {
        if (res.data.flag) {
          this.uploading = false
          let treeData = this.$json2treeData(res.data.result, 'id', 'pid')
          this.options.data = treeData
          this.$nextTick(function () {
            if (!this.options.isShowCheckbox && !this.options.currentNodeId) {
              this.$refs.goodsTree.setCurrentKey(this.options.data[0].id)
            } else if (!this.options.isShowCheckbox && this.options.currentNodeId) {
              this.$refs.goodsTree.setCurrentKey(this.options.currentNodeId)
            }
          })
        }
      }).catch(() => {})
    },
    resetNodeLabel (data, node) {
      // 重写节点的label显示内容
      return `(${data.code}) ${data.name}`
    },
    filterNode (value, data) {
      if (!value) {
        return true
      } else {
        return data.name.indexOf(value) !== -1
      }
    },
    loadGoodsTreeNodes (node, resolve) {
      if (this.isFirstLoad) {
        this.treeNode = node
        this.treeResolve = resolve
        this.isFirstLoad = false
      }
      let treeData = []
      let params = {}
      if (node.level === 0) {
        // 请求根节点数据
        params.hsCode = 0
        commonAjax.getNodeAndChildren(params).then(res => {
          if (res.data.flag && res.data.result.length > 0) {
            this.isShowFilterIpt = true
            res.data.result.forEach(e => {
              if (e.pid === '-1' || e.pid === null || e.pid.indexOf('-1') === 0) {
                e.leaf = !e.hasChild
                e.disabled = true
                treeData.push(e)
                if (!this.options.isShowCheckbox && !this.options.currentNodeId) {
                  setTimeout(() => {
                    this.rootId = e.id
                    this.options.defaultExpandedKeys.push(e.id)
                    this.$refs.goodsTree.setCurrentKey(e.id)
                  }, 10)
                } else if (!this.options.isShowCheckbox && this.options.currentNodeId) {
                  this.$refs.goodsTree.setCurrentKey(this.options.currentNodeId)
                } else if (this.options.isShowCheckbox) {
                  if (this.options.checkedKeys && this.options.checkedKeys.length > 0) {
                    this.options.defaultExpandedKeys.push(e.id)
                    this.options.checkedKeys.forEach(e => {
                      this.searchParentIds(e)
                    })
                  } else {
                    this.options.defaultExpandedKeys.push(e.id)
                  }
                }
              }
            })
            resolve(treeData)
          }
        }).catch(() => {})
      } else {
        // 请求当前点击节点的数据
        params.id = node.data.id
        commonAjax.getNodeAndChildren(params).then(res => {
          if (res.data.flag) {
            res.data.result.forEach(e => {
              if (e.pid === node.data.id) {
                e.leaf = !e.hasChild
                treeData.push(e)
              }
            })
            resolve(treeData)
            this.setCheckedNodes()
          }
        }).catch(() => {})
      }
    },
    searchParentIds (nodeId) {
      commonAjax.getHSCodeDetail({id: nodeId}).then(res => {
        if (res.data.flag) {
          let data = res.data.result
          if (this.options.defaultExpandedKeys.indexOf(data.parentId) < 0) {
            this.options.defaultExpandedKeys.push(data.parentId)
            if (data.parentId !== this.rootId) {
              this.searchParentIds(data.parentId)
            }
          }
        }
      }).catch(() => {})
    }
  },
  watch: {
    'goodsOption.dialogShow': {
      handler (newValue, oldValue) {
        if (newValue) {
          this.$refs.goodsTree.setCheckedKeys(this.goodsOption.checkedKeys)
          this.goodsOption.checkedKeys.forEach(checkedId => {
            this.searchParentIds(checkedId)
          })
        }
      },
      deep: true
    },
    'goodsOption.checkedKeys': {
      handler (newValue, oldValue) {
        // console.log('checkedKeys', newValue)
        this.options.checkedKeys = newValue
      },
      immediate: true,
      deep: true
    },
    'goodsOption.defaultExpandedKeys': {
      handler (newValue, oldValue) {
        // console.log('defaultExpandedKeys', newValue)
        if (newValue && newValue.length > 0) {
          this.options.defaultExpandedKeys = newValue
        } else {
          this.options.defaultExpandedKeys = []
        }
      },
      immediate: true,
      deep: true
    },
    filterText (newVal) {
      this.$refs.goodsTree.filter(newVal)
    },
    'goodsOption.isUpdateTreeData' (newVal, oldVal) {
      if (newVal !== oldVal) {
        Object.assign(this.options, this.$props.goodsOption)
        this.loadGoodsTreeNodes(this.$refs.goodsTree.getNode(this.options.currentNodeId), this.treeResolve)
      }
    },
    'goodsOption.isDeleteTreeData' (newVal, oldVal) {
      if (newVal !== oldVal) {
        Object.assign(this.options, this.$props.goodsOption)
        this.$refs.goodsTree.remove(this.$refs.goodsTree.getNode(this.currentId))
        // 选中父节点
        // this.$refs.goodsTree.setCurrentKey(this.parentId)
      }
    },
    'goodsOption.isAddTreeData' (newVal, oldVal) {
      if (newVal !== oldVal) {
        commonAjax.getNodeAndChildren({id: this.$props.goodsOption.currentNodeId}).then(res => {
          if (res.data.flag && res.data.result.length > 0) {
            res.data.result.forEach(e => {
              if (e.pid === this.$props.goodsOption.currentNodeId && e.id === this.$props.goodsOption.addNodeId) {
                this.$refs.goodsTree.append(e, this.$props.goodsOption.currentNodeId)
              }
            })
          }
        }).catch(() => {})
      }
    }
  },
  props: {
    'goodsOption': {
      type: Object,
      default: {
        isShowCheckbox: false, // 是否显示复选框
        checkedKeys: [], // 默认选中值,
        isUpdateTreeData: false,
        isAddTreeData: false,
        addNodeId: '',
        currentNodeId: '',
        dialogShow: false,
        defaultExpandedKeys: [],
        isShowQueryIpt: true, // 是否显示搜索框
        hscodeTreeQuery: true,
        hscodePosition: false // 改版的hscode选取（查询条件）
      }
    }
  }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#goods-tree-bar {
  @extend .extend-bar;
  .filterIpt {
    width: $all;
    line-height: 40px;
    .el-input__inner {
      height: 32px;
    }
  }
  .treebox {
    width: $all;
    height: $all;
    overflow: auto;
    .el-tree>.el-tree-node{
      min-width: $all;
      display: inline-block!important;
    }
    .checkTree {
      .el-tree-node__content {
        background: none!important;
        color: #606266!important;
      }
    }
  }
  .hscodeTreeQuery{
    width: 100%;
    height: 32px;
    input{
      height: 32px;
    }
  }
  .maxHeight {
    height: calc(100% - 40px);
  }
}
.el-form-item.is-error #goods-tree-bar .filterIpt .el-input__inner,
.el-form-item.is-success #goods-tree-bar .filterIpt .el-input__inner {
  border-color: #c1c4cc;
}
</style>
