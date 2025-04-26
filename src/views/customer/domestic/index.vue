<template>
  <div class="customer-domestic">
    <el-card>
      <div slot="header" class="clearfix">
        <span>境内客户管理</span>
        <div style="float: right; display: flex; flex-wrap: wrap; gap: 10px;">
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
        <el-table-column prop="name" label="客户姓名" sortable="custom" width="120" align="center" />
        <el-table-column prop="phone" label="电话" width="130" align="center" />
        <el-table-column prop="province" label="省份" sortable="custom" width="110" align="center" />
        <el-table-column prop="city" label="市" sortable="custom" width="110" align="center" />
        <el-table-column prop="gender" label="性别" sortable="custom" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.gender === '男' ? 'primary' : 'danger'">{{ scope.row.gender }}</el-tag>
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
            <el-button size="mini" type="danger" @click="deleteCustomer(scope.row.id)">删除</el-button>
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
      <el-form v-if="dialogVisible" ref="customerForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="例如：A1B2C3D4" />
        </el-form-item>
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="输入客户中文姓名" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="例如：13812345678" />
        </el-form-item>
        <el-form-item label="省/市" prop="provinceCity">
          <el-cascader
            v-model="form.provinceCity"
            :options="provinceCityOptions"
            placeholder="请选择省/市"
            clearable
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%;">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
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
  getDomesticCustomers,
  addDomesticCustomer,
  updateDomesticCustomer,
  deleteDomesticCustomer
} from '@/api/customer-domestic' // Ensure this path is correct
import { parseTime } from '@/utils' // Assuming you have this utility
// Import province/city data - **You need to provide this data source**
// Example: import { regionData } from 'element-china-area-data' // If using this library
// Or define your own structure
// For demonstration, using a simplified placeholder:
const simplifiedProvinceCityData = [
  { value: '广东省', label: '广东省', children: [{ value: '广州市', label: '广州市' }, { value: '深圳市', label: '深圳市' }, { value: '珠海市', label: '珠海市' }] },
  { value: '北京市', label: '北京市', children: [{ value: '北京市', label: '北京市' }] },
  { value: '上海市', label: '上海市', children: [{ value: '上海市', label: '上海市' }] },
  { value: '浙江省', label: '浙江省', children: [{ value: '杭州市', label: '杭州市' }, { value: '宁波市', label: '宁波市' }] }
  // ... Add more provinces and cities as needed
]

export default {
  name: 'CustomerDomestic',
  filters: {
    parseTime // Use the existing parseTime filter
  }, // Changed name
  data() {
    // Custom validator for Cascader
    const validateProvinceCity = (rule, value, callback) => {
      // `value` will be an array like ['广东省', '广州市'] from el-cascader
      if (!value || value.length === 0) {
        callback(new Error('请选择省/市'))
      } else {
        callback()
      }
    }
    return {
      customers: [],
      total: 0,
      listLoading: true,
      saveLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '-id',
        searchKey: undefined,
        searchValue: undefined,
        // provinceCityFilter: [], // For potential filtering via cascader
        province: undefined, // Separate params for API query if needed
        city: undefined
      },
      dialogVisible: false,
      dialogType: 'new',
      dialogTitle: '新增客户',
      form: { // Reset form structure
        id: null,
        orderNo: '',
        name: '',
        phone: '',
        provinceCity: [], // For el-cascader binding
        province: '', // Will be populated from provinceCity
        city: '', // Will be populated from provinceCity
        gender: '',
        totalAmount: null,
        orderCount: null,
        firstOrderTime: null
      },
      provinceCityOptions: simplifiedProvinceCityData, // Assign province/city data
      rules: {
        orderNo: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
        provinceCity: [{ required: true, validator: validateProvinceCity, trigger: 'change' }], // Use custom validator
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        totalAmount: [{ required: true, message: '请输入下单总金额', trigger: 'blur' }, { type: 'number', message: '总金额必须为数字值' }],
        orderCount: [{ required: true, message: '请输入下单次数', trigger: 'blur' }, { type: 'integer', message: '下单次数必须为整数' }],
        firstOrderTime: [{ required: true, message: '请选择初次下单时间', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchCustomers()
  },
  methods: {
    fetchCustomers() {
      this.listLoading = true
      // Prepare query params - extract from provinceCityFilter if used
      // let query = {...this.listQuery};
      // if (query.provinceCityFilter && query.provinceCityFilter.length > 0) {
      //   query.province = query.provinceCityFilter[0];
      //   query.city = query.provinceCityFilter[1] || undefined;
      // }
      // delete query.provinceCityFilter; // Remove the array from the actual API call params

      getDomesticCustomers(this.listQuery).then(res => {
        this.customers = res.data.items || []
        this.total = res.data.total || 0
        this.listLoading = false
      }).catch(error => {
        console.error('Error fetching domestic customers:', error)
        this.$message.error('加载客户列表失败')
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchCustomers()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop) {
        this.listQuery.sort = (order === 'ascending' ? '+' : '-') + prop
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
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
      this.form = {
        id: null,
        orderNo: '',
        name: '',
        phone: '',
        provinceCity: [], // Reset cascader value
        province: '',
        city: '',
        gender: '',
        totalAmount: null,
        orderCount: null,
        firstOrderTime: null
      }
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
      this.resetForm()
      this.form = Object.assign({}, row)
      // Reconstruct provinceCity array for cascader from separate province/city fields
      this.form.provinceCity = [row.province || '', row.city || '']
      this.form.totalAmount = Number(row.totalAmount)
      this.form.orderCount = Number(row.orderCount)
      this.dialogType = 'edit'
      this.dialogTitle = '编辑客户'
      this.dialogVisible = true
    },
    saveCustomer() {
      this.$refs.customerForm.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          // Prepare data to send - extract province/city from array
          const dataToSend = { ...this.form }
          if (dataToSend.provinceCity && dataToSend.provinceCity.length > 0) {
            dataToSend.province = dataToSend.provinceCity[0]
            dataToSend.city = dataToSend.provinceCity[1] || ''
          }
          // delete dataToSend.provinceCity; // Remove array before sending if API expects separate fields

          const action = this.dialogType === 'new' ? addDomesticCustomer : updateDomesticCustomer
          action(dataToSend).then(() => { // Send prepared data
            this.$message.success(this.dialogType === 'new' ? '添加成功' : '更新成功')
            this.dialogVisible = false
            this.fetchCustomers()
          }).catch(error => {
            console.error('Error saving domestic customer:', error)
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
        this.deleteCustomer(id)
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },

    deleteCustomer(id) {
      this.listLoading = true
      deleteDomesticCustomer(id).then(() => {
        this.$message.success('删除成功')
        this.fetchCustomers() // 重新加载数据
      }).catch(error => {
        console.error('删除客户失败:', error)
        this.$message.error('删除失败')
      }).finally(() => {
        this.listLoading = false // 确保无论成功失败都关闭加载状态
      })
    }
  }
}
</script>

<style scoped>
.customer-domestic {
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
.el-input-number {
  width: 100%; /* Ensure input number takes full width */
}
.el-cascader {
   width: 100%; /* Ensure cascader takes full width */
}
</style>
