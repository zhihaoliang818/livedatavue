<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 0 0; background: none; border-radius: 8px; margin-bottom: 10px;">
      <!-- <el-select
        v-model="listQuery.searchKey"
        placeholder="搜索字段"
        clearable
        class="filter-item"
        style="width: 160px; --el-border-color: #409eff;"
        popper-class="custom-select"
      >
        <el-option
          v-for="item in [
            { label: '订单编号', value: 'orderNumber' },
            { label: '客户姓名', value: 'customerName' },
            { label: '服务名称', value: 'serviceName' }
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-input
        v-model="listQuery.searchValue"
        placeholder="请输入搜索内容"
        class="filter-item"
        style="width: 280px; --el-input-border-color: #409eff; padding-left: 40px;"
        clearable
        @keyup.enter.native="handleFilter"
      >
        <template #prefix>
          <i class="el-icon-search" style="color: #909399; font-size: 16px; position: absolute; left: 45px; top: 50%; transform: translateY(-50%);" />
        </template>
      </el-input>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="height: 40px; border-radius: 6px; padding: 0 20px; background: linear-gradient(135deg, #409eff, #3375b9); border: none; box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);"
        @click="handleFilter"
      >
        <i class="el-icon-search" style="margin-right: 6px;" />
        搜索
      </el-button> -->

      <el-button
        class="filter-item"
        type="success"
        style="height: 40px; border-radius: 6px; padding: 0 20px; background: linear-gradient(135deg, #67c23a, #529b2e); border: none; box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);"
        @click="handleCreate"
      >
        <i class="el-icon-circle-plus" style="margin-right: 6px;" />
        添加订单
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
      <el-table-column label="退改订单编号" prop="amendOrderNo" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.amendOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原订单编号" prop="originalOrderNo" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.originalOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" prop="customerName" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款状态" prop="refundStatus" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.refundStatus === '已通过' ? 'success' : 'danger'">{{ row.refundStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="服务名称" prop="serviceName" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.serviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" prop="refundAmount" width="120px" align="center">
        <template slot-scope="{row}">
          <span>¥{{ row.refundAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updateTime" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="auditor" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.auditor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" prop="auditTime" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.auditTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="temp.customerName" />
        </el-form-item>
        <el-form-item label="原订单号" prop="originalOrderNo">
          <el-input v-model="temp.originalOrderNo" />
        </el-form-item>
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input v-model.number="temp.refundAmount" type="number" />
        </el-form-item>
        <el-form-item label="退款状态" prop="refundStatus">
          <el-select v-model="temp.refundStatus" class="filter-item">
            <el-option label="待审核" value="待审核" />
            <el-option label="已通过" value="已通过" />
            <el-option label="已拒绝" value="已拒绝" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务项目" prop="serviceName">
          <el-input v-model="temp.serviceName" />
        </el-form-item>
        <el-form-item label="审核人" prop="auditor">
          <el-input v-model="temp.auditor" />
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker
            v-model="temp.auditTime"
            type="datetime"
            placeholder="选择审核时间"
            value-format="timestamp"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createOrder, updateOrder } from '@/api/amendments'
import waves from '@/directive/waves'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 7,
        searchKey: undefined, // 搜索字段：orderNumber/customerName/serviceName
        searchValue: undefined, // 搜索内容
        sort: '-id'
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        originalOrderNo: [{ required: true, message: '请输入原订单号', trigger: 'blur' }],
        refundAmount: [
          { required: true, message: '请输入退款金额', trigger: 'blur' },
          { type: 'number', min: 0, message: '金额必须大于等于0' }
        ],
        refundStatus: [{ required: true, message: '请选择退款状态', trigger: 'change' }],
        serviceName: [{ required: true, message: '请选择服务项目', trigger: 'change' }],
        auditor: [{ required: true, message: '请输入审核人', trigger: 'blur' }],
        auditTime: [{ type: 'date', required: true, message: '请选择审核时间', trigger: 'change' }]
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
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
    },
    sortByID(order) {
      this.listQuery.sort = order === 'ascending' ? '+id' : '-id'
      this.handleFilter()
    },
    getSortClass(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : (sort === `-${key}` ? 'descending' : '')
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        auditor: '',
        auditTime: Date.now()
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 生成唯一ID
          this.temp.id = Date.now().toString() + Math.random().toString(36).substr(2, 5)

          createOrder({ ...this.temp }).then(() => {
            this.list.unshift({ ...this.temp })
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }).catch(error => {
            this.$message.error(`创建失败：${error.message}`)
            console.error('API Error:', error)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp)
          updateOrder(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: '订单删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    }
  }
}
</script>
