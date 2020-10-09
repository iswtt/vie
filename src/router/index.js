import Vue from 'vue'
import Router from 'vue-router'
import ajax from '@/api/common/common.js'
import $prmCode from '@/lib/common/code.js'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/common/login'], resolve),
      hidden: true,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/menus',
      name: 'menus',
      component: resolve => require(['@/views/common/menus'], resolve),
      hidden: true,
      prmCode: $prmCode.treeCode.vicenter.code,
      meta: {
        keepAlive: false
      },
      beforeEnter: (to, from, next) => {
        if (from.path === '/login') {
          Vue.prototype.$PrmCodeList = undefined
          ajax.getPrmList({ all: 'true' }).then(res => {
            if (res.data.flag) {
              Vue.prototype.$PrmCodeList = res.data.result
              // console.log(res)
              next()
            }
          }).catch(() => { })
        } else {
          if (Vue.prototype.$PrmCodeList === undefined) {
            // 获取后端权限编码
            ajax.getPrmList({ all: 'true' }).then(res => {
              if (res.data.flag) {
                Vue.prototype.$PrmCodeList = res.data.result
                // console.log(res)
                next()
              }
            }).catch(() => { })
          } else {
            next()
          }
        }
      }
    },
    {
      path: '/language',
      name: 'language',
      component: resolve => require(['@/views/common/language'], resolve),
      hidden: true
    },
    {
      path: '/skin',
      name: 'skin',
      component: resolve => require(['@/views/common/skin'], resolve),
      hidden: true
    },
    {
      KEY: 'Tip',
      path: '/Tip/index',
      redirect: '/Tip/index',
      child: false,
      icon: '&#xe65d;',
      content: 'vicenter.common.homePage',
      name: 'tipIndex',
      component: resolve => require(['@/views/common/index'], resolve),
      prmCode: $prmCode.treeCode.tip.code,
      children: [
        {
          name: 'Welcome',
          path: '/Tip/index',
          component: resolve => require(['@/views/tip/welcome'], resolve),
          prmCode: $prmCode.treeCode.tip.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.tip.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.tip.welcome.dangerousImage'
      }
    },
    // {
    //   KEY: 'Tip', // 来自于那个系统，为了权限考虑
    //   path: '/tipDemo', // 自定义路径非最终路径
    //   redirect: '/Tip/home', // 重定向
    //   child: true, // 是否含有子菜单
    //   icon: '&#xe61a;', // 菜单图标
    //   name: 'tipDemo',
    //   component: resolve => require(['@/views/common/index'], resolve), // 父容器
    //   children: [
    //     {name: 'Demo左右', path: '/Tip/home', component: resolve => require(['@/views/demo/swiper'], resolve)}, // 子容器 名字 路径
    //     {name: 'Demo上下', path: '/Tip/topDown', component: resolve => require(['@/views/demo/up-down-layout-page'], resolve)} // 子容器 名字 路径
    //   ],
    //   meta: {
    //     title: '图像库管理'
    //   }
    // },
    {
      KEY: 'Tip',
      path: '/Tip/Assessment-settings',
      redirect: '/Tip/Assessment-settings',
      child: false,
      icon: '&#xe608;',
      name: 'tipSettings',
      content: 'vicenter.common.menus.tipChild.tipSettings',
      component: resolve => require(['@/views/common/index'], resolve),
      prmCode: $prmCode.treeCode.tip.tipexam.code,
      beforeEnter: (to, from, next) => {
        // console.log(Vue.prototype.$PrmCodeList)
        if (Vue.prototype.$PrmCodeList === undefined) {
          ajax.getPrmList({ all: true }).then(res => {
            if (res.data.flag) {
              Vue.prototype.$PrmCodeList = res.data.result
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }).catch(() => { })
        } else {
          if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.code) > -1) {
            next()
          } else {
            next(false)
          }
        }
      },
      children: [
        {
          name: 'vicenter.common.menus.tipChild.tipSettings',
          path: '/Tip/Assessment-settings',
          component: resolve => require(['@/views/tip/Assessment-settings'], resolve),
          meta: {
            keepAlive: true
          },
          prmCode: $prmCode.treeCode.tip.tipexam.code,
          beforeEnter: (to, from, next) => {
            // console.log(Vue.prototype.$PrmCodeList)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.tipChild.addSettings',
          path: '/Tip/add-settings',
          component: resolve => require(['@/views/tip/add-seting'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.tip.tipexam.add.code,
          beforeEnter: (to, from, next) => {
            // console.log(Vue.prototype.$PrmCodeList)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.add.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.add.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.tipChild.editSettings',
          path: '/Tip/edit-settings',
          component: resolve => require(['@/views/tip/edit-seting'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.tip.tipexam.edit.code,
          beforeEnter: (to, from, next) => {
            // console.log(Vue.prototype.$PrmCodeList)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.edit.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.edit.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.tipChild.detailSettings',
          path: '/Tip/detail-settings',
          component: resolve => require(['@/views/tip/seting-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.tip.tipexam.detail.code,
          beforeEnter: (to, from, next) => {
            // console.log(Vue.prototype.$PrmCodeList)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.detail.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipexam.detail.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.tip.welcome.dangerousImage'
      }
    },
    {
      KEY: 'Tip',
      path: '/Tip/imageManagement',
      redirect: '/Tip/imageManagement',
      child: false,
      icon: '&#xe656;',
      content: 'vicenter.tip.imageManagement.navName',
      name: 'imageManagement',
      prmCode: $prmCode.treeCode.tip.tipImgManage.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.tip.imageManagement.navName',
          path: '/Tip/imageManagement',
          component: resolve => require(['@/views/tip/imageManagement'], resolve),
          meta: {
            keepAlive: true
          },
          prmCode: $prmCode.treeCode.tip.tipImgManage.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImgManage.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImgManage.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.tip.imageManagement.ImageDetails',
          path: '/Tip/imageManagement/imageDetails',
          component: resolve => require(['@/views/tip/imageDetail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.tip.tipImgManage.detail.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImgManage.detail.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImgManage.detail.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.tip.imageManagement.ImageEdit',
          path: '/Tip/imageManagement/ImageEdit',
          component: resolve => require(['@/views/tip/imageEdit'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.tip.tipImgManage.edit.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImgManage.edit.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImgManage.edit.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.tip.imageManagement.ImageCreate',
          path: '/Tip/imageManagement/ImageCreate',
          component: resolve => require(['@/views/tip/imageCreate'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.tip.tipImgManage.add.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImgManage.add.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImgManage.add.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.tip.welcome.dangerousImage'
      }
    },
    {
      KEY: 'Tip',
      path: '/tipStatistics',
      redirect: '/Tip/home',
      child: true,
      icon: '&#xe67f;',
      name: 'tipStatistics',
      component: resolve => require(['@/views/common/index'], resolve),
      prmCode: $prmCode.treeCode.tip.tipStatic.code,
      beforeEnter: (to, from, next) => {
        // console.log(Vue.prototype.$PrmCodeList)
        if (Vue.prototype.$PrmCodeList === undefined) {
          ajax.getPrmList({ all: true }).then(res => {
            if (res.data.flag) {
              Vue.prototype.$PrmCodeList = res.data.result
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }).catch(() => { })
        } else {
          if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.code) > -1) {
            next()
          } else {
            next(false)
          }
        }
      },
      children: [
        {
          name: 'vicenter.common.menus.tipChild.imgStatistics',
          path: '/Tip/Image-statistics',
          component: resolve => require(['@/views/tip/Image-statistics'], resolve),
          prmCode: $prmCode.treeCode.tip.tipStatic.tipImageStatistics.code,
          beforeEnter: (to, from, next) => {
            // console.log(Vue.prototype.$PrmCodeList)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.tipImageStatistics.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.tipImageStatistics.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.tipChild.examinationQuery',
          path: '/Tip/Examination-Query',
          component: resolve => require(['@/views/tip/Examination-Query'], resolve),
          meta: {
            keepAlive: true
          },
          prmCode: $prmCode.treeCode.tip.tipStatic.tipExamScore.code,
          beforeEnter: (to, from, next) => {
            // console.log(Vue.prototype.$PrmCodeList)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.tipExamScore.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.tipExamScore.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.tipChild.assessmentStatistics',
          path: '/Tip/Assessment-statistics',
          component: resolve => require(['@/views/tip/Assessment-statistics'], resolve),
          prmCode: $prmCode.treeCode.tip.tipStatic.tipExamStatistics.code,
          beforeEnter: (to, from, next) => {
            // console.log(Vue.prototype.$PrmCodeList)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.tipExamStatistics.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.tipExamStatistics.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.tipChild.testStatisticsDetail',
          path: '/Tip/test-statistics-detail',
          component: resolve => require(['@/views/tip/test-statistics-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.tip.tipStatic.tipExamScoreDetail.code,
          beforeEnter: (to, from, next) => {
            // console.log(Vue.prototype.$PrmCodeList)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.tipExamScoreDetail.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipStatic.tipExamScoreDetail.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.tip.welcome.dangerousImage'
      }
    },
    // tip  图像分类
    // {
    //   KEY: 'Tip',
    //   path: '/Tip/Image-Classification',
    //   redirect: '/Tip/Image-Classification',
    //   child: false,
    //   icon: '&#xe701;',
    //   content: 'vicenter.common.menus.tipChild.imgClassification',
    //   name: 'Image-Classification',
    //   component: resolve => require(['@/views/common/index'], resolve),
    //   prmCode: $prmCode.treeCode.tip.tipImageCategory.code,
    //   beforeEnter: (to, from, next) => {
    //     // console.log(Vue.prototype.$PrmCodeList)
    //     if (Vue.prototype.$PrmCodeList === undefined) {
    //       ajax.getPrmList({all: true}).then(res => {
    //         if (res.data.flag) {
    //           Vue.prototype.$PrmCodeList = res.data.result
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImageCategory.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }).catch(() => {})
    //     } else {
    //       if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImageCategory.code) > -1) {
    //         next()
    //       } else {
    //         next(false)
    //       }
    //     }
    //   },
    //   children: [
    //     {
    //       name: 'vicenter.common.menus.tipChild.imgClassification',
    //       path: '/Tip/Image-Classification',
    //       component: resolve => require(['@/views/tip/Image-classManagement'], resolve),
    //       prmCode: $prmCode.treeCode.tip.tipImageCategory.code,
    //       beforeEnter: (to, from, next) => {
    //         // console.log(Vue.prototype.$PrmCodeList)
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({all: true}).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImageCategory.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => {})
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.tipImageCategory.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   meta: {
    //     title: 'vicenter.tip.welcome.dangerousImage'
    //   }
    // },
    {
      KEY: 'Tip',
      path: '/Tip/auditlog',
      redirect: '/Tip/auditlog',
      child: false,
      icon: '&#xe613;',
      content: 'vicenter.Background.auditLog.navName',
      name: 'back-log',
      prmCode: $prmCode.treeCode.tip.auditLog.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.Background.auditLog.navName',
          path: '/Tip/auditlog',
          component: resolve => require(['@/views/tip/auditlog'], resolve),
          prmCode: $prmCode.treeCode.tip.auditLog.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.mgmt.mgmtDevice.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.auditLog.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.tip.auditLog.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.tip.welcome.dangerousImage'
      }
    },
    {
      KEY: 'Background',
      path: '/Background/index',
      redirect: '/Background/index',
      child: false,
      icon: '&#xe65d;',
      content: 'vicenter.common.homePage',
      name: 'backWelcome',
      prmCode: $prmCode.treeCode.mgmt.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'Welcome',
          path: '/Background/index',
          component: resolve => require(['@/views/Background/welcome'], resolve),
          prmCode: $prmCode.treeCode.mgmt.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.mgmt.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
      }
    },
    {
      KEY: 'Background',
      path: '/Background/setting',
      redirect: '/Background/setting',
      child: false,
      icon: '&#xe608;',
      content: 'vicenter.Background.setting.operationParameterconfiguration',
      name: 'backSetting',
      prmCode: $prmCode.treeCode.mgmt.mgmtParam.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.Background.setting.operationParameterconfiguration',
          path: '/Background/setting',
          component: resolve => require(['@/views/Background/setting'], resolve),
          prmCode: $prmCode.treeCode.mgmt.mgmtParam.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.mgmtParam.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.mgmtParam.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
      }
    },
    {
      KEY: 'Background',
      path: '/Background/dictionary',
      redirect: '/Background/dictionary',
      child: false,
      icon: '&#xe63c;',
      content: 'vicenter.Background.dictionary.generalDictionarymanagement',
      name: 'back-dictionary',
      prmCode: $prmCode.treeCode.mgmt.mgmtDic.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.Background.dictionary.generalDictionarymanagement',
          path: '/Background/dictionary',
          component: resolve => require(['@/views/Background/dictionary'], resolve),
          prmCode: $prmCode.treeCode.mgmt.mgmtDic.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.mgmt.mgmtDic.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.mgmtDic.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.mgmtDic.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
      }
    },
    {
      KEY: 'Background',
      path: '/Background/device',
      redirect: '/Background/device',
      child: false,
      icon: '&#xe65c;',
      content: 'vicenter.Background.device.deviceManagement',
      name: 'back-device',
      prmCode: $prmCode.treeCode.mgmt.mgmtDevice.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.Background.device.deviceManagement',
          path: '/Background/device',
          component: resolve => require(['@/views/Background/device'], resolve),
          prmCode: $prmCode.treeCode.mgmt.mgmtDevice.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.mgmt.mgmtDevice.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.mgmtDevice.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.mgmtDevice.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
      }
    },
    {
      KEY: 'Background',
      path: '/Background/HSCodeManagement',
      redirect: '/Background/HSCodeManagement',
      child: false,
      icon: '&#xe6f5;',
      content: 'vicenter.ImageLibrary.HSCodeManagement.navName',
      name: 'HSCodeManagement',
      prmCode: $prmCode.treeCode.mgmt.HSCodeManagement.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.ImageLibrary.HSCodeManagement.navName',
          path: '/Background/HSCodeManagement',
          component: resolve => require(['@/views/ImageLibrary/HSCodeManagement'], resolve),
          prmCode: $prmCode.treeCode.mgmt.HSCodeManagement.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.HSCodeManagement.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.HSCodeManagement.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
      }
    },
    {
      KEY: 'Background',
      path: '/Background/auditlog',
      redirect: '/Background/auditlog',
      child: false,
      icon: '&#xe613;',
      content: 'vicenter.Background.auditLog.navName',
      name: 'back-log',
      prmCode: $prmCode.treeCode.mgmt.auditLog.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.Background.auditLog.navName',
          path: '/Background/auditlog',
          component: resolve => require(['@/views/Background/auditlog'], resolve),
          prmCode: $prmCode.treeCode.mgmt.auditLog.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.mgmt.mgmtDevice.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.auditLog.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.auditLog.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
      }
    },
    // {
    //   KEY: 'Background',
    //   path: '/Background/international',
    //   redirect: '/Background/international',
    //   child: false,
    //   icon: '&#xe675;',
    //   content: 'vicenter.Background.international.navName',
    //   name: 'international',
    //   prmCode: $prmCode.treeCode.mgmt.international.code,
    //   component: resolve => require(['@/views/common/index'], resolve),
    //   children: [
    //     {
    //       name: 'vicenter.Background.international.navName',
    //       path: '/Background/international',
    //       component: resolve => require(['@/views/Background/international'], resolve),
    //       prmCode: $prmCode.treeCode.mgmt.international.code,
    //       beforeEnter: (to, from, next) => {
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({all: true}).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.international.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => {})
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.international.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   meta: {
    //     title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
    //   }
    // },
    {
      KEY: 'Background',
      path: '/Background/fileManage',
      redirect: '/Background/fileManage',
      child: true,
      icon: '&#xe695;',
      content: '',
      name: 'fileManage',
      prmCode: $prmCode.treeCode.mgmt.fileManage.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.Background.fileManageRecord.navName',
          path: '/Background/fileManageRecord',
          component: resolve => require(['@/views/Background/fileManageRecord'], resolve),
          prmCode: $prmCode.treeCode.mgmt.fileManage.fileManageRecord.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({all: true}).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.fileManage.fileManageRecord.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => {})
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.fileManage.fileManageRecord.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.Background.fileManageLog.navName',
          path: '/Background/fileManageLog',
          component: resolve => require(['@/views/Background/fileManageLog'], resolve),
          prmCode: $prmCode.treeCode.mgmt.fileManage.fileManageLog.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({all: true}).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.fileManage.fileManageLog.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => {})
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.fileManage.fileManageLog.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.Background.fileManagePlan.navName',
          path: '/Background/fileManagePlan',
          component: resolve => require(['@/views/Background/fileManagePlan'], resolve),
          prmCode: $prmCode.treeCode.mgmt.fileManage.fileManagePlan.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({all: true}).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.fileManage.fileManagePlan.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => {})
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.fileManage.fileManagePlan.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
      }
    },
    {
      KEY: 'Background',
      path: '/Background/app-version',
      redirect: '/Background/app-version',
      child: false,
      icon: '&#xe69b;',
      content: 'vicenter.Background.appVersionMgmt.title',
      name: 'app-version',
      prmCode: $prmCode.treeCode.mgmt.appVersion.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.Background.appVersionMgmt.title',
          path: '/Background/app-version',
          component: resolve => require(['@/views/Background/appVersionManagement'], resolve),
          prmCode: $prmCode.treeCode.mgmt.appVersion.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.appVersion.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.mgmt.appVersion.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.Background.welcome.backgroundManagementsubsystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/index',
      redirect: '/Inspection/index',
      child: false,
      icon: '&#xe65d;',
      content: 'vicenter.common.homePage',
      name: 'inspectionIndex',
      prmCode: $prmCode.treeCode.inspection.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.homePage',
          path: '/Inspection/index',
          component: resolve => require(['@/views/Inspection/welcome'], resolve),
          prmCode: $prmCode.treeCode.inspection.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.code) > -1) {
                    if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.analysisAdminBoard.code) !== -1) {
                      // 审图管理员角色
                      next({path: '/Inspection/analysis-admin'})
                      return
                    }
                    if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.manualAdminBoard.code) !== -1) {
                      // 手检管理员角色
                      next({path: '/Inspection/manual-admin'})
                      return
                    }
                    if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.analysisBoard.code) !== -1) {
                      // 审图员角色
                      next({path: '/Inspection/analysis'})
                      return
                    }
                    if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.recheckBoard.code) !== -1) {
                      // 复核员角色
                      next({path: '/Inspection/rechecks'})
                      return
                    }
                    if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.manualBoard.code) !== -1) {
                      // 手检员角色
                      next({path: '/Inspection/manual'})
                    }
                  } else {
                    next()
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.code) > -1) {
                if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.analysisAdminBoard.code) !== -1) {
                  // 审图管理员角色
                  next({path: '/Inspection/analysis-admin'})
                  return
                }
                if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.manualAdminBoard.code) !== -1) {
                  // 手检管理员角色
                  next({path: '/Inspection/manual-admin'})
                  return
                }
                if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.analysisBoard.code) !== -1) {
                  // 审图员角色
                  next({path: '/Inspection/analysis'})
                  return
                }
                if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.recheckBoard.code) !== -1) {
                  // 复核员角色
                  next({path: '/Inspection/rechecks'})
                  return
                }
                if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.manualBoard.code) !== -1) {
                  // 手检员角色
                  next({path: '/Inspection/manual'})
                }
              } else {
                next()
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/dashboard',
      redirect: '/Inspection/dashboard',
      child: true,
      icon: '&#xe720;',
      content: 'vicenter.common.dashboard.title',
      name: 'dashboard',
      prmCode: $prmCode.treeCode.inspection.dashboard.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.dashboard.analysisAdminBoard',
          path: '/Inspection/analysis-admin',
          component: resolve => require(['@/views/Inspection/inspectorAdminDashboard'], resolve),
          prmCode: $prmCode.treeCode.inspection.dashboard.analysisAdminBoard.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.analysisAdminBoard.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.analysisAdminBoard.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.dashboard.manualAdminBoard',
          path: '/Inspection/manual-admin',
          component: resolve => require(['@/views/Inspection/manualAdminDashboard'], resolve),
          prmCode: $prmCode.treeCode.inspection.dashboard.manualAdminBoard.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.manualAdminBoard.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.manualAdminBoard.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.dashboard.analysisBoard',
          path: '/Inspection/analysis',
          component: resolve => require(['@/views/Inspection/inspectorDashboard'], resolve),
          prmCode: $prmCode.treeCode.inspection.dashboard.analysisBoard.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.analysisBoard.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.analysisBoard.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.dashboard.recheckBoard',
          path: '/Inspection/rechecks',
          component: resolve => require(['@/views/Inspection/recheckDashboard'], resolve),
          prmCode: $prmCode.treeCode.inspection.dashboard.recheckBoard.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.recheckBoard.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.recheckBoard.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.dashboard.manualBoard',
          path: '/Inspection/manual',
          component: resolve => require(['@/views/Inspection/manualDashboard'], resolve),
          prmCode: $prmCode.treeCode.inspection.dashboard.manualBoard.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.manualBoard.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.dashboard.manualBoard.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/Image-Analysis',
      redirect: '/Inspection/Image-Analysis',
      child: false,
      icon: '&#xe611;',
      content: 'vicenter.common.menus.inspectionChild.imageAnalysis',
      name: 'ImageAnalysis',
      prmCode: $prmCode.treeCode.inspection.inspectionImgCheck.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.imageAnalysis',
          path: '/Inspection/Image-Analysis',
          component: resolve => require(['@/views/Inspection/Image-Analysis'], resolve),
          meta: {
            keepAlive: true
          },
          prmCode: $prmCode.treeCode.inspection.inspectionImgCheck.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionImgCheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionImgCheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.inspectionChild.imageAnalysisDetail',
          path: '/Inspection/Image-Analysis-detail',
          component: resolve => require(['@/views/Inspection/Image-Analysis-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.inspection.inspectionImgCheck.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionImgCheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionImgCheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/Recheck',
      redirect: '/Inspection/Recheck',
      child: false,
      icon: '&#xe60a;',
      content: 'vicenter.common.menus.inspectionChild.recheck',
      name: 'Recheck',
      prmCode: $prmCode.treeCode.inspection.inspectionRecheck.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.recheck',
          path: '/Inspection/Recheck',
          component: resolve => require(['@/views/Inspection/Recheck'], resolve),
          meta: {
            keepAlive: true
          },
          prmCode: $prmCode.treeCode.inspection.inspectionRecheck.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionRecheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionRecheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.inspectionChild.recheckDetail',
          path: '/Inspection/Recheck-detail',
          component: resolve => require(['@/views/Inspection/Recheck-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.inspection.inspectionRecheck.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionRecheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionRecheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/Physical-Inspection',
      redirect: '/Inspection/Physical-Inspection',
      child: false,
      icon: '&#xe61b;',
      content: 'vicenter.common.menus.inspectionChild.physicalInspection',
      name: 'Physical-Inspection',
      prmCode: $prmCode.treeCode.inspection.physicalCheck.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.physicalInspection',
          path: '/Inspection/Physical-Inspection',
          component: resolve => require(['@/views/Inspection/Physical'], resolve),
          meta: {
            keepAlive: true
          },
          prmCode: $prmCode.treeCode.inspection.physicalCheck.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.physicalCheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.physicalCheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.inspectionChild.physicalInspectionDetail',
          path: '/Inspection/Physical-Inspection-detail',
          component: resolve => require(['@/views/Inspection/Physical-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.inspection.physicalCheck.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.physicalCheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.physicalCheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/Manage-Image',
      redirect: '/Inspection/Manage-Image',
      child: false,
      icon: '&#xe665;',
      content: 'vicenter.common.menus.inspectionChild.manageImage',
      name: 'ManageImage',
      prmCode: $prmCode.treeCode.inspection.inspectionImgTask.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.manageImage',
          path: '/Inspection/Manage-Image',
          component: resolve => require(['@/views/Inspection/Manage-Image'], resolve),
          meta: {
            keepAlive: true
          },
          prmCode: $prmCode.treeCode.inspection.inspectionImgTask.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.inspection.inspectionImgTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionImgTask.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionImgTask.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.inspectionChild.manageImageDetail',
          path: '/Inspection/Manage-Image-detail',
          component: resolve => require(['@/views/Inspection/Manage-Image-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.inspection.inspectionImgTask.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.inspection.inspectionImgTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionImgTask.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionImgTask.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
        // {name: '手检任务管理', path: '/Inspection/Manage-Physical', component: resolve => require(['@/views/Inspection/Manage-Physical'], resolve)},
        // {name: '手检任务详情', path: '/Inspection/Manage-Physical-detail', component: resolve => require(['@/views/Inspection/Manage-Physical-detail'], resolve), hidden: true}
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/Manage-Physical',
      redirect: '/Inspection/Manage-Physical',
      child: false,
      icon: '&#xe66e;',
      content: 'vicenter.common.menus.inspectionChild.managePhysical',
      name: 'ManagePhysical',
      prmCode: $prmCode.treeCode.inspection.physicalCheckTask.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.managePhysical',
          path: '/Inspection/Manage-Physical',
          component: resolve => require(['@/views/Inspection/Manage-Physical'], resolve),
          meta: {
            keepAlive: true
          },
          prmCode: $prmCode.treeCode.inspection.physicalCheckTask.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.inspection.inspectionImgTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.physicalCheckTask.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.physicalCheckTask.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.inspectionChild.managePhysicalDetail',
          path: '/Inspection/Manage-Physical-detail',
          component: resolve => require(['@/views/Inspection/Manage-Physical-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.inspection.physicalCheckTask.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.inspection.inspectionImgTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.physicalCheckTask.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.physicalCheckTask.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/Manage-Assign',
      redirect: '/Inspection/Manage-Assign',
      child: false,
      icon: '&#xe678;',
      content: 'vicenter.common.menus.inspectionChild.manageAssign',
      name: 'ManageAssign',
      prmCode: $prmCode.treeCode.inspection.assignImageMgmt.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.manageAssign',
          path: '/Inspection/Manage-Assign',
          component: resolve => require(['@/views/Inspection/Manage-Assign'], resolve),
          prmCode: $prmCode.treeCode.inspection.assignImageMgmt.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.assignImageMgmt.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.assignImageMgmt.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/History',
      redirect: '/Inspection/History',
      child: false,
      icon: '&#xe62e;',
      content: 'vicenter.common.menus.inspectionChild.history',
      name: 'History',
      component: resolve => require(['@/views/common/index'], resolve),
      prmCode: $prmCode.treeCode.inspection.inspectionHistory.code,
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.historyList',
          path: '/Inspection/History',
          component: resolve => require(['@/views/Inspection/History'], resolve),
          prmCode: $prmCode.treeCode.inspection.inspectionHistory.code,
          meta: {
            keepAlive: true
          },
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.inspection.inspectionHistory.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionHistory.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionHistory.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.inspectionChild.historyDetail',
          path: '/Inspection/History-detail',
          component: resolve => require(['@/views/Inspection/History-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.inspection.inspectionHistory.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.inspection.inspectionHistory.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionHistory.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.inspectionHistory.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/statistics',
      redirect: '/Inspection/statistics',
      child: true,
      icon: '&#xe67f;',
      content: 'vicenter.common.menus.inspectionChild.imageStatistics',
      name: 'statistics',
      component: resolve => require(['@/views/common/index'], resolve),
      prmCode: $prmCode.treeCode.inspection.statistics.code,
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.imageStatistics',
          path: '/Inspection/statistics',
          component: resolve => require(['@/views/Inspection/Check-statistics'], resolve),
          prmCode: $prmCode.treeCode.inspection.statistics.imageCheck.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.statistics.imageCheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.statistics.imageCheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.menus.inspectionChild.manualStatistics',
          path: '/Inspection/manualStatistics',
          component: resolve => require(['@/views/Inspection/manual-statistics'], resolve),
          prmCode: $prmCode.treeCode.inspection.statistics.manualCheck.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.statistics.manualCheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.statistics.manualCheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Inspection',
      path: '/Inspection/Tampering-record',
      redirect: '/Inspection/Tampering-record',
      child: false,
      icon: '&#xe732;',
      content: 'vicenter.common.menus.inspectionChild.tamperingRecord',
      name: 'tamperingRecord',
      prmCode: $prmCode.treeCode.inspection.tamperingRecord.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.menus.inspectionChild.tamperingRecord',
          path: '/Inspection/Tampering-record',
          component: resolve => require(['@/views/Inspection/Tampering-record'], resolve),
          prmCode: $prmCode.treeCode.inspection.tamperingRecord.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.tamperingRecord.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.inspection.tamperingRecord.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.inspection.welcome.inspectionSystem'
      }
    },
    {
      KEY: 'Supervise',
      path: '/Supervise/index',
      redirect: '/Supervise/index',
      child: false,
      icon: '&#xe65d;',
      content: 'vicenter.common.homePage',
      name: 'superviseIndex',
      prmCode: $prmCode.treeCode.dms.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'Welcome',
          path: '/Supervise/index',
          component: resolve => require(['@/views/supervise/welcome'], resolve),
          prmCode: $prmCode.treeCode.dms.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.code) > -1) {
                    if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.auditAdminBoard.code) !== -1) {
                      // 稽核管理员角色
                      next({path: '/Supervise/auditor-admin'})
                      return
                    }
                    if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.auditBoard.code) !== -1) {
                      // 稽核员角色
                      next({path: '/Supervise/auditor'})
                    }
                  } else {
                    next()
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.code) > -1) {
                if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.auditAdminBoard.code) !== -1) {
                  // 稽核管理员角色
                  next({path: '/Supervise/auditor-admin'})
                  return
                }
                if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.auditBoard.code) !== -1) {
                  // 稽核员角色
                  next({path: '/Supervise/auditor'})
                }
              } else {
                next()
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    {
      KEY: 'Supervise',
      path: '/Supervise/dashboard',
      redirect: '/Supervise/dashboard',
      child: true,
      icon: '&#xe720;',
      content: 'vicenter.common.dashboard.title',
      name: 'dashboard',
      prmCode: $prmCode.treeCode.dms.dashboard.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.dashboard.auditAdminBoard',
          path: '/Supervise/auditor-admin',
          component: resolve => require(['@/views/supervise/auditAdminDashboard'], resolve),
          prmCode: $prmCode.treeCode.dms.dashboard.auditAdminBoard.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.auditAdminBoard.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.auditAdminBoard.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.common.dashboard.auditBoard',
          path: '/Supervise/auditor',
          component: resolve => require(['@/views/supervise/auditDashboard'], resolve),
          prmCode: $prmCode.treeCode.dms.dashboard.auditBoard.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.auditBoard.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboard.auditBoard.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    {
      KEY: 'Supervise',
      path: '/Supervise/supervise-map',
      redirect: '/Supervise/supervise-map',
      child: false,
      icon: '&#xe676;',
      content: 'vicenter.supervise.map.navName',
      name: 'map',
      prmCode: $prmCode.treeCode.dms.mapStatic.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'map',
          path: '/Supervise/supervise-map',
          component: resolve => require(['@/views/Supervise/supervise-map'], resolve),
          prmCode: $prmCode.treeCode.dms.mapStatic.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.mapStatic.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.mapStatic.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.supervise.taskInspectionDetail.taskAuditdetails',
          path: '/Supervise/supervise-map/Task-inspection-detail',
          component: resolve => require(['@/views/Supervise/Task-inspection-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.dms.mapStatic.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.dms.dmsTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.mapStatic.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.mapStatic.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    // {
    //   KEY: 'Supervise',
    //   path: '/Supervise/Kolzhat-custom-show',
    //   redirect: '/Supervise/Kolzhat-custom-show',
    //   child: false,
    //   icon: '&#xe611;',
    //   content: 'vicenter.common.bigScreendisplay',
    //   prmCode: $prmCode.treeCode.dms.dmsHomeStatis.code,
    //   name: 'Kolzhat-show',
    //   component: resolve => require(['@/views/common/index'], resolve),
    //   children: [
    //     {
    //       name: 'vicenter.supervise.kolzhatCustomShow.generalAdministration',
    //       path: '/Supervise/Kolzhat-custom-show',
    //       component: resolve => require(['@/views/Supervise/Kolzhat-custom-show'], resolve),
    //       prmCode: $prmCode.treeCode.dms.dmsHomeStatis.code,
    //       beforeEnter: (to, from, next) => {
    //         // $prmCode.judgeUrpm($prmCode.treeCode.dms.dmsHomeStatis.code, next)
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({all: true}).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsHomeStatis.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => {})
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsHomeStatis.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     },
    //     {
    //       name: 'vicenter.supervise.checkStatistics.port',
    //       path: '/Supervise/Kolzhat-port-show',
    //       component: resolve => require(['@/views/Supervise/Kolzhat-port-show'], resolve),
    //       hidden: true,
    //       prmCode: $prmCode.treeCode.dms.dmsHomeStatis.code,
    //       beforeEnter: (to, from, next) => {
    //         // $prmCode.judgeUrpm($prmCode.treeCode.dms.dmsTask.code, next)
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({all: true}).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsHomeStatis.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => {})
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsHomeStatis.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   meta: {
    //     title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
    //   }
    // },
    {
      KEY: 'Supervise',
      path: '/Supervise/Task-inspection',
      redirect: '/Supervise/Task-inspection',
      child: false,
      icon: '&#xe609;',
      content: 'vicenter.common.taskInspection',
      name: 'TaskInspection',
      prmCode: $prmCode.treeCode.dms.dmsTask.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.supervise.taskInspection.taskAuditlist',
          path: '/Supervise/Task-inspection',
          component: resolve => require(['@/views/Supervise/Task-inspection'], resolve),
          prmCode: $prmCode.treeCode.dms.dmsTask.code,
          meta: {
            keepAlive: true
          },
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.dms.dmsTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsTask.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsTask.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.supervise.taskInspectionDetail.taskAuditdetails',
          path: '/Supervise/Task-inspection-detail',
          component: resolve => require(['@/views/Supervise/Task-inspection-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.dms.dmsTask.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.dms.dmsTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsTask.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsTask.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.supervise.taskInspectionDetail.taskAudit',
          path: '/Supervise/Task-inspection-review',
          component: resolve => require(['@/views/Supervise/Task-inspection-detail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.dms.dmsTask.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.dms.dmsTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsTask.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsTask.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    {
      KEY: 'Supervise',
      path: '/Supervise/Device-status',
      redirect: '/Supervise/Device-status',
      child: false,
      icon: '&#xe683;',
      content: 'vicenter.supervise.deviceStatus.scannerStatus',
      name: 'deviceStatus',
      prmCode: $prmCode.treeCode.dms.deviceStatus.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.supervise.deviceStatus.scannerStatus',
          path: '/Supervise/device-status',
          component: resolve => require(['@/views/Supervise/Device-status'], resolve),
          prmCode: $prmCode.treeCode.dms.deviceStatus.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.deviceStatus.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.deviceStatus.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    {
      KEY: 'Supervise',
      path: '/Supervise/statistics',
      redirect: '/Supervise/statistics',
      child: true,
      icon: '&#xe67f;',
      content: 'vicenter.supervise.statistics.SeizureStatistics',
      prmCode: $prmCode.treeCode.dms.dmsStatis.code,
      name: 'SuperviseStatistics',
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.supervise.statistics.SeizureStatistics',
          path: '/Supervise/Task-statistics',
          component: resolve => require(['@/views/Supervise/Task-statistics'], resolve),
          prmCode: $prmCode.treeCode.dms.dmsStatis.insCheck.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.dms.dmsTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsStatis.insCheck.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsStatis.insCheck.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.supervise.suspicionStatistics.recheckStatistics',
          path: '/Supervise/Suspicion-statistics',
          component: resolve => require(['@/views/Supervise/Suspicion-statistics'], resolve),
          prmCode: $prmCode.treeCode.dms.dmsStatis.audit.code,
          beforeEnter: (to, from, next) => {
            // $prmCode.judgeUrpm($prmCode.treeCode.dms.dmsTask.code, next)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsStatis.audit.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dmsStatis.audit.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    {
      KEY: 'Supervise',
      path: '/Supervise/template-mgmt',
      redirect: '/Supervise/template-mgmt',
      child: false,
      icon: '&#xe791;',
      content: 'vicenter.dashboard.common.templateMgmtNav',
      name: 'templateMgmt',
      prmCode: $prmCode.treeCode.dms.templateMgmt.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.dashboard.common.templateMgmtNav',
          path: '/Supervise/template-mgmt',
          component: resolve => require(['@/views/Supervise/templateMgmt'], resolve),
          prmCode: $prmCode.treeCode.dms.templateMgmt.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.templateMgmt.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.templateMgmt.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    {
      KEY: 'Supervise',
      path: '/Supervise/component-mgmt',
      redirect: '/Supervise/component-mgmt',
      child: false,
      icon: '&#xe61c;',
      content: 'vicenter.dashboard.common.componentMgmtNav',
      name: 'componentMgmt',
      prmCode: $prmCode.treeCode.dms.componentMgmt.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.dashboard.common.componentMgmtNav',
          path: '/Supervise/component-mgmt',
          component: resolve => require(['@/views/Supervise/componentMgmt'], resolve),
          prmCode: $prmCode.treeCode.dms.componentMgmt.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.componentMgmt.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.componentMgmt.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    {
      KEY: 'Supervise',
      path: '/Supervise/dashboard-map',
      redirect: '/Supervise/dashboard-map',
      child: false,
      icon: '&#xe81e;',
      content: 'vicenter.common.dashboard.title',
      name: 'dashboardMap',
      prmCode: $prmCode.treeCode.dms.dashboardMap.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.dashboard.title',
          path: '/Supervise/dashboard-map',
          component: resolve => require(['@/views/Supervise/dashboard'], resolve),
          prmCode: $prmCode.treeCode.dms.dashboardMap.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboardMap.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.dms.dashboardMap.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.supervise.welcome.centralizedSupervisionsubsystem'
      }
    },
    {
      KEY: 'ImageLibrary',
      path: '/ImageLibrary/index',
      redirect: '/ImageLibrary/index',
      child: false,
      icon: '&#xe65d;',
      content: 'vicenter.common.homePage',
      name: 'Welcome',
      prmCode: $prmCode.treeCode.imageLibrary.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.homePage',
          path: '/ImageLibrary/index',
          component: resolve => require(['@/views/ImageLibrary/welcome'], resolve),
          prmCode: $prmCode.treeCode.imageLibrary.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.dashboard.code) > -1) {
                    next({path: '/ImageLibrary/dashboard'})
                  } else {
                    next()
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.dashboard.code) > -1) {
                next({path: '/ImageLibrary/dashboard'})
              } else {
                next()
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.ImageLibrary.welcome.typicalImageLibrary'
      }
    },
    {
      KEY: 'ImageLibrary',
      path: '/ImageLibrary/dashboard',
      redirect: '/ImageLibrary/dashboard',
      child: false,
      icon: '&#xe720;',
      content: 'vicenter.common.dashboard.title',
      name: 'imageLibraryDashboard',
      prmCode: $prmCode.treeCode.imageLibrary.dashboard.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.common.dashboard.title',
          path: '/ImageLibrary/dashboard',
          component: resolve => require(['@/views/ImageLibrary/dashboard'], resolve),
          prmCode: $prmCode.treeCode.imageLibrary.dashboard.code,
          meta: {
            keepAlive: true
          },
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.dashboard.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.dashboard.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.ImageLibrary.welcome.typicalImageLibrary'
      }
    },
    {
      KEY: 'ImageLibrary',
      path: '/ImageLibrary/imageManagement',
      redirect: '/ImageLibrary/imageManagement',
      child: false,
      icon: '&#xe656;',
      content: 'vicenter.ImageLibrary.imageManagement.navName',
      name: 'imageManagement',
      prmCode: $prmCode.treeCode.imageLibrary.imageManagement.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.ImageLibrary.imageManagement.navName',
          path: '/ImageLibrary/imageManagement',
          component: resolve => require(['@/views/ImageLibrary/imageManagement'], resolve),
          prmCode: $prmCode.treeCode.imageLibrary.imageManagement.code,
          meta: {
            keepAlive: true
          },
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.ImageLibrary.common.ImageDetails',
          path: '/ImageLibrary/imageManagement/imageDetails',
          component: resolve => require(['@/views/ImageLibrary/imageDetail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.imageLibrary.imageManagement.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.ImageLibrary.common.imagePreview',
          path: '/ImageLibrary/imageManagement/imagePreview',
          component: resolve => require(['@/views/ImageLibrary/imageCreate'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.imageLibrary.imageManagement.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.ImageLibrary.common.ImageEdit',
          path: '/ImageLibrary/imageManagement/ImageEdit',
          component: resolve => require(['@/views/ImageLibrary/imageCreate'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.imageLibrary.imageManagement.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.ImageLibrary.common.ImageCreate',
          path: '/ImageLibrary/imageManagement/ImageCreate',
          component: resolve => require(['@/views/ImageLibrary/imageCreate'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.imageLibrary.imageManagement.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageManagement.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.ImageLibrary.welcome.typicalImageLibrary'
      }
    },
    {
      KEY: 'ImageLibrary',
      path: '/ImageLibrary/imageQuery',
      redirect: '/ImageLibrary/imageQuery',
      child: false,
      icon: '&#xe657;',
      content: 'vicenter.ImageLibrary.imageQuery.navName',
      name: 'imageQuery',
      prmCode: $prmCode.treeCode.imageLibrary.imageQuery.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.ImageLibrary.imageQuery.navName',
          path: '/ImageLibrary/imageQuery',
          component: resolve => require(['@/views/ImageLibrary/imageQuery'], resolve),
          prmCode: $prmCode.treeCode.imageLibrary.imageQuery.code,
          meta: {
            keepAlive: true
          },
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageQuery.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageQuery.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.ImageLibrary.common.ImageDetails',
          path: '/ImageLibrary/imageQuery/imageDetails',
          component: resolve => require(['@/views/ImageLibrary/imageDetail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.imageLibrary.imageQuery.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageQuery.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.imageQuery.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.ImageLibrary.welcome.typicalImageLibrary'
      }
    },
    // {
    //   KEY: 'ImageLibrary',
    //   path: '/ImageLibrary/HSCodeManagement',
    //   redirect: '/ImageLibrary/HSCodeManagement',
    //   child: false,
    //   icon: '&#xe6f5;',
    //   content: 'vicenter.ImageLibrary.HSCodeManagement.navName',
    //   name: 'HSCodeManagement',
    //   prmCode: $prmCode.treeCode.imageLibrary.HSCodeManagement.code,
    //   component: resolve => require(['@/views/common/index'], resolve),
    //   children: [
    //     {
    //       name: 'vicenter.ImageLibrary.HSCodeManagement.navName',
    //       path: '/ImageLibrary/HSCodeManagement',
    //       component: resolve => require(['@/views/ImageLibrary/HSCodeManagement'], resolve),
    //       prmCode: $prmCode.treeCode.imageLibrary.HSCodeManagement.code,
    //       beforeEnter: (to, from, next) => {
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({all: true}).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.HSCodeManagement.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => {})
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.HSCodeManagement.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   meta: {
    //     title: 'vicenter.ImageLibrary.welcome.typicalImageLibrary'
    //   }
    // },
    {
      KEY: 'ImageLibrary',
      path: '/ImageLibrary/goodsStatistics',
      redirect: '/ImageLibrary/goodsStatistics',
      child: true,
      icon: '&#xe673;',
      content: 'vicenter.ImageLibrary.goodsStatistics.navName',
      name: 'statistics',
      prmCode: $prmCode.treeCode.imageLibrary.statistics.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.ImageLibrary.goodsStatistics.navName',
          path: '/ImageLibrary/goodsStatistics',
          component: resolve => require(['@/views/ImageLibrary/goodsStatistics'], resolve),
          prmCode: $prmCode.treeCode.imageLibrary.statistics.goodsStatistics.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.statistics.goodsStatistics.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.statistics.goodsStatistics.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.ImageLibrary.imageStatistics.navName',
          path: '/ImageLibrary/imageStatistics',
          component: resolve => require(['@/views/ImageLibrary/imageStatistics'], resolve),
          prmCode: $prmCode.treeCode.imageLibrary.statistics.imageStatistics.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.statistics.imageStatistics.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.imageLibrary.statistics.imageStatistics.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.ImageLibrary.welcome.typicalImageLibrary'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/index',
      redirect: '/Reports/index',
      child: false,
      icon: '&#xe65d;',
      content: 'vicenter.common.homePage',
      name: 'Welcome',
      prmCode: $prmCode.treeCode.reports.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'Welcome',
          path: '/Reports/index',
          component: resolve => require(['@/views/Reports/welcome'], resolve),
          prmCode: $prmCode.treeCode.reports.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/history',
      redirect: '/Reports/history',
      child: false,
      icon: '&#xe661;',
      content: 'vicenter.reports.menusName.taskReport',
      name: 'taskReport',
      component: resolve => require(['@/views/common/index'], resolve),
      prmCode: $prmCode.treeCode.reports.taskReport.code,
      children: [
        {
          name: 'vicenter.reports.menusName.taskReport',
          path: '/Reports/history',
          component: resolve => require(['@/views/Reports/history'], resolve),
          prmCode: $prmCode.treeCode.reports.taskReport.code,
          meta: {
            keepAlive: true
          },
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.common.taskReportDetails',
          path: '/Reports/history-detail',
          component: resolve => require(['@/views/Reports/historyDetail'], resolve),
          hidden: true,
          prmCode: $prmCode.treeCode.reports.taskReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/task-volume',
      redirect: '/Reports/task-volume',
      child: false,
      icon: '&#xe6b0;',
      content: 'vicenter.reports.menusName.taskVolumeReport',
      name: 'taskVolumeReport',
      prmCode: $prmCode.treeCode.reports.taskVolumeReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.taskVolumeReport',
          path: '/Reports/task-volume',
          component: resolve => require(['@/views/Reports/taskVolumeReport'], resolve),
          prmCode: $prmCode.treeCode.reports.taskVolumeReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskVolumeReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskVolumeReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    // {
    //   KEY: 'Reports',
    //   path: '/Reports/inspection-conclusion',
    //   redirect: '/Reports/inspection-conclusion',
    //   child: true,
    //   icon: '&#xe6ac;',
    //   content: 'vicenter.reports.menusName.inspectionConclusionReport',
    //   name: 'taskConclusionReport',
    //   prmCode: $prmCode.treeCode.reports.taskConclusionReport.code,
    //   component: resolve => require(['@/views/common/index'], resolve),
    //   children: [
    //     {
    //       name: 'vicenter.reports.menusName.inspectionConclusionReport',
    //       path: '/Reports/inspection-conclusion',
    //       component: resolve => require(['@/views/Reports/insConclusionReport'], resolve),
    //       prmCode: $prmCode.treeCode.reports.taskConclusionReport.insConclusionReport.code,
    //       beforeEnter: (to, from, next) => {
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({ all: true }).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskConclusionReport.insConclusionReport.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => { })
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskConclusionReport.insConclusionReport.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     },
    //     {
    //       name: 'vicenter.reports.menusName.auditConclusionReport',
    //       path: '/Reports/audit-conclusion',
    //       component: resolve => require(['@/views/Reports/auditConclusionReport'], resolve),
    //       prmCode: $prmCode.treeCode.reports.taskConclusionReport.auditConclusionReport.code,
    //       beforeEnter: (to, from, next) => {
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({ all: true }).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskConclusionReport.auditConclusionReport.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => { })
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.taskConclusionReport.auditConclusionReport.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   meta: {
    //     title: 'vicenter.reports.common.systemName'
    //   }
    // },
    {
      KEY: 'Reports',
      path: '/Reports/imageCheck-task',
      redirect: '/Reports/imageCheck-task',
      child: true,
      icon: '&#xe6e4;',
      content: 'vicenter.reports.menusName.taskReport',
      name: 'tasksReport',
      prmCode: $prmCode.treeCode.reports.tasksReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.imageCheckTaskReport',
          path: '/Reports/imageCheck-task',
          component: resolve => require(['@/views/Reports/taskReports/imageCheckReport'], resolve),
          prmCode: $prmCode.treeCode.reports.tasksReport.imageCheckReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.imageCheckReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.imageCheckReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.recheckTaskReport',
          path: '/Reports/recheck-task',
          component: resolve => require(['@/views/Reports/taskReports/recheckReport'], resolve),
          prmCode: $prmCode.treeCode.reports.tasksReport.recheckReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.recheckReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.recheckReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.manualTaskReport',
          path: '/Reports/manual-task',
          component: resolve => require(['@/views/Reports/taskReports/manualReport'], resolve),
          prmCode: $prmCode.treeCode.reports.tasksReport.manualCheckReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.manualCheckReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.manualCheckReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.auditTaskReport',
          path: '/Reports/audit-task',
          component: resolve => require(['@/views/Reports/auditConclusionReport'], resolve),
          prmCode: $prmCode.treeCode.reports.tasksReport.auditReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.auditReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.auditReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.inspectionConclusionReport',
          path: '/Reports/ins-conclusion',
          component: resolve => require(['@/views/Reports/insConclusionReport'], resolve),
          prmCode: $prmCode.treeCode.reports.tasksReport.insConclusionReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.insConclusionReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.tasksReport.insConclusionReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    // {
    //   KEY: 'Reports',
    //   path: '/Reports/personnel-task',
    //   redirect: '/Reports/personnel-task',
    //   child: true,
    //   icon: '&#xe76d;',
    //   content: 'vicenter.reports.menusName.personnelTaskReport',
    //   name: 'personnelReport',
    //   prmCode: $prmCode.treeCode.reports.personnelReport.code,
    //   component: resolve => require(['@/views/common/index'], resolve),
    //   children: [
    //     {
    //       name: 'vicenter.reports.menusName.personnelTaskReport',
    //       path: '/Reports/personnel-task',
    //       component: resolve => require(['@/views/Reports/personnelTaskReport'], resolve),
    //       prmCode: $prmCode.treeCode.reports.personnelReport.personnelTaskReport.code,
    //       beforeEnter: (to, from, next) => {
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({ all: true }).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelReport.personnelTaskReport.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => { })
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelReport.personnelTaskReport.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     },
    //     {
    //       name: 'vicenter.reports.menusName.personnelEfficiencyReport',
    //       path: '/Reports/personnel-Efficiency',
    //       component: resolve => require(['@/views/Reports/personnelEfficiencyReport'], resolve),
    //       prmCode: $prmCode.treeCode.reports.personnelReport.personnelEfficiencyReport.code,
    //       beforeEnter: (to, from, next) => {
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({ all: true }).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelReport.personnelEfficiencyReport.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => { })
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelReport.personnelEfficiencyReport.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     },
    //     {
    //       name: 'vicenter.reports.menusName.personnelTrendReport',
    //       path: '/Reports/personnel-trend',
    //       component: resolve => require(['@/views/Reports/personnelTrendReport'], resolve),
    //       prmCode: $prmCode.treeCode.reports.personnelReport.personnelTrendReport.code,
    //       beforeEnter: (to, from, next) => {
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({ all: true }).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelReport.personnelTrendReport.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => { })
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelReport.personnelTrendReport.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     },
    //     {
    //       name: 'vicenter.reports.menusName.personnelComparedReport',
    //       path: '/Reports/personnel-compared',
    //       component: resolve => require(['@/views/Reports/personnelComparedReport'], resolve),
    //       prmCode: $prmCode.treeCode.reports.personnelReport.personnelComparedReport.code,
    //       beforeEnter: (to, from, next) => {
    //         if (Vue.prototype.$PrmCodeList === undefined) {
    //           ajax.getPrmList({ all: true }).then(res => {
    //             if (res.data.flag) {
    //               Vue.prototype.$PrmCodeList = res.data.result
    //               if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelReport.personnelComparedReport.code) > -1) {
    //                 next()
    //               } else {
    //                 next(false)
    //               }
    //             }
    //           }).catch(() => { })
    //         } else {
    //           if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelReport.personnelComparedReport.code) > -1) {
    //             next()
    //           } else {
    //             next(false)
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   meta: {
    //     title: 'vicenter.reports.common.systemName'
    //   }
    // },
    {
      KEY: 'Reports',
      path: '/Reports/personnel-analysis-task',
      redirect: '/Reports/personnel-analysis-task',
      child: true,
      icon: '&#xe6e5;',
      content: 'vicenter.reports.menusName.personnelTaskReport',
      name: 'personnelTaskReport',
      prmCode: $prmCode.treeCode.reports.personnelTaskReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.imgAnalystTaskReport',
          path: '/Reports/personnel-analysis-task',
          component: resolve => require(['@/views/Reports/personnelTaskReports/imgAnalystReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelTaskReport.imgAnalystReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTaskReport.imgAnalystReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTaskReport.imgAnalystReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.recheckorTaskReport',
          path: '/Reports/personnel-recheck-task',
          component: resolve => require(['@/views/Reports/personnelTaskReports/recheckorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelTaskReport.recheckorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTaskReport.recheckorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTaskReport.recheckorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.physicalInspectorTaskReport',
          path: '/Reports/personnel-manual-task',
          component: resolve => require(['@/views/Reports/personnelTaskReports/physicalInspectorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelTaskReport.physicalInspectorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTaskReport.physicalInspectorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTaskReport.physicalInspectorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.auditorTaskReport',
          path: '/Reports/personnel-audit-task',
          component: resolve => require(['@/views/Reports/personnelTaskReports/auditorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelTaskReport.auditorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTaskReport.auditorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTaskReport.auditorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/personnel-analysis-efficiency',
      redirect: '/Reports/personnel-analysis-efficiency',
      child: true,
      icon: '&#xe6e2;',
      content: 'vicenter.reports.menusName.personnelEfficiencyReport',
      name: 'personnelEfficiencyReport',
      prmCode: $prmCode.treeCode.reports.personnelEfficiencyReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.imgAnalystEfficiencyReport',
          path: '/Reports/personnel-analysis-efficiency',
          component: resolve => require(['@/views/Reports/personnelEfficiencyReports/imgAnalystReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelEfficiencyReport.imgAnalystReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelEfficiencyReport.imgAnalystReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelEfficiencyReport.imgAnalystReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.recheckorEfficiencyReport',
          path: '/Reports/personnel-recheck-efficiency',
          component: resolve => require(['@/views/Reports/personnelEfficiencyReports/recheckorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelEfficiencyReport.recheckorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelEfficiencyReport.recheckorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelEfficiencyReport.recheckorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.auditorEfficiencyReport',
          path: '/Reports/personnel-audit-efficiency',
          component: resolve => require(['@/views/Reports/personnelEfficiencyReports/auditorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelEfficiencyReport.auditorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelEfficiencyReport.auditorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelEfficiencyReport.auditorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/personnel-analysis-trend',
      redirect: '/Reports/personnel-analysis-trend',
      child: true,
      icon: '&#xe6e3;',
      content: 'vicenter.reports.menusName.personnelTrendReport',
      name: 'personnelTrendReport',
      prmCode: $prmCode.treeCode.reports.personnelTrendReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.imgAnalystTrendReport',
          path: '/Reports/personnel-analysis-trend',
          component: resolve => require(['@/views/Reports/personnelTrendReports/imgAnalystReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelTrendReport.imgAnalystReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTrendReport.imgAnalystReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTrendReport.imgAnalystReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.recheckorTrendReport',
          path: '/Reports/personnel-recheck-trend',
          component: resolve => require(['@/views/Reports/personnelTrendReports/recheckorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelTrendReport.recheckorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTrendReport.recheckorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTrendReport.recheckorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.physicalInspectorTrendReport',
          path: '/Reports/personnel-manual-trend',
          component: resolve => require(['@/views/Reports/personnelTrendReports/physicalInspectorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelTrendReport.physicalInspectorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTrendReport.physicalInspectorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTrendReport.physicalInspectorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.auditorTrendReport',
          path: '/Reports/personnel-audit-trend',
          component: resolve => require(['@/views/Reports/personnelTrendReports/auditorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelTrendReport.auditorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTrendReport.auditorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelTrendReport.auditorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/personnel-analysis-compared',
      redirect: '/Reports/personnel-analysis-compared',
      child: true,
      icon: '&#xe6e7;',
      content: 'vicenter.reports.menusName.personnelComparedReport',
      name: 'personnelComparedReport',
      prmCode: $prmCode.treeCode.reports.personnelComparedReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.imgAnalystComparedReport',
          path: '/Reports/personnel-analysis-compared',
          component: resolve => require(['@/views/Reports/personnelComparedReports/imgAnalystReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelComparedReport.imgAnalystReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelComparedReport.imgAnalystReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelComparedReport.imgAnalystReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.recheckorComparedReport',
          path: '/Reports/personnel-recheck-compared',
          component: resolve => require(['@/views/Reports/personnelComparedReports/recheckorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelComparedReport.recheckorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelComparedReport.recheckorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelComparedReport.recheckorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.physicalInspectorComparedReport',
          path: '/Reports/personnel-manual-compared',
          component: resolve => require(['@/views/Reports/personnelComparedReports/physicalInspectorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelComparedReport.physicalInspectorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelComparedReport.physicalInspectorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelComparedReport.physicalInspectorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.auditorComparedReport',
          path: '/Reports/personnel-audit-compared',
          component: resolve => require(['@/views/Reports/personnelComparedReports/auditorReport'], resolve),
          prmCode: $prmCode.treeCode.reports.personnelComparedReport.auditorReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelComparedReport.auditorReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.personnelComparedReport.auditorReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/analysis-accuracy',
      redirect: '/Reports/analysis-accuracy',
      child: true,
      icon: '&#xe6ac;',
      content: 'vicenter.reports.menusName.imageCheckAccuracyReport',
      name: 'accuracyReport',
      prmCode: $prmCode.treeCode.reports.accuracyReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.imageCheckAccuracyReport',
          path: '/Reports/analysis-accuracy',
          component: resolve => require(['@/views/Reports/accuracyReport/imageCheckReport'], resolve),
          prmCode: $prmCode.treeCode.reports.accuracyReport.imageCheckAccuracyReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.accuracyReport.imageCheckAccuracyReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.accuracyReport.imageCheckAccuracyReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.recheckAccuracyReport',
          path: '/Reports/recheck-accuracy',
          component: resolve => require(['@/views/Reports/accuracyReport/recheckReport'], resolve),
          prmCode: $prmCode.treeCode.reports.accuracyReport.recheckAccuracyReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.accuracyReport.recheckAccuracyReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.accuracyReport.recheckAccuracyReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/imageCheck-task-trend',
      redirect: '/Reports/imageCheck-task-trend',
      child: true,
      icon: '&#xe6b6;',
      content: 'vicenter.reports.menusName.imageCheckTrendReport',
      name: 'trendReport',
      prmCode: $prmCode.treeCode.reports.trendReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.imageCheckTrendReport',
          path: '/Reports/imageCheck-task-trend',
          component: resolve => require(['@/views/Reports/imageCheckTaskTrendReport'], resolve),
          prmCode: $prmCode.treeCode.reports.trendReport.imageCheckTaskTrendReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.trendReport.imageCheckTaskTrendReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.trendReport.imageCheckTaskTrendReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.recheckTrendReport',
          path: '/Reports/recheck-task-trend',
          component: resolve => require(['@/views/Reports/recheckTaskTrendReport'], resolve),
          prmCode: $prmCode.treeCode.reports.trendReport.recheckTaskTrendReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.trendReport.recheckTaskTrendReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.trendReport.recheckTaskTrendReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.manualTrendReport',
          path: '/Reports/manual-task-trend',
          component: resolve => require(['@/views/Reports/manualTaskTrendReport'], resolve),
          prmCode: $prmCode.treeCode.reports.trendReport.manualTaskTrendReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.trendReport.manualTaskTrendReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.trendReport.manualTaskTrendReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.auditTrendReport',
          path: '/Reports/audit-task-trend',
          component: resolve => require(['@/views/Reports/auditTaskTrendReport'], resolve),
          prmCode: $prmCode.treeCode.reports.trendReport.auditTaskTrendReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.trendReport.auditTaskTrendReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.trendReport.auditTaskTrendReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/imageCheck-task-compared',
      redirect: '/Reports/imageCheck-task-compared',
      child: true,
      icon: '&#xe6b8;',
      content: 'vicenter.reports.menusName.imageCheckComparedReport',
      name: 'trendReport',
      prmCode: $prmCode.treeCode.reports.comparedReport.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.imageCheckComparedReport',
          path: '/Reports/imageCheck-task-compared',
          component: resolve => require(['@/views/Reports/imageCheckTaskCompareReport'], resolve),
          prmCode: $prmCode.treeCode.reports.comparedReport.imageCheckTaskComparedReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.comparedReport.imageCheckTaskComparedReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.comparedReport.imageCheckTaskComparedReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.recheckComparedReport',
          path: '/Reports/recheck-task-compared',
          component: resolve => require(['@/views/Reports/recheckTaskCompareReport'], resolve),
          prmCode: $prmCode.treeCode.reports.comparedReport.recheckTaskComparedReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.comparedReport.recheckTaskComparedReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.comparedReport.recheckTaskComparedReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.manualComparedReport',
          path: '/Reports/manual-task-compared',
          component: resolve => require(['@/views/Reports/manualTaskCompareReport'], resolve),
          prmCode: $prmCode.treeCode.reports.comparedReport.manualTaskComparedReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.comparedReport.manualTaskComparedReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.comparedReport.manualTaskComparedReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.reports.menusName.auditComparedReport',
          path: '/Reports/audit-task-compared',
          component: resolve => require(['@/views/Reports/auditTaskCompareReport'], resolve),
          prmCode: $prmCode.treeCode.reports.comparedReport.auditTaskComparedReport.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.comparedReport.auditTaskComparedReport.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.comparedReport.auditTaskComparedReport.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'Reports',
      path: '/Reports/report-delivery',
      redirect: '/Reports/report-delivery',
      child: false,
      icon: '&#xe675;',
      content: 'vicenter.reports.menusName.reportDeliveryMgmt',
      name: 'reportDeliveryMgmt',
      prmCode: $prmCode.treeCode.reports.reportDeliveryMgmt.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.reports.menusName.reportDeliveryMgmt',
          path: '/Reports/report-delivery',
          component: resolve => require(['@/views/Reports/reportDeliveryMgmt'], resolve),
          prmCode: $prmCode.treeCode.reports.reportDeliveryMgmt.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.reportDeliveryMgmt.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.reports.reportDeliveryMgmt.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.reports.common.systemName'
      }
    },
    {
      KEY: 'IntegratedTraining',
      path: '/IntegratedTraining/index',
      redirect: '/IntegratedTraining/index',
      child: false,
      icon: '&#xe65d;',
      content: 'vicenter.common.homePage',
      name: 'trainingIndex',
      prmCode: $prmCode.treeCode.training.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'trainingIndex',
          path: '/IntegratedTraining/index',
          component: resolve => require(['@/views/IntegratedTraining/knowledge'], resolve),
          prmCode: $prmCode.treeCode.training.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.IntegratedTraining.welcome.IntegratedTraining'
      }
    },
    {
      KEY: 'IntegratedTraining',
      path: '/IntegratedTraining/community',
      redirect: '/IntegratedTraining/community',
      child: false,
      icon: '&#xe609;',
      content: 'vicenter.IntegratedTraining.community.knowledgeCommunity',
      name: 'trainingCommunity',
      prmCode: $prmCode.treeCode.training.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'trainingCommunity',
          path: '/IntegratedTraining/community',
          component: resolve => require(['@/views/IntegratedTraining/community'], resolve),
          prmCode: $prmCode.treeCode.training.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.IntegratedTraining.community.knowledgeCommunity'
      }
    },
    // 以下是考培管理员的路由
    {
      KEY: 'Training',
      path: '/Training/index',
      redirect: '/Training/index',
      child: false,
      icon: '&#xe65d;',
      // content: 'vicenter.training.manager.homePage',
      content: 'vicenter.common.homePage',
      name: 'trainingIndex',
      prmCode: $prmCode.treeCode.training.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'trainingIndex',
          path: '/Training/index',
          component: resolve => require(['@/views/training/manager/welcome'], resolve),
          prmCode: $prmCode.treeCode.training.code,
          beforeEnter: (to, from, next) => {
            /*
            * 2020-02-25
            * 需求变动 首页不做权限控制
            * 去除权限判断，保留获取权限数据
            * */
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  // if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.code) > -1) {
                  //   next()
                  // } else {
                  //   next(false)
                  // }
                  next()
                }
              }).catch(() => { })
            } else {
              // if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.code) > -1) {
              //   next()
              // } else {
              //   next(false)
              // }
              next()
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/manager/questionBank',
      redirect: '/Training/manager/questionBank',
      child: true,
      icon: '&#xe6be;',
      content: 'vicenter.training.manager.questionBank',
      name: 'questionBank',
      prmCode: $prmCode.treeCode.training.manager.questionBank.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.manager.standardImage',
          path: '/Training/manager/standardImageList',
          component: resolve => require(['@/views/training/manager/standardImageList'], resolve),
          prmCode: $prmCode.treeCode.training.manager.questionBank.standardImage.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.imageSourceList.1',
          path: '/Training/manager/standardImageCode',
          hidden: true,
          component: resolve => require(['@/views/training/manager/standardImageMsg'], resolve),
          prmCode: $prmCode.treeCode.training.manager.questionBank.standardImage.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.imageSourceList.2',
          path: '/Training/manager/standardRegulatory',
          hidden: true,
          component: resolve => require(['@/views/training/manager/standardImageMsg'], resolve),
          prmCode: $prmCode.treeCode.training.manager.questionBank.standardImage.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.manager.suspectImage',
          path: '/Training/manager/suspectImage',
          component: resolve => require(['@/views/training/manager/suspectImageList'], resolve),
          prmCode: $prmCode.treeCode.training.manager.questionBank.suspectImage.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.suspectImage.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.suspectImage.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.imageSourceList.1',
          path: '/Training/manager/suspectCode',
          hidden: true,
          component: resolve => require(['@/views/training/manager/suspectImageMsg'], resolve),
          prmCode: $prmCode.treeCode.training.manager.questionBank.standardImage.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.imageSourceList.2',
          path: '/Training/manager/suspectRegulatory',
          hidden: true,
          component: resolve => require(['@/views/training/manager/suspectImageMsg'], resolve),
          prmCode: $prmCode.treeCode.training.manager.questionBank.standardImage.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/manager/certificateList',
      redirect: '/Training/manager/certificateList',
      child: false,
      icon: '&#xe6bc;',
      content: 'vicenter.training.manager.certificate',
      name: 'certificate',
      prmCode: $prmCode.treeCode.training.manager.certificate.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.manager.certificate',
          path: '/Training/manager/certificateList',
          component: resolve => require(['@/views/training/manager/certificateList'], resolve),
          prmCode: $prmCode.treeCode.training.manager.certificate.certificateList.code,
          beforeEnter: (to, from, next) => {
            console.log(1)
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.certificate.certificateList.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.certificate.certificateList.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.add',
          path: '/Training/manager/certificateMsg',
          hidden: true,
          component: resolve => require(['@/views/training/manager/certificateMsg'], resolve),
          prmCode: $prmCode.treeCode.training.manager.questionBank.standardImage.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.manager.questionBank.standardImage.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    // 以下是考培教师的路由
    {
      KEY: 'Training',
      path: '/Training/teacher/index',
      redirect: '/Training/teacher/index',
      child: false,
      icon: '&#xe6c4;',
      content: 'vicenter.training.teacher.homePage',
      name: 'teacherIndex',
      prmCode: $prmCode.treeCode.training.teacher.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.teacher.homePage',
          path: '/Training/teacher/index',
          component: resolve => require(['@/views/training/teacher/welcome'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/teacher/trainingList',
      redirect: '/Training/teacher/trainingList',
      child: false,
      icon: '&#xe81e;',
      content: 'vicenter.training.teacher.trainingManagement',
      prmCode: $prmCode.treeCode.training.teacher.trainingManagement.code,
      name: 'trainingManagement',
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.teacher.trainingManagement',
          path: '/Training/teacher/trainingList',
          component: resolve => require(['@/views/training/teacher/trainingList'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.trainingManagement.trainingList.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.trainingManagement.trainingList.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.trainingManagement.trainingList.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.msg',
          path: '/Training/teacher/trainingMsg',
          hidden: true,
          component: resolve => require(['@/views/training/teacher/trainingMsg'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.add',
          path: '/Training/teacher/trainingAdd',
          hidden: true,
          component: resolve => require(['@/views/training/teacher/trainingMsg'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.edit',
          path: '/Training/teacher/trainingEdit',
          hidden: true,
          component: resolve => require(['@/views/training/teacher/trainingMsg'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.trainingManagement.trainingMsg.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/teacher/testPaperList',
      redirect: '/Training/teacher/testPaperList',
      child: false,
      icon: '&#xe6c1;',
      content: 'vicenter.training.teacher.testPaperManagement',
      prmCode: $prmCode.treeCode.training.teacher.testPaperManagement.code,
      name: 'testPaperManagement',
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.teacher.testPaperManagement',
          path: '/Training/teacher/testPaperList',
          component: resolve => require(['@/views/training/teacher/testPaperList'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.add',
          path: '/Training/teacher/testPaperMsgAdd',
          hidden: true,
          component: resolve => require(['@/views/training/teacher/testPaperMsg'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.edit',
          path: '/Training/teacher/testPaperMsgEdit',
          hidden: true,
          component: resolve => require(['@/views/training/teacher/testPaperMsg'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.testPaperManagement.testPaperList.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/teacher/examinationList',
      redirect: '/Training/teacher/examinationList',
      child: false,
      icon: '&#xe6c5;',
      content: 'vicenter.training.teacher.examinationManagement',
      prmCode: $prmCode.treeCode.training.teacher.examinationManagement.code,
      name: 'testPaperManagement',
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.teacher.examinationManagement',
          path: '/Training/teacher/examinationList',
          component: resolve => require(['@/views/training/teacher/examinationList'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.examinationManagement.examinationList.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.examinationManagement.examinationList.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.examinationManagement.examinationList.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.statistics',
          path: '/Training/teacher/examinationMsg',
          hidden: true,
          component: resolve => require(['@/views/training/teacher/examinationMsg'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.examinationManagement.examinationList.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.examinationManagement.examinationList.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.examinationManagement.examinationList.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/teacher/studentReport',
      redirect: '/Training/teacher/studentReport',
      child: true,
      icon: '&#xe6ba;',
      content: 'vicenter.training.teacher.studentReport',
      prmCode: $prmCode.treeCode.training.teacher.studentReport.code,
      name: 'studentReport',
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.teacher.traineeTraining',
          path: '/Training/teacher/traineeTraining',
          component: resolve => require(['@/views/training/teacher/traineeTraining'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.studentReport.traineeTraining.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.studentReport.traineeTraining.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.studentReport.traineeTraining.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.teacher.studentImageLearning',
          path: '/Training/teacher/studentImageLearning',
          component: resolve => require(['@/views/training/teacher/studentImageLearning'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.studentReport.studentImageLearning.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.studentReport.studentImageLearning.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.studentReport.studentImageLearning.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.teacher.studentReview',
          path: '/Training/teacher/studentReview',
          component: resolve => require(['@/views/training/teacher/studentReview'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.studentReport.studentReview.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.studentReport.studentReview.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.studentReport.studentReview.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.teacher.studentTestScores',
          path: '/Training/teacher/studentTestScores',
          component: resolve => require(['@/views/training/teacher/studentTestScores'], resolve),
          prmCode: $prmCode.treeCode.training.teacher.studentReport.studentTestScores.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.studentReport.studentTestScores.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.teacher.studentReport.studentTestScores.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    // 以下是考培学员的路由
    {
      KEY: 'Training',
      path: '/Training/student/index',
      redirect: '/Training/student/index',
      child: false,
      icon: '&#xe6bf;',
      content: 'vicenter.training.student.homePage',
      name: 'studentIndex',
      prmCode: $prmCode.treeCode.training.student.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.student.homePage',
          path: '/Training/student/index',
          component: resolve => require(['@/views/training/student/welcome'], resolve),
          prmCode: $prmCode.treeCode.training.student.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/student/imageLearningList',
      redirect: '/Training/student/imageLearningList',
      child: false,
      icon: '&#xe705;',
      content: 'vicenter.training.student.imageLearning',
      name: 'imageLearning',
      prmCode: $prmCode.treeCode.training.student.imageLearning.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.student.imageLearning',
          path: '/Training/student/imageLearningList',
          component: resolve => require(['@/views/training/student/imageLearningList'], resolve),
          prmCode: $prmCode.treeCode.training.student.imageLearning.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.imageLearning.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.imageLearning.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/student/reviewExerciseList',
      redirect: '/Training/student/reviewExerciseList',
      child: false,
      icon: '&#xe6bd;',
      content: 'vicenter.training.student.reviewExercise',
      name: 'reviewExercise',
      prmCode: $prmCode.treeCode.training.student.reviewExercise.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.student.reviewExercise',
          path: '/Training/student/reviewExerciseList',
          component: resolve => require(['@/views/training/student/reviewExerciseList'], resolve),
          prmCode: $prmCode.treeCode.training.student.reviewExercise.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.reviewExercise.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.reviewExercise.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/student/myTrainingList',
      redirect: '/Training/student/myTrainingList',
      child: false,
      icon: '&#xe6c0;',
      content: 'vicenter.training.student.myCourses',
      name: 'myCourses',
      prmCode: $prmCode.treeCode.training.student.reviewExercise.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.student.myCourses',
          path: '/Training/student/myTrainingList',
          component: resolve => require(['@/views/training/student/myTrainingList'], resolve),
          prmCode: $prmCode.treeCode.training.student.myTraining.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.myTraining.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.myTraining.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        },
        {
          name: 'vicenter.training.common.chooseAnOpenClass',
          path: '/Training/student/myTrainingMsg',
          hidden: true,
          component: resolve => require(['@/views/training/student/myTrainingMsg'], resolve),
          prmCode: $prmCode.treeCode.training.student.myTraining.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.myTraining.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.myTraining.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/student/myExamList',
      redirect: '/Training/student/myExamList',
      child: false,
      icon: '&#xe6c6;',
      content: 'vicenter.training.student.myExam',
      name: 'myExam',
      prmCode: $prmCode.treeCode.training.student.reviewExercise.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.student.myExam',
          path: '/Training/student/myExamList',
          component: resolve => require(['@/views/training/student/myExamList'], resolve),
          prmCode: $prmCode.treeCode.training.student.myExam.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.myExam.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.myExam.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      KEY: 'Training',
      path: '/Training/student/myCertificateList',
      redirect: '/Training/student/myCertificateList',
      child: false,
      icon: '&#xe6c3;',
      content: 'vicenter.training.student.myCertificate',
      name: 'myCertificate',
      prmCode: $prmCode.treeCode.training.student.reviewExercise.code,
      component: resolve => require(['@/views/common/index'], resolve),
      children: [
        {
          name: 'vicenter.training.student.myCertificate',
          path: '/Training/student/myCertificateList',
          component: resolve => require(['@/views/training/student/myCertificateList'], resolve),
          prmCode: $prmCode.treeCode.training.student.myCertificate.code,
          beforeEnter: (to, from, next) => {
            if (Vue.prototype.$PrmCodeList === undefined) {
              ajax.getPrmList({ all: true }).then(res => {
                if (res.data.flag) {
                  Vue.prototype.$PrmCodeList = res.data.result
                  if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.myCertificate.code) > -1) {
                    next()
                  } else {
                    next(false)
                  }
                }
              }).catch(() => { })
            } else {
              if (Vue.prototype.$PrmCodeList.indexOf($prmCode.treeCode.training.student.myCertificate.code) > -1) {
                next()
              } else {
                next(false)
              }
            }
          }
        }
      ],
      meta: {
        title: 'vicenter.training.system.name'
      }
    },
    {
      path: '*',
      name: 'error',
      component: resolve => require(['@/views/common/error'], resolve)
    }
  ]
})
