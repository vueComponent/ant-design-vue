import { mount } from '@vue/test-utils';
import ColorPicker from '..';
import { asyncExpect } from '../../../tests/utils';
describe('ColorPicker', () => {
  xit('should support default value', async () => {
    const wrapper = mount(
      {
        render() {
          return <ColorPicker default-value="#cd0200" getPopupContainer={p => p}></ColorPicker>;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.unmount();
    }, 1000);
  });
  xit('should support v-model', async () => {
    let color = 'rgba(10, 10, 10, 1)';
    const wrapper = mount(
      {
        data() {
          return {
            color,
          };
        },
        render() {
          return <ColorPicker v-model={this.color} getPopupContainer={p => p}></ColorPicker>;
        },
        mounted() {
          this.color = 'rgba(110, 120, 130, 1)';
        },
      },
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.unmount();
    }, 1000);
  });
  xit('should support disabled', async () => {
    const wrapper = mount(
      {
        data() {
          return {
            disabled: false,
          };
        },
        render() {
          return <ColorPicker disabled={this.disabled} getPopupContainer={p => p}></ColorPicker>;
        },
        mounted() {
          this.disabled = true;
        },
      },
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(async () => {
      expect(wrapper.html()).toMatchSnapshot();
      await asyncExpect(() => {
        wrapper.unmount();
      });
    }, 1000);
  });
  xit('should support format', async () => {
    const wrapper = mount(
      {
        data() {
          return {
            format: 'RGBA',
          };
        },
        render() {
          return <ColorPicker format={this.format} getPopupContainer={p => p}></ColorPicker>;
        },
        mounted() {
          this.format = 'HEX';
        },
      },
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(async () => {
      expect(wrapper.html()).toMatchSnapshot();
      await asyncExpect(() => {
        wrapper.unmount();
      });
    }, 1000);
  });
  xit('prop locale should works', async () => {
    const wrapper = mount(
      {
        data() {
          return {
            locale: {
              lang: {
                'btn:save': 'セーブ',
                'btn:cancel': 'キャンセル',
                'btn:clear': '晴れ',
              },
            },
          };
        },
        render() {
          return (
            <ColorPicker default-value="#cd0200" locale={this.locale} getPopupContainer={p => p} />
          );
        },
        mounted() {
          this.locale = {
            lang: {
              'btn:save': '1セーブ',
              'btn:cancel': '1キャンセル',
              'btn:clear': '1晴れ',
            },
          };
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(async () => {
      expect(wrapper.html()).toMatchSnapshot();
      await asyncExpect(() => {
        wrapper.unmount();
      });
    }, 1000);
  });
  xit('save event should works', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <ColorPicker default-value="#cd0200" getPopupContainer={p => p} onSave={this.save} />
          );
        },
        methods: {
          save(val) {
            return val;
          },
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(async () => {
      wrapper.find('.pcr-save').trigger('click');
      expect(wrapper.html()).toMatchSnapshot();
      await asyncExpect(() => {
        wrapper.unmount();
      });
    }, 1000);
  });
});
