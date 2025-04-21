<template>
  <el-table :data="balanceTableData" show-summary :summary-method="getSummaries">
    <el-table-column prop="name" :label="firstColumnName"/>
    <el-table-column label="上年结转" prop="initialBalance"/>
    <el-table-column label="检测收入">
      <el-table-column prop="examLast" label="上月累计" :formatter="formatCurrency"/>
      <el-table-column prop="examThisMonth" label="本月" :formatter="formatCurrency"/>
      <el-table-column prop="examThisYear" label="累计" :formatter="formatCurrency"/>
    </el-table-column>
    <el-table-column label="监理收入">
      <el-table-column prop="superviseLast" label="上月累计" :formatter="formatCurrency"/>
      <el-table-column prop="superviseThisMonth" label="本月" :formatter="formatCurrency"/>
      <el-table-column prop="superviseThisYear" label="累计" :formatter="formatCurrency"/>
    </el-table-column>
    <el-table-column label="设计收入">
      <el-table-column prop="designLast" label="上月累计" :formatter="formatCurrency"/>
      <el-table-column prop="designThisMonth" label="本月" :formatter="formatCurrency"/>
      <el-table-column prop="designThisYear" label="累计" :formatter="formatCurrency"/>
    </el-table-column>
    <el-table-column label="支出">
      <el-table-column prop="expenseLast" label="上月累计" :formatter="formatCurrency"/>
      <el-table-column prop="expenseThisMonth" label="本月" :formatter="formatCurrency"/>
      <el-table-column prop="expenseThisYear" label="累计" :formatter="formatCurrency"/>
    </el-table-column>
    <el-table-column label="总计">
      <el-table-column prop="sumLast" label="上月累计" :formatter="formatCurrency"/>
      <el-table-column prop="sumThisMonth" label="本月" :formatter="formatCurrency"/>
      <el-table-column prop="sumThisYear" label="累计" :formatter="formatCurrency"/>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'BalanceTable',
  props: {
    balanceTableData: {
      type: Array,
      default: null
    },
    firstColumnName: {
      type: String,
      default: '部门'
    }
  },
  methods: {
    formatCurrency(row, column, num) {
      const str = num.toString()
      const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
      return str.replace(reg, '$1,')
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = this.formatCurrency(0, 0, sums[index].toFixed(2))
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }
  }
}
</script>

<style scoped>

</style>
