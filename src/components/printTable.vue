<template>
  <div id='Print-Table' :class="{printTableWidth: resetWidth}">
    <table class="tableContainer" v-if="printTableData.showPrintTable">
      <!-- 打印/导出标题 -->
      <tr>
        <th :colspan="printTableData.allColsNum">{{printTableData.title}}</th>
      </tr>
      <!-- 表格内容 -->
      <tr v-for="(trItem, trIndex) in printTableData.infoData" :key="trIndex">
        <td v-if="trItem.type === 'title'" :colspan="trItem.colspan" class="table-title">
          {{trItem.label}}
        </td>
        <td v-else v-for="(item, tdIndex) in trItem.data"  :colspan="item.colspan ? item.colspan : 1" :key="tdIndex">
          {{item.value}}
        </td>
      </tr>
      <!-- 图片展示区 -->
      <tr v-if="printTableData.imgUrl">
        <td :colspan="printTableData.allColsNum" class="imgTd">
          <img id="printImage" :src="printTableData.imgUrl" alt="">
        </td>
      </tr>
      <!-- 打印/导出信息展示区 -->
      <tr>
        <td :colspan="printTableData.allColsNum" class="footerTd">
          <div class="footerInfo">
            <table>
              <tr>
                <td v-if="isPrintPage">{{$t('vicenter.common.printBy')}}: </td>
                <td v-if="isExportPage">{{$t('vicenter.common.exportBy')}}: </td>
                <td>{{printTableData.printer}}</td>
              </tr>
              <tr>
                <td v-if="isPrintPage">{{$t('vicenter.common.printTime')}}: </td>
                <td v-if="isExportPage">{{$t('vicenter.common.exportTime')}}: </td>
                <td>{{new Date().getTime() | formatDate}}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      resetWidth: false,
      isPrintPage: true,
      isExportPage: false,
      printTableData: {
        showPrintTable: false
      }
    }
  },
  created () {
    Object.assign(this.printTableData, this.$props.printTable)
  },
  methods: {
    handlePrint () {
      this.isPrintPage = true
      this.isExportPage = false
      this.resetWidth = false
      Object.assign(this.printTableData, this.$props.printTable)
      this.printTableData.showPrintTable = true
      let style = ''
      if (window.config.print.direction) {
        style = '@page{ margin: 1cm 4cm; size: landscape; }'
      } else {
        style = '@page { margin: 1cm 2cm; size: portrait; }'
      }
      this.$nextTick(() => {
        if (this.printTableData.imgUrl) {
          let _this = this
          document.getElementById('printImage').onload = function () {
            console.log('print-图片加载完成')
            _this.printTables(style)
          }
        } else {
          this.printTables(style)
        }
      })
    },
    hidePrintTable () {
      this.printTableData.showPrintTable = false
    },
    printTables (style) {
      this.$nextTick(() => {
        this.$PrintJs({
          printable: 'Print-Table',
          type: 'html',
          style: style,
          documentTitle: '',
          targetStyles: ['*'],
          onLoadingEnd: this.hidePrintTable
        })
      })
    },
    handleExport () {
      this.isPrintPage = false
      this.isExportPage = true
      this.resetWidth = true // 导出pdf的时候宽度要减小（100%显示文字会很小）
      Object.assign(this.printTableData, this.$props.printTable)
      this.printTableData.showPrintTable = true
      this.$nextTick(() => {
        if (this.printTableData.imgUrl) {
          let _this = this
          document.getElementById('printImage').onload = function () {
            console.log('pdf-图片加载完成')
            _this.exportFile()
          }
        } else {
          this.exportFile()
        }
      })
    },
    exportFile () {
      this.$nextTick(() => {
        this.exportPdf(document.getElementById('Print-Table'), `${this.printTableData.title}${this.$options.filters['formatDate'](new Date().getTime(), 'yyyyMMddHHmmss')}`)
      })
      // 保证DOM转成canvas之后再隐藏模板
      let domToCanvas = null
      domToCanvas = setInterval(() => {
        if (sessionStorage.getItem('getCanvas') === '1') {
          this.printTableData.showPrintTable = false
          sessionStorage.removeItem('getCanvas')
          clearInterval(domToCanvas)
        }
      }, 100)
    }
  },
  watch: {
    'printTableData.showPrintTable': {
      handler (newValue, oldValue) {
        if (newValue) {
          Object.assign(this.printTableData, this.$props.printTable)
        }
      },
      deep: true
    }
  },
  props: {
    'printTable': {
      type: Object,
      default: {
        allColsNum: 0, // 表格内容总列数
        title: '', // 表格标题
        printer: '', // 打印人
        imgUrl: '', // 图像文件
        infoData: [] // 表格信息
      }
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
#Print-Table {
  width: 800px;
  height: auto;
  background: #ffffff;
  color: $black;
  @include box-sizing();
  .tableContainer {
    width: $all;
    @include box-sizing();
    table-layout: fixed;
    word-break: break-all;
    tr {
      th {
        font-size: 24px;
        font-weight: bold;
        line-height: 50px;
      }
      td {
        font-size: 14px;
        text-align: left;
        padding: 8px 5px;
        border: 1px solid $black;
        @include box-sizing();
        img {
          width: $all;
          height: auto;
        }
        .footerInfo {
          @include flex(row, flex-end, flex-start);
          table {
            border: none;
            tr {
              td {
                border: none;
                max-width: 500px!important;
                white-space: nowrap;
              }
              td:first-child {
                text-align: right;
              }
              td:last-child {
                text-align: left;
                padding-left: 10px;
              }
            }
          }
        }
      }
      .table-title {
        font-weight: bold;
        font-size: 18px;
      }
      .imgTd,.footerTd {
        width: $all;
        border: none;
        padding: 10px 0px;
      }
    }
  }
}
#Print-Table.printTableWidth {
  width: 50%;
}
</style>
