<template>
  <div>
  <CContainer fluid>
    <CRow>
      <CCol md="12">
        <div class="container-fluid p-0">
          <div class="row mb-2">
            <div class="col">
              <CInputGroup class="mb-3">
                <CInputGroupText as="label" for="LineSelect">Line</CInputGroupText>
                <CFormSelect v-model="filter.line_id">
                  <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                    {{ line.text }}
                  </option>
                </CFormSelect>
              </CInputGroup>
              <!-- <label>Line</label>
            <select class="form-select" v-model="filter.line_id">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select> -->
            </div>
            <div class="col">
              <CInputGroup class="mb-3">
                <CInputGroupText as="label" for="StatusSelect">Status</CInputGroupText>
                <CFormSelect v-model="filter.status_id">
                  <option v-for="(line, index) in getStatusOpts" :key="index" :value="line.id">
                    {{ line.text }}
                  </option>
                </CFormSelect>
              </CInputGroup>
              <!-- <label>Status</label>
            <select class="form-select" v-model="filter.status_id">
              <option
                v-for="(line, index) in getStatusOpts"
                :key="index"
                :value="line.id"
              >
                {{ line.text }}
              </option>
            </select> -->
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="d-flex flex-row justify-content-between align-items-center">
                <template v-if="isMobile">
                  <div v-for="(item, i) in dailyOpts" :key="i" class="flex-col">
                    <button :class="`btn btn-sm ${item.is_active ? 'btn-primary' : 'btn-outline-primary'
                  } rounded-circle`" type="button" @click="generateTodayActivities(i)">
                      {{ item.label }}
                    </button>
                  </div>
                </template>

                <template v-else>
                  <div v-for="(item, i) in dailyDesktopOpts" :key="i" class="flex-col">
                    <button :class="`btn btn-sm ${item.is_active ? 'btn-primary' : 'btn-outline-primary'
                  } rounded-circle`" type="button" @click="generateTodayActivities(i)">
                      {{ item.label }}
                    </button>
                  </div>
                </template>
              </div>
            </div>
            <div class="card-body p-0 mt-3">
              <div class="card p-3">
                <ul>
                  <li>TPM Activities</li>
                </ul>
                <div class="row">
                  <template v-if="getTodayActivities.length > 0 && !isLoading">
                    <div v-for="item in getTodayActivities" :key="item.observation_id" class="col-12 col-md-4 col-lg-4">
                      <div class="card p-2 mt-2"
                        :style="`border-left: 5px solid ${item.color_tag}!important;min-height: 80px`">
                        <div class="d-flex flex-row justify-content-between align-items-center">
                          <div class="d-flex flex-column">
                            Line: {{ item.line_nm }} | M/C:
                            {{ item.machine_nm }} | Dept:
                            {{ item.incharge_nm }} | Checker :
                            {{
                  item.checkers.map((checker) => checker.user_nm)
                    .length == 0
                    ? "-"
                    : item.checkers.map(
                      (checker) => checker.user_nm
                    )[0]
                }}
                          </div>
                          <div class="d-flex flex-column">
                            <button v-if="item.status_nm !== 'DONE'" class="btn btn-sm btn-outline-primary" @click="
                  $router.push(
                    `/tpm/monitoring/${item.schedule_id}`
                  )
                  ">
                              Check
                            </button>
                            <button v-else class="btn btn-sm btn-outline-success" @click="
                  $router.push(
                    `/tpm/monitoring/${item.schedule_id}`
                  )
                  ">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="isLoading">
                    <div class="col-12 col-md-4 col-lg-4">
                      <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                      Loading...
                    </div>
                  </template>
                  <template v-else>
                    <NoDataContent />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CCol>
    </CRow>
  </CContainer>
</div>
</template>

<script>
import moment from "moment";

import NoDataContent from "@/components/Card/NoDataContent.vue";

import { toast } from "vue-sonner";
import { GET_LINES } from "@/store/lines.module";
import { mapGetters } from "vuex";
import { GET_STATUS } from "@/store/status.module";
import { GET_TODAY_ACTIVITIES } from "@/store/todayActivities.module";

export default {
  name: "TpmTodayActivites",
  data() {
    return {
      isLoading: false,
      dailyOpts: [
        {
          label: "S",
          is_active: false,
          date: null,
        },
        {
          label: "S",
          is_active: false,
          date: null,
        },
        {
          label: "R",
          is_active: false,
          date: null,
        },
        {
          label: "K",
          is_active: false,
          date: null,
        },
        {
          label: "J",
          is_active: false,
          date: null,
        },
        {
          label: "S",
          is_active: false,
          date: null,
        },
        {
          label: "M",
          is_active: false,
          date: null,
        },
      ],
      dailyDesktopOpts: [
        {
          label: "Senin",
          is_active: false,
          date: null,
        },
        {
          label: "Selasa",
          is_active: false,
          date: null,
        },
        {
          label: "Rabu",
          is_active: false,
          date: null,
        },
        {
          label: "Kamis",
          is_active: false,
          date: null,
        },
        {
          label: "Jumat",
          is_active: false,
          date: null,
        },
        {
          label: "Sabtu",
          is_active: false,
          date: null,
        },
        {
          label: "Minggu",
          is_active: false,
          date: null,
        },
      ],
      containerDateOfThisWeek: [],
      windowWidth: window.innerWidth,
      filter: {
        line_id: localStorage.getItem("line_id") ?? -1,
        date: null,
        status_id: -1,
      },
      isMobile: false,
      tpmData: [],
    };
  },
  watch: {
    windowWidth() {
      console.log(this.windowWidth);
      if (this.windowWidth < 500) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
    filter: {
      handler() {
        this.ActionGetTodayActivities();
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["getLinesOpts", "getStatusOpts", "getTodayActivities"]),
  },
  methods: {
    async ActionGetLines() {
      try {
        await this.$store.dispatch(GET_LINES, this.filter);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    async ActionGetStatus() {
      try {
        await this.$store.dispatch(GET_STATUS);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    async ActionGetTodayActivities() {
      try {
        await this.$store.dispatch(GET_TODAY_ACTIVITIES, this.filter);
      } catch (error) {
        console.log(error);

        toast.error(error.response.data.message);
      }
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    generateDateOfThisWeek() {
      let thisDay = moment().startOf("week");
      if (moment().isoWeekday() == 7) {
        thisDay = moment().startOf("week").subtract(1, "weeks");
      }
      let today = moment().format("YYYY-MM-DD");
      for (let i = 0; i < 7; i++) {
        var date = thisDay.add(1, "days").format("YYYY-MM-DD");
        this.dailyOpts[i].date = date;
        this.dailyDesktopOpts[i].date = date;
        if (today == date) {
          this.dailyOpts[i].is_active = true;
          this.dailyDesktopOpts[i].is_active = true;
          this.filter.date = date;
        }
      }
    },
    generateTodayActivities(idxSelected) {
      const mapDay = this.dailyOpts.map((item, i) => {
        if (idxSelected == i) {
          this.dailyDesktopOpts[i].is_active = true;
          item.is_active = true;
          this.filter.date = item.date;
        } else {
          this.dailyDesktopOpts[i].is_active = false;
          item.is_active = false;
        }
        return item;
      });
      this.dailyOpts = mapDay;
    },
  },
  async mounted() {
    this.isLoading = true;
    this.onResize();
    this.generateDateOfThisWeek();
    await this.ActionGetLines();
    await this.ActionGetStatus();
    await this.ActionGetTodayActivities();
    this.isLoading = false;
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  components: {
    NoDataContent,
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
  min-width: 100px;
}

.w200-per {
  min-width: 90px;
}

th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  background: white;
}

thead {
  top: 0;
  position: sticky;
  z-index: 1 !important;
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
  left: 30px;
}

tr th:nth-child(3),
tr td:nth-child(3) {
  left: 100px;
}

tr th:nth-child(4),
tr td:nth-child(4) {
  left: 200px;
}
</style>
