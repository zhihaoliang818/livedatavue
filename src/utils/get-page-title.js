import defaultSettings from '@/settings'

const title = defaultSettings.title || '直播大数据分析管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
