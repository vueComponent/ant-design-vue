import { defineComponent } from 'vue';
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined';
import classNames from '../_util/classNames';
import { floatButtonContentProps } from './interface';

const FloatButtonContent = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButtonContent',
  inheritAttrs: false,
  props: floatButtonContentProps(),
  setup(props, { attrs, slots }) {
    return () => {
      const { description, prefixCls } = props;

      const defaultElement = (
        <div class={`${prefixCls}-icon`}>
          <FileTextOutlined />
        </div>
      );

      return (
        <div {...attrs} class={classNames(attrs.class, `${prefixCls}-content`)}>
          {slots.icon || description ? (
            <>
              {slots.icon && <div class={`${prefixCls}-icon`}>{slots.icon()}</div>}
              {(slots.description || description) && (
                <div class={`${prefixCls}-description`}>
                  {(slots.description && slots.description()) || description}
                </div>
              )}
            </>
          ) : (
            defaultElement
          )}
        </div>
      );
    };
  },
});

export default FloatButtonContent;
