<template>
  <div>
  <CContainer fluid>
    <CRow>
      <CCol md="12">
        <Toaster position="top-center" closeButton />
        <ModalFindingExec
          v-if="detailItem"
          :isShow="isShow"
          :item="detailItem"
          @submitData="submitData(st)"
        />
        <SearchBarFinding @getFindings="getFindings" />
        <CCard>
          <CCardBody>
            <CRow>
              <CCol class="overflow-auto">
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Line</th>
                      <th>Machine</th>
                      <th>Item Check</th>
                      <th>Problem</th>
                      <th>Action / Countermeasure</th>
                      <th>Pic</th>
                      <th>Plan Date</th>
                      <th>Actual Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody v-if="GETTER_FINDINGS.length > 0 && !isLoading">
                    <tr
                      v-for="(finding, i) in GETTER_FINDINGS"
                      :key="finding.finding_id"
                    >
                      <td>{{ i + 1 }}</td>
                      <td>
                        {{ finding.line_nm }}
                      </td>
                      <td>
                        {{ finding.machine_nm }}
                      </td>
                      <td>
                        {{ finding.itemcheck_nm }}
                      </td>
                      <td>
                        {{ finding.problem }}
                      </td>
                      <td>
                        {{ finding.action_plan }}
                      </td>
                      <td>
                        {{ finding.user_nm }}
                      </td>
                      <td>
                        {{ finding.plan_check_dt.split("T")[0] }}
                      </td>
                      <td>
                        {{
                          finding.actual_check_dt
                            ? finding.actual_check_dt.split("T")[0]
                            : "Belum"
                        }}
                      </td>
                      <td>
                        <CBadge
                          class="text-dark"
                          :style="`background-color: ${finding.color_tag}`"
                          shape="pill"
                        >
                          {{ finding.status_nm }}
                        </CBadge>
                      </td>
                      <td>
                        <div class="d-grid d-md-flex">
                          <button class="btn btn-sm btn-info mx-2" @click="">
                            Image
                          </button>
                          <button
                            class="btn btn-sm btn-success"
                            @click="popUpDetail(finding)"
                          >
                            Execute
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else-if="isLoading">
                    <tr>
                      <th class="text-center" colspan="11">
                        <CSpinner
                          component="span"
                          size="sm"
                          variant="grow"
                          aria-hidden="true"
                        />
                        Loading...
                      </th>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <th class="text-center" colspan="11">Tidak Ada Data</th>
                    </tr>
                  </tbody>
                </table>
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
import SearchBarFinding from "@/components/Tpm/SearchBarFinding";
import { toast } from "vue-sonner";
import { mapGetters } from "vuex";
import ModalFindingExec from "@/components/Tpm/ModalFindingExec";

export default {
  name: "TpmFindings",
  data() {
    return {
      isShow: false,
      detailItem: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(["GETTER_FINDINGS"]),
  },
  methods: {
    async getFindings(filter) {
      try {
        this.isLoading = true;
        await this.$store.dispatch("ACT_GET_FINDINGS", filter);
        this.isLoading = false;
      } catch (error) {
        toast.error("Failed to get findings");
      }
    },
    popUpDetail(detail) {
      this.detailItem = detail;
      setTimeout(() => {
        this.isShow = true;
      }, 200);
    },
    submitData(state) {
      console.log(state);
      this.isShow = state;
    },
  },
  components: {
    SearchBarFinding,
    ModalFindingExec,
  },
};
</script>

<style scoped>
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  background: white;
}
</style>
