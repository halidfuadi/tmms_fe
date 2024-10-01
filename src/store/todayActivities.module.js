import CommonAPI from "../apis/CommonAPI";

export const GET_TODAY_ACTIVITIES = "getTodayActivities";
export const POST_TODAY_ACTIVITIES = "postTodayActivities";
export const PUT_TODAY_ACTIVITIES = "putTodayActivities";
export const DELETE_TODAY_ACTIVITIES = "deleteTodayActivities";

// mutation types
export const SET_TODAY_ACTIVITIES = "setTodayActivities";

const state = {
    todayActivities: []
};

const getters = {
    getTodayActivities(state) {
        return state.todayActivities
    },
};

const actions = {
    [GET_TODAY_ACTIVITIES]({ commit }, query) {
        return new Promise(async(resolve, reject) => {
            await CommonAPI.post('/tpm/schedules/today-activities', query)
                .then((result) => {
                    if (result.data) {
                        commit(SET_TODAY_ACTIVITIES, result.data.data)
                        resolve(result.data.data)
                    }
                    reject('Data tidak ada')
                })
                .catch((err) => {
                    reject(err)
                })

        });
    },
    [POST_TODAY_ACTIVITIES]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('master/todayActivities', data)
                .then((result) => {
                    const todayActivitiesData = result.data
                    resolve(todayActivitiesData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });
        });
    },
    [PUT_TODAY_ACTIVITIES]({ commit }, data = null) {
        ApiService.setHeader()
        let ID = data.id
        delete data.id
        return new Promise((resolve, reject) => {
            console.log(data);
            ApiService.put(`master/todayActivities/edit/${ID}`, data)
                .then((result) => {
                    const jobData = result.data
                    resolve(jobData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [DELETE_TODAY_ACTIVITIES]({ commit }, id) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.delete(`master/todayActivities/delete/${id}`)
                .then((result) => {
                    const jobData = result.data
                    resolve(jobData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    }
};

const mutations = {
    [SET_TODAY_ACTIVITIES](state, todayActivities) {
        state.todayActivities = todayActivities;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};