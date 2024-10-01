<template>
  <div>
  <CContainer fluid>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-3">
          <CCardHeader>
            <CCardTitle>Monthly</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow class="mb-3">
              <CCol lg="8">
                <div class="card">
                  <div class="card-header">Line Progress</div>
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

                  <div class="card-body card">
                    <GraphStatusTPM :filter="filterStatus" />
                  </div>
                </div>
              </CCol>

              <CCol lg="4">
                <div class="card">
                  <div class="card-header">Item</div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-6">
                        <CInputGroup class="mb-3">
                          <CInputGroupText as="label" for="MonthSelect"
                            >Month</CInputGroupText
                          >
                          <CFormInput
                            v-model="filterStatus2.month"
                            type="month"
                            class="form-control"
                            placeholder="Month"
                          >
                          </CFormInput>
                        </CInputGroup>
                      </div>
                    </div>
                  </div>

                  <div class="card-body card">
                    <GraphItem :filter="filterStatus2" />
                  </div>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard class="mb-3">
          <CCardHeader>
            <CCardTitle>Yearly</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <div class="row">
              <div class="col-4">
                <CInputGroup class="mb-3">
                  <CInputGroupText as="label" for="YearSelect"
                    >Year</CInputGroupText
                  >
                  <CFormInput
                    v-model="filterStatus3.yearonly"
                    type="year"
                    class="form-control"
                    placeholder="Year"
                  >
                  </CFormInput>
                </CInputGroup>
              </div>
            </div>
          </CCardBody>

          <CRow class="p-3">
            <!-- <CCol lg="12"> -->
            <GraphItemYearly :filter="filterStatus3" />
            <!-- </CCol> -->
          </CRow>
        </CCard>
        <CCard class="mb-3">
          <CCardHeader>
            <CCardTitle>ITEM TREND</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow class="mb-3">
              <CCol>
                <GraphTrendTPM />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
  </div>
</template>
<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { toast } from "vue-sonner";
import { GET_LINES } from "../../store/lines.module";

import GraphStandardTime from "../../views/charts/GraphStandardTime.vue";
import StatusTpm from "../../views/charts/StatusTpm.vue";
import GraphStatusTPM from "../../views/charts/GraphStatusTPM.vue";
import GraphItem from "../../views/charts/GraphItem.vue";
import GraphItemYearly from "../../views/charts/GraphItemYearly.vue";
import GraphTrendTPM from "../../views/charts/GraphTrendTPM.vue";

// import NewUpdate from '../../components/Tpm/NewUpdate.vue'
import { CCardBody, CCardHeader, CCardSubtitle, CCardTitle } from "@coreui/vue";

export default {
  name: "TPMDashboard",
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
      filterStatus2: {
        month: `${moment().format("YYYY-MM")}`,
      },
      filterStatus3: {
        yearonly: `${moment().format("YYYY")}`,
      },
    };
  },
  components: {
    GraphStandardTime,
    StatusTpm,
    GraphStatusTPM,
    GraphItem,
    // NewUpdate,
    GraphTrendTPM,
    GraphItemYearly,
  },
  computed: {
    ...mapGetters(["getLinesOpts", "getMachinesOpts"]),
  },
  watch: {
    ["filter.line_id"]() {
      if (this.filter.line_id != -1) {
        this.ActionGetMachines();
      } else {
        this.filter.machine_id = -1;
      }
    },
    selectedMonth() {},
    selectedMonthStatus() {},
  },
  methods: {
    async ActionGetLines() {
      try {
        await this.$store.dispatch(GET_LINES, this.filter);
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    },
    async ActionGetMachines() {
      try {
        await this.$store.dispatch(GET_MACHINES, {
          line_id: this.filter.line_id,
        });
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    },
  },
  async mounted() {
    await this.ActionGetMachines();
    await this.ActionGetLines();
  },
};
</script>
<style></style>
