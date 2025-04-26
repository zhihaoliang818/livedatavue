const Mock = require('mockjs')
const serviceData = require('./serviceData')
const List = []
const count = 100

// 定义时间范围：2020-01-01 至当前
const startDate = new Date('2020-01-01').getTime()  // 2020年1月1日的时间戳
const currentDate = Date.now()                       // 当前时间的时间戳

// 辅助函数：生成未来日期（含当前）
const generateFutureDate = (baseTime, minDays, maxDays) => {
  const days = Mock.Random.integer(minDays, maxDays)
  return baseTime + days * 24 * 60 * 60 * 1000
}

// 添加随机选择函数
function getRandomService() {
  return serviceData[Math.floor(Math.random() * serviceData.length)];
}

for (let i = 0; i < count; i++) {
  // 生成 2020-01-01 到当前时间之间的随机时间戳
  const baseOrderTime = Mock.Random.integer(startDate, currentDate)
  
  const paymentTime = generateFutureDate(baseOrderTime, 1, 5) // 支付时间至少+1天
  const auditTime = generateFutureDate(paymentTime, 1, 5)     // 审核时间至少+1天
  const modifyTime = generateFutureDate(auditTime, 0, 5)      // 修改时间允许当天
  
  const service = getRandomService();
  List.push(Mock.mock({
    id: count - i,
    orderNumber: Mock.Random.string('number', 12),
    customerName: Mock.Random.cname(),
    province: Mock.Random.province(),
    city: Mock.Random.city(),
    gender: Mock.Random.pick(['男', '女']),
    serviceName: service.name,
    amount: service.price,
    orderTime: baseOrderTime, // 使用随机生成的时间戳
    visitorCount: Mock.Random.integer(1, 10),
    visitorNames: Array.from({length: Mock.Random.integer(1, 5)}, () => Mock.Random.cname()),
    paymentTime: paymentTime,
    auditor: Mock.Random.cname(),
    auditTime: auditTime,
    modifyTime: modifyTime,
    status: Mock.Random.pick(['已审核', '待审核', '已修改'])
  }))
}


module.exports = [
  {
    url: '/vue-element-admin/domestic/list',
    type: 'get',
    response: config => {
      const { searchKey, searchValue, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (searchKey && searchValue) {
          return String(item[searchKey]).toLowerCase().includes(searchValue.toLowerCase())
        }
        return true
      })

      // 排序逻辑
      mockList = [...mockList].sort((a, b) => {
        if (sort === '-id') {
          return b.id - a.id
        }
        return a.id - b.id
      })

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

  {
    url: '/vue-element-admin/domestic/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/domestic/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/domestic/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/domestic/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
