import Slider from '../src/Slider';
import { ensureValueInRange, ensureValuePrecision } from '../src/utils';

describe('Slider bounds during a drag', () => {
  it('commits a valid remaining mark after max changes', () => {
    const methods = Slider.mixins[1].methods;
    const events = [];
    const state = {
      $props: { min: 0, max: 100, step: null, marks: { 0: '0', 20: '20', 80: '80', 100: '100' } },
      sValue: 80,
      dragging: true,
      trimAlignValue: methods.trimAlignValue,
      setState(next) {
        Object.assign(this, next);
      },
      removeDocumentEvents: jest.fn(),
      $emit(name, value) {
        events.push([name, value]);
      },
    };
    state.$props.max = 60;
    methods.setChangeValue.call(state, state.sValue);
    methods.onEnd.call(state);

    expect(ensureValuePrecision(ensureValueInRange(80, state.$props), state.$props)).toBe(20);
    expect(events).toContainEqual(['afterChange', 20]);
  });
});
