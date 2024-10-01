<template>
  <div>
  <CContainer fluid>
    <CRow>
      <CCol :md="12">
        <div class="container-fluid p-0">
          <div class="row mb-2">
            <div class="col">
              <CInputGroup class="mb-3">
                <CInputGroupText as="label" for="LineSelect"
                  >Line</CInputGroupText
                >
                <CFormSelect v-model="filter.line_id">
                  <option
                    v-for="(line, index) in getLinesOpts"
                    :key="index"
                    :value="line.id"
                  >
                    {{ line.text }}
                  </option>
                </CFormSelect>
              </CInputGroup>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div
                class="d-flex flex-row justify-content-between align-items-center"
              >
                <template v-if="isMobile">
                  <div v-for="(item, i) in dailyOpts" :key="i" class="flex-col">
                    <button
                      :class="btn btn-sm ${item.is_active ? 'btn-primary' : 'btn-outline-primary'} rounded-circle"
                      type="button"
                      @click="getTodayActivities(i)"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="(item, i) in dailyDesktopOpts"
                    :key="i"
                    class="flex-col"
                  >
                    <button
                      :class="btn btn-sm ${item.is_active ? 'btn-primary' : 'btn-outline-primary'} rounded-circle"
                      type="button"
                      @click="getTodayActivities(i)"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </template>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="card p-3">
                <ul>
                  <li>STW Activities</li>
                </ul>
                <div class="row">
                  <template v-if="dataSTW.length > 0 && !isLoading">
                    <div
                      v-for="item in dataSTW"
                      :key="item.observation_id"
                      class="col-12 col-md-4 col-lg-4 mt-1"
                    >
                      <div
                        class="card p-2 py-4"
                        style="border-left: 5px solid cyan; min-height: 100px"
                      >
                        <div
                          class="d-flex flex-row justify-content-between align-items-center"
                        >
                          <div class="d-flex flex-column">
                            Line: {{ item.line_snm }} | Pos: {{ item.pos_nm }} |
                            Member: {{ item.member_nm }} | Group:
                            {{ item.group_nm }}
                          </div>
                          <div class="d-flex flex-column">
                            <template v-if="!item.actual_check_dt">
                              <button
                                class="btn btn-sm btn-primary"
                                @click="$router.push(/observation/${item.observation_id})"
                              >
                                Check
                              </button>
                            </template>
                            <template v-else>
                              <button
                                class="btn btn-sm btn-success"
                                @click="$router.push(/observation/${item.observation_id})"
                              >
                                Details
                              </button>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="isLoading">
                    <div class="col-12 col-md-4 col-lg-4">
                      <CSpinner
                        component="span"
                        size="sm"
                        variant="grow"
                        aria-hidden="true"
                      />
                      Loading...
                    </div>
                  </template>
                  <template v-else>
                    <NoDataContent />
                  </template>
                </div>
              </div>
            </div>
            <div class="card-body p-0 mt-3">
              <div class="card p-3">
                <ul>
                  <li>4S Activities</li>
                </ul>
                <div class="row">
                  <template v-if="data4S.length > 0 && !isLoading">
                    <div
                      v-for="item in data4S"
                      :key="item.observation_id"
                      class="col-12 col-md-4 col-lg-4"
                    >
                      <div class="card p-2" style="border-left: 5px solid cyan">
                        <div
                          class="d-flex flex-row justify-content-between align-items-center"
                        >
                          <div class="d-flex flex-column">
                            Line: {{ item.line_nm }} | Area: {{ item.area_nm }}
                          </div>
                          <div class="d-flex flex-column">
                            <!-- /4s/schedule-check/b7e6f2b1-ab08-4090-a1d6-7294fb79b6bd/63e99f7d-9ebe-411d-a9e2-b8f866382fc9 -->
                            <button
                              class="btn btn-sm btn-primary"
                              @click="$router.push(/4s/schedule-check/${item.main_schedule_id}/${item.sub_schedule_id})"
                            >
                              Check
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="isLoading">
                    <div class="col-12 col-md-4 col-lg-4">
                      <CSpinner
                        component="span"
                        size="sm"
                        variant="grow"
                        aria-hidden="true"
                      />
                      Loading...
                    </div>
                  </template>
                  <template v-else>
                    <NoDataContent />
                  </template>
                </div>
              </div>
            </div>
            <div class="card-body p-0 mt-3">
              <div class="card p-3">
                <ul>
                  <li>OM Activities</li>
                </ul>
                <div class="row">
                  <template v-if="dataOM.length > 0 && !isLoading">
                    <div
                      v-for="item in dataOM"
                      :key="item.observation_id"
                      class="col-12 col-md-4 col-lg-4"
                    >
                      <div class="card p-2" style="border-left: 5px solid cyan">
                        <div
                          class="d-flex flex-row justify-content-between align-items-center"
                        >
                          <div class="d-flex flex-column">
                            Line: {{ item.line_nm }} | M/C:
                            {{ item.machine_nm }} | Itemcheck:
                            {{ item.item_check_nm }}
                          </div>
                          <div class="d-flex flex-column">
                            <button
                              class="btn btn-sm btn-primary"
                              @click="$router.push(/om/schedule-detail/${item.om_main_schedule_id}/${item.om_sub_schedule_id})"
                            >
                              Check
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="isLoading">
                    <div class="col-12 col-md-4 col-lg-4">
                      <CSpinner
                        component="span"
                        size="sm"
                        variant="grow"
                        aria-hidden="true"
                      />
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
import moment from 'moment';
import NoDataContent from '@/components/card/NoDataContent.vue';
import { toast } from 'vue3-toastify';
import ApiService from '@/store/api.service';
import { mapGetters } from 'vuex';
import { GET_LINES } from '@/store/modules/line.module';
import { CInputGroupText } from '@coreui/vue';

export default {
  name: "TpmTodayActivities",
  data() {
    return {
      isLoading: false,
      dailyOpts: [
        {
          label: 'S',
          is_active: false,
          date: null
        },
        {
          label: 'S',
          is_active: false,
          date: null
        },
        {
          label: 'R',
          is_active: false,
          date: null
        },
        {
          label: 'K',
          is_active: false,
          date: null
        },
        {
          label: 'J',
          is_active: false,
          date: null
        },
        {
          label: 'S',
          is_active: false,
          date: null
        },
        {
          label: 'M',
          is_active: false,
          date: null
        }
      ],
      dailyDesktopOpts: [
        {
          label: 'Senin',
          is_active: false,
          date: null
        },
        {
          label: 'Selasa',
          is_active: false,
          date: null
        },
        {
          label: 'Rabu',
          is_active: false,
          date: null
        },
        {
          label: 'Kamis',
          is_active: false,
          date: null
        },
        {
          label: 'Jumat',
          is_active: false,
          date: null
        },
        {
          label: 'Sabtu',
          is_active: false,
          date: null
        },
        {
          label: 'Minggu',
          is_active: false,
          date: null
        }
      ],
      containerDateOfThisWeek: [],
      windowWidth: window.innerWidth,
      filter: {
        line_id: localStorage.getItem('line_id') ?? -1,
        date: null
      },
      isMobile: false,
      dataSTW: [],
      data4S: [],
      dataOM: []
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts']),
  },
  watch: {
    windowWidth() {
      console.log(this.windowWidth);
      if (this.windowWidth < 500) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    filter: {
      handler() {
        this.getSTWData()
        this.get4SData()
        this.getOMData()
      },
      deep: true
    }
  },
  methods: {
    async ActionGetLines() {
      try {
        await this.$store.dispatch(GET_LINES);
      } catch (error) {
        toast.error(error.response.data.message)
      }
    },
    generateDateOfThisWeek() {
      let thisDay = moment().startOf('week');
      if (moment().isoWeekday() == 7) {
        thisDay = moment().startOf('week').subtract(1, 'weeks');
      }
      let today = moment().format('YYYY-MM-DD');
      for (let i = 0; i < 7; i++) {
        var date = thisDay.add(1, 'days').format('YYYY-MM-DD');
        this.dailyOpts[i].date = date
        this.dailyDesktopOpts[i].date = date
        if (today == date) {
          this.dailyOpts[i].is_active = true
          this.dailyDesktopOpts[i].is_active = true
          this.filter.date = date
        }
      }
    },
    getTodayActivities(idxSelected) {
      const mapDay = this.dailyOpts.map((item, i) => {
        if (idxSelected == i) {
          this.dailyDesktopOpts[i].is_active = true
          item.is_active = true
          this.filter.date = item.date
        } else {
          this.dailyDesktopOpts[i].is_active = false
          item.is_active = false
        }
        return item
      })
      this.dailyOpts = mapDay
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    async getSTWData() {
      try {
        this.isLoading = true
        ApiService.setHeader()
        let { data } = await ApiService.query(/operational/observation/schedule/today, this.filter)

        this.dataSTW = data.data ?? []
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message)
      }
    },
    async get4SData() {
      try {
        this.isLoading = true
        let { data } = await ApiService.query(/operational/4s/sub-schedule/today, this.filter)
        // /operational/4s/sub-schedule/today?date=2024-04-23
        console.log(data);
        this.data4S = data.data ?? []
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message)
      }
    },
    async getOMData() {
      try {
        this.isLoading = true
        let { data } = await ApiService.query(/operational/om/sub-schedule/today, this.filter)
        // /operational/4s/sub-schedule/today?date=2024-04-23
        console.log(data);
        this.dataOM = data.data ?? []
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message)
      }
    }
  },
  async mounted() {
    this.isLoading = true
    this.onResize()
    this.generateDateOfThisWeek()
    await this.ActionGetLines()
    await this.getSTWData()
    await this.get4SData()
    await this.getOMData()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
  components: {
    NoDataContent
  }
}
</script>
<style></style>
