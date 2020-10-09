<template>
  <el-main class="main-wrapper">
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread" />
    </div>
    <div class="out">
      <el-button type="primary" @click="handler()">{{$t('vicenter.IntegratedTraining.common.add')}}</el-button>
    </div>
    <div class="contain">
      <ComTable :tableData='tbdata' :tableGroup='tbgroup'></ComTable>
    </div>
  </el-main>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import ComTable from '@/components/table'
export default {
  name: 'plate',
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
        refName: 'allAnswerTable',
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
          label: this.$t('vicenter.IntegratedTraining.management.plateName'),
          type: 'text',
          model: 'name'
        }, {
          label: this.$t('vicenter.IntegratedTraining.management.plateDesc'),
          type: 'text',
          model: 'desc'
        }, {
          label: this.$t('vicenter.IntegratedTraining.common.op'),
          type: 'text',
          model: 'latestRespondent'
        }
      ]
    }
  },
  methods: {
    handler () {

    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    }
  },
  components: { breadCrumb, ComTable }
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  padding: 30px !important;
  text-align: left;
}
</style>
