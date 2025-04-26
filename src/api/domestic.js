import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/domestic/list',
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
    url: '/vue-element-admin/domestic/create',
    method: 'post',
    data: {
      ...data,
      visitorNames: data.visitorNames.join(','),
      orderTime: +new Date(data.orderTime),
      paymentTime: +new Date(data.paymentTime)
    }
  })
}

export function updateOrder(data) {
  return request({
    url: '/vue-element-admin/domestic/update',
    method: 'post',
    data: {
      ...data,
      visitorNames: data.visitorNames.join(','),
      orderTime: +new Date(data.orderTime),
      paymentTime: +new Date(data.paymentTime),
      modifyTime: +new Date()
    }
  })
}
