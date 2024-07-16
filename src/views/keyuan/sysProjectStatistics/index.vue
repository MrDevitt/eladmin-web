<template>
  <div v-if="statisticsObtained" class="dashboard-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="card-header">
        <span>业务量总指标</span>
      </div>
      <panel-group :show-data="contractTotalData"/>
      <el-row :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <category :chart-option="contractChartOption"/>
        </div>
      </el-row>
      <el-row>
        <el-tabs type="border-card">
          <el-tab-pane v-for="(item, index) in statisticsData.contractByRegionTableList" :key="index"
                       :label="item.label"
          >
            <statistics-table :table-data="item.data" :table-columns="item.columns"/>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row>
        <el-tabs type="border-card">
          <el-tab-pane v-for="(item, index) in statisticsData.contractByPersonTableList" :key="index"
                       :label="item.label"
          >
            <statistics-table :table-data="item.data" :table-columns="item.columns"/>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="card-header">
        <span>收款总指标</span>
      </div>
      <panel-group :show-data="receiveTotalData"/>
      <el-row :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <category :chart-option="receiveChartOption"/>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import PanelGroup from '../../dashboard/PanelGroup'
import { getStatistics } from '@/api/keyuan/sysProjectDetail'
import Category from '@/components/Echarts/Category'
import StatisticsTable from '@/components/Statistics/StatisticsTable'

export default {
  name: 'SysProjectStatistics',
  components: {
    StatisticsTable,
    Category,
    PanelGroup
  },
  data() {
    return {
      contractChartOption: null,
      contractTotalData: [
        { text: '检测', value: 0, duration: 2600, icon: 'money' },
        { text: '监理', value: 0, duration: 3000, icon: 'money' },
        { text: '设计', value: 0, duration: 3200, icon: 'money' },
        { text: '其他', value: 0, duration: 3600, icon: 'money' }
      ],
      receiveChartOption: null,
      receiveTotalData: [
        { text: '检测', value: 0, duration: 2600, icon: 'money' },
        { text: '监理', value: 0, duration: 3000, icon: 'money' },
        { text: '设计', value: 0, duration: 3200, icon: 'money' },
        { text: '其他', value: 0, duration: 3600, icon: 'money' }
      ], statisticsObtained: false,
      contractRegionTables: {},
      statisticsData: {}
    }
  },
  mounted() {
    getStatistics().then(res => {
      console.log(res)
      this.statisticsData = JSON.parse(JSON.stringify(res))
      for (const data of this.contractTotalData) {
        const newValue = res.contractTotalByType[data.text]
        if (!isNaN(newValue) && newValue !== undefined && newValue !== null) {
          data.value = res.contractTotalByType[data.text]
        }
      }
      for (const data of this.receiveTotalData) {
        const newValue = res.receiveTotalByType[data.text]
        if (!isNaN(newValue) && newValue !== undefined && newValue !== null) {
          data.value = res.receiveTotalByType[data.text]
        }
      }
      const contractOption = JSON.parse(JSON.stringify(res.contractChartOption))
      contractOption.baseOption = this.mergeBaseOption(contractOption.baseOption)
      this.contractChartOption = contractOption

      const receiveOption = JSON.parse(JSON.stringify(res.receiveChartOption))
      receiveOption.baseOption = this.mergeBaseOption(receiveOption.baseOption)
      this.receiveChartOption = receiveOption
      this.statisticsObtained = true
    })
  },
  methods: {
    handleSetLineChartData(type) {
    },
    mergeBaseOption(newOption) {
      const option = {
        title: {
          subtext: '数据来自项目明细'
        },
        tooltip: {},
        calculable: true,
        grid: {
          top: 80,
          bottom: 100,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
                formatter: function(params) {
                  return params.value.replace('\n', '')
                }
              }
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45
            },
            data: [
              '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
              '九月', '十月', '十一月', '十二月'
            ],
            splitLine: { show: false }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '总额（元）'
          }
        ]
      }
      return Object.assign(option, newOption)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.card-header {
  text-align: center;
  color: dodgerblue;
  font-size: x-large;
}
</style>
