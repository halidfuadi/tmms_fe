import { toast } from 'vue-sonner'
import api from '@/apis/CommonAPI'

export default {
    state: {
        historyData: [],
    },
    mutations: {
        setHistoryData(state, payload) {
            state.historyData = payload
        },
    },
    getters: {
        GETTER_HISTORY_TPM: (state) => {
            return state.historyData
        },
    },
    actions: {
        async ACT_HISTORY_TPM({ commit }, filter = '') {
            try {
                const { data } = await api.get('/tpm/history', filter)
                if (data.data) {
                    commit('setHistoryData', data.data)
                }
            } catch (error) {
                toast.error('Error to get history')
            }
        },
    },
}
