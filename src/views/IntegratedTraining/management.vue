<template>
  <div class="main">
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread" />
    </div>
    <div class="out">
      <el-button type="primary" @click="handler(1)">{{$t('vicenter.IntegratedTraining.common.add')}}</el-button>
      <el-button type="default" @click="handler(2)">{{$t('vicenter.IntegratedTraining.management.plateManagement')}}</el-button>
    </div>
    <div class="contain">
      <ComTable :tableData='tbdata' :tableGroup='tbgroup'></ComTable>
    </div>
  </div>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import ComTable from '@/components/table'
export default {
  data () {
    return {
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/IntegratedTraining/management' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      tbdata: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        refName: 'queryName',
        sortMethod: '',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 100
        }
      },
      tbgroup: [
        {
          label: this.$t('vicenter.IntegratedTraining.management.code'),
          type: 'text',
          model: 'code'
        }, {
          label: this.$t('vicenter.IntegratedTraining.management.name'),
          type: 'text',
          model: 'name'
        }, {
          label: this.$t('vicenter.IntegratedTraining.management.value'),
          type: 'text',
          model: 'value'
        }, {
          label: this.$t('vicenter.IntegratedTraining.management.pcode'),
          type: 'text',
          model: 'p_code'
        }, {
          label: this.$t('vicenter.IntegratedTraining.management.sort'),
          type: 'text',
          model: 'sort_no'
        }, {
          label: this.$t('vicenter.IntegratedTraining.common.op'),
          type: 'operation',
          model: 'operation'
        }
      ]
    }
  },
  methods: {
    handler (flag) {
      if (flag === 1) {
        // 新增板块

      }
      if (flag === 2) {
        // 板块管理

      }
    },
    handleSizeChange (value) { // 修改一页显示多少
      // this.$handleSizeChange(value, this.tableData.searchData, this.getList)
    },
    handleCurrentChange (value) { // 翻页
      // this.$handleCurrentChange(value, this.tableData.searchData, this.getList)
    }
  },
  components: { breadCrumb, ComTable }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 30px;
  text-align: left;
}
</style>
