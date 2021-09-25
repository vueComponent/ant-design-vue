<template>
  <div class="main">
    <h3>
      {{ $t('userandregister.register.register') }}
    </h3>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item>
        <a-input
          v-decorator="formConfig.mail"
          size="large"
          :placeholder="$t('userandregister.email.placeholder')"
        />
      </a-form-item>
      <a-form-item :help="help">
        <a-popover
          :get-popup-container="getPopupContainer"
          :overlay-style="{ width: '240px' }"
          placement="right"
          :visible="visible"
        >
          <template #content>
            <div style="padding: 4px 0">
              <temp-var :status="getPasswordStatus()" :password="form.getFieldValue('password')">
                <template #default="{ status, password }">
                  <div v-if="status === 'ok'" class="success">
                    {{ $t('userandregister.strength.strong') }}
                  </div>
                  <div v-if="status === 'pass'" class="warning">
                    {{ $t('userandregister.strength.medium') }}
                  </div>
                  <div v-if="status === 'poor'" class="error">
                    {{ $t('userandregister.strength.short') }}
                  </div>
                  <div v-if="password && password.length" :class="`progress-${status}`">
                    <a-progress
                      :status="passwordProgressMap[status]"
                      class="progress"
                      :stroke-width="6"
                      :percent="password.length * 10 > 100 ? 100 : password.length * 10"
                      :show-info="false"
                    />
                  </div>
                </template>
              </temp-var>
              <div style="margin-top: 10px">
                {{ $t('userandregister.strength.msg') }}
              </div>
            </div>
          </template>
          <a-input
            v-decorator="formConfig.password"
            size="large"
            type="password"
            :placeholder="$t('userandregister.password.placeholder')"
          />
        </a-popover>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="formConfig.confirm"
          size="large"
          type="password"
          :placeholder="$t('userandregister.confirm-password.placeholder')"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          size="large"
          :loading="submitting"
          class="submit"
          type="primary"
          html-type="submit"
        >
          {{ $t('userandregister.register.register') }}
        </a-button>
        <router-link class="login" to="/user/login">
          {{ $t('userandregister.register.sign-in') }}
        </router-link>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    this.interval = undefined;
    this.form = this.$form.createForm(this);
    return {
      count: 0,
      confirmDirty: false,
      visible: false,
      help: '',
      prefix: '86',
      passwordProgressMap: {
        ok: 'success',
        pass: 'normal',
        poor: 'exception',
      },
      formConfig: {
        mail: [
          'mail',
          {
            rules: [
              {
                required: true,
                message: this.$t('userandregister.email.required'),
              },
              {
                type: 'email',
                message: this.$t('userandregister.email.wrong-format'),
              },
            ],
          },
        ],
        password: [
          'password',
          {
            rules: [
              {
                validator: this.checkPassword,
              },
            ],
          },
        ],
        confirm: [
          'confirm',
          {
            rules: [
              {
                required: true,
                message: this.$t('userandregister.confirm-password.required'),
              },
              {
                validator: this.checkConfirm,
              },
            ],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      userAndregister: state => state['userAndregister'],
      submitting: state => {
        return state.loading.effects['userAndregister/submit'];
      },
    }),
  },
  updated() {
    const { userAndregister, form } = this;
    const account = form.getFieldValue('mail');
    if (userAndregister.status === 'ok') {
      this.$router.push({
        path: '/user/register-result',
        query: {
          account,
        },
      });
    }
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    getPopupContainer(node) {
      if (node && node.parentNode) {
        return node.parentNode;
      }
      return node;
    },
    onGetCaptcha() {
      let count = 59;
      this.count = count;
      this.interval = window.setInterval(() => {
        count -= 1;
        this.count = count;
        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    },

    getPasswordStatus() {
      const { form } = this;
      const value = form.getFieldValue('password');
      if (value && value.length > 9) {
        return 'ok';
      }
      if (value && value.length > 5) {
        return 'pass';
      }
      return 'poor';
    },

    handleSubmit(e) {
      e.preventDefault();
      const { form } = this;
      form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.$store.dispatch({
            type: 'userAndregister/submit',
            payload: values,
          });
        }
      });
    },

    checkConfirm(rule, value, callback) {
      const { form } = this;
      if (value && value !== form.getFieldValue('password')) {
        callback(this.$t('userandregister.password.twice'));
      } else {
        callback();
      }
    },

    checkPassword(rule, value, callback) {
      const { visible, confirmDirty } = this;
      if (!value) {
        this.help = this.$t('userandregister.password.required');
        this.visible = !!value;
        callback('error');
      } else {
        this.help = '';
        if (!visible) {
          this.visible = !!value;
        }
        if (value.length < 6) {
          callback('error');
        } else {
          const { form } = this;
          if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
          }
          callback();
        }
      }
    },

    changePrefix(value) {
      this.prefix = value;
    },
  },
};
</script>
<style scoped lang="less" src="./style.less"></style>
