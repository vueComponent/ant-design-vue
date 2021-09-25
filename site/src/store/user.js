/* eslint-disable no-unused-vars */
import { queryCurrent, query as queryUsers } from '../services/user';

export default {
  namespaced: true,
  state: {
    currentUser: {},
  },
  actions: {
    async login({ commit }, payload) {
      const response = await queryUsers(payload);
      commit({
        type: 'save',
        payload: response,
      });
    },
    async fetchCurrent({ commit }, payload) {
      const response = await queryCurrent(payload);
      commit({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },
  mutations: {
    saveCurrentUser(state, { payload }) {
      Object.assign(state, {
        currentUser: payload || {},
      });
    },
    changeNotifyCount(state, { payload }) {
      Object.assign(state, {
        currentUser: {
          ...state.currentUser,
          notifyCount: payload.totalCount,
          unreadCount: payload.unreadCount,
        },
      });
    },
  },
};
