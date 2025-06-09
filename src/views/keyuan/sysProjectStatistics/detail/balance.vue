<template>
  <div class="app-container">
    <div class="filter-container">
      <label class="item-label">数据截止时间</label>
      <el-select
        v-model="selectedMonth"
        placeholder="选择月份"
        style="width: 200px; margin-bottom: 20px"
        @change="handleMonthChange"
      >
        <el-option
          v-for="month in monthOptions"
          :key="month.value"
          :label="month.label"
          :value="month.value"
        />
      </el-select>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        size="mini"
        type="warning"
        icon="el-icon-download"
        style="width: 100px; margin-bottom: 20px; margin-left: 20px"
        @click="doExport"
      >导出</el-button>
    </div>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="card-header">
        <span>部门余额表</span>
      </div>
      <balance-table :v-if="balanceData.departmentRows" :balance-table-data="balanceData.departmentRows"/>
    </el-card>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="card-header">
        <span>业务人余额表</span>
      </div>
      <balance-table :v-if="balanceData.personRows" :balance-table-data="balanceData.personRows" first-column-name="业务人"/>
    </el-card>
  </div>
</template>

<script>
import BalanceTable from '@/components/Statistics/BalanceTable'
import { getSysProjectBalance } from '@/api/keyuan/sysProjectStatistics'
import { cloneDeep } from 'lodash'
import { download } from '@/api/data'
import { downloadFile } from '@/utils/index'

export default {
  name: 'Balance',
  components: { BalanceTable },
  data() {
    return {
      balanceData: {},
      monthOptions: [
        { label: '一月', value: 1 },
        { label: '二月', value: 2 },
        { label: '三月', value: 3 },
        { label: '四月', value: 4 },
        { label: '五月', value: 5 },
        { label: '六月', value: 6 },
        { label: '七月', value: 7 },
        { label: '八月', value: 8 },
        { label: '九月', value: 9 },
        { label: '十月', value: 10 },
        { label: '十一月', value: 11 },
        { label: '十二月', value: 12 }
      ],
      selectedMonth: null, downloadLoading: false
    }
  },
  async created() {
    this.selectedMonth = new Date().getMonth() + 1
    getSysProjectBalance(this.selectedMonth).then(res => {
      this.balanceData = cloneDeep(res)
    })
  },
  methods: {
    handleMonthChange() {
      getSysProjectBalance(this.selectedMonth).then(res => {
        this.balanceData = cloneDeep(res)
      })
    },
    doExport() {
      this.downloadLoading = true
      download('/api/sysProjectStatistics/balance/download', { 'month': this.selectedMonth }).then(result => {
        downloadFile(result, '余额表数据', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card-header {
  text-align: center;
  color: dodgerblue;
  font-size: medium;
  font-weight: normal;
}

.filter-container {
  display: flex;
  justify-content: flex-start;
  padding: 20px 0;
}

.item-label {
  margin: 0 3px 9px 0;
  display: inline-block;
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 30.5px;
  padding: 0 7px 0 7px;
}
</style>
