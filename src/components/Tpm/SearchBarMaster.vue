<template>
  <!-- Start:Search -->
  <CCard class="mb-1">
    <CCardHeader>
      Search
    </CCardHeader>
    <CCardBody>
      <CRow>
        <CCol lg="3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Year</span>
            </div>
            <select class="form-control" v-model="form.yearonly">
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </CCol>
        <CCol lg="5">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Plant</span>
            </div>
            <input type="text" class="form-control" placeholder="Plant" disabled
              value="Engine Production Karawang#3 Division (EPKD)">
          </div>
        </CCol>
        <CCol lg="4">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Shop</span>
            </div>
            <input type="text" class="form-control" placeholder="Shop" disabled value="All">
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Line</span>
            </div>
            <input type="text" class="form-control" placeholder="Line">
          </div>
        </CCol>
        <CCol lg="3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Machine</span>
            </div>
            <input type="text" class="form-control" placeholder="Machine">
          </div>
        </CCol>
        <CCol lg="3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Incharge</span>
            </div>
            <input type="text" class="form-control" placeholder="Incharge">
          </div>
        </CCol>
        <CCol lg="3">
          <v-select append-to-body style="z-index: 1" :options="status" placeholder="Status"
            :reduce="status => status.status_id" v-model="form.status_id">
            <template #option="option">
              <CBadge class="text-dark" :style="`background-color: ${option.color_tag}`" shape="pill">
                {{ option.status_nm }}</CBadge>
            </template>
            <template #selected-option="option">
              <CBadge class="text-dark" :style="`background-color: ${option.color_tag}`" shape="pill">
                {{ option.status_nm }}</CBadge>
            </template>
          </v-select>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="12">
          <CButton class="w-100" color="outline-dark" @click="search()">
            Search
          </CButton>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
  <!-- End:Search -->
</template>


<script>
import moment from 'moment'
import api from '@/apis/CommonAPI'
import { mapGetters } from 'vuex'

export default {
  name: 'SearchBarFinding',
  data() {
    return {
      form: {
        yearonly: `${moment().format('YYYY')}`,
        plant_id: null,
        line_id: null,
        machine_id: null,
        incharge_id: null,
        status_id: null,
      },
      status: [],
      years: [2023, 2024, 2025, 2026, 2027],
    }
  },
  computed: {
    ...mapGetters(['GETTER_STATE_SUBMISSION']),
  },
  watch: {
    GETTER_STATE_SUBMISSION: function () {
      if (this.GETTER_STATE_SUBMISSION) {
        this.search()
      }
    },
  },
  methods: {
    search() {
      let mapForm = Object.keys(this.form)
        .map((key) => `${key}=${this.form[key]}`)
        .join('&')
      this.$emit('getFindings', mapForm)
    },
  },
  mounted() {
    this.search()
  },
}
</script>
