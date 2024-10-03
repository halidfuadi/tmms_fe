<template>
  <!-- Start:Status -->
  <CCard class="mb-1">
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Status</CCardHeader>
          <CCardBody v-if="!isLoading">
            <div class="d-flex flex-wrap gap-2">
              <div class="col-2" v-for="stat in status" :key="stat.status_nm">
                <div class="input-group input-group-sm mb-3">
                  <div class="input-group-prepend">
                    <CInputGroup shape="pill">
                      <CInputGroupText class="input-group-text"
                                       :style="`background-color: ${stat.color_tag}; font-weight: bold; text-color: ${colorIsDarkAdvanced(stat.color_tag)}`">
                        {{ stat.status_nm }}
                      </CInputGroupText>
                      <CFormInput disabled type="text" class="form-control" style="font-weight: bold"
                                  :value="stat.count"/>
                    </CInputGroup>
                  </div>
                </div>
                <div class="position-relative" style="height: 30px;">
                  <CProgress animated style="height: 30px; font-size: 14px; font-weight: bold" color="info"
                             :value="stat.percent"/>
                  <span class="position-absolute"
                        :style="`top: 50%; left: 50%; transform: translate(-50%, -50%); color: ${colorIsDarkAdvanced(stat.percent > 50 ? '#000000' : '#FFFFFF')}`">{{
                      stat.percent
                    }}%</span>
                </div>
              </div>
              <div class="col">
                <CInputGroup shape="pill">
                  <CInputGroupText class="input-group-text text-dark bg-secondary" :style="`font-weight: bold`">
                    TOTAL
                  </CInputGroupText>
                  <CFormInput disabled type="text" class="form-control" style="font-weight: bold" :value="total"/>
                </CInputGroup>
              </div>
            </div>
          </CCardBody>
          <CCardBody v-else class="d-flex justify-content-center">
            <CSpinner component="span" size="lg" aria-hidden="true">
              Loading...
            </CSpinner>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CCard>
  <!-- End:Status -->
</template>

<script>
import {CSpinner} from "@coreui/vue";
import api from "@/apis/CommonAPI";
import {CInputGroup} from "@coreui/vue";

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
    filter: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getStatus(this.filter)
        }
      }
    }
  },
  methods: {
    async getStatus(filter) {
      try {
        delete filter.limit;
        delete filter.page;

        this.isLoading = true;
        const query = new URLSearchParams(filter);
        const statusResponse = await api.get(`/tpm/statusTpm`, "?" + query.toString());
        if (statusResponse?.data?.data) {
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
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    colorIsDarkAdvanced(bgColor) {
      let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
      let r = parseInt(color.substring(0, 2), 16); // hexToR
      let g = parseInt(color.substring(2, 4), 16); // hexToG
      let b = parseInt(color.substring(4, 6), 16); // hexToB
      let uicolors = [r / 255, g / 255, b / 255];
      let c = uicolors.map((col) => {
        if (col <= 0.03928) {
          return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
      });
      let L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
      return L <= 0.179 ? '#FFFFFF' : '#000000';
    }
  },
  props: {
    filter: String,
  },
};
</script>
