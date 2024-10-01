<template>
  <!-- <CRow> -->
  <CCol class="mb-3" lg="4" v-for="(chart, i) in charts" :key="i">
    <CCard>
      <CCardBody>
        <apexchart type="bar" height="350" :options="chart.chartOptions" :series="chart.series"></apexchart>
        <h6 class="text-center">{{ chart.total }}</h6>
      </CCardBody>
    </CCard>
  </CCol>
  <!-- </CRow> -->
</template>
<script>
import { toast } from 'vue-sonner';
import api from '../../apis/CommonAPI';
import { CProgress } from '@coreui/vue'

export default {
  name: "GraphItemYearly",
  data() {
    return {
      charts: {},
      series: [],
      chartOptions: {},
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    }
  },
  watch: {
    filter: {
      deep: true,
      handler() {
        this.ActionStandardTime()
      }
    }
  },
  methods: {
    async ActionStandardTime() {
      try {
        console.log(this.filter);
        let { data } = await api.post(`/tpm/schedules/visualization-item-yearly`, this.filter)
        console.log(data);

        for (let i = 1; i <= 12; i++) {
          this.series = data.data[i].series
          this.chartOptions = {
            chart: {
              height: 350,
              type: 'line',
            },
            stroke: {
              width: [3, 0]
            },
            title: {
              text: this.months[i - 1]
            },
            labels: data.data[i].labels,
          }
          this.charts[i] = {
            series: this.series,
            chartOptions: this.chartOptions,
          }
          this.series = []
          this.chartOptions = {}
        }

        console.log(this.charts);

      } catch (error) {
        console.log(error);
        toast.error(error)
      }
    }
  },
  async mounted() {
    await this.ActionStandardTime()
  },
  props: {
    filter: {
      type: Object,
    }
  }
}
</script>
<style></style>
