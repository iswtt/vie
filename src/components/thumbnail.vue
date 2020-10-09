<template>
  <div id="thumbnail" :class="{editThumbnail: thumbnailData.isEdit}">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item, index) in thumbnailData.data" :key="index">
        <el-card shadow="hover" class="thumbnail-box">
          <div class="imgBox" @click="toDetail(item.id)">
            <img :src="item.lastImage" alt="img">
          </div>
          <div class="infoBox" v-bar>
            <div>
              <span v-for="(info, infoIndex) in item.infoData" :key="infoIndex">
                <i class="label">{{info.label}}</i>
                <el-input v-if="info.edit && thumbnailData.editData[index].edit" v-model.trim="info.value" :maxlength="textMaxLength"></el-input>
                <i v-else>{{info.value}}</i>
              </span>
              <!-- 支持编辑和保存 -->
              <span v-if="thumbnailData.isEdit" class="operation">
                <i v-show="!thumbnailData.editData[index].edit" @click="handleEditFunc(item, index)" :title="$t('vicenter.common.fix')" class="el-icon-edit"></i>
                <i v-show="thumbnailData.editData[index].edit" @click="handleSaveFunc(item, index)" :title="$t('vicenter.common.save')" class="el-icon-check"></i>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="thumbnailData.data.length === 0" :span="24" class="noData">{{$t('vicenter.common.nodata')}}</el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      textMaxLength: 50 // 输入框最多输入字符数量
    }
  },
  mounted () {
  },
  methods: {
    toDetail (id) {
      this.$router.push({
        path: this.$props.thumbnailData.toDetailHash
      })
      let details = {
        id: id,
        flag: this.$props.thumbnailData.flag
      }
      sessionStorage.setItem('details', JSON.stringify(details))
    },
    handleEditFunc (data, index) {
      let paramData = {
        data: data,
        i: index
      }
      this.$emit('editFunc', paramData)
    },
    handleSaveFunc (data, index) {
      let paramData = {
        data: data,
        i: index
      }
      this.$emit('saveFunc', paramData)
    },
    none () {}
  },
  components: {},
  props: {
    'thumbnailData': {
      type: Object,
      default: {}
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
#thumbnail {
  width: $all;
  height: auto;
  .el-col {
    margin-bottom: $dis10;
    .thumbnail-box {
      height: 180px;
      .el-card__body {
        width: $all;
        height: $all;
        padding: 5px;
        @include box-sizing();
        @include flex(row, flex-start, flex-start);
        .imgBox {
          width: 50%;
          height: $all;
          overflow: hidden;
          cursor: pointer;
          @include flex(row, center, center);
          img {
            height: auto;
            width: $all;
          }
        }
        .infoBox {
          width: calc(50% - 10px);
          height: $all;
          overflow: hidden;
          margin-left: 10px;
          @include flex(column, flex-start, flex-start);
          span {
            display: inline-block;
            width: $all;
            padding-right: $dis10;
            @include flex(column, flex-start, flex-start);
            @include box-sizing();
            margin-bottom: 5px;
            i {
              display: inline-block;
              width: $all;
              font-style: normal;
              color: #606266;
              font-size: 14px;
              text-align: left;
            }
            i:first-child {
              color: #000;
            }
          }
        }
      }
    }
  }
  .noData {
    height: 250px;
    line-height: 250px;
    color: #909399;
  }
}
#thumbnail.editThumbnail {
  .el-col-8 {
    width: 25%;
    .thumbnail-box {
      height: 250px;
    }
  }
  .el-col {
    .thumbnail-box {
      .el-card__body {
        padding: 10px;
        @include flex(column, flex-start, flex-start);
        .imgBox {
          width: $all;
          height: 150px;
          overflow: visible;
          background: rgba(200, 200, 200, .5);
          img {
            visibility: hidden;
            width: auto;
            height: 150px;
          }
        }
        .infoBox {
          width: $all;
          height: calc(100% - 150px);
          margin-left: 0;
          border: 1px solid #ebeef5;
          position: relative;
          @include box-sizing();
          span {
            @include flex(row, flex-start, flex-start);
            margin: 8px 0;
            padding: 0 10px;
            i {
              display: inline;
            }
            i:nth-child(2) {
              word-break: break-all;
            }
            .label {
              width: auto;
              position: relative;
              margin-right: 8px;
              white-space: nowrap;
            }
            .label::after {
              display: inline;
              content: ':'
            }
            .el-input__inner {
              height: 25px;
              padding: 0 5px;
            }
          }
          .operation {
            width: 20px;
            position: absolute;
            right: 10px;
            bottom: 0;
            z-index: 100;
            .el-icon-check,.el-icon-edit {
              @include iconfontColor();
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  #thumbnail.editThumbnail {
    .el-col-8 {
      width: 33.33%;
    }
  }
}
</style>
