<template>
  <CModal :visible="show_modal" @close="() => { show_modal = false }" :item="item" size="lg">
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">{{ item.line_nm }} Delayed Item</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th class="no text-center">No</th>
            <th class="item-check text-center">Item Check</th>
            <th class="item-check text-center">Machine</th>
            <th class="item-check text-center">Date</th>
            <th class="item-check text-center" colspan="2">Periodic</th>
            <th class="item-check text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, i) in item.items" :key="i">
            <td class="text-center">{{ i + 1 }}</td>
            <td class="text-center">{{ detail.itemcheck_nm }}</td>
            <td class="text-center">{{ detail.machine_nm }}</td>
            <td class="text-center">{{ detail.plan_check_dt }}</td>
            <td class="text-center">{{ detail.val_periodic }}</td>
            <td class="text-center">{{ detail.period_nm }}</td>
            <td>
              <div class="input-group mb-3">
                <input type="date" class="form-control w-50" v-model="detail.changes_date"
                  placeholder="Plan Check Date" />
                <div class="input-group-append">
                  <span class="input-group-text p-0">
                    <CButton color="warning" @click="updatePlanDate(detail)">Update</CButton>
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { show_modal = false }">Close</CButton>
      <CButton color="primary">Save changes</CButton>
    </CModalFooter>
  </CModal>

  <CAccordion>
    <CAccordionItem class="mb-1">
      <CAccordionHeader>
        LAST MONTH DELAYED ITEM
        <CBadge position="top-end" color="danger" class="ms-2">{{ total_delays }}</CBadge>
      </CAccordionHeader>
      <CAccordionBody class="mb-1">
        <CRow>
          <CCol v-for="(item, i) in items" :key="i" lg="4">
            <CCard class="mb-3 text-center align-item-center">
              <CCardBody>
                <CCardTitle>
                  <CRow>
                    <CCol lg="6" class="align-item-center">
                      {{ item.line_nm }}
                    </CCol>
                    <CCol lg="6">
                      <CButton color="info" class="position-relative" @click="detail(item)">
                        Detail <CBadge position="top-end" color="danger">{{ item.count }}</CBadge>
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardTitle>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CAccordionBody>
    </CAccordionItem>
  </CAccordion>
</template>

<script>
import { cilAppsSettings } from '@coreui/icons';
import { CAccordion, CCardBody } from '@coreui/vue';
import api from "@/apis/CommonAPI";

export default {
  name: "DropbarDelay",
  data() {
    return {
      visible: false,
      items: [],
      show_modal: false,
      total_delays: 0,
    };
  },
  methods: {
    async getDelayed() {
      try {
        let response = await api.get(`/tpm/schedules/getDelayed`, '?');
        this.items = response.data.data;
        this.calculateTotalDelays();
      } catch (error) {
        console.log(error);
      }
    },
    calculateTotalDelays() {
      this.total_delays = this.items.reduce((total, item) => total + item.count, 0);
    },
    detail(item) {
      this.show_modal = !this.show_modal;
      if (this.show_modal) {
        this.item = item;
      }
    },
    async updatePlanDate(data) {
      try {
        const updatePlanDate = {
          plan_check_dts: data.changes_date,
          schedule_id: data.schedule_id,
        };
        this.$store.dispatch('UPDATE_PLAN_DATE', updatePlanDate);
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    await this.getDelayed();
  },
};
</script>
