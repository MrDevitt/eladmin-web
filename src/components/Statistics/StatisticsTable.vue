<template>
  <el-table :data="tableData" style="width: 100%" show-summary>
    <el-table-column v-for="(config,index) in tableColumns" :key="index" :prop="config.prop" :label="config.label"
                     :sortable="config.sortable"
    />
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    tableColumns: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  mounted() {
    console.log(this)
  }
}
</script>
