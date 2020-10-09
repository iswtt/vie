<template>
  <el-main class="main-wrapper">
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread" />
    </div>
    <div class="out">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.topicName')" prop="topic">
          <el-input v-model="ruleForm.topic"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.ownSection')" prop="region">
          <el-select v-model="ruleForm.region" :placeholder="$t('vicenter.IntegratedTraining.community.sectionHolder')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.topicContent')" prop="content">
          <el-input type="textarea" v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.attachUpload')" prop="upload">
          <el-upload class="-demo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" >
            <el-button size="small" type="primary">{{$t('vicenter.IntegratedTraining.community.uploadTex')}}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">{{$t('vicenter.common.submit')}}</el-button>
          <el-button @click="resetForm('ruleForm')">{{$t('vicenter.common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
export default {
  name: 'question',
  data () {
    return {
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/IntegratedTraining/community' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      ruleForm: {
        topic: '',
        region: '',
        content: '',
        type: [],
        resource: ''
      },
      options: [],
      rules: {
        topic: [
          { required: false, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: false, message: '请选择活动区域', trigger: 'change' }
        ],
        resource: [
          { required: false, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      fileList: [] // 上传文件列表
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handlePreview () {

    },

    handleExceed () {

    },
    beforeRemove () {

    },
    handleRemove () {

    }
  },
  components: { breadCrumb }
}
</script>
<style lang="scss" scoped>
.main-wrapper {
  padding: 30px !important;
  text-align: left;
  & > .out {
    width: 500px !important;
    margin: 100px auto;
  }
}
</style>
