<template>
  <div class="customer-international">
    <el-card>
      <div slot="header" class="clearfix">
        <span>境外客户管理</span>
        <div style="float: right; display: flex; gap: 10px;">
          <el-input
            v-model="listQuery.searchValue"
            placeholder="搜索客户..."
            clearable
            style="width: 200px;"
            @keyup.enter.native="handleFilter"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleFilter" />
          </el-input>
          <el-button type="primary" icon="el-icon-plus" @click="openDialog()">新增客户</el-button>
        </div>
      </div>

      <el-table
        v-loading="listLoading"
        :data="customers"
        style="width: 100%"
        border
        fit
        highlight-current-row
        :default-sort="{prop: 'id', order: 'descending'}"
        @sort-change="sortChange"
      >
        <el-table-column prop="id" label="ID" sortable="custom" width="80" align="center" />
        <el-table-column prop="orderNo" label="订单编号" sortable="custom" width="130" align="center" />
        <el-table-column prop="name" label="客户姓名" sortable="custom" width="150" align="center" />
        <el-table-column prop="phone" label="电话" width="160" align="center" />
        <el-table-column prop="country" label="国别" sortable="custom" width="90" align="center" />
        <el-table-column prop="gender" label="性别" sortable="custom" width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.gender === 'Male' ? 'primary' : 'warning'">{{ scope.row.gender }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="下单总金额" sortable="custom" width="140" align="center">
          <template slot-scope="scope">
            <span>¥{{ scope.row.totalAmount ? scope.row.totalAmount.toFixed(2) : '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderCount" label="下单次数" sortable="custom" width="110" align="center" />
        <el-table-column prop="firstOrderTime" label="初次下单时间" sortable="custom" width="170" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.firstOrderTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actions" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="editCustomer(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteCustomer(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    </el-card>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="customerForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="例如：A1B2C3D4" />
        </el-form-item>
        <el-form-item label="下单客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="输入客户姓名" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="例如：+1-555-123-4567" />
        </el-form-item>
        <el-form-item label="国别" prop="country">
          <el-select v-model="form.country" filterable placeholder="选择或输入国别代码">
            <el-option
              v-for="code in countryCodes"
              :key="code"
              :label="code"
              :value="code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="Male" value="Male" />
            <el-option label="Female" value="Female" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单总金额" prop="totalAmount">
          <el-input v-model.number="form.totalAmount" type="number" placeholder="例如：1234.50">
            <template slot="prepend">¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="下单次数" prop="orderCount">
          <el-input-number v-model="form.orderCount" :min="0" controls-position="right" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="初次下单时间" prop="firstOrderTime">
          <el-date-picker
            v-model="form.firstOrderTime"
            type="datetime"
            placeholder="选择日期和时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="saveCustomer">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getInternationalCustomers,
  addInternationalCustomer,
  updateInternationalCustomer
} from '@/api/customer-international' // Ensure this path is correct

// Define country codes for the dropdown (optional)
const countryCodesList = ['US', 'GB', 'JP', 'KR', 'FR', 'DE', 'CA', 'AU', 'SG', 'CH', 'Other']

export default {
  name: 'CustomerInternational',
  filters: {
    // Keep the parseTime filter as it is likely used elsewhere or useful
    parseTime(time, cFormat) {
      if (arguments.length === 0 || !time) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string')) {
          if ((/^[0-9]+$/.test(time))) {
            // support "1548221490638"
            time = parseInt(time)
          } else {
            // support safari
            // Fixed: Replace '-' with '/' for cross-browser compatibility
            time = time.replace(new RegExp(/-/gm), '/')
          }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        return value.toString().padStart(2, '0')
      })
      return time_str
    }
  }, // Changed name
  data() {
    return {
      customers: [],
      total: 0, // For pagination
      listLoading: true,
      saveLoading: false, // Loading state for save button
      listQuery: {
        page: 1,
        limit: 10, // Default items per page
        sort: '-id', // Default sort by ID descending
        searchKey: undefined, // Add if needed for specific field search
        searchValue: undefined
      },
      dialogVisible: false,
      dialogType: 'new', // 'new' or 'edit'
      dialogTitle: '新增客户',
      form: { // Reset form structure
        id: null,
        orderNo: '',
        name: '',
        phone: '',
        country: '',
        gender: '',
        totalAmount: null, // Use null for number inputs initially
        orderCount: null, // Use null for number inputs initially
        firstOrderTime: null // Use null for date picker initially
      },
      rules: { // Basic validation rules (customize as needed)
        orderNo: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
        country: [{ required: true, message: '请选择或输入国别', trigger: 'change' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        totalAmount: [{ required: true, message: '请输入下单总金额', trigger: 'blur' }, { type: 'number', message: '总金额必须为数字值' }],
        orderCount: [{ required: true, message: '请输入下单次数', trigger: 'blur' }, { type: 'integer', message: '下单次数必须为整数' }],
        firstOrderTime: [{ required: true, message: '请选择初次下单时间', trigger: 'change' }]
      },
      countryCodes: countryCodesList // Make codes available in template
    }
  },
  created() {
    this.fetchCustomers()
  },
  methods: {
    fetchCustomers() {
      this.listLoading = true
      getInternationalCustomers(this.listQuery).then(res => {
        this.customers = res.data.items || []
        this.total = res.data.total || 0
        this.listLoading = false
      }).catch(error => {
        console.error('Error fetching customers:', error)
        this.$message.error('加载客户列表失败')
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1 // Reset to first page on search
      this.fetchCustomers()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop) {
        this.listQuery.sort = (order === 'ascending' ? '+' : '-') + prop
      } else {
        this.listQuery.sort = '-id' // Default sort if column is unsorted
      }
      this.handleFilter() // Re-fetch data with new sort order
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.fetchCustomers()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchCustomers()
    },
    resetForm() {
      this.form = { // Reset form structure
        id: null,
        orderNo: '',
        name: '',
        phone: '',
        country: '',
        gender: '',
        totalAmount: null,
        orderCount: null,
        firstOrderTime: null
      }
      // Clear validation messages if the form ref exists
      this.$nextTick(() => {
        if (this.$refs.customerForm) {
          this.$refs.customerForm.clearValidate()
        }
      })
    },
    openDialog() {
      this.resetForm()
      this.dialogType = 'new'
      this.dialogTitle = '新增客户'
      this.dialogVisible = true
    },
    editCustomer(row) {
      this.resetForm() // Start with a clean slate
      this.form = Object.assign({}, row) // Copy row data to form
      // Ensure numbers and dates are correctly typed if needed
      this.form.totalAmount = Number(row.totalAmount)
      this.form.orderCount = Number(row.orderCount)
      // Date might already be string 'yyyy-MM-dd HH:mm:ss', which is fine for el-date-picker
      this.dialogType = 'edit'
      this.dialogTitle = '编辑客户'
      this.dialogVisible = true
    },
    saveCustomer() {
      this.$refs.customerForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const action = this.dialogType === 'new' ? addInternationalCustomer : updateInternationalCustomer
          action(this.form).then(() => {
            this.$message.success(this.dialogType === 'new' ? '添加成功' : '更新成功')
            this.dialogVisible = false
            this.fetchCustomers() // Refresh the list
          }).catch(error => {
            console.error('Error saving customer:', error)
            this.$message.error('操作失败，请稍后重试')
          }).finally(() => {
            this.saveLoading = false
          })
        } else {
          console.log('Form validation failed!')
          return false
        }
      })
    },
    confirmDeleteCustomer(id) {
      this.$confirm('确定删除该客户吗？此操作无法撤销。', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // User confirmed
        this.deleteCustomer(id)
      }).catch(() => {
        // User cancelled
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteCustomer(index) {
      this.$confirm('确定要删除这条客户记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.customers.splice(index, 1)
        this.total -= 1
        this.$notify.success('删除成功!')
      }).catch(() => {
        this.$notify({ type: 'info', message: '已取消删除' })
      }).finally(() => {
        this.listLoading = false // 确保无论成功失败都关闭加载状态
      })
    }
  }
}
</script>

<style scoped>
.customer-international { /* Changed class name */
  padding: 20px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.el-card {
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: right;
}
/* Ensure Select and DatePicker take full width in form */
.el-select {
  width: 100%;
}
.el-date-editor.el-input {
   width: 100%;
}
</style>+
