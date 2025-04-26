import request from '@/utils/request'

// Fetch the list of international customers with query parameters
export function getInternationalCustomers(params) {
  return request({
    url: '/api/customer/international/list', // Updated URL
    method: 'get',
    params // Pass query parameters like page, limit, sort, searchKey, searchValue
  })
}

// Add a new international customer
export function addInternationalCustomer(data) {
  return request({
    url: '/api/customer/international/add', // Updated URL
    method: 'post',
    data // Customer data in the request body
  })
}

// Update an existing international customer
export function updateInternationalCustomer(data) {
  return request({
    // Assuming ID is part of the data object sent in the body
    url: '/api/customer/international/update', // Updated URL
    method: 'post', // Or 'put' depending on backend convention
    data // Updated customer data in the request body
  })
}

// Delete an international customer by ID
export function deleteInternationalCustomer(id) {
  return request({
    url: `/api/customer/international/delete/${id}`, // Updated URL with ID parameter
    method: 'delete'
  })
}
