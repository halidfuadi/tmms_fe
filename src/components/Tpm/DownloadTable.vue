<template>
  <CCard>
    <CCardHeader>
      DOWNLOAD MASTER LEDGER
    </CCardHeader>
    <CCardBody>
      <CRow>
        <CCol>
          
        </CCol>
      </CRow>
      <Crow>
      </Crow>
    </CCardBody>
  </CCard>
</template>

<script>
import JsonExcel from "vue-json-excel";

export default {
  name: "DownloadTable",
  data() {
    return {
      json_data: [],
      excelFields: {

      }
    };
  },

  methods: {
    fetchMasterData() {

    }
  },

  mounted() {
    this.fetchMasterData();
  },

  components: {
    JsonExcel
  },
}
</script>
