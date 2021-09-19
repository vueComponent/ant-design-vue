/* eslint-disable import/no-unresolved */
import Login from './Login';
import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';
import LoginItem from './LoginItem';

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Login;
