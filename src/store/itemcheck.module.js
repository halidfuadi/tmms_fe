import { toast } from "vue-sonner";
import api from "@/apis/CommonAPI";
import { Toast } from "@coreui/coreui";

export default {
  state: {
    itemcheckData: [],
  },
  mutations: {
    setItemcheck(state, payload) {
      state.itemcheckData = payload;
    },
  },
  getters: {
    GETTER_ITEMCHECK: (state) => {
      return state.itemcheckData;
    },
  },
  actions: {
    async ACT_ITEMCHECKS({ commit }, filter = "") {
      try {
        const itemchecks = await api.get("/tpm/itemchecks", filter);
        commit("setItemcheck", itemchecks.data.data);
      } catch (error) {
        toast.error("Error to execution");
      }
    },

    async ACT_NEW_ITEMCHECK({ commit }, payload) {
      console.log(payload);
      try {
        let resData = await api.post(`/tpm/itemchecks/addItemCheck`, payload);
        commit("setItemcheck", resData);
      } catch (error) {
        toast.error("Error to add itemcheck");
      }
    },

    async ACT_EDIT_ITEMCHECK({ commit }, payload) {
      try {
        console.log(payload);
        let editData = await api.post(`/tpm/itemchecks/editItemCheck`, payload);
        commit("setItemcheck", editData);
      } catch (error) {
        toast.error("Error to edit itemcheck");
      }
    },

    async ACT_APPROVE_UPDATED_ITEMCHECK({ commit }, payload) {
      try {
        console.log(payload);
        let approvedData = await api.post(
          `/tpm/itemchecks/approvedUpdated`,
          payload
        );
        commit("setItemcheck", approvedData);
        toast.success("Success to approve item");
      } catch (error) {
        console.log(error);
        toast.error("Error to approve item");
      }
    },

    async ACT_APPROVE_ITEMCHECK({ commit }, payload) {
      try {
        console.log(payload);
        let approvedData = await api.post(
          `/tpm/itemchecks/approvedNew`,
          payload
        );
        commit("setItemcheck", approvedData);
        toast.success("Success to approve new item");
      } catch (error) {
        console.log(error);
        toast.error("Error to approve new item");
      }
    },

    async ACT_DELETE_ITEMCHECK({ commit }, payload) {
      try {
        console.log(payload);
        let deleteData = await api.post(
          `/tpm/itemchecks/deleteItemcheck`,
          payload
        );
        commit("setItemcheck", deleteData);
        toast.success("Success to delete item");
      } catch (error) {
        console.log(error);
        toast.error("Error to delete item");
      }
    },
  },
};
