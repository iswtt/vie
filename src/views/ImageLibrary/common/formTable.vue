<template>
  <div class="formData">
    <el-form :model='formRule.model?formRule.model:""' :rules='formRule.rule' :ref='formRule.refName'>
      <el-form-item class="formRow" v-for="(item, index) in formTableData" :key='index' :prop='item.ruleProp'>
        <el-row>
          <el-col :span="9" class="left el-form-item__label" :title="item.getLabel">
            {{item.getLabel}}
          </el-col>
          <el-col :span="15" class="right">
            <div v-if="item.type == 'readOnlyText'">{{item.models}}</div>
            <el-input v-if="item.type == 'text'" v-model="item.models" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" :placeholder='item.placeHolder' :disabled="item.disabled" :maxlength="item.maxlength || textMaxLength" :suffix-icon="item.endIcon"  :prefix-icon="item.StartIcon" :readonly='item.readonly'></el-input>
            <div v-if="item.type == 'query'" class="queryBox">
              <el-input v-model="item.models" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" :placeholder='item.placeHolder' :disabled="item.disabled" :maxlength="item.maxlength || textMaxLength" :suffix-icon="item.endIcon"  :prefix-icon="item.StartIcon" :readonly='item.readonly'></el-input>
              <el-button type="text" :title="$t('vicenter.ImageLibrary.common.Search')" @click="item.query?item.query():none()"><span class='iconfont'>&#xe606;</span></el-button>
            </div>
            <el-input v-if="item.type == 'textarea'" v-model="item.models" type="textarea" :rows="item.rows" :autosize="{ minRows: 1, maxRows: item.autoSize}" :maxlength="item.maxlength || textareaMaxLength" :placeholder='item.placeHolder' @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :name="item.name" resize="none" :disabled="item.disabled"></el-input>
            <el-select v-if="item.type == 'select'" v-model="item.models" :placeholder="item.placeHolder" :name="item.name" @clear="item.clear?item.clear():none()" @blur="item.blur?item.blur():none()" @focus="item.focus?item.focus():none()" @change="item.change?item.change():none()" :disabled="item.disabled" :clearable="item.clearable" :filterable="item.filterable" :allow-create="item.allowCreate">
              <el-option  v-for="(items,key) in item.option" :label="items.label" :value="items.value" :disabled="items.disabled" :key='key'></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      textMaxLength: 50, // 文本框最多输入字符数量
      textareaMaxLength: 500 // 文本域最多输入字符数量
    }
  },
  mounted () {
  },
  methods: {
    none () {
      return false
    }
  },
  watch: {
    'formTableData': {
      handler (newValue, oldValue) {
        for (let k = 0; k < newValue.length; k++) {
          if (typeof (newValue[k].models) === 'string') {
            this.$props.formRule.model[newValue[k].ruleProp] = newValue[k].models.replace(/(^\s*)|(\s*$)/g, '')
          } else {
            this.$props.formRule.model[newValue[k].ruleProp] = newValue[k].models
          }
        }
      },
      deep: true
    }
  },
  components: {},
  props: {
    'formTableData': {
      type: Array,
      default: []
    },
    'formRule': {
      required: false
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.formData {
  width: $all;
  // margin: $dis10;
  @include box-sizing();
  // border: 1px solid #ddd;
  // border-radius: 4px;
  .formRow {
    // border-bottom: 1px solid #ddd;
    margin-bottom: 0;
    .el-form-item__content {
      width: $all;
      @include flex(column, flex-start, flex-start);
      .el-row {
        width: $all;
        margin-bottom: $dis10;
        .left {
          width: auto;
          padding: 0 $dis10;
          text-align: left;
          line-height: 32px;
        }
        .right {
          width: $all;
          // border-left: 1px solid #ddd;
          // line-height: 32px;
          padding: 0 $dis10;
          // min-height: 48px;
          @include box-sizing();
          .el-input {
            input {
              height: 32px;
              line-height: 32px;
            }
          }
          .el-select {
            width: $all;
          }
          .queryBox {
            @include flex(row, flex-start, flex-start);
            .el-input {
              .el-input__inner {
                text-align: center;
              }
            }
            .el-button--text {
              padding: 5px 0 0 0;
              .iconfont {
                color: #00A3CF;
                margin-left: $dis10;
                font-size: 24px;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
  .formRow:last-child {
    // border-bottom: none;
  }
  .el-form-item.is-required {
    position: relative;
    .left.el-form-item__label {
      position: relative;
    }
    .left.el-form-item__label::after {
      content: "*";
      color: #f56c6c;
      position: absolute;
      top: 0;
      right: 2px;
    }
    .el-form-item__error {
      position: absolute;
      top: calc(100% - 10px);
      left: 10px;
      text-align: left;
      width: auto;
    }
  }
}
</style>
