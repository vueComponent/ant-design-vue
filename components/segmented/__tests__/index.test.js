import { mount } from '@vue/test-utils';
import Segmented from '../index';
describe('Segmented', () => {
  it('render segmented ok', async () => {
    const wrapper = mount({
      render() {
        return <Segmented value={2} options={[1, 2, 3, 4]}></Segmented>;
      },
    });
    expect(wrapper.findAll('.ant-segmented-item').at(1).classes()).toContain(
      'ant-segmented-item-selected',
    );
  });
});
