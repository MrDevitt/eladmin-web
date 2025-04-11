import request from '@/utils/request'

export function getSysProjectGuaranteeData() {
  return request({
    url: 'api/sysProjectGuarantee/data',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/sysProjectGuarantee',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysProjectGuarantee/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysProjectGuarantee',
    method: 'put',
    data
  })
}

export default { add, edit, del }
