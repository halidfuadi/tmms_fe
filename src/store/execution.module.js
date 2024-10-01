import { toast } from "vue-sonner";
import api from "@/apis/CommonAPI";

export default {
  state: {
    execution_submitted: null,
  },
  mutations: {
    setSubmit(state, payload) {
      state.execution_submitted = payload;
    },
  },
  getters: {
    GETTER_EXEC_SUBMITTED: (state) => {
      return state.execution_submitted;
    },
  },
  actions: {
    async ACT_EXECUTION_TPM({ commit }, payload) {
      console.log(payload);
      try {
        let resData = await api.post(`/tpm/execution/add`, payload);
        commit("setSubmit", resData);
        toast.success("Success to execution");
      } catch (error) {
        toast.error("Error to execution");
      }
    },
  },
};
