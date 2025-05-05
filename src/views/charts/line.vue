<template>
  <div class="chart-container">
    <div ref="chart" style="height: 100%; width: 100%;" />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
  data() {
    return {
      chart: null,
      chartData: {
        // 示例数据结构
        2023: {
          domestic: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
          overseas: [80, 72, 99, 66, 110, 70, 90, 118, 109, 66, 110, 70]
        },
        2024: {
          domestic: [150, 142, 121, 154, 100, 250, 230, 202, 211, 254, 300, 350],
          overseas: [90, 82, 109, 76, 120, 80, 100, 128, 119, 86, 120, 80]
        }
      }
    }
  },
  computed: {
    processedData() {
      const years = ['2023', '2024']
      const months = Array.from({ length: 12 }, (_, i) => `${i + 1}月`)

      return {
        xAxis: months,
        series: years.flatMap(year => [
          {
            year,
            type: 'domestic',
            data: this.chartData[year].domestic,
            total: this.chartData[year].domestic.map((v, i) => v + this.chartData[year].overseas[i])
          },
          {
            year,
            type: 'overseas',
            data: this.chartData[year].overseas,
            total: this.chartData[year].domestic.map((v, i) => v + this.chartData[year].overseas[i])
          }
        ])
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
            const month = params[0].name // Month is the same for all series at a given index
            let tooltipContent = `${month}<br/>`

            params.forEach(p => {
              const year = p.seriesName.split(' ')[0]
              const type = p.seriesName.split(' ')[1]
              // Find the total for the correct year and index
              const totalSeries = this.processedData.series.find(s => s.year === year && s.type === 'domestic')
              const total = totalSeries ? totalSeries.total[p.dataIndex] : 0

              const percent = total > 0 ? ((p.value / total) * 100).toFixed(1) : 0
              tooltipContent += `${p.marker} ${year}年${type}: ${p.value}人 (${percent}%)<br/>`
            })
            return tooltipContent
          }
        },
        legend: {
          data: ['2023 境内', '2023 境外', '2024 境内', '2024 境外'],
          top: 'bottom'
        },
        xAxis: {
          type: 'category',
          data: this.processedData.xAxis,
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
          // 2023系列
          {
            name: '2023 境内',
            type: 'bar',
            stack: '2023',
            data: this.chartData[2023].domestic,
            itemStyle: { color: '#5470C6' }
          },
          {
            name: '2023 境外',
            type: 'bar',
            stack: '2023',
            data: this.chartData[2023].overseas,
            itemStyle: { color: '#9ac8ff' }
          },
          // 2024系列
          {
            name: '2024 境内',
            type: 'bar',
            stack: '2024',
            data: this.chartData[2024].domestic,
            itemStyle: { color: '#91CC75' },
            barGap: '30%'
          },
          {
            name: '2024 境外',
            type: 'bar',
            stack: '2024',
            data: this.chartData[2024].overseas,
            itemStyle: { color: '#c2e3a9' }
          }
        ],
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '20%',
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
