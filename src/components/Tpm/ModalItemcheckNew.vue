<template>
  <CModal
    :visible="is_show"
    backdrop="static"
    size="xl"
    close="changesShow()">

    <CModalHeader @click="changesShow()">Ledger Items</CModalHeader>

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
        <CCol class="mb-3" v-for="(item, i) in items" :key="i" lg="6">
          <CCard>
            <CCardBody>
              <CCardTitle>
                {{ i+1 }}. {{ item.itemcheck_nm }}
              </CCardTitle>
              <CRow class="mb-2" v-if="!item.is_editing">
                <CCol>
                  <CFormInput
                    label="Location"
                    disabled
                    :value="item?.itemcheck_loc"/>
                  <CFormInput
                    label="Method"
                    disabled
                    :value="item?.method_check"/>
                  <CFormInput
                    label="Incharge"
                    disabled
                    :value="item?.incharge_nm"/>

                  <CFormInput
                    label="Standard"
                    disabled
                    :value="item?.standard_measurement"/>
                  <CRow>
                    <CCol>
                      <CFormInput
                        label="Man Power"
                        disabled
                        :value="item?.mp + ' person'"/>
                    </CCol>
                    <CCol>
                      <CFormInput
                        label="Duration"
                        disabled
                        :value="item?.duration + ' Minutes'"/>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol lg="6">
                  <CCard>
                    <CCardBody>
                      <CFormInput
                        v-if="item.is_counter"
                        label="Periods"
                        disabled
                        :value="(item?.lifespan_counter).toLocaleString('de-DE') + ' ' + 'Cycles'"/>

                      <CFormInput
                        v-if="!item.is_counter"
                        label="Periods"
                        disabled
                        :value="item?.val_periodic + ' ' + item?.period_nm"/>

                    </CCardBody>
                  </CCard>

                  <CFormTextarea
                    label="Details"
                    rows="3"
                    disabled
                    :value="item?.details"/>

                  <CFormInput
                    v-if="!item.is_counter"
                    label="Interval Measurement"
                    disabled
                    :value="item?.lower_limit + ' ~ ' + item?.upper_limit"/>
                </CCol>
              </CRow>

              <CRow class="mb-2" v-if="item.is_editing">
                <h4 class="text-center" style="background-color: yellow;">EDIT DATA</h4>
                <CCol>
                  <CFormInput
                    label="Itemcheck Location"
                    v-model="item.itemcheck_loc"
                    :value="item?.itemcheck_loc"/>
                  <CFormInput
                    label="Method"
                    v-model="item.method_check"
                    :value="item?.method_check"/>
                  <CFormSelect
                    label="Incharge"
                    v-model="item.incharge_id"
                    :options="inchargeOptions"/>
                  <CFormInput
                    label="Standard"
                    v-model="item.standard_measurement"
                    :value="item?.standard_measurement"/>
                  <CRow>
                    <CCol>
                      <CFormInput
                        label="Man Power"
                        v-model="item.mp"
                        :value="item?.mp"/>
                    </CCol>
                    <CCol>
                      <CFormInput
                        label="Duration"
                        v-model="item.duration"
                        :value="item?.duration"/>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol lg="6">
                  <CCard>
                    <CCardBody>
                      <CFormInput
                        v-if="item.is_counter"
                        label="Periods"
                        v-model="item.lifespan_counter"
                        :value="item?.lifespan_counter"/>
                        Cycle


                      <CRow>
                        <CCol lg="5">
                          <CFormInput
                            v-if="!item.is_counter"
                            type="number"
                            v-model="item.val_periodic"
                            label="Value"
                            :value="item?.val_periodic"/>
                        </CCol>

                        <CCol lg="7">
                          <CFormSelect v-if="!item.is_counter" label="Period" v-model="item.period_id">
                            <option :value="item?.period_id">{{ item?.period_nm }}</option>
                            <option value=0>DAY</option>
                            <option value=1>MONTH</option>
                            <option value=2>YEAR</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>

                  <CFormTextarea
                    label="Details"
                    rows="3"
                    v-model="item.details"
                    :value="item?.details"/>

                  <CRow>
                    <CCol>
                      <CFormInput
                        label="Lower Limit"
                        v-model="item.lower_limit"
                        :value="item?.lower_limit"/>
                    </CCol>
                    <CCol>
                      <CFormInput
                        label="Upper Limit"
                        v-model="item.upper_limit"
                        :value="item?.upper_limit"/>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>

            <CCardFooter>
              <CRow>
                <CCol>
                  <CButton class="btn btn-sm col" color="info" @click.prevent="item.visibleSparepart = !item.visibleSparepart">SPAREPART LIST</CButton>
                </CCol>
                <CCol v-if="!item.is_editing" class="text-end">
                  <CButton class="btn btn-sm col mx-2" color="warning" @click="changeEdit(item)">
                    EDIT
                  </CButton>
                  <CButton class="btn btn-sm col" color="danger" @click="deleting(item)">
                    DELETE
                  </CButton>
                </CCol>
                <CCol v-if="item.is_editing" class="text-end">
                  <CButton class="btn btn-sm col mx-2" color="success" @click="editData(item)">
                    UPDATE
                  </CButton>
                  <CButton class="btn btn-sm col" color="danger" @click="changeEdit(item)">
                    CANCEL
                  </CButton>
                </CCol>
              </CRow>
              <CollapseSparepartList
                is_execute="false"
                :visibleSparepart="item.visibleSparepart"
                :ledger_itemcheck_id="item.ledger_itemcheck_id"/>
            </CCardFooter>
          </CCard>

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
import CollapseSparepartList from "./CollapseSparepartList.vue";

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
        items.data.data.forEach(obj => { obj.is_editing = false, obj.visibleSparepart });
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
    ModalSparepart,
    CollapseSparepartList,
  }
};
</script>
