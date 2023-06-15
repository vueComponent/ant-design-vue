import { mount } from '@vue/test-utils';
import Segmented from '../index';
describe('Segmented', () => {
  const wrapper = mount({
    render() {
      return <Segmented></Segmented>;
    },
  });
  const todo = wrapper.get('[options="[1,2,3,4,5]"]');
  expect(todo.text()).toBe('segmented');
});
