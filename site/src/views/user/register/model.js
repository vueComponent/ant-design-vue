import { fakeRegister } from './service';

const Model = {
  namespaced: true,
  state: {
    status: undefined,
  },
  actions: {
    async submit({ commit }, { payload }) {
      const response = await fakeRegister(payload);
      commit({
        type: 'registerHandle',
        payload: response,
      });
    },
  },
  mutations: {
    registerHandle(state, { payload }) {
      state.status = payload.status;
    },
  },
};

export default Model;
