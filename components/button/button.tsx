import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  Text,
  watch,
  watchEffect,
} from 'vue';
import Wave from '../_util/wave';
import buttonTypes from './buttonTypes';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { flattenChildren, getPropsSlot } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';

import type { ButtonType } from './buttonTypes';
import type { VNode } from 'vue';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
const props = buttonTypes();

function isUnborderedButtonType(type: ButtonType | undefined) {
  return type === 'text' || type === 'link';
}

export default defineComponent({
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props,
  slots: ['icon'],
  emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, autoInsertSpaceInButton, direction } = useConfigInject('btn', props);

    const buttonNodeRef = ref<HTMLElement>(null);
    const delayTimeout = ref(undefined);
    const iconCom = ref<VNode>(null);
    const children = ref<VNode[]>([]);

    const sLoading = ref(props.loading);
    const hasTwoCNChar = ref(false);

    const autoInsertSpace = computed(() => autoInsertSpaceInButton.value !== false);

    const getClasses = () => {
      const { type, shape, size, ghost, block, danger } = props;

      // large => lg
      // small => sm
      let sizeCls = '';
      switch (size) {
        case 'large':
          sizeCls = 'lg';
          break;
        case 'small':
          sizeCls = 'sm';
          break;
        default:
          break;
      }
      const iconType = sLoading.value ? 'loading' : iconCom.value;
      return {
        [attrs.class as string]: attrs.class,
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-${type}`]: type,
        [`${prefixCls.value}-${shape}`]: shape,
        [`${prefixCls.value}-${sizeCls}`]: sizeCls,
        [`${prefixCls.value}-icon-only`]: children.value.length === 0 && !!iconType,
        [`${prefixCls.value}-loading`]: sLoading.value,
        [`${prefixCls.value}-background-ghost`]: ghost && !isUnborderedButtonType(type),
        [`${prefixCls.value}-two-chinese-chars`]: hasTwoCNChar.value && autoInsertSpace.value,
        [`${prefixCls.value}-block`]: block,
        [`${prefixCls.value}-dangerous`]: !!danger,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      };
    };

    const fixTwoCNChar = () => {
      // Fix for HOC usage like <FormatMessage />
      const node = buttonNodeRef.value!;
      if (!node || autoInsertSpaceInButton.value === false) {
        return;
      }
      const buttonText = node.textContent;

      if (isNeedInserted() && isTwoCNChar(buttonText)) {
        if (!hasTwoCNChar.value) {
          hasTwoCNChar.value = true;
        }
      } else if (hasTwoCNChar.value) {
        hasTwoCNChar.value = false;
      }
    };
    const handleClick = (event: Event) => {
      // https://github.com/ant-design/ant-design/issues/30207
      if (sLoading.value || props.disabled) {
        event.preventDefault();
        return;
      }
      emit('click', event);
    };

    const insertSpace = (child: VNode, needInserted: boolean) => {
      const SPACE = needInserted ? ' ' : '';
      if (child.type === Text) {
        let text = (child.children as string).trim();
        if (isTwoCNChar(text)) {
          text = text.split('').join(SPACE);
        }
        return <span>{text}</span>;
      }
      return child;
    };

    const isNeedInserted = () =>
      children.value.length === 1 && !iconCom.value && !isUnborderedButtonType(props.type);

    watchEffect(() => {
      devWarning(
        !(props.ghost && isUnborderedButtonType(props.type)),
        'Button',
        "`link` or `text` button can't be a `ghost` button.",
      );
    });

    watch(
      () => props.loading,
      (val, preVal) => {
        if (preVal && typeof preVal !== 'boolean') {
          clearTimeout(delayTimeout.value);
        }
        if (val && typeof val !== 'boolean' && val.delay) {
          delayTimeout.value = setTimeout(() => {
            sLoading.value = !!val;
          }, val.delay);
        } else {
          sLoading.value = !!val;
        }
      },
      {
        immediate: true,
      },
    );

    onMounted(fixTwoCNChar);
    onUpdated(fixTwoCNChar);

    onBeforeUnmount(() => {
      delayTimeout.value && clearTimeout(delayTimeout.value);
    });

    return () => {
      iconCom.value = getPropsSlot(slots, props, 'icon');
      children.value = flattenChildren(getPropsSlot(slots, props));

      const { type, htmlType, disabled, href, title, target } = props;
      const classes = getClasses();

      const buttonProps = {
        ...attrs,
        title,
        disabled,
        class: classes,
        onClick: handleClick,
      };
      const iconNode = sLoading.value ? <LoadingOutlined /> : iconCom.value;

      const kids = children.value.map((child) =>
        insertSpace(child, isNeedInserted() && autoInsertSpace.value),
      );

      if (href !== undefined) {
        return (
          <a {...buttonProps} href={href} target={target} ref={buttonNodeRef}>
            {iconNode}
            {kids}
          </a>
        );
      }

      const buttonNode = (
        <button {...buttonProps} ref={buttonNodeRef} type={htmlType}>
          {iconNode}
          {kids}
        </button>
      );

      if (isUnborderedButtonType(type)) {
        return buttonNode;
      }

      return <Wave ref="wave">{buttonNode}</Wave>;
    };
  },
});
