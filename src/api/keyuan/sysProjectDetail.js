import request from '@/utils/request'

export function getShouldReceiveData() {
  return request({
    url: 'api/sysProjectDetail/shouldReceiveData',
    method: 'get'
  })
}

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
