<template>
  <CRow>
    <CCol lg="12">
      <Toaster position="top-center" closeButton />
      <!-- <SearchBarMaster
        :isShow="is_finding"
        :finding="form.finding"
        @submit="submitFinding"
      /> -->
      <SearchBarMaster/>
    </CCol>
  </CRow>
</template>

<script>
import { Toaster } from 'vue-sonner'
import SearchBarMaster from '@/components/Tpm/SearchBarMaster.vue'
export default {
  name: 'TpmMasterPlant',
  components: {
    Toaster,
    SearchBarMaster,
  },
}
</script>
