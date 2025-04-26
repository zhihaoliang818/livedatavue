import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/amendments/list',
    method: 'get',
    params: {
      ...query,
      searchKey: query.searchKey,
      searchValue: query.searchValue,
      page: query.page,
      limit: query.limit,
      sort: query.sort
    }
  })
}

export function createOrder(data) {
  return request({
    url: '/vue-element-admin/amendments/create',
    method: 'post',
    data: {
      ...data,
      auditor: data.auditor,
      auditTime: +new Date(data.auditTime),
      updateTime: +new Date()
    }
  })
}

export function updateOrder(data) {
  return request({
    url: '/vue-element-admin/amendments/update',
    method: 'post',
    data: {
      ...data,
      auditor: data.auditor,
      auditTime: +new Date(data.auditTime),
      updateTime: +new Date()
    }
  })
}
