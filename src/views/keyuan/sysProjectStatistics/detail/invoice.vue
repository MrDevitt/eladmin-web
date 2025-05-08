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
    </div>
    <el-card class="box-card" shadow="always">
      <el-table :data="invoiceData" stripe>
        <el-table-column prop="name" label="公司名"/>
        <el-table-column prop="invoiced" label="12月累计开票" :formatter="formatCurrency"/>
        <el-table-column prop="toInvoice" label="预估待开票" :formatter="formatCurrency"/>
        <el-table-column prop="remaining" label="剩余额度" :formatter="formatCurrency"/>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getSysProjectInvoice } from '@/api/keyuan/sysProjectStatistics'

export default {
  name: 'Invoice',
  data() {
    return {
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
      invoiceData: null,
      selectedMonth: null
    }
  },
  async created() {
    this.selectedMonth = new Date().getMonth() + 1
    getSysProjectInvoice(this.selectedMonth).then(res => {
      this.invoiceData = res.slice()
    })
  },
  methods: {
    handleMonthChange() {
      getSysProjectInvoice(this.selectedMonth).then(res => {
        this.invoiceData = res.slice()
      })
    },
    formatCurrency(row, column, num) {
      const str = num.toString()
      const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
      return str.replace(reg, '$1,')
    }
  }

}
</script>

<style scoped>
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
