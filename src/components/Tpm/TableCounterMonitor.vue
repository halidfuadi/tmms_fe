<template>
  
</template>

<script>
import api from "@/apis/CommonAPI";



export default {
  name: 'TableCounterMonitor',

  data() {
    return {
      data: [],
      
    }
  },
  

  mounted() {
    
  },

  beforeDestroy() {
    clearTimeout(this.pollingTimeout);
  },

  methods: {
    
    
  }
}

</script>
