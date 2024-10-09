<template>
  <CModal
    :visible="visible"
    :fullscreen="isAddMultiple"
    backdrop="static"
    size="xl"
    @close="close()"
  >
    <CModalHeader closeButton
      ><h5 class="fw-bold">{{ title }}</h5></CModalHeader
    >
    <CModalBody :class="{'p-5': isAddMultiple}">
      <Toaster position="top-center" closeButton />
      <div class="mb-3">
        <CRow class="mb-2">
          <CCol lg="6" class="mb-2">
            <CFormInput
              v-if="lineName"
              label="Line"
              :value="lineName"
              disabled
            />
            <treeselect
              v-else
              v-model="form.line_id"
              :options="lineOptions"
              placeholder="Select Line"
            />
          </CCol>
          <CCol lg="6" class="mb-2">
            <CFormInput
              v-if="machineName"
              label="Machine"
              :value="machineName"
              disabled
            />
            <treeselect
              v-else
              v-model="form.machine_id"
              :options="machineOptions"
              placeholder="Select Machine"
            />
          </CCol>
          <CCol lg="12" class="mb-2">
            <CFormInput
              v-if="item"
              label="Item Check Name"
              v-model="form.itemcheck_nm"
              :disabled="item != null"
            />
            <div v-else>
              <label class="form-label">Item Check Name</label>
              <autocomplete
                :search="autoCompleteItemCheck"
                placeholder="Item Check Name"
                aria-label="Item Check Name"
                :debounce-time="300"
                :get-result-value="setSelectedItemCheck"
                @submit="handleSelectedItemCheck"
              >
                <template
                  #default="{
                    rootProps,
                    inputProps,
                    inputListeners,
                    resultListProps,
                    resultListListeners,
                    results,
                    resultProps,
                  }"
                >
                  <div v-bind="rootProps">
                    <input
                      v-bind="inputProps"
                      v-on="inputListeners"
                      @focus="handleFocusAutoCompleteItemCheck"
                      @blur="handleBlurAutoCompleteItemCheck"
                    />
                    <ul
                      v-if="noResultItemCheck"
                      class="autocomplete-result-list"
                      style="
                        position: absolute;
                        z-index: 1;
                        width: 100%;
                        top: 100%;
                      "
                    >
                      <li class="autocomplete-result">No results found</li>
                    </ul>
                    <table
                      class="table table-bordered table-hover"
                      v-bind="resultListProps"
                      v-on="resultListListeners"
                    >
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Used Machine</th>
                          <th>Method</th>
                          <th>Counter</th>
                          <th>Cycle Value</th>
                          <th>Cycle Period</th>
                          <th>Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, i) in results"
                          :key="i"
                          v-bind="resultProps[i]"
                        >
                          <td>{{ item.itemcheck_nm }}</td>
                          <td>{{ item.machine_nm }}</td>
                          <td>{{ item.method_check }}</td>
                          <td>{{ item.is_counter ? "Ya" : "Tidak" }}</td>
                          <td>{{ item.val_periodic }}</td>
                          <td>
                            {{
                              item.period_id == 0
                                ? "Day"
                                : item.period_id == 1
                                ? "Month"
                                : "Year"
                            }}
                          </td>
                          <td>{{ item.lifespan_counter }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      v-if="rootProps['data-loading']"
                      class="d-flex align-items-center justify-content-center my-2"
                    >
                      <CSpinner
                        component="span"
                        size="sm"
                        variant="grow"
                        aria-hidden="true"
                      />
                      Loading...
                    </div>
                  </div>
                </template>
              </autocomplete>
            </div>
          </CCol>
          <CCol class="mb-2">
            <CFormInput
              label="Item Check Location"
              v-model="form.itemcheck_loc"
              class="mb-2"
            />
            <CFormInput
              label="Method"
              v-model="form.method_check"
              class="mb-2"
            />
            <div class="mb-2">
              <label class="form-label">Incharge</label>
              <select class="form-select" v-model="form.incharge_id">
                <option value="" selected disabled>Select Incharge</option>
                <option
                  v-for="(incharge, i) in inchargeOptions"
                  :key="i"
                  :value="incharge.value"
                >
                  {{ incharge.label }}
                </option>
              </select>
            </div>
            <CFormInput
              label="Standard"
              v-model="form.standard_measurement"
              class="mb-2"
            />
            <CRow>
              <CCol>
                <CFormInput label="Man Power" v-model="form.mp" class="mb-2" />
              </CCol>
              <CCol>
                <CFormInput
                  label="Duration"
                  v-model="form.duration"
                  class="mb-2"
                />
              </CCol>
            </CRow>
            <div class="mb-3">
              <CFormLabel for="exampleFormControlTextarea1">Reason</CFormLabel>
              <CFormTextarea rows="3" v-model="form.reasons"></CFormTextarea>
            </div>
          </CCol>
          <CCol lg="6">
            <CCard class="mb-3 mt-2">
              <CCardBody>
                <CFormSelect
                  label="Counter"
                  class="mb-2"
                  @change="onChangeCounter($event)"
                  v-model="form.is_counter"
                >
                  <option value="true">Ya</option>
                  <option value="false" selected>Tidak</option>
                </CFormSelect>
                <CFormInput
                  v-if="isCounter"
                  label="Periods"
                  v-model="form.lifespan_counter"
                  class="mb-2"
                />
                <CRow v-if="!isCounter">
                  <CCol lg="12"> Cycle</CCol>
                  <CCol lg="5">
                    <CFormInput
                      type="number"
                      v-model="form.val_periodic"
                      label="Value"
                      class="mb-2"
                    />
                  </CCol>
                  <CCol lg="7" class="mb-2">
                    <CFormSelect label="Period" v-model="form.period_id">
                      <option value="0">DAY</option>
                      <option value="1">MONTH</option>
                      <option value="2">YEAR</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <div class="mb-3">
              <CFormLabel for="exampleFormControlTextarea1">Details</CFormLabel>
              <CFormTextarea
                id="exampleFormControlTextarea1"
                rows="3"
                v-model="form.details"
              ></CFormTextarea>
            </div>
            <CRow>
              <CCol>
                <CFormInput label="Lower Limit" v-model="form.lower_limit" />
              </CCol>
              <CCol>
                <CFormInput label="Upper Limit" v-model="form.upper_limit" />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        <template v-if="isSubmitLoading">
          <div class="d-flex justify-content-center align-items-center">
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
          <CRow>
            <CCol v-if="showSparepart">
              <CButton
                class="btn btn-sm col text-white"
                color="info"
                @click.prevent="isVisibleSparepart = !isVisibleSparepart"
              >
                Sparepart List
              </CButton>
            </CCol>
            <CCol v-else></CCol>
            <CCol class="d-flex gap-2 justify-content-end" style="flex: 0">
              <CButton
                class="btn btn-sm col text-white"
                color="warning"
                @click="submit()"
              >
                {{ actionTitle }}
              </CButton>
              <CButton
                v-if="item"
                class="btn btn-sm col text-white"
                color="danger"
                @click="applyDelete()"
              >
                Delete
              </CButton>
              <CButton
                class="btn btn-sm col text-white"
                color="danger"
                @click="close()"
              >
                Close
              </CButton>
            </CCol>
          </CRow>
        </template>
        <CollapseSparepartList
          :is_execute="false"
          :visibleSparepart="isVisibleSparepart"
          :ledger_itemcheck_id="item?.ledger_itemcheck_id"
        />
      </div>
      <template v-if="isAddMultiple">
        <TableItemCheckModifiable :items="addedItems" :has-action="true">
          <template #action="{ item, index }">
            <div class="d-flex align-items-center h-100">
              <CButton
                class="btn btn-sm col text-white"
                color="warning"
                @click="deleteAddedItemCheckMultiple(item, index)"
              >
                Hapus
              </CButton>
            </div>
          </template>
        </TableItemCheckModifiable>
      </template>
    </CModalBody>
    <CFooter
      v-if="isAddMultiple"
      class="justify-content-center align-items-center"
    >
      <div style="flex-shrink: 0">
        <CButton
          class="btn btn-sm col text-white"
          color="warning"
          @click="saveItemCheckMultiple()"
          style="width: 10rem"
        >
          Save
        </CButton>
      </div>
    </CFooter>
  </CModal>
</template>
<script>
import CollapseSparepartList from "@/components/Tpm/CollapseSparepartList.vue";
import api from "@/apis/CommonAPI";
import { toast, Toaster } from "vue-sonner";
import Treeselect from "@zanmato/vue3-treeselect";
import "@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css";
import TableItemCheckModifiable from "@/components/Tpm/TableItemCheckModifiable.vue";

const defaultForm = {
  itemcheck_id: null,
  ledger_itemcheck_id: null,
  itemcheck_nm: null,
  itemcheck_loc: null,
  method_check: null,
  incharge_id: "",
  standard_measurement: null,
  mp: null,
  duration: null,
  lifespan_counter: null,
  val_periodic: null,
  period_id: null,
  details: null,
  lower_limit: null,
  upper_limit: null,
  is_counter: false,
  reasons: null,
};

export default {
  name: "ModalItemCheckDetail",
  props: {
    visible: [Boolean, String],
    item: Object,
    lineId: String,
    ledgerId: String,
    lineName: String,
    machineName: String,
    showSparepart: {
      type: Boolean,
      default: true,
    },
    isAddMultiple: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TableItemCheckModifiable,
    CollapseSparepartList,
    Treeselect,
    Toaster,
  },
  data() {
    return {
      isVisibleSparepart: false,
      form: defaultForm,
      isSubmitLoading: false,
      inchargeOptions: [],
      itemCheckOptions: [],
      lineOptions: [],
      machineOptions: [],
      isFocusedItemCheck: false,
      isLoadingItemCheck: false,
      isCounter: false,
      addedItems: [],
    };
  },
  mounted() {
    this.getIncharge();
    this.getItemCheckOptions();
    this.getLine();
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue) {
        this.form = {
          ...this.item,
        };
      } else {
        this.form = {
          ...defaultForm,
        };
      }

      this.isCounter = this.form.is_counter;

      if (this.isAddMultiple) {
        this.addedItems = [];
      }
    },
    form: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue.line_id) {
          this.getMachines();
        }
      },
    },
  },
  computed: {
    title() {
      return this.item ? "Item Check Detail" : "Add Item Check";
    },
    actionTitle() {
      return this.item ? "Update" : "Add";
    },
    noResultItemCheck() {
      return this.form.itemcheck_nm && this.itemCheckOptions.length === 0;
    },
  },
  methods: {
    async getIncharge() {
      try {
        let incharge = await api.post(`/tpm/filter/incharge`);
        let mapincharges = await incharge.data.data.map((item) => {
          return {
            value: item.incharge_id,
            label: item.incharge_nm,
          };
        });

        this.inchargeOptions = mapincharges;

        this.form = {
          ...this.form,
          incharge_id: this.item
            ? this.item.incharge_id
            : mapincharges[0].value,
        };
      } catch (error) {
        console.log(error);
      }
    },
    async getItemCheckOptions(searchName = "") {
      try {
        let { data: response } = await api.get(
          `/tpm/itemchecks`,
          `?${
            searchName ? `itemcheck_nm=${searchName}` : "1=1"
          }&limit=20&page=1`
        );
        this.itemCheckOptions = response.data;
        /* this.itemCheckOptions = response.data.map((item) => {
           return {
             id: item.machine_id,
             label: item.machine_nm,
           };
         });*/
      } catch (e) {
        console.log(e);
      } finally {
        if (!this.itemCheckOptions) {
          this.itemCheckOptions = [];
        }
      }
    },
    async getLine() {
      try {
        const { data: response } = await api.post(`/tpm/lines/search`);
        if (response.data) {
          this.lineOptions = response.data.map((e) => ({
            id: e.uuid,
            label: e.line_nm,
          }));

          if (this.form.line_id) {
            this.form = {
              ...this.form,
              line_id: this.lineOptions.find((e) => e.id === this.form.line_id),
            };

            this.getMachines();
          }
        } else {
          this.lineOptions = [];
        }
      } catch (e) {
        console.log("getLine()", e);
      }
    },
    async getMachines() {
      try {
        const { data: response } = await api.post(`/tpm/machines/search`, {
          line_id: this.form.line_id,
        });

        if (response.data) {
          this.machineOptions = response.data.map((e) => ({
            id: e.uuid,
            label: e.machine_nm,
          }));
        } else {
          this.machineOptions = null;
        }
      } catch (e) {
        console.log("getMachines()", e);
      }
    },
    async submit() {
      let mappedForm = {
        ...this.form,
      };

      if (
        !mappedForm.itemcheck_nm ||
        !mappedForm.method_check ||
        !mappedForm.incharge_id ||
        !mappedForm.standard_measurement ||
        !mappedForm.mp ||
        !mappedForm.duration
      ) {
        toast.warning("Item check detail field harus di isi", {
          description: "Lengkapi dan silahkan coba lagi",
        });
        return;
      }

      if (!mappedForm.reasons) {
        toast.warning("Reason harus diisi", {
          description: "Lengkapi dan silahkan coba lagi",
        });
        return;
      }

      if (mappedForm.no) {
        delete mappedForm.no;
      }

      if (this.isAddMultiple) {
        this.addedItems = [
          ...this.addedItems,
          {
            ...mappedForm,
          },
        ];
        return;
      }

      try {
        this.isSubmitLoading = true;

        let result = await api.post(
          this.item
            ? `/tpm/itemchecks/editItemCheck`
            : `/tpm/itemchecks/addItemCheck`,
          mappedForm
        );
        if (result.status === 200) {
          toast.success("Data berhasil di simpan", {
            description: "Item check sedang dalam proses approval",
          });
          this.close(true);
        } else {
          toast.error("Terjadi kesalahan saat menyimpan data", {
            description: result.data.message?.message ?? result.data.message,
          });
        }
      } catch (e) {
        toast.error("Terjadi kesalahan saat menyimpan data", {
          description: "Silahkan coba lagi",
        });
      } finally {
        this.isSubmitLoading = false;
      }
    },
    applyDelete() {},
    onChangeCounter(event) {
      this.isCounter =
        event.target.value === "true" || event.target.value === true;
    },
    async autoCompleteItemCheck(input) {
      console.log("request");
      await this.getItemCheckOptions(input);
      console.log("done");
      const items = [...this.itemCheckOptions];

      return this.itemCheckOptions.filter((item) => {
        return item.itemcheck_nm.toLowerCase().includes(input.toLowerCase());
      });

      /*return new Promise(async (resolve) => {
        if (input.length < 1) {
          return [];
        }

        const items = [...this.itemCheckOptions];
        resolve(items.filter((item) => {
          return item.itemcheck_nm.toLowerCase().includes(input.toLowerCase());
        }));
      });*/
    },
    handleFocusAutoCompleteItemCheck() {
      this.isFocusedItemCheck = true;
    },
    handleBlurAutoCompleteItemCheck() {
      this.isFocusedItemCheck = false;
    },
    handleSelectedItemCheck(item) {
      this.form = {
        ...item,
        incharge_id: this.form.incharge_id,
        is_counter: item.is_counter ? "true" : "false",
        ledger_id: this.ledgerId ? this.ledgerId : null,
        line_id: this.form.line_id ? this.form.line_id.id : null,
      };

      this.isCounter = item.is_counter;
    },
    setSelectedItemCheck(item) {
      return item.itemcheck_nm;
    },
    validatedAddedItemCheckMultiple() {
      if (
        !this.form.line_id
        || !this.form.machine_id
      ) {
        toast.warning("Line dan machine harus diisi");
        return;
      }

    },
    saveItemCheckMultiple() {},
    deleteAddedItemCheckMultiple(item, index) {
      this.addedItems = [...this.addedItems.filter((_, i) => i !== index)];
    },
    close(reload = false) {
      this.$emit("on-close", reload);
    },
  },
};
</script>

<style></style>
