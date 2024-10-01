<template>
  <div>
  <CContainer fluid>
    <CRow>
      <CCol :md="12">
        <SearchBarSparepart />
        <TableSparepart />
      </CCol>
    </CRow>
  </CContainer>
</div>
</template>

<script>
import api from "@/apis/CommonAPI";
import { Toaster } from "vue-sonner";

import SearchBarSparepart from "@/components/Tpm/SearchBarSparepart";
import TableSparepart from "@/components/Tpm/TableSparepart";

export default {
  name: "TpmSparepart",
  data() {
    return {};
  },
  computed: {},

  methods: {},
  async mounted() {},

  components: {
    SearchBarSparepart,
    TableSparepart,
  },
};
</script>

<style scoped></style>
