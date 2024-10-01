<template>
  <CModal :visible="is_show" backdrop="static" fullscreen close="changesShow()">
    <ModalSparepart :visible="is_show_sparepart" :id_ledger="ledger_id" @close="() => { is_show_sparepart = false }"
      size="xl" />

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
        <CFormTextarea v-model="item.reason" placeholder="Insert Reason" />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="() => { is_deleting = false }">
          Close
        </CButton>
        <CButton color="danger" @click="submitDeleting(item)">Delete</CButton>
      </CModalFooter>
    </CModal>

    <CModalHeader @click="changesShow()">Items</CModalHeader>

    <CModalBody>
      <CRow>
        <CCol lg="6">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Machine</span>
            </div>
            <input disabled type="text" class="form-control" placeholder="Machine" :value="machine_nm" />
          </div>
        </CCol>
        <CCol class="text-end" lg="6">
          <CButton class="btn btn-sm col mx-3" color="info" @click="changeAdd()"
            style="max-width: 150px; margin-bottom: 5px;">
            ADD NEW ITEMCHECK
          </CButton>
          <CButton class="btn btn-sm col" color="warning" @click="info(this.ledger_id)"
            style="max-width: 100px; margin-bottom: 5px;">
            SPAREPART
          </CButton>
        </CCol>
      </CRow>

      <CRow v-if="is_add">
        <AddItemcheck :ledger_id="this.id_ledger" :machine_nm="this.machine_nm"/>
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
                <th class="actions text-center" colspan="3">Actions</th>
              </tr>
              <tr></tr>
            </thead>

            <tbody v-if="items && items.length > 0">
              <tr v-for="(item, i) in items" :key="i">
                <td class="text-center">{{ i + 1 }}</td>
                <template v-if="!item.is_editing">
                  <td class="item-check text-center">{{ item?.itemcheck_nm }}</td>
                  <td class="item-check text-center">
                    <CFormTextarea v-model="item.details" :value="item?.details" disabled />
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
                  <td class="actions justify-content-center">
                    <CButton class="btn btn-sm col" color="warning" @click="changeEdit(item)"
                      style="max-width: 100px; margin-bottom: 5px;">
                      EDIT
                    </CButton>
                  </td>
                  <td class="actions justify-content-center" colspan="2">
                    <CButton class="btn btn-sm col" color="danger" @click="deleting(item)" style="max-width: 100px">
                      DELETE
                    </CButton>
                  </td>
                </template>

                <template v-else>
                  <td class="item-check text-center">
                    <CFormTextarea v-model="item.itemcheck_nm" :value="item?.itemcheck_nm" />
                  </td>
                  <td class="item-check text-center">
                    <CFormTextarea v-model="item.details" :value="item?.details" />
                  </td>
                  <td class="item-check text-center">
                    <CFormTextarea v-model="item.itemcheck_loc" :value="item?.itemcheck_loc" />
                  </td>
                  <td v-if="!item.is_counter" class="item-check text-center">
                    <CFormTextarea style="min-width: 20px;" v-model="item.val_periodic" :value="item?.val_periodic" />
                  </td>
                  <td v-if="item.is_counter" class="item-check text-center">
                    <CFormTextarea style="min-width: 20px;" v-model="item.lifespan_counter" :value="item?.lifespan_counter" />
                  </td>
                  <td v-if="!item.is_counter" class="item-check text-center">
                    <CFormSelect v-model="item.period_id">
                      <option :value="item?.period_id">{{ item?.period_nm }}</option>
                      <option value=0>Day</option>
                      <option value=1>Month</option>
                      <option value=2>Year</option>
                    </CFormSelect>
                  </td>
                  <td v-if="item.is_counter" class="item-check text-center">
                    CYCLE
                  </td>
                  <td class="item-check text-center">
                    <CFormTextarea v-model="item.mp" :value="item?.mp" />
                  </td>
                  <td class="item-check text-center">
                    <!-- {{ item?.duration }} -->
                    <CFormTextarea v-model="item.duration" :value="item?.duration" />
                  </td>
                  <td class="item-check text-center">
                    <!-- {{ item?.standard_measurement == '' ? "OK" : item?.standard_measurement }} -->
                    <CFormTextarea v-model="item.standard_measurement" :value="item?.standard_measurement" />
                  </td>
                  <td class="item-check text-center">
                    <!-- {{ item?.method_check }} -->
                    <CFormTextarea v-model="item.method_check" :value="item?.method_check" />
                  </td>
                  <td class="item-check text-center">
                    <CFormSelect aria-label="Default select example" v-model="item.incharge_id" :options="inchargeOptions"></CFormSelect>
                  </td>
                  <td class="item-check text-center">
                    <CFormTextarea v-model="item.upper_limit" :value="item?.upper_limit" />
                  </td>
                  <td class="item-check text-center">
                    <CFormTextarea v-model="item.lower_limit" :value="item?.lower_limit" />
                  </td>
                  <!-- <td class="item-check text-center">
                    <CFormTextarea type="date" v-model="item.plan_check_dt" placeholder="Plan Check Date" :value="item?.plan_check_dt"/>
                  </td> -->
                  <!-- <td class="item-check text-center">
                    {{ item?.plan_check_dt.split('T')[0] }}
                  </td> -->
                  <td class="actions">
                    <CFormTextarea v-model="item.reason" placeholder="Insert Reasons" />
                  </td>
                  <td class="actions">
                    <CButton class="btn btn-sm col" color="success" @click="editData(item)"
                      style="max-width: 100px; margin-bottom: 5px;">
                      UPDATE
                    </CButton>
                  </td>
                  <td class="actions">
                    <CButton class="btn btn-sm col" color="danger" @click="changeEdit(item)"
                      style="max-width: 100px; margin-bottom: 5px;">
                      CANCEL
                    </CButton>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </CCol>
      </CRow>

    </CModalBody>
    <CModalFooter>
      <CButton @click="changesShow()">Cancel</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import api from "@/apis/CommonAPI";
import { mapGetters } from "vuex";
import AddItemcheck from "@/components/Tpm/AddItemcheck";
import { toast } from "vue-sonner";
import ModalSparepart from "@/components/Tpm/ModalSparepart";
import { CFormTextarea, CFormSelect, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CRow, CCol } from "@coreui/vue";

export default {
  name: "ModalItemCheck",
  data() {
    return {
      users: [],
      is_show: false,
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

      selected : 0,
    };
  },
  watch: {
    isShow: function () {
      this.is_show = this.isShow;
      this.id_ledger = this.ledger_id;
    },
    getSubmitStatus: {
      handler() {
        console.log(this.getSubmitStatus);
        this.is_show = false;
        this.changesShow();
      },
      deep: true,
    },
    id_ledger: function () {
      console.log("CHANGES");
      console.log(this.id_ledger);
      if (this.id_ledger || this.id_ledger == 0) {
        this.getItems();
      }
    },
  },
  computed: {
    ...mapGetters(["getSubmitStatus"]),
  },
  methods: {
    async getItems() {
      try {
        let items = await api.get(`/tpm/ledgers/detail`, `?ledger_id=${this.id_ledger}`);
        items.data.data.forEach(obj => { obj.is_editing = false });
        this.items = items.data.data;
        console.log(items.data.data);
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
    changeEdit(item) {
      item.is_editing = !item.is_editing;
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
  },
  mounted() {
    this.getIncharge();
  },
  props: {
    incharge_id: String,
    isShow: Boolean,
    machine_nm: String,
    ledger_id: Number,
  },
  components: {
    AddItemcheck,
    ModalSparepart
  }
};
</script>
