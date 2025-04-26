<template>
  <div class="chart-container">
    <div ref="chart" style="height: 100%; width: 100%;" />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Baifen',
  data() {
    return {
      chart: null,
      chartData: {
        currentYear: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        lastYear: [100, 120, 110, 115, 85, 195, 180, 160, 170, 210, 250, 300]
      }
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart)

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            return `${params[0].name}<br/>
              ${params[0].marker} ${params[0].seriesName}: ${params[0].value}人<br/>
              ${params[1].marker} ${params[1].seriesName}: ${params[1].value}人`
          }
        },
        legend: {
          data: ['2023年', '2022年'],
          top: 'bottom'
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 人'
          }
        },
        series: [
          {
            name: '2023年',
            type: 'bar',
            data: this.chartData.currentYear,
            itemStyle: {
              color: '#5470C6'
            },
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: '2022年',
            type: 'bar',
            data: this.chartData.lastYear,
            itemStyle: {
              color: '#91CC75'
            },
            emphasis: {
              focus: 'series'
            }
          }
        ],
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        }
      }

      this.chart.setOption(option)
    },
    handleResize() {
      this.chart && this.chart.resize()
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
