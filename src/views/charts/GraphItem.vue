<template>
  <div id="chart">
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>

</template>
<script>
import { toast } from 'vue-sonner';
import api from '../../apis/CommonAPI';

export default {
  name: "GraphItem",
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
        let { data } = await api.post(`/tpm/schedules/visualization-item`, this.filter)
        if (data) {
          this.series = data.data.series
          this.chartOptions = {
            chart: {
              height: 350,
              type: 'line',
            },
            stroke: {
              width: [3, 0]
            },
            title: {
              text: 'Total Item'
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
