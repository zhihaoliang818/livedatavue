import defaultSettings from '@/settings'

const title = defaultSettings.title || '游艇旅游订单管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
