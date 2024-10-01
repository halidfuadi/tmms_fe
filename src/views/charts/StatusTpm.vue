<template>
  <!-- Start:Status -->
  <CCard class="mb-1">
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader> Status </CCardHeader>
          <CCardBody v-if="!isLoading">
            <CRow>
              <CCol v-for="stat in status" :key="stat.status_nm">
                <div class="input-group input-group-sm mb-3">
                  <div class="input-group-prepend">
                    <CInputGroup shape="pill">
                      <CInputGroupText class="input-group-text text-dark"
                        :style="`background-color: ${stat.color_tag}; font-weight: bold;`">
                        {{ stat.status_nm }}
                      </CInputGroupText>
                      <CFormInput disabled type="text" class="form-control" style="font-weight: bold"
                        :value="stat.count" />
                    </CInputGroup>
                  </div>
                </div>
                <CProgress animated color="info" style="font-size: 14px; font-weight: bold" height="30"
                  :value="stat.percent">
                  {{ stat.percent }}%
                </CProgress>
              </CCol>
              <CCol>
                <CInputGroup shape="pill">
                  <CInputGroupText class="input-group-text text-dark bg-secondary" :style="`font-weight: bold`">
                    TOTAL
                  </CInputGroupText>
                  <CFormInput disabled type="text" class="form-control" style="font-weight: bold" :value="total" />
                </CInputGroup>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardBody v-else>
            <CSpinner as="span" size="lg" aria-hidden="true" />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CCard>
  <!-- End:Status -->
</template>

<script>
import { CSpinner } from "@coreui/vue";
import api from "@/apis/CommonAPI";
import { CInputGroup } from "@coreui/vue";
export default {
  name: "StatusTpm",
  data() {
    return {
      status: null,
      total: 0,
      isLoading: true,
    };
  },
  watch: {
    filter: function () {
      if (this.filter) this.getStatus(this.filter);
    },
  },
  methods: {
    async getStatus(filter) {
      try {
        const statusResponse = await api.get(`/tpm/statusTpm`, "?" + filter);
        const statusData = statusResponse.data.data;

        let sum = 0;

        // Combine sum calculation and percentage assignment in a single loop
        statusData.forEach((item) => {
          sum += item.count;
        });

        statusData.forEach((item) => {
          item.percent = sum > 0 ? Math.ceil((item.count / sum) * 100) : 0;
        });

        // Set the status and total once after processing
        this.status = statusData;
        this.total = sum;
        this.isLoading = false;

      } catch (error) {
        console.log(error);
      }
    }

  },
  props: {
    filter: String,
  },
};
</script>
