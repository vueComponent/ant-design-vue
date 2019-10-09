import { mount } from '@vue/test-utils';
import Collapse from '..';

describe('Collapse', () => {
  it('should support remove expandIcon', () => {
    const wrapper = mount({
      render() {
        return (
          <Collapse expandIcon={() => null}>
            <Collapse.Panel header="header" />
          </Collapse>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
