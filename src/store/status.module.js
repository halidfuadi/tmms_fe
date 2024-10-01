import CommonAPI from "../apis/CommonAPI";

export const GET_STATUS = "getStatus";
export const POST_STATUS = "postStatus";
export const PUT_STATUS = "putStatus";
export const DELETE_STATUS = "deleteStatus";

// mutation types
export const SET_STATUS = "setStatus";

const state = {
    status: null
};

const getters = {
    getStatus(state) {
        return state.status
    },
    getStatusOpts(state) {
        if (state.status) {
            const mapStatus = state.status.map(line => {
                return {
                    id: line.uuid,
                    text: line.status_nm
                }
            })
            mapStatus.push({
                id: "-1",
                text: 'All'
            })
            return mapStatus
        }
    },
    getStatusOptsWithoutAll(state) {
        if (state.status) {
            const mapStatus = state.status.map(line => {
                return {
                    id: line.id,
                    text: line.status_nm
                }
            })
            return mapStatus
        }
    }
};

const actions = {
    [GET_STATUS]({ commit }, query) {
        return new Promise(async(resolve, reject) => {
            await CommonAPI.post('/tpm/status/search', query)
                .then((result) => {
                    if (result.data) {
                        console.log(result.data);
                        commit(SET_STATUS, result.data.data)
                        resolve(result.data.data)
                    }
                    reject('Data tidak ada')
                })
                .catch((err) => {
                    reject(err)
                })

        });
    },
    [POST_STATUS]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('master/status', data)
                .then((result) => {
                    const statusData = result.data
                    resolve(statusData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });
        });
    },
    [PUT_STATUS]({ commit }, data = null) {
        ApiService.setHeader()
        let ID = data.id
        delete data.id
        return new Promise((resolve, reject) => {
            console.log(data);
            ApiService.put(`master/status/edit/${ID}`, data)
                .then((result) => {
                    const jobData = result.data
                    resolve(jobData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [DELETE_STATUS]({ commit }, id) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.delete(`master/status/delete/${id}`)
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
    [SET_STATUS](state, status) {
        state.status = status;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};