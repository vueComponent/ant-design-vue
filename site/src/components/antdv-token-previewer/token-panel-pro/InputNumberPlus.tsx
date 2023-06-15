import { InputNumber, Slider } from 'ant-design-vue';
import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

export type InputNumberPlusProps = {
  value?: number;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
};

const InputNumberPlus = defineComponent({
  name: 'InputNumberPlus',
  props: {
    value: { type: Number },
    onChange: { type: Function as PropType<(value: number | null) => void> },
    min: { type: Number },
    max: { type: Number },
  },
  setup(props) {
    const { value, min, max } = toRefs(props);
    return () => {
      return (
        <div style={{ display: 'flex', width: '200px' }}>
          <Slider
            style={{ flex: '0 0 120px', marginRight: '12px' }}
            value={value.value}
            min={min.value}
            max={max.value}
            onChange={props.onChange}
          />
          <InputNumber
            value={value.value}
            min={min.value}
            max={max.value}
            onChange={props.onChange}
            style={{ flex: 1 }}
          />
        </div>
      );
    };
  },
});

export default InputNumberPlus;
