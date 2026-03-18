<template>
  <div class="account-balance-container">
    <!-- 顶部筛选区 -->
    <el-card class="filter-card">
      <div class="filter-header">
        <h2>{{ getTitle() }}</h2>
        <div class="date-picker">
          <date-range-picker v-model="dateRange" @change="handleDateChange" />
        </div>
      </div>
      <!-- 科目树形统计 -->
      <el-table
        :data="treeData"
        row-key="accountNumber"
        :expand-row-keys="getExpandKey()"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        style="width: 100%"
        :indent="8"
        @row-click="handleRowClick"
      >
        <el-table-column prop="accountNumber" label="科目编号" :min-width="100" show-overflow-tooltip />
        <el-table-column prop="name" label="科目名称" :min-width="120" show-overflow-tooltip />
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
        <el-table-column v-if="summaryType==='person'" prop="remainingShare" label="未收款提成" :formatter="currencyFormatter" />
        <el-table-column v-if="summaryType==='person'" prop="guaranteeAmount" label="担保金额" :formatter="currencyFormatter" />
      </el-table>
      <!-- 明细表格（隐藏） -->
      <el-card v-if="showDetails" class="details-card">
        <div class="details-header">
          <h3>明细 - {{ currentAccountDescription }}</h3>
          <el-button type="primary" @click="showDetails = false">关闭</el-button>
        </div>
        <sys-project-transaction :summary-crud="curd"/>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import crudSysProjectTransaction, { getSummary } from '@/api/keyuan/sysProjectTransaction'
import DateRangePicker from '@/components/DateRangePicker'
import { formatCurrency } from '@/api/keyuan/formatter'
import SysProjectTransaction from '@/views/keyuan/sysProjectTransaction/transaction'
import CRUD from '@crud/crud'

export default {
  name: 'Summary',
  components: { SysProjectTransaction, DateRangePicker },
  dicts: ['transaction_expand_key'],
  props: {
    summaryType: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      showDetails: false,
      currentAccountDescription: '',
      dateRange: [new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01 00:00:00', new Date().toISOString().split('T')[0] + ' 23:59:59'],
      curd: CRUD({
        title: '项目收支信息',
        url: 'api/sysProjectTransaction',
        idField: 'id',
        sort: 'transactionTime,desc',
        optShow: {
          download: true,
        },
        params: {
          blackListEnable: true
        },
        crudMethod: { ...crudSysProjectTransaction }}),
      treeData: []
    }
  },
  mounted() {
    this.fetchSummary()
  },
  methods: {
    currencyFormatter(row, column, value) {
      return formatCurrency(value)
    },
    handleRowClick(row) {
      if (row.children && row.children.length > 0) {
        return // 有子节点，不展开明细
      }
      this.curd.defaultQuery.accountNumber = row.accountNumber
      this.curd.query.accountNumber = row.accountNumber
      this.curd.refresh()
      this.currentAccountDescription = row.name
      this.showDetails = true
    },
    handleDateChange() {
      this.showDetails = false
      this.fetchSummary()
    },
    fetchSummary() {
      this.curd.defaultQuery.transactionTime = this.dateRange
      this.curd.query.transactionTime = this.dateRange
      getSummary(this.dateRange[0], this.dateRange[1], this.summaryType).then(res => {
        this.treeData = res.slice()
      }).catch(e => {
        console.error('获取科目汇总失败:', e)
      })
    },
    getTitle() {
      if (this.summaryType === 'person') {
        return '业务人余额表'
      }
      if (this.summaryType === 'dept') {
        return '部门余额表'
      }
      if (this.summaryType === 'branch') {
        return '分公司余额表'
      }
      return '科目余额表'
    },
    getExpandKey() {
      if (this.summaryType === 'person') {
        return ['10010103']
      }
      if (this.summaryType === 'dept') {
        return ['10010102']
      }
      if (this.summaryType === 'branch') {
        return ['10010104']
      }
      return this.dict.transaction_expand_key.map(e => e.value)
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
