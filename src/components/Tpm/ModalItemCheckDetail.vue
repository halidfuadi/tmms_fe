<template>
  <CModal
    :visible="visible"
    backdrop="static"
    size="xl"
    @close="close()">
    <CModalHeader closeButton><h5 class="fw-bold">{{ title }}</h5></CModalHeader>
    <CModalBody>
      <div>
        <CRow class="mb-2">
          <CCol lg="6">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">Line</span>
              </div>
              <input disabled type="text" class="form-control" placeholder=""
                     :value="item?.line_nm"/>
            </div>
          </CCol>
          <CCol lg="6">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">Machine</span>
              </div>
              <input disabled type="text" class="form-control" placeholder="Machine"
                     :value="item?.machine_nm"/>
            </div>
          </CCol>
          <CCol lg="12" class="mb-3">
            <CFormInput
              label="Item Check Name"
              v-model="form.itemcheck_nm"
              :disabled="item != null"/>
          </CCol>
          <CCol class="mb-2">
            <CFormInput
              label="Item Check Location"
              v-model="form.itemcheck_loc"
              class="mb-2"/>
            <CFormInput
              label="Method"
              v-model="form.method_check"
              class="mb-2"/>
            <CFormSelect
              label="Incharge"
              v-model="form.incharge_id"
              :options="inchargeOptions"
              class="mb-2"/>
            <CFormInput
              label="Standard"
              v-model="form.standard_measurement"
              class="mb-2"/>
            <CRow>
              <CCol>
                <CFormInput
                  label="Man Power"
                  v-model="form.mp"
                  class="mb-2"/>
              </CCol>
              <CCol>
                <CFormInput
                  label="Duration"
                  v-model="form.duration"
                  class="mb-2"/>
              </CCol>
            </CRow>
          </CCol>
          <CCol lg="6">
            <CCard class="mb-3">
              <CCardBody>
                <CFormInput
                  v-if="item?.is_counter"
                  label="Periods"
                  v-model="form.lifespan_counter"
                  class="mb-2"/>
                Cycle
                <CRow>
                  <CCol lg="5">
                    <CFormInput
                      v-if="!item?.is_counter"
                      type="number"
                      v-model="form.val_periodic"
                      label="Value"
                      class="mb-2"/>
                  </CCol>
                  <CCol lg="7" class="mb-2">
                    <CFormSelect v-if="!item?.is_counter" label="Period" v-model="form.period_id">
                      <option value=0>DAY</option>
                      <option value=1>MONTH</option>
                      <option value=2>YEAR</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <div class="mb-3">
              <CFormLabel for="exampleFormControlTextarea1">Details</CFormLabel>
              <CFormTextarea id="exampleFormControlTextarea1" rows="3" v-model="form.details"></CFormTextarea>
            </div>
            <CRow>
              <CCol>
                <CFormInput
                  label="Lower Limit"
                  v-model="form.lower_limit"/>
              </CCol>
              <CCol>
                <CFormInput
                  label="Upper Limit"
                  v-model="form.upper_limit"
                />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CButton class="btn btn-sm col text-white" color="info"
                     @click.prevent="isVisibleSparepart = !isVisibleSparepart">
              Sparepart List
            </CButton>
          </CCol>
          <CCol class="text-end">
            <CButton class="btn btn-sm col mx-2 text-white" color="warning" @click="submit()">
              {{ actionTitle }}
            </CButton>
            <CButton v-if="item" class="btn btn-sm col text-white" color="danger" @click="applyDelete()">
              Delete
            </CButton>
            <CButton class="btn btn-sm col text-white" color="danger" @click="close()">
              Close
            </CButton>
          </CCol>
        </CRow>
        <CollapseSparepartList
          :is_execute="false"
          :visibleSparepart="isVisibleSparepart"
          :ledger_itemcheck_id="item?.ledger_itemcheck_id"/>
      </div>
    </CModalBody>
  </CModal>
</template>
<script>
import CollapseSparepartList from "@/components/Tpm/CollapseSparepartList.vue";
import api from "@/apis/CommonAPI";
import {toast} from "vue-sonner";
import Treeselect from "@zanmato/vue3-treeselect";
import "@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css";

const defaultForm = {
  itemcheck_nm: null,
  itemcheck_loc: null,
  method_check: null,
  incharge_id: null,
  standard_measurement: null,
  mp: null,
  duration: null,
  lifespan_counter: null,
  val_periodic: null,
  period_id: null,
  details: null,
  lower_limit: null,
  upper_limit: null,
};

export default {
  name: "ModalItemCheckDetail",
  props: {
    visible: [Boolean, String],
    item: Object
  },
  components: {
    CollapseSparepartList,
    Treeselect,
  },
  data() {
    return {
      isVisibleSparepart: false,
      inchargeOptions: [],
      form: defaultForm,
      isSubmitLoading: false,
      itemCheckOptions: null,
    };
  },
  mounted() {
    this.getIncharge();
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue) {
        this.form = {
          ...this.item,
        }
      } else {
        this.form = {
          ...defaultForm,
        };
      }
    }
  },
  computed: {
    title() {
      return this.item ? "Item Check Detail" : "Add Item Check";
    },
    actionTitle() {
      return this.item ? "Update" : "Add";
    }
  },
  methods: {
    async getIncharge() {
      try {
        let incharge = await api.post(`/tpm/filter/incharge`);
        let mapincharges = await incharge.data.data.map((item) => {
          return {
            value: item.incharge_id,
            label: item.incharge_nm,
          };
        });

        this.inchargeOptions = mapincharges;

        if (this.item) {
          this.form = {
            ...this.form,
            incharge_id: this.item.incharge_id,
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getItemCheckOptions() {
      try {
        let {data: response} = await api.get(`/tpm/itemchecks`);
        this.itemCheckOptions = response.data.map((item) => {
          return {
            id: item.machine_id,
            label: item.machine_nm,
          };
        });
      } catch (e) {
        console.log(e);
      }
    },
    async submit() {
      try {
        let mappedForm = {
          ...this.form,
        };

        let {data: response} = await api.post(this.item ? `/tpm/itemchecks/addItemCheck` : `/tpm/itemchecks/editItemCheck`, mappedForm);
        if (response) {
          toast.success("data berhasil di simpan");
        }
      } catch (e) {
        toast.error("Terjadi kesalahan saat menyimpan data", {
          description: "Silahkan coba lagi"
        });
      }
    },
    applyDelete() {
    },
    close() {
      this.$emit('on-close');
    }
  }
}

</script>
