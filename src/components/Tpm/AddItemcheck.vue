<template>
  <CRow>
    <CCol class="overflow-auto">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th class="item-check text-center">Item Check</th>
            <th class="item-check text-center">Details</th>
            <th class="item-check text-center">Item Location</th>
            <th class="item-check text-center" colspan="2">
              <CFormSelect v-model="selectedOption" class="item-check text-center" style="border: none;">
                <option value="periodic">Periodic</option>
                <option value="cycle">Cycle</option>
              </CFormSelect>
            </th>
            <th class="item-check text-center">Duration</th>
            <th class="item-check text-center">MP</th>
            <th class="item-check text-center">Standard</th>
            <th class="item-check text-center">Method</th>
            <th class="item-check text-center">Incharge</th>
            <th v-if="selectedOption === 'periodic'" class="actions text-center">Plan Check Date</th>
          </tr>
          <tr></tr>
        </thead>
        <tbody>
          <td class="item-check text-center">
            <CFormInput v-model="form.itemcheck_nm" class="item-check text-center" style="border: none;" placeholder="add Name"/>
          </td>
          <td class="item-check text-center">
            <CFormTextarea v-model="form.details" class="item-check text-center" style="border: none;" placeholder="add Details"/>
          </td>
          <td class="item-check text-center">
            <CFormInput v-model="form.itemcheck_loc" class="item-check text-center" style="border: none;" placeholder="add Location"/>
          </td>

          <!-- Periodic Content -->
          <td v-if="selectedOption === 'periodic'" class="item-check text-center">
            <CFormInput v-model="form.val_period" class="item-check text-center" style="border: none;" placeholder="add Periodic"/>
          </td>
          <td v-if="selectedOption === 'periodic'" class="item-check text-center">
            <CFormSelect v-model="form.period_id" class="item-check text-center" style="border: none;">
              <option>Select Period</option>
              <option value="0">Day</option>
              <option value="1">Month</option>
              <option value="2">Year</option>
            </CFormSelect>
          </td>

          <!-- Cycle Content -->
          <td v-if="selectedOption === 'cycle'" class="item-check text-center">
            <CFormInput type="number" v-model="form.lifespan_counter" class="item-check text-center" style="border: none;" placeholder="add Cycle"/>
          </td>

          <td v-if="selectedOption === 'cycle'" class="item-check text-center">
            CYCLE
          </td>
          <td class="item-check text-center">
            <CFormInput v-model="form.duration" class="item-check text-center" style="border: none;" placeholder="add Duration"/>
          </td>

          <td class="item-check text-center">
            <CFormInput v-model="form.mp" class="item-check text-center" style="border: none;" placeholder="add MP"/>
          </td>
          <td class="item-check text-center">
            <CFormInput v-model="form.standard_measurement" class="item-check text-center" style="border: none;" placeholder="add Standard"/>
          </td>
          <td class="item-check text-center">
            <CFormInput v-model="form.itemcheck_method" class="item-check text-center" style="border: none;" placeholder="add Method"/>
          </td>
          <td class="item-check text-center">
            <CFormSelect placeholder="add Incharge" v-model="form.incharge_id" :options="inchargeOptions"></CFormSelect>
          </td>

          <td v-if="selectedOption === 'periodic'" class="item-check text-center">
            <CFormInput type="date" v-model="form.plan_check_dt" class="item-check text-center" style="border: none;" placeholder="add Date"/>
          </td>
        </tbody>
      </table>
      <table class="table table-bordered table-striped">
        <thead>
          <th class="item-check text-center">Upper Limit</th>
          <th class="item-check text-center">Lower Limit</th>
        </thead>
        <tbody>
          <td class="item-check text-center">
            <CFormInput v-model="form.upper_limit" class="item-check text-center" style="border: none;" placeholder="add Upper Limit"/>
          </td>
          <td class="item-check text-center">
            <CFormInput v-model="form.lower_limit" class="item-check text-center" style="border: none;" placeholder="add Lower Limit"/>
          </td>
        </tbody>
      </table>
    </CCol>
  </CRow>
  <CRow>
    <CCol>
      <CFormTextarea
        id="inputReasons"
        label="Reason to Add Itemcheck"
        rows="3"
        text="Must be 8-20 words long."
        v-model="form.reasons"
      ></CFormTextarea>
      <CButton @click="submitForm()" class="btn btn-sm col mb-3" color="success" yarnstyle="max-width: 150px; margin-bottom: 5px;">
        ADD ITEM
      </CButton>
    </CCol>
  </CRow>
</template>

<script>
import { CFormInput, CFormTextarea, CFormSelect } from '@coreui/vue';
import { toast } from 'vue-sonner';
import api from "@/apis/CommonAPI";

export default {
  name: 'AddItemcheck',
  data() {
    return {
      selectedOption: 'periodic', // default to periodic
      form: {
        itemcheck_id: null,
        itemcheck_nm: null,
        itemcheck_method: null,
        duration: null,
        val_period: null,
        period_id: null,
        standard_measurement: null,
        ledger_id: this.ledger_id,
        lifespan_counter: null,
        plan_check_dt: null,
        mp: null,
        upper_limit: null,
        lower_limit: null,
        itemcheck_loc: null,
        reasons: null,
        incharge_id: null,
      },
      inchargeOptions: []
    };
  },

  methods: {
    async submitForm() {
      try {
        if (
          this.form.itemcheck_nm !== null &&
          this.form.itemcheck_method !== null &&
          this.form.standard_measurement !== null &&
          (this.selectedOption === 'cycle' || this.form.plan_check_dt !== null)
        ) {
          this.submittedForm = {
            ...this.form,
            period_id: this.selectedOption === 'periodic' ? +this.form.period_id : null,
            val_period: this.selectedOption === 'periodic' ? +this.form.val_period : null,
            lifespan_counter: this.selectedOption === 'cycle' ? this.form.lifespan_counter : null,
            plan_check_dt: this.selectedOption === 'periodic' ? this.form.plan_check_dt : null,
          };

          if(this.selectedOption === 'cycle') {
            // let init_count = await api.getOut(`/counter/${this.machine_nm}`, '');
            // console.log(init_count);
            // this.submittedForm.init_counter = init_count.data.data.counter
            // this.submittedForm.init_counter_dt = init_count.data.data.updated_dt
          }

          console.log(this.submittedForm);

          this.$store.dispatch('ACT_NEW_ITEMCHECK', this.submittedForm);
          this.resetForm();
          toast.success('Success to add itemcheck, please wait for approval');
        } else {
          toast.error('Must not be empty');
        }
      } catch (error) {
        console.log(error);
        toast.error('Error to add itemcheck');
      }
    },

    resetForm() {
      this.form.itemcheck_nm = null;
      this.form.details = null;
      this.form.itemcheck_method = null;
      this.form.duration = null;
      this.form.standard_measurement = null;
      this.form.val_period = null;
      this.form.period_id = null;
      this.form.plan_check_dt = null;
      this.form.itemcheck_loc = null;
      this.form.reasons = null;
      this.form.mp = null;
      this.form.lifespan_counter = null;
    },

    async getIncharge(filter = {}) {
      try {
        let incharge = await api.post(`/tpm/filter/incharge`, filter)
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
    ledger_id: Number,
    machine_nm: String,
  },
};
</script>
