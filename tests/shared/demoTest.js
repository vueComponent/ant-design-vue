import glob from 'glob';
import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import moment from 'moment';
import Vue from 'vue';
import antd from 'ant-design-vue';
import { sleep } from '../utils';
Vue.use(antd);

export default function demoTest(component, options = {}) {
  const suffix = options.suffix || 'md';
  const files = glob.sync(`./antdv-demo/docs/${component}/demo/*.${suffix}`);

  files.forEach(file => {
    let testMethod = options.skip === true ? test.skip : test;
    if (Array.isArray(options.skip) && options.skip.some(c => file.includes(c))) {
      testMethod = test.skip;
    }
    testMethod(`renders ${file} correctly`, async () => {
      MockDate.set(moment('2016-11-22'));
      const demo = require(`../.${file}`).default || require(`../.${file}`);
      document.body.innerHTML = '';
      const wrapper = mount(demo, { sync: false, attachToDocument: true });
      await sleep();
      // should get dom from element
      // snap files copy from antd does not need to change
      // or just change a little
      const dom = options.getDomFromElement ? wrapper.element : wrapper.html();
      expect(dom).toMatchSnapshot();
      MockDate.reset();
      wrapper.destroy();
      document.body.innerHTML = '';
    });
  });
}
