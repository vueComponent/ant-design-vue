import {
  inject,
  ref,
  HTMLAttributes,
  defineComponent,
  SetupContext,
  App,
  VNodeTypes,
  watchEffect,
} from 'vue';
import classNames from '../_util/classNames';
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
  color?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
  closable?: boolean;
  closeIcon?: VNodeTypes;
  visible?: boolean;
  onClose?: (e: MouseEvent) => void;
  icon?: VNodeTypes;
}

const Tag = defineComponent({
  name: 'ATag',
  emits: ['update:visible'],
  setup(props: TagProps, { slots, emit, attrs }: SetupContext) {
    const { getPrefixCls } = inject('configProvider', defaultConfigProvider);

    const visible = ref(true);

    watchEffect(() => {
      if ('visible' in props) {
        visible.value = props.visible!;
      }
    });

    const handleCloseClick = (e: MouseEvent) => {
      e.stopPropagation();
      if (props.onClose) {
        emit('update:visible', false);
        props.onClose(e);
      }

      if (e.defaultPrevented) {
        return;
      }
      if (!('visible' in props)) {
        visible.value = false;
      }
    };

    const isPresetColor = (): boolean => {
      const { color } = props;
      if (!color) {
        return false;
      }
      return PresetColorRegex.test(color) || PresetStatusColorRegex.test(color);
    };

    return () => {
      const {
        prefixCls: customizePrefixCls,
        icon,
        color,
        closeIcon = slots.closeIcon?.(),
        closable = false,
      } = props;

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
      };

      const tagClassName = classNames(prefixCls, {
        [`${prefixCls}-${color}`]: presetColor,
        [`${prefixCls}-has-color`]: color && !presetColor,
        [`${prefixCls}-hidden`]: !visible.value,
      });

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

      const isNeedWave = 'onClick' in attrs;

      const tagNode = (
        <span v-show={visible.value} class={tagClassName} style={tagStyle}>
          {kids}
          {renderCloseIcon()}
        </span>
      );

      return isNeedWave ? <Wave>{tagNode}</Wave> : tagNode;
    };
  },
});

Tag.props = ['prefixCls', 'color', 'closable', 'closeIcon', 'visible', 'icon'];

Tag.CheckableTag = CheckableTag;

Tag.install = (app: App) => {
  app.component(Tag.name, Tag);
  app.component(CheckableTag.name, CheckableTag);
};

export default Tag;
