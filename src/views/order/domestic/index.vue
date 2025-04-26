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
      <el-table-column label="订单编号" prop="orderNumber" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" prop="customerName" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份" prop="province" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" prop="city" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender" width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.gender === '男' ? 'primary' : 'danger'">{{ row.gender }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="服务名称" prop="serviceName" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.serviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="amount" width="120px" align="center">
        <template slot-scope="{row}">
          <span>¥{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="orderTime" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orderTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="游客人数" prop="visitorCount" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visitorCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="游客姓名" prop="visitorNames" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visitorNames.join(', ') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" prop="paymentTime" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.paymentTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
      <el-table-column label="修改时间" prop="modifyTime" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifyTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
          <el-input v-model="temp.customerName" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-select
            v-model="temp.province"
            filterable
            placeholder="请选择省份"
            style="width: 300px;"
            @change="temp.city = ''"
          >
            <el-option
              v-for="province in provinceOptions"
              :key="province"
              :label="province"
              :value="province"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-select v-model="temp.city" filterable :disabled="!temp.province" placeholder="请选择城市" style="width: 300px;">
            <el-option
              v-for="city in cityOptions[temp.province] || []"
              :key="city"
              :label="city"
              :value="city"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" style="width: 300px;">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务项目" prop="serviceName">
          <el-input v-model="temp.serviceName" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model.number="temp.amount" type="number" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="下单时间" prop="orderTime">
          <el-date-picker
            v-model="temp.orderTime"
            type="datetime"
            placeholder="选择下单时间"
            value-format="timestamp"
            style="width: 300px;"
          />
        </el-form-item>
        <el-form-item label="支付时间" prop="paymentTime">
          <el-date-picker
            v-model="temp.paymentTime"
            type="datetime"
            placeholder="选择支付时间"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="游客信息">
          <div style="display: flex; gap: 10px; align-items: center; width: 100%;">
            <el-input-number
              v-model="temp.visitorCount"
              :min="1"
              :max="10"
              label="游客人数"
              style="min-width: 180px;"
            />
            <el-select
              v-model="temp.visitorNames"
              multiple
              filterable
              allow-create
              placeholder="请输入游客姓名"
              style="flex: 1; min-width: 200px;"
            />
          </div>
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
import { fetchList, createOrder, updateOrder } from '@/api/domestic'
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
      provinceOptions: ['北京市', '上海市', '江苏省', '浙江省', '广东省'],
      cityOptions: {
        '北京市': ['东城区', '西城区', '朝阳区', '海淀区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区'],
        '江苏省': ['南京市', '苏州市', '无锡市', '常州市'],
        '浙江省': ['杭州市', '宁波市', '温州市', '绍兴市'],
        '广东省': ['广州市', '深圳市', '珠海市', '东莞市']
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
        serviceName: [{ required: true, message: '请选择服务项目', trigger: 'change' }],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        orderTime: [{ type: 'date', required: true, message: '请选择下单时间', trigger: 'change' }],
        visitorCount: [
          { required: true, message: '请输入游客人数', trigger: 'blur' },
          { type: 'number', min: 1, message: '至少1位游客' }
        ],
        visitorNames: [
          { type: 'array', required: true, message: '请至少输入一个游客姓名', trigger: 'change' },
          { validator: (rule, value, callback) => value.length > 0 ? callback() : callback(new Error('请至少输入一个游客姓名')) }
        ]
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
        visitorNames: [],
        orderTime: Date.now(), // 添加当前时间戳作为
        paymentTime: Date.now() // 新增支付时间默认值
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

          // 处理空游客姓名的情况
          if (this.temp.visitorNames.length === 0) {
            this.temp.visitorNames.push('未命名游客')
          }

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
      this.$confirm('确定要删除这条订单记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
        this.$notify({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
