<template>
  <div class="tableComp" :data-id="tableData.refName">
    <!-- 列表和缩略图切换模式 -->
    <deviceStatusList v-if="tableData.isThumbnail && tableData.DeviceStatusList" :deviceStatusData="tableData.data"></deviceStatusList>
    <Thumbnail v-if="tableData.isThumbnail && !tableData.DeviceStatusList" :thumbnailData="tableData" v-on="$listeners" v-bind="$attrs"></Thumbnail>
    <el-table v-else :border="tableData.isBorder" :stripe="tableData.isStripe" :ref='tableData.refName' @row-dblclick="dbclick" @current-change="handleCurrentChange" @selection-change="selectChange" :data="tableData.data"  style="width: 100%"  :max-height='tableData.MaxHeight' :span-method="objectSpanMethod" :row-class-name="tableRowClassName" :id="tableData.id" @sort-change='tableData.sortMethod?tableData.sortMethod: ""' :row-key="getAllRowKeys">
      <template v-for="(item, index) in tableGroup">
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='false' :sortable='item.sortable?item.sortable:false' :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'img'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <img :src="scope.row[item.model]" :style="{height:item.height,cursor: item.cursor}" style="display: inline-block;max-width: 100%" @click="item.func?item.func(scope):none()">
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false' :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'link'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <a :href="scope.row[item.model].link" :style="scope.row[item.model].style" :title="scope.row[item.model].title">{{scope.row[item.model].label}}</a>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'statusText'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope">
            <!-- <p :style="{color:scope.row[item.model].color,background:scope.row[item.model].background}">{{scope.row[item.model].label}}</p> -->
            <el-tag :type='scope.row[item.model].type'>{{scope.row[item.model].label}}</el-tag>
          </template>
        </el-table-column>
        <!-- color -->
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'color'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope">
            <div :style="{background: scope.row[item.model], height: '24px', width: '40px', margin: '0 auto'}"></div>
          </template>
        </el-table-column>
        <!-- audio -->
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'audio'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope">
            {{scope.row[item.model].label}}
            <el-button type="info" icon="el-icon-service" circle class="selectAudioButton" @click="play(scope.row[item.model].value)"></el-button>
            <audio :id="scope.row[item.model].value" :src="scope.row[item.model].path"></audio>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'editInput'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <el-popover trigger="click" placement="top" v-model="item.click">
              <el-input  v-model="editModel" style="width: 60%"></el-input>
              <el-button type="primary" @click="scope.row[item.model]=editModel;item.click=false"><i class="el-icon-edit"></i></el-button>
              <el-button @click="item.click=false"><i class="el-icon-close"></i></el-button>
              <div slot="reference" class="name-wrapper" @click="editModel=scope.row[item.model]">{{scope.row[item.model]}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- 进度条 -->
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'progress'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <el-progress  style="width: 60%; margin: 0 auto" :type="item.strokeType" :show-text="item.showText" :text-inside="item.inside" :stroke-width="item.strokeWidth" :percentage="scope.row[item.model]" ></el-progress>
          </template>
        </el-table-column>
        <!-- 多选框组 -->
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'checkbox'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <el-checkbox-group v-model="scope.row[item.model]">
              <el-checkbox :label="tmp" v-for="(tmp, index) in item.checkList" :key="index"></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'editNumber'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <el-popover trigger="click" placement="top"  v-model="item.click">
              <el-input-number v-model="editModel" controls-position="right"></el-input-number>
              <el-button type="primary" @click="scope.row[item.model]=editModel;item.click=false"><i class="el-icon-edit"></i></el-button>
              <el-button @click="item.click=false"><i class="el-icon-close"></i></el-button>
              <div slot="reference" class="name-wrapper" @click="editModel=scope.row[item.model]">{{scope.row[item.model]}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'editTime'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <el-popover trigger="click" placement="top"  v-model="item.click">
              <el-date-picker v-model="editModel" type="datetime"  :format="$t('language.format')"></el-date-picker>
              <el-button type="primary" @click="scope.row[item.model]=editModel;item.click=false"><i class="el-icon-edit"></i></el-button>
              <el-button @click="item.click=false"><i class="el-icon-close"></i></el-button>
              <div slot="reference" class="name-wrapper" @click="editModel=scope.row[item.model]">{{scope.row[item.model]|formatDate($t('language.format'))}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false' :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'editSelect'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <el-popover trigger="click" placement="top"  v-model="item.click">
              <el-select v-model="editModel">
                <el-option
                  v-for="choose in item.option"
                  :key="choose.value"
                  :label="choose.label"
                  :value="choose.value">
                </el-option>
              </el-select>
              <el-button type="primary" @click="scope.row[item.model]=editModel;item.click=false"><i class="el-icon-edit"></i></el-button>
              <el-button @click="item.click=false"><i class="el-icon-close"></i></el-button>
              <div slot="reference" class="name-wrapper" @click="editModel=scope.row[item.model]">{{scope.row[item.model]}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false' :label="item.label" :prop="item.model" :width="item.width" v-else-if="item.type == 'text'" :fixed="item.fixed" :key="index">
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-else-if="item.type == 'time'" :formatter="item.formatter" :fixed="item.fixed" :key="index">
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-else-if="item.type == 'emptyText'" :formatter="item.formatter" :fixed="item.fixed" :key="index">
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false'  :label="item.label" :prop="item.model" :width="item.width" v-else-if="item.type == 'locale'" :formatter="item.formatter" :fixed="item.fixed" :key="index">
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" type="selection" v-else-if="item.type == 'selection'" :width="item.width" :fixed="item.fixed" :key="index" :reserve-selection="true">
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :sortable='item.sortable?item.sortable:false' :label="item.label" :prop="item.model" :width="item.width" v-if="item.type == 'imgoperation'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope" >
            <img :src="scope.row[item.model].src" @click="scope.row[item.model].func(scope)" class='editTable imgoper' :style="{height:item.height}">
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :label="item.label" :prop="item.model" :width="item.width" v-else-if="item.type == 'operation'" :fixed="item.fixed" :key="index">
          <template slot-scope="scope">
            <span v-for="(operate, index) in scope.row[item.model]" :data-id="'operation'+index+'-span'"  @click="operate.func(scope)"  v-html="operate.label" :title="operate.title" v-show="operate.show" :key="index"></span>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :label="item.label" :prop="item.model" :width="item.width" v-else-if="item.type == 'showTooltip'" :fixed="item.fixed" :key="index">
          <template slot-scope="scope">
            <el-tooltip class="item" v-if="scope.row[item.model].show" effect="dark" :content="scope.row[item.model].title" placement="top">
              <span v-html="scope.row[item.model].label" :key="index"></span>
            </el-tooltip>
            <span v-else v-html="scope.row[item.model].label" :key="index"></span>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false' :label="item.label" :prop="item.model" :width="item.width" v-else-if="item.type == 'hover'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope">
            <el-popover trigger="hover" :placement="scope.row[item.model].position"  :class="scope.row[item.model].class">
              <p v-html="scope.row[item.model].hoverText"></p>
              <div slot="reference" class="name-wrapper" v-html="scope.row[item.model].title"></div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" :resizable='resizable' :show-overflow-tooltip='true' :sortable='item.sortable?item.sortable:false' :label="item.label" :prop="item.model" :width="item.width" v-else-if="item.type == 'select'"  :fixed="item.fixed" :key="index">
          <template slot-scope="scope">
            <el-select v-model="scope.row[item.model].models" size="small" :placeholder="scope.row[item.model].placeholder" :disabled="scope.row[item.model].disabled">
              <el-option
                v-for="e in scope.row[item.model].option"
                :key="e.value"
                :label="e.label"
                :value="e.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- 下标 -->
        <el-table-column :header-align="defaultAlign" :align="item.align?item.align:defaultAlign" :render-header="renderHeader" type="index" :index="indexMethod"  :label="item.label" :width="item.width" v-else-if="item.type == 'index'" :fixed="item.fixed" :key="index">
      </el-table-column>
      </template>
    </el-table>
    <div class="exportFor">
      <el-pagination v-on:size-change="tableData.page.handleSizeChange" v-on:current-change="tableData.page.handleCurrentChange" v-bind:current-page="tableData.page.CurrentPage?tableData.page.CurrentPage+1:1" v-bind:page-sizes="tableData.page.pageGroup || [10, 20, 50, 100]" v-bind:page-size="tableData.page.pagesize" :layout="tableData.layout || 'total, sizes, prev, pager, next, jumper'" v-bind:total="tableData.page.Allpage" :pager-count="tableData.pagerCount"  v-if="tableData.isPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Thumbnail from './thumbnail'
import deviceStatusList from '@/components/supervise/deviceStatusList'
export default {
  name: 'tableComp',
  data () {
    return {
      defaultAlign: 'center',
      editModel: '',
      selectedData: [],
      playFlag: false,
      resizable: true // 对应列是否可以通过拖动改变宽度
    }
  },
  created () {
    console.log(this.props)
  },
  methods: {
    getAllRowKeys (row) {
      return row.id
    },
    indexMethod (index) { //    下标
      return index * 1 + 1
    },
    dbclick (row, event) {
      this.$emit('dbclick', row)
    },
    none () {},
    selectChange (row) {
      this.selectedData = row
      this.$emit('listenToSelectDataEvent', this.selectedData)
    },
    handleCurrentChange (val) {
      this.$emit('listenCurrentChange', val)
    },
    formatJson (filterVal, jsonData) {
      for (var i = 0; i < jsonData.length; i++) {
        for (var key in jsonData[i]) {
          if (key.indexOf('time') > -1) {
            jsonData[i][key] = this.getFormat(jsonData[i][key])
          }
          if (key.indexOf('type') > -1) {
            jsonData[i][key] = this.getLocale(jsonData[i][key])
          }
        }
      }
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    copyArr (arr) {
      let res = []
      for (let i = 0; i < arr.length; i++) {
        let target1 = {}
        Object.assign(target1, arr[i])
        res.push(target1)
      }
      return res
    },
    getLocale (cellValue) {
      var _this = this
      if (!cellValue) {
        return ''
      } else {
        return this.$t(_this.$props.tableData.localgroup + cellValue)
      }
    },
    getFormat (cellValue) {
      return this.$formatDate(cellValue, this.$t('language.format'))
    },
    // 如果是总计、平均的列，则合并两列
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row['index'] && (row['index'] === this.$t('vicenter.supervise.checkStatistics.averageNum') || row['index'] === this.$t('vicenter.supervise.checkStatistics.totalNum'))) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 2
          }
        }
      }
    },
    tableRowClassName (row, index) { //    设置表格行颜色
      // 如果是总计、平均，则改变样式
      if (row.row['index'] && (row.row['index'] === this.$t('vicenter.supervise.checkStatistics.averageNum') || row.row['index'] === this.$t('vicenter.supervise.checkStatistics.totalNum'))) {
        return 'total-average-class'
      }
      var getType = Object.prototype.toString.call(this.$props.tableData.RowNum)
      if (getType === '[object Number]' && index === this.$props.tableData.RowNum) {
        return 'success-row'
      } else if (getType === '[object Array]') {
        for (var i = 0; i < this.$props.tableData.RowNum.length; i++) {
          if (index === this.$props.tableData.RowNum[i]) {
            return 'success-row'
          }
        }
      }
      return ''
    },
    play (id) {
      let dom = document.getElementById(id)
      if (this.$data.playFlag) {
        this.$data.playFlag = false
        dom.pause()
      } else {
        this.$data.playFlag = true
        dom.play()
      }
    },
    renderHeader (h, {column}) {
      if (column.label) {
        return (
          <el-tooltip class='item' effect='dark' content={column.label} placement='top'>
            <span>{column.label}</span>
          </el-tooltip>
        )
      }
    }
  },
  props: [
    'tableData',
    'tableGroup'
  ],
  components: { Thumbnail, deviceStatusList }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .tableComp{
    width: 100%;
  }
  .imgoper{
    max-width: calc(100% - 20px);
  }
  .tableComp .el-table th,
  .tableComp .el-table th div{
    background: #e7e7e7;
    color:#2a2a2a;
    font-weight: bold;
    height: 42px;
    line-height: 42px;
    padding:0;
  }
  .tableComp .el-table .cell{
    padding:0;
    height:auto;
  }

  .tableComp .el-pagination{
    display: flex;
    justify-content: flex-end;
  }
  .tableComp .el-table .red-row td .cell{
    background-color:rgba(255,0,0,1);
  }
  .el-table .success-row {
    background: red;
  }
  .el-table .total-average-class {
    font-weight: bold;
    color: black;
  }
  .el-table .total-average-class div{
    margin: 0 auto;
  }
  .tableComp .exportFor{
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .tableComp .exportFor .excels{
    width: 32px;
    height:32px;
    margin-right:.3rem;
    cursor: pointer;
  }
  .tableComp .el-button.is-circle {
    padding: 3px;
  }
  .el-table th .cell {
    white-space: nowrap;
  }
  .el-progress__text{
    font-size: 14px !important;
  }

</style>
