<template>
  <el-main class="main-wrapper">
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread" />
    </div>
    <div class="question-panel">
      <panelTitle :panelTitleInit="panelTitle.questionTitle"></panelTitle>
      <el-form :model="questionForm.models" :rules="questionForm.rules" ref="questionForm" label-width="100px" class="question-form">
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.topicName')" prop="topic">
          <el-input v-model="questionForm.models.topic"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.ownSection')" prop="ownSection">
          <el-input v-model="questionForm.models.ownSection"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.topicCreator')" prop="topicCreator">
          <el-input v-model="questionForm.models.topicCreator"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.topicContent')" prop="content">
          <el-input type="textarea" v-model="questionForm.models.content"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.attachment')" prop="attachment">
          <el-link type="primary">{{questionForm.models.linkName}}</el-link>
          <el-button>{{$t('vicenter.IntegratedTraining.community.preview')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="latest-reply-panel">
      <panelTitle :panelTitleInit="panelTitle.replyTitle"></panelTitle>
      <el-form :model="replyForm.models" :rules="replyForm.rules" ref="replyForm" label-width="100px" class="reply-form">
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.topicCreator')" prop="replyCreator">
          <el-input v-model="replyForm.models.replyCreator"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.topicContent')" prop="replyContent">
          <el-input type="textarea" v-model="replyForm.models.replyContent"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.attachment')" prop="replyLink">
          <el-link type="primary">{{replyForm.models.replyLink}}</el-link>
          <el-button>{{$t('vicenter.IntegratedTraining.community.preview')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-reply-panel">
      <panelTitle :panelTitleInit="panelTitle.addReplyTitle"></panelTitle>
      <el-form :model="addReplyForm.models" :rules="addReplyForm.rules" ref="addReplyForm" label-width="100px" class="add-reply-form">
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.replyContent')" prop="replyLink">
          <el-input type="textarea" v-model="replyForm.models.addContent"></el-input>
        </el-form-item>
        <el-form-item :label="$t('vicenter.IntegratedTraining.community.attachment')" prop="replyLink">
          <el-upload class="upload-reply" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" >
            <el-button size="small" type="primary">{{$t('vicenter.IntegratedTraining.community.uploadText')}}</el-button>
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
import panelTitle from '@/components/title'
import ComForm from '@/components/form'
export default {
  name: 'reply',
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
      panelTitle: { // title组件数据
        questionTitle: {
          title: this.$t('vicenter.IntegratedTraining.community.query')
        },
        replyTitle: {
          title: this.$t('vicenter.IntegratedTraining.community.query')
        },
        addReplyTitle: {
          title: this.$t('vicenter.IntegratedTraining.community.query')
        }
      },
      questionForm: {
        models: {
          topic: '',
          ownSection: '',
          topicCreator: '',
          content: '',
          linkName: ''
        },
        rules: {}
      },
      replyForm: {
        models: {
          replyCreator: '',
          replyContent: '',
          replyLink: ''
        },
        rules: {}
      },
      addReplyForm: {
        models: {
          addContent: '',
          attachment: ''
        },
        rules: {
        }
      },
      fileList: []
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
  components: { breadCrumb, panelTitle, ComForm }
}
</script>

<style lang="scss">

</style>
