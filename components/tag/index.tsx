import {
  inject,
  ref,
  HTMLAttributes,
  VNodeChild,
  Events,
  defineComponent,
  SetupContext,
  App,
  watchEffect,
} from 'vue';
import classNames from 'classnames';
import omit from 'omit.js';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import Wave from '../_util/wave';
import {
  PresetColorTypes,
  PresetStatusColorTypes,
  PresetColorType,
  PresetStatusColorType,
} from '../_util/colors';
import { LiteralUnion, EventHandlers } from '../_util/type';
import { ConfigConsumerProps } from '../config-provider';
import CheckableTag from './CheckableTag';

const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);
const PresetStatusColorRegex = new RegExp(`^(${PresetStatusColorTypes.join('|')})$`);

export interface TagProps extends HTMLAttributes, Partial<EventHandlers<Events>> {
  prefixCls?: string;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
  closable?: boolean;
  closeIcon?: VNodeChild | JSX.Element;
  visible?: boolean;
  onClose?: Function;
  icon?: VNodeChild | JSX.Element;
}

const Tag = defineComponent({
  setup(_: TagProps, { slots, attrs }: SetupContext) {
    const { getPrefixCls } = inject('configProvider', ConfigConsumerProps);

    const visible = ref(true);

    return () => {
      const {
        prefixCls: customizePrefixCls,
        style,
        icon,
        color,
        onClose,
        closeIcon,
        closable = false,
        ...props
      } = attrs as TagProps;

      watchEffect(() => {
        if ('visible' in props) {
          visible.value = props.visible!;
        }
      });

      const isPresetColor = (): boolean => {
        if (!color) {
          return false;
        }
        return PresetColorRegex.test(color) || PresetStatusColorRegex.test(color);
      };

      const presetColor = isPresetColor();
      const prefixCls = getPrefixCls('tag', customizePrefixCls);

      const handleCloseClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (onClose) {
          onClose(e);
        }

        if (e.defaultPrevented) {
          return;
        }
        if (!('visible' in props)) {
          visible.value = false;
        }
      };

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
      };

      const tagClassName = classNames(prefixCls, {
        [`${prefixCls}-${color}`]: presetColor,
        [`${prefixCls}-has-color`]: color && !presetColor,
        [`${prefixCls}-hidden`]: !visible.value,
      });

      const tagProps = omit(props, ['visible']);
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
