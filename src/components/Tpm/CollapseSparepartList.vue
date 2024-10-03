<template>
  <CCollapse :visible="visibleSparepart" class="overflow-auto">
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
          <td class="text-center">Rp.{{ (item.price)?.toLocaleString('de-DE') }},00</td>
          <td class="text-center">
            <CButton v-if="!is_execute" color="info" size="sm" @click="handlePickRemove(item)">REMOVE</CButton>
            <CFormCheck v-if="is_execute"/>
          </td>
        </tr>

        <tr>
          <td class="text-end" colspan="4">Total Price</td>
          <td class="text-center">Rp.{{ (this.totalPrice)?.toLocaleString('de-DE') }},00</td>
          <td class="text-center"></td>
        </tr>

        <!-- Button to add new spare parts -->
        <tr>
          <td class="text-center" colspan="6">
            <CButton v-if="!visibleAdd" color="info" size="sm" style="min-width: 30%;" @click.prevent="visibleAdd = !visibleAdd">+</CButton>
            <CButton v-if="visibleAdd" class="mx-2" color="success" size="sm" style="min-width: 15%;" @click="uploadNewSparepart()">SAVE</CButton>
            <CButton v-if="visibleAdd" color="warning" size="sm" style="min-width: 15%;" @click.prevent="visibleAdd = !visibleAdd">CANCEL</CButton>
          </td>
        </tr>

        <!-- Search bar for spare parts -->
        <tr v-if="visibleAdd">
          <td class="text-center" colspan="6">
            <CFormInput v-model="searchBar" placeholder="Search Part Number / Part Name" />
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
            <CButton color="info" size="sm" @click="handlePickChange(item)">ADD</CButton>
          </td>
        </tr>
      </tbody>
    </table>
  </CCollapse>
</template>

<script>
import api from '@/apis/CommonAPI';
import _ from 'lodash'; // Import lodash for debouncing
import { toast } from 'vue-sonner';

export default {
  name: 'CollapseSparepartList',

  data() {
    return {
      items: [],
      visibleAdd: false,
      itemSparepart: [], // Search results for spare parts
      searchBar: '',     // Search input
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
  },

  methods: {
    async getItems(item) {
      this.items = [];
      try {
        let response
        console.log(item);

        if(!/^\d+$/.test(item)){
          response = await api.get('/tpm/spareparts/get-sparepart-itemcheck', `?uuid=${item}`);
        }else{
          response = await api.get('/tpm/spareparts/get-sparepart-itemcheck', `?ledger_itemcheck_id=${item}`);
        }
        this.items = response.data.data;
        console.log(this.items);

        let totalPrice = 0;
        this.items.forEach(obj => {
          obj.is_new= false;
          this.totalPrice = this.totalPrice + (obj.price * obj.quantity);
        });
      } catch (error) {
        console.error('Error fetching spare part data:', error);
      }
    },

    async searchSparepart() {
      try {
        if (this.searchBar.trim() === '') {
          this.itemSparepart = []; // Clear results if search is empty
          return;
        }
        let response = await api.get('/tpm/spareparts/get-sparepart', `?query=${this.searchBar}`);
        this.itemSparepart = response.data.data;
        this.itemSparepart.forEach(obj => { obj.is_picked = false; });
      } catch (error) {
        console.error('Error fetching spare part data:', error);
      }
    },

    handlePickChange(item) {
      item.is_new = true
      this.items.push(item)
    },

    handlePickRemove(item) {

      this.removeItem.push(item)
    },

    uploadNewSparepart() {
      this.visibleAdd = false

      this.items.forEach(obj => {
        if (obj.is_new) {
          obj.ledger_itemcheck_id = this.ledger_itemcheck_id
          this.newItemSparepart.push(obj)
        }
      })

      console.log(this.newItemSparepart);

      let upload = api.post('/tpm/spareparts/add-sparepart-itemcheck', this.newItemSparepart)
      toast.success('Success add spare part itemcheck')

      this.newItemSparepart = []
    },
  },

  watch: {
    visibleSparepart() {
      if (this.visibleSparepart) {
        this.getItems(this.ledger_itemcheck_id);
      } else {
        this.items = [];
        this.totalPrice = 0
      }
    },

    visibleAdd() {
      if (!this.visibleAdd) {
        this.itemSparepart = [];
      }
    },

    searchBar: _.debounce(function() {
      this.searchSparepart();
    }, 800),
  },
};
</script>
