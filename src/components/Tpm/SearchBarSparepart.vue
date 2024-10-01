<template>
  <CCard class="mb-2" style="z-index: 1;">
    <CCardHeader>
      Search
    </CCardHeader>
    <CCardBody>
      <CRow class="mb-3">
        <treeselect v-model="form.sparepart_id" :multiple="true" :options="sparepart" placeholder="Select Part" />
      </CRow>
      <CRow>
        <CCol lg="12">
          <CButton class="w-100" color="outline-dark" @click="search">
            Search
          </CButton>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import moment from 'moment'
import api from '@/apis/CommonAPI'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

export default {
  name: 'SearchBarLedger',
  data() {
    return {
      form: {
        line_id: null,
        machine_id: null,
      },
      machine: [],
      line: [],
    }
  },
  components: { Treeselect },
  methods: {
    search() {
      let mapForm = Object.keys(this.form).map((key) => `${key}=${this.form[key]}`).join('&')
      console.log(mapForm);
      this.$emit('getLedgers', mapForm)
    },
    async getSparepart(filter = {}) {
      try {
        let sparepart = await api.post(`/tpm/filter/sparepart`, filter)
        console.log(filter);
        let mapSparepart = await sparepart.data.data.map(item => {
          return {
            id: item.sparepart_id,
            label: item.sparepart_nm
          }
        })
        this.sparepart = mapSparepart
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.getSparepart()
  },
}
</script>
