import request from '@/utils/request'

export function getReceivesByProjectId(projectId) {
  return request({
    url: 'api/sysProjectReceive?projectId=' + projectId,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/sysProjectReceive',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysProjectReceive/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysProjectReceive',
    method: 'put',
    data
  })
}

export default { getReceivesByProjectId, add, edit, del }
