<template>
  <div id='Device-status-bar' v-bar>
    <div class="Device-status-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="formIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
         <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComTable :tableData="deviceStatusData"></ComTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/supervise/Device-status.js' // 接口文件
import commonAjax from '@/api/common/common.js'
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import deviceStatusList from '@/components/supervise/deviceStatusList'
export default {
  name: 'Device-status',
  data () {
    return {
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Background/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      formRule: { // 查询表单规则
        model: {
          siteId: [],
          id: [],
          deviceName: '',
          deviceStatus: []
        },
        refName: 'deviceStatusQueryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formIpt: [ // 查询表单初始化
        {
          // 口岸名称
          getLabel: this.$t('vicenter.supervise.checkStatistics.port'),
          placeHolder: this.$t('vicenter.supervise.checkStatistics.portSelected'),
          models: '',
          ruleProp: 'siteId',
          type: 'treeInput',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'treeInput',
          treeDataId: 'treeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.siteIdCheckChange,
          treeRefName: 'siteIdtreeIptRef'
        },
        {
          // 设备编号
          getLabel: this.$t('vicenter.supervise.taskInspection.device'),
          placeHolder: this.$t('vicenter.supervise.taskInspection.enterDevice'),
          type: 'treeInput',
          models: '',
          ruleProp: 'id',
          treedata: [],
          treeView: false,
          treeIptId: 'deviceIdtreeInput',
          treeDataId: 'deviceIdtreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.deviceIdCheckChange,
          treeRefName: 'deviceIdtreeIptRef'
        },
        {
          // 设备名称
          getLabel: this.$t('vicenter.supervise.common.deviceName'),
          placeHolder: this.$t('vicenter.supervise.common.enterDeviceName'),
          type: 'text',
          models: '',
          ruleProp: 'deviceName'
        },
        {
          // 设备状态
          getLabel: this.$t('vicenter.supervise.common.deviceStatus'),
          placeHolder: this.$t('vicenter.supervise.common.enterDeviceStatus'),
          type: 'select2',
          uncollapse: true,
          models: '',
          clearable: true,
          option: [
            {
              label: this.$t('vicenter.supervise.deviceStatus.running'),
              value: '0'
            },
            {
              label: this.$t('vicenter.supervise.deviceStatus.ready'),
              value: '1'
            },
            {
              label: this.$t('vicenter.supervise.deviceStatus.notReady'),
              value: '2'
            },
            {
              label: this.$t('vicenter.supervise.deviceStatus.error'),
              value: '3'
            },
            {
              label: this.$t('vicenter.supervise.deviceStatus.offline'),
              value: '4'
            }
          ],
          ruleProp: 'deviceStatus'
        }
      ],
      deviceStatusData: {
        data: [],
        isPage: true,
        refName: 'deviceStatusTable',
        isThumbnail: true,
        DeviceStatusList: true,
        sortMethod: this.getSort,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        }
      }
    }
  },
  mounted () {
    this.setinputItem()
    this.query()
  },
  methods: {
    query (isPage = true) { // 用于form表单查询方法
      let params = JSON.parse(JSON.stringify(this.formRule.model))
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.deviceStatusData.page, 'CurrentPage', 0)
      }
      params.deviceStatus = params.deviceStatus.join(',')
      params.page = this.deviceStatusData.page.CurrentPage
      params.size = this.deviceStatusData.page.pagesize
      ajax.getList(params).then((res) => {
        if (res.data.flag) {
          this.deviceStatusData.isPage = false
          this.deviceStatusData.page = {
            pageGroup: [10, 20, 50, 100], // 分页数据
            CurrentPage: res.data.result.pageable.pageNumber, // 当前页码
            pagesize: res.data.result.pageable.pageSize, // 当前分页条数
            Allpage: res.data.result.totalElements, // 总数据
            handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.handleCurrentChange // 当前页码改变触发改函数
          }
          this.deviceStatusData.data = res.data.result.content
          this.deviceStatusData.data.forEach(item => {
            let status = this.$options.filters['deviceStatus'](item.deviceStatus)
            // 缩略图数据
            item.infoData = [
              {
                label: this.$t('vicenter.supervise.taskInspection.device'),
                value: item.deviceCode
              },
              {
                label: this.$t('vicenter.supervise.common.deviceName'),
                value: item.deviceName
              },
              {
                label: this.$t('vicenter.supervise.checkStatistics.port'),
                value: item.siteName
              },
              {
                label: this.$t('vicenter.supervise.common.deviceStatus'),
                value: status
              }
            ]
          })
          this.formRule.model.page = res.data.result.pageable.pageNumber
          this.formRule.model.size = res.data.result.pageable.pageSize
          if (this.deviceStatusData.data.length > 0) {
            this.deviceStatusData.isPage = true
          }
        }
      }).catch(() => {})
    },
    ajaxTree () { // 获取机构树方法
      commonAjax.orgNodesTree({all: true}).then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
          this.$data.formIpt.forEach(e => {
            if (e.ruleProp === 'siteId') {
              e.treedata = res.data.result
            }
          })
          this.getSearchTransferOrigin()
        }
      }).catch(() => {})
    },
    /**
     * 获取设备树方法
     */
    deviceAjaxTree () {
      commonAjax.deviceNodesTree().then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pid')
          this.$data.formIpt.forEach(e => {
            if (e.ruleProp === 'id') {
              e.treedata = res.data.result
            }
          })
        }
      }).catch(() => {})
    },
    setinputItem () {
      this.ajaxTree()
      this.deviceAjaxTree()
    },
    treeClick (data) {
    },
    /**
     * 设备树点击节点
     */
    deviceIdCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkNodeChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.formIpt.forEach(e => {
          if (e.ruleProp === 'id') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['id'] = checkedValue.ids
      }
    },
    siteIdCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.formIpt.forEach(e => {
          if (e.ruleProp === 'siteId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['siteId'] = checkedValue.ids
      }
    },
    handleSizeChange (val) { // 表格分页
      this.$set(this.deviceStatusData.page, 'pagesize', val)
      this.query(false)
    },
    handleCurrentChange (val) { // 表格分页
      this.$set(this.deviceStatusData.page, 'CurrentPage', val - 1)
      this.query(false)
    },
    getSort () {
      console.log(this.formRule)
    }
  },
  components: {bread, ComForm, panelTitle, ComTable, deviceStatusList}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#Device-status-bar {
  @extend .extend-bar;
  .Device-status-M {
    padding:$margin;
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
        @extend .extend-panel;
        .search-form {
          @include layout(2);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
      }
    }
  }
}
</style>
