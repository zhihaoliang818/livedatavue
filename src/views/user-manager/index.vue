<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 0 0; background: none; border-radius: 8px; margin-bottom: 10px;">
      <!-- <el-input v-model="listQuery.account" placeholder="账号" style="width: 200px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.email" placeholder="邮箱" style="width: 200px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-right: 10px;" @click="handleFilter">
        搜索
      </el-button> -->
      <el-button
        class="filter-item"
        style="height: 40px; border-radius: 6px; padding: 0 20px; background: linear-gradient(135deg, #67c23a, #529b2e); border: none; box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);"
        type="success"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增用户
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" prop="account" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.gender === 'female' ? 'danger' : (row.gender === 'male' ? 'primary' : 'info')">
            {{ formatGender(row.gender) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新增时间" prop="createdAt" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updatedAt" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="tempUser" label-position="left" label-width="80px" style="width: 400px; margin-left:20px;">
        <el-form-item label="账号" prop="account">
          <el-input v-model="tempUser.account" placeholder="请输入账号" :disabled="dialogStatus==='update'" /> </el-form-item>
        <el-form-item :label="dialogStatus==='create' ? '密码' : '新密码'" prop="password">
          <el-input v-model="tempUser.password" type="password" :placeholder="dialogStatus==='create' ? '请输入密码' : '留空则不修改密码'" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="tempUser.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="tempUser.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="tempUser.gender" placeholder="请选择性别" style="width: 100%;">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="tempUser.address" type="textarea" :rows="2" placeholder="请输入地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createUser, updateUser, deleteUser } from '@/api/user-manager' // Use user-manager API
import waves from '@/directive/waves' // optional directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'UserManager', // Changed component name
  components: { Pagination },
  directives: { waves },
  filters: {
    // Optional filter if you need specific formatting beyond parseTime
  },
  data() {
    // Email validation rule
    const validateEmail = (rule, value, callback) => {
      if (!value && rule.required) {
        return callback(new Error('请输入邮箱'))
      }
      if (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          callback(new Error('请输入有效的邮箱地址'))
        } else {
          callback()
        }
      } else {
        callback() // Allow empty if not required
      }
    }

    // Password validation for creation
    const validatePasswordCreate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        // Add password confirmation logic if needed
        // if (this.tempUser.passwordConfirm !== '') {
        //   this.$refs.dataForm.validateField('passwordConfirm');
        // }
        callback()
      }
    }

    // Password validation for update (optional)
    const validatePasswordUpdate = (rule, value, callback) => {
      if (value && value.length < 6) {
        callback(new Error('新密码不能少于6位'))
      } else {
        callback()
      }
    }

    // Password confirmation validation (if used)
    // const validatePasswordConfirm = (rule, value, callback) => {
    //   if (this.dialogStatus === 'create' && !value) {
    //     callback(new Error('请再次输入密码'));
    //   } else if (value !== this.tempUser.password) {
    //     callback(new Error('两次输入的密码不一致!'));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        account: undefined,
        name: undefined,
        email: undefined,
        sort: '-id' // 默认从大到小排序
      },
      // User data model for the form
      tempUser: {
        id: undefined,
        account: '',
        password: '', // For create/update input
        // passwordConfirm: '', // Optional confirmation field
        email: '',
        name: '',
        gender: '', // Use 'male', 'female', 'other'
        address: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      // Form validation rules
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        // Use different password rules for create and update
        password: [
          { validator: (rule, value, callback) => {
            if (this.dialogStatus === 'create') {
              validatePasswordCreate(rule, value, callback)
            } else {
              validatePasswordUpdate(rule, value, callback)
            }
          }, trigger: ['blur', 'change'] }
          // Add confirmation rule if using the field
          // { validator: validatePasswordConfirm, trigger: 'blur', field: 'passwordConfirm'}
        ],
        // passwordConfirm: [ // Add confirmation rule if using the field
        //   { validator: validatePasswordConfirm, trigger: 'blur' }
        // ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        address: [{ required: false, message: '请输入地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        // Add error handling if needed
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
      // Add sorting for other columns if needed
    },
    sortByID(order) {
      this.listQuery.sort = order === 'ascending' ? '+id' : '-id'
      this.handleFilter()
    },
    resetTempUser() {
      this.tempUser = {
        id: undefined,
        account: '',
        password: '',
        // passwordConfirm: '',
        email: '',
        name: '',
        gender: '',
        address: ''
      }
    },
    handleCreate() {
      this.resetTempUser()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // In a real app, hash the password client-side ONLY if absolutely necessary,
          // prefer server-side hashing. For mock, we send plain text.
          createUser(this.tempUser).then((response) => {
            // Assuming API returns the created user object in response.data
            this.list.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '用户创建成功',
              type: 'success',
              duration: 2000
            })
            this.total += 1 // Increment total count
          }).catch(error => {
            // Handle API errors (e.g., duplicate account)
            this.$message.error(`创建失败: ${error.message || '请稍后重试'}`)
          })
        }
      })
    },
    handleUpdate(row) {
      // Copy row data, but don't copy password hash
      this.tempUser = Object.assign({}, row, { password: ''/*, passwordConfirm: ''*/ }) // Use spread or Object.assign
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // Prepare data, exclude password if empty
          const tempData = Object.assign({}, this.tempUser)
          if (!tempData.password) {
            delete tempData.password // Don't send empty password for update
          }
          // delete tempData.passwordConfirm; // Remove confirmation field before sending

          updateUser(tempData).then((response) => {
            // Find index and update list, response.data should be the updated user
            const index = this.list.findIndex(v => v.id === this.tempUser.id)
            if (index !== -1) {
              this.list.splice(index, 1, response.data)
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '用户信息更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(error => {
            this.$message.error(`更新失败: ${error.message || '请稍后重试'}`)
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm(`确定要删除用户 "${row.name}" (账号: ${row.account}) 吗?`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true // Show loading indicator during delete
        deleteUser(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1) // Remove from list on success
          this.total -= 1 // Decrement total count
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
          this.$message.error(`删除失败: ${error.message || '请稍后重试'}`)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // Helper to get sorting class for table headers
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : (sort === `-${key}` ? 'descending' : '')
    },
    // Helper to format gender display
    formatGender(gender) {
      switch (gender) {
        case 'male': return '男'
        case 'female': return '女'
        case 'other': return '其他'
        default: return gender
      }
    }
  }
}
</script>

  <style scoped>
  .filter-container {
    padding-bottom: 10px;
  }
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
  /* Add other styles if needed */
  </style>
