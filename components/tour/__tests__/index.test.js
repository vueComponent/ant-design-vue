import Tour from '..';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';

describe('Tour', () => {
  mountTest(Tour);

  it('The Tour should render successfully ', function () {
    const wrapper = mount({
      setup() {
        return () => {
          return <Tour class="Tour" content="Ant Design" />;
        };
      },
    });
    expect(wrapper.find('.Tour').exists()).toBe(true);
  });
});
