<template>
  <el-card class="box-card2" shadow="always">
    <div slot="header" class="card-header">
      <span>{{ title }}</span>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="(item, index) in tabTableData" :key="index" :label="item.label">
        <el-table :data="item.data" style="width: 100%" show-summary>
          <el-table-column v-for="(config,index2) in item.columns" :key="index2" :prop="config.prop" :label="config.label" sortable/>
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
