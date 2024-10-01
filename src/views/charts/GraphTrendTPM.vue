<template>
  <CCard>
    <CCardHeader> {{}} </CCardHeader>
    <div class="card-body">
      <div class="row">
        <div class="col-4">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="MonthSelect"
              >Month</CInputGroupText
            >
            <CFormInput
              v-model="filterStatus.month"
              type="month"
              class="form-control"
              placeholder="Month"
            >
            </CFormInput>
          </CInputGroup>
        </div>
      </div>
    </div>
    <CCardBody>
      <CCard>
        <apexchart
          v-if="series && chartOptions"
          type="line"
          height="350"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </CCard>
    </CCardBody>
  </CCard>
</template>
<script>
import { toast } from "vue-sonner";
import api from "../../apis/CommonAPI";
import moment from "moment";

export default {
  name: "GraphStandardTime",
  data() {
    return {
      selectedMonth: moment().format("YYYY-MM"),
      filter: {
        month: `${moment().format("YYYY-MM")}`,
        line_id: -1,
        machine_id: -1,
      },
      selectedMonthStatus: moment().format("YYYY-MM"),
      filterStatus: {
        month: `${moment().format("YYYY-MM")}`,
      },
      series: [
        {
          name: "Actual Data",
          data: [10, 20, 15, 30, 40, 50, 60, 70, 80, 90],
          type: "line",
        },
      ],

      chartOptions: {
        chart: {
          height: 350,
          type: "line",
        },
        stroke: {
          width: [4, 4, 2],
        },
        title: {
          text: "Actual Measurement",
        },
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
        yaxis: {
          // min: 0,
          // max: 100,
          // tickAmount: 10,
          // labels: {
          //   formatter: function (val) {
          //     return val !== null && val !== undefined ? val.toFixed(0) : "";
          //   },
          // },
          crosshairs: {
            show: true,
          },
        },
        annotations: {
          yaxis: [
            {
              y: 0,
              y2: 20,
              borderColor: "#FF0000",
              fillColor: "rgba(255, 0, 0, 1)",
            },
            {
              y: 50,
              y2: 100,
              borderColor: "#FF0000",
              fillColor: "rgba(255, 0, 0, 1)",
            },
          ],
        },
      },
    };
  },
};
</script>
<style></style>
