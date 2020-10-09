/**
 * 用于菜单权限
 */
// import Vue from 'vue'
// import ajax from '@/api/common/common.js'
const treeCode = {
  vicenter: { // 九宫格
    code: 'VICENTER'
  },
  demo: { // 示例
    code: 'VICENTER-TRAINING'
  },
  tip: {
    code: 'VICENTER-TIP',
    // 图像管理
    tipImgManage: {
      code: 'VICENTER-TIP-IMAGE',
      add: {
        code: 'VICENTER-TIP-IMAGE'
      },
      edit: {
        code: 'VICENTER-TIP-IMAGE'
      },
      detail: {
        code: 'VICENTER-TIP-IMAGE'
      }
    },
    // 考核设置
    tipexam: {
      code: 'VICENTER-TIP-EXAM',
      add: {
        code: 'VICENTER-TIP-EXAM-ADD'
      },
      edit: {
        code: 'VICENTER-TIP-EXAM-EDIT'
      },
      detail: {
        code: 'VICENTER-TIP-EXAM-DETAIL'
      }
    },
    // 统计
    tipStatic: {
      code: 'VICENTER-TIP-STATISTICS',
      // 图像分布统计
      tipImageStatistics: {
        code: 'VICENTER-TIP-IMAGESTATISTICS'
      },
      // 考核成绩查询
      tipExamScore: {
        code: 'VICENTER-TIP-EXAM-QUERYRESULT'
      },
      // 考核情况详情
      tipExamScoreDetail: {
        code: 'VICENTER-TIP-EXAM-QUERYRESULT'
      },
      // 考核情况统计
      tipExamStatistics: {
        code: 'VICENTER-TIP-EXAMSTATISTICS'
      }
    },
    // 图像分类管理
    tipImageCategory: {
      code: 'VICENTER-TIP-IMAGECATEGORY'
    },
    // 审计日志
    auditLog: {
      code: 'VICENTER-TIP-AUDITLOG'
    }
  },
  training: { // 考培子系统
    code: 'VICENTER-TRA',
    manager: {
      code: 'VICENTER-TRA-ADMIN-HOME', // 首页
      questionBank: { // 题库管理
        code: 'VICENTER-TRA-ADMIN-TIKU',
        standardImage: {
          code: 'VICENTER-TRA-ADMIN-TIKU-BZ'
        },
        suspectImage: {
          code: 'VICENTER-TRA-ADMIN-TIKU-XY'
        }
      },
      certificate: { // 证书管理
        code: 'VICENTER-TRA-ADMIN-ZS',
        certificateList: {
          code: 'VICENTER-TRA-ADMIN-LIST'
        }
      }
    },
    teacher: {
      code: 'VICENTER-TRA-TEACHER-HOME', // 首页
      trainingManagement: { // 培训
        code: 'VICENTER-TRA-TEACHER-PX',
        trainingList: {
          code: 'VICENTER-TRA-TEACHER-PX-LIST'
        },
        trainingMsg: {
          code: 'VICENTER-TRA-TEACHER-PX-LIST'
        }
      },
      testPaperManagement: { // 试卷
        code: 'VICENTER-TRA-TEACHER-SJ',
        testPaperList: {
          code: 'VICENTER-TRA-TEACHER-SJ-LIST'
        }
      },
      examinationManagement: { // 考试
        code: 'VICENTER-TRA-TEACHER-KS',
        examinationList: {
          code: 'VICENTER-TRA-TEACHER-KS-LIST'
        }
      },
      studentReport: { // 报表
        code: 'VICENTER-TRA-TEACHER-BB',
        traineeTraining: {
          code: 'VICENTER-TRA-TEACHER-XYPX'
        },
        studentImageLearning: {
          code: 'VICENTER-TRA-TEACHER-XYTX'
        },
        studentReview: {
          code: 'VICENTER-TRA-TEACHER-XYST'
        },
        studentTestScores: {
          code: 'VICENTER-TRA-TEACHER-XYKS'
        }
      }
    },
    student: {
      code: 'VICENTER-TRA-STU-HOME',
      imageLearning: {
        code: 'VICENTER-TRA-STU-TXXX.LIST'
      },
      reviewExercise: {
        code: 'VICENTER-TRA-STU-STLX-LIST'
      },
      myTraining: {
        code: 'VICENTER-TRA-STU-MYPX-LIST'
      },
      myExam: {
        code: 'VICENTER-TRA-STU-MYKS-LIST'
      },
      myCertificate: {
        code: 'VICENTER-TRA-STU-MYZS-LIST'
      }
    }
  },
  // 监管
  dms: {
    code: 'VICENTER-DMS',
    // 工作看板
    dashboard: {
      code: 'VICENTER-DMS-DASHBOARD',
      auditAdminBoard: {
        code: 'VICENTER-DMS-DASHBOARD-MGMT'
      },
      auditBoard: {
        code: 'VICENTER-DMS-DASHBOARD-AUDIT'
      }
    },
    // 地图
    mapStatic: {
      code: 'VICENTER-DMS-MAPSTATIC'
    },
    // 任务稽查
    dmsTask: {
      code: 'VICENTER-DMS-TASK'
    },
    // 总署统计
    dmsHomeStatis: {
      code: 'VICENTER-DMS-HOMESTATIS'
    },
    // 统计
    dmsStatis: {
      code: 'VICENTER-DMS-STATIC',
      insCheck: {
        code: 'VICENTER-DMS-STATIC-INSCHECK'
      },
      audit: {
        code: 'VICENTER-DMS-STATIC-AUDIT'
      }
    },
    // 设备状态查询
    deviceStatus: {
      code: 'VICENTER-DMS-DEVICE-STATUS'
    },
    // 模板管理
    templateMgmt: {
      code: 'VICENTER-DMS-DASHBOARD-TEMPLATE'
    },
    // 组件管理
    componentMgmt: {
      code: 'VICENTER-DMS-DASHBOARD-COMPONENT'
    },
    // dashboard大屏
    dashboardMap: {
      code: 'VICENTER-DMS-DASHBOARD-SCREEN'
    }
  },
  // 后台管理子系统
  mgmt: {
    code: 'VICENTER-MGMT',
    // 设备管理
    mgmtDevice: {
      code: 'VICENTER-MGMT-DEVICE'
    },
    // 配置管理
    mgmtParam: {
      code: 'VICENTER-MGMT-CONFIG'
    },
    // 字典管理
    mgmtDic: {
      code: 'VICENTER-MGMT-DIC'
    },
    // HSCode管理
    HSCodeManagement: {
      code: 'VICENTER-MGMT-HCODE'
    },
    auditLog: {
      code: 'VICENTER-MGMT-AUDITLOG'
    },
    international: {
      code: 'VICENTER-MGMT-AUDITLOG'
    },
    fileManage: {
      code: 'VICENTER-MGMT-ARC-MANAGE',
      // 归档记录查询
      fileManageRecord: {
        code: 'VICENTER-MGMT-ARCLIST'
      },
      // 归档日志查询
      fileManageLog: {
        code: 'VICENTER-MGMT-ARCOPERA-LOG'
      },
      // 归档策略管理
      fileManagePlan: {
        code: 'VICENTER-MGMT-ARCPOLICE-MANGE'
      }
    },
    // 客户端应用版本管理
    appVersion: {
      code: 'VICENTER-MGMT-APP-VERSION-MGT'
    }
  },
  // 查验
  inspection: {
    code: 'VICENTER-INSPECTION',
    // 工作看板
    dashboard: {
      code: 'VICENTER-INSPECTION-DASHBOARD',
      analysisAdminBoard: {
        code: 'VICENTER-INSPECTION-DASHBOARD-IMGMGMT'
      },
      manualAdminBoard: {
        code: 'VICENTER-INSPECTION-DASHBOARD-MANUALMGMT'
      },
      analysisBoard: {
        code: 'VICENTER-INSPECTION-DASHBOARD-IMGCHECK'
      },
      recheckBoard: {
        code: 'VICENTER-INSPECTION-DASHBOARD-RECHECK'
      },
      manualBoard: {
        code: 'VICENTER-INSPECTION-DASHBOARD-MANUALCHECK'
      }
    },
    // 审图任务
    inspectionImgCheck: {
      code: 'VICENTER-INSPECTION-IMAGECHECK'
    },
    // 过程任务
    inspectionImgTask: {
      code: 'VICENTER-INSPECTION-TASKMGMT'
    },
    physicalCheck: {
      code: 'VICENTER-INSPECTION-MANUALCHECK'
    },
    physicalCheckTask: {
      code: 'VICENTER-INSPECTION-MANUALTASKMGMT'
    },
    // 派图管理
    assignImageMgmt: {
      code: 'VICENTER-INSPECTION-ASSIGN-IMAGECHECK'
    },
    // 历史任务
    inspectionHistory: {
      code: 'VICENTER-INSPECTION-HISTORY'
    },
    // 复核
    inspectionRecheck: {
      code: 'VICENTER-INSPECTION-RECHECK'
    },
    tamperingRecord: {
      code: 'VICENTER-INSPECTION-IMGTAMPERED'
    },
    // 查验量统计
    statistics: {
      code: 'VICENTER-INSPECTION-STATIC',
      imageCheck: {
        code: 'VICENTER-INSPECTION-STATIC-IMAGECHECK'
      },
      manualCheck: {
        code: 'VICENTER-INSPECTION-STATIC-MANUALCHECK'
      }
    }
  },
  // 图像库子系统
  imageLibrary: {
    code: 'VICENTER-IMAGELIBRARY',
    // 工作看板
    dashboard: {
      code: 'VICENTER-IMAGELIBRARY-DASHBOARD'
    },
    // 图像查询
    imageQuery: {
      code: 'VICENTER-IMAGELIBRARY-IMGSEARCH'
    },
    // 图像管理
    imageManagement: {
      code: 'VICENTER-IMAGELIBRARY-IMGMGMT',
      buttonPrm: {
        DELETE: 'VICENTER-IMAGELIBRARY-IMGMGMT-DELETE', // 删除
        ADD: 'VICENTER-IMAGELIBRARY-IMGMGMT-ADD', // 创建
        EDIT: 'VICENTER-IMAGELIBRARY-IMGMGMT-EDIT', // 典图修改
        DETAIL: 'VICENTER-IMAGELIBRARY-DETAIL', // 典图详情
        AUDIT: 'VICENTER-IMAGELIBRARY-AUDIT', // 审核
        BBSADD: 'VICENTER-IMAGELIBRARY-BBS-ADD', // 添加评论
        BBSDELETE: 'VICENTER-IMAGELIBRARY-BBS-DELETE', // 删除评论
        REJECTED: 'VICENTER-IMAGELIBRARY-AUDIT', // 拒绝
        RELEASE: 'VICENTER-IMAGELIBRARY-AUDIT', // 发布
        UNRELEASE: 'VICENTER-IMAGELIBRARY-AUDIT', // 取消发布
        IMPORT: 'VICENTER-IMAGELIBRARY-IMGMGMT-IMPORT' // 导入
      }
    },
    // HSCode管理
    // HSCodeManagement: {
    //   code: 'VICENTER-MGMT-HCODE'
    // },
    statistics: {
      code: 'VICENTER-IMAGELIBRARY-IMG-STATI',
      goodsStatistics: { // 货物统计
        code: 'VICENTER-IMAGELIBRARY-STATISTICS'
      },
      imageStatistics: { // 图像统计
        code: 'VICENTER-IMAGELIBRARY-IMGSTATISTICS'
      }
    }
  },
  // 报表子系统
  reports: {
    code: 'VICENTER-REPORT',
    taskReport: {
      code: 'TASK-REPORT'
    },
    taskVolumeReport: {
      code: 'TASKNUM-REPORT'
    },
    taskConclusionReport: {
      code: 'INS-CON-REPORT',
      insConclusionReport: {
        code: 'INS-CON-REPORT'
      },
      auditConclusionReport: {
        code: 'RECHECK-REPORT'
      }
    },
    personnelReport: {
      code: 'USR-TASK-REPORT',
      personnelTaskReport: {
        code: 'USR-TASK-REPORT'
      },
      personnelEfficiencyReport: {
        code: 'USR-EFFICIENCY-REPORT'
      },
      personnelTrendReport: {
        code: 'USR-TASK-TREND-REPORT'
      },
      personnelComparedReport: {
        code: 'USR-TASK-COMPARE-REPORT'
      }
    },
    tasksReport: {
      code: 'TASK-STATISTICS-REPORT',
      imageCheckReport: {
        code: 'INS-CON-IMG-CHK-REPORT'
      },
      recheckReport: {
        code: 'INS-CON-SEC-CHK-REPORT'
      },
      manualCheckReport: {
        code: 'INS-CON-MANUAL-CHK-REPORT'
      },
      insConclusionReport: {
        code: 'INS-CON-REPORT'
      },
      auditReport: {
        code: 'RECHECK-REPORT'
      }
    },
    personnelTaskReport: {
      code: 'USR-TASK',
      imgAnalystReport: {
        code: 'USR-TASK-INSPECTOR-REPORT'
      },
      recheckorReport: {
        code: 'USR-TASK-RECHECK-REPORT'
      },
      physicalInspectorReport: {
        code: 'USR-TASK-PHYSICAL-REPORT'
      },
      auditorReport: {
        code: 'USR-TASK-AUDITOR-REPORT'
      }
    },
    personnelEfficiencyReport: {
      code: 'USR-EFFICIENCY',
      imgAnalystReport: {
        code: 'USR-EFFICIENCY-INSPECTOR-REPORT'
      },
      recheckorReport: {
        code: 'USR-EFFICIENCY-RECHECK-REPORT'
      },
      auditorReport: {
        code: 'USR-EFFICIENCY-AUDITOR-REPORT'
      }
    },
    personnelTrendReport: {
      code: 'USR-TREND',
      imgAnalystReport: {
        code: 'USR-TASK-TREND-INSPECTOR-REPORT'
      },
      recheckorReport: {
        code: 'USR-TASK-TREND-RECHECK-REPORT'
      },
      physicalInspectorReport: {
        code: 'USR-TASK-TREND-PHYSICAL-REPORT'
      },
      auditorReport: {
        code: 'USR-TASK-TREND-AUDITOR-REPORT'
      }
    },
    personnelComparedReport: {
      code: 'USR-COMPARE',
      imgAnalystReport: {
        code: 'USR-TASK-COMPARE-INSPECTOR-REPORT'
      },
      recheckorReport: {
        code: 'USR-TASK-COMPARE-RECHECK-REPORT'
      },
      physicalInspectorReport: {
        code: 'USR-TASK-COMPARE-PHYSICAL-REPORT'
      },
      auditorReport: {
        code: 'USR-TASK-COMPARE-AUDITOR-REPORT'
      }
    },
    accuracyReport: {
      code: 'ACCURACY-REP',
      imageCheckAccuracyReport: {
        code: 'IMGCHK-ACCURACY-REP'
      },
      recheckAccuracyReport: {
        code: 'SECOND-IMGCHK-ACCURACY-REP'
      }
    },
    trendReport: {
      code: 'TASK-TREND',
      imageCheckTaskTrendReport: {
        code: 'IMGCHK-TASK-TREND-REPORT'
      },
      recheckTaskTrendReport: {
        code: 'REVIEW-TASK-TREND-REPORT'
      },
      manualTaskTrendReport: {
        code: 'MANUAL-TASK-TREND-REPORT'
      },
      auditTaskTrendReport: {
        code: 'RECHECK-TASK-TREND-REPORT'
      }
    },
    comparedReport: {
      code: 'TASK-COMPARE',
      imageCheckTaskComparedReport: {
        code: 'IMGCHK-TASK-COMPARE-REPORT'
      },
      recheckTaskComparedReport: {
        code: 'REVIEW-TASK-COMPARE-REPORT'
      },
      manualTaskComparedReport: {
        code: 'MANUAL-TASK-COMPARE-REPORT'
      },
      auditTaskComparedReport: {
        code: 'RECHECK-TASK-COMPARE-REPORT'
      }
    },
    reportDeliveryMgmt: {
      code: 'REP-SEND-MGR'
    }
  }
}
function judgeUrpm (code, next) {
  // let prmCodeList = Vue.prototype.$PrmCodeList
  // if (prmCodeList === undefined) {
  //   ajax.getPrmList({all: 'true'}).then(res => {
  //     if (res.data.flag) {
  //       prmCodeList = res.data.result
  //       if (prmCodeList.indexOf(code) > -1) {
  //         next()
  //       } else {
  //         // 没有权限
  //       }
  //     }
  //   }).catch(() => {})
  // } else {
  //   if (prmCodeList.indexOf(code) > -1) {
  //     next()
  //   } else {
  //     // 没有权限
  //   }
  // }
}
var prmCode = {
  treeCode: treeCode,
  judgeUrpm: judgeUrpm
}
export default prmCode
