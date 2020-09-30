import {
  inject,
  ref,
  HTMLAttributes,
  defineComponent,
  SetupContext,
  App,
  watchEffect,
  VNodeTypes,
  CSSProperties,
} from 'vue';
import classNames from '../_util/classNames';
import omit from 'omit.js';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import Wave from '../_util/wave';
import {
  PresetColorTypes,
  PresetStatusColorTypes,
  PresetColorType,
  PresetStatusColorType,
} from '../_util/colors';
import { LiteralUnion } from '../_util/type';
import { defaultConfigProvider } from '../config-provider';
import CheckableTag from './CheckableTag';

const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);
const PresetStatusColorRegex = new RegExp(`^(${PresetStatusColorTypes.join('|')})$`);

export interface TagProps extends HTMLAttributes {
  prefixCls?: string;
  class?: string;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
  closable?: boolean;
  closeIcon?: VNodeTypes;
  style?: CSSProperties;
  visible?: boolean;
  onClose?: Function;
  icon?: VNodeTypes;
}

const Tag = defineComponent({
  inheritAttrs: false,
  setup(_: TagProps, { slots, attrs }: SetupContext) {
    const { getPrefixCls } = inject('configProvider', defaultConfigProvider);

    const visible = ref(true);

    const props = attrs as TagProps;

    watchEffect(() => {
      if ('visible' in props) {
        visible.value = props.visible!;
      }
    });

    const handleCloseClick = (e: MouseEvent) => {
      e.stopPropagation();
      if (props.onClose) {
        props.onClose(e);
      }

      if (e.defaultPrevented) {
        return;
      }
      if (!('visible' in props)) {
        visible.value = false;
      }
    };

    return () => {
      const {
        prefixCls: customizePrefixCls,
        icon,
        color,
        closeIcon,
        class: className,
        style = {},
        closable = false,
        ...restProps
      } = props;

      const isPresetColor = (): boolean => {
        if (!color) {
          return false;
        }
        return PresetColorRegex.test(color) || PresetStatusColorRegex.test(color);
      };

      const presetColor = isPresetColor();
      const prefixCls = getPrefixCls('tag', customizePrefixCls);

      const renderCloseIcon = () => {
        if (closable) {
          return closeIcon ? (
            <div class={`${prefixCls}-close-icon`} onClick={handleCloseClick}>
              {closeIcon}
            </div>
          ) : (
            <CloseOutlined class={`${prefixCls}-close-icon`} onClick={handleCloseClick} />
          );
        }
        return null;
      };

      const tagStyle = {
        backgroundColor: color && !isPresetColor() ? color : undefined,
        ...style,
      };

      const tagClassName = classNames(prefixCls, {
        [`${prefixCls}-${color}`]: presetColor,
        [`${prefixCls}-has-color`]: color && !presetColor,
        [`${prefixCls}-hidden`]: !visible.value,
      });

      const tagProps = omit(restProps, ['visible']);
      const iconNode = icon || null;
      const children = slots.default?.();
      const kids = iconNode ? (
        <>
          {iconNode}
          <span>{children}</span>
        </>
      ) : (
        children
      );

      const isNeedWave = 'onClick' in props;

      const tagNode = (
        <span {...tagProps} class={tagClassName} style={tagStyle}>
          {kids}
          {renderCloseIcon()}
        </span>
      );

      return isNeedWave ? <Wave>{tagNode}</Wave> : tagNode;
    };
  },
});

Tag.CheckableTag = CheckableTag;

Tag.install = (app: App) => {
  app.component(Tag.name, Tag);
  app.component(CheckableTag.name, CheckableTag);
};

export default Tag;
