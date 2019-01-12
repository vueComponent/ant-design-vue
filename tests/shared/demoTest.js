import glob from 'glob';
import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import moment from 'moment';
import Vue from 'vue';
import antd from 'ant-design-vue';
Vue.use(antd);

export default function demoTest(component, options = {}) {
  const suffix = options.suffix || 'md';
  const files = glob.sync(`./components/${component}/demo/*.${suffix}`);

  files.forEach(file => {
    let testMethod = options.skip === true ? test.skip : test;
    if (Array.isArray(options.skip) && options.skip.some(c => file.includes(c))) {
      testMethod = test.skip;
    }
    testMethod(`renders ${file} correctly`, done => {
      MockDate.set(moment('2016-11-22'));
      const demo = require(`../.${file}`).default || require(`../.${file}`); // eslint-disable-line global-require, import/no-dynamic-require
      const wrapper = mount(demo, { sync: false });
      Vue.nextTick(() => {
        expect(wrapper.html()).toMatchSnapshot();
        MockDate.reset();
        wrapper.destroy();
        done();
      });
    });
  });
}
