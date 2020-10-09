<template>
  <div class="out" id="addfile_">
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="所属板块" prop="pass">
        <el-select v-model="ruleForm2.region" :placeholder="$t('vicenter.IntegratedTraining.community.sectionHolder')">
          <el-option :label="prpData.label" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('vicenter.IntegratedTraining.common.docname')" prop="checkPass">
        <el-input type="text" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="上传文件" prop="age">
        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed">
          <el-button size="small" type="primary">{{$t('vicenter.common.uploadText')}}</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">{{$t('vicenter.common.submit')}}</el-button>
        <el-button @click="resetForm('ruleForm2')">{{$t('vicenter.common.cancel')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'addfile',
  data () {
    return {
      prpData: {
        label: "",
        value: ""
      },
      ruleForm2: {
        region: '',
        checkPass: '',
        age: ''
      },
      rules2: {
        region: [
          { validator: () => { }, trigger: 'blur' }
        ],
        checkPass: [
          { validator: () => { }, trigger: 'blur' }
        ],
        age: [
          { validator: () => { }, trigger: 'blur' }
        ]
      }
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
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
  // components: { ComForm, upload }
}
</script>

<style lang="scss" scoped>
.out {
  width: 500px;
  margin: 100px auto !important;
  text-align: left;
}
</style>
<style>
#addfile_ .pack {
  display: flex !important;
}
#addfile_ .pack .list-label {
  max-width: 130px;
  text-align: right;
}
#addfile_ .pack .list-label label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#addfile .el-select {
  width: 100%;
}
</style>
