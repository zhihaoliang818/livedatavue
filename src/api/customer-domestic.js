import request from '@/utils/request'

// Fetch the list of domestic customers with query parameters
export function getDomesticCustomers(params) {
  return request({
    url: '/api/customer/domestic/list', // Correct URL
    method: 'get',
    params // Pass query parameters like page, limit, sort, searchKey, searchValue, province, city
  })
}

// Add a new domestic customer
export function addDomesticCustomer(data) {
  return request({
    url: '/api/customer/domestic/add', // Correct URL
    method: 'post',
    data // Customer data in the request body
  })
}

// Update an existing domestic customer
export function updateDomesticCustomer(data) {
  return request({
    url: '/api/customer/domestic/update', // Correct URL
    method: 'post', // Or 'put' depending on backend convention
    data // Updated customer data in the request body
  })
}

// Delete a domestic customer by ID
export function deleteDomesticCustomer(id) {
  return request({
    url: `/api/customer/domestic/delete/${id}`, // Correct URL with ID parameter
    method: 'delete'
  })
}
