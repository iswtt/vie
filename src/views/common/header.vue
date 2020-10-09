<template>
  <div id="header">
    <div class="header-contanier">
      <div class="left">
        <div class="logo"></div>
        <div class="title">{{$t(this.$route.matched[0].meta.title)}}</div>
      </div>
      <div class="right">
        <div class="meun" @click="toMenu">
          <i class="iconfont">&#xe600;</i>
        </div>
        <div class="im" :title="userName" @dblclick="showIm">
          <el-badge :value="$store.state.imMessageNum" :hidden="Number($store.state.imMessageNum) === 0" class="item">
            <i class="iconfont" :class="{'active': Number($store.state.imMessageNum) === 0 ? false : true, 'isLogOut': $store.state.imisLogOut === 'logOut'}">&#xe6e8;</i>
          </el-badge>
        </div>
        <div class="skin">
          <i class="iconfont">&#xe67b;</i>
          <el-dropdown trigger="click" @command="selectSkin">
            <span class="el-dropdown-link whiteC">
              {{skinTheme}}<i class="el-icon-arrow-down el-icon--right whiteC"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='blue'>{{$t('vicenter.common.skinBLUE')}}</el-dropdown-item>
              <el-dropdown-item command='red'>{{$t('vicenter.common.skinRED')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="lang">
          <i class="iconfont">&#xe76c;</i>
          <el-dropdown trigger="click" @command="selectLang">
            <span class="el-dropdown-link whiteC">
              {{language ? $t('vicenter.common.Chinese') : $t('vicenter.common.English')}}<i class="el-icon-arrow-down el-icon--right whiteC"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='zh-CN'>{{$t('vicenter.common.Chinese')}}</el-dropdown-item>
              <el-dropdown-item command='en-US'>{{$t('vicenter.common.English')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="user">
          <i class="iconfont">&#xe652;</i>
          <el-dropdown trigger="click" @command="modifyPwd">
            <span class="el-dropdown-link whiteC">
              {{userName}}<i class="el-icon-arrow-down el-icon--right whiteC"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="modifyPwd">{{$t('vicenter.user.modifyPwd')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="logout" @click="logOut">
          <i class="iconfont">&#xe653;</i>
        </div>
      </div>
    </div>
    <!-- <crypto></crypto> -->
    <cryp></cryp>
    <!-- <div class="imIframeDialog" :class="{'hidden': !imModalData.flag}">
      <div class="content">
        <div class="imframeHeader">
          <span @click="closeIm"><i class="el-icon-close"></i></span>
        </div>
        <iframe :src="imUrl" class="imIframe" id="imIframe"></iframe>
      </div>
    </div> -->
    <div class="modal-dialog">
      <Dialog :modalData="modalData">
        <ComForm ref='form' :searchIpt="modalItem" :searchFunc="modalFn" :fromClass="fromClass" :formRule='modalRule'></ComForm>
      </Dialog>
    </div>
  </div>
</template>

<script>
import locale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import Dialog from '@/components/dialog'
import ComForm from '@/components/form'
import ajax from '@/api/common/common.js'
import viProbe from '@/lib/viprobe/viProbeForDms.js'
import $axios from '@/components/axios.js'
export default {
  name: 'Header',
  data () {
    const requConfPass = (rule, value, callback) => {
      let {password} = this.modalRule.model
      if (value === '') {
        callback(new Error(this.$t('vicenter.urpm.index.EnterConPass')))
      } else if (value !== password) {
        callback(new Error(this.$t('vicenter.urpm.index.DiffTwoPass')))
      } else {
        callback()
      }
    }
    const passwordConf = (rule, value, callback) => {
      let {oldPass} = this.modalRule.model
      if (value === oldPass) {
        callback(new Error(this.$t('vicenter.urpm.index.DiffoldPass')))
      } else {
        callback()
      }
    }
    return {
      modalRule: { // 弹窗表单验证和存放数据 model=> post到后台的数据
        refName: 'queryForm',
        rule: {
          oldPass: [
            { required: true, message: this.$t('vicenter.urpm.index.EnterOldPass'), trigger: 'blur' }
          ],
          password: [
            { required: true, message: this.$t('vicenter.urpm.index.EnterNewPass'), trigger: 'blur' },
            { validator: passwordConf, trigger: 'blur' }
          ],
          ConfPass: [
            { required: true, message: this.$t('vicenter.urpm.index.EnterConPass'), trigger: 'blur' },
            { validator: requConfPass, trigger: 'blur' }
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
      language: null, // 利用标识判断显示地球图标后面的语言
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
      userName: '',
      fromClass: { // 样式
        form: 'search-form',
        formItem: 'search-form-item',
        label: 'search-form-label',
        iptClass: 'search-form-input',
        buttonClass: 'search-form-btn'
      },
      tipPassrule: '', // 用于存放密码修改提示
      skinTheme: '',
      imUrl: '',
      imIframe: null,
      imMessageNum: 0,
      isImLogin: true,
      imModalData: {
        title: 'IM',
        flag: false
      },
      isLogOut: true
    }
  },
  mounted () {},
  beforeCreate () {
    const {lang} = this.$store.state
    if (lang === 'zh-CN') {
      this.$i18n.locale = 'zh-CN'
      locale.use(zhLocale)
      // this.$data.language = true
    } else if (lang === 'en-US') {
      this.$i18n.locale = 'en-US'
      locale.use(enLocale)
      // this.$data.language = false
    }
  },
  created () {
    if (document.getElementById('initBody').getAttribute('data-theme') === 'blue') {
      this.$data.skinTheme = this.$t('vicenter.common.skinBLUE')
    } else if (document.getElementById('initBody').getAttribute('data-theme') === 'red') {
      this.$data.skinTheme = this.$t('vicenter.common.skinRED')
    } else if (!document.getElementById('initBody').getAttribute('data-theme')) {
      if (window.config.skinTheme === 'blue') {
        this.$data.skinTheme = this.$t('vicenter.common.skinBLUE')
      } else if (window.config.skinTheme === 'red') {
        this.$data.skinTheme = this.$t('vicenter.common.skinRED')
      }
    }
    const {lang} = this.$store.state
    if (lang === 'zh-CN') {
      this.$data.language = true
    } else if (lang === 'en-US') {
      this.$data.language = false
    }
    document.getElementsByTagName('title')[0].innerHTML = this.$t(this.$route.matched[0].meta.title)
    this.userName = sessionStorage.userName
    this.defaultActive = this.$route.path
    if (sessionStorage.getItem('locale') === 'zh-CN') {
      this.$data.language = true
    } else if (sessionStorage.getItem('locale') === 'en-US') {
      this.$data.language = false
    }
    this.$data.username = sessionStorage.getItem('userName')
    // 解决在加了keep-alive的页面，新密码规则提示语国际化显示有误的问题
    this.getPwdRule()
  },
  activated () {
    this.userName = sessionStorage.userName
    if (document.getElementById('initBody').getAttribute('data-theme') === 'blue') {
      this.$data.skinTheme = this.$t('vicenter.common.skinBLUE')
    } else if (document.getElementById('initBody').getAttribute('data-theme') === 'red') {
      this.$data.skinTheme = this.$t('vicenter.common.skinRED')
    } else if (!document.getElementById('initBody').getAttribute('data-theme')) {
      if (window.config.skinTheme === 'blue') {
        this.$data.skinTheme = this.$t('vicenter.common.skinBLUE')
      } else if (window.config.skinTheme === 'red') {
        this.$data.skinTheme = this.$t('vicenter.common.skinRED')
      }
    }
    const {lang} = this.$store.state
    if (lang === 'zh-CN') {
      this.$i18n.locale = 'zh-CN'
      locale.use(zhLocale)
      this.$data.language = true
    } else if (lang === 'en-US') {
      this.$i18n.locale = 'en-US'
      locale.use(enLocale)
      this.$data.language = false
    }
    document.getElementsByTagName('title')[0].innerHTML = this.$t(this.$route.matched[0].meta.title)
    this.modalData.title = this.$t('vicenter.user.modifyPwd')
    this.modalFn.queryText = this.$t('vicenter.common.sure')
    this.modalFn.resetText = this.$t('vicenter.common.cancel')
    this.modalItem.forEach((e) => {
      if (e.ruleProp === 'oldPass') {
        e.getLabel = this.$t('vicenter.urpm.index.oldPassword')
        e.placeHolder = this.$t('vicenter.urpm.index.EnterOldPass')
      } else if (e.ruleProp === 'password') {
        e.getLabel = this.$t('vicenter.urpm.index.newPassword')
        e.placeHolder = this.$t('vicenter.urpm.index.EnterNewPass')
      } else if (e.ruleProp === 'ConfPass') {
        e.getLabel = this.$t('vicenter.urpm.index.conPassword')
        e.placeHolder = this.$t('vicenter.urpm.index.EnterConPass')
      }
    })
    const requConfPass = (rule, value, callback) => {
      let {password} = this.modalRule.model
      if (value === '') {
        callback(new Error(this.$t('vicenter.urpm.index.EnterConPass')))
      } else if (value !== password) {
        callback(new Error(this.$t('vicenter.urpm.index.DiffTwoPass')))
      } else {
        callback()
      }
    }
    const passwordConf = (rule, value, callback) => {
      let {oldPass} = this.modalRule.model
      if (value === oldPass) {
        callback(new Error(this.$t('vicenter.urpm.index.DiffoldPass')))
      } else {
        callback()
      }
    }
    this.modalRule.rule = {
      oldPass: [
        { required: true, message: this.$t('vicenter.urpm.index.EnterOldPass'), trigger: 'blur' }
      ],
      password: [
        { required: true, message: this.$t('vicenter.urpm.index.EnterNewPass'), trigger: 'blur' },
        { validator: passwordConf, trigger: 'blur' }
      ],
      ConfPass: [
        { required: true, message: this.$t('vicenter.urpm.index.EnterConPass'), trigger: 'blur' },
        { validator: requConfPass, trigger: 'blur' }
      ]
    }
    // 解决在加了keep-alive的页面，新密码规则提示语国际化显示有误的问题
    this.getPwdRule()
  },
  methods: {
    showIm () {
      let userAgent = navigator.userAgent
      if (this.$store.state.imisLogOut === 'logOut') {
        this.$notify.warning({
          title: this.$t('vicenter.common.warning'),
          message: this.$t('vicenter.common.reconnection')
        })
        return
      }
      if (userAgent.indexOf('Chrome') > -1) {
        $axios({
          method: 'get',
          url: 'upmsapi/user/isLogon'
        }, {}).then((res) => {
          if (res.data.flag) {
            // this.imModalData.flag = true
            // this.imMessageNum = 0
            console.log('show')
            this.$store.commit({
              type: 'showIM',
              isIMhidden: 'show'
            })
            sessionStorage.setItem('isIMhidden', 'show')
          } else {
            this.$ruter.push({path: '/login'})
            // sessionStorage.clear()
            this.$clearSession()
          }
        }).catch(() => {})
      } else {
        this.$notify.warning({
          title: this.$t('vicenter.common.warning'),
          message: this.$t('vicenter.common.openOnChrome')
        })
      }
    },
    toMenu () {
      this.$router.push({
        path: '/menus'
      })
    },
    logOut () { // 退出登录
      this.$confirm(this.$t('vicenter.login.logOut'), '', {
        confirmButtonText: this.$t('vicenter.common.sure'),
        cancelButtonText: this.$t('vicenter.common.cancel'),
        type: 'warning'
      }).then(() => {
        ajax.logout({}).then((res) => {
          if (res.data.flag) {
            let msg = JSON.stringify({command: 'logout', args: []})
            let imIframe = document.getElementById('imIframe')
            imIframe.contentWindow.postMessage(msg, '*')
            setTimeout(() => {
              // sessionStorage.clear()
              this.$clearSession()
              this.$store.commit({
                type: 'showIM',
                isIMhidden: 'hidden'
              },
              {
                type: 'loadIM',
                IMUrl: '',
                isloadIM: ''
              })
              this.$router.push({
                path: '/login'
              })
              this.$notify.success({
                title: this.$t('vicenter.common.successfuly'),
                message: this.$t('vicenter.urpm.index.LogOutSuccess')
              })
              viProbe.closeAllImageInViProbe()
            }, 200)
          }
        }).catch(() => {})
      })
    },
    selectSkin (command) {
      if (command === 'blue') {
        this.$data.skinTheme = this.$t('vicenter.common.skinBLUE')
      } else if (command === 'red') {
        this.$data.skinTheme = this.$t('vicenter.common.skinRED')
      }
      if (sessionStorage.getItem('skin') !== command) {
        sessionStorage.setItem('skin', command)
        this.$store.commit({
          type: 'changeSkin',
          path: this.$route.path
        })
        this.$router.push({ path: '/skin' })
      }
    },
    selectLang (command) { // 选择语言
      const {lang} = this.$store.state
      if (lang !== command) {
        this.$store.commit({
          type: 'changeLang',
          lang: command,
          path: this.$route.path
        })
        this.$router.push({ path: '/language' })
      }
    },
    modifyPwd (data) { // 修改密码
      console.log('data', data)
      this.$data.modalData.flag = true
      this.$nextTick(() => {
        this.$refs.form.reset() // 清空所有填写数据与验证
      })
    },
    sure () {
      const passwordData = {
        changeStr: encrypt(sessionStorage.account, this.$data.modalRule.model.oldPass, this.$data.modalRule.model.password)
      }
      ajax.changePassword(passwordData).then((res) => {
        if (res.data.flag) {
          this.$data.modalData.flag = false // 关闭模态窗
          console.log(this.$refs.form.$refs.queryForm)
          this.$NotifSuccess(this.$t('vicenter.urpm.index.ChangeSuccess'))
        }
      }).catch(() => {})
    },
    closeModal () {
      this.$data.modalData.flag = false
      this.$refs.form.reset() // 清空所有填写数据与验证
    },
    getPwdRule () {
      ajax.initPwdRule().then((res) => {
        if (res.data.flag) {
          this.$data.modalRule.rule.password.unshift({ min: res.data.result.minLength, max: res.data.result.maxLength, message: this.$t('vicenter.urpm.index.EnterPassLength'), trigger: 'blur' })
          var content = ''
          if (res.data.result.containsDigitalNumber) {
            content += this.$t('vicenter.urpm.index.number') + ','
            this.$data.modalRule.rule.password.unshift({ pattern: '.*[0-9]+.*', message: this.$t('vicenter.urpm.index.EnterPassLength'), trigger: 'blur' })
          }
          if (res.data.result.containsLowercaseLetters) {
            content += this.$t('vicenter.urpm.index.LowercaseLetter') + ','
            this.$data.modalRule.rule.password.unshift({ pattern: '.*[a-z]+.*', message: this.$t('vicenter.urpm.index.EnterPassLength'), trigger: 'blur' })
          }
          if (res.data.result.containsUppercaseLetters) {
            content += this.$t('vicenter.urpm.index.UppercaseLetter') + ','
            this.$data.modalRule.rule.password.unshift({ pattern: '.*[A-Z]+.*', message: this.$t('vicenter.urpm.index.EnterPassLength'), trigger: 'blur' })
          }
          if (res.data.result.containsSpecialCharacters) {
            content += this.$t('vicenter.urpm.index.SpecialCharacter') + ','
            this.$data.modalRule.rule.password.unshift({ pattern: '.*[^0-9a-zA-Z]+.*', message: this.$t('vicenter.urpm.index.EnterPassLength'), trigger: 'blur' })
          }
          if (content === '') {
            this.$data.tipPassrule = this.$t('vicenter.urpm.index.passwordLength', {min: res.data.result.minLength, max: res.data.result.maxLength})
            this.modalItem.forEach(e => {
              if (e.ruleProp === 'password') {
                e.tipPassrule = this.$data.tipPassrule
              }
            })
          } else {
            content += this.$t('vicenter.urpm.index.allpassword', {min: res.data.result.minLength, max: res.data.result.maxLength})
            this.$data.tipPassrule = this.$t('vicenter.urpm.index.mustHave') + content
            this.modalItem.forEach(e => {
              if (e.ruleProp === 'password') {
                e.tipPassrule = this.$data.tipPassrule
              }
            })
          }
        }
      }).catch(() => {})
    }
  },
  computed: {},
  watch: {},
  props: [ ],
  components: {
    Dialog,
    ComForm,
    'crypto': {
      render (createElement) {
        return createElement(
          'script',
          {
            attrs: {
              type: 'text/javascript',
              src: window.config.baseUrl + '/upmsapi/webjars/crypto-js/3.1.9/crypto-js.js'
            }
          }
        )
      }
    },
    'cryp': {
      render (createElement) {
        return createElement(
          'script',
          {
            attrs: {
              type: 'text/javascript',
              src: window.config.baseUrl + '/upmsapi/static/js/crypto.min.js'
            }
          }
        )
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
#header {
  width: $all;
  height: $all;
  @include headerBg();
  background-size: $all $all;
  .header-contanier {
    @include flex(row, space-between, center);
    width: $all;
    height: $all;
    .whiteC {
      color: $white;
    }
    @include flex(row, space-between, center);
    .left {
      height: $all;
      @include flex(row, flex-start, center);
      .logo {
        height: $all;
        width: 180px;
        background: $logo no-repeat $logoSize;
      }
      .title {
        color: $white;
        text-align: left;
        font-size: $headerTitle;
        font-weight: bold;
      }
    }
    .right {
      height: $all;
      @include flex(row, center, flex-end);
      padding: 0 $dis10 $dis10 * 2 0;
      .meun {
        margin-right: 5px;
        cursor: pointer;
      }
      .iconfont {
        font-size: $headerRight;
        color: $white;
        margin-right: $dis10;
      }
      .im,
      .skin,
      .lang,
      .user,
      .logout {
        margin-right: $dis10 * 2;
        @include flex();
        &:hover {
          cursor: pointer;
        }
      }
      .im .iconfont {
        margin: 0;
      }
      .im .active {
        margin: 0;
        -webkit-animation: scaleout 1s infinite ease-in-out;
        animation: scaleout 1s infinite ease-in-out;
        @-webkit-keyframes scaleout {
          0% { -webkit-transform: scale(1.0) }
          100% {
            -webkit-transform: scale(1.1);
            opacity: 0;
          }
        }
        @keyframes scaleout {
          0% {
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
          } 100% {
              transform: scale(1.1);
              -webkit-transform: scale(1.1);
              opacity: 0;
            }
        }
      }
      .im .isLogOut {
        color: #ccc;
      }
    }
  }
  .modal-dialog {
    .search-form {
      @include layout(1);
    }
  }
  // .imIframeDialog.hidden {
  //   top: -2000px;
  // }
  // .imIframeDialog {
  //   width: 100%;
  //   height: 100%;
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   z-index: 999999;
  //   background: rgba(0, 0, 0, 0.4);
  //   .content {
  //     width: 1300px;
  //     height: 700px;
  //     position: absolute;
  //     top: 100px;
  //     left: 50%;
  //     margin-left: -650px;
  //     padding: 20px;
  //     @include box-sizing;
  //     // background: #fff;
  //   }
  //   .imframeHeader {
  //     height: 50px;
  //     width: 100%;
  //     // @include flex(row, space-between, center);
  //     position: relative;
  //     i {
  //       position: absolute;
  //       top: 50px;
  //       right: 10px;
  //       cursor: pointer;
  //     }
  //   }
  //   .imIframe {
  //     width: 100%;
  //     height: calc(100% - 50px);
  //     border: none;
  //   }
  // }
}
.el-dropdown-menu {
  padding: 0;
}
</style>
