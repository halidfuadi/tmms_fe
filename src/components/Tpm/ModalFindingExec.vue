<template>
  <CModal :visible="is_show" backdrop="static" @close="changesShow()">
    <CModalHeader closeButton>TPM Execution Finding</CModalHeader>
    <CModalBody>
      <CRow>
        <CCol lg="6">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Line</span>
            </div>
            <input
              disabled
              type="text"
              class="form-control"
              placeholder="Machine"
              :value="item.line_nm"
            />
          </div>
        </CCol>
        <CCol lg="6">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Machine</span>
            </div>
            <input
              disabled
              type="text"
              class="form-control"
              placeholder="Machine"
              :value="item.machine_nm"
            />
          </div>
        </CCol>
        <CCol lg="12">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Itemcheck</span>
            </div>
            <input
              disabled
              type="text"
              class="form-control"
              placeholder="Machine"
              :value="item.itemcheck_nm"
            />
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol class="mb-2" lg="12">
          <label>Finding</label>
          <CFormInput
            placeholder="What's the problem?"
            disabled
            v-model="item.problem"
          />
        </CCol>
        <CCol class="mb-2" lg="12">
          <label>Plan Date</label>
          <CFormInput
            type="date"
            :value="item.plan_check_dt.split('T')[0]"
            disabled
          />
        </CCol>
        <CCol class="mb-2" lg="12">
          <label>Pic</label>
          <CFormInput type="text" v-model="item.user_nm" disabled />
          <!-- <v-select :options="users" label="user_nm" v-model="item.user_id">
            <template #option="option">
              <span>{{ option.noreg }}-{{ option.user_nm }}</span>
            </template>
            <template #selected-option="option">
              <span>{{ option.noreg }}-{{ option.user_nm }}</span>
            </template>
          </v-select> -->
        </CCol>
        <hr />
        <CCol class="mb-2" lg="12">
          <label>Action / Countermeasure</label>
          <CFormInput
            placeholder="What's the action / countermeasure?"
            v-model="item.action_plan"
          />
        </CCol>
        <CCol class="mb-2" lg="12">
          <label>Actual Date</label>
          <CFormInput type="date" v-model="form.actual_check_dt" />
        </CCol>
        <CCol lg="12">
          <label>Catatan</label>
          <textarea class="form-control" v-model="item.notes"></textarea>
        </CCol>
      </CRow>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" @click="editFinding()">Submit</CButton>{{ ' ' }}
      <CButton @click="changesShow()">Cancel</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
// import api from '@/apis/CommonAPI'
import { mapGetters } from 'vuex'

import moment from 'moment'
import { toast } from 'vue-sonner'

export default {
  name: 'ModalFindingExec',
  data() {
    return {
      users: [],
      is_show: false,
      userSelected: [],
      form: {
        actual_check_dt: moment().format('YYYY-MM-DD'),
        finding_id: null,
        notes: null,
        action_plan: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getSubmitStatus']),
  },
  watch: {
    isShow: function () {
      console.log(this.isShow)
      this.is_show = this.isShow
    },
    getSubmitStatus: {
      handler() {
        this.is_show = false
        this.changesShow()
      },
      deep: true,
    },
    item: {
      handler() {
        console.log(this.item)
      },
      deep: true,
    },
  },
  methods: {
    changesShow() {
      if (this.is_show) {
        this.is_show = false
      } else {
        this.is_show = true
      }
      this.$emit('submitData', this.is_show)
    },
    async editFinding() {
      try {
        this.form.finding_id = this.item.finding_id
        this.form.action_plan = this.item.action_plan
        this.form.notes = this.item.notes
        await this.$store.dispatch('ACT_EDIT_FINDINGS', this.form)
        this.changesShow()
      } catch (error) {
        toast.error('Error add finding')
      }
    },
  },
  props: {
    incharge_id: String,
    isShow: Boolean,
    item: Object,
  },
}
</script>
