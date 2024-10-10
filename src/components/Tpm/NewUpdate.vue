<template>
  <CRow>
    <CCol v-if="isNew && !showAll">
      <div>
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
                      <CCardTitle>
                        Changed By: {{ item.changed_by }}
                      </CCardTitle>
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
                        {{
                          item.val_periodic && item.period_nm
                            ? `${item.val_periodic} ${item.period_nm}`
                            : "-"
                        }}
                      </CCol>
                    </CRow>
                  </CCardSubtitle>
                  <CCardText>{{ item.reasons }}</CCardText>
                </CCardBody>
                <CCardFooter>
                  <CButton
                    class="btn btn-sm col me-3"
                    color="success"
                    @click="approveNewItem(item)"
                  >
                    APPROVE
                  </CButton>
                  <CButton
                    class="btn btn-sm col"
                    color="danger"
                    style="max-width: 100px"
                    @click="denyAdded(item)"
                  >
                    DENY
                  </CButton>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </template>
        <template v-else>
          <CCard>
            <CCardBody> NO DATA</CCardBody>
          </CCard>
        </template>
      </div>
      <!--      <CCard>
        <CCardHeader>

        </CCardHeader>
        <CCardBody class="tableFixHead">

        </CCardBody>
      </CCard>-->
    </CCol>
    <CCol v-else>
      <template v-if="dataUpdatedItem.length > 0">
        <CRow>
          <CCol
            class="mb-3"
            lg="12"
            v-for="(update, i) in dataUpdatedItem"
            :key="i"
          >
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol class="mb-2">
                    <CCardTitle>{{ update.machine_nm }}</CCardTitle>
                  </CCol>
                  <CCol class="text-end">
                    <CCardTitle>Changed By: {{ update.changed_by }}</CCardTitle>
                  </CCol>
                </CRow>
                <CCardTitle class="mb-2 text-body-secondary">
                  {{ update.itemcheck_nm_old }}
                </CCardTitle>
                <CAccordion>
                  <CAccordionItem>
                    <CAccordionHeader> DETAIL</CAccordionHeader>
                    <CAccordionBody>
                      <CTable>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="col"
                            >COLUMN
                            </CTableHeaderCell>
                            <CTableHeaderCell scope="col">OLD</CTableHeaderCell>
                            <CTableHeaderCell scope="col">NEW</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell>ITEM NAME</CTableDataCell>
                            <CTableDataCell
                            >{{ update.itemcheck_nm_old }}
                            </CTableDataCell>
                            <CTableDataCell
                            >{{ update.itemcheck_nm_new }}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>METHOD</CTableDataCell>
                            <CTableDataCell
                            >{{ update.method_check_old }}
                            </CTableDataCell>
                            <CTableDataCell
                            >{{ update.method_check_new }}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>DURATION</CTableDataCell>
                            <CTableDataCell
                            >{{ update.duration_old }}
                            </CTableDataCell>
                            <CTableDataCell
                            >{{ update.duration_new }}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>MP</CTableDataCell>
                            <CTableDataCell>{{ update.mp_old }}</CTableDataCell>
                            <CTableDataCell>{{ update.mp_new }}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>PERIOD</CTableDataCell>
                            <CTableDataCell
                            >{{ update.val_periodic_old }}
                              {{ update.period_id_old }}
                            </CTableDataCell>
                            <CTableDataCell
                            >{{ update.val_periodic_new }}
                              {{ update.period_id_new }}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>STANDARD</CTableDataCell>
                            <CTableDataCell
                            >{{ update.standard_measurement_old }}
                            </CTableDataCell>
                            <CTableDataCell
                            >{{ update.standard_measurement_new }}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>UPPER</CTableDataCell>
                            <CTableDataCell
                            >{{
                                update.upper_limit_old
                                  ? update.upper_limit_old
                                  : 0
                              }}
                            </CTableDataCell>
                            <CTableDataCell
                            >{{
                                update.upper_limit_new
                                  ? update.upper_limit_new
                                  : 0
                              }}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>LOWER</CTableDataCell>
                            <CTableDataCell
                            >{{
                                update.lower_limit_old
                                  ? update.lower_limit_old
                                  : 0
                              }}
                            </CTableDataCell>
                            <CTableDataCell
                            >{{
                                update.lower_limit_new
                                  ? update.lower_limit_new
                                  : 0
                              }}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableDataCell>REASON</CTableDataCell>
                            <CTableDataCell colspan="2"
                            >{{ update.reason }}
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CAccordionBody>
                  </CAccordionItem>
                </CAccordion>
              </CCardBody>
              <CCardFooter>
                <CButton
                  class="btn btn-sm col me-3 text-white"
                  color="success"
                  @click="approveChangeItem(update)"
                >
                  Approve
                </CButton>
                <CButton
                  class="btn btn-sm col text-white"
                  color="danger"
                  style="max-width: 100px"
                  @click="denyEdit(update)"
                >
                  Deny
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </template>
      <template v-else>
        <span>No Data</span>
      </template>
    </CCol>
  </CRow>
</template>
<script>
import api from "@/apis/CommonAPI";
import {toast, Toaster} from "vue-sonner";
import utils from "@/utils/CommonUtils";

export default {
  name: "newUpdate",
  data() {
    return {
      dataUpdate: [],
      dataUpdatedItem: [],
      toaster: [],
    };
  },

  components: {
    Toaster,
  },

  props: {
    isNew: {
      type: Boolean,
      default: true,
    },
    showAll: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    async approveNewItem(data) {
      const loader = this.$loading.show();
      try {
        const result = await api.post("/tpm/itemchecks/approvedNew", data);
        if (result.status === 200) {
          console.log("result approveNewItem()", result);
          this.loadItem();
          toast.success("Item check Baru berhasil di setujui");
          //this.$emit('on-close', true);
        } else {
          toast.error("Terjadi kesalahan saat menyimpan data", {
            description: result.response?.data?.message?.error ?? '',
          });
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menyimpan data", {
          description: error,
        });
      } finally {
        loader.hide();
      }
    },

    async approveChangeItem(data) {
      const loader = this.$loading.show();
      // this.$store.dispatch('ACT_APPROVE_UPDATED_ITEMCHECK', data)
      try {
        const result = await api.post("/tpm/itemchecks/approvedUpdated", data);
        if (result.status === 200) {
          this.loadItem();
          toast.success("Perubahan Item check berhasil di setujui");
        } else {
          toast.error("Terjadi kesalahan saat menyimpan data", {
            description: result.data.message?.message ?? result.data.message,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Terjadi kesalahan saat menyimpan data", {
          description: error,
        });
      } finally {
        loader.hide();
      }
    },

    async denyAdded(data) {
      const loader = this.$loading.show();
      try {
        const result = await api.post(`/tpm/itemchecks/denyAdded`, data);
        console.log('result', result);
        if (result.status === 200) {
          this.loadItem();
          toast.success("Item check baru berhasil di tolak");
        } else {
          utils.showResponseError(result.response?.data?.message?.message ?? result.response?.data?.message);
        }
      } catch (error) {
        console.log('error denyAdded()', error);
        toast.error("Terjadi kesalahan saat menyimpan data", {
          description: error,
        });
      } finally {
        loader.hide();
      }
    },

    async denyEdit(data) {
      const loader = this.$loading.show();

      try {
        const result = await api.post(`/tpm/itemchecks/denyEdit`, data);
        if (result.status === 200) {
          this.loadItem();
          toast.success("Perubahan Item check berhasil di tolak");
        } else {
          toast.error("Terjadi kesalahan saat menyimpan data", {
            description: result.data.message?.message ?? result.data.message,
          });
        }
      } catch (error) {
        console.log("denyEdit()", error);
        toast.error("Terjadi kesalahan saat menyimpan data", {
          description: error,
        });
      } finally {
        loader.hide();
      }
    },

    async getNewItem() {
      try {
        let dataUpdate = await api.get(`/tpm/itemchecks/newItemRequest`, "?");
        this.dataUpdate = dataUpdate.data.data;
        console.log(this.dataUpdate);
      } catch (error) {
        toast.error(error);
      }
    },

    async getChangeItem() {
      try {
        let dataUpdatedItem = await api.get(`/tpm/itemchecks/updatedItem`, "?");
        this.dataUpdatedItem = dataUpdatedItem.data.data;
        console.log(this.dataUpdatedItem);
      } catch (error) {
        console.log(error);
      }
    },
    loadItem() {
      if (this.isNew) {
        this.getNewItem();
      } else {
        this.getChangeItem();
      }

      this.emitter.emit('updatedItemRequest', true)
    },
  },

  async mounted() {
    this.loadItem();
  },
};
</script>

<style scoped>
.tableFixHead {
  overflow-y: auto;
  height: 350px;
  z-index: 1;
}
</style>
