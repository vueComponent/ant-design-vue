import styles from './index.less';
import i18n from '../../../../site/i18n';
window.i18n = i18n;
export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      // eslint-disable-next-line no-unused-vars
      prefix: h => <a-icon type="user" class={styles.prefixIcon} />,
      placeholder: 'please enter userName',
    },
    rules: [
      {
        required: true,
        message: 'Please enter userName!',
      },
    ],
  },
  Email: {
    props: {
      size: 'large',
      id: 'email',
      // eslint-disable-next-line no-unused-vars
      prefix: h => <a-icon type="mail" class={styles.prefixIcon} />,
      placeholder: 'please enter email',
    },
    rules: [
      {
        required: true,
        message: 'Please enter email!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      // eslint-disable-next-line no-unused-vars
      prefix: h => <a-icon type="lock" class={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: 'Please enter password!',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      // eslint-disable-next-line no-unused-vars
      prefix: h => <a-icon type="mobile" class={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      // eslint-disable-next-line no-unused-vars
      prefix: h => <a-icon type="mail" class={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
};
