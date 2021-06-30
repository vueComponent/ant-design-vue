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
import type { VNode, Ref } from 'vue';

type Loading = boolean | number;

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
    const delayTimeoutRef = ref(undefined);
    let isNeedInserted = false;

    const innerLoading: Ref<Loading> = ref(false);
    const hasTwoCNChar = ref(false);

    const autoInsertSpace = computed(() => autoInsertSpaceInButton.value !== false);

    // =============== Update Loading ===============
    const loadingOrDelay = computed(() =>
      typeof props.loading === 'object' && props.loading.delay
        ? props.loading.delay || true
        : !!props.loading,
    );

    watch(
      loadingOrDelay,
      val => {
        clearTimeout(delayTimeoutRef.value);
        if (typeof loadingOrDelay.value === 'number') {
          delayTimeoutRef.value = window.setTimeout(() => {
            innerLoading.value = val;
          }, loadingOrDelay.value);
        } else {
          innerLoading.value = val;
        }
      },
      {
        immediate: true,
      },
    );

    const classes = computed(() => {
      const { type, shape, size, ghost, block, danger } = props;
      const pre = prefixCls.value;
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
      return {
        [`${pre}`]: true,
        [`${pre}-${type}`]: type,
        [`${pre}-${shape}`]: shape,
        [`${pre}-${sizeCls}`]: sizeCls,
        [`${pre}-loading`]: innerLoading.value,
        [`${pre}-background-ghost`]: ghost && !isUnborderedButtonType(type),
        [`${pre}-two-chinese-chars`]: hasTwoCNChar.value && autoInsertSpace.value,
        [`${pre}-block`]: block,
        [`${pre}-dangerous`]: !!danger,
        [`${pre}-rtl`]: direction.value === 'rtl',
      };
    });

    const fixTwoCNChar = () => {
      // Fix for HOC usage like <FormatMessage />
      const node = buttonNodeRef.value!;
      if (!node || autoInsertSpaceInButton.value === false) {
        return;
      }
      const buttonText = node.textContent;

      if (isNeedInserted && isTwoCNChar(buttonText)) {
        if (!hasTwoCNChar.value) {
          hasTwoCNChar.value = true;
        }
      } else if (hasTwoCNChar.value) {
        hasTwoCNChar.value = false;
      }
    };
    const handleClick = (event: Event) => {
      // https://github.com/ant-design/ant-design/issues/30207
      if (innerLoading.value || props.disabled) {
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

    watchEffect(() => {
      devWarning(
        !(props.ghost && isUnborderedButtonType(props.type)),
        'Button',
        "`link` or `text` button can't be a `ghost` button.",
      );
    });

    onMounted(fixTwoCNChar);
    onUpdated(fixTwoCNChar);

    onBeforeUnmount(() => {
      delayTimeoutRef.value && clearTimeout(delayTimeoutRef.value);
    });

    return () => {
      const children = flattenChildren(getPropsSlot(slots, props));

      const icon = getPropsSlot(slots, props, 'icon');

      isNeedInserted = children.length === 1 && !icon && !isUnborderedButtonType(props.type);

      const { type, htmlType, disabled, href, title, target } = props;

      const iconType = innerLoading.value ? 'loading' : icon;
      const buttonProps = {
        ...attrs,
        title,
        disabled,
        class: [
          classes.value,
          attrs.class,
          { [`${prefixCls.value}-icon-only`]: children.length === 0 && !!iconType },
        ],
        onClick: handleClick,
      };

      const iconNode = innerLoading.value ? <LoadingOutlined /> : icon;

      const kids = children.map(child =>
        insertSpace(child, isNeedInserted && autoInsertSpace.value),
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
