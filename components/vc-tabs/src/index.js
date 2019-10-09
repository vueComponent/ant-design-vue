// based on rc-tabs 9.6.1
import ref from 'vue-ref';
import Vue from 'vue';
import Tabs from './Tabs';
import TabPane from './TabPane';
import TabContent from './TabContent';

Vue.use(ref, { name: 'ant-ref' });

export default Tabs;
export { TabPane, TabContent };
