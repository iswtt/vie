<template>
<div class="detailListCont" :data-id='listRule'>
  <el-form class="detailList">
    <el-form-item class='group' :style="widthStyle" v-for='(item,key) in listData' :key='key' :prop='item.key'>
      <div class="list-label">{{item.label}}</div>
      <div class="info-attach" v-if="item.attachFlag" :data-id="item.ruleProp + '-detail-item'">
        <el-input v-model="item.value" class="list-info" disabled data-id="attach-input"></el-input>
        <el-button @click="showAttach(item.attachList)" type="text" v-if="item.attachFlag" class="iconfont" data-id="attach-btn">&#xe611;</el-button>
      </div>
      <el-input :title="item.value" v-model="item.value" class="list-info" disabled v-if="!item.attachFlag && item.ruleProp !== 'riskLevel' && item.ruleProp !== 'remark' && item.ruleProp !== 'seizedObjects'" :data-id="item.ruleProp + '-detail-item'"></el-input>
      <el-input :title="item.value" type="textarea" resize="none" :autosize="{ minRows: 1, maxRows: 5}" v-model="item.value" disabled v-if="item.ruleProp === 'remark'" :data-id="item.ruleProp + '-detail-item'"></el-input>
      <div :class="item.bgColor" class="list-info bgcolor" v-if="item.ruleProp === 'riskLevel'" :data-id="item.ruleProp + '-detail-item'"></div>
      <div v-if="item.ruleProp === 'seizedObjects'" class="tableBox" :class='item.customClass' :data-id="item.ruleProp + '-detail-item'">
        <ComTable :tableData="item.tableData" :tableGroup="item.tableGroup" ></ComTable>
      </div>
    </el-form-item>
  </el-form>
   <el-dialog :title="dialogAttach.title" :visible.sync="dialogAttach.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag'>
           <div class="">
             <Cswiper :propOption='dialogAttach.option' :listData='dialogAttach.data' data-id="attach-cswiper"></Cswiper>
           </div>
     </el-dialog>
</div>
</template>
<script>
import Cswiper from '@/components/swipe'
import ComTable from '@/components/table'
export default {
  data () {
    return {
      falseFlag: true,
      dialogAttach: {
        data: [],
        flag: false,
        option: {
          propId: 'dialogAttach',
          height: '300px',
          width: '70%',
          slidesPerView: 1,
          autoplay: true,
          delay: 10,
          navigate: {
            position: 'outside',
            type: 'shadow'
          }
        }
      }
    }
  },
  methods: {
    showAttach (attachList) {
      this.dialogAttach.data = attachList
      this.dialogAttach.flag = true
      console.log(attachList)
    }
  },
  components: {
    Cswiper,
    ComTable
  },
  props: {
    'listData': {
      type: Array,
      default: []
    },
    'widthStyle': {
      type: Object,
      default: {
        width: '100%'
      }
    },
    'listRule': {
      required: false
    }
  }
}
</script>
<style lang="scss">
@import "../styles/index.scss";
.detailList{
  @include flex(row, flex-start, flex-start);
  flex-wrap: wrap;
  .group {
    width: 33%;
    padding: 0 $margin;
    @include box-sizing();
    @include flex(column, flex-start, flex-start);
    text-align: left;
    line-height: 40px;
    font-size: $texts;
    float:left;
    .list-label{
      width: 100%;
      height: 32px;
      line-height: 32px;
      // float: left;
      font-size: 14px;
      color: #606266;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .list-title {
      width: 100%;
      font-weight: bold;
      font-size: $smallTitle;
      height: 40px;
    }
    .el-form-item__content {
      width: 100%;
    }
    .info-attach{
      width: 100%;
      display: inline-flex;
      .list-info {
        width: 100%;
        height: 40px;
      }
      .el-button--text{
        padding: unset;
      }
      .iconfont{
        margin-left: 20px;
        font-size: 40px;
      }
    }
  }
}
.detailListCont {
  width: 100%;
  // height: 100%;
}
.GREEN {
  background: #348b16;
}
.YELLO {
  background: #ffff00;
}
.RED {
  background: #e53836;
}
.bgcolor {
  width: 25%;
  height: 32px;
  border-radius: 4px;
  margin-top: 5px;
}
.el-form-item {
  margin-bottom: 12px;
}
.el-input__inner {
  height: 32px;
  line-height: 32px;
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
</style>
