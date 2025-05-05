const Mock = require('mockjs')

const List = []
const count = 100

// Define country codes for mocking
const countryCodes = ['US', 'GB', 'JP', 'KR', 'FR', 'DE', 'CA', 'AU', 'SG', 'CH']

// Generate mock data list
for (let i = 0; i < count; i++) {

    // 计算时间范围，确保时间与id正相关
    const timeRange = Date.now() - new Date('2024-05-01').getTime()
    const timeOffset = Math.floor(timeRange * ((count - i - 1) / count)) // 调整为倒序时间
    
  List.push(Mock.mock({
    id: count - i, // Use descending ID for default sort
    orderNo: Mock.Random.guid().substring(0, 8).toUpperCase(), // 订单编号
    name: Mock.Random.name(), // 下单客户姓名 (Using English names as common for international)
    // Generate a plausible international phone number format (example)
    phone: Mock.Random.pick(['+1', '+44', '+81', '+82', '+33', '+49', '+1', '+61', '+65', '+41']) + '-' + Mock.Random.string('number', 3) + '-' + Mock.Random.string('number', 3) + '-' + Mock.Random.string('number', 4), // 电话
    country: Mock.Random.pick(countryCodes), // 国别
    gender: Mock.Random.pick(['Male', 'Female']), // 性别 (Using English)
    totalAmount: Mock.Random.float(50, 5000, 2, 2), // 下单总金额
    orderCount: Mock.Random.integer(1, 30), // 下单次数
    // Define time range: 2024-05-01 to current
    firstOrderTime: new Date('2024-05-01').getTime() + timeOffset // 确保时间与id同方向
  }))
}

module.exports = [
  // Get customer list with pagination and sorting
  {
    // Match the API call URL from the frontend
    url: '/api/customer/international/list',
    type: 'get',
    response: config => {
      const { searchKey, searchValue, page = 1, limit = 10, sort } = config.query // Default limit to 10

      let mockList = List.filter(item => {
        // Basic search functionality (can be expanded)
        if (searchKey && searchValue) {
          // Simple case-insensitive search on the specified key
          return String(item[searchKey]).toLowerCase().includes(searchValue.toLowerCase())
        }
        // Add more specific search logic if needed, e.g., for phone numbers, names etc.
        if (!searchKey && searchValue) { // General search if no specific key
             return JSON.stringify(item).toLowerCase().includes(searchValue.toLowerCase());
        }
        return true
      })

      // Sorting logic
       if (sort) {
         const prop = sort.replace(/^[+-]/, ''); // Extract property name
         mockList = [...mockList].sort((a, b) => {
           if (sort.startsWith('+')) { // Ascending
             return a[prop] > b[prop] ? 1 : (a[prop] < b[prop] ? -1 : 0);
           } else { // Descending (default or explicit '-')
             return b[prop] > a[prop] ? 1 : (b[prop] < a[prop] ? -1 : 0);
           }
         });
       } else {
         // Default sort if not specified (e.g., by ID descending)
         mockList = [...mockList].sort((a, b) => b.id - a.id);
       }


      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        message: 'Success',
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  // Add new customer
  {
    url: '/api/customer/international/add',
    type: 'post',
    response: config => {
       const newCustomer = config.body; // Get data from request body
       // Assign a new ID (simple approach for mock)
       newCustomer.id = List.reduce((maxId, item) => Math.max(item.id, maxId), 0) + 1;
       List.unshift(newCustomer); // Add to the beginning of the list
      return {
        code: 20000,
        message: 'Customer added successfully',
        data: newCustomer // Return the added customer data
      }
    }
  },

  // Update existing customer
  {
     // Use regex to match IDs in the URL
     url: '/api/customer/international/update', // Assuming ID is in the body
     type: 'post', // Or PUT
     response: config => {
       const updatedCustomer = config.body;
       const index = List.findIndex(item => item.id === updatedCustomer.id);
       if (index !== -1) {
         List.splice(index, 1, updatedCustomer); // Replace item at index
         return {
           code: 20000,
           message: 'Customer updated successfully',
           data: updatedCustomer
         };
       } else {
         return {
           code: 40004, // Example error code for not found
           message: 'Customer not found'
         };
       }
     }
   },

  // Delete customer
  {
    // Match URLs like /api/customer/international/delete/123
    url: '/api/customer/international/delete/\\d+',
    type: 'delete',
    response: config => {
       // Extract ID from URL
       const id = parseInt(config.url.split('/').pop());
       const index = List.findIndex(item => item.id === id);
       if (index !== -1) {
         List.splice(index, 1); // Remove item from list
         return {
           code: 20000,
           message: 'Customer deleted successfully',
           data: 'success'
         };
       } else {
         return {
           code: 40004,
           message: 'Customer not found'
         };
       }
    }
  }
]