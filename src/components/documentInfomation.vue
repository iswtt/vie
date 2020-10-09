<template>
  <div data-id="document-infomation" class='document-infomation'>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <div v-if="decInfoData.length === 0" class="default-info">{{$t('vicenter.common.nodata')}}</div>
      <el-tab-pane v-else v-for="(item, index) in decInfoData" :label="item.tabLabel" :name="'infoItem' + index" :key="index">
        <div class="info-content" v-bar v-if="activeName === ('infoItem' + index)">
          <div>
            <div class="content-box" v-for="(cItem, cIndex) in item.tabContent" :key="cIndex">
              <div class="title">{{cItem.title}}</div>
              <el-row v-if="cItem.tableType === 'one'" class="type-one">
                <el-col :span="24/cItem.tableCol" v-for="(dItem, dIndex) in cItem.tableData" :key="dIndex">
                  <div class="label" :title="dItem.label">
                    <span v-if="!dItem.label" class="noDataCell">noData</span>
                    <span v-else>{{dItem.label}}</span>
                  </div>
                  <div :title="dItem.value">
                    <span v-if="!dItem.value" class="noDataCell">noData</span>
                    <span v-else>{{dItem.value}}</span>
                  </div>
                </el-col>
              </el-row>
              <table v-if="cItem.tableType === 'two'" class="type-two">
                <!-- 列表表头 -->
                <tr>
                  <th v-for="(gItem, gIndex) in cItem.tableGroup" :key="'th' + gIndex" :class="{textAlignCenter: gItem.model === 'operation', fixedWidth: gItem.model === 'operation' || gItem.model === 'index'}">{{gItem.label}}</th>
                </tr>
                <!-- 列表内容 -->
                <tr v-if="cItem.tableData.length === 0">
                  <td :colspan="cItem.tableGroup.length" class="textAlignCenter">{{$t('vicenter.common.nodata')}}</td>
                </tr>
                <tr v-else v-for="(dItem, dIndex) in cItem.tableData" :key="'tr' + dIndex">
                  <td v-for="(gItem, gIndex) in cItem.tableGroup" :key="gIndex" :class="{textAlignCenter: gItem.model === 'operation'}">
                    <span v-if="gItem.model === 'index'">{{dIndex + 1}}</span>
                    <span v-else-if="gItem.model === 'operation'" class='iconfont editTable' v-html="icon" :title="$t('vicenter.common.download')" @click="handleDownload(dItem[gItem.model])"></span>
                    <span v-else>{{dItem[gItem.model]}}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'documentInfomation',
  data () {
    return {
      icon: '&#xe69e;',
      activeName: 'infoItem0',
      decInfoData: [ // 存放多个报关单数据
        {
          tabLabel: this.$t('vicenter.inspection.history.declarationNo'), // 报关单号
          tabContent: [
            {
              tableType: 'one',
              tableCol: 6,
              title: this.$t('vicenter.common.documentInfo.basicInfo'),
              model: 'basicInfo',
              tableData: [
                {
                  label: this.$t('vicenter.common.documentInfo.preEntryNo'),
                  model: 'preEntryNo',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.customsNo'),
                  model: 'customsNo',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.declarationType'),
                  model: 'declarationType',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.entryExitPort'),
                  model: 'entryExitPort',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.declarationDate'),
                  model: 'declarationDate',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.entryExitDate'),
                  model: 'entryExitDate',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.recordNo'),
                  model: 'recordNo',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.reporter'),
                  model: 'reporter',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.reporterID'),
                  model: 'reporterID',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.phone'),
                  model: 'phone',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.reportingUnit'),
                  model: 'reportingUnit',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.unitAddress'),
                  model: 'unitAddress',
                  value: ''
                }
              ]
            },
            {
              tableType: 'one',
              tableCol: 6,
              title: this.$t('vicenter.common.documentInfo.shippingInfo'),
              model: 'shippingInfo',
              tableData: [
                {
                  label: this.$t('vicenter.common.documentInfo.tradingCountry'),
                  model: 'tradingCountry',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.arrivalCountry'),
                  model: 'arrivalCountry',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.domesticConsignor'),
                  model: 'domesticConsignor',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.overseasConsignee'),
                  model: 'overseasConsignee',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.commerceForms'),
                  model: 'commerceForms',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.agreementNo'),
                  model: 'agreementNo',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.transportMode'),
                  model: 'transportMode',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.vehicleAndVoyage'),
                  model: 'vehicleAndVoyage',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.arrivalPort'),
                  model: 'arrivalPort',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.unloadingLocation'),
                  model: 'unloadingLocation',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.closingMethod'),
                  model: 'closingMethod',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.waybillNo'),
                  model: 'waybillNo',
                  value: ''
                }
              ]
            },
            {
              tableType: 'one',
              tableCol: 8,
              title: this.$t('vicenter.common.documentInfo.cargoInfo'),
              model: 'cargoInfo',
              tableData: [
                {
                  label: this.$t('vicenter.common.documentInfo.productCode'),
                  model: 'productCode',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.grossWeight'),
                  model: 'grossWeight',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.netWeight'),
                  model: 'netWeight',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.specifications'),
                  model: 'specifications',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.qty'),
                  model: 'qty',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.unit'),
                  model: 'unit',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.price'),
                  model: 'price',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.currency'),
                  model: 'currency',
                  value: ''
                }
              ]
            },
            {
              tableType: 'two',
              title: this.$t('vicenter.common.documentInfo.cargoList'),
              model: 'cargoList',
              tableGroup: [
                {
                  label: this.$t('vicenter.common.No'),
                  model: 'index'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.productNo'),
                  model: 'productNo'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.productDesc'),
                  model: 'productDesc'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.packagingType'),
                  model: 'packagingType'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.licenseType'),
                  model: 'licenseType'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.permitNo'),
                  model: 'permitNo'
                }
              ],
              tableData: []
            },
            {
              tableType: 'one',
              tableCol: 4,
              title: this.$t('vicenter.common.documentInfo.costInfo'),
              model: 'costInfo',
              tableData: [
                {
                  label: this.$t('vicenter.common.documentInfo.freight'),
                  model: 'freight',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.premium'),
                  model: 'premium',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.miscellaneous'),
                  model: 'miscellaneous',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.currency'),
                  model: 'currency',
                  value: ''
                }
              ]
            },
            {
              tableType: 'two',
              title: this.$t('vicenter.common.documentInfo.attachmentInfo'),
              model: 'attachmentInfo',
              tableGroup: [
                {
                  label: this.$t('vicenter.common.No'),
                  model: 'index'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.attachType'),
                  model: 'attachType'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.attachName'),
                  model: 'attachName'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.uploadTime'),
                  model: 'uploadTime'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.fileSize'),
                  model: 'fileSize'
                },
                {
                  label: this.$t('vicenter.common.operation'),
                  model: 'operation'
                }
              ],
              tableData: []
            }
          ]
        },
        {
          tabLabel: this.$t('vicenter.inspection.history.declarationNo'), // 报关单号
          tabContent: [
            {
              tableType: 'one',
              tableCol: 6,
              title: this.$t('vicenter.common.documentInfo.basicInfo'),
              model: 'basicInfo',
              tableData: [
                {
                  label: this.$t('vicenter.common.documentInfo.preEntryNo'),
                  model: 'preEntryNo',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.customsNo'),
                  model: 'customsNo',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.declarationType'),
                  model: 'declarationType',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.entryExitPort'),
                  model: 'entryExitPort',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.declarationDate'),
                  model: 'declarationDate',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.entryExitDate'),
                  model: 'entryExitDate',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.recordNo'),
                  model: 'recordNo',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.reporter'),
                  model: 'reporter',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.reporterID'),
                  model: 'reporterID',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.phone'),
                  model: 'phone',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.reportingUnit'),
                  model: 'reportingUnit',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.unitAddress'),
                  model: 'unitAddress',
                  value: ''
                }
              ]
            },
            {
              tableType: 'one',
              tableCol: 6,
              title: this.$t('vicenter.common.documentInfo.shippingInfo'),
              model: 'shippingInfo',
              tableData: [
                {
                  label: this.$t('vicenter.common.documentInfo.tradingCountry'),
                  model: 'tradingCountry',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.arrivalCountry'),
                  model: 'arrivalCountry',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.domesticConsignor'),
                  model: 'domesticConsignor',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.overseasConsignee'),
                  model: 'overseasConsignee',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.commerceForms'),
                  model: 'commerceForms',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.agreementNo'),
                  model: 'agreementNo',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.transportMode'),
                  model: 'transportMode',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.vehicleAndVoyage'),
                  model: 'vehicleAndVoyage',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.arrivalPort'),
                  model: 'arrivalPort',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.unloadingLocation'),
                  model: 'unloadingLocation',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.closingMethod'),
                  model: 'closingMethod',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.waybillNo'),
                  model: 'waybillNo',
                  value: ''
                }
              ]
            },
            {
              tableType: 'one',
              tableCol: 8,
              title: this.$t('vicenter.common.documentInfo.cargoInfo'),
              model: 'cargoInfo',
              tableData: [
                {
                  label: this.$t('vicenter.common.documentInfo.productCode'),
                  model: 'productCode',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.grossWeight'),
                  model: 'grossWeight',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.netWeight'),
                  model: 'netWeight',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.specifications'),
                  model: 'specifications',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.qty'),
                  model: 'qty',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.unit'),
                  model: 'unit',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.price'),
                  model: 'price',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.currency'),
                  model: 'currency',
                  value: ''
                }
              ]
            },
            {
              tableType: 'two',
              title: this.$t('vicenter.common.documentInfo.cargoList'),
              model: 'cargoList',
              tableGroup: [
                {
                  label: this.$t('vicenter.common.No'),
                  model: 'index'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.productNo'),
                  model: 'productNo'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.productDesc'),
                  model: 'productDesc'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.packagingType'),
                  model: 'packagingType'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.licenseType'),
                  model: 'licenseType'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.permitNo'),
                  model: 'permitNo'
                }
              ],
              tableData: []
            },
            {
              tableType: 'one',
              tableCol: 4,
              title: this.$t('vicenter.common.documentInfo.costInfo'),
              model: 'costInfo',
              tableData: [
                {
                  label: this.$t('vicenter.common.documentInfo.freight'),
                  model: 'freight',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.premium'),
                  model: 'premium',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.miscellaneous'),
                  model: 'miscellaneous',
                  value: ''
                },
                {
                  label: this.$t('vicenter.common.documentInfo.currency'),
                  model: 'currency',
                  value: ''
                }
              ]
            },
            {
              tableType: 'two',
              title: this.$t('vicenter.common.documentInfo.attachmentInfo'),
              model: 'attachmentInfo',
              tableGroup: [
                {
                  label: this.$t('vicenter.common.No'),
                  model: 'index'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.attachType'),
                  model: 'attachType'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.attachName'),
                  model: 'attachName'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.uploadTime'),
                  model: 'uploadTime'
                },
                {
                  label: this.$t('vicenter.common.documentInfo.fileSize'),
                  model: 'fileSize'
                },
                {
                  label: this.$t('vicenter.common.operation'),
                  model: 'operation'
                }
              ],
              tableData: []
            }
          ]
        }
      ]
    }
  },
  created () {
    if (this.decInfoData.length > 0) {
      this.decInfoData.forEach(item => {
        item.tabContent.forEach(e => {
          if (e.tableType === 'one') {
            // 单元格空白内容处理
            let num = e.tableData.length % e.tableCol
            if (num !== 0) {
              e.tableData.push({
                label: '',
                model: '',
                value: ''
              })
            }
            // 内容赋值
          } else {
            // 内容赋值
          }
        })
      })
    }
  },
  methods: {
    handleTabClick () {},
    handleDownload (url) {
      window.open(url, '_blank')
    }
  },
  props: {
    'infoData': {
      type: Array,
      default: []
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.document-infomation {
  width: $all;
  height: $all;
  overflow: hidden;
  font-size: 14px;
  .el-tabs--border-card {
    width: $all!important;
    height: $all;
    border: none;
    .el-tabs__header {
      width: $all;
      height: 34px;
      margin-bottom: 0;
      background: url('../assets/img/common/titlebg_04.jpg') repeat-x 0 -15px;
      .el-tabs__item {
        height: 35px;
        line-height: 35px;
        &.is-active {
          background-color: #ffffff;
          border-right-color: #dcdfe6;
          border-left-color: #dcdfe6;
        }
      }
    }
    .el-tabs__content {
      height: calc(100% - 35px);
      padding: 0;
      .el-tab-pane {
        height: $all;
      }
      .info-content {
        height: $all;
        .content-box {
          padding: 15px 15px 5px;
          @include box-sizing();
          text-align: left;
          color: #606266;
          .title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .type-one {
            border-left: 1px solid #ebeef5;
            border-top: 1px solid #ebeef5;
            .el-col {
              border-right: 1px solid #ebeef5;
              border-bottom: 1px solid #ebeef5;
              div {
                padding: 0 5px;
                line-height: 34px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &.label {
                  font-weight: bold;
                  background: #e7e7e7;
                }
                .noDataCell {
                  visibility: hidden;
                }
              }
            }
          }
          .type-two {
            width: $all;
            border: 1px solid #ebeef5;
            table-layout: fixed;
            th, td {
              padding: 0 5px;
              line-height: 34px;
              border: 1px solid #ebeef5;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            th {
              font-weight: bold;
              background: #e7e7e7;
              &.fixedWidth {
                width: 90px;
              }
            }
            .textAlignCenter {
              text-align: center;
            }
          }
        }
      }
    }
  }
  .default-info {
    min-height: 100px;
    height: $all;
    @include flex(row, center, center);
  }
}
</style>
