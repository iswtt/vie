<template>
  <div id='goods-tree-bar' v-bar>
    <div class="treebox">
      <el-input v-if="options.data.length > 0" class="filterIpt" :placeholder="$t('vicenter.ImageLibrary.common.Search')" v-model="filterText"></el-input>
      <el-tree
        ref='goodsTree'
        :props="options.default"
        :class="{checkTree: options.isShowCheckbox}"
        :data="options.data"
        @node-click="options.treeClick"
        @check="options.check"
        :empty-text='options.EmptyText'
        :show-checkbox="options.isShowCheckbox"
        :default-checked-keys="options.checkedKeys"
        default-expand-all
        highlight-current
        :expand-on-click-node='falseflag'
        :filter-node-method="filterNode"
        :check-strictly='true'
        node-key='id'>
        <span class="custom-tree-node" slot-scope="{ node }">{{node.label}}</span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import commonAjax from '@/api/background/HSCode.js' // 接口文件
import ComForm from '@/components/form'
export default {
  name: 'goodsTree',
  data () {
    return {
      filterText: '',
      trueflag: true,
      falseflag: false,
      options: {
        EmptyText: this.$t('vicenter.ImageLibrary.common.NoData'),
        data: [],
        default: {
          children: 'children',
          label: this.resetNodeLabel
        },
        treeClick: this.goodsTreeClick,
        check: this.goodsTreeCheck
      }
    }
  },
  created () {
    Object.assign(this.options, this.$props.goodsOption)
    this.ajaxTree()
  },
  mounted () {
  },
  methods: {
    goodsTreeClick (nodeObj) {
      this.$emit('data', nodeObj)
    },
    goodsTreeCheck (nodeObj, checkData) {
      this.$emit('data', checkData)
    },
    ajaxTree () { // 获取货物分类树方法
      commonAjax.getHSCodeTree().then(res => {
        if (res.data.flag) {
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
    }
  },
  watch: {
    filterText (newVal) {
      this.$refs.goodsTree.filter(newVal)
    },
    'goodsOption.isUpdateTreeData' (newVal, oldVal) {
      if (newVal !== oldVal) {
        Object.assign(this.options, this.$props.goodsOption)
        this.ajaxTree()
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
        currentNodeId: ''
      }
    }
  },
  components: { ComForm }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#goods-tree-bar {
  @extend .extend-bar;
  .filterIpt {
    .el-input__inner {
      width: calc(100% - 20px);
      height: 32px;
      margin: 5px 10px;
    }
  }
  .checkTree {
    .el-tree-node__content {
      background: none!important;
      color: #606266!important;
    }
  }
}
</style>
