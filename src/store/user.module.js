import { toast } from "vue-sonner";
import api from "@/apis/CommonAPI";

export default {
  state: {
    users: null,
  },
  mutations: {
    MUTATE_USER(state, payload) {
      state.users = payload;
    },
  },
  getters: {
    GETTER_USERS: (state) => {
      return state.users;
    },
  },
  actions: {
    async ACT_GET_USERS({ commit }, payload = null) {
      try {
        let { data } = await api.get(`/tpm/users/search`, "?");
        commit("MUTATE_USER", data.data);
      } catch (error) {
        toast.error("Error to get users");
      }
    },
  },
};
