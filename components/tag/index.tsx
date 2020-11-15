import {
  inject,
  ref,
  HTMLAttributes,
  defineComponent,
  App,
  watchEffect,
  PropType,
  ExtractPropTypes,
  Plugin,
} from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
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

const tagProps = {
  prefixCls: PropTypes.string,
  color: {
    type: String as PropType<LiteralUnion<PresetColorType | PresetStatusColorType, string>>,
  },
  closable: PropTypes.looseBool.def(false),
  closeIcon: PropTypes.VNodeChild,
  visible: PropTypes.looseBool,
  onClose: {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  icon: PropTypes.VNodeChild,
};

export type TagProps = HTMLAttributes & Partial<ExtractPropTypes<typeof tagProps>>;

const Tag = defineComponent({
  name: 'ATag',
  emits: ['update:visible', 'close'],
  setup(props: TagProps, { slots, emit, attrs }) {
    const { getPrefixCls } = inject('configProvider', defaultConfigProvider);

    const visible = ref(true);

    watchEffect(() => {
      if (props.visible !== undefined) {
        visible.value = props.visible!;
      }
    });

    const handleCloseClick = (e: MouseEvent) => {
      e.stopPropagation();
      emit('update:visible', false);
      emit('close', e);

      if (e.defaultPrevented) {
        return;
      }
      if (props.visible === undefined) {
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
        icon = slots.icon?.(),
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
        <span class={tagClassName} style={tagStyle}>
          {kids}
          {renderCloseIcon()}
        </span>
      );

      return isNeedWave ? <Wave>{tagNode}</Wave> : tagNode;
    };
  },
});

Tag.props = tagProps;

Tag.CheckableTag = CheckableTag;

Tag.install = function(app: App) {
  app.component(Tag.name, Tag);
  app.component(CheckableTag.name, CheckableTag);
  return app;
};

export default Tag as typeof Tag &
  Plugin & {
    readonly CheckableTag: typeof CheckableTag;
  };
