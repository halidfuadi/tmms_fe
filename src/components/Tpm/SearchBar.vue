<template>
  <!-- Start:Search -->
  <CCard class="mb-1" style="z-index: 1">
    <CCardHeader>Search</CCardHeader>
    <CCardBody>
      <CRow class="mb-3">
        <CCol lg="3">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="MonthSelect">Month</CInputGroupText>
            <CFormInput v-model="form.month" type="month" class="form-control" placeholder="Month"/>
          </CInputGroup>
        </CCol>
        <CCol lg="5">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="PlantSelect">Plant</CInputGroupText>
            <CFormInput v-model="form.plant_id" type="text" class="form-control" placeholder="Plant" disabled
                        value="Engine Production Karawang#3 Division (EPKD)"/>
          </CInputGroup>
        </CCol>
        <CCol lg="4">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="ShopSelect">Shop</CInputGroupText>
            <CFormInput v-model="form.shop_id" type="text" class="form-control" placeholder="Shop" disabled
                        value="All"/>
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol lg="3">
          <Treeselect v-model="form.line_id" :options="line" placeholder="Select Line"/>
        </CCol>

        <CCol lg="3">
          <Treeselect v-model="form.machine_id" :options="machine" placeholder="Select Machine"/>
        </CCol>

        <CCol lg="3">
          <Treeselect v-model="form.incharge_id" :options="incharge" placeholder="Select Incharge"/>
        </CCol>

        <CCol lg="3">
          <v-select append-to-body style="z-index: 1" :options="status" placeholder="Status"
                    :reduce="status => status.status_id" v-model="form.status_id">
            <template #option="option">
              <CBadge class="text-dark" :style="`background-color: ${option.color_tag}`" shape="pill">
                {{ option.status_nm }}
              </CBadge>
            </template>
            <template #selected-option="option">
              <CBadge class="text-dark" :style="`background-color: ${option.color_tag}`" shape="pill">
                {{ option.status_nm }}
              </CBadge>
            </template>
          </v-select>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="12">
          <CButton class="w-100" color="outline-dark" @click="search(true)">
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

// import the component
import Treeselect from "@zanmato/vue3-treeselect";
import "@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css";
// import the styles
//import "vue3-treeselect/dist/vue3-treeselect.css";

export default {
  name: "SearchBar",
  data() {
    return {
      form: {
        month: `${moment().format("YYYY-MM")}`,
        plant_id: null,
        line_id: null,
        machine_id: null,
        incharge_id: null,
        status_id: null,
      },
      status: [],
      incharge: [],
      machine: [],
      line: [],
    };
  },
  components: {Treeselect},
  watch: {
    getSubmitStatus: function () {
      if (this.getSubmitStatus) {
        this.search();
        this.getStatus();
      }
    },
    getSubmitIncharge: function () {
      if (this.getIncharge) {
        this.search();
        this.getIncharge();
      }
    },
    getSubmitMachine: function () {
      if (this.getMachine) {
        this.search();
        this.getMachine();
      }
    },
    getSubmitLine: function () {
      if (this.getLine) {
        this.search();
        this.getLine();
      }
    },
    "form.line_id": function (newVal) {
      if (newVal && newVal.length > 0) {
        this.getMachine({line_id: newVal});
      } else {
        this.getMachine();
      }
    },
  },
  methods: {
    search(shouldSave = false) {
      if (shouldSave) {
        this.saveFormToLocalStorage();
      }
      this.$emit("onSubmitSearch", this.form);
    },
    async getStatus() {
      try {
        let status = await api.post(`/tpm/statusTpm/view`);
        this.status = status.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getIncharge(filter = {}) {
      try {
        let incharge = await api.post(`/tpm/filter/incharge`, filter);
        console.log(filter);
        let mapincharges = await incharge.data.data.map((item) => {
          return {
            id: item.incharge_id,
            label: item.incharge_nm,
          };
        });
        this.incharge = [{id: "null", label: "All"}].concat(mapincharges);
      } catch (error) {
        console.log(error);
      }
    },
    async getMachine(filter = {}) {
      try {
        let machine = await api.post(`/tpm/filter/machine`, filter);
        console.log(filter);
        let mapMachines = await machine.data.data.map((item) => {
          return {
            id: item.machine_id,
            label: item.machine_nm,
          };
        });
        let allMachine = [{id: "null", label: "All"}];
        mapMachines = allMachine.concat(mapMachines);
        this.machine = mapMachines;
      } catch (error) {
        console.log(error);
      }
    },
    async getLine(filter = {}) {
      try {
        let line = await api.post(`/tpm/filter/line`, filter);
        console.log(filter);
        let maplines = await line.data.data.map((item) => {
          return {
            id: item.line_id,
            label: item.line_nm,
          };
        });

        this.line = [{id: "null", label: "All"}].concat(maplines);
      } catch (error) {
        console.log(error);
      }
    },
    saveFormToLocalStorage() {
      console.log('form', this.form);
      localStorage.setItem("searchFormSchedule", JSON.stringify(this.form));
    },
    loadFormFromLocalStorage() {
      const savedForm = localStorage.getItem("searchFormSchedule");
      if (savedForm) {
        this.form = JSON.parse(savedForm);
      }
    },
  },
  async mounted() {
    this.loadFormFromLocalStorage();
    await this.getLine();
    await this.getMachine();
    await this.getIncharge();
    await this.getStatus();
    this.loadFormFromLocalStorage();
    this.search();
  },
};
</script>
