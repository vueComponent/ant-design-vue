import { mount } from '@vue/test-utils';
import ColorPicker from '..';
import { asyncExpect } from '@/tests/utils';
describe('ColorPicker', () => {
  it('should support default value', async () => {
    const wrapper = mount({
      render() {
        return (
          <ColorPicker default-value="#cd0200" getPopupContainer={p => p} >
          </ColorPicker>
        );
      },
    }, { sync: false, attachToDocument: true });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.destroy();
    }, 1000);
  });
  it('should support v-model', async () => {
    let color = "rgba(10, 10, 10, 1)";
    const wrapper = mount({
      data(){
        return {
          color,
        };
      },
      render() {
        return (
          <ColorPicker v-model={this.color} getPopupContainer={p => p} >
          </ColorPicker>
        );
      },
      mounted () {
        this.color = "rgba(110, 120, 130, 1)";
      },
    }, { sync: false, attachToDocument: true });

    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.destroy();
    },1000);
  });
  it('should support disabled', async () => {
    const wrapper = mount({
      render() {
        return (
          <ColorPicker disabled getPopupContainer={p => p} >
          </ColorPicker>
        );
      },
    }, { sync: false, attachToDocument: true });

    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.destroy();
    },1000);
  });
  it('prop locale should works', async () => {
    const locale = {
      lang: {
        'btn:save': 'セーブ',
        'btn:cancel': 'キャンセル',
        'btn:clear': '晴れ',
      },
    };
    const wrapper = mount({
      render() {
        return <ColorPicker default-value="#cd0200" locale={locale} getPopupContainer={p => p} />;
      },
    }, { sync: false, attachToDocument: true });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
      wrapper.destroy();
    },1000);
  });
});
