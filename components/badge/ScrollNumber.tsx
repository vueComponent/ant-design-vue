import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import type { ExtractPropTypes, CSSProperties, DefineComponent, HTMLAttributes } from 'vue';
import { defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import SingleNumber from './SingleNumber';
import { filterEmpty } from '../_util/props-util';

const scrollNumberProps = {
  prefixCls: String,
  count: PropTypes.any,
  component: String,
  title: PropTypes.any,
  show: Boolean,
};

export type ScrollNumberProps = Partial<ExtractPropTypes<typeof scrollNumberProps>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ScrollNumber',
  inheritAttrs: false,
  props: scrollNumberProps,
  setup(props, { attrs, slots }) {
    const { prefixCls } = useConfigInject('scroll-number', props);

    return () => {
      const {
        prefixCls: customizePrefixCls,
        count,
        title,
        show,
        component: Tag = 'sup' as unknown as DefineComponent,
        class: className,
        style,
        ...restProps
      } = { ...props, ...attrs } as ScrollNumberProps & HTMLAttributes & { style: CSSProperties };
      // ============================ Render ============================
      const newProps = {
        ...restProps,
        style,
        'data-show': props.show,
        class: classNames(prefixCls.value, className),
        title: title as string,
      };

      // Only integer need motion
      let numberNodes: any = count;
      if (count && Number(count) % 1 === 0) {
        const numberList = String(count).split('');

        numberNodes = numberList.map((num, i) => (
          <SingleNumber
            prefixCls={prefixCls.value}
            count={Number(count)}
            value={num}
            key={numberList.length - i}
          />
        ));
      }

      // allow specify the border
      // mock border-color by box-shadow for compatible with old usage:
      // <Badge count={4} style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} />
      if (style && style.borderColor) {
        newProps.style = {
          ...(style as CSSProperties),
          boxShadow: `0 0 0 1px ${style.borderColor} inset`,
        };
      }
      const children = filterEmpty(slots.default?.());
      if (children && children.length) {
        return cloneElement(
          children,
          {
            class: classNames(`${prefixCls.value}-custom-component`),
          },
          false,
        );
      }

      return <Tag {...newProps}>{numberNodes}</Tag>;
    };
  },
});
