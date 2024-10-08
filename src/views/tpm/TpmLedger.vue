<template>
  <CRow>
    <CContainer fluid>
      <CRow>
        <CCol lg="12">
          <Toaster position="top-center" closeButton/>
          <CCard class="mb-3 p-2">
            <CRow>
              <CCol lg="6">
                <SearchBarLedger @getLedgers="getLedgers" @changeView="handleChangeView"/>
              </CCol>
              <CCol lg="6">
                <AddLedger/>
              </CCol>
            </CRow>
          </CCard>
          <CCard class="mb-3 p-2">
            <div class="d-flex gap-2">
              <div class="flex-grow-1"></div>
              <div class="d-flex gap-2 align-items-center">
                <div>
                  <CButton
                    class="btn btn-sm text-white" color="info" @click="onClickItemCheckRequest(true)">
                    <span>New Items</span>
                    <CBadge color="danger" class="ms-2 text-white">1</CBadge>
                  </CButton>
                </div>
                <div>
                  <CButton
                    class="btn btn-sm text-white" color="info" @click="onClickItemCheckRequest(false)">
                    <span>Changes Items</span>
                    <CBadge color="danger" class="ms-2 text-white">1</CBadge>
                  </CButton>
                </div>
              </div>
            </div>
          </CCard>
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
                    <tbody v-if="ledgers?.length > 0 && !isLoading">
                    <tr v-for="(ledger, i) in ledgers" :key="i">
                      <td class="text-center">
                        {{ ledger?.no }}
                      </td>
                      <td class="text-center">{{ ledger?.line_nm }}</td>
                      <td class="text-center">{{ ledger?.machine_nm }}</td>
                      <td class="text-center">
                        <CBadge class="text-light bg-dark" shape="pill">{{
                            ledger?.num_item_checks
                          }}
                        </CBadge>
                      </td>
                      <td class="align-center">
                        <div class="d-flex justify-content-center">
                          <CButton class="btn btn-sm col me-3 text-white" color="success" @click="showDetail(ledger)"
                                   style="max-width: 100px">
                            Item Check
                          </CButton>
                          <CButton class="btn btn-sm col text-white" color="danger" style="max-width: 100px">
                            Delete
                          </CButton>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                    <tbody v-else-if="isLoading">
                    <tr>
                      <th class="text-center" colspan="5">
                        <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                        Loading...
                      </th>
                    </tr>
                    </tbody>
                  </table>

                  <table v-else class="table table-bordered table-striped">
                    <thead>
                    <tr>
                      <th class="text-center">No</th>
                      <th class="text-center">Method</th>
                      <th class="text-center">Itemcheck Name</th>
                      <th class="text-center">Total Machines</th>
                      <th class="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody v-if="items && items.length > 0 && !isLoading">
                    <tr v-for="(item, i) in items" :key="i">
                      <td class="text-center">
                        {{ item?.no }}
                      </td>
                      <td class="text-center">{{ item?.method_check }}</td>
                      <td class="text-center">{{ item?.itemcheck_nm }}</td>
                      <td class="text-center">
                        <CBadge class="text-light bg-dark" shape="pill">{{
                            item?.total_machines
                          }}
                        </CBadge>
                      </td>
                      <td class="align-center">
                        <div class="d-flex justify-content-center">
                          <CButton class="btn btn-sm col me-3 text-white" color="success"
                                   @click="showItemCheckDetail(item)"
                                   style="max-width: 100px">
                            Detail
                          </CButton>
                          <CButton class="btn btn-sm col text-white" color="danger" style="max-width: 100px">
                            Delete
                          </CButton>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                    <tbody v-else-if="isLoading">
                    <tr>
                      <th class="text-center" colspan="5">
                        <CSpinner component="span" size="sm" variant="grow" aria-hidden="true"/>
                        Loading...
                      </th>
                    </tr>
                    </tbody>
                  </table>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <div class="card-footer">
                <div class="d-flex justify-content-between">
                  <div>
                    <div class="input-group mb-3">
                      <label class="input-group-text">Limit</label>
                      <select class="form-select" v-model="limit"
                              @change="handleLimitChange($event)">
                        <option selected value="10">10</option>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="60">60</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <CustPagination :totalItems="totalData" :items-per-page="limit"
                                    :current-page="currentPage"
                                    @page-changed="handlePageChange($event)"/>
                  </div>
                </div>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
    <ModalItemcheck :isShow="isShow" :ledger_id="ledger_id" :machine_nm="machine_nm"
                    @showChanges="showChanges(state)"/>
    <ModalItemCheckDetail :visible="isVisibleDetailItemCheck" :item="selectedItemCheck"
                          @on-close="onCloseItemCheckDetail"/>
    <ModalItemCheckRequest :visible="isVisibleItemCheckRequest" @on-close="onCloseItemCheckRequest" :is-new="isClickNewItemRequest"/>
  </CRow>
</template>

<script>
import api from "@/apis/CommonAPI";
import {toast, Toaster} from "vue-sonner";

import ModalItemcheck from "@/components/Tpm/ModalItemcheck";
import SearchBarLedger from "@/components/Tpm/SearchBarLedger";
import StatusTpm from "../../views/charts/StatusTpm.vue";
import NewUpdate from "@/components/Tpm/NewUpdate";
import AddLedger from "../../components/Tpm/AddLedger.vue";
import {getUpdate, getUpdatedItem} from "../../components/Tpm/NewUpdate.vue";
import CustPagination from "@/components/Tpm/CustPagination.vue";
import ModalItemCheckDetail from "@/components/Tpm/ModalItemCheckDetail.vue";
import ModalItemCheckRequest from "@/components/Tpm/ModalItemCheckRequest.vue";

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
      limit: 20,
      totalData: 0,
      isVisibleDetailItemCheck: false,
      selectedItemCheck: null,
      isVisibleItemCheckRequest: false,
      isClickNewItemRequest: false,
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
    isItemCheck() {
      return this.currentView === "machineAndLine";
    }
  },
  methods: {
    async getLedgers(filter) {
      try {
        this.isLoading = true;
        if (filter?.isItemCheckView) {
          this.currentView = "itemCheck";
        }

        if (!filter) {
          filter = this.filter;
        } else {
          this.filter = filter;
        }

        this.filter = {
          ...this.filter,
          page: this.currentPage,
          limit: this.limit,
        };

        const mappedFilter = {};
        for (let key in this.filter) {
          if (this.filter[key]) {
            Object.assign(mappedFilter, {[key]: this.filter[key]});
          }
        }

        if (mappedFilter?.isItemCheckView) {
          delete mappedFilter.isItemCheckView;
        }

        const query = new URLSearchParams(mappedFilter);
        if (this.currentView === "machineAndLine") {
          let {data: response} = await api.get(`/tpm/ledgers`, `?${query.toString()}`);
          this.ledgers = response?.data;
          this.totalData = response?.paginated?.total ?? 0;
        } else {
          let {data: response} = await api.get(`/tpm/itemchecks`, `?${query.toString()}`);
          this.items = response?.data;
          this.totalData = response?.paginated?.total ?? 0;
        }
        console.log('ledgers', this.ledgers);
      } catch (error) {
        console.log(error);
        toast.error("Terjadi kesalahan saat mengambil data");
      } finally {
        this.isLoading = false;
      }
    },
    async getItems(filter) {
      try {
        let items = await api.get(`/tpm/itemchecks`, filter ? "?" + filter : "");
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
      this.machine_nm = ledger.machine_nm;

      this.$router.push({
        name: "TpmLedgerDetail",
        params: {id: ledger.ledger_id},
      });
    },
    handleChangeView(view) {
      this.currentView = view;
      this.filter = null;
      this.getLedgers();
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    handleLimitChange(event) {
      this.limit = event.target.value;
      this.getLedgers();
    },
    handlePageChange(event) {
      this.currentPage = event;
      this.getLedgers();
    },
    showItemCheckDetail(item = null) {
      this.selectedItemCheck = item;
      this.isVisibleDetailItemCheck = true;
    },
    onCloseItemCheckDetail() {
      this.selectedItemCheck = null;
      this.isVisibleDetailItemCheck = false;
    },
    onClickItemCheckRequest(isNew = false) {
      this.isVisibleItemCheckRequest = true;
      this.isClickNewItemRequest = isNew;
    },
    onCloseItemCheckRequest() {
      this.isVisibleItemCheckRequest = false;
    }
  },
  async mounted() {
    /*await this.getLedgers();
    await this.getItems();*/
  },
  components: {
    ModalItemCheckRequest,
    ModalItemCheckDetail,
    CustPagination,
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
