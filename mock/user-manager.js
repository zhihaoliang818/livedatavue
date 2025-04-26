const Mock = require('mockjs')

const List = []
const count = 30 // Generate 30 mock users

// Define time range for creation/update timestamps
const startDate = new Date('2023-01-01').getTime() // Example start date
const currentDate = Date.now() // Current time

for (let i = 0; i < count; i++) {
  const createdAt = Mock.Random.integer(startDate, currentDate)
  const updatedAt = Mock.Random.integer(createdAt, currentDate) // Ensure updatedAt is after or same as createdAt

  List.push(Mock.mock({
    id: count - i,
    account: Mock.Random.word(6, 12), // Random word for account name
    // Mock.js doesn't have a specific password generator, using string
    password_hash: Mock.Random.string('lower', 32), // Simulate a hashed password (don't store plain text!)
    email: Mock.Random.email(),
    name: Mock.Random.cname(),
    gender: Mock.Random.pick(['male', 'female']), // Use values consistent with form
    address: Mock.Random.county(true), // Generate a full address string
    createdAt: createdAt, // Creation timestamp
    updatedAt: updatedAt  // Last update timestamp
  }))
}

module.exports = [
  // User List API
  {
    url: '/vue-element-admin/user-manager/list',
    type: 'get',
    response: config => {
      const { account, name, email, page = 1, limit = 10, sort } = config.query

      // Filtering logic
      let mockList = List.filter(item => {
        if (account && item.account.indexOf(account) < 0) return false
        if (name && item.name.indexOf(name) < 0) return false
        if (email && item.email.indexOf(email) < 0) return false
        return true
      })

      // Sorting logic
      mockList = [...mockList].sort((a, b) => {
        if (sort === '-id') {
          return b.id - a.id
        }
        return a.id - b.id
      })

      // Pagination logic
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  // Create User API
  {
    url: '/vue-element-admin/user-manager/create',
    type: 'post',
    response: config => {
      const { account, password, email, name, gender, address } = config.body
      // Basic validation simulation
      if (!account || !password || !email || !name || !gender) {
         return {
           code: 40000, // Bad request
           message: 'Required fields are missing.'
         }
      }
      const newUser = {
        id: Mock.Random.integer(1000, 9999), // Generate a random ID for mock
        account: account,
        password_hash: Mock.Random.string('lower', 32), // Simulate hashing
        email: email,
        name: name,
        gender: gender,
        address: address || '', // Handle optional address
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      List.unshift(newUser) // Add to the beginning of the list
      return {
        code: 20000,
        data: newUser // Return the created user data
      }
    }
  },

  // Update User API
  {
    url: '/vue-element-admin/user-manager/update',
    type: 'post', // Typically PUT or PATCH, but sticking to POST for consistency with example
    response: config => {
      const { id, account, email, name, gender, address, password } = config.body
      const userIndex = List.findIndex(item => item.id === id)

      if (userIndex !== -1) {
        if (account) List[userIndex].account = account;
        if (email) List[userIndex].email = email;
        if (name) List[userIndex].name = name;
        if (gender) List[userIndex].gender = gender;
        if (address !== undefined) List[userIndex].address = address; // Allow empty address
        // Simulate password update if provided
        if (password) List[userIndex].password_hash = Mock.Random.string('lower', 32);
        List[userIndex].updatedAt = Date.now()

        return {
          code: 20000,
          data: List[userIndex] // Return updated user
        }
      } else {
        return {
          code: 40004, // Not Found
          message: 'User not found.'
        }
      }
    }
  },

  // Delete User API
  {
    // Note: In RESTful APIs, delete is usually a DELETE request,
    // but vue-element-admin often uses POST/GET for simplicity in mock.
    // Using POST here for consistency. Adjust if needed.
    url: '/vue-element-admin/user-manager/delete',
    type: 'post',
    response: config => {
      const { id } = config.body
      const userIndex = List.findIndex(item => item.id === id)

      if (userIndex !== -1) {
        List.splice(userIndex, 1) // Remove user from list
        return {
          code: 20000,
          data: 'success'
        }
      } else {
        return {
          code: 40004, // Not Found
          message: 'User not found.'
        }
      }
    }
  }
]