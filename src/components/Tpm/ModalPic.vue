<template>
  <CModal :visible="isShow" backdrop="static" @close="changesShow()">
    <CModalHeader closeButton>Assign PIC</CModalHeader>
    <CModalBody>
      <CRow>
        <CCol lg="12" class="mb-3">
          <CInputGroup>
            <CInputGroupText as="label" for="MachineSelect">Machine</CInputGroupText>
            <CFormInput disabled type="text" class="form-control" placeholder="Machine" :value="machine_nm">
            </CFormInput>
          </CInputGroup>
        </CCol>
        <CCol lg="12" class="mb-3">
          <CInputGroup>
            <div class="input-group" style="width: 86%;">
              <span class="input-group-text">PIC</span>
              <div class="input-group-prepend" style="flex: 1;">
                <v-select :options="users" label="user_nm" v-model="userSelected">
                  <template #option="option">
                    <span>{{ option.noreg }}-{{ option.user_nm }}</span>
                  </template>
                  <template #selected-option="option">
                    <span>{{ option.noreg }}-{{ option.user_nm }}</span>
                  </template>
                </v-select>
              </div>
            </div>
            <CButton v-if="!loadingUpdatePic" color="primary" @click="assignPic()">Assign</CButton>
            <div v-else class="d-flex align-items-center justify-content-center ms-2">
              <CSpinner color="primary"/>
            </div>
          </CInputGroup>
        </CCol>
        <CCol lg="12" class="mb-3">
          <CInputGroup>
            <CInputGroupText as="label" for="PlanCheck">Plan Check</CInputGroupText>
            <CFormInput type="date" class="form-control w-50" v-model="changes_date" placeholder="Plan Check Date">
            </CFormInput>
            <CButton color="warning" @click="updatePlanDate()">Update</CButton>
          </CInputGroup>
        </CCol>
      </CRow>
    </CModalBody>
    <CModalFooter>
      {{ " " }}
      <CButton @click="changesShow()">Cancel</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import api from "@/apis/CommonAPI";
import moment from "moment";
import {mapGetters} from "vuex";
import {getSchedule} from "../../views/tpm/TpmMonitoring.vue";
import {toast} from "vue-sonner";

export default {
  name: "ModalPic",
  data() {
    return {
      users: [],
      userSelected: [],
      changes_date: null,
      shouldReload: false,
      loadingUpdatePic: false,
    };
  },
  watch: {
    incharge_id: function () {
      if (this.incharge_id) this.getUsers(this.incharge_id);
    },
    isShow: function () {
      this.shouldReload = false; // reset state
      if (this.isShow && this.selectedPics && this.users) {
        this.userSelected = [...this.users].find((user) => {
          return this.selectedPics.user_id === user.user_id;
        });
      } else {
        this.userSelected = null;
      }
    },
    /*getSubmitStatus: {
      handler() {
        console.log(this.getSubmitStatus);
        this.changesShow();
      },
      deep: true,
    },*/
    getPlanCheckDt: function () {
      this.changes_date = this.getPlanCheckDt;
    },
  },
  computed: {
    ...mapGetters(["getSubmitStatus"]),
    getPlanCheckDt() {
      return moment(this.plan_check_dt).format("YYYY-MM-DD");
    },
  },
  methods: {
    async getUsers(incharge_id = null) {
      try {
        let {data} = await api.get(
          `/tpm/users`,
          `?incharge_id=${incharge_id}`
        );
        console.log('userdata', data);
        this.users = data.data;
      } catch (error) {
        console.log(error);
      }
    },
    changesShow() {
      this.userSelected = null;
      this.$emit("showChanges", this.shouldReload);
    },
    async assignPic() {
      try {
        this.loadingUpdatePic = true;
        if (!this.userSelected) {
          toast.error("pic harus di isi terlebih dahulu");
          return;
        }

        const newObj = {
          schedule_id: this.schedule_id,
          schedule_checker_id: this.schedule_checker_id,
          //user_ids: this.userSelected.user_id,
          user_id: this.userSelected.user_id,
        };
        await this.$store.dispatch("ADD_PIC_SCHEDULE", newObj);
        this.shouldReload = true;
        this.changesShow();
      } catch (error) {
        console.log('assignPic()', error);
        toast.error("terjadi kesalahan saat menyimpan data, coba lagi");
      } finally {
        this.loadingUpdatePic = false;
      }
    },

    async updatePlanDate() {
      try {
        const updatePlanDate = {
          plan_check_dts: this.changes_date,
          schedule_id: this.schedule_id,
        };
        this.$store.dispatch("UPDATE_PLAN_DATE", updatePlanDate);
        this.shouldReload = true;
        this.changesShow();
      } catch (error) {
        console.log('updatePlanDate()', error);
        toast.error("terjadi kesalahan");
      }
    },
    formatDate(dateString) {
      if (!dateString) return ""; // Return empty string if dateString is empty or null
      const dateObject = new Date(dateString); // Convert string to date object
      // Check if dateObject is valid
      if (
        Object.prototype.toString.call(dateObject) === "[object Date]" &&
        !isNaN(dateObject)
      ) {
        // If dateObject is valid, return formatted date string
        return dateObject.toISOString().split("T")[0];
      } else {
        // If dateObject is invalid, return empty string
        return "";
      }
    },
    //
  },
  mounted() {
    this.getUsers();
  },
  props: {
    incharge_id: String,
    isShow: Boolean,
    schedule_id: String,
    machine_nm: String,
    plan_check_dt: String,
    schedule_checker_id: String,
    selectedPics: Array,
  },
};
</script>
<style>
.vs__dropdown-toggle {
  margin-bottom: 0 !important;
}
</style>
