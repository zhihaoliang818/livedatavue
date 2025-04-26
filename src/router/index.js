import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 布局组件 - 包含侧边栏、导航栏等公共布局 */
import Layout from '@/layout'

/**
 * 常量路由（不需要权限校验的路由）
 */
export const constantRoutes = [
  // 重定向路由（用于处理旧路径跳转）
  {
    path: '/redirect',
    component: Layout,
    hidden: true, // 不在侧边栏显示
    children: [
      {
        path: '/redirect/:path(.*)', // 匹配所有路径
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  // 登录页
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true // 不在侧边栏显示
  },

  // 404页面
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  // 主页管理
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  /**
   * 根路由 - 首页
   * 注意：这里对应侧边栏的「首页」父级菜单
   */
  {
    path: '/user-manage',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/user-manager/index'),
      name: 'DomesticOrders',
      meta: {
        title: '用户管理',
        icon: 'el-icon-user'
      }
    }]
  },
  // 境内订单管理路由
  {
    path: '/domestic',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/order/domestic'),
      name: 'DomesticOrders',
      meta: {
        title: '境内订单管理',
        icon: 'el-icon-s-order'
      }
    }]
  },

  // 境外订单管理路由
  {
    path: '/international',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/order/international'),
      name: 'InternationalOrders',
      meta: {
        title: '境外订单管理',
        icon: 'el-icon-s-promotion'
      }
    }]
  },

  // 退改订单管理路由
  {
    path: '/amendments',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/order/amendments'),
      name: 'OrderAmendments',
      meta: {
        title: '退改订单管理',
        icon: 'el-icon-refresh-left'
      }
    }]
  }
]

/**
 * 异步路由（需要动态加载的权限路由）
 */
export const asyncRoutes = [
// 图标分析
  {
    path: '/line',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/charts/line'),
      name: 'LineChart',
      meta: {
        icon: 'el-icon-s-marketing', // 修改为境内与境外趋势图标
        title: '境内与境外趋势',
        noCache: true
      }
    }]
  },
  {
    path: '/baifen',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/charts/baifen'),
      name: 'baifenChart',
      meta: {
        icon: 'el-icon-date', // 修改为月度数据统计图标
        title: '月度数据统计',
        noCache: true
      }
    }]
  },
  // 日志
  {
    path: '/log',
    component: Layout,
    redirect: '/log/list',
    meta: { title: '日志管理', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/log-table/index'),
        name: 'LogList',
        meta: { title: '系统日志查询', icon: 'el-icon-tickets' } // 修改标题和保持图标
      }
    ]
  },

  // 404页面必须放在最后
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 创建路由实例
 */
const createRouter = () => new Router({
  // 页面切换时滚动到顶部
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

/**
 * 重置路由（用于权限变更时重新加载路由）
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
