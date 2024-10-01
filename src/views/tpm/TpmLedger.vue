<template>
  <div>
  <CContainer fluid>
    <CRow>
      <CCol lg="12">
        <Toaster position="top-center" closeButton />
        <CCard class="mb-3 p-2">
          <CRow>
            <CCol lg="4">
              <SearchBarLedger @getLedgers="getLedgers" @changeView="handleChangeView" />
              <AddLedger />
            </CCol>
            <CCol lg="8">
              <NewUpdate ref="NewUpdated" />
            </CCol>
          </CRow>
        </CCard>
        <ModalItemcheck :isShow="isShow" :ledger_id="ledger_id" :machine_nm="machine_nm"
          @showChanges="showChanges(state)" />
        <CCard class="mb-5">
          <CCardBody>
            <CRow>
              <CCol class="overflow-auto tableFixHead" lg="12">
                <table v-if="currentView === 'machineAndLine'" class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th class="text-center">No</th>
                      <th class="text-center">Line</th>
                      <th class="text-center">Machine</th>
                      <th class="text-center">Total Itemcheck</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody v-if="paginatedLedgers.length > 0 && !isLoading">
                    <tr v-for="(ledger, i) in paginatedLedgers" :key="i">
                      <td class="text-center">
                        {{ (currentPage - 1) * rowsPerPage + i + 1 }}
                      </td>
                      <td class="text-center">{{ ledger?.line_nm }}</td>
                      <td class="text-center">{{ ledger?.machine_nm }}</td>
                      <td class="text-center">
                        <CBadge class="text-light bg-dark" shape="pill">{{
                ledger?.num_item_checks
              }}</CBadge>
                      </td>
                      <td class="align-center">
                        <div class="d-flex justify-content-center">
                          <CButton class="btn btn-sm col me-3" color="success" @click="showDetail(ledger)"
                            style="max-width: 100px">
                            ITEMCHECKS
                          </CButton>
                          <CButton class="btn btn-sm col" color="danger" style="max-width: 100px">
                            DELETE
                          </CButton>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else-if="isLoading">
                    <tr>
                      <th class="text-center" colspan="5">
                        <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                        Loading...
                      </th>
                    </tr>
                  </tbody>
                </table>

                <table v-else class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th class="text-center">No</th>
                      <th class="text-center">Total Machine</th>
                      <th class="text-center">Itemcheck Name</th>
                      <th class="text-center" colspan="2">Periods</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody v-if="paginatedItems.length > 0 && !isLoading">
                    <tr v-for="(ledger, i) in paginatedItems" :key="i">
                      <td class="text-center">
                        {{ (currentPage - 1) * rowsPerPage + i + 1 }}
                      </td>
                      <td class="text-center">{{ ledger?.machine_nm }}</td>
                      <td class="text-center">{{ ledger?.itemcheck_nm }}</td>
                      <td class="text-center">{{ ledger?.val_periodic }}</td>
                      <td class="text-center">{{ ledger?.period_nm }}</td>
                      <td class="align-center">
                        <div class="d-flex justify-content-center">
                          <CButton class="btn btn-sm col me-3" color="success" @click="showDetail(ledger)"
                            style="max-width: 100px">
                            ITEMCHECKS
                          </CButton>
                          <CButton class="btn btn-sm col" color="danger" style="max-width: 100px">
                            DELETE
                          </CButton>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else-if="isLoading">
                    <tr>
                      <th class="text-center" colspan="5">
                        <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                        Loading...
                      </th>
                    </tr>
                  </tbody>
                </table>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <CButton class="mx-3" color="warning" @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1">Previous</CButton>
                <CButton color="info" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next
                </CButton>
              </div>
              <div>Page {{ currentPage }} of {{ totalPages }}</div>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</div>
</template>

<script>
import api from "@/apis/CommonAPI";
import { Toaster } from "vue-sonner";

import ModalItemcheck from "@/components/Tpm/ModalItemcheck";
import SearchBarLedger from "@/components/Tpm/SearchBarLedger";
import StatusTpm from "../../views/charts/StatusTpm.vue";
import NewUpdate from "@/components/Tpm/NewUpdate";
import AddLedger from "../../components/Tpm/AddLedger.vue";
import { getUpdate, getUpdatedItem } from "../../components/Tpm/NewUpdate.vue";

export default {
  name: "TpmLedger",
  data() {
    return {
      filtered: {
        currentPage: 1,
      },
      isLoading: false,
      rowsPerPage: 50,
      maxVisible: 50,
      modelValue: 100,

      isShow: false,
      filter: null,
      schedule_id: null,
      approval: null,

      ledgers: [],
      items: [],
      ledger_id: null,
      line_nm: null,
      machine_nm: null,
      num_item_checks: null,
      rowsNumber: 1,
      currentPage: 1,
      currentView: "machineAndLine", // Track current view condition

      limitOpts: [
        {
          label: 5,
          value: 5,
        },
        {
          label: 10,
          value: 10,
        },
        {
          label: 100,
          value: 100,
        },
        {
          label: "All",
          value: -1,
        },
      ],
    };
  },
  computed: {
    totalPages() {
      if (this.currentView === "machineAndLine") {
        return Math.ceil(this.ledgers.length / this.rowsPerPage);
      } else {
        return Math.ceil(this.items.length / this.rowsPerPage);
      }
    },
    paginatedLedgers() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.ledgers.slice(start, end);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.items.slice(start, end);
    },
  },
  methods: {
    async getLedgers(filter) {
      try {
        if (this.currentView == "machineAndLine") {
          this.filter = filter;
          let ledgers = await api.get(`/tpm/ledgers`, "?" + filter);
          this.ledgers = ledgers.data.data;
        } else {
          this.filter = filter;
          let items = await api.get(`/tpm/itemchecks`, "?" + filter);
          console.log(items);
          this.items = items.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getItems(filter) {
      try {
        this.filter = filter;
        let items = await api.get(`/tpm/itemchecks`, "?" + filter);
        console.log(items);
        this.items = items.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    showChanges(state) {
      this.isShow = state;
      this.$refs.NewUpdated.getUpdate();
      this.$refs.NewUpdated.getUpdatedItem();
    },
    async showDetail(ledger) {
      this.isLoading = true;
      this.machine_nm = ledger.machine_nm;
      this.ledger_id = ledger.ledger_id;
      console.log(this.ledger_id);
      setTimeout(() => {
        this.showChanges(true);
        this.isLoading = false;
      }, 500);
      this.getLedgers(this.filter);
    },
    handleChangeView(view) {
      this.currentView = view;
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  async mounted() {
    await this.getLedgers();
    await this.getItems();
  },
  components: {
    SearchBarLedger,
    NewUpdate,
    StatusTpm,
    ModalItemcheck,
    Toaster,
    AddLedger,
  },
};
</script>

<style scoped>
.line {
  max-width: 50px;
}

.no {
  max-width: 20px;
}

.item-check {
  max-width: 20px;
}

.mc {
  max-width: 50px;
}

th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  background: white;
}

.tableFixHead {
  overflow-y: auto;
  height: 800px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.pagination button {
  margin: 0 0.5rem;
}
</style>
