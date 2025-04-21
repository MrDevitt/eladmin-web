<template>
  <div class="app-container">
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
      <balance-table :v-if="balanceData.personRows" :balance-table-data="balanceData.personRows"
                     first-column-name="业务人"
      />
    </el-card>
  </div>
</template>

<script>
import BalanceTable from '@/components/Statistics/BalanceTable'
import { getSysProjectBalance } from '@/api/keyuan/sysProjectBalance'
import { cloneDeep } from 'lodash'

export default {
  name: 'Balance',
  components: { BalanceTable },
  data() {
    return {
      balanceData: {}
    }
  },
  async created() {
    getSysProjectBalance().then(res => {
      this.balanceData = cloneDeep(res)
    })
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
