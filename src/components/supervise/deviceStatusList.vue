<template>
  <div id="device-status-list">
   <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in deviceStatusData" :key="index">
        <el-card shadow="hover" class="thumbnail-box">
          <div class="imgBox">
            <img :src="item.deviceIcon">
          </div>
          <div class="infoBox" :class='item.deviceStatus'>
            <div class="info-list" :class='statusClass[item.deviceStatus]'>
              <span v-for="(info, infoIndex) in item.infoData" :key="infoIndex">
                <i >{{info.label}}: </i><i>{{info.value}}</i>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 根据状态不同使用不同颜色
      statusClass: {
        '0': 'greenClass',
        '1': 'blueClass',
        '2': 'yellowClass',
        '3': 'redClass',
        '4': 'grayClass'
      }
    }
  },
  mounted () {
  },
  methods: {
  },
  components: {},
  props: {
    'deviceStatusData': {
      type: Array,
      default: []
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
#device-status-list {
  width: $all;
  height: auto;
  .el-col {
    margin-bottom: $dis10;
    .thumbnail-box {
      height: 260px;
      .el-card__body {
        width: $all;
        height: $all;
        padding: 5px;
        @include box-sizing();
        @include flex(column, flex-start, flex-start);
        .imgBox {
          padding-bottom: 5px;
          width: $all;
          height: 55%;
          overflow: hidden;
          @include flex(row, center, center);
          img {
            height: $all;
            max-width: $all;
          }
        }
        .infoBox {
          border: 1px solid #ebeef5;
          padding: 10px 0;
          width: $all;
          height: 45%;
          overflow: hidden;
          @include flex(column, flex-start, flex-start);
          .greenClass{
            color: #18bf18;
          }
          .redClass{
            color: red;
          }
          .yellowClass{
            color: #bcc42d;
          }
          .blueClass{
            color: #26abf5;
          }
          .grayClass{
            color: #90979b
          }
          span {
            display: inline-block;
            width: $all;
            padding-right: $dis10;
            @include flex(row, flex-start, flex-start);
            @include box-sizing();
            margin-bottom: 5px;
            i {
              padding-left: 10px;
              display: inline-block;
              // width: $all/2;
              font-style: normal;
              font-size: 14px;
              text-align: left;
            }
          }
          .info-list {
            width: $all;
            span {
              i {
                @include box-sizing();
              }
              i:first-child {
                width: 32%;
                text-align: right;
                @media screen and (max-width: 1400px) {
                  width: 40%;
                }
              }
              i:last-child {
                width: 68%;
                @media screen and (max-width: 1400px) {
                  width: 60%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
