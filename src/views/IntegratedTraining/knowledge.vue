<template>
  <div class='integratedTraining-device-bar' v-bar>
    <div class="integratedTraining-device-M">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread" />
      </div>
      <!-- 表格内容 -->
      <div class="top_panel">
        <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
        <ComForm :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
      </div>
      <div class="infolist">
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="pan_btn">
            <el-button type="default" size="mini" @click="handler(1)">{{$t('vicenter.IntegratedTraining.common.add')}}</el-button>
            <el-button type="default" size="mini" @click="handler(2)">{{$t('vicenter.common.deleteAll')}}</el-button>
            <el-button type="default" size="mini" @click="handler(3)">{{$t('vicenter.common.delete')}}</el-button>
          </div>
          <div class="form-bar" v-bar>
            <ComTable ref="deviceTable" :tableData='tableData' :tableGroup='tableGroup'></ComTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import breadCrumb from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import DialogCommon from '@/components/dialogCommon'
import Cswiper from '@/components/swipe'
import upload from '@/components/uploadPreview'
import ajax from '@/api/background/device.js'
import commonAjax from '@/api/common/common.js'
import Map from '@/components/map/views/map'
import icons from '@/components/map/lib/importIcon.js' // 所有图标
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { setTimeout } from 'timers'
export default {
  name: 'integratedTraining-device',
  data () {
    return {
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/IntegratedTraining/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: { // title组件数据
        listTitle: {
          title: this.$t('vicenter.IntegratedTraining.common.queryconditions')
        },
        listTitle_n: {
          title: this.$t('vicenter.IntegratedTraining.common.datalist')
        }
      },
      queryFn: { // 页面表单查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formRule: { // 表单验证和存放数据 model=> post到后台的数据
        refName: 'queryForm',
        rule: {},
        model: {
          deviceCode: '',
          deviceName: ''
        }
      },
      inputItem: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('vicenter.IntegratedTraining.common.plate'),
          type: 'select2',
          isFilterSpecialChar: false, // 过滤特殊字符
          placeHolder: this.$t('vicenter.IntegratedTraining.common.plateholder'),
          models: '',
          ruleProp: 'deviceCode'
        },
        {
          getLabel: this.$t('vicenter.IntegratedTraining.common.docname'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          placeHolder: this.$t('vicenter.IntegratedTraining.common.docnameholder'),
          models: '',
          ruleProp: 'deviceName'
        },
        {
          getLabel: this.$t('vicenter.IntegratedTraining.common.doctype'),
          type: 'select2',
          isFilterSpecialChar: false, // 过滤特殊字符
          placeHolder: this.$t('vicenter.IntegratedTraining.common.doctypeholder'),
          models: '',
          ruleProp: 'deviceName'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'multipleTable',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        },
        sortMethod: this.getSortTable // 新增排序方法
      },
      tableGroup: [ // 表格数据列
        {
          type: 'selection'
        },
        {
          label: this.$t('vicenter.IntegratedTraining.common.filename'),
          type: 'text',
          model: 'deviceCode'
        },
        {
          label: this.$t('vicenter.IntegratedTraining.common.filetype'),
          type: 'text',
          model: 'deviceName'
        },
        {
          label: this.$t('vicenter.IntegratedTraining.common.plate'),
          type: 'text',
          model: 'longitude'
        },
        {
          label: this.$t('vicenter.IntegratedTraining.common.filesize'),
          type: 'text',
          model: 'latitude'
        },
        {
          label: this.$t('vicenter.IntegratedTraining.common.uploadusers'),
          type: 'text',
          model: 'deviceStyle'
        },
        {
          label: this.$t('vicenter.IntegratedTraining.common.uploadtime'),
          type: 'img',
          height: '50px',
          model: 'deviceIcon'
        },
        {
          label: this.$t('vicenter.IntegratedTraining.common.op'),
          type: 'operation',
          model: 'remark'
        }
      ]
    }
  },
  created () {
  },
  mounted () {
    console.log(this.$t('vicenter.Background.device.selectCoordinates'))
  },
  methods: {
    query () {
      console.log('点击查询')
    },
    handler (flag) {
      if (flag === 1) {
        // 新增

      }
      if (flag === 2) {
        // 批量删除

      }
      if (flag === 3) {
        // 删除

      }
    }
  },
  watch: {

  },
  components: { breadCrumb, ComForm, panelTitle, ComTable, Dialog, Cswiper, upload, Map, DialogCommon }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.integratedTraining-device-bar {
  @extend .extend-bar;
  .integratedTraining-device-M {
    padding: $margin;
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
        width: 100%;
        @extend .extend-panel;
        .search-form {
          height: auto;
          @include layout(1, "fasle");
        }
        .pan_btn {
          width: 100%;
          text-align: left;
          padding-top: 15px;
          padding-left: 35px;
        }
      }
      .panel-L {
        @extend .extend-panel-L;
        .el-form-item {
          margin-right: 5px !important;
        }
      }
    }
    .modal-dialog {
      .search-form {
        @include layout(3);
        justify-content: flex-start !important;
        .search-form-btn .el-form-item__content {
          display: none;
        }
      }
      .resultbutton {
        padding-top: 5px;
        text-align: right;
      }
      .review {
        width: $all;
        text-align: left;
        .uploadBox {
          width: $all;
          height: 150px;
          display: flex;
          .uploadButton {
            width: 50%;
            text-align: center;
            ul {
              display: none;
            }
          }
          .swiperPreview {
            width: 50%;
          }
        }
      }
      .divShow {
        text-align: left;
        height: 150px;
        padding: 20px;
        .imgShow {
          max-width: 100%;
          height: 100%;
          margin: 0 auto;
          cursor: pointer;
        }
      }
    }
  }
}
.top_panel {
  width: 100%;
  .el-form {
    display: flex;
    .el-form-item {
      margin-right: 30px;
      position: relative;
    }
    .el-form-item:nth-child(4) {
      .el-form-item__content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
.el-tooltip__popper {
  max-width: 500px;
  word-break: break-all;
}
.deviceMapContainer {
  @include flex(column, flex-start, flex-start);
  .coorShow {
    @include flex(row, flex-end, center);
    li {
      margin-right: $dis10;
    }
  }
  .deviceMap {
    margin: $dis10 0;
    width: $all;
    height: 650px;
  }
}
.deviceMapButton {
  padding-top: 5px;
  text-align: right;
}
</style>
