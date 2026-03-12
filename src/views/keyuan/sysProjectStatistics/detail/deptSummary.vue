<template>
  <div class="head-container">
    <div>
      <Summary summary-type="dept" />
    </div>
    <div>
      <Summary summary-type="branch" />
    </div>
  </div>
</template>

<script>
import Summary from '@/views/keyuan/sysProjectTransaction/summary'

export default {
  name: 'PersonSummary',
  components: { Summary }
}
</script>

<style scoped>

</style>
