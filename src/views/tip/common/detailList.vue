<template>
<div class="tipDetailListCont">
  <el-form class="tipDetailList" v-if="isEdit" :model='formRule.model?formRule.model:""' :rules='formRule.rule' :ref='formRule.refName' :data-id='formRule.refName'>
    <el-form-item class='group' v-for='(item,key) in formData' :key='key' :prop='item.ruleProp'>
      <div class="list-label el-form-item__label">{{item.label}}</div>
      <div v-if="item.type === 'readOnlyText'" class="readOnlyText" :data-id="item.ruleProp + '-form-item'">{{item.value}}</div>
      <el-input v-if="item.type === 'text'" v-model="item.value" class="list-info" :disabled="item.disabled" :placeholder="item.placeHolder" :maxlength="item.maxlength || textMaxLength" :data-id="item.ruleProp + '-form-item'" @blur="trimSpace(item.blur, item)"></el-input>
      <el-input v-if="item.type === 'textarea'" v-model="item.value" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" resize="none" :placeholder="item.placeHolder" :maxlength="item.maxlength || textareaMaxLength" :data-id="item.ruleProp + '-form-item'" @blur="trimSpace(item.blur, item)" ></el-input>
      <el-select v-if="item.type === 'select'" v-model="item.value" :disabled="item.disabled" :placeholder="item.placeHolder" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" :filterable="item.filterable" :allow-create="item.allowCreate" :data-id="item.ruleProp + '-form-item'">
        <el-option v-for="(items,key) in item.option" :label="items.label" :value="items.value" :disabled="items.disabled" :key='key'></el-option>
      </el-select>
      <el-select v-if="item.type === 'select2'" v-model="item.value" :disabled="item.disabled" :placeholder="item.placeHolder" multiple @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" @remove-tag="item.removeTag?item.removeTag():none()" :name="item.name" :filterable="item.filterable" :allow-create="item.allowCreate" :data-id="item.ruleProp + '-form-item'">
        <el-option v-for="(items,key) in item.option" :label="items.label" :value="items.value" :disabled="items.disabled" :key='key'></el-option>
      </el-select>
      <el-radio-group v-if="item.type === 'radio'" v-model="item.value" :disabled="item.disabled" :placeholder="item.placeHolder" @change="item.change?item.change():none()" :data-id="item.ruleProp + '-form-item'">
        <el-radio  v-for="(items,key) in item.option" :label="items.value" :name="item.name" :disabled="items.disabled"  @change="item.change?item.change():none()" :key='key'>{{ items.label }}</el-radio>
      </el-radio-group>
      <div v-if="item.type === 'checkbox'" class="checkboxCont" :data-id="item.ruleProp + '-form-item'">
        <div class="checks" v-bar>
          <div>
            <el-checkbox-group v-model="item.value" :placeholder="item.placeHolder" @change="item.change?item.change():none()" :min="item.min" :max="item.max">
              <el-checkbox  v-for="items in item.option" :label="items.value" :key="items.value" :disabled="items.disabled" :checked="items.checked" :name="items.name" @change="item.change?item.change():none()">{{items.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <!-- 树结构 -->
      <el-input v-if="item.type == 'treeInput'" :id='item.treeIptId' :suffix-icon="item.endIcon"   :prefix-icon="item.StartIcon"  :name="item.name" v-model="item.value" :placeholder='item.placeHolder' :disabled="item.disabled" :readonly='item.readonly' @focus="handleTreeInputFocus" @blur="handleTreeInputBlur" :data-id="item.ruleProp + '-form-item'"></el-input>
      <div v-if="item.type == 'treeInput'"  v-show="item.treeView" class="treeClass">
        <div class="tree-box">
          <el-tree
            :expand-on-click-node='flagfalse'
            :id='item.treeDataId'
            :data="item.treedata"
            :props="item.TreeProps?item.TreeProps:treeProp"
            @node-click="item.treeClick"
            node-key='id'
            :ref="item.treeRefName"
            default-expand-all>
          </el-tree>
        </div>
      </div>
    </el-form-item>
  </el-form>
  <el-form class="tipDetailList" v-else  :model='formRule.model?formRule.model:""' :rules='formRule.rule' :ref='formRule.refName' :data-id='formRule.refName'>
    <el-form-item class='group' v-for='(item,key) in formData' :key='key' :prop='item.ruleProp'>
      <div class="list-label">{{item.label}}</div>
      <div class="readOnlyText" v-if="item.type === 'readOnlyText'" :data-id="item.ruleProp + '-form-item'">{{item.value}}</div>
      <el-input v-model="item.value" class="list-info" disabled v-if="item.type === 'text'" :data-id="item.ruleProp + '-form-item'"></el-input>
      <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}" v-model="item.value" disabled v-if="item.type === 'textarea'" resize="none" :data-id="item.ruleProp + '-form-item'"></el-input>
    </el-form-item>
  </el-form>
  <div class="modal-dialog">
    <Dialog :modalData="HSCodeTreeData">
      <div class="goodsTreeBox" v-bar data-id="goodsTree">
        <GoodsTree v-if="showTree" :goodsOption="goodsOption" @data="currentCheckGoods"></GoodsTree>
      </div>
      <div class="operationBtn">
        <el-button @click="handleSave" type="primary" size="mini" data-id="sure-btn">{{$t('vicenter.common.sure')}}</el-button>
        <el-button @click="closeModal" size="mini" data-id="cancel-btn">{{$t('vicenter.common.cancel')}}</el-button>
      </div>
    </Dialog>
  </div>
</div>
</template>
<script>
import Dialog from '@/components/dialog'
import GoodsTree from './goodsTree'
export default {
  data () {
    return {
      textMaxLength: 50, // 文本框最多输入字符数量
      textareaMaxLength: 500, // 文本域最多输入字符数量
      showTree: false,
      falseFlag: true,
      flagfalse: false,
      treeProp: {
        children: 'children',
        label: 'label'
      },
      HSCodeTreeData: {
        title: this.$t('vicenter.ImageLibrary.common.selectClassification'),
        flag: false
      },
      goodsOption: {
        isShowCheckbox: true,
        checkedKeys: [],
        defaultExpandedKeys: []
      },
      checkedNodes: []
    }
  },
  mounted () {
    for (let k = 0; k < this.$props.formData.length; k++) {
      if (this.$props.formData[k].type === 'treeInput') {
        this.$props.formData[k].treeView = false
      }
    }
  },
  methods: {
    trimSpace (func, item) {
      item.value = this.$trim(item.value)
      if (func) {
        func()
      }
    },
    currentCheckGoods (checkedData) {
      this.checkedNodes = []
      checkedData.checkedNodes.forEach(e => {
        this.checkedNodes.push({
          value: e.id,
          label: `(${e.code})${e.name}`,
          code: e.code
        })
      })
    },
    handleSave () {
      this.$props.formData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          e.option = []
          e.option = this.checkedNodes
        }
      })
      this.showTree = false
      this.HSCodeTreeData.flag = false
    },
    closeModal () {
      this.showTree = false
      this.HSCodeTreeData.flag = false
    },
    none () {
      return false
    },
    handleSelect () {
      this.goodsOption.checkedKeys = []
      this.$props.formData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          e.option.forEach(op => {
            // 树结构默认选中值设置
            this.goodsOption.checkedKeys.push(op.value)
          })
        }
      })
      this.showTree = true
      this.HSCodeTreeData.flag = true
    },
    handleDelete () {
      let tempOption = []
      this.$props.formData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          // 去掉选中的option项
          e.option.forEach(op => {
            if (e.value.indexOf(op.value) < 0) {
              tempOption.push(op)
            }
          })
          this.checkedNodes = tempOption
          e.option = tempOption
          // 清除复选框的选中状态
          e.value = []
        }
      })
    },
    handleTreeInputFocus (e) {
      for (let k = 0; k < this.$props.formData.length; k++) {
        if (this.$props.formData[k].type === 'treeInput') {
          if (e.target.id === this.$props.formData[k].treeIptId || e.target.id === this.$props.formData[k].treeDataId) {
            this.$props.formData[k].treeView = true
          } else {
            this.$props.formData[k].treeView = false
          }
        }
      }
    },
    handleTreeInputBlur () {
      for (let k = 0; k < this.$props.formData.length; k++) {
        if (this.$props.formData[k].type === 'treeInput') {
          document.body.addEventListener('click', (e) => {
            if (this.$props.formData[k].treeIptId) {
              if (e.target.id === this.$props.formData[k].treeIptId || e.target.id === this.$props.formData[k].treeDataId) {
                this.$props.formData[k].treeView = true
              } else {
                this.$props.formData[k].treeView = false
              }
            }
          })
        }
      }
    }
  },
  watch: {
    'formData': {
      handler (newValue, oldValue) {
        for (let k = 0; k < newValue.length; k++) {
          if ((newValue[k].type !== 'treeInput') && typeof (newValue[k].models) === 'string') {
            this.$props.formRule.model[newValue[k].ruleProp] = newValue[k].value.replace(/(^\s*)|(\s*$)/g, '')
          } else if (newValue[k].type !== 'treeInput') {
            this.$props.formRule.model[newValue[k].ruleProp] = newValue[k].value
          }
        }
      },
      deep: true
    }
  },
  components: { Dialog, GoodsTree },
  props: {
    'formData': {
      type: Array,
      default: []
    },
    'isEdit': {
      type: Boolean,
      default: true
    },
    'formRule': {
      required: false
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.tipDetailListCont {
  width: $all;
  .tipDetailList{
    @include flex(row, flex-start, flex-start);
    flex-wrap: wrap;
    .group {
      width: 33%;
      padding: 0 $margin;
      @include box-sizing();
      @include flex(row, flex-start, flex-start);
      text-align: left;
      line-height: 40px;
      font-size: $texts;
      .readOnlyText {
        width: $all;
      }
      .checkboxCont {
        width: $all;
        height: 80px;
        @include flex(row, space-between, flex-start);
        .checks {
          width: calc(100% - 80px);
          height: $all;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          @include box-sizing();
          .el-checkbox-group {
            padding: 5px;
          }
        }
        .operation {
          width: 70px;
          height: $all;
          @include flex(column, space-around, flex-start);
          .el-button {
            margin: 0!important;
          }
        }
      }
      .list-label{
        width: $all;
        height: 32px;
        line-height: 32px;
        font-size: $texts;
        color: #606266;
        padding: 0 12px 0 0;
        @include box-sizing();
        text-align: left;
      }
      .treeClass{
        position: absolute;
        top: 64px;
        z-index: 1000;
        width: $all;
        height: 200px;
        // border-radius: 4px;
        border: 1px solid #dcdfe6;
        overflow: hidden;
        // border-bottom: none;
        // @include box-sizing();
        .tree-box {
          width: $all;
          height:$all;
          overflow: auto;
          .el-tree>.el-tree-node{
            min-width: $all;
            display: inline-block!important;
          }
        }
      }
    }
    .el-form-item {
      margin-bottom: 16px;
      .el-form-item__content {
        width: 100%;
        line-height: 0px;
        .el-input__inner {
          height: 32px!important;
          line-height: 32px;
        }
        .el-select {
          width: $all;
        }
      }
    }
    @media screen and (max-width: 1640px) {
      .group {
        width: $all;
      }
    }
  }
  .el-dialog {
    width: 35%!important;
    .el-dialog__body {
      padding-top: $dis10;
      .goodsTreeBox {
        width: $all;
        height: 400px;
        overflow: hidden;
        margin-bottom: $dis10;
      }
      .operationBtn {
        text-align: right;
      }
    }
  }
}
</style>
