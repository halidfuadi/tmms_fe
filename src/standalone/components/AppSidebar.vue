<template>
  <CSidebar position="fixed" :unfoldable="sidebarUnfoldable" :visible="sidebarVisible" @visible-change="(event) =>
    $store.commit({
      type: 'updateSidebarVisible',
      value: event,
    })
    ">
    <CSidebarBrand>
      <img src="../assets/brand/Toyota_logo.png" class="img-fluid sidebar-brand-full" width="200" height="200" />
      <img src="../assets/brand/Toyota_logo.png" class="sidebar-brand-narrow" width="36" height="10" />
    </CSidebarBrand>
    <AppSidebarNav v-bind:nav="nav" />
    <CSidebarToggler id="SidebarToggler" class="d-none d-lg-flex" @click="$store.commit('toggleUnfoldable')" />
  </CSidebar>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { AppSidebarNav } from './AppSidebarNav'
import { logoNegative } from '@/standalone/assets/brand/logo-negative'
import { sygnet } from '@/standalone/assets/brand/sygnet'
import utils from '@/utils/CommonUtils'
import api from '@/apis/CommonAPI'
import navtemplate from '@/_nav.js'

var strAuthorizedNav = ''
var appAuthorized = {}
const generateNav = async (newAuthorizedData, isChild) => {
  strAuthorizedNav += '['
  let newAuthorizedDataLength = newAuthorizedData.length
  for (var i = 0; i < newAuthorizedDataLength; i++) {
    let currentNewAuthorizedData = newAuthorizedData[i]
    if (
      currentNewAuthorizedData.children &&
      currentNewAuthorizedData.children.length > 0
    ) {
      strAuthorizedNav += '{'
      strAuthorizedNav += ' "component": "CNavGroup",'
      strAuthorizedNav +=
        ' "name": "' +
        (isChild ? '' : '') +
        currentNewAuthorizedData.displayText +
        '",'
      strAuthorizedNav += ' "to": "' + currentNewAuthorizedData.path + '",'
      strAuthorizedNav += ' "icon": "' + currentNewAuthorizedData.icon + '",'
      strAuthorizedNav +=
        ' "parentId": "' + currentNewAuthorizedData.parentId + '",'
      strAuthorizedNav += ' "items": '
      generateNav(currentNewAuthorizedData.children, true)
      strAuthorizedNav += '},'
    } else {
      strAuthorizedNav += '{'
      strAuthorizedNav += ' "component": "CNavItem",'
      strAuthorizedNav +=
        ' "name": "' +
        (isChild ? '' : '') +
        currentNewAuthorizedData.displayText +
        '",'
      strAuthorizedNav += ' "to": "' + currentNewAuthorizedData.path + '",'
      strAuthorizedNav += ' "icon": "' + currentNewAuthorizedData.icon + '",'
      strAuthorizedNav +=
        ' "parentId": "' + currentNewAuthorizedData.parentId + '",'
      strAuthorizedNav +=
        ' "applicationId": "' + currentNewAuthorizedData.applicationId + '",'
      strAuthorizedNav +=
        ' "linkProps": { "queryParams": { "applicationId": "' +
        currentNewAuthorizedData.applicationId +
        '", "functionId": "' +
        currentNewAuthorizedData.functionId +
        '" } }'
      strAuthorizedNav += '},'
    }
  }
  strAuthorizedNav += ']'
}

export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  data() {
    return {
      nav: [
        {
          component: 'CNavItem',
          to: '/tpm/dashboard',
          name: 'TPM Dashboard',
          icon: 'cilHome',
          parentId: 'ROOT',
        },
        {
          component: 'CNavItem',
          to: '/tpm/monitoring',
          name: 'TPM Schedule Monitoring',
          icon: 'cilSpreadsheet',
          parentId: 'ROOT',
        },
        {
          component: 'CNavItem',
          to: '/tpm/monitoring-counter',
          name: 'TPM Counter Monitoring',
          icon: 'cilScreenDesktop',
          parentId: 'ROOT',
        },
        {
          component: 'CNavItem',
          to: '/tpm/monitoring-trend',
          name: 'TPM Trend Monitoring',
          icon: 'cilBarChart',
          parentId: 'ROOT',
        },
        {
          component: 'CNavItem',
          to: '/tpm/today-activities',
          name: 'Today Activities',
          icon: 'cilBraille',
          parentId: 'ROOT',
        },
        {
          component: 'CNavItem',
          to: '/tpm/findings',
          name: 'TPM Findings',
          icon: 'cilBellExclamation',
          parentId: 'ROOT',
        },
        {
          component: 'CNavItem',
          to: '/tpm/history',
          name: 'TPM History',
          icon: 'cilHistory',
          parentId: 'ROOT',
        },
        {
          component: 'CNavItem',
          name: 'Master',
          icon: 'cilNotes',
          parentId: 'MST',
          items: [
            {
              component: 'CNavItem',
              to: '/tpm/ledger',
              name: 'TPM Ledger',
              icon: 'cilTask',
              parentId: 'MST',
            },
            /*{
              component: 'CNavItem',
              to: '/tpm/ledgerNew',
              name: 'TPM Ledger New',
              icon: 'cilTask',
              parentId: 'ROOT',
            },*/
            {
              component: 'CNavItem',
              to: '/tpm/sparepart',
              name: 'TPM Sparepart',
              icon: 'cilFactory',
              parentId: 'ROOT',
            },
          ],
        }
      ],
    }
  },
  setup() {
    const store = useStore()
    return {
      logoNegative,
      sygnet,
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
    }
  },
  // async created() {
  //   let authorizedView = await api.scQueryApi('/api/common/menu-authorized', 'POST', '');
  //   strAuthorizedNav = '';
  //   if (authorizedView.data) {
  //     await generateNav(authorizedView.data.children)
  //     let jsonAuthorizedNavJSON = JSON.parse('{"value": ' + strAuthorizedNav.replaceAll('},]', '}]') + '}');

  //     //this.nav = this.nav.concat(jsonAuthorizedNavJSON.value);
  //     // this.nav=navtemplate;
  //   }
  //   setInterval(async () => {
  //     let authorizedView = await api.scQueryApi('/api/common/user-info', 'POST', '');
  //   }, 60 * 1000);

  //   //this.$router.push('/dc/dashboard');
  // }
}
</script>
