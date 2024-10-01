<template>
  <CToaster placement="top-end" visible>
    <CToast v-for="(toast, index) in toasters">
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">{{ toast.title }}</span>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>
        {{ toast.content }}
      </CToastBody>
    </CToast>
  </CToaster>
</template>
<script>
export default {
  data() {
    return {
      toasters: [],
    }
  },
  watch: {
    toasts: {
      handler(newVal) {
        console.log(newVal)
        this.toasters = newVal
      },
      deep: true,
    },
  },
  props: {
    toasts: Array,
  },
}
</script>
