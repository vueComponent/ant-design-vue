import { defineComponent } from 'vue';
import Radio, { radioProps } from './Radio';
import useConfigInject from '../_util/hooks/useConfigInject';
import { useProvideRadioOptionTypeContext } from './context';

export default defineComponent({
  name: 'ARadioButton',
  props: radioProps(),
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('radio-button', props);
    useProvideRadioOptionTypeContext('button');
    return () => {
      return (
        <Radio {...props} prefixCls={prefixCls.value} type="radio">
          {slots.default?.()}
        </Radio>
      );
    };
  },
});
