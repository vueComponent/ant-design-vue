import styles from './index.less';
import { UserOutlined, MailOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons-vue';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      // eslint-disable-next-line no-unused-vars
      prefix: h => <UserOutlined class={styles.prefixIcon} />,
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
      prefix: h => <MailOutlined class={styles.prefixIcon} />,
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
      prefix: h => <LockOutlined class={styles.prefixIcon} />,
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
      prefix: h => <MobileOutlined class={styles.prefixIcon} />,
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
      prefix: h => <MailOutlined class={styles.prefixIcon} />,
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
