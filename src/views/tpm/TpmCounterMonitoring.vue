<template>
  <ModalExecuteCounter ref="detail" :is_show="isModalVisible" :item="this.selectedItem" @close-modal="closeModal"/>
  <SearchBarCounter />
  <TableCounterMonitor ref="monitor" @show-modal="showModal"/>

</template>

<script>

import api from "@/apis/CommonAPI";
import SearchBarCounter from "@/components/Tpm/SearchBarCounter";
import TableCounterMonitor from "@/components/Tpm/TableCounterMonitor";
import ModalExecuteCounter from "@/components/Tpm/ModalExecuteCounter";

export default {
  name: 'TpmCounterMonitoring',

  data() {
    return {
      isModalVisible: false,
      selectedItem: null,
    }
  },

  components:{
    SearchBarCounter,
    TableCounterMonitor,
    ModalExecuteCounter,
  },

  methods: {
    showModal(item){
      this.isModalVisible = true
      this.selectedItem = item
      this.$refs.detail.getDetails(item.ledger_itemcheck_id)
    },

    closeModal(){
      this.isModalVisible = false
      this.selectedItem = null
      this.$refs.monitor.getCounter()
    }
  },

}
</script>
