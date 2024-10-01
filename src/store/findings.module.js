import { toast } from "vue-sonner";
import api from "@/apis/CommonAPI";

export default {
  state: {
    findingsData: [],
    stateSubmission: null,
  },
  mutations: {
    SET_FINDINGS(state, payload) {
      state.findingsData = payload;
    },
    SET_STATE_SUBMISSION(state, payload) {
      state.stateSubmission = payload;
    },
  },
  getters: {
    GETTER_FINDINGS: (state) => {
      return state.findingsData;
    },
    GETTER_STATE_SUBMISSION: (state) => {
      return state.stateSubmission;
    },
  },
  actions: {
    async ACT_GET_FINDINGS({ commit }, filter) {
      try {
        const findings = await api.get(`/tpm/findings`, "?" + filter);
        commit("SET_FINDINGS", findings.data.data);
        toast.success("Success to add pic");
      } catch (error) {
        toast.error("Error to add pic");
      }
    },
    async ACT_EDIT_FINDINGS({ commit }, data) {
      try {
        const finding_id = data.finding_id;
        delete data.finding_id;
        const finding = await api.put(`/tpm/findings`, finding_id, data);
        commit("SET_STATE_SUBMISSION", finding);
      } catch (error) {
        toast.error("Error to add findings");
      }
    },
  },
};
