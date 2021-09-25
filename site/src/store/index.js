import { createStore } from 'vuex';
import user from './user';
import userAndLogin from '../views/user/login/model';
import userAndregister from '../views/user/register/model';

const createLoadingPlugin = ({ namespace: NAMESPACE = 'loading' } = {}) => {
  const SHOW = '@@ANTDV_LOADING/SHOW';
  const HIDE = '@@ANTDV_LOADING/HIDE';
  return store => {
    if (store.state[NAMESPACE]) {
      throw new Error(`createLoadingPlugin: ${NAMESPACE} exited in current store`);
    }
    store.registerModule(NAMESPACE, {
      namespaced: true,
      state: {
        global: false,
        models: {},
        effects: {},
      },
      mutations: {
        [SHOW]: (state, { payload: { actionType } }) => {
          state.global = true;
          const _namespace = actionType.split('/')[0];
          state.models = { ...state.models, [_namespace]: true };
          state.effects = { ...state.effects, [actionType]: true };
        },
        [HIDE]: (state, { payload: { actionType } }) => {
          state.global = false;
          const _namespace = actionType.split('/')[0];
          state.models = { ...state.models, [_namespace]: false };
          state.effects = { ...state.effects, [actionType]: false };
        },
      },
    });
    store.subscribeAction({
      before: action => {
        store.commit(
          { type: `${NAMESPACE}/${SHOW}`, payload: { actionType: action.type } },
          { root: true },
        );
      },
      after: action => {
        store.commit(
          { type: `${NAMESPACE}/${HIDE}`, payload: { actionType: action.type } },
          { root: true },
        );
      },
    });
  };
};

export default createStore({
  state: {},
  plugins: [createLoadingPlugin()],
  modules: {
    userAndLogin,
    userAndregister,
    user,
  },
});
