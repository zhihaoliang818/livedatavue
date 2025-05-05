const Mock = require('mockjs')

const List = []
const count = 100

// Generate mock data list for domestic customers
for (let i = 0; i < count; i++) {
  const province = Mock.Random.province()
  const city = Mock.Random.city(true) // Generate city potentially related to province

  List.push(Mock.mock({
    id: count - i, // Use descending ID for default sort
    orderNo: Mock.Random.guid().substring(0, 8).toUpperCase(), // 订单编号
    name: Mock.Random.cname(), // 下单客户姓名 (Chinese name)
    phone: '1' + Mock.Random.pick(['3', '5', '7', '8', '9']) + Mock.Random.string('number', 9), // 电话 (Chinese mobile format)
    province: province, // 省份
    city: city, // 市
    gender: Mock.Random.pick(['男', '女']), // 性别 (Chinese)
    totalAmount: Mock.Random.float(50, 8000, 2, 2), // 下单总金额
    orderCount: Mock.Random.integer(1, 50), // 下单次数
    // Define time range: 2024-05-01 to current
    //Mock.Random.integer(new Date('2024-05-01').getTime(), Date.now())
    //firstOrderTime: Mock.Random.datetime('2024-MM-dd HH:mm:ss') // 初次下单时间
    firstOrderTime: Mock.Random.integer(new Date('2024-05-01').getTime(), Date.now()) // 初次下单时间
  }))
}

module.exports = [
  // Get domestic customer list with pagination and sorting
  {
    url: '/api/customer/domestic/list', // Updated URL
    type: 'get',
    response: config => {
      const { searchKey, searchValue, province: searchProvince, city: searchCity, page = 1, limit = 10, sort } = config.query // Default limit to 10

      let mockList = List.filter(item => {
        let keep = true;
        // Specific field search
        if (searchKey && searchValue) {
          keep = keep && String(item[searchKey]).toLowerCase().includes(searchValue.toLowerCase());
        }
        // General search
        if (!searchKey && searchValue) {
             keep = keep && JSON.stringify(item).toLowerCase().includes(searchValue.toLowerCase());
        }
        // Filter by province
        if (searchProvince) {
            keep = keep && item.province === searchProvince;
        }
        // Filter by city
        if (searchCity) {
            keep = keep && item.city === searchCity;
        }
        return keep;
      })

      // Sorting logic
       if (sort) {
         const prop = sort.replace(/^[+-]/, ''); // Extract property name
         mockList = [...mockList].sort((a, b) => {
           const valA = a[prop];
           const valB = b[prop];
           // Basic comparison, can be refined for specific types like numbers or dates
           let comparison = 0;
           if (valA > valB) {
              comparison = 1;
           } else if (valA < valB) {
              comparison = -1;
           }
           return sort.startsWith('+') ? comparison : -comparison; // Ascending or Descending
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

  // Add new domestic customer
  {
    url: '/api/customer/domestic/add', // Updated URL
    type: 'post',
    response: config => {
       const newCustomer = config.body; // Get data from request body
       // Assign a new ID (simple approach for mock)
       newCustomer.id = List.reduce((maxId, item) => Math.max(item.id, maxId), 0) + 1;
       // Ensure province/city from array are handled if cascader sends array
        if (Array.isArray(newCustomer.provinceCity) && newCustomer.provinceCity.length > 0) {
            newCustomer.province = newCustomer.provinceCity[0];
            newCustomer.city = newCustomer.provinceCity[1] || ''; // Handle potential missing city
            delete newCustomer.provinceCity; // Clean up temporary field
        }
       List.unshift(newCustomer); // Add to the beginning of the list
      return {
        code: 20000,
        message: 'Domestic customer added successfully',
        data: newCustomer // Return the added customer data
      }
    }
  },

  // Update existing domestic customer
  {
     url: '/api/customer/domestic/update', // Updated URL
     type: 'post', // Or PUT
     response: config => {
       const updatedCustomer = config.body;
        // Ensure province/city from array are handled if cascader sends array
        if (Array.isArray(updatedCustomer.provinceCity) && updatedCustomer.provinceCity.length > 0) {
            updatedCustomer.province = updatedCustomer.provinceCity[0];
            updatedCustomer.city = updatedCustomer.provinceCity[1] || ''; // Handle potential missing city
            delete updatedCustomer.provinceCity; // Clean up temporary field
        }
       const index = List.findIndex(item => item.id === updatedCustomer.id);
       if (index !== -1) {
         List.splice(index, 1, updatedCustomer); // Replace item at index
         return {
           code: 20000,
           message: 'Domestic customer updated successfully',
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

  // Delete domestic customer
  {
    url: '/api/customer/domestic/delete/\\d+', // Updated URL with regex
    type: 'delete',
    response: config => {
       const id = parseInt(config.url.split('/').pop());
       const index = List.findIndex(item => item.id === id);
       if (index !== -1) {
         List.splice(index, 1); // Remove item from list
         return {
           code: 20000,
           message: 'Domestic customer deleted successfully',
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