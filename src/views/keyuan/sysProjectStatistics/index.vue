<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group :show-data="contractTotalData"/>
      <el-row :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <category :chart-option-promise="contractChartOptionPromise"/>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import PanelGroup from '../../dashboard/PanelGroup'
import { getStatistics } from '@/api/keyuan/sysProjectDetail'
import Category from '@/components/Echarts/Category'

export default {
  name: 'Dashboard',
  components: {
    Category,
    PanelGroup
  },
  data() {
    return {
      contractChartOptionPromise: getStatistics().then(res => {
        const statisticsOption = JSON.parse(JSON.stringify(res.contractChartOption))
        statisticsOption.baseOption = this.mergeBaseOption(statisticsOption.baseOption)
        // console.log(statisticsOption)
        return statisticsOption
      }),
      contractTotalData: [
        { text: '检测', value: 0, duration: 2600, icon: 'money' },
        { text: '监理', value: 0, duration: 3000, icon: 'money' },
        { text: '设计', value: 0, duration: 3200, icon: 'money' },
        { text: '其他', value: 0, duration: 3600, icon: 'money' }
      ]
    }
  },
  mounted() {
    getStatistics().then(res => {
      for (const data of this.contractTotalData) {
        const newValue = res.contractTotalByType[data.text]
        if (!isNaN(newValue) && newValue !== undefined && newValue !== null) {
          data.value = res.contractTotalByType[data.text]
        }
      }
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
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
