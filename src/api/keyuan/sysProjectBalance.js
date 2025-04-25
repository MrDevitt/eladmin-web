import request from '@/utils/request'

export function getSysProjectBalance(month) {
  return request({
    url: '/api/sysProjectBalance?month=' + month,
    method: 'get'
  })
}

export default { getSysProjectBalance }
