export function formatCurrency(value) {
  if (value === undefined || value == null || value === '') {
    return '0.00'
  }
  const amount = Number(value) / 100
  const str = amount.toString()
  const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}
