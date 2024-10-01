<template>
  <Toaster position="top-center" closeButton />
  <CModal
    :visible="is_show"
    size="xl"
    backdrop="static"
    @close="$emit('close-modal')"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel"><strong>{{ item.line_nm }} | {{ item.machine_nm }}</strong></CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow class="mb-2">
        <CCol lg="6">
          <CRow>
            <CCol class="mb-2">
              <CFormInput
                label="ITEM CHECK:"
                disabled
                :value="item.itemcheck_nm"/>
              <CFormInput
                label="DURATION:"
                disabled
                :value="this.details.duration + ' ' + 'Minutes' "/>
            </CCol>
            <CCol>
              <CFormInput
                label="ITEM LOCATION:"
                disabled
                :value="this.details.itemcheck_loc"/>
              <CFormInput
                label="LAST CHECK:"
                disabled
                :value="(this.details.init_counter_dt)?.slice(0, 10)"/>
            </CCol>
          </CRow>
          <CProgress v-if="item.percentage < 75" :height="35" variant="striped" animated color="success" :value="item.percentage">{{ item.percentage }}%</CProgress>
          <CProgress v-if="item.percentage >= 75 && item.percentage < 90" :height="35" variant="striped" animated color="warning" :value="item.percentage">{{ item.percentage }}%</CProgress>
          <CProgress v-if="item.percentage >= 90 && item.percentage <= 100" :height="35" variant="striped" animated color="danger" :value="item.percentage">{{ item.percentage }}%</CProgress>
          <CProgress v-if="item.percentage > 100" :height="35" variant="striped" animated color="dark" :value="item.percentage">{{ item.percentage }}%</CProgress>
        </CCol>
        <CCol lg="6">
          <CCard>
            <CCardHeader>
              Counter Details
            </CCardHeader>
            <CCardBody>
              <table class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th class="text-center">Initial Counter</th>
                    <th class="text-center">Machine Counter</th>
                    <th class="text-center">Lifespan</th>
                    <th class="text-center">Estimation Date</th>
                    <th class="text-center">Day Remain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">{{ this.details.init_counter }}</td>
                    <td class="text-center">{{ this.details.last_counter }}</td>
                    <td class="text-center">{{ (item.last_counter - item.init_counter)?.toLocaleString('de-DE') }} / {{ (item.lifespan_counter)?.toLocaleString('de-DE') }}</td>
                    <td class="text-center">{{ item.est_dt?.slice(0, 10) }}</td>
                    <td class="text-center">{{ Math.ceil((new Date(item?.est_dt) - new Date()) / (1000 * 3600 * 24)) >= 0 ? Math.ceil((new Date(item?.est_dt) - new Date()) / (1000 * 3600 * 24)) + ' Days' : 'Overdue' }}</td>
                  </tr>
                </tbody>
              </table>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <!-- <CRow> -->
        <!-- <CCol lg="8"> -->
          <CCard class="mb-2">
            <CCardBody>
              <CRow>
                <CCol>
                  <CRow>
                    <CCol>
                      <CFormInput
                        label="Method"
                        disabled
                        :value="this.details.method_check"/>
                    </CCol>
                    <CCol>
                      <CFormInput
                        label="MP"
                        disabled
                        :value="this.details.mp + ' Person'"/>
                    </CCol>
                  </CRow>
                  <CFormInput
                    label="Standard Measurement"
                    disabled
                    :value="this.details.standard_measurement"/>
                  <CFormInput
                    label="Upper and Lower Limit"
                    disabled
                    :value="this.details.upper_limit + ' ~ ' + this.details.lower_limit"/>
                </CCol>
                <CCol>
                  <CForm>
                    <CFormTextarea
                      label="Details"
                      disabled
                      rows="7"
                      :value="this.details.details"/>
                  </CForm>
                </CCol>
              </CRow>
              <CollapseSparepartList
                ref="collapseSparepartList"
                is_execute="true"
                :visibleSparepart="visibleSparepart"
                :ledger_itemcheck_id="item.ledger_itemcheck_id"/>
            </CCardBody>
          </CCard>

          <CCard>
            <CCardHeader>Execution</CCardHeader>
            <CCardBody>
              <CRow class="mb-2">
                <CCol lg="6">
                  <CCard class="mb-2">
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <CFormInput
                            label="Plan Check Date"
                            disabled
                            :value="item.est_dt?.slice(0, 10)"/>
                          <CFormInput
                            label="Start"
                            type="time"
                            v-model="form.start_time"/>
                        </CCol>
                        <CCol>
                          <CFormInput
                            label="Actual Date"
                            type="date"
                            v-model="form.actual_dt"/>
                          <CFormInput
                            label="End"
                            type="time"
                            v-model="form.end_time"/>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol lg="6">
                  <CFormLabel>PIC</CFormLabel>
                  <treeselect required v-model="form.pic" id="pic" label="Input PIC" :multiple="false" placeholder="PIC" :options="users" />
                  <CFormLabel>Input Judgement</CFormLabel>
                  <treeselect required v-model="selected_judge" id="judgement" label="Judgement" :multiple="false" placeholder="Judgement" :options="optionsJudge" />
                </CCol>
              </CRow>
              <CRow>
                <CCol v-if="containsNumber(this.details.standard_measurement) || containsNumber(this.details.upper_limit) || containsNumber(this.details.lower_limit)">
                  <CFormInput
                    required
                    label="Input Measurement"
                    v-model="form.measurement"/>
                </CCol>
              </CRow>

              <CCard v-if="is_judgement">
                <CCardHeader>
                  Input Finding
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol>
                      <CFormInput
                        label="Problem"
                        placeholder="What's the problem?"
                        v-model="NGForm.problem"/>
                      <CFormTextarea
                        label="Action / Countermeasure"
                        rows="7"
                        placeholder="Input TPM Finding"
                        v-model="NGForm.notes"/>
                    </CCol>
                    <CCol lg="6">
                      <CFormLabel>PIC</CFormLabel>
                      <treeselect v-model="NGForm.pic" id="pic" label="Input PIC" :multiple="false" placeholder="PIC" :options="users" />

                      <CFormInput
                        label="Plan Date"
                        type="date"
                        v-model="NGForm.plan_finding_dt"/>

                      <CFormInput
                        label="Image"
                        type="file"
                        disabled
                        v-model="NGForm.image"/>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        <!-- </CCol> -->

        <!-- <CCol lg="4"> -->

        <!-- </CCol> -->
      <!-- </CRow> -->


    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="$emit('close-modal', false)">
        Close
      </CButton>
      <CButton color="primary" @click="submitData(form, NGForm, item)" >Save changes</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import api from "@/apis/CommonAPI";
import Treeselect from "vue3-treeselect";
import { toast, Toaster } from "vue-sonner";
import CollapseSparepartList from "./CollapseSparepartList.vue";
import ItemAndMPtrends from "./ItemAndMPtrends.vue";

export default {
  name: 'ModalExecuteCounter',

  data() {
    return {
      details: [],
      form: {},
      NGForm: {},
      users: [],
      options: [],
      toaster: [],
      optionsJudge: [
        { id: '0', label: 'OK' },
        { id: '1', label: 'NG' },
      ],
      is_judgement: false, // Variable to track if NG is selected
      selected_judge: null, // Variable to track the selected judgement

      visibleSparepart: true,
    }
  },

  components: {
    Treeselect,
    Toaster,
    CollapseSparepartList,
  },

  methods: {
    async getDetails(item) {
      this.form = []
      let datas = await api.get('/tpm/counter/getDetail', `?ledger_itemcheck_id=${item}`);
      this.details = datas.data.data[0];
      console.log(this.details);

      this.$refs.collapseSparepartList.getItems(this.details.real_ledger_itemcheck_id)

    },

    async getPIC() {
      let datas = await api.get()
      this.options = datas.data.data
    },

    containsNumber(str) {
      const hasNumber = /\d/;
      return hasNumber.test(str);
    },

    async getUsers(incharge_id = null) {
      try {
        let { data } = await api.get(
          `/tpm/users`,
          `?incharge_id=${incharge_id}`
        );
        console.log(data);
        this.users = data.data;
        this.users.forEach(element => {
          element.id = element.user_id
          element.label = element.user_nm
        });
      } catch (error) {
        console.log(error);
      }
    },

    async submitData(data, NGData){
      try {
        data.judgement = this.selected_judge

        let execute = {
          ledger_itemcheck_id: this.item.ledger_itemcheck_id,
          counter_changed: this.item.last_counter - this.item.init_counter,
          initial_counter: this.details.init_counter,
          initial_counter_dt: this.details.init_counter_dt,
          counter_changed_dt: data.actual_dt,
          start_time: data.start_time,
          end_time: data.end_time,
          pic_nm: data.pic,
        }

        if(this.is_judgement){
          let dataNG = {
            ...execute,
            plan_check_dt: NGData.plan_finding_dt,
            problem_nm: NGData.problem,
            problem_detail: NGData.notes,
            pic: NGData.pic,
            judgement: this.is_judgement
          }
          console.log(dataNG);

          let upload = await api.post(`/tpm/counter/upload-execute`, dataNG)
          toast.success(`${upload.data.message}`, {timeout: 2000})
        }else{
          let upload = await api.post(`/tpm/counter/upload-execute`, execute)
          toast.success(`${upload.data.message}`, {timeout: 2000})
        }
        NGData = {}
        data = {}
        this.$emit('close-modal', false)
      } catch (error) {
        toast.error(`${error}`)
        console.log(error);
      }
    }
  },

  watch: {
    selected_judge(newVal) {
      this.is_judgement = newVal === '1';
    },

  },

  props: {
    is_show: Boolean,
    item: Object,
  },

  mounted() {
    this.getUsers();
  }
}
</script>
