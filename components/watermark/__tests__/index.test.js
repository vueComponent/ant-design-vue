import Watermark from '..';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';

describe('Watermark', () => {
  mountTest(Watermark);
  const mockSrcSet = jest.spyOn(Image.prototype, 'src', 'set');
  beforeAll(() => {
    mockSrcSet.mockImplementation(function fn() {
      this.onload?.();
    });
  });

  afterAll(() => {
    mockSrcSet.mockRestore();
  });

  it('The watermark should render successfully ', function () {
    const wrapper = mount({
      setup() {
        return () => {
          return <Watermark class="watermark" content="Ant Design" />;
        };
      },
    });
    expect(wrapper.find('.watermark').exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
