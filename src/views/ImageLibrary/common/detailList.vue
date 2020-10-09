<template>
<div class="detailListCont">
  <el-form class="detailList" v-if="isEdit" :model='formRule.model?formRule.model:""' :rules='formRule.rule' :ref='formRule.refName' :data-id='formRule.refName'>
    <el-form-item class='group' v-for='(item,key) in formData' :key='key' :prop='item.ruleProp' :class="{formItemHide: item.isHide}" style='postion:relative'>
      <div class="list-label el-form-item__label" :class="{labelRequired: item.isRequired}">
        <span>{{item.label}}</span>
        <el-button v-if="item.func" class="operateBtn" type="primary" size="mini" @click='item.func'>{{item.funcText}}</el-button>
      </div>
      <div v-if="item.type == 'empty'" :data-id="item.ruleProp + '-form-item'"></div>
      <div v-if="item.type === 'readOnlyText'" class="readOnlyText" :data-id="item.ruleProp + '-form-item'">{{item.value}}</div>
      <el-input v-if="item.type === 'text'" v-model="item.value" :maxlength="item.maxlength || textMaxLength" class="list-info" :disabled="item.disabled" :placeholder="item.placeHolder" :data-id="item.ruleProp + '-form-item'" @input="item.input?item.input():none()" @blur="trimSpace(item.blur, item)"></el-input>
      <el-input v-if="item.type === 'textarea'" v-model="item.value" type="textarea" :maxlength="item.maxlength || textareaMaxLength" :autosize="{ minRows: item.minSize || 1, maxRows: item.maxSize || 3}" resize="none" :placeholder="item.placeHolder" :disabled="item.disabled" :class='item.customClass' :data-id="item.ruleProp + '-form-item'" @blur="trimSpace(item.blur, item)"></el-input>
      <el-select v-if="item.type === 'select'" v-model="item.value" :disabled="item.disabled" :placeholder="item.placeHolder" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" :filterable="item.filterable" :allow-create="item.allowCreate" :data-id="item.ruleProp + '-form-item'">
        <el-option v-for="(items,key) in item.option" :label="items.label" :value="items.value" :disabled="items.disabled" :key='key'></el-option>
      </el-select>
      <el-select v-if="item.type === 'select2'" v-model="item.value" :disabled="item.disabled" :placeholder="item.placeHolder" :collapse-tags="item.collapseTags" multiple @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" @remove-tag="item.removeTag?item.removeTag():none()" :name="item.name" :filterable="item.filterable" :allow-create="item.allowCreate" :data-id="item.ruleProp + '-form-item'">
        <el-option v-for="(items,key) in item.option" :label="items.label" :value="items.value" :disabled="items.disabled" :key='key'></el-option>
      </el-select>
      <el-radio-group v-if="item.type === 'radio'" v-model="item.value" :disabled="item.disabled" :placeholder="item.placeHolder" @change="item.change?item.change():none()" :data-id="item.ruleProp + '-form-item'">
        <el-radio  v-for="(items,key) in item.option" :label="items.value" :name="item.name" :disabled="items.disabled"  @change="item.change?item.change():none()" :key='key'>{{ items.label }}</el-radio>
      </el-radio-group>
      <!--日期选择-->
      <el-date-picker v-if="item.type == 'datetime'" :name="item.name" :type="item.type" v-model="item.value" :placeholder="item.placeHolder" :format="item.format?item.format:$t('vicenter.common.formatDate')" :readonly="item.readonly" :disabled="item.disabled" :clearable="item.clearable" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :value-format="item.valueFormat" :picker-options="item.pickerOptions" :data-id="item.ruleProp + '-form-item'">
      </el-date-picker>
      <div v-if="item.type === 'checkbox'" class="checkboxCont" :class='item.customClass' :data-id="item.ruleProp + '-form-item'">
        <div class="checks" v-bar>
          <div>
            <span class="place-holder" v-if='item.option.length === 0 && item.placeHolder'>{{item.placeHolder}}</span>
            <el-checkbox-group v-model="item.value" :placeholder="item.placeHolder" @change="item.change?item.change():none()" :min="item.min" :max="item.max">
              <el-checkbox  v-for="items in item.option" :label="items.value" :key="items.value" :disabled="items.disabled" :checked="items.checked" :name="items.name" @change="item.change?item.change():none()">{{items.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="operation">
          <el-button type="primary" size="mini" @click='handleSelect' data-id="selected-btn">{{$t('vicenter.common.selected')}}</el-button>
          <el-button type="danger" size="mini" @click='handleDelete' data-id="delete-btn">{{$t('vicenter.common.delete')}}</el-button>
        </div>
      </div>
      <div v-if="item.type === 'table'" class="tableBox" :class='item.customClass' :data-id="item.ruleProp + '-form-item'">
        <ComTable :tableData="item.tableData" :tableGroup="item.tableGroup" ></ComTable>
      </div>
      <!-- 树结构 -->
      <el-input v-if="item.type == 'treeInput'" :id='item.treeIptId' :suffix-icon="item.endIcon"   :prefix-icon="item.StartIcon"  :name="item.name" v-model="item.value" :placeholder='item.placeHolder' :disabled="item.disabled" :readonly='item.readonly' @focus="handleTreeInputFocus" @blur="handleTreeInputBlur" :data-id="item.ruleProp + '-form-item'"></el-input>
      <div v-if="item.type == 'treeInput'"  v-show="item.treeView" class="treeClass">
        <div class="tree-box" v-bar>
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
      <!-- 上传文件 -->
      <div v-if="item.type == 'upload'" class="uploadBox" :class='item.customClass' :data-id="item.ruleProp + '-form-item'">
        <div v-if="isShowSwiper && item.listData.length > 0" class="swiperPreview">
          <Cswiper @deleteAttach="item.deleteAttach" :propOption='item.propOption' :listData='item.listData'></Cswiper>
        </div>
        <div class="uploadButton">
          <upload ref='uploadAttr' :propOption='item.uploadOption'></upload>
        </div>
      </div>
      <!-- 文件展示 -->
      <div v-if="item.type == 'swiper'" class="swiperBox" :data-id="item.ruleProp + '-form-item'">
        <Cswiper v-if="item.listData.length > 0" :propOption='item.propOption' :listData='item.listData'></Cswiper>
        <div class="nodata" v-else>{{$t('vicenter.common.nodata')}}</div>
      </div>
    </el-form-item>
  </el-form>
  <el-form class="detailList" v-else  :model='formRule.model?formRule.model:""' :rules='formRule.rule' :ref='formRule.refName' :data-id='formRule.refName'>
    <el-form-item class='group' v-for='(item,key) in formData' :key='key' :prop='item.ruleProp'>
      <div class="list-label">{{item.label}}</div>
      <div class="readOnlyText" v-if="item.type === 'readOnlyText'" :data-id="item.ruleProp + '-form-item'">{{item.value}}</div>
      <el-input v-model="item.value" class="list-info" disabled v-if="item.type === 'text'" :data-id="item.ruleProp + '-form-item'"></el-input>
      <el-input type="textarea" :autosize="{ minRows: item.minSize || 1, maxRows: item.maxSize || 3}" v-model="item.value" disabled v-if="item.type === 'textarea'" resize="none" :data-id="item.ruleProp + '-form-item'"></el-input>
    </el-form-item>
  </el-form>
  <div class="modal-dialog">
    <Dialog :modalData="HSCodeTreeData">
      <div class="goodsTreeBox" data-id="goodsTree">
        <GoodsTree ref="hscodeTree" :goodsOption="goodsOption" @data="currentCheckGoods"></GoodsTree>
      </div>
      <div class="operationBtn">
        <el-button @click="handleSave" :disabled="saveDisabled" type="primary" size="mini" data-id="sure-btn">{{$t('vicenter.common.sure')}}</el-button>
        <el-button @click="closeModal" size="mini" data-id="cancel-btn">{{$t('vicenter.common.cancel')}}</el-button>
      </div>
    </Dialog>
  </div>
</div>
</template>
<script>
import Dialog from '@/components/dialog'
import GoodsTree from './goodsTree'
import commonAjax from '@/api/background/HSCode.js'
import ComTable from '@/components/table'
import Cswiper from '@/components/swipe'
import upload from '@/components/uploadPreview'
export default {
  data () {
    return {
      textMaxLength: 50, // 文本框最多输入字符数量
      textareaMaxLength: 500, // 文本域最多输入字符数量
      saveDisabled: false,
      maxLimit: null, // 最多添加hscode的数量
      falseFlag: true,
      flagfalse: false,
      treeProp: {
        children: 'children',
        label: 'label'
      },
      HSCodeTreeData: {
        title: this.$t('vicenter.ImageLibrary.common.selectClassification'),
        flag: false,
        resetModal: this.closeModal
      },
      goodsOption: {
        isShowCheckbox: true,
        checkedKeys: [],
        defaultExpandedKeys: [],
        dialogShow: false,
        maxLimit: null
      },
      checkedNodes: [],
      uploadImg: {
        option: {
          propId: 'upload',
          multiple: true,
          data: {},
          action: 'imagelibrary/image/imgupfiles',
          fileList: [],
          previewList: [],
          stop: false,
          imgSize: {
            width: '178px',
            height: '178px'
          },
          listType: 'picture-card',
          handleSuccess: this.handleUploadSuccess,
          beforeUpload: this.handleBeforeUpload,
          preview: {
            name: 'attachFile',
            propId: 'Resattachment',
            width: '100%',
            height: '150px',
            slidesPerView: 2,
            spaceBetween: 20,
            deleteFlag: true,
            navigate: {
              position: 'outside',
              type: 'shadow'
            }
          },
          accept: '.jpg,.jpeg,.tif,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP'
        }
      },
      isShowSwiper: true // 用来上传文件的时候重新加载swiper
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
    deleteAttach () {},
    handleUploadSuccess () {},
    handleBeforeUpload () {},
    getAllChildNodes (nodeId) {
      commonAjax.getGrandChildren({id: nodeId}).then(res => {
        if (res.data.flag) {
          res.data.result.forEach(e => {
            if (!e.hasChild && JSON.stringify(this.checkedNodes).indexOf(e.id) === -1) {
              this.checkedNodes.push({
                value: e.id,
                label: `(${e.code})${e.name}`,
                code: e.code,
                name: e.name
              })
              this.goodsOption.checkedKeys.push(e.id)
            }
          })
        }
      }).catch(() => {})
    },
    currentCheckGoods (checkedData) {
      this.saveDisabled = false
      this.checkedNodes = []
      if (checkedData.checkedNodes && checkedData.checkedNodes.length > 0) {
        checkedData.checkedNodes.forEach(e => {
          this.getAllChildNodes(e.id)
        })
      } else if (checkedData.checkedNodes && checkedData.checkedNodes.length === 0) {
        this.checkedNodes = []
        this.goodsOption.checkedKeys = []
      }
    },
    handleSave () {
      this.$props.formData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          this.maxLimit = e.maxLimit
        }
      })
      if (this.maxLimit && this.checkedNodes.length > this.maxLimit) {
        this.$NotifError(this.$t('vicenter.ImageLibrary.common.limitGoodsQuantity', {msg: this.maxLimit}))
        this.saveDisabled = true
        return
      } else {
        this.saveDisabled = false
      }
      this.$props.formData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          e.option = []
          e.option = this.checkedNodes
        }
        if (e.ruleProp === 'hsNames') {
          if (this.checkedNodes.length > 0) {
            let namesArr = []
            this.checkedNodes.forEach(item => {
              namesArr.push(item.name)
            })
            e.value = namesArr.join(',')
          }
        }
      })
      this.HSCodeTreeData.flag = false
      this.goodsOption.dialogShow = false
    },
    closeModal () {
      this.HSCodeTreeData.flag = false
      this.goodsOption.dialogShow = false
      this.saveDisabled = false
    },
    none () {
      return false
    },
    handleSelect () {
      this.goodsOption.checkedKeys = []
      this.$props.formData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          this.checkedNodes = e.option
          e.option.forEach(op => {
            // 树结构默认选中值设置
            this.goodsOption.checkedKeys.push(op.value)
          })
        }
      })
      this.HSCodeTreeData.flag = true
      this.goodsOption.dialogShow = true
    },
    handleDelete () {
      this.goodsOption.checkedKeys = []
      let tempOption = []
      this.$props.formData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          // 去掉选中的option项
          e.option.forEach(op => {
            if (e.value.indexOf(op.value) < 0) {
              tempOption.push(op)
              this.goodsOption.checkedKeys.push(op.value)
            }
          })
          this.checkedNodes = tempOption
          e.option = tempOption
          // 清除复选框的选中状态
          e.value = []
        }
        if (e.ruleProp === 'hsNames') {
          if (this.checkedNodes.length > 0) {
            let namesArr = []
            this.checkedNodes.forEach(item => {
              namesArr.push(item.name)
            })
            e.value = namesArr.join(',')
          } else {
            e.value = ''
          }
        }
      })
    },
    // 清空所有的hscode
    emptyHscode () {
      this.goodsOption.checkedKeys = []
      this.$props.formData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          this.checkedNodes = []
          e.option = []
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
          if (typeof (newValue[k].models) === 'string') {
            this.$props.formRule.model[newValue[k].ruleProp] = newValue[k].value.replace(/(^\s*)|(\s*$)/g, '')
          } else {
            this.$props.formRule.model[newValue[k].ruleProp] = newValue[k].value
          }
          if (newValue[k].type === 'upload') {
            this.isShowSwiper = false
            this.$nextTick(() => {
              this.isShowSwiper = true
            })
          }
        }
      },
      deep: true
    }
  },
  components: { Dialog, GoodsTree, ComTable, Cswiper, upload },
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
    },
    'formClass': {
      required: false
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.detailListCont {
  width: $all;
  .detailList{
    @include flex(row, flex-start, flex-start);
    flex-wrap: wrap;
    .formItemHide {
      visibility: hidden!important;
    }
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
        height: 115px;
        @include flex(row, space-between, flex-start);
        .checks {
          width: calc(100% - 80px);
          height: $all;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          @include box-sizing();
          .place-holder{
            padding: 0 15px;
            color: #c0c4cc;
          }
          .el-checkbox-group {
            padding: 5px;
            .el-checkbox {
              margin-left: 0;
              .el-checkbox__label {
                white-space: normal;
                vertical-align: middle;
              }
            }
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
      .tableBox {
        width: $all;
        height: auto;
      }
      .swiperBox {
        .nodata {
          line-height: 40px;
          color: $text2;
        }
      }
      .uploadBox {
        width: $all;
        display: flex;
        .uploadButton{
          width: 120px;
          ul{
            display: none;
          }
          .el-upload--picture-card {
            width: 120px;
            height: 120px;
            position: relative;
            cursor: pointer;
            .el-icon-plus {
              line-height: 120px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
            }
          }
        }
        .swiperPreview{
          width: 75%;
          .swiper-slide {
            display: flex;
            align-items: center;
            margin-top: 10px;
          }
          .swiper-container-box {
            .swiper-slide {
              position: relative;
              .delicon {
                position: absolute;
                top: 0;
                right: 0;
                line-height: 0;
                cursor: pointer;
                button {
                  padding: 0;
                  .iconfont {
                    margin: 0;
                  }
                }
              }
            }
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
        position: relative;
        .operateBtn {
          position: absolute;
          top: 0;
          right: $dis10;
        }
      }
      .labelRequired::after {
        content: "*";
        color: $danger;
        margin-left: 4px;
      }
      .treeClass{
        position: absolute;
        top: 70px;
        z-index: 5000;
        width: $all;
        height: 200px;
        overflow: hidden;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        border-top: none;
        @include box-sizing();
        .tree-box {
          width: $all;
          height:$all;
          overflow: hidden;
        }
      }
    }
    .el-form-item {
      margin-bottom: 7px;
      .el-form-item__content {
        width: 100%;
        .el-input__inner {
          height: 32px!important;
          line-height: 32px;
        }
        .el-select {
          width: $all;
        }
        .el-date-editor {
          width: $all;
        }
      }
    }
    @media screen and (max-width: 1600px) {
      .group {
        // width: $all/2;
      }
    }
    .fileImg {
      @include flex(column, center, center);
      .fileName {
        line-height: 12px;
        padding: 5px;
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
        // overflow: hidden
        overflow: auto;
        margin-bottom: $dis10;
      }
      .operationBtn {
        text-align: right;
      }
    }
  }
}
</style>
