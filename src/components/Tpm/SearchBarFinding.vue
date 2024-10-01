<template>
  <!-- Start:Search -->
  <CCard class="mb-1">
    <CCardHeader> Search </CCardHeader>
    <CCardBody>
      <CRow>
        <CCol lg="3">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="YearSelect">Year</CInputGroupText>
            <CFormSelect
              v-model="form.yearonly"
              class="form-control"
              placeholder="Year"
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option></CFormSelect
            >
          </CInputGroup>
        </CCol>
        <CCol lg="5">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="PlantSelect"
              >Plant</CInputGroupText
            >
            <CFormInput
              v-model="form.plant_id"
              type="text"
              class="form-control"
              placeholder="Plant"
              disabled
              value="Engine Production Karawang#3 Division (EPKD)"
            />
          </CInputGroup>
        </CCol>
        <CCol lg="4">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="ShopSelect">Shop</CInputGroupText>
            <CFormInput
              v-model="form.shop_id"
              type="text"
              class="form-control"
              placeholder="Shop"
              disabled
              value="All"
            />
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="3">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="LineSelect">Line</CInputGroupText>
            <CFormSelect
              v-model="form.line_id"
              class="form-control"
              placeholder="Line"
            >
              <option v-for="line in line_id" :key="line" :value="line_id">
                {{ line_id }}
              </option></CFormSelect
            >
          </CInputGroup>
        </CCol>
        <CCol lg="3">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="MachineSelect"
              >Machine</CInputGroupText
            >
            <CFormSelect
              v-model="form.machine_id"
              class="form-control"
              placeholder="Machine"
            >
              <option
                v-for="machine in machine_id"
                :key="machine"
                :value="machine_id"
              >
                {{ machine_id }}
              </option></CFormSelect
            >
          </CInputGroup>
        </CCol>
        <CCol lg="3">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="InchargeSelect"
              >Incharge</CInputGroupText
            >
            <CFormSelect
              v-model="form.incharge_id"
              class="form-control"
              placeholder="Incharge"
            >
              <option
                v-for="incharge in incharge_id_id"
                :key="incharge"
                :value="incharge_id"
              >
                {{ incharge_id }}
              </option></CFormSelect
            >
          </CInputGroup>
        </CCol>
        <CCol lg="3">
          <v-select
            append-to-body
            style="z-index: 1"
            :options="status"
            placeholder="Status"
            :reduce="(status) => status.status_id"
            v-model="form.status_id"
          >
            <template #option="option">
              <CBadge
                class="text-dark"
                :style="`background-color: ${option.color_tag}`"
                shape="pill"
              >
                {{ option.status_nm }}</CBadge
              >
            </template>
            <template #selected-option="option">
              <CBadge
                class="text-dark"
                :style="`background-color: ${option.color_tag}`"
                shape="pill"
              >
                {{ option.status_nm }}</CBadge
              >
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
import moment from "moment";
import api from "@/apis/CommonAPI";
import { mapGetters } from "vuex";

export default {
  name: "SearchBarFinding",
  data() {
    return {
      form: {
        yearonly: `${moment().format("YYYY")}`,
        plant_id: null,
        line_id: null,
        machine_id: null,
        incharge_id: null,
        status_id: null,
      },
      status: [],
      years: [2023, 2024, 2025, 2026, 2027],
    };
  },
  computed: {
    ...mapGetters(["GETTER_STATE_SUBMISSION"]),
  },
  watch: {
    GETTER_STATE_SUBMISSION: function () {
      if (this.GETTER_STATE_SUBMISSION) {
        this.search();
      }
    },
  },
  methods: {
    search() {
      let mapForm = Object.keys(this.form)
        .map((key) => `${key}=${this.form[key]}`)
        .join("&");
      this.$emit("getFindings", mapForm);
    },
  },
  mounted() {
    this.search();
  },
};
</script>
