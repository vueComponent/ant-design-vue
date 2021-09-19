import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import List from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('List', () => {
  mountTest(List);
  mountTest(List.Item);
  it('locale not passed to internal div', async () => {
    const locale = { emptyText: 'Custom text' };
    const wrapper = mount(
      {
        render() {
          return (
            <List
              dataSource={[]}
              renderItem={({ item }) => <List.Item>{item}</List.Item>}
              locale={locale}
            />
          );
        },
      },
      {
        sync: false,
      },
    );
    await asyncExpect(() => {
      expect(wrapper.props().locale).toBe(undefined);
    });
  });
});
