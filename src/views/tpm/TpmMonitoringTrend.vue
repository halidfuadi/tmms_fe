<template>
  <CRow>
    <CCol lg="12">
      <ItemAndMPTrends />
    </CCol>
    <CCol>

    </CCol>
  </CRow>
</template>

<script>
import api from "@/apis/CommonAPI";
import ItemAndMPTrends from "../../components/Tpm/ItemAndMPtrends.vue";

export default {
  name: 'TpmMonitoringTrend',

  components: {
    ItemAndMPTrends,
  }
}
</script>
