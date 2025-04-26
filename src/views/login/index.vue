<!-- 登录页面主模板 -->
<template>
  <div class="login-container">
    <!-- 登录表单区域 -->
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <!-- 系统标题 -->
      <div class="title-container">
        <h3 class="title">游艇旅游订单管理系统</h3>
      </div>

      <!-- 用户名输入 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <!-- 密码输入（包含大写锁定提示） -->
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <div style="display: flex; gap: 15px; margin-bottom: 30px;">
        <el-button
          :loading="loading"
          type="success"
          style="width: 50%"
          @click="registerDialogVisible = true"
        >
          注 册
        </el-button>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 50%"
          @click.native.prevent="handleLogin"
        >
          登 录
        </el-button>
      </div>
      <div class="forget" style="text-align: center;">
        <el-link type="primary" style="opacity: 0.8;" @click="resetPasswordDialogVisible = true">忘记密码？</el-link>
      </div>
    </el-form>

    <div class="version-info">
      游艇旅游订单管理系统v1.0
    </div>

    <!-- 第三方登录对话框 -->
    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>

    <!-- 密码重置对话框 -->
    <el-dialog
      title="重置密码"
      :visible.sync="resetPasswordDialogVisible"
      width="500px"
      custom-class="custom-dialog reset-password-dialog"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="dialog-header-icon">
        <i class="el-icon-lock icon-large" />
      </div>
      <el-form ref="resetForm" :model="resetForm" :rules="resetRules" label-width="90px" label-position="right" class="dialog-form">

        <el-form-item label="账号" prop="account">
          <el-input
            v-model="resetForm.account"
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>

        <el-form-item label="注册邮箱" prop="email">
          <el-input
            v-model="resetForm.email"
            placeholder="请输入注册时使用的邮箱"
            prefix-icon="el-icon-message"
            clearable
          />
        </el-form-item>

        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="resetForm.password"
            type="password"
            placeholder="请输入新密码（至少6位）"
            prefix-icon="el-icon-lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="resetForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            prefix-icon="el-icon-refresh-left"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleResetPassword">确 定 重 置</el-button>
      </div>
    </el-dialog>

    <!-- 用户注册对话框 -->
    <el-dialog
      title="用户注册"
      :visible.sync="registerDialogVisible"
      width="500px"
      custom-class="custom-dialog user-register-dialog"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="dialog-header-icon">
        <i class="el-icon-user-solid icon-large" />
      </div>
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="90px" label-position="right" class="dialog-form">

        <el-form-item label="账号" prop="account">
          <el-input
            v-model="registerForm.account"
            placeholder="请输入登录账号"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            prefix-icon="el-icon-message"
            clearable
          />
        </el-form-item>

        <el-form-item label="设置密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            prefix-icon="el-icon-lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="el-icon-refresh-left"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="registerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRegister">注 册</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate' // Assuming you have this validation util
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    // --- Validation Functions ---
    // --- 验证函数区域 ---
    const validateUsernameInput = (rule, value, callback) => {
      // Replace with your actual username validation logic if different from validUsername
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入用户名'))
      } else if (!validUsername(value)) { // Keep using validUsername if it suits your needs
        callback(new Error('请输入正确的用户名格式')) // Or a more specific error
      } else {
        callback()
      }
    }

    const validatePasswordInput = (rule, value, callback) => {
      if (!value || value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }

    const validateAccountInput = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入账号'))
      } else {
        // Add more specific account validation if needed (e.g., length, characters)
        callback()
      }
    }

    const validateEmailInput = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入邮箱地址'))
      } else {
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      }
    }

    // Validator for Reset Password Confirmation
    const validateResetConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.resetForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    // Validator for Register Password Confirmation
    const validateRegisterConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // --- End Validation Functions ---
    // --- 验证函数区域结束 ---

    return {
      loginForm: {
        username: 'admin',
        password: '123456' // Shorter password for testing validation
      },
      loginRules: {
        // Use the specific validator function
        username: [{ required: true, trigger: 'blur', validator: validateUsernameInput }],
        password: [{ required: true, trigger: 'blur', validator: validatePasswordInput }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false, // For Social Signin Dialog

      // Reset Password State
      resetPasswordDialogVisible: false,
      resetForm: {
        account: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      resetRules: {
        account: [{ required: true, validator: validateAccountInput, trigger: 'blur' }],
        email: [{ required: true, validator: validateEmailInput, trigger: ['blur', 'change'] }],
        password: [{ required: true, validator: validatePasswordInput, trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validateResetConfirmPassword, trigger: 'blur' }]
      },

      // Register State
      registerDialogVisible: false,
      registerForm: {
        account: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      registerRules: {
        account: [{ required: true, validator: validateAccountInput, trigger: 'blur' }],
        email: [{ required: true, validator: validateEmailInput, trigger: ['blur', 'change'] }],
        password: [{ required: true, validator: validatePasswordInput, trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validateRegisterConfirmPassword, trigger: 'blur' }]
      },

      redirect: undefined,
      otherQuery: {}
    }
  },
  // 组件状态监听
  watch: {
    // 路由变化处理
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    // 监听密码重置对话框状态
    resetPasswordDialogVisible(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.resetForm?.resetFields() // Use optional chaining
          // Or manually clear: this.resetForm = { account: '', email: '', password: '', confirmPassword: '' };
        })
      }
    },
    // 监听注册对话框状态
    registerDialogVisible(newValue) {
      if (newValue) {
        this.$nextTick(() => {
           this.$refs.registerForm?.resetFields() // Use optional chaining
          // Or manually clear: this.registerForm = { account: '', email: '', password: '', confirmPassword: '' };
        })
      }
    }
  },
  // 组件生命周期钩子
  created() {
    // 二维码扫描事件监听（当前注释）
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    // 自动聚焦逻辑
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // 组件销毁时移除事件监听
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 检查大写锁定状态
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // 切换密码显示/隐藏
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 处理登录提交
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // --- Replace with your actual login API call ---
          // --- 替换为实际的登录API调用 ---
          console.log('Attempting login with:', this.loginForm)
          // Mock API call
          setTimeout(() => {
            // Simulate success or failure based on input (e.g., admin/any password)
            const loginSuccess = (this.loginForm.username === 'admin' || this.loginForm.username === 'editor')

            if (loginSuccess) {
              // Mock successful login using vuex (if you have it setup)
              // Example: this.$store.dispatch('user/login', this.loginForm)
              console.log('Dispatching login action...')
              this.$store.dispatch('user/login', this.loginForm)
                .then(() => {
                  console.log('Login success, redirecting...')
                  this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                  this.loading = false
                })
                .catch((error) => {
                  console.error('Login action failed:', error)
                  this.$message.error('登录失败，请稍后重试')
                  this.loading = false
                })
            } else {
              console.log('Login failed: Invalid credentials')
              this.$message.error('用户名或密码错误')
              this.loading = false
            }
          }, 1000) // Simulate network delay
          // --- End of mock/actual API call ---
          // --- 模拟/实际API调用结束 ---
        } else {
          console.log('Login form validation failed!')
          return false
        }
      })
    },

    // Method to handle Reset Password submission
    // 处理重置密码提交
    handleResetPassword() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          console.log('Reset Password Form Data:', this.resetForm)
          // --- Frontend Only Logic ---
          // --- 仅前端逻辑 ---
          // Here you would typically call an API to send a reset link/code
          // For now, just show a success message
          this.$message.success('密码重置成功')
          // Optionally send email via a backend service if needed in future
          // e.g., axios.post('/api/password/reset-request', this.resetForm)...
          this.resetPasswordDialogVisible = false // Close dialog on success
          // --- End Frontend Only Logic ---
          // --- 仅前端逻辑结束 ---
        } else {
          console.log('Reset password form validation failed!')
          this.$message.error('请检查输入项是否正确')
          return false
        }
      })
    },

    // Method to handle Registration submission
    // 处理注册提交
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          console.log('Registration Form Data:', this.registerForm)
          // --- Frontend Only Logic ---
          // Here you would typically call an API to register the user
          // For now, just show a success message
          this.$message.success('注册成功')
          // Optionally call backend API:
          // e.g., axios.post('/api/register', this.registerForm)...
          this.registerDialogVisible = false // Close dialog on success
          // --- End Frontend Only Logic ---
        } else {
          console.log('Registration form validation failed!')
          this.$message.error('请检查输入项是否正确')
          return false
        }
      })
    },

    // Utility method from original code
    // 从原始代码继承的工具方法
    // 从原始代码继承的工具方法
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() { ... } // Keep if needed
    // 二维码扫描后的处理（保留如果需要）
  }
}
</script>

<!-- 全局样式 -->
<style lang="scss">
/* Shared styles for dialogs (can be unscoped or scoped if preferred) */
/* 对话框的共享样式（可以是全局或局部作用域） */
.custom-dialog {
  .dialog-header-icon {
      text-align: center;
      margin-bottom: 20px;
      .icon-large {
        font-size: 3em;
        color: #f56c6c;
      }
  }
  .el-dialog__header {
    border-top: 4px solid #f56c6c;
    border-bottom: 1px solid #eee;
    padding: 15px 20px;
    .el-dialog__title {
      font-weight: bold;
      font-size: 18px;
    }
  }
}

/* 重置密码对话框样式 */
.reset-password-dialog {
  .el-dialog__header {
    border-top-color: #e6a23c; /* 黄色 */
  }
}
.reset-password-dialog {
  .dialog-header-icon {
      .icon-large {
        font-size: 3em;
        color: #e6a23c;
      }
  }
}
/* 用户注册对话框样式 */
.user-register-dialog {
  .el-dialog__header {
    border-top-color: #67c23a; /* 绿色 */
  }
}
.user-register-dialog{
  .dialog-header-icon {
      .icon-large {
        font-size: 3em;
        color: #67c23a;
      }
  }
}
  .el-dialog__body {
    padding: 20px 30px 10px 30px; // Adjust padding
  }
   .el-dialog__footer {
     border-top: 1px solid #eee;
     padding: 15px 20px;
     text-align: right; // Ensure buttons are on the right
   }

  .dialog-header-icon {
      text-align: center;
      margin-bottom: 20px; // Space below icon
      .icon-large {
        font-size: 3em; // Make icon bigger
        color: #409EFF; // Use Element UI primary color or custom
      }
  }

  .dialog-form {
    .el-form-item {
      margin-bottom: 22px; // Standard spacing
    }
    .el-input {
        width: 100%; // Make inputs fill the space
    }
    .el-form-item__label {
        font-weight: 500; // Slightly bolder labels
    }
  }

/* Original unscoped styles (keep as they are) */
/* Fix input background and cursor color issues */
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* Reset element-ui css for login form */
/* 重置element-ui的登录表单样式 */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<!-- 组件私有样式 -->
<style lang="scss" scoped>
// Original scoped styles (keep most, adjust where needed)
// 原始作用域样式（保留大部分，按需调整）
.version-info {
  position: fixed; // Keep it fixed at the bottom
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255,0.25); // Slightly more visible
  letter-spacing: 0.5px;
}

$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100vh; // Use vh for full height
  width: 100%;
  background-color: $bg;
  overflow: hidden; // Prevent scrollbars on the container itself

  .login-form {
    position: relative;
    width: 520px;
    max-width: 95%; // Better responsiveness on small screens
    padding: 120px 35px 0; // Reduced top padding slightly
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-bottom: 15px; // Reduced margin
    padding: 10px;       // Reduced padding
    background: rgba(255, 255, 255, 0.08);
    border-radius: 5px;

    span {
      font-size: 14px; // Slightly smaller
      letter-spacing: 0.5px;
      color: $dark_gray;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-bottom: 30px; // Add space below title/links

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 20px auto; // Space below title
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  // Removed thirdparty button styles as it's commented out
  // @media only screen and (max-width: 470px) { ... }
}

// Style overrides for dialogs within the scoped context if needed
// Example:
// ::v-deep .custom-dialog .el-dialog__title {
//    color: red; // Use ::v-deep or /deep/ or >>> for scoped styles affecting child components
// }
</style>
