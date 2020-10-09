<template>
  <div v-if='showMenu' id="menu">
    <div id="menu-header">
      <div class="header-contanier">
        <div class="left">
          <div class="logo"></div>
          <div class="title">{{$t('vicenter.common.titleInfo')}}</div>
        </div>
        <div class="right">
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
      <div class="modal-dialog">
        <Dialog :modalData="modalData">
          <ComForm ref='form' :searchIpt="modalItem" :searchFunc="modalFn" :fromClass="fromClass" :formRule='modalRule'></ComForm>
        </Dialog>
      </div>
    </div>
    <div class="menu-bar" v-bar>
      <div>
        <div id="menu-box">
          <div class="box" v-for="(item, key) in data" :key='key' @click="pushTo(item.url)">
            {{item.label}}
          </div>
        </div>
      </div>
    </div>
    <!-- <crypto></crypto> -->
    <cryp></cryp>
  </div>
</template>

<script>
import locale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import Dialog from '@/components/dialog'
import ComForm from '@/components/form'
import ajax from '@/api/common/common.js'
import $axios from '@/components/axios.js'
import $prmCode from '@/lib/common/code.js'
export default {
  name: 'meuns',
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
      showMenu: false,
      language: null, // 利用标识判断显示地球图标后面的语言
      modalData: {
        title: this.$t('vicenter.user.modifyPwd'),
        flag: false
      },
      imModalData: {
        title: 'IM',
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
      modalRule: { // 弹窗表单验证和存放数据 model=> post到后台的数据
        refName: 'ChagePassForm',
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
      fromClass: { // 样式
        form: 'search-form',
        formItem: 'search-form-item',
        label: 'search-form-label',
        iptClass: 'search-form-input',
        buttonClass: 'search-form-btn'
      },
      tipPassrule: '', // 用于存放密码修改提示
      dataForSelect: [
        // {
        //   label: '权限管理子系统',
        //   prmCode: 'URPM',
        //   url: {
        //     url: window.config.baseUrl + '/upms/',
        //     flag: false // 是否是本系统网页
        //   }
        // },
        {
          label: this.$t('vicenter.inspection.welcome.inspectionSystem'),
          prmCode: $prmCode.treeCode.inspection.code,
          url: {
            url: '/Inspection/index',
            flag: true // 是否是本系统网页
          }
        },
        {
          label: this.$t('vicenter.supervise.welcome.centralizedSupervisionsubsystem'),
          prmCode: $prmCode.treeCode.dms.code,
          url: {
            url: '/Supervise/index',
            flag: true // 是否是本系统网页
          }
        },
        {
          label: this.$t('vicenter.Background.welcome.backgroundManagementsubsystem'),
          prmCode: $prmCode.treeCode.mgmt.code,
          url: {
            url: '/Background/index',
            flag: true // 是否是本系统网页
          }
        },
        {
          label: this.$t('vicenter.training.system.name'),
          prmCode: $prmCode.treeCode.training.code,
          url: {
            url: '/Training/index',
            flag: true // 是否是本系统网页
          }
        },
        {
          label: this.$t('vicenter.ImageLibrary.welcome.typicalImageLibrary'),
          prmCode: $prmCode.treeCode.imageLibrary.code,
          url: {
            url: '/ImageLibrary/index',
            flag: true // 是否是本系统网页
          }
        },
        {
          label: this.$t('vicenter.tip.welcome.dangerousImage'),
          prmCode: $prmCode.treeCode.tip.code,
          url: {
            url: '/Tip/index',
            flag: true // 是否是本系统网页
          }
        },
        {
          label: this.$t('vicenter.reports.common.systemName'),
          prmCode: $prmCode.treeCode.reports.code,
          url: {
            url: '/Reports/index',
            flag: true // 是否是本系统网页
          }
        }
        // {
        //   label: this.$t('vicenter.IntegratedTraining.welcome.IntegratedTraining'),
        //   prmCode: $prmCode.treeCode.training.code,
        //   url: {
        //     url: '/IntegratedTraining/index',
        //     flag: true // 是否是本系统网页
        //   }
        // }
      ],
      data: [],
      skinTheme: ''
    }
  },
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
    this.$data.data = []
    for (let j in this.$data.dataForSelect) {
      for (let i in this.$PrmCodeList) {
        if (this.$PrmCodeList[i] === this.$data.dataForSelect[j].prmCode) {
          this.$data.data.push(this.$data.dataForSelect[j])
        }
      }
    }
    if (this.data.length === 1) {
      this.pushTo(this.data[0].url)
    } else if (this.data.length !== 1) {
      this.showMenu = true
    }
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
    document.getElementsByTagName('title')[0].innerHTML = this.$t('vicenter.common.titleInfo')
    this.userName = sessionStorage.userName
    this.defaultActive = this.$route.path
    if (sessionStorage.getItem('locale') === 'zh-CN') {
      this.$data.language = true
    } else if (sessionStorage.getItem('locale') === 'en-US') {
      this.$data.language = false
    }
    this.$data.username = sessionStorage.getItem('userName')
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
    logOut () { // 退出登录
      this.$confirm(this.$t('vicenter.login.logOut'), '', {
        confirmButtonText: this.$t('vicenter.common.sure'),
        cancelButtonText: this.$t('vicenter.common.cancel'),
        type: 'warning'
      }).then(() => {
        ajax.logout().then((res) => {
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
    pushTo (url) {
      console.log(url.url)
      if (url.flag) {
        this.$router.push({path: url.url})
      } else {
        window.location.href = url.url + '?lang=' + this.$store.state.lang + '&X-CSRF-TOKEN=' + localStorage.getItem('Xcsrftoken')
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
      this.modalData.flag = true
      this.$refs.form.reset() // 清空所有填写数据与验证
    },
    sure () {
      const passwordData = {
        changeStr: encrypt(sessionStorage.account, this.$data.modalRule.model.oldPass, this.$data.modalRule.model.password)
      }
      ajax.changePassword(passwordData).then((res) => {
        if (res.data.flag) {
          this.$data.modalData.flag = false // 关闭模态窗
          this.$NotifSuccess(this.$t('vicenter.urpm.index.ChangeSuccess'))
        }
      }).catch(() => {})
    },
    closeModal () {
      this.$data.modalData.flag = false
      this.$refs.form.reset() // 清空所有填写数据与验证
    }
  },
  components: { Dialog,
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
#menu {
  width: $all;
  height: $all;
  overflow: hidden;
  @include menusBg();
  background-size: $all $all;
  #menu-header {
    width: $all;
    height: 100px;
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
          margin: 20px 0 0 20px;
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
  }
  .menu-bar {
    @extend .extend-bar;
  }
  #menu-box {
    width: $all;
    @include flex();
    flex-wrap: wrap;
    padding: 50px 20%  0px 20%;
    @include box-sizing();
    .box  {
      width: 300px;
      height: 215px;
      margin:  20px;
      color: $white;
      @include flex();
      font-size:$headerTitle;
      cursor: pointer;
    }
    .box:nth-child(1) {
      background:#846abb;
    }
    .box:nth-child(2) {
      background:#c9964e;
    }
    .box:nth-child(3) {
      background:#b4557e;
    }
    .box:nth-child(4) {
      background:#68b74e;
    }
    .box:nth-child(5) {
      background:#2687ca;
    }
    .box:nth-child(6) {
      background:#3f4788;
    }
    .box:nth-child(7) {
      background:#aa3d6c;
    }
    .box:nth-child(8) {
      background:#3dbbb4;
    }
    .box:nth-child(9) {
      background:#5b9bd1;
    }
  }
}
.el-dropdown-menu {
  padding: 0;
}
</style>
