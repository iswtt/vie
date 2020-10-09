<template>
    <el-form :validate-on-rule-change='false' :model='formRule.model?formRule.model:""' :rules='formRule.rule' :class="fromClass.form" :size="fromClass.formSize" :ref='formRule.refName' :data-id='formRule.refName'>
      <el-form-item  v-for="(item, index) in searchIpt"  :class="[fromClass.formItem, {'el-form-iten-hiden': item.hiden}]" :key='index' :prop='item.ruleProp'>
        <div class="pack" v-if="!item.hiden">
          <div class="list-label">
            <label class="el-form-item__label" :class="fromClass.label" :title="item.getLabel">{{item.getLabel}}</label>
            <el-button :disabled="item.disabled" v-if="item.func" class="operateBtn" type="primary" size="mini" @click='item.func'>{{item.funcText}}</el-button>
          </div>
          <!--文本输入，带插槽-->
          <div v-if="item.type == 'empty'" :data-id="item.ruleProp + '-form-item'">
            <div :class="fromClass.iptClass"></div>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!-- isFilterSpecialChar字段表示是否过滤特殊字符(不加此字段或者此字段为false则默认不禁止特殊字符输入) -->
          <div v-if="item.type == 'text' && item.isFilterSpecialChar" :data-id="item.ruleProp + '-form-item'">
            <el-input v-filterSpecialChar="{isReset: isReset, resetIptNum: resetIptNum, setData: setData, filterRule: item.filterRule ? item.filterRule : filterRule}" @blur="trimSpace(item.blur, item, $event)" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" v-model="item.models" v-bind:placeholder='item.placeHolder' :class="fromClass.iptClass" :disabled="item.disabled" :maxlength="item.maxlength || textMaxLength" :suffix-icon="item.endIcon"  :prefix-icon="item.StartIcon" :readonly='item.readonly'></el-input>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <div v-if="item.type == 'text' && !item.isFilterSpecialChar" :data-id="item.ruleProp + '-form-item'">
            <el-input @blur="trimSpace(item.blur, item, $event)" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" v-model="item.models" v-bind:placeholder='item.placeHolder' :class="fromClass.iptClass" :disabled="item.disabled" :maxlength="item.maxlength || textMaxLength" :suffix-icon="item.endIcon"  :prefix-icon="item.StartIcon" :readonly='item.readonly'></el-input>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!-- 带操作按钮的文本框 -->
          <el-input v-if="item.type == 'textAndBtn'" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" v-model="item.models" v-bind:placeholder='item.placeHolder' :class="fromClass.iptClass" :disabled="item.disabled" :maxlength="item.maxlength" :suffix-icon="item.endIcon"  :prefix-icon="item.StartIcon" :readonly='item.readonly' :data-id="item.ruleProp + '-form-item'">
            <template slot="append">
              <el-button type="text" class="iconfont" :disabled="item.btnDisabled" :title="item.btnTitle" @click="item.btnFun?item.btnFun():none()">&#xe676;</el-button>
            </template>
          </el-input>
          <!-- 带输入建议的文本框 -->
          <el-autocomplete v-if="item.type == 'autocomplete'" v-model="item.models" :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,item.allData)})"  @select="((selectedObj)=>{handleAutoComplete(selectedObj,item.select)})" :placeholder='item.placeHolder' :name="item.name" :trigger-on-focus="false" :data-id="item.ruleProp + '-form-item'">
            <template slot-scope="{ item }">
              <span>{{ item.value }}</span>
              <!-- <span>{{ item.name }}</span> -->
            </template>
          </el-autocomplete>
          <!--密码输入-->
          <el-input v-if="item.type == 'password' && item.ruleProp != 'password'" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" v-model="item.models" v-bind:placeholder='item.placeHolder' :class="fromClass.iptClass" :disabled="item.disabled" :maxlength="item.maxlength" :suffix-icon="item.endIcon"  :prefix-icon="item.StartIcon" type="password" :data-id="item.ruleProp + '-form-item'"></el-input>
          <!--加提示框的密码输入-->
          <el-tooltip class="item" effect="dark" :content="item.tipPassrule" placement="top-end" :data-id="item.ruleProp + '-form-item'">
            <el-input v-if="item.type == 'password' && item.ruleProp == 'password'" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" v-model="item.models" v-bind:placeholder='item.placeHolder' :class="fromClass.iptClass" :disabled="item.disabled" :maxlength="item.maxlength" :suffix-icon="item.endIcon"  :prefix-icon="item.StartIcon" type="password"></el-input>
          </el-tooltip>
          <!--文本域textarea，带插槽-->
          <div v-if="item.type == 'textarea'" :data-id="item.ruleProp + '-form-item'">
            <el-input type="textarea" :rows="item.rows" :maxlength="item.maxlength || textareaMaxLength" :autosize="{ minRows: item.minSize?item.minSize:1, maxRows: item.autoSize}" v-model="item.models" v-bind:placeholder='item.placeHolder' :class="fromClass.areaClass" @blur="trimSpace(item.blur, item)" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" resize="none" :disabled="item.disabled"></el-input>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!-- 颜色选择框 -->
          <el-color-picker v-else-if="item.type == 'color'" :predefine="colorPredefine" :size="item.size" v-model="item.models" class="colorStyle" :class="fromClass.colorClass" @change="item.change?item.change():none()" @activeChange="item.activeChange?item.activeChange():none()" :data-id="item.ruleProp + '-form-item'"></el-color-picker>
          <!-- 音频选择框 -->
          <div class="selectAudio"  v-else-if="item.type == 'selectAudio'" :class="fromClass.iptClass" :data-id="item.ruleProp + '-form-item'">
            <el-select v-model="item.models" v-bind:placeholder="item.placeHolder" :name="item.name" @clear="item.clear?item.clear():none()" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="selectAudioChange()" :disabled="item.disabled" :clearable="item.clearable" :filterable="item.filterable">
              <el-option  v-for="(items,key) in item.option" v-bind:label="items.label" v-bind:value="items.value" :disabled="items.disabled" :key='key'></el-option>
            </el-select>
            <audio id="select_audio_id__vit" :src="selectAudio.path"></audio>
            <el-button type="info" icon="el-icon-service" circle class="selectAudioButton" @click="playAudio()"></el-button>
          </div>
          <!--选择单选，带插槽-->
          <div v-else-if="item.type == 'select'" :data-id="item.ruleProp + '-form-item'">
            <el-select v-model="item.models" v-bind:placeholder="item.placeHolder" :name="item.name" @clear="item.clear?item.clear():none()" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()"  :class="fromClass.iptClass" :disabled="item.disabled" :clearable="item.clearable" :filterable="item.filterable" :allow-create="item.allowCreate">
              <el-option  v-for="(items,key) in item.option" v-bind:label="items.label" v-bind:value="items.value" :disabled="items.disabled" :key='key'></el-option>
            </el-select>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!--选择多选-->
          <!-- 不折叠多选tag，带插槽 -->
          <div v-else-if="item.type == 'select2' && item.uncollapse" :data-id="item.ruleProp + '-form-item'">
            <!-- multiple 只有为 false 的时候才是单选 默认多选 -->
            <el-select v-model="item.models" :disabled="item.disabled" v-bind:placeholder="item.placeHolder" :multiple="item.multiple !== false" :class="fromClass.iptClass" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" @remove-tag="item.removeTag?item.removeTag():none()" :name="item.name" :filterable="item.filterable" :allow-create="item.allowCreate" :multiple-limit="item.multipleLimit">
              <el-option  v-for="(items,key) in item.option" v-bind:label="items.label" v-bind:value="items.value" :disabled="items.disabled" :key='key'></el-option>
            </el-select>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!-- 折叠多选tag，带插槽 -->
          <div v-else-if="item.type == 'select2' && !item.uncollapse" :data-id="item.ruleProp + '-form-item'">
            <!-- multiple 只有为 false 的时候才是单选 默认多选 -->
            <el-select v-model="item.models" :disabled="item.disabled" collapse-tags v-bind:placeholder="item.placeHolder" :multiple="item.multiple !== false" :class="fromClass.iptClass" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" @remove-tag="item.removeTag?item.removeTag():none()" :name="item.name" :filterable="item.filterable" :allow-create="item.allowCreate" :multiple-limit="item.multipleLimit">
              <el-option  v-for="(items,key) in item.option" v-bind:label="items.label" v-bind:value="items.value" :disabled="items.disabled" :key='key'></el-option>
            </el-select>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!--日期选择，带插槽-->
          <div v-if="item.type == 'datetime'||item.type == 'date'||item.type == 'week'||item.type == 'month'||item.type == 'year'" :data-id="item.ruleProp + '-form-item'">
            <el-date-picker :default-value="new Date()" :name="item.name" :type="item.type" v-model="item.models" v-bind:placeholder="item.placeHolder" :class="fromClass.iptClass" :format="item.format?item.format:$t('vicenter.common.formatDate')" :readonly="item.readonly" :disabled="item.disabled" :clearable="item.clearable" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :value-format="item.valueFormat" :picker-options="item.pickerOptions">
            </el-date-picker>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!--日期范围选择，带插槽-->
          <div v-if="item.type == 'daterange'" :data-id="item.ruleProp + '-form-item'">
            <el-date-picker  :format="item.format?item.format:$t('vicenter.common.dayFormat')" :default-value="item.defaultValue?item.defaultValue:new Date()" :editable="item.editable" :picker-options="item.pickerOptions?item.pickerOptions:defaultPickerOptions" :range-separator="item.rangeSeparator" type="daterange" :name="item.name" v-model="item.models" :class="fromClass.iptClass" :readonly="item.readonly" :disabled="item.disabled" :clearable="item.clearable" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :value-format="item.valueFormat" :start-placeholder="item.startPlace" :end-placeholder="item.endPlace">
            </el-date-picker>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!--日期时间范围选择，带插槽-->
          <div v-if="item.type == 'datetimerange'" :data-id="item.ruleProp + '-form-item'">
            <el-date-picker  :format="item.format?item.format:$t('vicenter.common.formatDate')" :default-value="item.defaultValue?item.defaultValue:timeDefaultShow" :editable="item.editable" :picker-options="item.pickerOptions?item.pickerOptions:defaultPickerOptions" :range-separator="item.rangeSeparator" type="datetimerange" :name="item.name" v-model="item.models" :class="fromClass.iptClass" :readonly="item.readonly" :disabled="item.disabled" :clearable="item.clearable" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :value-format="item.valueFormat" :start-placeholder="item.startPlace" :end-placeholder="item.endPlace" :default-time="item.defaultTime?item.defaultTime:['00:00:00','23:59:59']">
            </el-date-picker>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!--时间选择，带插槽-->
          <div v-if="item.type == 'timepicker'" :data-id="item.ruleProp + '-form-item'">
            <el-time-picker v-model="item.models" v-bind:placeholder="item.placeHolder" :class="fromClass.iptClass" :readonly="item.readonly" :disabled="item.disabled" :clearable="item.clearable" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" :value-format="item.valueFormat" :picker-options="item.pickerOptions" :format="item.format">
            </el-time-picker>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!-- 单选框，带插槽 -->
          <div v-if="item.type == 'radio'" :data-id="item.ruleProp + '-form-item'">
            <el-radio-group v-model="item.models" :class="fromClass.iptClass" :disabled="item.disabled" @change="item.change?item.change():none()">
              <el-radio  v-for="(items,key) in item.option" v-bind:label="items.value" :name="item.name" :disabled="items.disabled"  @change="items.change?items.change():none()" :key='key'>{{ items.label }}</el-radio>
            </el-radio-group>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!-- 多选框，带插槽 -->
          <div v-if="item.type == 'checkbox'" :data-id="item.ruleProp + '-form-item'">
            <el-checkbox-group v-model="item.models" :class="fromClass.iptClass" @change="item.change?item.change():none()" :min="item.min" :max="item.max">
              <el-checkbox  v-for="(items, indexs) in item.option" v-bind:label="items.value" :key="indexs" :disabled="items.disabled" :checked="items.checked" :name="items.name" @change="items.change?items.change():none()">{{items.label}}</el-checkbox>
            </el-checkbox-group>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <el-input v-if="item.type == 'treeInput' && item.treeIptComName !== 'hsCodesTree'" :id='item.treeIptId' :suffix-icon="item.endIcon"   :prefix-icon="item.StartIcon"  :name="item.name" v-model="item.models" v-bind:placeholder='item.placeHolder' :class="fromClass.iptClass" :disabled="item.disabled" :readonly='item.readonly' @focus="handleTreeInputFocus" @blur="handleTreeInputBlur" :data-id="item.ruleProp + '-form-item'"></el-input>
          <el-tree
            v-if="item.type == 'treeInput' && item.treeIptComName !== 'hsCodesTree'"
            :expand-on-click-node='flagfalse'
            :id='item.treeDataId'  v-show="item.treeView"
            :data="item.treedata"
            :props="item.TreeProps?item.TreeProps:treeProp"
            @node-click="item.treeClick"
            class="treeClass"
            show-checkbox
            @check="item.check"
            node-key='id'
            :default-checked-keys="item.checkedOption ? item.checkedOption:[]"
            :ref="item.treeRefName"
            :check-strictly="item.checkStrictly ? item.checkStrictly : false"
            default-expand-all>
          </el-tree>
          <el-tree v-if="item.type == 'treeCheck'" :ref='item.Refname' node-key='id' :default-checked-keys='item.models' default-expand-all show-checkbox  :id='item.treeDataId'  :data="item.treedata" :props="item.TreeProps?item.TreeProps:treeProp" @node-click="item.treeClick?item.treeClick():none()" @check='getCheck()' :class="fromClass.treeClass" :empty-text='item.EmptyText' :data-id="item.ruleProp + '-form-item'"></el-tree>
          <el-select v-if="item.type == 'treeInput' && item.treeIptComName === 'hsCodesTree'" :id='item.treeIptId' v-model="item.models" multiple :collapse-tags="true" :placeholder="item.placeHolder" @focus="handleTreeInputFocus" @blur="handleTreeInputBlur" @change="handleTreeInputChange" popper-class="form-tree-popper" style="width: 100%;" :disabled="item.disabled" :data-id="item.ruleProp + '-form-item'">
            <el-option v-for="ops in item.options" :key="ops.opsValue" :label="ops.opsLabel" :value="ops.opsValue">
            </el-option>
          </el-select>
          <div class="treeClass" v-if="item.type == 'treeInput' && item.treeIptComName === 'hsCodesTree'" v-show="item.treeView" :data-id="item.ruleProp + '-form-item'">
            <GoodsTree :ref="item.treeIptComName" v-if="isShow" :goodsOption="item.goodsOption?item.goodsOption:goodsOption" @data="currentCheckGoods"></GoodsTree>
          </div>
          <div v-if="item.type === 'table'" class="tableBox" :class='item.customClass' :data-id="item.ruleProp + '-form-item'">
            <ComTable :tableData="item.tableData" :tableGroup="item.tableGroup" ></ComTable>
          </div>
          <!-- 数字加减，带插槽 -->
          <div v-if="item.type === 'inputNum'" class="inputNum" :data-id="item.ruleProp + '-form-item'">
            <el-input-number :precision="item.precision || 0" class="inputNumer" v-bind:placeholder="item.placeHolder" :readonly="item.readonly" :disabled="item.disabled" :name="item.name" v-model="item.models" :min="item.min" :max="item.max" :step="item.step || 1"></el-input-number>
            <slot :name="item.soltName" v-if="item.isSolt"></slot>
          </div>
          <!-- 自定义icon 输入框 -->
          <el-input v-if="item.type=='iconText'" v-model="item.models" :class="fromClass.iptClass" class="icon-input" :disabled="item.disabled" :maxlength="item.maxlength" :readonly='item.readonly'><i :class="item.icon" slot="suffix" @click="item.iconFunc()" :data-id="item.ruleProp + '-form-item'"></i></el-input>
        </div>
      </el-form-item>
      <el-form-item :class="fromClass.buttonClass">
        <el-button  type="primary" size="large" @click="query(searchFunc.query)" data-id="query-btn">{{searchFunc.queryText}}</el-button>
        <el-button  size="large" @click="reset(searchFunc.close)" data-id="reset-btn">{{searchFunc.resetText}}</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
import GoodsTree from '@/views/ImageLibrary/common/goodsTree'
import commonAjax from '@/api/background/HSCode.js'
import ComTable from '@/components/table'
import { setTimeout } from 'timers'
export default {
  name: 'searchForm',
  data () {
    return {
      textMaxLength: 50, // 查询框最多输入字符数量
      textareaMaxLength: 500, // 文本域最多输入字符数量
      flag: true,
      flagfalse: false,
      treeProp: {
        children: 'children',
        label: 'label'
      },
      colorPredefine: [ // 颜色框的预定义
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#2D15C7'
      ],
      selectAudio: {},
      palyFlag: false,
      isReset: false, // 解决input加上过滤特殊字符指令之后不能重置的问题
      resetIptNum: 0, // 需要重置的加过滤特殊字符指令的输入框数量
      filterRule: 'all', // 过滤特殊字符规则（过滤所有）
      goodsOption: {
        isShowCheckbox: true,
        checkedKeys: [],
        defaultExpandedKeys: [],
        maxLimit: null
      },
      checkedNodes: [],
      allCheckedKeys: [],
      isShow: false,
      timeDefaultShow: '',
      defaultPickerOptions: { // 默认当天之后的日期不可选
        // disabledDate: (time) => {
        //   return time.getTime() > Date.now()
        // }
      }
    }
  },
  created () {
    // 解决日期时间范围选择器初始面板显示当前月和下个月的问题,改为显示上个月和当前月
    this.timeDefaultShow = new Date()
    this.timeDefaultShow.setMonth(new Date().getMonth() - 1)
  },
  mounted () {
    for (let k = 0; k < this.$props.searchIpt.length; k++) {
      if (this.$props.searchIpt[k].type === 'treeInput') {
        this.$props.searchIpt[k].treeView = false
      }
    }
  },
  methods: {
    // 点击选中建议项时触发
    handleAutoComplete (item, func) {
      if (func) {
        func(item)
      }
    },
    // 返回输入建议的方法
    querySearch (queryString, cb, allData) {
      let restaurants = allData
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleTreeInputFocus (e) {
      for (let k = 0; k < this.$props.searchIpt.length; k++) {
        if (this.$props.searchIpt[k].type === 'treeInput') {
          if (this.$props.searchIpt[k].treeIptComName === 'hsCodesTree') {
            this.goodsOption.checkedKeys = []
            if (this.checkedNodes.length > 0) {
              this.checkedNodes.forEach(e => {
                // 树结构默认选中值设置
                this.goodsOption.checkedKeys.push(e.value)
              })
            }
            this.isShow = true
          }
          if (e.target.id === this.$props.searchIpt[k].treeIptId || e.target.id === this.$props.searchIpt[k].treeDataId) {
            this.$props.searchIpt[k].treeView = true
          } else {
            this.$props.searchIpt[k].treeView = false
            if (this.$refs[this.$props.searchIpt[k].treeIptComName] && this.$refs[this.$props.searchIpt[k].treeIptComName].length > 0) {
              this.$refs[this.$props.searchIpt[k].treeIptComName][0].filterVal = ''
            }
          }
        }
      }
    },
    handleTreeInputBlur () {
      for (let k = 0; k < this.$props.searchIpt.length; k++) {
        if (this.$props.searchIpt[k].type === 'treeInput') {
          document.body.addEventListener('click', (e) => {
            if (this.$props.searchIpt[k].treeIptId) {
              if (e.target.id === this.$props.searchIpt[k].treeIptId || e.target.id === this.$props.searchIpt[k].treeDataId || (this.$props.searchIpt[k].treeIptComName === 'hsCodesTree' && e.target.name === 'hscodeTreeQuery')) {
                this.$props.searchIpt[k].treeView = true
              } else {
                this.$props.searchIpt[k].treeView = false
                if (this.$refs[this.$props.searchIpt[k].treeIptComName] && this.$refs[this.$props.searchIpt[k].treeIptComName].length > 0) {
                  this.$refs[this.$props.searchIpt[k].treeIptComName][0].filterVal = ''
                }
              }
            }
          })
        }
      }
    },
    handleTreeInputChange (checkedNode) {
      this.$props.searchIpt.forEach(item => {
        if (item.type === 'treeInput' && item.treeIptComName === 'hsCodesTree') {
          if (item.change) {
            item.change()
          }
          if (checkedNode && checkedNode.length > 0) {
            // 当有选中值时，清除下拉框中未选中的数据，并且更新hscode树选中状态
            let opsCodeArr = []
            let opsNameArr = []
            item.options = item.options.filter(ops => {
              return checkedNode.indexOf(ops.opsValue) !== -1
            })
            item.models = checkedNode
            item.goodsOption.defaultExpandedKeys = this.allCheckedKeys
            item.goodsOption.checkedKeys = checkedNode
            this.$refs[item.treeIptComName][0].$refs.goodsTree.setCheckedKeys(checkedNode)
            item.options.forEach(e => {
              opsCodeArr.push(e.opsLabel)
              opsNameArr.push(e.opsName)
            })
            this.$props.formRule.model[item.ruleProp] = opsCodeArr.join(',')
            this.$props.formRule.model['hsIds'] = checkedNode.join(',')
            this.$props.formRule.model['hsNames'] = opsNameArr.join(',')
          } else {
            // 当没有选中值时，清空下拉框数据，并且设置所有hscode树节点为未勾选状态
            item.models = ''
            item.options = []
            this.$refs[item.treeIptComName][0].$refs.goodsTree.setCheckedKeys([])
            this.$props.formRule.model[item.ruleProp] = ''
            this.$props.formRule.model['hsIds'] = ''
            this.$props.formRule.model['hsNames'] = ''
          }
        }
      })
    },
    getCheck () {
      for (let k = 0; k < this.$props.searchIpt.length; k++) {
        if (this.$props.searchIpt[k].type === 'treeCheck') {
          this.$props.searchIpt[k].count = Math.random()
        }
      }
    },
    query (func) {
      if (this.$props.formRule.rule !== '{}') {
        this.$refs[this.$props.formRule.refName].validate((valid) => {
          if (valid) {
            func()
          }
        })
      } else {
        func()
      }
      this.selectAudioChange()
    },
    reset (fn) {
      // console.log('Resetin')
      var KeepDefaultArr = []
      this.isReset = true
      this.$props.formRule.flag = false
      for (let i = 0; i < this.$props.searchIpt.length; i++) {
        if (this.$props.searchIpt[i].hiden) continue
        if (this.$props.searchIpt[i].KeepDefault) {
          // 一些表单项需要保留
          KeepDefaultArr.push(this.$props.searchIpt[i].ruleProp)
          this.$props.searchIpt[i].models = this.$props.searchIpt[i].defaultValue
          this.$props.formRule.model[this.$props.searchIpt[i].ruleProp] = this.$props.searchIpt[i].defaultValue
          continue
        }
        if (this.$props.searchIpt[i].type === 'text' && this.$props.searchIpt[i].isFilterSpecialChar) {
          // 解决input加过滤特殊字符指令后不能重置的问题
          this.resetIptNum++
        }
        if (this.$props.searchIpt[i].type === 'select2' || this.$props.searchIpt[i].type === 'treeCheck') {
          this.$props.searchIpt[i].models = []
        } else if (this.$props.searchIpt[i].type === 'checkbox') {
          this.$props.searchIpt[i].models = []
          for (let k = 0; k < this.$props.searchIpt[i].option.length; k++) {
            this.$props.searchIpt[i].option[k].checked = false
          }
        } else if (this.$props.searchIpt[i].type === 'treeInput' && this.$props.searchIpt[i].treeIptComName !== 'hsCodesTree') {
          this.$refs[this.$props.searchIpt[i].treeRefName][0].setCheckedKeys([])
          this.$props.searchIpt[i].models = ''
        } else if (this.$props.searchIpt[i].type === 'treeInput' && this.$props.searchIpt[i].treeIptComName === 'hsCodesTree') {
          this.isShow = false
          this.goodsOption.checkedKeys = []
          this.checkedNodes = []
          this.$props.searchIpt[i].models = ''
          this.$props.searchIpt[i].options = []
          this.$props.searchIpt[i].goodsOption.checkedKeys = []
          this.$props.searchIpt[i].goodsOption.defaultExpandedKeys = []
        } else {
          this.$props.searchIpt[i].models = ''
        }
      }
      this.way(this.$props.formRule.model, KeepDefaultArr)
      this.$refs[this.$props.formRule.refName].resetFields()
      this.selectAudioChange()
      if (fn) {
        fn()
      }
      // console.log(this.$props.formRule.model)
    },
    isObject (val) {
      return Object.prototype.toString.call(val) === '[object Object]'
    },
    trimSpace (func, item, e = null) {
      item.models = this.$trim(item.models)
      // 兼容filterSpecialChar
      if (e) {
        e.target.value = item.models
      }
      if (func) {
        func()
      }
    },
    way (value, KeepDefaultArr = []) {
      for (var key in value) {
        if (KeepDefaultArr.indexOf(key) > -1) {
          break
        }
        if (this.isObject(value[key])) {
          let childrenObj = value[key]
          this.way(childrenObj)
        } else if (Array.isArray(value[key])) {
          value[key].forEach(element => {
            if (this.isObject(element)) {
              this.way(element)
            } else {
              value[key] = []
            }
          })
        } else {
          value[key] = ''
        }
      }
    },
    none () {
      return false
    },
    playAudio () { // 音频试听
      let dom = document.getElementById('select_audio_id__vit')
      if (this.$data.playFlag) {
        this.$data.playFlag = false
        dom.pause()
      } else {
        this.$data.playFlag = true
        dom.play()
      }
    },
    selectAudioChange () {
      let dom = document.getElementById('select_audio_id__vit')
      if (dom) {
        dom.pause()
      }
    },
    currentCheckGoods (checkedData) {
      this.checkedNodes = []
      this.allCheckedKeys = []
      let tempArr = []
      let hscodes = []
      let hsIds = []
      let hsNames = []
      let tipNum = 0
      if (checkedData.checkedNodes && checkedData.checkedNodes.length > 0) {
        checkedData.checkedNodes.forEach(e => {
          commonAjax.getGrandChildren({id: e.id}).then(res => {
            if (res.data.flag) {
              res.data.result.forEach(e => {
                this.allCheckedKeys.push(e.id)
                if (!e.hasChild && JSON.stringify(this.checkedNodes).indexOf(e.id) === -1) {
                  this.checkedNodes.push({
                    value: e.id,
                    label: `(${e.code})${e.name}`,
                    code: e.code,
                    opsValue: e.id,
                    opsLabel: e.code,
                    opsName: e.name
                  })
                  hsNames.push(`${e.name}`)
                }
              })
              for (let k = 0; k < this.$props.searchIpt.length; k++) {
                if (this.$props.searchIpt[k].type === 'treeInput' && this.$props.searchIpt[k].treeIptComName === 'hsCodesTree') {
                  this.$props.searchIpt[k].models = ''
                  if (this.checkedNodes.length > 0) {
                    this.checkedNodes.forEach(node => {
                      if (hscodes.indexOf(node.code) === -1) {
                        tempArr.push(`${node.label}`)
                        hscodes.push(`${node.code}`)
                        hsIds.push(`${node.value}`)
                      }
                    })
                    if (this.$props.searchIpt[k].goodsOption && this.$props.searchIpt[k].goodsOption.maxLimit && tempArr.length > this.$props.searchIpt[k].goodsOption.maxLimit) {
                      // 数量超出只提示一次
                      if (tipNum === 0) {
                        this.$NotifError(this.$t('vicenter.ImageLibrary.common.limitGoodsQuantity', {msg: this.$props.searchIpt[k].goodsOption.maxLimit}))
                        this.$props.searchIpt[k].models = ''
                        this.$props.formRule.model[this.$props.searchIpt[k].ruleProp] = ''
                        this.$props.formRule.model['hsIds'] = ''
                        this.$props.formRule.model['hsNames'] = ''
                      }
                      tipNum++
                      return
                    }
                    this.$props.searchIpt[k].models = hsIds
                    this.$props.searchIpt[k].options = this.checkedNodes
                    this.$props.searchIpt[k].goodsOption.checkedKeys = this.allCheckedKeys
                    this.$props.formRule.model[this.$props.searchIpt[k].ruleProp] = hscodes.join(',')
                    this.$props.formRule.model['hsIds'] = hsIds.join(',')
                    this.$props.formRule.model['hsNames'] = hsNames.join(',')
                    if (this.$props.searchIpt[k].change) {
                      this.$props.searchIpt[k].change()
                    }
                  }
                }
              }
            }
          }).catch(() => {})
        })
      } else if (checkedData.checkedNodes && checkedData.checkedNodes.length === 0) {
        for (let k = 0; k < this.$props.searchIpt.length; k++) {
          if (this.$props.searchIpt[k].type === 'treeInput' && this.$props.searchIpt[k].treeIptComName === 'hsCodesTree') {
            this.$props.searchIpt[k].models = ''
            this.$props.searchIpt[k].options = []
            this.$props.formRule.model[this.$props.searchIpt[k].ruleProp] = ''
            this.$props.formRule.model['hsIds'] = ''
            this.$props.formRule.model['hsNames'] = ''
            if (this.$props.searchIpt[k].change) {
              this.$props.searchIpt[k].change()
            }
          }
        }
      }
    },
    setData () {
      this.resetIptNum--
      if (this.resetIptNum < 1) {
        this.isReset = false
      }
    }
  },
  directives: {
    filterSpecialChar: {
      update: function (el, { value, modifiers }, vnode) {
        try {
          // 如果使用的是原生控件input,则直接用el,如果使用的是elementui中的<el-input/>标签,则用el.children[0]拿到原生input
          if (!el.children[0].value) {
            return false
          }
          if (value.filterRule === 'all') {
            // 限制所有特殊字符输入
            el.children[0].value = el.children[0].value.replace(/[=……`~!@#$%^&*()_+<>?:"{},.\\/;'[\]·！#￥（——）：；“”‘’、，|《。》？、【】[\]-\s]/g, '')
          } else if (value.filterRule === 'onlyDP') {
            // 只允许输入数字和点(限制除点之外的特殊字符以及中文和字母)
            el.children[0].value = el.children[0].value.replace(/[a-zA-Z\u4e00-\u9fa5=……`~!@#$%^&*()_+<>?:"{},\\/;'[\]·！#￥（——）：；“”‘’、，|《。》？、【】[\]-\s]/g, '')
          } else if (value.filterRule === 'onlyDL') {
            // 只允许输入数字和字母(限制特殊字符以及中文)
            el.children[0].value = el.children[0].value.replace(/[\u4e00-\u9fa5=……`~!@#$%^&*()_+<>?:"{},.\\/;'[\]·！#￥（——）：；“”‘’、，|《。》？、【】[\]-\s]/g, '')
          }
          if (value.isReset) {
            el.children[0].value = ''
            value.setData()
          }
          el.children[0].dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
        } catch (e) {}
      }
    }
  },
  watch: {
    'searchIpt': {
      handler (oldValue, newValue) {
        for (let k = 0; k < newValue.length; k++) {
          if (newValue[k].type !== 'treeInput') {
            this.$props.formRule.model[newValue[k].ruleProp] = newValue[k].models
          }
          if (newValue[k].type === 'treeCheck') {
            //  console.log(this.$refs[newValue[k].Refname])
            if (this.$refs[newValue[k].Refname] !== undefined) {
              const KEYS = this.$refs[newValue[k].Refname][0].getCheckedKeys()
              this.$props.formRule.model[newValue[k].ruleProp] = KEYS
            }
          }
          if (newValue[k].type === 'selectAudio') {
            for (let i in newValue[k].option) {
              if (newValue[k].option[i].value === newValue[k].models) {
                this.$data.selectAudio.path = newValue[k].option[i].path
              }
            }
          }
        }
      },
      deep: true
    }
  },
  props: {
    searchIpt: {
      required: false
    },
    searchFunc: {
      type: Object,
      required: false
    },
    formRule: {
      required: false
    },
    fromClass: {
      type: Object,
      default: function () {
        return {
          form: 'search-form',
          formItem: 'search-form-item',
          label: 'search-form-label',
          iptClass: 'search-form-input',
          buttonClass: 'search-form-btn'
        }
      }
    }
  },
  components: { GoodsTree, ComTable }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/styles/index.scss";
  .el-radio-group{
    line-height: 40px;
  }
  .colorStyle .el-color-picker__trigger {
    width: 100%;
  }
  .el-color-picker {
    width: 100%;
    top: 8px;
  }
  .selectAudio .el-button.is-circle {
    padding: 6px;
  }
  .treeClass{
    position: absolute;
    z-index: 500;
    width: 100%;
    overflow: auto;
    height: 200px;
    border: 1px solid #eaecf0;
    background: #fff;
  }
  .inputNum{
     @include flex(row, flex-start, center);
  }
  .el-tree>.el-tree-node{
    min-width: 100%;
    display: inline-block!important;
  }
  .el-input-group__append {
    width: 35px;
    padding: 0;
  }
  .el-input-group__append>.iconfont {
    display: inline-block;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    color: #2da8cf!important;
  }
  .inputNumer .el-input__inner{
    // height: unset;
    // line-height: unset;
  }
  .tableBox {
    width: $all;
    height: auto;
    .tableComp{
      padding: 0px 10px;
      .exportFor{
        margin-top: 0px;
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
  .icon-input {
    .el-input__suffix, .el-input__prefix {
      display: inline-block;
    }
  }
  .form-tree-popper {
    border: none;
    .el-select-dropdown__empty {
      display: none;
    }
    .el-select-dropdown__empty+.popper__arrow {
      display: none;
    }
  }
  .el-form-iten-hiden{
    margin: 0 !important;
    padding: 0;
    height: 0;
    overflow: hidden;
  }
  .el-input__inner {
    height: 32px!important;
    line-height: 32px!important;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    height: 30px;
    line-height: 30px;
    top: 5px;
  }
</style>
