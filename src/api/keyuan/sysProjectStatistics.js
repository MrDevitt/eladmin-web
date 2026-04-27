import request from '@/utils/request'

export function getStatistics(contractYear, receiveYear) {
  return request({
    url: 'api/sysProjectStatistics?contractYear=' + contractYear + '&receiveYear=' + receiveYear,
    method: 'get'
  })
}

export function getShouldReceiveData() {
  return request({
    url: 'api/sysProjectStatistics/shouldReceive',
    method: 'get'
  })
}

export function getNotReceiveData() {
  return request({
    url: 'api/sysProjectStatistics/notReceive',
    method: 'get'
  })
}

export function getSysProjectInvoice(month) {
  return request({
    url: '/api/sysProjectStatistics/invoice?month=' + month,
    method: 'get'
  })
}
export function getInvoicedNotReceiveData() {
  return request({
    url: 'api/sysProjectStatistics/invoicedNotReceive',
    method: 'get'
  })
}
