<template>
  <div class="main">
    <login ref="login" :default-active-key="type" @submit="handleSubmit">
      <tab key="account" :tab="$t('userandlogin.login.tab-login-credentials')">
        <template v-if="status === 'error' && type === 'account' && !submitting">
          <a-alert
            style="margin-bottom: 24px"
            :message="$t('userandlogin.login.message-invalid-credentials')"
            type="error"
            show-icon
          />
        </template>
        <email
          name="email"
          :rules="[
            {
              required: true,
              message: $t('userandlogin.email.required'),
            },
          ]"
        />

        <password
          name="password"
          :rules="[{ required: true, message: $t('userandlogin.password.required') }]"
          :on-press-enter="
            e => {
              e.preventDefault();
              form.validateFields(handleSubmit);
            }
          "
        />
      </tab>
      <div>
        <!-- <a-checkbox :checked="autoLogin" @change="changeAutoLogin">自动登录</a-checkbox> -->
        <!-- <a style="float: right" href>忘记密码</a> -->
      </div>
      <submit :loading="submitting">
        {{ $t('userandlogin.login.login') }}
      </submit>
      <div class="other">
        <router-link class="register" to="/user/register">
          {{ $t('userandlogin.login.signup') }}
        </router-link>
      </div>
    </login>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapActions, mapState } from 'vuex';
import Login from './components';

const { Tab, Email, Password, Submit } = Login;

export default {
  components: {
    Login,
    Tab,
    Password,
    Submit,
    Email,
  },
  data() {
    return {
      type: 'account',
      autoLogin: true,
      submitting: false,
      count: 0,
      tabs: [],
    };
  },
  computed: {
    ...mapState('userAndLogin', {
      status: state => state.status,
    }),
  },
  methods: {
    ...mapActions('userAndLogin', ['login']),
    handleSubmit(err, values) {
      const { type } = this.$data;
      if (!err) {
        this.submitting = true;
        this.login({
          ...values,
          type,
        }).then(() => {
          this.submitting = false;
        });
      }
    },
  },
};
</script>

<style scoped lang="less" src="./style.less"></style>
