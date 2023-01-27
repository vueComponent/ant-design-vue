import { defineComponent } from 'vue';
import Radio, { radioProps } from './Radio';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useProvideRadioOptionTypeContext } from './context';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ARadioButton',
  props: radioProps(),
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('radio-button', props);
    useProvideRadioOptionTypeContext('button');
    return () => {
      return (
        <Radio {...props} prefixCls={prefixCls.value}>
          {slots.default?.()}
        </Radio>
      );
    };
  },
});
