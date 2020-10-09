<template>
  <div id="image-view">
    <div class="imageFilesBox">
      <div class="head">
        <div class="label">
          <span :class="{labelRequired: imageData.isEdit}">{{imageData.imageFile.imageFilesLabel}}</span>
          <!-- <el-select v-if="imageData.isEdit" v-model="imageData.imageFile.format" size="small" :placeholder="$t('vicenter.ImageLibrary.common.checkImagetype')" data-id="imageType-select">
            <el-option
              v-for="item in formatOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
        </div>
        <div class="operation">
          <el-button v-if="imageData.isEdit" type="primary" size="mini" data-id="upload-btn">{{$t('vicenter.ImageLibrary.common.Upload')}}</el-button>
          <el-button type="primary" size="mini" data-id="viProbe-btn">ViProbe</el-button>
        </div>
      </div>
      <div class="imageShow">
        <ComTable :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
      </div>
    </div>
    <div class="imageIconBox">
      <div class="head">
        <div class="label">{{imageData.imageIcon.imageIconLabel}}</div>
        <!-- <div class="label" :class="{labelRequired: imageData.isEdit}">{{imageData.imageIcon.imageIconLabel}}</div>
        <div v-if="imageData.isEdit" class="operation">
          <el-button v-if="imageData.isEdit" type="primary" size="mini" data-id="imageUpload-btn">{{$t('vicenter.ImageLibrary.common.Upload')}}</el-button>
        </div> -->
      </div>
      <div class="imageShow">
        <div class="nodata">{{$t('vicenter.common.nodata')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import ComTable from '@/components/table'
export default {
  data () {
    return {
      formatOption: [
        {
          value: 'NUCTECH',
          label: 'NUCTECH'
        },
        {
          value: 'UFF',
          label: 'UFF'
        }
      ],
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'imageShowTable',
        sortMethod: this.getSort
      },
      tableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.common.No'),
          type: 'index',
          width: '70px'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.ImageName'),
          type: 'text',
          model: 'imageName',
          width: ''
        }
        // {
        //   label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
        //   type: 'select',
        //   model: 'imageType',
        //   width: '350px'
        // },
        // {
        //   label: this.$t('vicenter.ImageLibrary.imageManagement.imageSize'),
        //   type: 'text',
        //   model: 'imageSize',
        //   width: ''
        // },
        // {
        //   label: this.$t('vicenter.common.operation'),
        //   type: 'operation',
        //   model: 'operation',
        //   width: '120px',
        //   fixed: 'right'
        // }
      ]
    }
  },
  created () {
    if (!this.$props.imageData.isEdit) {
      let tempArr = []
      this.tableGroup.forEach(e => {
        if (e.model !== 'operation') {
          tempArr.push(e)
        }
      })
      this.tableGroup = tempArr
    }
  },
  mounted () {},
  methods: {
    handleUploadIconSuccess (response, file, fileList) {},
    handleBeforeUploadIcon (file) {},
    deleteIcon (iconUrl) {},
    handleUploadFilesSuccess (response, file, fileList) {},
    handleBeforeUploadFiles (file) {},
    handleFileDelete (scope) {},
    getSort () {}
  },
  beforeDestroy () {},
  components: { ComTable },
  props: {
    'imageData': {
      type: Object,
      default: {
        isEdit: true,
        imageFile: {
          imageFilesLabel: '',
          format: 'NUCTECH'
        },
        imageIcon: {
          imageIconLabel: ''
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
#image-view {
  @include flex(row, flex-start, flex-start);
  .head {
    padding: 0 $dis10;
    @include flex(row, space-between, flex-start);
    .label {
      height: 26px;
    }
    .labelRequired::after {
      content: "*";
      color: $danger;
      margin-left: 4px;
    }
  }
  .imageFilesBox {
    width: $all/2;
    height: $all;
    box-sizing: border-box;
    padding: $dis10 $dis10*2;
    .head {
      .el-select--small {
        height: 28px;
      }
      .operation {
        div,button {
          display: inline-block;
        }
      }
    }
  }
  .imageIconBox {
    width: $all/2;
    height: $all;
    box-sizing: border-box;
    padding: $dis10 $dis10*2;
    .head {
      padding-right: $dis10*2;
    }
    .imageShow {
      width: $all;
      @include flex(row, flex-start, flex-start);
      height: calc(100% - 35px);
      padding: $dis10;
      box-sizing: border-box;
      div.content {
        width: 48%;
        height: $all;
        text-align: left;
        margin-right: $dis10;
        .imageBox {
          position: relative;
          padding-right: $dis10;
          width: $all;
          height: 90%;
          overflow: hidden;
          img {
            width: $all;
            display: inline-block;
          }
          .iconfont {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
        .onlyOne {
          img {
            width: auto;
            height: $all;
          }
        }
        .el-radio {
          margin-top: $dis10;
        }
      }
      .nodata {
        width: $all;
        text-align: center;
      }
      .tableComp {
        .el-table {
          td {
            padding: 5px 0;
          }
        }
      }
    }
  }
}
</style>
