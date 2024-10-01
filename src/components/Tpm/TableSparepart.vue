<template>
  <CCard class="p-3">
    <CRow>
      <table class="table table-bordered table-striped" responsive="md">
        <thead>
          <tr>
            <th class="no text-center">No</th>
            <th class="no text-center">Material Number</th>
            <th class="text-center">Description</th>
            <th class="text-center">UOM</th>
            <th class="text-center">LT (day)</th>
            <th class="text-center">Stock</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in paginatedItems" :key="i">
            <td class="text-center">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
            <td class="text-center">{{ item.material_number }}</td>
            <td class="text-center">{{ item.sparepart_nm }}</td>
            <td class="text-center">{{ item.uom }}</td>
            <td class="text-center">{{ item.lead_time }}</td>
            <td class="text-center">{{ item.stock }}</td>
            <td class="text-center">
              <CButton class="btn btn-sm col" color="info" @click="">DETAILS</CButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-center">
        <CButton class="btn btn-sm" color="secondary" @click="prevPage" :disabled="currentPage === 1">Previous</CButton>
        <span class="mx-2">{{ currentPage }} / {{ totalPages }}</span>
        <CButton class="btn btn-sm" color="secondary" @click="nextPage" :disabled="currentPage === totalPages">Next
        </CButton>
      </div>
    </CRow>
  </CCard>
</template>

<script>
import api from "@/apis/CommonAPI";

export default {
  name: "TableSparepart",
  data() {
    return {
      newItems: [],
      currentPage: 1,
      pageSize: 50,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.newItems.length / this.pageSize);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.newItems.slice(start, end);
    }
  },

  methods: {
    async getSparepart() {
      try {
        console.log("cie berhasil");
        let newItems = await api.get(`/tpm/spareparts/get-sparepart/search`, `?`);
        this.newItems = newItems.data.data;
        console.log(this.newItems);
      } catch (error) {
        console.log(error);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },

  mounted() {
    this.getSparepart();
  }
};
</script>

<style>
.tableFixHead {
  overflow-y: auto;
  height: 350px;
  z-index: 1;
}
</style>
