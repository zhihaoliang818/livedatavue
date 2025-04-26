/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '分析',
    icon: 'chart'
    // icon: 'el-icon-data-analysis' // 图标
  },
  children: [
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'LineChart',
      meta: { icon: 'el-icon-data-analysis', title: '境内外订单', noCache: true }
    },
    {
      path: 'baifen',
      component: () => import('@/views/charts/baifen'),
      name: 'baifenChart',
      meta: { icon: 'el-icon-data-analysis', title: '每月订单', noCache: true }
    }
  ]
}

export default chartsRouter
