<template>
  <div class="account-balance-container">
    <!-- 顶部筛选区 -->
    <el-card class="filter-card">
      <div class="filter-header">
        <h2>科目余额表</h2>
        <div class="date-picker">
          <date-range-picker v-model="dateRange" @change="handleDateChange" />
        </div>
      </div>
      <!-- 科目树形统计 -->
      <el-table
        :data="treeData"
        row-key="accountNumber"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        style="width: 100%"
        :default-expand-all="true"
        @row-click="handleRowClick"
      >
        <el-table-column prop="accountNumber" label="科目编号" />
        <el-table-column prop="name" label="科目名称" />
        <el-table-column prop="initialAmount" label="初始余额" :formatter="currencyFormatter" />
        <el-table-column label="期初余额" align="center">
          <el-table-column prop="beginIncome" label="收入" :formatter="currencyFormatter" />
          <el-table-column prop="beginExpense" label="支出" :formatter="currencyFormatter" />
          <el-table-column prop="beginRemain" label="结余" :formatter="currencyFormatter" />
        </el-table-column>
        <el-table-column label="本期余额" align="center">
          <el-table-column prop="currentIncome" label="收入" :formatter="currencyFormatter" />
          <el-table-column prop="currentExpense" label="支出" :formatter="currencyFormatter" />
          <el-table-column prop="currentRemain" label="结余" :formatter="currencyFormatter" />
        </el-table-column>
        <el-table-column label="期末余额" align="center">
          <el-table-column prop="endIncome" label="收入" :formatter="currencyFormatter" />
          <el-table-column prop="endExpense" label="支出" :formatter="currencyFormatter" />
          <el-table-column prop="endRemain" label="结余" :formatter="currencyFormatter" />
        </el-table-column>
      </el-table>
      <!-- 明细表格（隐藏） -->
      <el-card v-if="showDetails" class="details-card">
        <div class="details-header">
          <h3>明细 - {{ currentAccountDescription }}</h3>
          <el-button type="primary" @click="showDetails = false">关闭</el-button>
        </div>
        <el-table ref="table" :data="transactionDetails" size="small" style="width: 100%;">
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="comment" label="摘要" />
          <el-table-column prop="amount" label="金额" :formatter="currencyFormatter" />
          <el-table-column prop="direction" label="交易类型">
            <template slot-scope="scope">
              {{ ['收入','支出'][scope.row.direction] }}
            </template>
          </el-table-column>
          <el-table-column prop="accountNumber" label="科目编号" />
          <el-table-column prop="bankNumber" label="银行科目号编号" />
          <el-table-column prop="certificateNumber" label="记账凭证编号" />
          <el-table-column prop="transactionTime" label="交易时间" />
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="updateBy" label="修改人" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="updateTime" label="修改时间" />
        </el-table>
        <pagination />
      </el-card>
    </el-card>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { get, getSummary } from '@/api/keyuan/sysProjectTransaction'
import DateRangePicker from '@/components/DateRangePicker'
import { formatCurrency } from '@/api/keyuan/formatter'

export default {
  name: 'Summary',
  components: { DateRangePicker },
  setup() {
    const dateRange = ref([new Date().getFullYear() + '-01-01 00:00:00', new Date().toISOString().split('T')[0] + ' 23:59:59'])
    const treeData = ref([])
    const showDetails = ref(false)
    const currentAccountDescription = ref('')
    const transactionDetails = ref([])
    const fetchSummary = () => getSummary(dateRange.value[0], dateRange.value[1]).then(res => {
      treeData.value = res.slice()
    }).catch(e => {
      console.error('获取科目汇总失败:', e)
    })
    // 获取科目余额明细
    const fetchDetails = (accountNumber) => get({
      'accountNumber': accountNumber,
      'transactionTime': dateRange.value
    }).then(res => {
      transactionDetails.value = res.content.slice()
      currentAccountDescription.value = accountNumber
      showDetails.value = true
    }).catch(e => {
      console.error('获取科目明细失败:', e)
    })

    // 日期范围改变
    const handleDateChange = () => {
      showDetails.value = false
      fetchSummary()
    }

    // 行点击事件（仅叶子节点展开明细）
    const handleRowClick = (row) => {
      if (row.children && row.children.length > 0) {
        return // 有子节点，不展开明细
      }
      fetchDetails(row.accountNumber)
    }

    // 初始化
    onMounted(() => {
      fetchSummary()
    })

    return {
      dateRange,
      treeData,
      showDetails,
      currentAccountDescription,
      transactionDetails,
      handleDateChange,
      handleRowClick
    }
  },
  methods: {
    currencyFormatter(row, column, value) {
      return formatCurrency(value)
    }
  }
}
</script>

<style scoped>
.account-balance-container {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.date-picker {
  display: inline-block;
  margin-left: 20px;
}

.details-card {
  margin-top: 20px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
</style>
