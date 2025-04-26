const Mock = require('mockjs')
const serviceData = require('./serviceData') // 新增serviceData依赖

const List = []
const count = 100

// 定义时间范围：2020-01-01 至当前
const startDate = new Date('2020-01-01').getTime()
const currentDate = Date.now()

// 辅助函数：生成未来日期（含当前）
const generateFutureDate = (baseTime, minDays, maxDays) => {
  const days = Mock.Random.integer(minDays, maxDays)
  return baseTime + days * 24 * 60 * 60 * 1000
}

// 新增服务随机选择函数
function getRandomService() {
  return serviceData[Math.floor(Math.random() * serviceData.length)]
}

for (let i = 0; i < count; i++) {
  // 生成基础订单时间（2020-01-01至今）
  const baseOrderTime = Mock.Random.integer(startDate, currentDate)

  // 生成时间序列（确保时间顺序：订单时间 → 修改时间 → 审核时间）
  const modifyTime = generateFutureDate(baseOrderTime, 1, 5) // 修改时间在订单时间后1-5天
  const auditTime = generateFutureDate(modifyTime, 1, 5)      // 审核时间在修改时间后1-5天

  const service = getRandomService()

  List.push(Mock.mock({
    id: count - i,
    orderNumber: Mock.Random.string('number', 12),
    customerName: Mock.Random.cname(),
    amendOrderNo: 'TG' + Mock.Random.string('number', 8),
    originalOrderNo: 'YD' + Mock.Random.string('number', 8),
    serviceName: service.name, // 替换为serviceData数据
    amount: service.price, // 替换为serviceData数据
    orderTime: baseOrderTime,
    refundAmount: service.price,
    refundStatus: Mock.Random.pick(['待审核', '已通过', '已拒绝']),
    auditor: Mock.Random.cname(),
    updateTime: modifyTime, // 对应视图中的prop="updateTime"
    auditTime: auditTime,   // 对应视图中的prop="auditTime"
    status: Mock.Random.pick(['已处理', '待处理']),
    lastUpdateTime: currentDate // 重命名避免字段冲突
  }))
}


module.exports = [
  {
    url: '/vue-element-admin/amendments/list',
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
    url: '/vue-element-admin/amendments/detail',
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
    url: '/vue-element-admin/amendments/pv',
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
    url: '/vue-element-admin/amendments/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/amendments/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
