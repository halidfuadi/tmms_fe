<template>
  <div id="chart">
    <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>

</template>
<script>
import { toast } from 'vue-sonner';
import api from '../../apis/CommonAPI';

export default {
  name: "GraphStandardTime",
  data() {
    return {
      series: [],
      chartOptions: {},
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
        // this.filter.year = this.filter.selectedMonth.split('-')[0]
        // this.filter.month = this.filter.selectedMonth.split('-')[1]
        // delete this.filter.selectedMonth
        let { data } = await api.post(`/tpm/schedules/visualization`, this.filter)
        if (data) {
          this.series = data.data.series
          this.chartOptions = {
            chart: {
              height: 350,
              type: 'line',
            },
            stroke: {
              width: [0, 4]
            },
            title: {
              text: 'Actual Standard Data'
            },
            labels: data.data.labels,
          }
        }
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
