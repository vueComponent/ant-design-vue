import glob from 'glob';
import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import antd from '../../components';

export default function demoTest(component, options = {}) {
  const suffix = options.suffix || 'vue';
  const files = glob.sync(`./components/${component}/demo/*.${suffix}`);
  files.forEach(file => {
    if (file.includes('index.vue')) {
      return;
    }
    let testMethod = options.skip === true ? test.skip : test;

    if (Array.isArray(options.skip) && options.skip.some(c => file.includes(c))) {
      testMethod = test.skip;
    }
    testMethod(`renders ${file} correctly`, () => {
      MockDate.set(dayjs('2016-11-22').valueOf());
      const demo = require(`../.${file}`).default || require(`../.${file}`);
      document.body.innerHTML = '';
      const wrapper = mount(demo, {
        global: { plugins: [antd] },
        attachTo: document.body,
        // sync: false,
      });
      // await sleep();
      // should get dom from element
      // snap files copy from antd does not need to change
      // or just change a little
      const dom = options.getDomFromElement ? wrapper.element : wrapper.html();
      expect(dom).toMatchSnapshot();
      MockDate.reset();
      // wrapper.unmount();
      document.body.innerHTML = '';
    });
  });
}
