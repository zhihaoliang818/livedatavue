import request from '@/utils/request'

// Fetch user list with query parameters
export function fetchList(query) {
  return request({
    url: '/vue-element-admin/user-manager/list',
    method: 'get',
    params: query // Pass query object directly (contains page, limit, sort, filter fields)
  })
}

// Create a new user
export function createUser(data) {
  return request({
    url: '/vue-element-admin/user-manager/create',
    method: 'post',
    data // Send user data in the request body
    // Note: Do not send plain text password here in a real app.
    // Hashing should ideally happen server-side.
    // If client-side hashing is needed, do it before calling this function.
  })
}

// Update an existing user
export function updateUser(data) {
  return request({
    url: '/vue-element-admin/user-manager/update',
    method: 'post', // Or 'put'/'patch' if your backend uses it
    data // Send updated user data (including ID)
    // Handle password update carefully (e.g., only send if changed)
  })
}

// Delete a user by ID
export function deleteUser(id) {
  return request({
    url: '/vue-element-admin/user-manager/delete',
    method: 'post', // Or 'delete' if your backend uses it
    data: { id } // Send ID in the request body
  })
}

// Optional: Function to fetch details for a single user (if needed)
export function fetchUser(id) {
  return request({
    // Assuming you might add a detail endpoint in mock later
    url: '/vue-element-admin/user-manager/detail',
    method: 'get',
    params: { id }
  })
}
