<template>
  <div class="dashboard-editor-container">
    <!-- 用户简介区块 -->
    <div class="profile-section">
      <h1>直播大数据管理系统</h1>
      <p>欢迎回来，{{ $store.getters.name }} 管理员</p>
    </div>

    <!-- 导航区块 -->
    <div class="nav-grid">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-card"
      >
        <div class="nav-content">
          <svg-icon
            v-if="!item.icon.includes('el-icon')"
            :icon-class="item.icon"
            class="nav-icon"
          />
          <!-- Element UI 字体图标 -->
          <i v-else :class="item.icon" class="nav-icon" />
          <h3>{{ item.title }}</h3>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      // 更新后的 navItems 配置
      navItems: [
        {
          title: '用户管理',
          icon: 'user2',
          path: '/user-manage'
        },
        {
          path: '/customer-domestic',
          title: '境内客户管理',
          icon: 'el-icon-user'
        },
        {
          path: '/customer-international',
          title: '境外客户管理',
          icon: 'el-icon-user-solid'
        },
        {
          title: '境内订单管理',
          icon: 'el-icon-s-order',
          path: '/domestic'
        },
        {
          title: '境外订单管理',
          icon: 'el-icon-s-promotion',
          path: '/international'
        },
        {
          title: '退改订单管理',
          icon: 'el-icon-refresh-left',
          path: '/amendments'
        },
        {
          title: '境内与境外趋势',
          icon: 'el-icon-s-marketing',
          path: '/line'
        },
        {
          title: '月度数据统计',
          icon: 'el-icon-date',
          path: '/baifen'
        },
        {
          title: '系统日志查询',
          icon: 'el-icon-tickets',
          path: '/log/list'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  min-height: calc(100vh - 84px);
}

.profile-section {
  background: #fff;
  padding: 32px;
  margin-bottom: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.nav-card {
  background: #fff;
  border-radius: 4px;
  padding: 24px;
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }

  .nav-content {
    display: flex;
    align-items: center;
    gap: 16px;

    i {
      font-size: 28px;
      color: #409EFF;
    }

    .nav-icon {
      color: #409EFF;
      font-size: 32px;  // 新增图标尺寸设置
    }

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }
}
</style>
