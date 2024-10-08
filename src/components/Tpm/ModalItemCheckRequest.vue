<template>
  <CModal :visible="visible" backdrop="static" size="xl" @close="close()">
    <CModalHeader closeButton><h5 class="fw-bold">Item Check Request</h5></CModalHeader>
    <CModalBody>
      <Toaster position="top-center" closeButton/>
      <NewUpdate ref="NewUpdated" :is-new="isNew"/>
    </CModalBody>
  </CModal>
</template>
<script>
import NewUpdate from "@/components/Tpm/NewUpdate.vue";

export default{
  name: 'ModalItemCheckRequest',
  components: {NewUpdate},
  props: {
    visible: Boolean,
    isNew: Boolean,
  },
  mounted(){
  },
  watch: {
    visible() {
      if (this.visible) {
        /*this.$refs.NewUpdated.getUpdate();
        this.$refs.NewUpdated.getUpdatedItem();*/
      }
    }
  },
  methods: {
    close(reload = false) {
      this.$emit("on-close", reload);
    },
  },
}
</script>
