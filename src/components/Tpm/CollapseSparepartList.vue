<template>
  <CCollapse :visible="visibleSparepart" class="overflow-auto">
    <Toaster position="top-center" closeButton/>
    <table class="table table-bordered table-striped my-3">
      <thead>
      <tr>
        <th class="text-center">Part Number</th>
        <th class="text-center">Part Name</th>
        <th class="text-center">Lead Time</th>
        <th class="text-center">Quantity</th>
        <th class="text-center">Price</th>
        <th class="text-center">Action</th>
      </tr>
      </thead>
      <tbody>
      <!-- Display existing items -->
      <tr v-for="(item, i) in items" :key="i">
        <td class="text-center">{{ item.material_number }}</td>
        <td class="text-center">{{ item.sparepart_nm }}</td>
        <td class="text-center">{{ item.lead_time }} Days</td>
        <td class="text-center">{{ item.quantity }}</td>
        <td class="text-center">
          Rp.{{ item.price?.toLocaleString("de-DE") }},00
        </td>
        <td class="text-center">
          <CButton
            class="text-white"
            v-if="!is_execute"
            color="info"
            size="sm"
            @click="handlePickRemove(item)"
          >REMOVE
          </CButton>
          <CFormCheck v-if="is_execute"/>
        </td>
      </tr>

      <tr>
        <td class="text-end" colspan="4">Total Price</td>
        <td class="text-center">
          Rp.{{ totalPrice?.toLocaleString("de-DE") }},00
        </td>
        <td class="text-center"></td>
      </tr>

      <!-- Button to add new spare parts -->
      <tr>
        <td class="text-center" colspan="6">
          <CButton
            v-if="!visibleAdd"
            color="info text-white"
            size="sm"
            style="min-width: 30%"
            @click.prevent="visibleAdd = !visibleAdd"
          >+
          </CButton>
          <CButton
            v-if="visibleAdd"
            class="mx-2 text-white"
            color="success"
            size="sm"
            style="min-width: 15%"
            @click="uploadNewSparepart()"
          >SAVE
          </CButton>
          <CButton
            v-if="visibleAdd"
            class="text-white"
            color="warning"
            size="sm"
            style="min-width: 15%"
            @click.prevent="visibleAdd = !visibleAdd"
          >CANCEL
          </CButton>
        </td>
      </tr>

      <!-- Search bar for spare parts -->
      <tr v-if="visibleAdd">
        <td class="text-center" colspan="6">
          <CFormInput
            v-model="searchBar"
            placeholder="Search Part Number / Part Name"
          />
        </td>
      </tr>

      <!-- Display search results -->
      <tr v-if="visibleAdd" v-for="(item, i) in itemSparepart" :key="i">
        <td class="text-center">{{ item.material_number }}</td>
        <td class="text-center">{{ item.sparepart_nm }}</td>
        <td class="text-center">{{ item.lead_time }} Days</td>
        <td class="text-center">{{ item.quantity }}</td>
        <td class="text-center">{{ item.price }}</td>
        <td class="text-center">
          <!-- <CFormCheck v-model="item.is_picked" @change="handlePickChange(item)" /> -->
          <CButton
            color="info"
            size="sm"
            @click="handlePickChange(item)"
            class="text-white"
          >ADD
          </CButton>
        </td>
      </tr>
      </tbody>
    </table>
  </CCollapse>
</template>

<script>
import api from "@/apis/CommonAPI";
import _ from "lodash"; // Import lodash for debouncing
import utils from "@/utils/CommonUtils";
import {Toaster} from "vue-sonner";

export default {
  name: "CollapseSparepartList",
  components: {Toaster},
  data() {
    return {
      items: [],
      visibleAdd: false,
      itemSparepart: [], // Search results for spare parts
      searchBar: "", // Search input
      formSparepart: {},
      totalPrice: 0,
      newItemSparepart: [],
      remvoeItem: [],
    };
  },
  props: {
    visibleSparepart: Boolean,
    ledger_itemcheck_id: [String, Number],
    is_execute: Boolean,
    isAddNewRequest: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    async getItems(item, type = 'ledger_itemcheck_id') {
      //let loader = this.$loading.show();
      this.items = [];
      try {
        let response = await api.get(
          "/tpm/ledger-sparepart/get",
          `?${type}=${item}`,
          null,
          false
        );

        this.totalPrice = 0;
        this.items = response.data.data.map((item) => {
          if (!item.quantity) {
            item.quantity = 0;
          }
          if (item.price) {
            item.price = 0;
          }

          return item;
        });

        this.items.forEach((obj) => {
          obj.is_new = false;
          this.totalPrice += (obj.price ? parseInt(obj.price) : 0) * (obj.quantity ? parseInt(obj.quantity) : 0);
        });
      } catch (error) {
        console.error("Error fetching spare part data:", error);
      } finally {
        //loader.hide();
      }
    },
    async searchSparepart() {
      try {
        if (this.searchBar.trim() === "") {
          this.itemSparepart = []; // Clear results if search is empty
          return;
        }
        let response = await api.get(
          "/tpm/spareparts/get-sparepart",
          `?query=${this.searchBar}`
        );
        this.itemSparepart = response.data.data;
        this.itemSparepart.forEach((obj) => {
          obj.is_picked = false;
        });
      } catch (error) {
        console.error("Error fetching spare part data:", error);
      }
    },
    handlePickChange(item) {
      item.is_new = true;
      const cloneItems = [...this.items, item];
      this.items = cloneItems.reduce((acc, current) => {
        const x = acc.find(
          (item) => item.sparepart_id === current.sparepart_id
        );
        if (!x) {
          acc.push(current);
        }

        return acc;
      }, []);
      //this.items.push(item);
    },
    handlePickRemove(item) {
      if (item.is_new) {
        const cloneItems = [...this.items];
        const removedItem = cloneItems.findIndex(
          (e) => e.sparepart_id == item.sparepart_id
        );
        cloneItems.splice(removedItem, 1);
        this.items = [...cloneItems];
      } else {
        this.deleteLedgerSparepart(item.ledger_sparepart_id);
      }
    },
    uploadNewSparepart() {
      this.visibleAdd = false;
      const newItems = [];
      this.items.forEach((obj) => {
        if (obj.is_new) {
          obj.ledger_itemcheck_id = this.ledger_itemcheck_id;
          newItems.push(obj);
        }
      });

      if (this.isAddNewRequest) {
        this.$emit('on-save', newItems);
        return;
      }

      try {
        this.newItemSparepart = newItems;

        const result = api.post(
          "/tpm/ledger-sparepart/create",
          this.newItemSparepart
        );
        if (result.status === 200) {
          utils.showSuccessResponse("Sparepart berhasil di tambahkan");
          this.newItemSparepart = [];
        } else {
          utils.showResponseError(result.response.data.message?.message);
        }
      } catch (e) {
        utils.showResponseError(e);
      }
    },
    async deleteLedgerSparepart(ledgerSparepartId) {
      const loader = this.$loading.show();
      try {
        const result = await api.delete(
          `/tpm/ledger-sparepart`,
          ledgerSparepartId
        );

        if (result.status === 200) {
          utils.showSuccessResponse();
          await this.getItems(this.ledger_itemcheck_id);
        } else {
          utils.showResponseError(
            result.response.data.message?.message ??
            result.response.data.message
          );
        }
      } catch (e) {
        console.error("deleteLedgerSparepart()", e);
        utils.showResponseError();
      } finally {
        loader.hide();
      }
    },
  },

  watch: {
    isAddNewRequest(newVal, _){
      console.log('isAddNewRequest', newVal);
    },
    visibleSparepart() {
      this.items = [];
      this.totalPrice = 0;

      if (this.visibleSparepart) {
        this.getItems(this.ledger_itemcheck_id);
      }
    },
    visibleAdd() {
      if (!this.visibleAdd) {
        this.itemSparepart = [];
      }
    },
    searchBar: _.debounce(function () {
      this.searchSparepart();
    }, 800),
  },
  mounted() {
    this.$nextTick(() => {
      console.log("call onmounted");
      this.getItems(this.ledger_itemcheck_id);
    });
  },
};
</script>
