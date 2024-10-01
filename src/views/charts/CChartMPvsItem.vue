<template>
  <CCard>
    <CCardBody>
      <apexchart type="bar" height="350" :options="chart.chartOptions" :series="chart.series"></apexchart>
    </CCardBody>
  </CCard>
</template>

<script>
import { CChart } from '@coreui/vue-chartjs'
import api from "@/apis/CommonAPI";

export default {
  name: 'ChartMPvsItem',

  data() {
    return {
      chart: {
        series: [
          // {
          //   name: "> 3 Hour",
          //   group: "duration",
          //   data: [7, 3, 4, 10, 37, 72, 240, 123, 172, 15, 88, 73]
          // },
          // {
          //   name: "MH Weekend",
          //   group: "manhour",
          //   data: [320, 320, 320, 320, 320, 320, 320, 320, 320, 320, 320, 320],
          // },
          // {
          //   name: "< 3 Hour",
          //   group: "duration",
          //   data: [2, 3, 4, 36, 88, 288, 250, 407, 387, 483, 403, 415],
          // },
          // {
          //   name: "MH Weekday",
          //   group: "manhour",
          //   data: [154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154],
          // },
        ],
        chartOptions: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          dataLabels: {
            // formatter: (val) => {
            //   return val / 1000 + 'K'
            // }
          },
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          xaxis: {
            categories: [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December'
            ]
          },
          fill: {
            opacity: 1
          },
          colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
          yaxis: {
            labels: {
              // formatter: (val) => {
              //   return val / 1000 + 'K'
              // }
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left'
          }
        },
      }
    }
  },

  components: {
    CChart,
  },

  methods: {
    async getData() {
      try {
        let items = await api.get('/tpm/schedules/visualization-trend', '?')
        this.chart.series = items.data.data.series
        this.chart.chartOptions.xaxis.categories = items.data.data.labels
      } catch (error) {
        console.log(error);
      }
    }
  },

  mounted() {
    this.getData()
  },
}
</script>
