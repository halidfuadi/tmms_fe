<template>
  <CRow>
    <CCol>
      <CCard>
        <CCardHeader>
          NEW ITEM
        </CCardHeader>
        <CCardBody class="tableFixHead">
          <template v-if="dataUpdate.length > 0">
            <CRow>
              <CCol class="mb-3" lg="6" v-for="(item, i) in dataUpdate" :key="i">
                <CCard>
                  <CCardHeader>
                    <CRow>
                      <CCol>
                        <CCardTitle> {{ item.machine_nm }}</CCardTitle>
                      </CCol>
                      <CCol class="text-end">
                        <CCardTitle> Changed By: {{ item.changed_by }}</CCardTitle>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <CCardBody>
                    <CCardSubtitle class="mb-2 text-body-secondary">
                      <CRow>
                        <CCol lg="6">
                          {{ item.itemcheck_nm }}
                        </CCol>
                        <CCol lg="6" class="text-end">
                          {{ item.val_periodic }} {{ item.period_nm }}
                        </CCol>
                      </CRow>
                    </CCardSubtitle>
                    <CCardText>{{ item.reasons }}</CCardText>
                  </CCardBody>
                  <CCardFooter>
                    <CButton class="btn btn-sm col me-3" color="success" @click="approve(item)">
                      APPROVE
                    </CButton>
                    <CButton class="btn btn-sm col" color="danger" style="max-width: 100px" @click="denyAdded(item)">
                      DENY
                    </CButton>
                  </CCardFooter>
                </CCard>
              </CCol>
            </CRow>
          </template>
          <template v-else>
            <CCard>
              <CCardBody>
                NO DATA
              </CCardBody>
            </CCard>
          </template>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol>
      <CCard>
        <CCardHeader>
          CHANGED ITEM
        </CCardHeader>
        <CCardBody class="tableFixHead">
          <!-- <CRow> -->
          <template v-if="dataUpdatedItem.length > 0">
            <CCol class="mb-3" lg="12" v-for="(update, i) in dataUpdatedItem" :key="i">
              <CCard>
                <CCardHeader>
                  <CRow>
                    <CCol>
                      <CCardTitle>{{ update.machine_nm }}</CCardTitle>
                    </CCol>
                    <CCol class="text-end">
                      <CCardTitle>Changed By: {{ update.changed_by }}</CCardTitle>
                    </CCol>
                  </CRow>
                </CCardHeader>

                <CCardBody>
                  <CCardTitle class="mb-2 text-body-secondary">
                    {{ update.itemcheck_nm_old }}
                  </CCardTitle>
                  <CAccordion>
                    <CAccordionItem>
                      <CAccordionHeader>
                        DETAIL
                      </CAccordionHeader>
                      <CAccordionBody>
                        <CTable>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell scope="col">COLUMN</CTableHeaderCell>
                              <CTableHeaderCell scope="col">OLD</CTableHeaderCell>
                              <CTableHeaderCell scope="col">NEW</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            <CTableRow>
                              <CTableDataCell>ITEM NAME</CTableDataCell>
                              <CTableDataCell>{{ update.itemcheck_nm_old }}</CTableDataCell>
                              <CTableDataCell>{{ update.itemcheck_nm_new }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>METHOD</CTableDataCell>
                              <CTableDataCell>{{ update.method_check_old }}</CTableDataCell>
                              <CTableDataCell>{{ update.method_check_new }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>DURATION</CTableDataCell>
                              <CTableDataCell>{{ update.duration_old }}</CTableDataCell>
                              <CTableDataCell>{{ update.duration_new }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>MP</CTableDataCell>
                              <CTableDataCell>{{ update.mp_old }}</CTableDataCell>
                              <CTableDataCell>{{ update.mp_new }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>PERIOD</CTableDataCell>
                              <CTableDataCell>{{ update.val_periodic_old }} {{ update.period_id_old }}</CTableDataCell>
                              <CTableDataCell>{{ update.val_periodic_new }} {{ update.period_id_new }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>STANDARD</CTableDataCell>
                              <CTableDataCell>{{ update.standard_measurement_old }}</CTableDataCell>
                              <CTableDataCell>{{ update.standard_measurement_new }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>UPPER</CTableDataCell>
                              <CTableDataCell>{{ update.upper_limit_old }}</CTableDataCell>
                              <CTableDataCell>{{ update.upper_limit_new }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>LOWER</CTableDataCell>
                              <CTableDataCell>{{ update.lower_limit_old }}</CTableDataCell>
                              <CTableDataCell>{{ update.lower_limit_new }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>REASON</CTableDataCell>
                              <CTableDataCell colspan="2">{{ update.reason }}</CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                </CCardBody>

                <CCardFooter>
                  <CButton class="btn btn-sm col me-3" color="success" @click="approveEdit(update)">
                    APPROVE
                  </CButton>
                  <CButton class="btn btn-sm col" color="danger" style="max-width: 100px" @click="denyEdit(update)">
                    DENY
                  </CButton>
                </CCardFooter>
              </CCard>
            </CCol>
          </template>
          <template v-else>
            <CCard>
              <CCardBody>
                NO DATA
              </CCardBody>
            </CCard>
          </template>
          <!-- </CRow> -->
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import api from "@/apis/CommonAPI";
import { CAccordion, CAccordionBody, CAccordionItem, CCard, CCardFooter, CCardHeader, CCol } from '@coreui/vue';
import { toast, Toaster} from "vue-sonner";

export default {
  name: 'newUpdate',
  data() {
    return {
      dataUpdate: [],
      dataUpdatedItem: [],
      toaster: [],
    }
  },

  components: {
    Toaster
  },

  methods: {
    async approve(data) {
      try {
        // this.$store.dispatch('ACT_APPROVE_ITEMCHECK', data)
        let approval = await api.post('/tpm/itemchecks/approvedNew', data)
        this.getUpdate()
        this.getUpdatedItem()
      } catch (error) {
        toast.error(error)
      }
    },

    async approveEdit(data) {
      // this.$store.dispatch('ACT_APPROVE_UPDATED_ITEMCHECK', data)
      try {
        let approval = await api.post('/tpm/itemchecks/approvedUpdated', data)
        this.getUpdate()
        this.getUpdatedItem()
      } catch (error) {
        console.log(error);
        toast.error(error)

      }
    },

    async denyAdded(data) {
      try {
        await api.post(`/tpm/itemchecks/denyAdded`, data)
        this.getUpdate()
        this.getUpdatedItem()
      } catch (error) {
        console.log(error);
      }
    },

    async denyEdit(data) {
      try {
        await api.post(`/tpm/itemchecks/denyEdit`, data)
        this.getUpdate()
        this.getUpdatedItem()
      } catch (error) {
        console.log(error);
      }
    },

    async getUpdate() {
      try {
        let dataUpdate = await api.get(`/tpm/ledgers/new_data`, '?')
        this.dataUpdate = dataUpdate.data.data
        console.log(this.dataUpdate);
      } catch (error) {
        toast.error(error)
      }
    },

    async getUpdatedItem() {
      try {
        let dataUpdatedItem = await api.get(`/tpm/itemchecks/updatedItem`, '?')
        this.dataUpdatedItem = dataUpdatedItem.data.data
        console.log(this.dataUpdatedItem);
      } catch (error) {
        console.log(error);
      }
    }
  },


  async mounted() {
    await this.getUpdate()
    await this.getUpdatedItem()
  }
}
</script>

<style scoped>
.tableFixHead {
  overflow-y: auto;
  height: 350px;
  z-index: 1;
}
</style>
