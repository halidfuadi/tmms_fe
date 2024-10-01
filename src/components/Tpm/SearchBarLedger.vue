<template>
  <CCard class="mb-2" style="z-index: 1">
    <CCardHeader> Search </CCardHeader>
    <CCardBody>
      <CRow class="mb-3" v-if="!isItemCheckView">
        <CCol lg="6">
          <treeselect v-model="form.line_id" :options="line" placeholder="Select Line" />
        </CCol>
        <CCol lg="6">
          <treeselect v-model="form.machine_id" :options="machine" placeholder="Select Machine" />
        </CCol>
      </CRow>
      <CRow v-if="isItemCheckView" class="mb-3">
        <CCol lg="12">
          <treeselect v-model="form.uuid" :options="itemchecks" placeholder="Select Item Check" />
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="12">
          <CButton class="w-100" color="outline-dark" @click="search">
            Search
          </CButton>
        </CCol>
      </CRow>
      <CRow class="mt-3">
        <CCol>
          <CButton class="w-100" color="outline-dark" @click="viewPerItemCheck" v-if="!isItemCheckView">
            View Per Item Check
          </CButton>
          <CButton class="w-100" color="outline-dark" @click="viewPerMachineAndLine" v-if="isItemCheckView">
            View Per Machine and Line
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
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";

export default {
  name: "SearchBarLedger",
  data() {
    return {
      form: {
        line_id: null,
        machine_id: null,
        uuid: null,
      },
      machine: [],
      line: [],
      itemchecks: [],
      isItemCheckView: false, // Track whether 'View Per Item Check' is clicked
    };
  },
  components: { Treeselect },
  methods: {
    search() {
      let mapForm = Object.keys(this.form)
        .map((key) => `${key}=${this.form[key]}`)
        .join("&");
      console.log(mapForm);
      this.$emit("getLedgers", mapForm);
    },
    async getMachine(filter = {}) {
      try {
        let machine = await api.post(`/tpm/filter/machine`, filter);
        console.log(filter);
        let mapMachines = machine.data.data.map((item) => {
          return {
            id: item.machine_id,
            label: item.machine_nm,
          };
        });
        this.machine = mapMachines;
      } catch (error) {
        console.log(error);
      }
    },
    async getLine(filter = {}) {
      try {
        let line = await api.post(`/tpm/filter/line`, filter);
        console.log(filter);
        let mapLines = line.data.data.map((item) => {
          return {
            id: item.line_id,
            label: item.line_nm,
          };
        });
        this.line = mapLines;
      } catch (error) {
        console.log(error);
      }
    },
    async getItemChecks(filter = {}) {
      try {
        let itemChecks = await api.post(`/tpm/filter/itemcheck`, filter);
        console.log(itemChecks);
        let mapItemChecks = itemChecks.data.data.map((item) => {
          return {
            id: item.uuid,
            label: item.itemcheck_nm,
          };
        });
        this.itemchecks = mapItemChecks;
      } catch (error) {
        console.log(error);
      }
    },
    viewPerItemCheck() {
      this.isItemCheckView = true;
      this.getItemChecks();
      this.$emit("changeView", "itemcheck"); // Notify parent about the view change
    },
    viewPerMachineAndLine() {
      this.isItemCheckView = false;
      this.getLine();
      this.getMachine();
      this.$emit("changeView", "machineAndLine"); // Notify parent about the view change
    },
  },
  watch: {
    "form.line_id": function (newVal) {
      if (newVal && newVal.length > 0 && !this.isItemCheckView) {
        this.getMachine({ line_id: newVal });
      } else if (!this.isItemCheckView) {
        this.getMachine();
      }
    },
  },
  mounted() {
    this.getMachine();
    this.getLine();
    this.getItemChecks();
  },
};
</script>
