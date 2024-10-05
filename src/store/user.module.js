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
    GETTER_USERS_SEARCH_SELECT: (state) => {
      if(!state.users){
        return [];
      }

      return state.users.map((e) => ({
        user_id: e.user_id,
        user_nm: e.user_nm,
        noreg: e.noreg,
      }));
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
