import request from '@/utils/request'
import qs from 'qs'

export function getSummary(begin, end, person) {
  return request({
    url: 'api/sysProjectTransaction/summary?begin=' + begin + '&end=' + end + '&person=' + person,
    method: 'get'
  })
}

export function get(params) {
  console.log(params)
  return request({
    url: 'api/sysProjectTransaction?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/sysProjectTransaction',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysProjectTransaction/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysProjectTransaction',
    method: 'put',
    data
  })
}

export default { add, edit, del }
