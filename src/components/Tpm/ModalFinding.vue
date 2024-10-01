<template>
  <CModal :visible="is_show" backdrop="static" @close="() => {
    is_show = false
    $emit('close-modal', false)
  }">
    <CModalHeader closeButton>TPM Finding Abnormality</CModalHeader>
    <CModalBody>
      <CRow>
        <CCol class="mb-2" lg="12">
          <label>Problem</label>
          <CFormInput placeholder="What's the problem?" v-model="finding.problem" />
        </CCol>
        <CCol class="mb-2" lg="12">
          <label>Action / Countermeasure</label>
          <CFormTextarea placeholder="What's the action / countermeasure?" v-model="finding.action_plan" />
        </CCol>
        <CCol class="mb-2" lg="12">
          <label>Plan Date</label>
          <CFormInput type="date" v-model="finding.plan_check_dt" :disabled="is_already_check" />
        </CCol>
        <CCol class="mb-2" lg="12">
          <CFormInput type="file" v-model="finding.file_path" label="Input Finding Image" />
        </CCol>
        <CCol lg="12">
          <label>Pic</label>
          <v-select :options="users" label="user_nm" v-model="finding.user_id">
            <template #option="option">
              <span>{{ option.noreg }}-{{ option.user_nm }}</span>
            </template>
            <template #selected-option="option">
              <span>{{ option.noreg }}-{{ option.user_nm }}</span>
            </template>
          </v-select>
        </CCol>
      </CRow>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" @click="changesShow()">Assign</CButton>{{ ' ' }}
      <CButton @click="() => {
    is_show = false
    $emit('close-modal', false)
  }">Cancel</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import api from '@/apis/CommonAPI'
import { mapGetters } from 'vuex'

import moment from 'moment'

export default {
  name: 'ModalFinding',
  data() {
    return {
      users: [],
      is_show: false,
      userSelected: [],
    }
  },
  computed: {
    getUserId() {
      return this.finding.user_id
    },
  },
  watch: {
    incharge_id: function () {
      if (this.incharge_id) this.getUsers(this.incharge_id)
    },
    isShow: function () {
      this.is_show = this.isShow
    },
    getSubmitStatus: {
      handler() {
        this.is_show = false
        if (this.is_show) {
          this.changesShow()
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(['getSubmitStatus']),
  },
  methods: {
    async getUsers(incharge_id = null) {
      try {
        let { data } = await api.get(
          `/tpm/users`,
          `?incharge_id=${incharge_id}`,
        )
        console.log(data)
        this.users = data.data
      } catch (error) {
        console.log(error)
      }
    },
    changesShow() {
      this.finding.user_id = this.finding.user_id.user_id

      if (this.is_show) {
        this.is_show = false
      } else {
        this.is_show = true
      }
      let obj = {
        is_show: this.is_show,
        finding: this.finding,
      }
      this.$emit('submit', obj)
    },
  },
  mounted() {
    this.getUsers()
  },
  props: {
    incharge_id: String,
    isShow: Boolean,
    finding: Object,
  },
}
</script>
