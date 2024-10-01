console.log('router/index.js')
import { createRouter, createWebHashHistory, Route } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'
/*define const other in here*/

console.log(process.env.VUE_APP_STANDALONE_SINGLE_SPA)
const routes = [{
        path: '/',
        name: 'Home',
        component: process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true' ? DefaultLayoutStandAlone : DefaultLayout,
        redirect: (process.env.VUE_APP_STANDALONE_SINGLE_SPA !== 'true' && (!localStorage.id_token || localStorage.id_token == '')) ?
            () => {
                window.location.href = process.env.dc + '/#/sc/login'
                    // return '/redirectingToLogin' // not important since redirecting
            } : '/app/dashboard',
        children: [{
                path: '/app/dashboard',
                name: 'Dashboard',
                component: () =>
                    import ('@/views/Dashboard.vue'),
            },
            {
                path: '/tpm/master/plant',
                name: 'TpmMasterPlant',
                component: () =>
                    import ('@/views/tpm/TpmMasterPlant.vue'),
            },
            {
                path: '/tpm/monitoring',
                name: 'TpmMonitoring',
                component: () =>
                    import ('@/views/tpm/TpmMonitoring.vue'),
            },
            {
              path: '/tpm/monitoring-counter',
              name: 'TpmCounterMonitoring',
              component: () =>
                  import ('@/views/tpm/TpmCounterMonitoring.vue'),
            },
            {
              path: '/tpm/monitoring-counter/:id',
              name: 'TpmExecutionCounter',
              component: () =>
                  import ('@/views/tpm/TpmExecutionCounter.vue'),
            },
            {
                path: '/tpm/monitoring/:id',
                name: 'TpmExecution',
                component: () =>
                    import ('@/views/tpm/TpmExecution.vue'),
            },
            {
                path: '/tpm/findings',
                name: 'TpmFindings',
                component: () =>
                    import ('@/views/tpm/TpmFindings.vue'),
            },
            {
                path: '/tpm/history',
                name: 'TpmHistory',
                component: () =>
                    import ('@/views/tpm/TpmHistory.vue'),
            },
            {
                path: '/tpm/ledger',
                name: 'TpmLedger',
                component: () =>
                    import ('@/views/tpm/TpmLedger.vue')
            },
            {
              path: '/tpm/ledgerNew',
              name: 'TpmLedgerNew',
              component: () =>
                  import ('@/views/tpm/TpmLedgerNew.vue')
          },
            {
                path: '/tpm/today-activities',
                name: 'TodayActivities',
                component: () =>
                    import ('@/views/tpm/TpmTodayActivites.vue')
            },
            {
                path: '/tpm/dashboard',
                name: 'TPMDashboard',
                component: () =>
                    import ('@/views/tpm/TpmDashboard.vue')
            },
            {
                path: '/tpm/sparepart',
                name: 'TpmSparepart',
                component: () =>
                    import ('@/views/tpm/TpmSparepart.vue'),
            },
            {
              path: '/tpm/monitoring-trend',
              name: 'TpmTrendMonitoring',
              component: () =>
                  import ('@/views/tpm/TpmMonitoringTrend.vue'),
          },

            /*define other in here*/
        ],
    },
    {
        path: '/404',
        name: 'Page404',
        component: () =>
            import ('@/views/pages/Page404'),
    },
    {
        path: '/500',
        name: 'Page500',
        component: () =>
            import ('@/views/pages/Page500'),
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    },
})

export default router
