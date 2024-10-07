<template>
  <div>
    <CContainer fluid>
      <CRow>
        <CCol :md="12">
          <Toaster position="top-center" closeButton/>
          <ModalFinding :isShow="isShowModalFinding" :finding="form.finding" @submit="submitFinding"
                        @closeModal="(state) => (isShowModalFinding = state)"/>
          <CCard class="mb-1">
            <CCardHeader>TPM Execution -
              {{ scheduleDetailData?.itemcheck_nm }}
            </CCardHeader>
            <CCardBody>
              <div class="d-flex align-items-center justify-content-center w-100 mb-3">
                <CRow class="justify-content-between w-100">
                  <CCol class="d-flex gap-2">
                    <CIcon icon="cil-building"/>
                    <span style="white-space: pre-line;">
                    {{ companyPlant }}
                    </span>
                  </CCol>
                  <CCol class="d-flex align-items-center justify-content-center gap-2">
                    <CIcon icon="cil-cash"/>
                    {{ scheduleDetailData?.line_nm }}
                  </CCol>
                  <CCol class="d-flex align-items-center justify-content-center gap-2">
                    <CIcon icon="cil-camera-roll"/>
                    {{
                      scheduleDetailData?.machine_nm
                    }}
                  </CCol>
                  <CCol class="d-flex justify-content-end gap-2">
                    <CIcon icon="cil-av-timer"/>
                    {{ scheduleDetailData?.duration }} min
                  </CCol>
                </CRow>
              </div>
              <CRow class="mb-2">
                <CCol lg="6">
                  <CFormInput
                    label="Item Location"
                    disabled
                    :value="scheduleDetailData?.itemcheck_loc"/>
                </CCol>
                <CCol lg="6">
                  <CFormInput
                    label="Last Checked Date"
                    disabled
                    :value="scheduleDetailData?.last_checked_dt"/>
                </CCol>
              </CRow>
              <CRow class="mb-2">
                <CCol>
                  <CRow class="mb-2">
                    <CCol>
                      <CFormInput
                        label="Method"
                        disabled
                        :value="scheduleDetailData?.method_check"/>
                    </CCol>
                    <CCol>
                      <CFormInput
                        label="MP"
                        disabled
                        :value="scheduleDetailData?.mp + ' Person'"/>
                    </CCol>
                  </CRow>
                  <CFormInput
                    label="Standard Measurement"
                    disabled
                    :value="scheduleDetailData?.standard_measurement"
                    class="mb-2"/>
                  <CFormInput
                    label="Upper and Lower Limit"
                    disabled
                    :value="upperLower"/>
                </CCol>
                <CCol>
                  <CForm>
                    <CFormTextarea
                      label="Details"
                      disabled
                      rows="8"
                      :value="(!scheduleDetailData?.details || scheduleDetailData?.details == 'null') ? 'No Data' : scheduleDetailData?.details"/>
                  </CForm>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <CCard class="mb-1" style="z-index: 3">
            <CCardBody>
              <CRow>
                <CCol lg="6" class="mb-3">
                  <label>Plan PIC</label>
                  <CFormInput :value="scheduleDetailData?.checkers.user_nm" disabled/>
                </CCol>
                <CCol lg="6" v-if="GETTER_USERS">
                  <label>Actual PIC</label>
                  <v-select :options="GETTER_USERS" label="user_nm" v-model="form.actual_user_id">
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
                <CCol v-if="!scheduleDetailData?.is_number" lg="12">
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
                      <b v-if="stdData">Std: {{ scheduleDetailData?.standard_measurement }}</b>
                    </CInputGroupText>
                  </CInputGroup>

                </CCol>

                <CCol v-else lg="12">
                  <!-- Itemcheck: type number -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>TPM Check</CInputGroupText>
                    <CFormInput type="number" v-model="form.checked_val"/>
                    <CInputGroupText>
                      <b>Std: {{ scheduleDetailData?.ng_val }} ~
                        {{ scheduleDetailData?.ok_val }}
                      </b>
                    </CInputGroupText>
                  </CInputGroup>
                </CCol>

                <CCol lg="3">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Plan Date</CInputGroupText>
                    <CFormInput type="date" v-model="plan_check_dt" disabled/>
                  </CInputGroup>
                </CCol>

                <CCol lg="3">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Actual Date</CInputGroupText>
                    <CFormInput type="date" v-model="form.actual_check_dt" :disabled="is_already_check"/>
                  </CInputGroup>
                </CCol>

                <CCol lg="3">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Start Time</CInputGroupText>
                    <CFormInput type="time" v-model="start_time" :disabled="is_already_check"/>
                  </CInputGroup>
                </CCol>

                <CCol lg="3">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>End Time</CInputGroupText>
                    <CFormInput type="time" v-model="end_time" :disabled="is_already_check"/>
                  </CInputGroup>
                </CCol>
              </CRow>

              <CollapseSparepartList
                ref="collapseSparepartList"
                :is_execute="true"
                :visibleSparepart="true"
                :ledger_itemcheck_id="scheduleDetailData?.ledger_itemcheck_id"/>
            </CCardBody>
          </CCard>

          <CCard style="z-index: 2">
            <CCardBody>
              <CRow class="justify-content-end">
                <CCol md="6">
                  <CButton color="info" @click="openManualBook" class="text-white">Manual Book</CButton>
                </CCol>
                <CCol md="6" class="d-flex justify-content-end gap-2">
                  <CButton v-if="!is_already_check" color="primary" @click="save">Submit
                  </CButton>
                  <CButton v-else color="primary" disabled="true">Submitted</CButton>
                  <CButton color="secondary" @click="() => $router.go(-1)" class="text-white">Cancel</CButton>
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
import {toast, Toaster} from "vue-sonner";

import {mapGetters} from "vuex";
import ModalFinding from "@/components/Tpm/ModalFinding.vue";
import CollapseSparepartList from "@/components/Tpm/CollapseSparepartList.vue";
import PDFViewer from 'pdf-viewer-vue'


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
        plan_user_id: null,
        actual_user_id: null,
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
          attachment: null
        },
      },
      plan_check_dt: null,
      start_time: moment().format("hh:mm"),
      end_time: moment().format("hh:mm"),
      users: [],
      is_finding: false,
      scheduleDetailData: null,
      isShowModalFinding: false,
    };
  },
  components: {
    CollapseSparepartList,
    Toaster,
    ModalFinding,
    PDFViewer
  },
  computed: {
    ...mapGetters(["GETTER_USERS"]),
    getOnlyUserPlanIds() {
      /*return this.form.actual_user_id.map((user) => {
        return user.user_id;
      });*/
      return null;
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
    upperLower() {
      if (!this.scheduleDetailData) {
        return "No Data";
      }

      if (this.scheduleDetailData?.upper_limit && this.scheduleDetailData?.lower_limit) {
        return this.scheduleDetailData?.upper_limit + ' ~ ' + this.scheduleDetailData?.lower_limit;
      } else if (this.scheduleDetailData?.upper_limit) {
        return this.scheduleDetailData?.upper_limit;
      } else if (this.scheduleDetailData?.lower_limit) {
        return this.scheduleDetailData?.lower_limit;
      }

      return "No Data";
    },
    companyPlant() {
      if (!this.scheduleDetailData) {
        return "No Data";
      }

      if (this.scheduleDetailData?.company_nm && this.scheduleDetailData?.plant_nm) {
        return this.scheduleDetailData?.company_nm + ' \n ' + this.scheduleDetailData?.plant_nm;
      } else if (this.scheduleDetailData?.company_nm) {
        return this.scheduleDetailData?.company_nm;
      } else if (this.scheduleDetailData?.plant_nm) {
        return this.scheduleDetailData?.plant_nm;
      }

      return "Engine Production Karawang#3(temp)";
    }
  },
  methods: {
    submitFinding(state) {
      this.form = {
        ...this.form,
        finding: state.finding,
      };
    },
    save() {
      if (!this.form.actual_user_id) {
        toast.warning("Actual User harus di pilih terlebih dahulu", {
          description: "Pilih Actual User untuk menyimpan aktivitas"
        });
        return;
      }

      if (!this.form.checked_val) {
        toast.warning("TPM Check harus di pilih terlebih dahulu", {
          description: "Pilih TPM Check untuk menyimpan aktivitas"
        });
        return;
      }

      if (!this.plan_check_dt || !this.form.actual_check_dt || !this.start_time || !this.end_time) {
        toast.warning("Lengkapi Waktu", {
          description: "Lengkapi waktu untuk menyimpan aktivitas"
        });
        return;
      }

      const isRangedType =
        this.is_number &&
        (+this.form.checked_val < +this.form.ng_val ||
          +this.form.checked_val > +this.form.ok_val);

      this.is_finding = (!this.is_number && this.form.ng_val === this.form.checked_val) || isRangedType;
      const validateFinding = Object.keys(this.form.finding).filter((key) => {
        return !this.form.finding[key];
      });

      if (this.is_finding) {
        if (validateFinding.length > 0) {
          this.isShowModalFinding = true;
          return;
        }
      }

      this.submitTpmExec();
    },
    async submitTpmExec() {
      try {
        const mappedForm = {
          ...this.form,
          actual_duration: this.getActualDuration,
          actual_check_dt: `${this.form.actual_check_dt} ${this.start_time}`,
          actual_user_id: this.form.actual_user_id?.user_id,
          ledger_itemcheck_id: this.scheduleDetailData.ledger_itemcheck_id,
        };

        delete mappedForm.finding;

        const formData = new FormData();
        formData.append('finding_image', this.form.finding.attachment);
        formData.append('finding', JSON.stringify(this.form.finding));
        for (let key in mappedForm) {
          formData.append(key, mappedForm[key]);
        }

        const uploadDest = this.form.finding.attachment ? `?dest=${'finding/' + this.scheduleDetailData.ledger_itemcheck_id}` : '';
        let data = await api.post(`/tpm/execution/add${uploadDest}`, formData);
        if (data.status === 200) {
          toast.success("Aktivitas berhasil di simpan")
          location.reload();
        } else {
          toast.success("Gagal menyimpan aktivitas. Error : " + data.response.data.message);
        }
      } catch (error) {
        toast.error("Gagal saat menyimpan aktivitas, Detail : " + error);
      }
    },
    async getDetail() {
      try {
        const filter = {
          schedule_id: this.$route.params.id,
          is_detail: this.$route.params.id,
        };

        let {data: {data: response}} = await api.get(`/tpm/schedules/${this.$route.params.id}`, null, null, false);
        if (response) {
          this.getStd(response.itemcheck_std_id);

          this.scheduleDetailData = response;

          this.form = {
            ...this.form,
            actual_user_id: response.actualPic ? {
              user_id: response.actualPic.user_id,
              user_nm: response.actualPic.user_nm,
              noreg: response.actualPic.noreg,
            } : null,
            checked_val: response.checked_val,
          }

          this.start_time = response.actual_check_dt
            ? moment(response.actual_check_dt).format("hh:mm")
            : moment().format("hh:mm");

          this.form.ledger_itemcheck_id = response.ledger_itemcheck_id;
          this.end_time = response.actual_check_dt ? moment(
            response.actual_check_dt || new Date()
          )
            .add(response.duration, "minutes")
            .format("hh:mm") : null;
          this.form.plan_user_id = response.checkers.user_id;
          this.plan_check_dt = response.plan_check_dt ? moment(
            response.plan_check_dt
          ).format("YYYY-MM-DD") : null;

          this.form.ok_val = response.ok_val;
          this.form.ng_val = response.ng_val;

          this.$refs.collapseSparepartList.getItems(response.ledger_itemcheck_id, true);
        }
      } catch (error) {
        console.log(error);
        toast.error("failed fetch detail schedule");
      }
    },
    async getHistoryExecution() {
      try {
        let {data} = await api.get(
          `/tpm/execution`,
          `?schedule_id=${this.$route.params.id}`
        );
        if (data.data) {
          /* this.form.actual_user_id = data.data[0].pic_check[0].user_id
             ? data.data[0].pic_check
             : [];*/
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
    async getStd(itemcheck_std_id) {
      try {
        let {data} = await api.get(
          `/tpm/itemcheck-std`,
          `?itemcheck_std_id=${itemcheck_std_id}`
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
    openManualBook() {
      if (this.scheduleDetailData?.manual_book_file) {
        window.open(this.scheduleDetailData?.manual_book_file, '_blank');
      }
    }
  },
  mounted() {
    this.form.schedule_id = this.$route.params.id;
    this.getDetail();
    this.getUser();
    //await this.getHistoryExecution();
  },
};
</script>

<style>
/*.form-control:disabled,
.form-select:disabled {
  border: 1px solid #00ff3b !important;
}*/
</style>
