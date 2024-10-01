<template>
  <CCard>
    <CCardHeader>
      <CRow>
        <CCol lg="2">
          <CCardTitle>
            Table Counter Monitor
          </CCardTitle>
        </CCol>
        <CCol lg="10" class="text-end">
          <CButton class="mx-1" color="info" style="font-weight: bold;">
            <CIcon :icon="cilList" size="lg"/> <CBadge color="dark">{{ new Date().toJSON().slice(0,10) }}</CBadge>
          </CButton>
          <CButton class="mx-1" color="dark" @click="toggleFilter('overdue')" style="font-weight: bold;">
            OVERDUE <CBadge color="info">{{ overdueCount }}</CBadge>
          </CButton>
          <CButton class="mx-1" color="danger" @click="toggleFilter('danger')" style="font-weight: bold;">
            DANGER <CBadge color="info">{{ dangerCount }}</CBadge>
          </CButton>
          <CButton class="mx-1" color="warning" @click="toggleFilter('warning')" style="font-weight: bold;">
            WARNING <CBadge color="info">{{ warningCount }}</CBadge>
          </CButton>
          <CButton class="mx-1" color="success" @click="toggleFilter('safe')" style="font-weight: bold;">
            SAFE <CBadge color="info">{{ safeCount }}</CBadge>
          </CButton>
        </CCol>
      </CRow>
    </CCardHeader>

    <CCardBody class="overflow-auto">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th class="text-center" rowspan="2">No</th>
            <th class="w100 text-center" rowspan="2">LINE</th>
            <th class="w100 text-center" rowspan="2">MACHINE</th>
            <th class="w100 text-center" rowspan="2">ITEM</th>
            <th class="w100 text-center" rowspan="2">INCHARGE</th>
            <th class="w100 text-center" colspan="2">COUNTER PARTS</th>
            <th class="w100 text-center" colspan="2">ESTIMATION DATE</th>
            <th class="w100 text-center" rowspan="2">ACTIONS</th>
          </tr>
          <tr>
            <th class="w100 text-center">PERCENTAGE</th>
            <th class="w100 text-center">CYCLE</th>
            <th class="w100 text-center">DATE</th>
            <th class="w100 text-center">DAY REMAIN</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in paginatedData" :key="i">
            <td class="text-center">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td class="text-center">{{ item?.line_nm }}</td>
            <td class="text-center">{{ item?.machine_nm }}</td>
            <td class="text-center">{{ item?.itemcheck_nm }}</td>
            <td class="text-center">{{ item?.incharge_nm }}</td>
            <td class="text-center">
              <CProgress v-if="item?.percentage < 75" :height="25" variant="striped" animated color="success" :value="item.percentage">{{ item.percentage }}%</CProgress>
              <CProgress v-if="item?.percentage >= 75 && item.percentage < 90" :height="25" variant="striped" animated color="warning" :value="item.percentage">{{ item.percentage }}%</CProgress>
              <CProgress v-if="item?.percentage >= 90 && item.percentage <= 100" :height="25" variant="striped" animated color="danger" :value="item.percentage">{{ item.percentage }}%</CProgress>
              <CProgress v-if="item?.percentage > 100" :height="25" variant="striped" animated color="dark" :value="item.percentage">{{ item.percentage }}%</CProgress>
            </td>
            <td class="text-center">
              {{ (item?.last_counter - item?.init_counter).toLocaleString('de-DE') }} / {{ (item?.lifespan_counter).toLocaleString('de-DE') }}
            </td>
            <td class="text-center">{{ (item?.est_dt)?.slice(0, 10) }}</td>
            <td class="text-center">{{ Math.ceil((new Date(item?.est_dt) - new Date()) / (1000 * 3600 * 24)) >= 0 ? Math.ceil((new Date(item?.est_dt) - new Date()) / (1000 * 3600 * 24)) + ' Days' : 'Overdue' }}</td>
            <td class="text-center">
              <CButton color="info" size="sm" style="z-index: 1" @click="showModal(item)">DETAILS</CButton>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <CRow class="justify-content-center mt-3">
        <CCol lg="auto">
          <CPagination aria-label="Page navigation">
            <CPaginationItem @click="goToPage(1)" :disabled="currentPage === 1">First</CPaginationItem>
            <CPaginationItem @click="prevPage" :disabled="currentPage === 1">Previous</CPaginationItem>

            <CPaginationItem v-for="page in paginatedPages" :key="page" @click="goToPage(page)" :active="page === currentPage">
              {{ page }}
            </CPaginationItem>

            <CPaginationItem @click="nextPage" :disabled="currentPage === totalPages">Next</CPaginationItem>
            <CPaginationItem @click="goToPage(totalPages)" :disabled="currentPage === totalPages">Last</CPaginationItem>
          </CPagination>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import api from "@/apis/CommonAPI";
import { CIcon } from '@coreui/icons-vue';


export default {
  name: 'TableCounterMonitor',

  data() {
    return {
      data: [],
      selectedFilter: null,
      pollingInterval: 60000,
      currentPage: 1,
      itemsPerPage: 20,
      visiblePages: 3 // Number of pages to display around the current page
    }
  },

  components: {
    CIcon,
  },

  computed: {
    overdueCount() {
      return this.data.filter(item => item.percentage > 100).length;
    },
    dangerCount() {
      return this.data.filter(item => item.percentage >= 90 && item.percentage <= 100).length;
    },
    warningCount() {
      return this.data.filter(item => item.percentage >= 75 && item.percentage < 90).length;
    },
    safeCount() {
      return this.data.filter(item => item.percentage < 75).length;
    },

    filteredData() {
      if (!this.selectedFilter) {
        return this.data;
      }
      switch (this.selectedFilter) {
        case 'overdue':
          return this.data.filter(item => item.percentage > 100);
        case 'danger':
          return this.data.filter(item => item.percentage >= 90 && item.percentage <= 100);
        case 'warning':
          return this.data.filter(item => item.percentage >= 75 && item.percentage < 90);
        case 'safe':
          return this.data.filter(item => item.percentage < 75);
        default:
          return this.data;
      }
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },

    paginatedPages() {
      let startPage = Math.max(1, this.currentPage - Math.floor(this.visiblePages / 2));
      let endPage = Math.min(this.totalPages, startPage + this.visiblePages - 1);

      // Adjust start page if not enough pages on the right side
      startPage = Math.max(1, Math.min(startPage, this.totalPages - this.visiblePages + 1));

      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    }
  },

  mounted() {
    this.startPolling();
  },

  beforeDestroy() {
    clearTimeout(this.pollingTimeout);
  },

  methods: {
    async getCounter() {
      try {
        let items = await api.get('/tpm/counter/getCounter', '?');
        this.data = items.data.data;
      } catch (error) {
        console.error("Error fetching counter data:", error);
      }
    },

    startPolling() {
      this.getCounter().then(() => {
        this.pollingTimeout = setTimeout(this.startPolling, this.pollingInterval);
      });
    },

    toggleFilter(filter) {
      if (this.selectedFilter === filter) {
        this.selectedFilter = null;
      } else {
        this.selectedFilter = filter;
      }
      this.currentPage = 1;
    },

    showModal(item) {
      this.$emit('show-modal', item);
    },

    goToPage(page) {
      this.currentPage = page;
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
}

</script>
