const Mock = require('mockjs')
let portArray = [
  {
    value: 'port1',
    label: 'vicenter.supervise.taskStatistics.ahTameken',
    type: 'text'
  }, {
    value: 'port2',
    label: 'vicenter.supervise.taskStatistics.buick',
    type: 'text'
  }, {
    value: 'port3',
    label: 'vicenter.supervise.taskStatistics.mHabutge',
    type: 'text'
  }, {
    value: 'port4',
    label: 'vicenter.supervise.taskStatistics.kerrJet',
    type: 'text'
  }, {
    value: 'port5',
    label: 'vicenter.supervise.taskStatistics.bakhty',
    type: 'text'
  }, {
    value: 'port6',
    label: 'vicenter.supervise.taskStatistics.ahFruit',
    type: 'text'
  }, {
    value: 'port7',
    label: 'vicenter.supervise.taskStatistics.huoerguosi',
    type: 'text'
  }
]
let typeArray = [
  {
    value: 'IMPORT',
    label: 'vicenter.DIC.T_BUSSINESS_TYPE.C_IMPORT',
    type: 'text'
  },
  {
    value: 'EXPORT',
    label: 'vicenter.DIC.T_BUSSINESS_TYPE.C_EXPORT',
    type: 'text'
  },
  {
    value: 'TRANSITTARIFFUNION',
    label: 'vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITTARIFFUNION',
    type: 'text'
  },
  {
    value: 'TRANSITNONTARIFFUNION',
    label: 'vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITNONTARIFFUNION',
    type: 'text'
  },
  {
    value: 'TRANSITDOMESTIC',
    label: 'vicenter.DIC.T_BUSSINESS_TYPE.C_TRANSITDOMESTIC',
    type: 'text'
  },
  {
    value: 'TOLOGISTICSCENTER',
    label: 'vicenter.DIC.T_BUSSINESS_TYPE.C_TOLOGISTICSCENTER',
    type: 'text'
  }
]
let timeArray = [
  {
    value: 'IMPORT',
    label: 'vicenter.supervise.clearanceStatistics.averageTimeimports',
    type: 'text'
  },
  {
    value: 'EXPORT',
    label: 'vicenter.supervise.clearanceStatistics.averageTimeexport',
    type: 'text'
  },
  {
    value: 'TRANSITTARIFFUNION',
    label: 'vicenter.supervise.clearanceStatistics.averageTimetransferCustomsUnion',
    type: 'text'
  },
  {
    value: 'TRANSITNONTARIFFUNION',
    label: 'vicenter.supervise.clearanceStatistics.averageTimetransfernoncustomsallies',
    type: 'text'
  },
  {
    value: 'TRANSITDOMESTIC',
    label: 'vicenter.supervise.clearanceStatistics.averageTimetransfertohome',
    type: 'text'
  },
  {
    value: 'TOLOGISTICSCENTER',
    label: 'vicenter.supervise.clearanceStatistics.averageTimetransferlogisticscountry',
    type: 'text'
  }
]
export {
  portArray,
  typeArray,
  timeArray
}
