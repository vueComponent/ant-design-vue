import { parse } from 'query-string';
import router from '../../../router';
import { fakeAccountLogin } from './service';

export default {
  namespaced: true,
  state: {
    status: undefined,
  },
  actions: {
    async login({ commit }, payload) {
      const response = await fakeAccountLogin(payload);
      commit({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        let redirect = parse(location.search).redirect;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        router.replace({ path: redirect || '/' });
      }
    },
  },
  mutations: {
    changeLoginStatus(state, { payload }) {
      Object.assign(state, {
        status: payload.status,
        type: payload.type,
      });
    },
  },
};
