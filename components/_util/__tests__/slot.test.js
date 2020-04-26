import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import { getSlot, hasSlot } from '../slot';

const Father = new Vue({
  render() {
    return <Child scopedSlots={{ default: () => <h1>h1: default</h1> }}></Child>;
  },
});

const Child = new Vue({
  render() {
    return (
      <div>
        {getSlot(this)}
        <span>{hasSlot(this)}</span>
      </div>
    );
  },
});

describe('getSlot', () => {
  it('should has default slot', async () => {
    const wrapper = mount(
      {
        render() {
          return <Father></Father>;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
