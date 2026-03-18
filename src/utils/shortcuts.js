import Date from './datetime.js'

export const calendarBaseShortcuts = [{
  text: '今天',
  onClick(picker) {
    const startTime = new Date(new Date().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '昨天',
  onClick(picker) {
    const startTime = new Date(new Date().daysAgo(1).setHours(0, 0, 0))
    const endTime = new Date(new Date().daysAgo(1).setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '本周',
  onClick(picker) {
    const startTime = new Date(new Date().daysAgo(new Date().getDay() - 1).setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '本月',
  onClick(picker) {
    const startTime = new Date(new Date().monthBegin().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '本年',
  onClick(picker) {
    const startTime = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0)
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '上月',
  onClick(picker) {
    const now = new Date()
    const startTime = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endTime = new Date(new Date(now.getFullYear(), now.getMonth(), 1).getTime() - 1)
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '当前季度',
  onClick(picker) {
    const startTime = new Date(new Date().yearBegin().setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: '最近30天',
  onClick(picker) {
    const startTime = new Date(new Date().daysAgo(30).setHours(0, 0, 0))
    const endTime = new Date(new Date().setHours(23, 59, 59))
    picker.$emit('pick', [startTime, endTime])
  }
}]

export const calendarMoveShortcuts = [{
  text: '‹ 往前一天 ',
  onClick(picker) {
    let startTime = new Date(new Date().setHours(0, 0, 0))
    let endTime = new Date(new Date().setHours(23, 59, 59))
    if (!picker.value) {
      picker.value = [startTime, endTime]
    }
    startTime = picker.value[0].daysAgo(1)
    endTime = picker.value[1].daysAgo(1)
    picker.$emit('pick', [startTime, endTime])
  }
}, {
  text: ' 往后一天 ›',
  onClick(picker) {
    let startTime = new Date(new Date().setHours(0, 0, 0))
    let endTime = new Date(new Date().setHours(23, 59, 59))
    if (!picker.value) {
      picker.value = [startTime, endTime]
    }
    startTime = picker.value[0].daysAgo(-1)
    endTime = picker.value[1].daysAgo(-1)
    picker.$emit('pick', [startTime, endTime])
  }
}]

export const calendarShortcuts = [
  ...calendarBaseShortcuts,
  ...calendarMoveShortcuts
]
