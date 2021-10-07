import { mount } from '@vue/test-utils';
import Tabs, { TabPane } from '..';

describe('Tabs', () => {
  describe('editable-card', () => {
    let handleEdit;
    let wrapper;

    beforeEach(() => {
      handleEdit = jest.fn();
      wrapper = mount({
        render() {
          return (
            <Tabs type="editable-card" onEdit={handleEdit}>
              <TabPane tab="foo" key="1">
                foo
              </TabPane>
            </Tabs>
          );
        },
      });
    });

    it('add card', () => {
      wrapper.find('.ant-tabs-nav-add').trigger('click');
      expect(handleEdit.mock.calls[0][1]).toBe('add');
    });

    it('remove card', () => {
      wrapper.find('.anticon-close').trigger('click');
      expect(handleEdit).toBeCalledWith('1', 'remove');
    });
  });

  describe('tabPosition', () => {
    it('remove card', () => {
      const wrapper = mount({
        render() {
          return (
            <Tabs tabPosition="left" v-slots={{ rightExtra: () => 'xxx' }}>
              <TabPane tab="foo" key="1">
                foo
              </TabPane>
            </Tabs>
          );
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
