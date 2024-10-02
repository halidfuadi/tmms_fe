import {toast} from "vue-sonner";
import api from "@/apis/CommonAPI";

export default {
  state: {
    is_submit: null,
    scheduleData: null,
  },
  mutations: {
    setSubmit(state, payload) {
      state.is_submit = payload;
    },
    setSchedule(state, payload) {
      state.scheduleData = payload;
    },
  },
  getters: {
    getSubmitStatus: (state) => {
      return state.is_submit;
    },
    GETTER_SCHEDULE_DATA: (state) => {
      return state.scheduleData;
    },
  },
  actions: {
    async ADD_PIC_SCHEDULE({commit}, payload) {
      try {
        console.log(payload);
        let inserted = await api.post(`/tpm/schedules/add/pic`, payload);
        if (inserted?.status > 200) {
          throw new Error(inserted?.data.message);
        }

        commit("setSubmit", inserted);
        toast.success("Success to add pic");
      } catch (error) {
        throw error;
      }
    },
    async UPDATE_PLAN_DATE({commit}, payload) {
      try {
        console.log(payload);
        const updatePlanDate = {
          schedule_id: payload.schedule_id,
          plan_check_dts: payload.plan_check_dts,
        };
        let inserted = await api.post(
          `/tpm/schedules/edit/plandate`,
          updatePlanDate
        );
        // commit('setSubmit', inserted)
        toast.success("Success to update plan date");
      } catch (error) {
        toast.error("Error to update plan date");
      }
    },
    async ACT_GET_SCHEDULE({commit}, payload) {
      try {
        let filter = Object.keys(payload)
          .map((key) => {
            if (key !== "is_detail") return `${key}=${payload[key]}`;
          })
          .join("&");
        let rawData = await api.get(`/tpm/schedules`, "?" + filter);
        const schedules = rawData.data.data;
        if (Object.keys(payload).indexOf("is_detail") !== -1) {
          const detailSchedule = schedules[payload["is_detail"]][0];
          commit("setSchedule", detailSchedule);
        } else {
          commit("setSchedule", schedules);
        }
      } catch (error) {
        toast.error("Error to get detail schedule");
      }
    },
  },
};
