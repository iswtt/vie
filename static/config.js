window.config = {
  baseUrl: 'https://219.232.104.101:8061/',
  imUrl: '/im/',
  conmmonLang: 'en-US',
  skinTheme: 'blue', // 默认主题 BLUE RED
  supViporbeButton: true, // 监管页面viprobe按钮是否显示
  timeout: 10000,
  baseErrorCode: '',
  langInit: false,
  tipImageQtyMax: 2, // tip考核设置页面的图像数量最大值，默认最大数量为2
  isAutoAssignImage: true, // 自动派图功能是否打开
  refreshTime: 60, // 列表刷新时间，默认60s
  boardRefreshTime: 300000, // 看板刷新时间，默认5分钟
  maxCompareImgQty: 5, // 辅助审像viprobe同时打开的最多图像数量
  imageLibraryEnable: true, // 是否集成典图系统（控制智审结果按钮、以图搜图页签和文本检索页签是否显示）
  trainingUI: {
    trans: 'https',
    baseUrl: window.location.origin + '/training', // 后端接口
    fileUrl: window.location.origin + '/nuctechfile/' // 文件打开下载
  }, // 考培子系统全地址
  roleCode: 'INSPECTOR', // 角色编码
  appCode: 'VICENTER', // 应用编码
  Vitracking: {
    baseUrl: window.location.origin + '/',
    commonUrl: 'platform',
    urpmUrl: {
      web: 'urpmui',
      api: 'urpm'
    }
  },
  print: { // 打印功能相关配置
    direction: false // 打印方向，true表示横向，false表示纵向
  },
  export: { // 导出功能相关配置
    pdfDirection: false, // 导出pdf纸张方向，true表示横向，false表示纵向
  },
  viprobeAutoPlay: false // viprobe加载历史操作步骤时是否自动播放，true为自动播放，false为不自动播放
}
