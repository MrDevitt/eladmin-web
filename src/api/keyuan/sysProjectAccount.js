import request from '@/utils/request'

export function getAccounts(params) {
  // const params2 = {
  //   ...params,
  //   page: 0,
  //   size: 9999
  // }
  // console.log(params2)
  return request({
    url: 'api/sysProjectAccount',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/sysProjectAccount',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysProjectAccount/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysProjectAccount',
    method: 'put',
    data
  })
}

export default { add, edit, del, getAccounts }
