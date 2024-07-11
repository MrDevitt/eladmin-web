import request from '@/utils/request'

export function getStatistics() {
  return request({
    url: 'api/sysProjectDetail/statistics',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/sysProjectDetail',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysProjectDetail/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysProjectDetail',
    method: 'put',
    data
  })
}

export default { add, edit, del }
