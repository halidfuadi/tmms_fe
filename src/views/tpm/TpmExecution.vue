<template>
  <div>
  <CContainer fluid>
    <CRow>
      <CCol :md="12">
        <Toaster position="top-center" closeButton />
        <ModalFinding :isShow="is_finding" :finding="form.finding" @submit="submitFinding"
          @closeModal="(state) => (is_finding = state)" />
        <CCard class="mb-1">
          <CCardHeader>TPM Execution -
            {{ GETTER_SCHEDULE_DATA?.itemcheck_nm }}</CCardHeader>
          <CCardBody>
            <CRow class="justify-content-around">
              <CCol>
                <CIcon icon="cil-building" /> Engine Production Karawang#3(temp)
              </CCol>
              <CCol>
                <CIcon icon="cil-cash" /> {{ GETTER_SCHEDULE_DATA?.line_nm }}
              </CCol>
              <CCol>
                <CIcon icon="cil-camera-roll" />{{
        GETTER_SCHEDULE_DATA?.machine_nm
      }}
              </CCol>
              <CCol>
                <CIcon icon="cil-av-timer" />
                {{ GETTER_SCHEDULE_DATA?.duration }} min
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard class="mb-1">
          <CAccordion>
            <CAccordionItem>
              <CAccordionHeader>Manual Books</CAccordionHeader>
              <CAccordionBody>coming soon</CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CCard>

        <CCard class="mb-1" style="z-index: 3">
          <CCardBody>
            <CRow>
              <CCol lg="6">
                <label>Plan PIC</label>
                <CFormInput :value="GETTER_SCHEDULE_DATA?.checkers.map((pic) => {
        return pic.user_nm;
      })
        " disabled />
              </CCol>

              <CCol lg="6" v-if="GETTER_USERS">
                <label>Actual PIC</label>
                <v-select :options="GETTER_USERS" label="user_nm" multiple v-model="form.actual_user_ids"
                  :disabled="is_already_check">
                  <template #option="option">
                    <span>{{ option.noreg }}-{{ option.user_nm }}</span>
                  </template>
                  <template #selected-option="option">
                    <span>{{ option.noreg }}-{{ option.user_nm }}</span>
                  </template>
                </v-select>
              </CCol>
            </CRow>

            <CRow>
              <CCol v-if="!GETTER_SCHEDULE_DATA?.is_number" lg="12">
                <!-- Itemcheck: type judg -->
                <CInputGroup class="mb-3">
                  <CInputGroupText>TPM Check</CInputGroupText>
                  <CFormSelect v-model="form.checked_val" :disabled="is_already_check">
                    <option value="null">--Select--</option>
                    <template v-if="stdData">
                      <option :value="stdData.ng_val">
                        {{ stdData.ng_val }}
                      </option>
                      <option :value="stdData.ok_val">
                        {{ stdData.ok_val }}
                      </option>
                    </template>
                  </CFormSelect>
                  <CInputGroupText>
                    <b v-if="stdData">Std: {{ GETTER_SCHEDULE_DATA.standard_measurement }}</b>
                  </CInputGroupText>
                </CInputGroup>

              </CCol>

              <CCol v-else lg="12">
                <!-- Itemcheck: type number -->
                <CInputGroup class="mb-3">
                  <CInputGroupText>TPM Check</CInputGroupText>
                  <CFormInput type="number" v-model="form.checked_val" />
                  <CInputGroupText>
                    <b>Std: {{ GETTER_SCHEDULE_DATA.ng_val }} ~
                      {{ GETTER_SCHEDULE_DATA.ok_val }}</b>
                  </CInputGroupText>
                </CInputGroup>
              </CCol>

              <CCol lg="3">
                <CInputGroup class="mb-3">
                  <CInputGroupText>Plan Date</CInputGroupText>
                  <CFormInput type="date" v-model="plan_check_dt" :disabled="is_already_check" />
                </CInputGroup>
              </CCol>

              <CCol lg="3">
                <CInputGroup class="mb-3">
                  <CInputGroupText>Actual Date</CInputGroupText>
                  <CFormInput type="date" v-model="form.actual_check_dt" :disabled="is_already_check" />
                </CInputGroup>
              </CCol>

              <CCol lg="3">
                <CInputGroup class="mb-3">
                  <CInputGroupText>Start Time</CInputGroupText>
                  <CFormInput type="time" v-model="start_time" :disabled="is_already_check" />
                </CInputGroup>
              </CCol>

              <CCol lg="3">
                <CInputGroup class="mb-3">
                  <CInputGroupText>End Time</CInputGroupText>
                  <CFormInput type="time" v-model="end_time" :disabled="is_already_check" />
                </CInputGroup>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard style="z-index: 2">
          <CCardBody>
            <CRow class="justify-content-end">
              <CCol lg="1">
                <CButton v-if="!is_already_check" color="primary" @click="submitTpmExec()">Submit
                </CButton>
                <CButton v-else color="primary" disabled="true">Submitted</CButton>
              </CCol>
              <CCol lg="1">
                <CButton color="secondary" @click="$router.go(-1)">Cancel</CButton>
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
import api from "@/apis/CommonAPI";
import moment from "moment";
import { toast, Toaster } from "vue-sonner";

import { mapGetters } from "vuex";
import ModalFinding from "@/components/Tpm/ModalFinding.vue";

export default {
  name: "TpmExecution",
  data() {
    return {
      toaster: [],
      is_already_check: false,
      is_number: false,
      stdData: null,
      form: {
        schedule_id: null, //
        ledger_itemcheck_id: null, //
        actual_check_dt: moment().format("YYYY-MM-DD"),
        plan_user_ids: [],
        actual_user_ids: [],
        checked_val: null,
        ok_val: null,
        ng_val: null,
        is_number: 0,
        actual_duration: 0,
        finding: {
          user_id: null,
          problem: null,
          action_plan: null,
          plan_check_dt: moment().format("YYYY-MM-DD"),
        },
      },
      plan_check_dt: null,
      start_time: moment().format("hh:mm"),
      end_time: moment().format("hh:mm"),
      users: [],
      is_finding: false,
      submittedForm: null,
    };
  },
  components: {
    Toaster,
    ModalFinding,
  },
  computed: {
    ...mapGetters(["GETTER_USERS", "GETTER_SCHEDULE_DATA"]),
    getOnlyUserPlanIds() {
      return this.form.actual_user_ids.map((user) => {
        return user.user_id;
      });
    },
    getDateHourActualDt() {
      return `${this.form.actual_check_dt} ${this.start_time}`;
    },
    getActualDuration() {
      return (
        (new Date(`${this.form.actual_check_dt} ${this.end_time}`).getTime() -
          new Date(
            `${this.form.actual_check_dt} ${this.start_time}`
          ).getTime()) /
        1000 /
        60
      );
    },
  },
  methods: {
    submitFinding(state) {
      try {
        const finding = state.finding;
        if (!state.is_show && finding.user_id) {
          // doing execution with finding
          this.is_finding = state.is_show;
          this.submittedForm.finding = finding;
          this.$store.dispatch("ACT_EXECUTION_TPM", this.submittedForm);
          this.$router.push("/tpm/monitoring");
        }
        this.is_finding = false;
      } catch (error) {
        toast.error("Error to submit finding");
      }
    },
    async submitTpmExec() {
      console.log("SubmitExec");
      try {
        this.form.actual_duration = this.getActualDuration;
        this.submittedForm = {
          ...this.form,
        };
        this.submittedForm.actual_user_ids = this.getOnlyUserPlanIds;
        this.submittedForm.actual_check_dt = `${this.form.actual_check_dt} ${this.start_time}`;
        let isNotNull =
          Object.entries(this.submittedForm).filter(([key, value]) => {
            return !value && value != 0;
          }).length === 0;
        let isJudgType =
          !this.is_number &&
          this.submittedForm.ng_val === this.submittedForm.checked_val;
        let isRangedType =
          this.is_number &&
          (+this.submittedForm.checked_val < +this.submittedForm.ng_val ||
            +this.submittedForm.checked_val > +this.submittedForm.ok_val);
        console.log(
          +this.submittedForm.ng_val < +this.submittedForm.checked_val ||
          +this.submittedForm.ok_val > +this.submittedForm.checked_val
        );
        console.log(isNotNull, isJudgType, isRangedType);
        console.log(this.submittedForm);
        if (isNotNull && isJudgType) {
          this.is_finding = true;
          return;
        } else if (isNotNull && isRangedType) {
          this.is_finding = true;
          return;
        }
        if (isNotNull) {
          console.log(this.submittedForm);
          await this.$store.dispatch("ACT_EXECUTION_TPM", this.submittedForm);
          this.$router.push("/tpm/monitoring");
        } else {
          toast.error("Lengkapi input dulu!");
        }
      } catch (error) {
        toast.error("Error to execution");
      }
    },
    async getDetail() {
      try {
        const filter = {
          schedule_id: this.$route.params.id,
          is_detail: this.$route.params.id,
        };
        await this.$store.dispatch("ACT_GET_SCHEDULE", filter);
        this.start_time = this.GETTER_SCHEDULE_DATA.actual_check_dt
          ? moment(this.GETTER_SCHEDULE_DATA.actual_check_dt).format("hh:mm")
          : moment().format("hh:mm");

        this.form.ledger_itemcheck_id =
          this.GETTER_SCHEDULE_DATA.ledger_itemcheck_id;
        this.end_time = moment(
          this.GETTER_SCHEDULE_DATA.actual_check_dt || new Date()
        )
          .add(this.GETTER_SCHEDULE_DATA.duration, "minutes")
          .format("hh:mm");
        this.form.plan_user_ids = this.GETTER_SCHEDULE_DATA?.checkers.map(
          (pic) => {
            return pic.user_id;
          }
        );
        this.plan_check_dt = moment(
          this.GETTER_SCHEDULE_DATA.plan_check_dt
        ).format("YYYY-MM-DD");
        this.form.ok_val = this.GETTER_SCHEDULE_DATA.ok_val;
        this.form.ng_val = this.GETTER_SCHEDULE_DATA.ng_val;
      } catch (error) {
        console.log(error);
        toast.error("failed fetch detail schedule");
      }
    },
    async getHistoryExecution() {
      try {
        let { data } = await api.get(
          `/tpm/execution`,
          `?schedule_id=${this.$route.params.id}`
        );
        if (data.data) {
          this.form.actual_user_ids = data.data[0].pic_check[0].user_id
            ? data.data[0].pic_check
            : [];
          this.form.checked_val = data.data[0].execution[0]?.checked_val;
          this.form.actual_check_dt = moment(
            data.data[0].actual_check_dt || new Date()
          ).format("YYYY-MM-DD");
        }
        if (data.data[0].actual_check_dt) this.is_already_check = true;
      } catch (error) {
        console.log(error);
        toast.error("failed getHistoryExecution");
      }
    },
    async getUser() {
      try {
        this.$store.dispatch("ACT_GET_USERS");
      } catch (error) {
        console.log(error);
      }
    },
    async getStd() {
      try {
        let { data } = await api.get(
          `/tpm/itemcheck-std`,
          `?itemcheck_std_id=${this.GETTER_SCHEDULE_DATA.itemcheck_std_id}`
        );
        let stdData = data.data[0];
        console.log("stdData");
        console.log(stdData);
        this.is_number = stdData.is_number;
        this.form.is_number = stdData.is_number;
        this.stdData = stdData;
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    this.form.schedule_id = this.$route.params.id;
    await this.getDetail();
    await this.getStd();
    await this.getUser();
    await this.getHistoryExecution();
  },
};
</script>

<style>
.form-control:disabled,
.form-select:disabled {
  border: 1px solid #00ff3b !important;
}
</style>
