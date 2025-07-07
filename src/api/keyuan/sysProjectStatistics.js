import request from '@/utils/request'

export function getStatistics() {
  return request({
    url: 'api/sysProjectStatistics',
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

export function getSysProjectBalance(month) {
  return request({
    url: '/api/sysProjectStatistics/balance?month=' + month,
    method: 'get'
  })
}

export function getInvoicedNotReceiveData() {
  return request({
    url: 'api/sysProjectStatistics/invoicedNotReceive',
    method: 'get'
  })
}
