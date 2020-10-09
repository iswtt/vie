<template>
  <div class="main__">
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread" />
    </div>
    <div class="out">
      <aform :searchIpt="option.searchIpt" :searchFunc="option.searchFunc" :formRule="option.formRule"></aform>
    </div>
  </div>
</template>
<script>
import aform from '@/components/form'
import breadCrumb from '@/components/breadCrumb'
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
      option: {
        searchIpt: [
          {
            getLabel: this.$t('vicenter.IntegratedTraining.management.code'),
            type: 'text',
            isFilterSpecialChar: false, // 过滤特殊字符
            placeHolder: '',
            models: '',
            ruleProp: 'code'
          },
          {
            getLabel: this.$t('vicenter.IntegratedTraining.management.name'),
            type: 'text',
            isFilterSpecialChar: false, // 过滤特殊字符
            placeHolder: '',
            models: '',
            ruleProp: 'name'
          },
          {
            getLabel: this.$t('vicenter.IntegratedTraining.management.value'),
            type: 'text',
            isFilterSpecialChar: false, // 过滤特殊字符
            placeHolder: '',
            models: '',
            ruleProp: 'value'
          },
          {
            getLabel: this.$t('vicenter.IntegratedTraining.management.pcode'),
            type: 'text',
            isFilterSpecialChar: false, // 过滤特殊字符
            placeHolder: '',
            models: '',
            ruleProp: 'p_code'
          },
          {
            getLabel: this.$t('vicenter.IntegratedTraining.management.sort'),
            type: 'text',
            isFilterSpecialChar: false, // 过滤特殊字符
            placeHolder: '',
            models: '',
            ruleProp: 'sort_no'
          }
        ],
        searchFunc: { // 页面表单查询方法
          query: this.query,
          queryText: this.$t('vicenter.common.submit'),
          resetText: this.$t('vicenter.common.cancel')
        },
        formRule: {
          model: {
            code: '',
            name: '',
            value: '',
            p_code: '',
            sort_no: ''
          },
          refName: 'queryForm',
          rule: {}
        }
      }
    }
  },
  methods: {
    query () {
      console.log('hello')
    }
  },
  components: { breadCrumb, aform }
}
</script>

<style lang="scss">
.main__ {
  padding: 20px;
  .out {
    width: 500px;
    margin: 100px auto;
    text-align: left;
  }
  .pack {
    display: flex;
  }
  .list-label {
    width: 100px;
    label {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
