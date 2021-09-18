import type { HTMLAttributes, App, PropType, ExtractPropTypes, Plugin } from 'vue';
import { ref, defineComponent, watchEffect, computed } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import Wave from '../_util/wave';
import type { PresetColorType, PresetStatusColorType } from '../_util/colors';
import { PresetColorTypes, PresetStatusColorTypes } from '../_util/colors';
import type { LiteralUnion } from '../_util/type';
import CheckableTag from './CheckableTag';
import useConfigInject from '../_util/hooks/useConfigInject';

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
  props: tagProps,
  emits: ['update:visible', 'close'],
  slots: ['closeIcon', 'icon'],
  setup(props: TagProps, { slots, emit, attrs }) {
    const { prefixCls, direction } = useConfigInject('tag', props);

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

    const isPresetColor = computed(() => {
      const { color } = props;
      if (!color) {
        return false;
      }
      return PresetColorRegex.test(color) || PresetStatusColorRegex.test(color);
    });

    const tagClassName = computed(() =>
      classNames(prefixCls.value, {
        [`${prefixCls.value}-${props.color}`]: isPresetColor.value,
        [`${prefixCls.value}-has-color`]: props.color && !isPresetColor.value,
        [`${prefixCls.value}-hidden`]: !visible.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      }),
    );

    return () => {
      const {
        icon = slots.icon?.(),
        color,
        closeIcon = slots.closeIcon?.(),
        closable = false,
      } = props;

      const renderCloseIcon = () => {
        if (closable) {
          return closeIcon ? (
            <div class={`${prefixCls.value}-close-icon`} onClick={handleCloseClick}>
              {closeIcon}
            </div>
          ) : (
            <CloseOutlined class={`${prefixCls.value}-close-icon`} onClick={handleCloseClick} />
          );
        }
        return null;
      };

      const tagStyle = {
        backgroundColor: color && !isPresetColor.value ? color : undefined,
      };

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
        <span class={tagClassName.value} style={tagStyle}>
          {kids}
          {renderCloseIcon()}
        </span>
      );

      return isNeedWave ? <Wave>{tagNode}</Wave> : tagNode;
    };
  },
});

Tag.CheckableTag = CheckableTag;

Tag.install = function (app: App) {
  app.component(Tag.name, Tag);
  app.component(CheckableTag.name, CheckableTag);
  return app;
};

export { CheckableTag };

export default Tag as typeof Tag &
  Plugin & {
    readonly CheckableTag: typeof CheckableTag;
  };
