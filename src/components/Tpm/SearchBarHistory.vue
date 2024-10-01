<template>
  <!-- Start:Search -->
  <CCard class="mb-1">
    <CCardHeader>Search</CCardHeader>
    <CCardBody>
      <CRow>
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
        <CCol lg="3">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="LineSelect">Line</CInputGroupText>
            <CFormInput
              v-model="form.line_id"
              type="text"
              class="form-control"
              placeholder="Line"
            />
          </CInputGroup>
        </CCol>
        <CCol lg="3">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="MachineSelect"
              >Machine</CInputGroupText
            >
            <CFormInput
              v-model="form.machine_id"
              type="text"
              class="form-control"
              placeholder="Machine"
            />
          </CInputGroup>
        </CCol>
        <CCol lg="3">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="InchargeSelect"
              >Incharge</CInputGroupText
            >
            <CFormInput
              v-model="form.incharge_id"
              type="text"
              class="form-control"
              placeholder="Incharge"
            />
          </CInputGroup>
        </CCol>
        <CCol lg="6" v-if="GETTER_ITEMCHECK.length > 0">
          <v-select
            append-to-body
            style="z-index: 1"
            :options="GETTER_ITEMCHECK"
            label="itemcheck_nm"
            placeholder="Itemcheck"
            :reduce="(itemcheck) => itemcheck.uuid"
            v-model="form.itemcheck_id"
          >
            <template #option="option">
              {{ option.itemcheck_nm }}
            </template>
            <template #selected-option="option">
              {{ option.itemcheck_nm }}
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
import { mapGetters } from "vuex";

export default {
  name: "SearchBarHistory",
  data() {
    return {
      form: {
        itemcheck_id: null,
      },
      status: [],
    };
  },
  computed: {
    ...mapGetters(["getSubmitStatus", "GETTER_ITEMCHECK"]),
  },
  methods: {
    search() {
      let mapForm = Object.keys(this.form)
        .map((key) => `${key}=${this.form[key]}`)
        .join("&");
      this.$emit("getHistory", "?" + mapForm);
    },
    getItemchecks() {
      try {
        this.$store.dispatch("ACT_ITEMCHECKS");
      } catch (error) {
        alert(error);
      }
    },
  },
  mounted() {
    this.search();
    this.getItemchecks();
  },
};
</script>
