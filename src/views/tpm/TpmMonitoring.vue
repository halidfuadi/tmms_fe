<template>
  <div>
    <CContainer fluid>
      <CRow>
        <CCol :md="12">
          <div class="container-fluid">
            <Toaster position="top-center" closeButton/>
            <ModalPic :isShow="isShow" :incharge_id="incharge_id" :machine_nm="machine_nm"
                      :plan_check_dt="plan_check_dt"
                      :schedule_id="schedule_id"
                      :selected-pics="selectedPics"
                      :schedule_checker_id="schedule_checker_id"
                      @showChanges="showChanges($event)"/>
            <SearchBar @onSubmitSearch="getSchedules($event)"/>
            <DropBarDelay/>
            <StatusTpm :filter="filter"/>
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol class="tableFixHead">
                    <table class="table table-bordered table-striped">
                      <thead>
                      <tr>
                        <th rowspan="2">No</th>
                        <th class="w100-line text-center" rowspan="2" style="font-size: 15px">
                          Line
                        </th>
                        <th class="w200-mc" rowspan="2" style="font-size: 15px">
                          Machine
                        </th>
                        <th class="w300-item-check text-center" rowspan="2" style="font-size: 15px">
                          Item Check
                        </th>
                        <th class="text-center" rowspan="2" colspan="2" style="font-size: 15px">
                          Periodic
                        </th>
                        <th class="text-center" rowspan="2" style="font-size: 15px">
                          Incharge
                        </th>
                        <th class="text-center w100-pic" rowspan="2" style="font-size: 15px">
                          PIC
                        </th>
                        <th class="text-center" :colspan="31" style="font-size: 15px">
                          {{ "Schedule" }}
                        </th>
                        <th class="text-center w100-line" rowspan="2" style="font-size: 15px">
                          Next Check
                        </th>
                      </tr>
                      <tr>
                        <td class="w40-date text-center" v-for="i in 31" :key="i">
                          {{ i }}
                        </td>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-if="loading">
                        <th class="text-center" colspan="37">
                          <CSpinner
                            component="span"
                            size="sm"
                            variant="grow"
                            aria-hidden="true"
                          />
                          Loading...
                        </th>
                      </tr>
                      <template v-else-if="schedules && Object.keys(schedules).length > 0">
                        <tr v-for="(schedule, key, ipar) in schedules" :key="key">
                          <td>{{ schedule.no }}</td>
                          <td>{{ schedule.line_nm }}</td>
                          <td>{{ schedule.machine_nm }}</td>
                          <td>{{ schedule.itemcheck_nm }}</td>
                          <td>{{ schedule.val_periodic }}</td>
                          <td class="text-center">
                            {{ schedule.period_nm }}
                          </td>
                          <td class="text-center">
                            {{ schedule.incharge_nm }}

                          </td>
                          <td v-if="schedule.checkers" class="sticky-pic">
                            <CButton color="success" size="sm" @click="confirmShow(schedule)" :style="`z-index: 1;`" class="text-white">
                              {{ schedule.checkers.user_nm }}
                            </CButton>
                          </td>
                          <td v-else class="sticky-pic">
                            <CButton class="btn btn-sm w-100 text-white" color="info" @click="confirmShow(schedule)">ASSIGN
                            </CButton>
                          </td>
                          <template v-for="date in dates" :key="date">
                            <td v-if="schedule.day_idx === date">
                              <!-- BTN FOR ASSIGN PIC -->
                              <CButton size="lg" v-if="!schedule.checkers || Object.keys(schedule.checkers).length == 0"
                                       :style="`height: 35px ;background-color: ${schedule.color_tag}`" @click="
                                confirmShow(schedule)
                              "></CButton>
                              <!-- BTN FOR EXECUTION -->
                              <CButton size="lg" v-else :style="`height: 35px; background-color: ${schedule.color_tag}`"
                                       @click="
                                executionPage(schedule)
                              "></CButton>
                            </td>
                            <td v-else></td>
                          </template>
                          <td>{{ schedule?.next_check && schedule?.next_check?.includes('T') ? schedule.next_check.split("T")[0] : '' }}</td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr>
                          <td class="text-center" colspan="37">
                            <b>Tidak Ada Data</b>
                          </td>
                        </tr>
                      </template>
                      </tbody>
                    </table>
                  </CCol>
                </CRow>
              </CCardBody>

              <CCardFooter>
                <div class="card-footer">
                  <div class="d-flex justify-content-between">
                    <div>
                      <div class="input-group mb-3">
                        <label class="input-group-text">Limit</label>
                        <select class="form-select" v-model="limit"
                                @change="handleLimitChange($event)">
                          <option selected value="10">10</option>
                          <option value="20">20</option>
                          <option value="40">40</option>
                          <option value="60">60</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <CustPagination :totalItems="totalData" :items-per-page="limit"
                                      :current-page="currentPage"
                                      @page-changed="handlePageChange($event)"/>
                    </div>
                  </div>
                </div>
              </CCardFooter>
            </CCard>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import api from "@/apis/CommonAPI";
import {Toaster} from "vue-sonner";
import ModalPic from "@/components/Tpm/ModalPic";
import SearchBar from "@/components/Tpm/SearchBar";
import StatusTpm from "../../views/charts/StatusTpm.vue";
import DropBarDelay from "../../components/Tpm/DropBarDelay.vue";
import {CButton} from "@coreui/vue";
import CustPagination from "@/components/Tpm/CustPagination.vue";
import ModalExecuteCounter from "@/components/Tpm/ModalExecuteCounter.vue";

export default {
  name: "TpmMonitoring",
  data() {
    return {
      isShow: false,
      filter: null,
      schedule_id: null,
      schedules: [],
      incharge_id: null,
      machine_nm: null,
      plan_check_dt: null,
      year: null,
      month: null,
      currentPage: 1, // Current page
      totalData: 0,
      limit: 10, // Items per page
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      selectedPics: null,
      loading: false,
      schedule_checker_id: null,
    };
  },
  async mounted() {
    //await this.getSchedules();
  },
  watch: {
    onSubmitSearch(newVal, oldVal){
      console.log('newVal', newVal);
    }
  },
  methods: {
    async getSchedules(filter = null) {
      console.log('filter getSchedules', filter)
      this.loading = true;
      try {
        if (!filter) {
          filter = this.filter;
        } else {
          this.filter = filter;
        }

        this.filter = {
          ...this.filter,
          page: this.currentPage,
          limit: this.limit,
        };

        const monthYear = this.filter.month.split('-');
        this.generateDate(monthYear[0], monthYear[1]);
        // Fetch schedules with pagination
        const query = new URLSearchParams(this.filter);
        let {data: {data: response}} = await api.get(`/tpm/schedules`, `?${query.toString()}`);
        this.schedules = response.schedules;
        this.totalData = response.total;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    generateDate(month, year) {
      let monthIdx = this.months.indexOf(month);
      let totalDate = new Date(year, monthIdx + 1, 0, 23, 59, 59).getDate();
      this.dates = [];
      console.log(new Date(year, monthIdx + 1, 0, 23, 59, 59));
      for (let index = 1; index <= totalDate; index++) {
        this.dates.push(index);
      }
    },
    showChanges(state) {
      this.isShow = false;
      //determine schedule should refetch from changes Modal
      if (state) {
        this.getSchedules();
      }
    },

    async confirmShow(schedule) {
      this.isShow = true;
      console.log(schedule);
      this.machine_nm = schedule.machine_nm;
      this.incharge_id = schedule.incharge_id;
      this.schedule_id = schedule.schedule_id;
      this.plan_check_dt = schedule.plan_check_dt;
      this.schedule_checker_id = schedule.schedule_checker_id;
      this.selectedPics = schedule.checkers;
    },
    executionPage(schedule) {
      this.$router.push(`monitoring/${schedule.schedule_id}`);
    },
    handleLimitChange(event) {
      this.limit = event.target.value;
      this.getSchedules();
    },
    handlePageChange(event) {
      this.currentPage = event;
      this.getSchedules();
    },
    colorIsDarkAdvanced(bgColor) {
      let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
      let r = parseInt(color.substring(0, 2), 16); // hexToR
      let g = parseInt(color.substring(2, 4), 16); // hexToG
      let b = parseInt(color.substring(4, 6), 16); // hexToB
      let uicolors = [r / 255, g / 255, b / 255];
      let c = uicolors.map((col) => {
        if (col <= 0.03928) {
          return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
      });
      let L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
      return L <= 0.179 ? '#FFFFFF' : '#000000';
    }
  },
  components: {
    ModalExecuteCounter,
    CustPagination,
    SearchBar,
    StatusTpm,
    ModalPic,
    Toaster,
    DropBarDelay,
  },
};
</script>

<style scoped>
.w100-line {
  min-width: 100px;
}

.w40-date {
  min-width: 40px;
  z-index: -1 !important;
}

.w300-item-check {
  min-width: 300px;
}

.w200-mc {
  min-width: 200px;
}

th,
td {
  border: 0.5px solid black;
  /* border-collapse: collapse; */
  background: white;
}

thead {
  top: 0;
  position: sticky;
  z-index: 1;
}

.tableFixHead {
  overflow-y: auto;
  height: 800px;
  z-index: 1;
}

tr td:nth-child(1),
tr td:nth-child(2),
tr td:nth-child(3),
tr td:nth-child(4),
tr th:nth-child(1),
tr th:nth-child(2),
tr th:nth-child(3),
tr th:nth-child(4) {
  position: sticky;
  left: 0;
}

tr th:nth-child(2),
tr td:nth-child(2) {
  left: 20px;
}

tr th:nth-child(3),
tr td:nth-child(3) {
  left: 100px;
}

tr th:nth-child(4),
tr td:nth-child(4) {
  left: 190px;
}

/* Add this for sticky PIC column */
tr td:nth-child(8),
tr th:nth-child(8) {
  position: sticky;
  left: 490px; /* Adjust based on the width of previous columns */
}

.sticky-pic {
  background: white; /* Ensure it doesn't overlap */
}
</style>
