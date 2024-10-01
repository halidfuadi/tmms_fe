import CommonAPI from "../apis/CommonAPI";

export const GET_LINES = "getLines";
export const POST_LINE = "postLines";
export const PUT_LINE = "putLines";
export const DELETE_LINE = "deleteLines";

// mutation types
export const SET_LINES = "setLines";

const state = {
    lines: null
};

const getters = {
    getLines(state) {
        return state.lines
    },
    getLinesOpts(state) {
        if (state.lines) {
            const mapLines = state.lines.map(line => {
                return {
                    id: line.uuid,
                    text: line.line_nm
                }
            })
            mapLines.push({
                id: "-1",
                text: 'All'
            })
            return mapLines
        }
    },
    getLinesOptsWithoutAll(state) {
        if (state.lines) {
            const mapLines = state.lines.map(line => {
                return {
                    id: line.id,
                    text: line.line_nm
                }
            })
            return mapLines
        }
    }
};

const actions = {
    [GET_LINES]({ commit }, query) {
        return new Promise(async(resolve, reject) => {
            await CommonAPI.post('/tpm/lines/search', query)
                .then((result) => {
                    if (result.data) {
                        console.log(result.data);
                        commit(SET_LINES, result.data.data)
                        resolve(result.data.data)
                    }
                    reject('Data tidak ada')
                })
                .catch((err) => {
                    reject(err)
                })

        });
    },
    [POST_LINE]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('master/lines', data)
                .then((result) => {
                    const linesData = result.data
                    resolve(linesData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });
        });
    },
    [PUT_LINE]({ commit }, data = null) {
        ApiService.setHeader()
        let ID = data.id
        delete data.id
        return new Promise((resolve, reject) => {
            console.log(data);
            ApiService.put(`master/lines/edit/${ID}`, data)
                .then((result) => {
                    const jobData = result.data
                    resolve(jobData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [DELETE_LINE]({ commit }, id) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.delete(`master/lines/delete/${id}`)
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
    [SET_LINES](state, lines) {
        state.lines = lines;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};