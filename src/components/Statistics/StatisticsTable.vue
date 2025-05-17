<template>
  <el-card class="box-card2" shadow="always">
    <div slot="header" class="card-header">
      <span>{{ title }}</span>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="(item, index) in tabTableData" :key="index" :label="item.label">
        <el-table :data="item.data" style="width: 100%" show-summary :summary-method="getSummaries" :default-sort="item.defaultSort" stripe max-height="400">
          <el-table-column v-for="(config,index2) in item.columns" :key="index2" :prop="config.prop" :label="config.label" sortable :formatter="formatCurrency"/>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  props: {
    tabTableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    title: {
      type: String,
      default: function() {
        return 'title'
      }
    }
  },
  methods: {
    formatCurrency(row, column, num) {
      if (isNaN(num)) {
        return num
      }
      num = num.toFixed(2)
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
          sums[index] = this.formatCurrency(0, 0, sums[index])
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
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
</style>
