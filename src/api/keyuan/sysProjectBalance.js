import request from '@/utils/request'

export function getSysProjectBalance() {
  return request({
    url: '/api/sysProjectBalance',
    method: 'get'
  })
}

export default { getSysProjectBalance }
