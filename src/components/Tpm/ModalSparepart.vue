<template>
  <CModal>
    <CModalHeader>
      <CModalTitle>
        LIST SPAREPART
      </CModalTitle>
    </CModalHeader>
    <CModalBody>

      <table class="table table-bordered table-striped" responsive="md">
        <thead>
          <tr>
            <th class="no text-center">No</th>
            <th class="text-center">Sparepart</th>
            <th class="text-center">Sparepart Number</th>
            <th class="text-center">Stock</th>
            <th class="text-center" colspan="2">Actions</th>
          </tr>
        </thead>
        <tbody v-if="parts">
          <tr v-for="(part, i) in parts" :key="i">
            <td class="text-center">{{ i + 1 }}</td>
            <td class="text-center">{{ part.sparepart_nm }}</td>
            <td class="text-center">{{ part.material_number }}</td>
            <td class="text-center">{{ part.stock }}</td>
            <td class="actions">
              <CButton class="btn btn-sm col" color="warning" @click="" style="max-width: 100px; margin-bottom: 5px;">
                EDIT
              </CButton>
            </td>
            <td class="actions">
              <CButton class="btn btn-sm col" color="danger" @click="" style="max-width: 100px">
                DELETE
              </CButton>
            </td>
          </tr>
        </tbody>
      </table>
    </CModalBody>
  </CModal>
</template>

<script>
import api from "@/apis/CommonAPI";
import { mapGetters } from "vuex";
import { toast } from "vue-sonner";

export default {
  name: "ModalSparepart",
  data() {
    return {
      ledger_id: this.id_ledger
    };
  },
  watch: {
    is_show_sparepart: function () {
      this.is_show = this.is_show_sparepart;
    },

  },
  methods: {
    async getSparepart() {
      try {
        console.log(this.ledger_id);
        let parts = await api.get(`/tpm/spareparts/get-sparepart-detail`, `?ledger_id=${this.ledger_id}`)
        this.parts = parts.data.data
        console.log(this.sparepart);
      } catch (error) {
        console.log(error);
      }
    }
  },

  mounted() {
    this.getSparepart()
  },
  props: {
    id_ledger: Number
  },
};
</script>
