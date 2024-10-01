<template>
  <CRow>
    <CCol :md="6">
      <CCard class="mb-1">
        <CCardHeader>
          <CCardTitle>ADDED ITEM HISTORY</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol class="tableFixHead">
              <table class="table table-bordered table-striped" responsive="md">
                <thead>
                  <tr>
                    <th class="no text-center">No</th>
                    <th class="no text-center">Machine</th>
                    <th class="text-center">Item Name</th>
                    <th class="text-center">Condition</th>
                    <th class="text-center" colspan="2">Periods</th>
                    <th class="text-center">Date Approved</th>
                    <th class="text-center">Approved By</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in newItems" :key="i">
                    <td class="text-center">{{ i + 1 }}</td>
                    <td class="text-center">{{ item.machine_nm }}</td>
                    <td class="text-center">{{ item.itemcheck_nm }}</td>
                    <td class="text-center">{{ item.condition }}</td>
                    <td class="text-center">{{ item.val_periodic }}</td>
                    <td class="text-center">{{ item.period_nm }}</td>
                    <td class="text-center">
                      {{ item.created_dt.split("T")[0] }}
                    </td>
                    <td class="text-center">{{ item.created_by }}</td>
                    <td class="text-center">
                      <CButton class="btn btn-sm col" color="info" @click="">DETAILS</CButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol :md="6">
      <CCard class="mb-1">
        <CCardHeader>
          <CCardTitle>ADDED ITEM HISTORY</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol class="tableFixHead">
              <table class="table table-bordered table-striped" responsive="md">
                <thead>
                  <tr>
                    <th class="no text-center">No</th>
                    <th class="no text-center">Machine</th>
                    <th class="text-center">Item Name</th>
                    <th class="text-center">Condition</th>
                    <th class="text-center" colspan="2">Periods</th>
                    <th class="text-center">Date Approved</th>
                    <th class="text-center">Approved By</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in editedItems" :key="i">
                    <td class="text-center">{{ i + 1 }}</td>
                    <td class="text-center">{{ item.machine_nm }}</td>
                    <td class="text-center">{{ item.itemcheck_nm_new }}</td>
                    <td class="text-center">{{ item.condition }}</td>
                    <td class="text-center">{{ item.val_periodic_new }}</td>
                    <td class="text-center">{{ item.period_nm }}</td>
                    <td class="text-center">
                      {{ item.created_dt.split("T")[0] }}
                    </td>
                    <td class="text-center">{{ item.created_by }}</td>
                    <td class="text-center">
                      <CButton class="btn btn-sm col" color="info" @click="">DETAILS</CButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import api from "@/apis/CommonAPI";

export default {
  name: "TableItemHistory",
  data() {
    return {
      newItems: [],
      editedItems: [],
    };
  },

  methods: {
    async getItem() {
      try {
        console.log("cie berhasil");
        let newItems = await api.get(`/tpm/history/getNewItem`, `?`);
        this.newItems = newItems.data.data;
        console.log(this.newItems);
      } catch (error) {
        console.log(error);
      }
    },

    async getEditedItem() {
      try {
        console.log("cie berhasil");
        let editedItems = await api.get(`/tpm/history/getEditItem`, `?`);
        this.editedItems = editedItems.data.data;
        console.log(this.editedItems);
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.getItem();
    this.getEditedItem();
  },
};
</script>

<style>
.tableFixHead {
  overflow-y: auto;
  height: 350px;
  z-index: 1;
}
</style>
