<template>
  <div class="app-container">
    <receive-template :data-type="'notReceive'" :receive-amount-data="notReceiveAmountData" :receive-rate-data="notReceiveRateData"/>
  </div>
</template>

<script>
import { getNotReceiveData } from '@/api/keyuan/sysProjectStatistics'
import ReceiveTemplate from '@/views/keyuan/sysProjectStatistics/detail/receiveTemplate'

export default {
  name: 'ShouldReceive',
  components: { ReceiveTemplate },
  data() {
    return {
      notReceiveAmountData: [],
      notReceiveRateData: []
    }
  },
  async created() {
    getNotReceiveData().then(res => {
      this.notReceiveAmountData = res.receiveAmountRows.slice()
      this.notReceiveRateData = res.receiveRateRows.slice()
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
