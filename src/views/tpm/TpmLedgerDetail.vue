<template>
  <CCard>
    <CCardHeader><h5 class="fw-bold">Item Check</h5></CCardHeader>
    <CCardBody>
      <CRow>
        <CCol lg="6">
          <CRow>
            <CCol lg="6">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Line</span>
                </div>
                <input disabled type="text" class="form-control" placeholder=""
                       :value="items && items.length > 0 ? items[0].line_nm : ''"/>
              </div>
            </CCol>
            <CCol lg="6">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Machine</span>
                </div>
                <input disabled type="text" class="form-control" placeholder="Machine"
                       :value="items && items.length > 0 ? items[0].machine_nm : ''"/>
              </div>
            </CCol>
          </CRow>
        </CCol>
        <CCol class="text-end" lg="6">
          <CButton class="btn btn-sm col mx-3 text-white" color="info" @click="showItemCheckDetail(null)"
                   style="max-width: 150px; margin-bottom: 5px;">
            Add New Itemcheck
          </CButton>
        </CCol>
      </CRow>
      <CRow v-if="is_add">
        <AddItemcheck :ledger_id="id_ledger" :machine_nm="machine_nm"/>
      </CRow>
      <CRow>
        <CCol class="overflow-auto" lg="12">
          <table class="table table-bordered table-striped" responsive="md">
            <thead>
            <tr>
              <th class="no text-center">No</th>
              <th class="item-check text-center">Item Check</th>
              <th class="item-check text-center">Details</th>
              <th class="item-check text-center">Item Location</th>
              <th class="item-check text-center" colspan="2">Periodic</th>
              <th class="item-check text-center">MP</th>
              <th class="item-check text-center">Duration</th>
              <th class="item-check text-center">Standard</th>
              <th class="item-check text-center">Methods</th>
              <th class="item-check text-center">Incharge</th>
              <th class="item-check text-center">Upper</th>
              <th class="item-check text-center">Lower</th>
              <!-- <th class="item-check text-center">Plan Check Date</th> -->
              <th class="actions text-center">Actions</th>
            </tr>
            </thead>

            <tbody v-if="items && items.length > 0">
            <tr v-for="(item, i) in items" :key="i">
              <td class="text-center">{{ item?.no }}</td>
              <td class="item-check text-center">{{ item?.itemcheck_nm }}</td>
              <td class="item-check text-center">
                <CFormTextarea v-model="item.details" :value="item?.details" disabled/>
              </td>
              <td class="item-check text-center">{{ item?.itemcheck_loc }}</td>
              <td v-if="!item.is_counter" class="item-check text-center">
                {{ item?.val_periodic }}
              </td>
              <td v-if="item.is_counter" class="item-check text-center">
                {{ item?.lifespan_counter }}
              </td>
              <td v-if="!item.is_counter" class="item-check text-center">
                {{ item.period_nm }}
              </td>
              <td v-if="item.is_counter" class="item-check text-center">
                CYCLE
              </td>
              <td class="item-check text-center">{{ item?.mp }}</td>
              <td class="item-check text-center">{{ item?.duration }}</td>
              <td class="item-check text-center">
                {{ item?.standard_measurement == '' ? "OK" : item?.standard_measurement }}
              </td>
              <td class="item-check text-center">
                {{ item?.method_check }}
              </td>
              <td class="item-check text-center">
                {{ item?.incharge_nm }}
              </td>
              <td class="item-check text-center">
                {{ item?.upper_limit }}
              </td>
              <td class="item-check text-center">
                {{ item?.lower_limit }}
              </td>
              <!-- <td class="item-check text-center">
                {{ item?.plan_check_dt.split('T')[0] }}
              </td> -->
              <td class="d-flex justify-content-center">
                <CButton class="btn btn-sm col text-white" color="warning" @click="showItemCheckDetail(item)"
                         style="max-width: 100px; margin-bottom: 5px;">
                  EDIT
                </CButton>
              </td>
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
              <select
                class="form-select"
                v-model="limit"
                @change="handleLimitChange($event)"
              >
                <option selected value="10">10</option>
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="60">60</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div>
            <CustPagination
              :totalItems="totalData"
              :items-per-page="limit"
              :current-page="currentPage"
              @page-changed="handlePageChange($event)"
            />
          </div>
        </div>
      </div>
    </CCardFooter>
  </CCard>
  <ModalItemCheckDetail :visible="isVisibleDetail" :item="selectedItem"
                        :line-name="items && items.length > 0 ? items[0].line_nm : ''"
                        :machine-name="items && items.length > 0 ? items[0].machine_nm : ''"
                        :line-id="items && items.length > 0 ? items[0].line_id : ''"
                        :ledger-id="items && items.length > 0 ? items[0].ledger_id : ''"
                        @on-close="onCloseItemDetail($event)"/>
  <CModal :visible="is_deleting" :item="item" @close="() => { is_deleting = false }">
    <CModalHeader>
      <CModalTitle>Are you sure to delete this item?</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <table class="table table-bordered table-striped" responsive="md">
        <thead>
        <tr>
          <th class="item-check text-center">Item Check</th>
          <th class="item-check text-center">Periodic</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="item-check text-center">{{ item.itemcheck_nm }}</td>
          <td class="item-check text-center">{{ item.val_periodic }} {{ item.period_nm }}</td>
        </tr>
        </tbody>
      </table>
      <CFormTextarea v-model="item.reason" placeholder="Insert Reason"/>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { is_deleting = false }">
        Close
      </CButton>
      <CButton color="danger" @click="submitDeleting(item)">Delete</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import api from "@/apis/CommonAPI";
import {mapGetters} from "vuex";
import AddItemcheck from "@/components/Tpm/AddItemcheck";
import {toast} from "vue-sonner";
import ModalItemCheckDetail from "@/components/Tpm/ModalItemCheckDetail.vue";
import CustPagination from "@/components/Tpm/CustPagination.vue";

export default {
  name: "TpmLedgerDetail",
  data() {
    return {
      users: [],
      is_show_sparepart: false,
      items: [],
      counter: [],
      id_ledger: null,
      is_add: false,
      is_deleting: false,
      item: null,
      inchargeOptions: [],
      options: [
        {label: 'Periodic', value: 0},
        {label: 'Counter', value: 1}
      ],
      selected: 0,
      machine_nm: null,
      isVisibleDetail: false,
      selectedItem: null,
      limit: 20,
      totalData: 0,
      currentPage: 1,
      filter: null,
    };
  },
  watch: {
    getSubmitStatus: {
      handler() {
        console.log(this.getSubmitStatus);
        this.changesShow();
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["getSubmitStatus"]),
  },
  methods: {
    async getItems(filter = null) {
      try {
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

        const query = new URLSearchParams(mappedFilter);

        let items = await api.get(`/tpm/itemchecks`, `?ledger_id=${this.id_ledger}&${query.toString()}`);
        this.items = items.data.data;
        this.machine_nm = this.items && this.items.length > 0 ? this.items[0].machine_nm : null;
        this.totalData = items?.data?.paginated?.total ?? 0;
      } catch (error) {
        console.log(error);
      }
    },
    submitDeleting(item) {
      this.$store.dispatch('ACT_DELETE_ITEMCHECK', item);
      this.is_deleting = false;
      this.getItems();
    },
    deleting(item) {
      this.is_deleting = !this.is_deleting;
      this.item = item;
    },
    changesShow() {
      this.userSelected = [];
      if (this.items.is_editing) {
        this.items.is_editing = false;
      } else {
        this.items.is_editing = true;
      }
      if (this.is_show) {
        this.is_show = false;
        this.is_add = false;
      } else {
        this.is_show = true;
      }
      this.$emit("showChanges", this.is_show);
    },
    async info(item) {
      this.is_show_sparepart = !this.is_show_sparepart;
    },
    changeAdd() {
      this.is_add = !this.is_add;
    },
    async editData(item) {
      try {
        console.log(item);
        item.ledger_id = this.id_ledger;
        console.log(item);
        this.$store.dispatch('ACT_EDIT_ITEMCHECK', item);
        toast.success('Success edit itemcheck, please wait for approval');
      } catch (error) {
        console.log(error);
        toast.error('Error edit itemcheck');
      }
    },
    async getIncharge(filter = {}) {
      try {
        let incharge = await api.post(`/tpm/filter/incharge`, filter);
        console.log(filter);
        let mapincharges = await incharge.data.data.map((item) => {
          return {
            value: item.incharge_id,
            label: item.incharge_nm,
          };
        });
        this.inchargeOptions = mapincharges;
      } catch (error) {
        console.log(error);
      }
    },
    showItemCheckDetail(item = null) {
      this.selectedItem = item;
      this.isVisibleDetail = true;
    },
    onCloseItemDetail(event) {
      this.selectedItem = null;
      this.isVisibleDetail = false;
      if (event === true) {
        this.getItems();
      }
    },
    handleLimitChange(event) {
      this.limit = event.target.value;
      this.getItems();
    },
    handlePageChange(event) {
      this.currentPage = event;
      this.getItems();
    },
  },
  mounted() {
    this.getIncharge();

    this.id_ledger = this.$route.params.id;
    if (this.id_ledger) {
      this.getItems();
    }
  },
  components: {
    CustPagination,
    ModalItemCheckDetail,
    AddItemcheck,
  }
};
</script>
