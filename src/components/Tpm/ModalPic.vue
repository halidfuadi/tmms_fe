<template>
  <CModal :visible="is_show" backdrop="static" @close="changesShow()">
    <CModalHeader closeButton>Assign PIC</CModalHeader>
    <CModalBody>
      <CRow>
        <CCol lg="6">
          <CInputGroup class="mb-3">
            <CInputGroupText as="label" for="MachineSelect">Machine</CInputGroupText>
            <CFormInput disabled type="text" class="form-control" placeholder="Machine" :value="machine_nm">
            </CFormInput>
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="12">
          <div class="input-group mb-3">
            <div class="input-group-prepend" style="width: 86%">
              <v-select :options="users" label="user_nm" multiple v-model="userSelected">
                <template #option="option">
                  <span>{{ option.noreg }}-{{ option.user_nm }}</span>
                </template>
                <template #selected-option="option">
                  <span>{{ option.noreg }}-{{ option.user_nm }}</span>
                </template>
              </v-select>
            </div>
            <div class="input-group-append" style="width: 14%">
              <span class="input-group-text p-0">
                <CButton color="primary" @click="assignPic()" :disabled="userSelected.length == 0">
                  Assign
                </CButton>
              </span>
            </div>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol lg="12">
          <CInputGroup class="mb-3">
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

export default {
  name: "ModalPic",
  data() {
    return {
      users: [],
      is_show: false,
      userSelected: [],
      changes_date: null,
    };
  },
  watch: {
    incharge_id: function () {
      if (this.incharge_id) this.getUsers(this.incharge_id);
    },
    isShow: function () {
      this.is_show = this.isShow;
      if (this.isShow && this.selectedPics && this.users) {
        this.userSelected = [...this.users].filter((user) => {
          const find = this.selectedPics.find((pic) => pic.user_id === user.user_id);
          return !!find;
        });
      }
    },
    getSubmitStatus: {
      handler() {
        console.log(this.getSubmitStatus);
        this.is_show = false;
        this.changesShow();
      },
      deep: true,
    },
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
      this.userSelected = [];
      if (this.is_show) {
        this.is_show = false;
        this.$emit("showChanges", this.is_show);
      } else {
        this.is_show = true;
      }
    },
    async assignPic() {
      try {
        let mapIdUsers = this.userSelected.map((user) => {
          return user.user_id;
        });
        const newObj = {
          schedule_id: this.schedule_id,
          user_ids: mapIdUsers,
        };
        this.$store.dispatch("ADD_PIC_SCHEDULE", newObj);
      } catch (error) {
        console.log(error);
      }
    },

    async updatePlanDate() {
      try {
        const updatePlanDate = {
          plan_check_dts: this.changes_date,
          schedule_id: this.schedule_id,
        };
        this.$store.dispatch("UPDATE_PLAN_DATE", updatePlanDate);
        // this.$emit('showChanges', this.is_show)
      } catch (error) {
        console.log(error);
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
    selectedPics: Array,
  },
};
</script>
