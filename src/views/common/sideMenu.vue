<template>
  <div class='menu-bar' v-bar>
    <div id="sideMenu">
      <el-menu :default-active="defalutAct" background-color="rgba(0,0,0,0)" text-color="#fff" :collapse="true" router @select="handleSelect">
        <span v-for="(item, index) in menuItem" :key="index">
          <el-submenu :index="item.path" v-if="item.child">
            <template slot="title">
              <i class="iconfont" v-html="item.icon"></i>
            </template>
            <el-menu-item-group v-for="(ele, idx) in item.children" :key="idx" class="menuItemGroup">
              <el-menu-item :index="ele.path" v-if='!ele.hidden' :data-id="'menuItem'+index+idx" :class="$route.path === ele.path ? 'is-active' : ''"><i class="iconfont">&#xe6b7;</i>{{$t(ele.name)}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item :index="item.path" v-if="!item.child" :data-id="'menuItem'+index" :class="$route.path === item.path ? 'is-active' : ''">
            <el-tooltip effect="dark" placement="right" :hide-after="2000">
              <div slot="content"><span>{{$t(item.content)}}</span></div>
              <i class="iconfont" v-html="item.icon"></i>
            </el-tooltip>
          </el-menu-item>
        </span>
      </el-menu>
    </div>
  </div>
</template>

<script>
import $prmCode from '@/lib/common/code.js'
export default {
  name: 'sideMenu',
  data () {
    return {
      defalutAct: '',
      menuItem: []
    }
  },
  activated () {
    this.setMenus()
  },
  created () {
    this.setMenus()
  },
  methods: {
    setMenus () {
      console.log(this.$route.path)
      this.defalutAct = this.$route.path
      let menu = []
      this.menuItem = []
      for (var k in this.$router.options.routes) {
        if (this.$router.options.routes[k].KEY === this.$route.path.split('/')[1]) {
          if (!this.hasDashboard(this.$router.options.routes[k].path)) {
            menu.push(JSON.parse(JSON.stringify(this.$router.options.routes[k])))
          }
        }
      }
      for (let i in menu) {
        for (let j in this.$PrmCodeList) {
          if (this.$PrmCodeList[j] === menu[i].prmCode) {
            let optionCopy = JSON.parse(JSON.stringify(menu[i]))
            if (optionCopy.child) {
              optionCopy.children = this.getChildMenu(optionCopy.children)
            }
            // if (optionCopy.path !== '/Background/setting') {
            //   this.menuItem.push(optionCopy)
            // }
            this.menuItem.push(optionCopy)
          }
        }
      }
    },
    handleSelect () {},
    getChildMenu (arr) { // 获取权限二级菜单
      let newArr = JSON.parse(JSON.stringify(arr))
      let children = []
      newArr.forEach(element => {
        this.$PrmCodeList.forEach(ele => {
          if (ele === element.prmCode && !element.hidden) {
            children.push(element)
          }
        })
      })
      return children
    },
    hasDashboard (path) {
      let flag = false
      // 监管、查验和典图系统如果有看板权限，页面上不显示欢迎页面
      if ((path === '/Inspection/index' && this.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.code) > -1) || (path === '/Supervise/index' && this.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.code) > -1) || (path === '/ImageLibrary/index' && this.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.dashboard.code) > -1)) {
        flag = true
      }
      return flag
    }
  },
  computed: {},
  watch: {
    $route (to, from) {
      this.defalutAct = to.path
    }
  },
  props: [ ],
  components: {}
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.menu-bar {
  @extend .extend-bar;
  #sideMenu {
    width: $all;
    @include sideMenuBg();
    background-size: $all $all;
    .el-menu-item {
      width: $all;
      color: $black;
    }
    .el-icon-arrow-right:before {
      content: "";
    }
    .el-menu {
      .el-submenu,.el-menu-item {
        padding: $dis10 0;
      }
      .el-submenu__title {
        background-color: transparent !important;
      }
      .iconfont {
        font-size: 28px;
        @include iconfontColor();
      }
      .el-menu-item {
        box-sizing: content-box;
        padding-left: $importantZero;
        &:hover {
          @include asideHover();
        }
      }
      .el-tooltip {
        @include flex();
        display: flex!important
      }
    }
  }
}
.el-menu--popup {
  padding: 0;
  .el-menu-item-group>ul {
    .el-menu-item {
      height: $margin * 2.1;
      line-height: $margin * 2.1;
      padding-left: $dis10!important;
      &:hover {
        @include asideHoverActive();
      }
      .iconfont {
        color: $white;
        margin-right: $dis10 / 2;
      }
    }
    .el-menu-item.is-active {
      @include asideHoverActive();
    }
  }
  .menuItemGroup {
    @include asideHover();
    color: $white;
  }
}
.el-menu-item{
  background-color: transparent!important;
}
</style>
