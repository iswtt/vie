<template>
<div id="login">
  <div class="login-form-bg">
    <p>{{$t('vicenter.common.titleInfo')}}</p>
    <div class="form">
      <el-form :model='loginRule' ref="ruleForm" :rules='rule' class="firForm">
        <el-form-item class="firFormItem" prop="account">
          <i class="iconfont">&#xe6a3;</i>
          <el-input class="firIptClass" v-model="loginRule.account" name="account" @keyup.enter.native="toPasswordInput" :placeholder="$t('vicenter.login.userInfo')"></el-input>
        </el-form-item>
        <el-form-item class="firFormItem" prop="password">
          <i class="iconfont">&#xe627;</i>
          <el-input class="firIptClass" type='password' name="password" @keyup.enter.native="login" oncopy="return false" onpaste="return false" oncut="return false" oncontextmenu="return false" v-model="loginRule.password" :placeholder="$t('vicenter.login.passInfo')"></el-input>
        </el-form-item>
        <el-form-item class="firFormItem" prop="lang">
          <i class="iconfont">&#xe76c;</i>
          <el-select class="firIptClass" v-model="loginRule.lang" :placeholder="$t('vicenter.login.langInfo')" @change="change">
            <el-option v-for="item in LangOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="firFormItem" prop='captcha' v-if='yzm'>
          <i class="iconfont">&#xe6cb;</i>
          <el-input class="firIptClass" :placeholder="$t('vicenter.login.useryzm')" v-model="captchaCodeIpt" autoComplete="on" :maxlength='captchaLength'>
            <img style='width: 142px;margin-right:-9px;cursor:pointer' slot="suffix" :src='captchaContent' @click='getKaptcha' />
          </el-input>
        </el-form-item>
        <!-- <el-form-item class="firFormItem">
            <el-button class="firbutton" type="primary" @click="login('ruleForm')">{{$t('vicenter.login.title')}}</el-button>
          </el-form-item> -->
        <el-form-item class="firFormItem">
          <CountDown class="firbutton" :CountOptions='loginOptions'></CountDown>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <!-- <crypto></crypto> -->
  <cryp></cryp>
  <div class="modal-dialog">
    <Dialog :modalData="modalData">
      <tabform ref='ChagePassForm' :searchIpt="modalItem" :searchFunc="modalFn" :fromClass="fromClass" :formRule='modalRule'></tabform>
    </Dialog>
  </div>
</div>
</template>

<script>
import tabform from '@/components/form'
import CountDown from '@/components/Countdown'
import Dialog from '@/components/dialog'
import ajax from '@/api/common/common.js'
export default {
  name: 'login',
  data() {
    const requConfPass = (rule, value, callback) => {
      let {
        password
      } = this.modalRule.model
      if (value === '') {
        callback(new Error(this.$t('vicenter.urpm.index.EnterConPass')))
      } else if (value !== password) {
        callback(new Error(this.$t('vicenter.urpm.index.DiffTwoPass')))
      } else {
        callback()
      }
    }
    const passwordConf = (rule, value, callback) => {
      let {
        oldPass
      } = this.modalRule.model
      if (value === oldPass) {
        callback(new Error(this.$t('vicenter.urpm.index.DiffoldPass')))
      } else {
        callback()
      }
    }
    return {
      fromClass: { // 样式
        form: 'search-form',
        formItem: 'search-form-item',
        label: 'search-form-label',
        iptClass: 'search-form-input',
        buttonClass: 'search-form-btn'
      },
      modalData: {
        title: this.$t('vicenter.user.modifyPwd'),
        flag: false
      },
      modalFn: { // 弹窗表单确定方法
        outBtn: true, // 弹窗按钮
        query: this.sure,
        close: this.closeModal,
        queryText: this.$t('vicenter.common.sure'),
        resetText: this.$t('vicenter.common.cancel')
      },
      modalRule: { // 弹窗表单验证和存放数据 model=> post到后台的数据
        refName: 'queryForm',
        rule: {
          oldPass: [{
            required: true,
            message: this.$t('vicenter.urpm.index.EnterOldPass'),
            trigger: 'blur'
          }],
          password: [{
              required: true,
              message: this.$t('vicenter.urpm.index.EnterNewPass'),
              trigger: 'blur'
            },
            {
              validator: passwordConf,
              trigger: 'blur'
            }
          ],
          ConfPass: [{
              required: true,
              message: this.$t('vicenter.urpm.index.EnterConPass'),
              trigger: 'blur'
            },
            {
              validator: requConfPass,
              trigger: 'blur'
            }
          ]
        },
        model: {}
      },
      modalItem: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('vicenter.urpm.index.oldPassword'),
          type: 'password',
          placeHolder: this.$t('vicenter.urpm.index.EnterOldPass'),
          models: '',
          ruleProp: 'oldPass'
        },
        {
          getLabel: this.$t('vicenter.urpm.index.newPassword'),
          type: 'password',
          placeHolder: this.$t('vicenter.urpm.index.EnterNewPass'),
          models: '',
          ruleProp: 'password',
          tipPassrule: ''
        },
        {
          getLabel: this.$t('vicenter.urpm.index.conPassword'),
          type: 'password',
          placeHolder: this.$t('vicenter.urpm.index.EnterConPass'),
          models: '',
          ruleProp: 'ConfPass'
        }
      ],
      yzm: false,
      captchaContent: '',
      captchaToken: '',
      captchaLength: 6,
      falseFlag: false,
      tipPassrule: '',
      abc: '123',
      rule: { // 表单校验
        account: [{
          required: true,
          message: this.$t('vicenter.login.userInfo'),
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: this.$t('vicenter.login.passInfo'),
          trigger: 'blur'
        }],
        captcha: [],
        lang: [{
          required: true,
          message: this.$t('vicenter.login.langInfo'),
          trigger: 'change'
        }]
      },
      loginOptions: {
        time: 3,
        func: this.login,
        type: 'submit'
      },
      captchaCodeIpt: '',
      loginRule: { // 表单提交数据
        account: '',
        password: '',
        captcha: '',
        lang: ''
      },
      LangOption: [{
          value: 'zh-CN',
          label: this.$t('vicenter.common.Chinese')
        },
        {
          value: 'en-US',
          label: this.$t('vicenter.common.English')
        }
      ]
    }
  },
  beforeCreate() {
    const {
      lang
    } = this.$store.state
    this.$i18n.locale = lang
  },
  created() {
    const lang = sessionStorage.getItem('locale')
    if (lang === 'en-US') {
      this.login.lang = 'en-US'
    } else if (lang === 'zh-CN') {
      this.login.lang = 'zh-CN'
    }
    ajax.initPwdRule().then((res) => {
      if (res.data.flag) {
        this.$data.modalRule.rule.password.unshift({
          min: res.data.result.minLength,
          max: res.data.result.maxLength,
          message: this.$t('vicenter.urpm.index.EnterPassLength'),
          trigger: 'blur'
        })
        var content = ''
        if (res.data.result.containsDigitalNumber) {
          content += this.$t('vicenter.urpm.index.number') + ','
          this.$data.modalRule.rule.password.unshift({
            pattern: '.*[0-9]+.*',
            message: this.$t('vicenter.urpm.index.EnterPassLength'),
            trigger: 'blur'
          })
        }
        if (res.data.result.containsLowercaseLetters) {
          content += this.$t('vicenter.urpm.index.LowercaseLetter') + ','
          this.$data.modalRule.rule.password.unshift({
            pattern: '.*[a-z]+.*',
            message: this.$t('vicenter.urpm.index.EnterPassLength'),
            trigger: 'blur'
          })
        }
        if (res.data.result.containsUppercaseLetters) {
          content += this.$t('vicenter.urpm.index.UppercaseLetter') + ','
          this.$data.modalRule.rule.password.unshift({
            pattern: '.*[A-Z]+.*',
            message: this.$t('vicenter.urpm.index.EnterPassLength'),
            trigger: 'blur'
          })
        }
        if (res.data.result.containsSpecialCharacters) {
          content += this.$t('vicenter.urpm.index.SpecialCharacter') + ','
          this.$data.modalRule.rule.password.unshift({
            pattern: '.*[^0-9a-zA-Z]+.*',
            message: this.$t('vicenter.urpm.index.EnterPassLength'),
            trigger: 'blur'
          })
        }
        if (content === '') {
          this.$data.tipPassrule = this.$t('vicenter.urpm.index.passwordLength', {
            min: res.data.result.minLength,
            max: res.data.result.maxLength
          })
          this.modalItem.forEach(e => {
            if (e.ruleProp === 'password') {
              e.tipPassrule = this.$data.tipPassrule
            }
          })
        } else {
          content += this.$t('vicenter.urpm.index.allpassword', {
            min: res.data.result.minLength,
            max: res.data.result.maxLength
          })
          this.$data.tipPassrule = this.$t('vicenter.urpm.index.mustHave') + content
          this.modalItem.forEach(e => {
            if (e.ruleProp === 'password') {
              e.tipPassrule = this.$data.tipPassrule
            }
          })
        }
      }
    }).catch(() => {})
    document.getElementsByTagName('title')[0].innerHTML = this.$t('vicenter.common.titleInfo')
    this.getKaptcha()
  },
  mounted() {
    const {
      lang
    } = this.$store.state
    this.loginRule.lang = lang
    this.$store.commit({
      type: 'loadIM',
      IMUrl: '',
      isloadIM: false
    })
  },
  activated() {
    const {
      lang
    } = this.$store.state
    this.loginRule.lang = lang
  },
  methods: {
    change() {
      setTimeout(() => {
        const {
          lang
        } = this.$data.loginRule
        this.$store.commit({
          type: 'changeLang',
          lang: lang,
          path: '/login'
        })
        this.$router.push({
          path: '/language'
        })
      }, 50)
    },
    getKaptcha() {
      ajax.getKaptcha().then((res) => {
        if (res.data.flag) {
          if (res.data.result === null) {
            this.yzm = false
            this.loginRule.captcha = []
          } else {
            this.yzm = true
            this.captchaContent = `data:image/jpeg;base64,${res.data.result.captchaContent}`
            this.captchaToken = res.data.result.captchaToken
            this.captchaLength = res.data.result.captchaLength
            this.loginRule.captcha = [{
                required: true,
                message: this.$t('vicenter.login.useryzm'),
                trigger: 'blur'
              },
              {
                max: this.captchaLength,
                min: this.captchaLength,
                message: this.$t('vicenter.login.yzmError'),
                trigger: 'blur'
              }
            ]
          }
        }
      }).catch(() => {})
    },
    login() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // var str = encrypt(this.$data.loginRule.account, this.$data.loginRule.password)
          // const loginData = {
          // loginStr: str
          // }
          var loginData = {}
          if (this.yzm) {
            loginData = {
              loginStr: encrypt(this.$data.loginRule.account, this.$data.loginRule.password),
              captchaCode: this.$data.captchaCodeIpt,
              captchaToken: this.captchaToken
            }
          } else {
            loginData = {
              loginStr: encrypt(this.$data.loginRule.account, this.$data.loginRule.password)
            }
          }
          ajax.login(loginData).then((res) => {
            if (res.data.flag) {
              console.log(res.headers)
              localStorage.setItem('Xcsrftoken', res.headers['x-csrf-token'])
              sessionStorage.setItem('account', res.data.result.account)
              sessionStorage.setItem('userName', res.data.result.userName)
              sessionStorage.setItem('userId', res.data.result.userId)
              this.loginRule.account = ''
              this.loginRule.password = ''
              // 获取系统参数
              ajax.getSystemConfig().then(res => {
                if (res.data.flag && res.data.result.content.length > 0) {
                  let configObj = {}
                  res.data.result.content.forEach(item => {
                    configObj[item.confKey] = item.confValue
                  })
                  sessionStorage.setItem('systemConfig', JSON.stringify(configObj))
                }
              }).catch(() => {})
              this.$router.push({
                path: '/menus'
              })
              // 以下是IM部分
              sessionStorage.setItem('IMUrl', window.config.baseUrl + window.config.imUrl + '?lang=' + this.$store.state.lang + '&X-CSRF-TOKEN=' + res.headers['x-csrf-token'])
              sessionStorage.setItem('isloadIM', 'load')
              this.$store.commit({
                type: 'loadIM',
                IMUrl: window.config.baseUrl + window.config.imUrl + '?lang=' + this.$store.state.lang + '&X-CSRF-TOKEN=' + res.headers['x-csrf-token'],
                isloadIM: 'load'
              })
            } else if (!res.data.flag && res.data.errorCode === 'I010104') {
              // 必须更改密码后才能登录
              this.modalItem[0].models = this.loginRule.password
              this.modalRule.model.oldPass = this.loginRule.password
              console.log(this.modalRule.model.oldPass)
              this.$data.modalData.flag = true
            }
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    toPasswordInput() {
      document.getElementsByName('password')[0].focus()
    },
    closeModal() { // 关闭修改密码弹窗
      this.$data.modalData.flag = false // 关闭模态窗
      this.$refs.ChagePassForm.reset() // 清空所有填写数据与验证
    },
    sure() {
      const passwordData = {
        changeStr: encrypt(this.loginRule.account, this.$data.modalRule.model.oldPass, this.$data.modalRule.model.password)
      }
      ajax.changePassword(passwordData).then((res) => {
        if (res.data.flag) {
          this.loginRule.password = ''
          this.$data.modalData.flag = false // 关闭模态窗
          this.$refs.ChagePassForm.reset() // 清空所有填写数据与验证
          this.$NotifSuccess(this.$t('vicenter.urpm.index.ChangeSuccess'))
        }
      }).catch(() => {})
    }
  },
  components: {
    Dialog,
    tabform,
    CountDown,
    'crypto': {
      render(createElement) {
        return createElement(
          'script', {
            attrs: {
              type: 'text/javascript',
              src: window.config.baseUrl + '/upmsapi/webjars/crypto-js/3.1.9/crypto-js.js'
            }
          }
        )
      }
    },
    'cryp': {
      render(createElement) {
        return createElement(
          'script', {
            attrs: {
              type: 'text/javascript',
              src: window.config.baseUrl + '/upmsapi/static/js/crypto.min.js'
            }
          }
        )
      }
    }
  },
  watch: {
    loginForm: { // 为表单数据赋值
      handler(oldValue, newValue) {
        for (let k = 0; k < newValue.length; k++) {
          this.$data.loginRule.model[newValue[k].ruleProp] = newValue[k].models
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';

#login {
  width: $all;
  height: $all;
  @include flex();
  @include loginBg();
  background-size: $all $all;

  .login-form-bg {
    @include flex(column, center, center);

    p {
      color: $white;
      font-size: $welcomeTitle;
      font-weight: bold;
      margin-bottom: 130px;
    }

    .form {

      // width: 400px;
      .firForm {
        width: $all;
        padding: 20px 80px;
        @include box-sizing();
        @include flex(column, center, center);
        flex-wrap: wrap;
        @include loginFormBg(); // 表单背景色
        opacity: .9;
        border-radius: 10px;
      }

      .firFormItem {
        margin-right: $dis10;
        position: relative;
        width: 400px;

        .iconfont {
          color: $white;
          font-size: $title;
          position: absolute;
          left: 0;
          bottom: $margin;
        }

        .el-form-item__content {
          .el-form-item__error {
            top: 70%;
            text-align: left;
          }
        }
      }

      .firformLabel {
        width: $all;
        text-align: left;
        display: block;
      }

      .firIptClass {
        margin: 0;
        width: $all;
        margin-bottom: $dis10 * 2;

        .el-input__inner {
          color: $white;
          background-color: transparent;
          border-left: none;
          border-top: none;
          border-right: none;
          border-radius: 0;
          padding-left: $margin*2;
          font-size: $texts;

          &:focus {
            @include loginFormItemBorder();
          }
        }
      }

      .firbutton {
        width: $all;

        button {
          width: $all
        }
      }
    }
  }

  .modal-dialog {
    .search-form {
      @include layout(1);
    }
  }
}
</style>
