import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  Text,
  VNode,
  watch,
} from 'vue';
import Wave from '../_util/wave';
import buttonTypes from './buttonTypes';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { getPropsSlot } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
const props = buttonTypes();
export default defineComponent({
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props,
  slots: ['icon'],
  emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, autoInsertSpaceInButton } = useConfigInject('btn', props);

    const buttonNodeRef = ref<HTMLElement>(null);
    let delayTimeout = undefined;
    const iconCom = ref<VNode>(null);
    const children = ref<VNode[]>(null);

    const sLoading = ref(props.loading);
    const hasTwoCNChar = ref(false);

    const getClasses = () => {
      const { type, shape, size, ghost, block } = props;
      const autoInsertSpace = autoInsertSpaceInButton.value !== false;

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
        [`${prefixCls.value}-icon-only`]: children.value?.length === 0 && iconType,
        [`${prefixCls.value}-loading`]: sLoading.value,
        [`${prefixCls.value}-background-ghost`]: ghost || type === 'ghost',
        [`${prefixCls.value}-two-chinese-chars`]: hasTwoCNChar.value && autoInsertSpace,
        [`${prefixCls.value}-block`]: block,
      };
    };

    const fixTwoCNChar = () => {
      // Fix for HOC usage like <FormatMessage />
      const node = buttonNodeRef.value!;
      if (!node) {
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
      if (sLoading.value) {
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

    const isNeedInserted = () => {
      const { type } = props;
      return children.value?.length === 1 && !iconCom.value && type !== 'link';
    };

    watch(
      () => props.loading,
      (val, preVal) => {
        if (preVal && typeof preVal !== 'boolean') {
          clearTimeout(delayTimeout);
        }
        if (val && typeof val !== 'boolean' && val.delay) {
          delayTimeout = setTimeout(() => {
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
      delayTimeout && clearTimeout(delayTimeout);
    });

    return () => {
      iconCom.value = getPropsSlot(slots, props, 'icon');
      children.value = getPropsSlot(slots, props);

      const { type, htmlType, disabled, href, title } = props;
      const classes = getClasses();

      const buttonProps = {
        ...attrs,
        title,
        disabled,
        class: classes,
        onClick: handleClick,
      };
      const iconNode = sLoading.value ? <LoadingOutlined /> : iconCom.value;

      const autoInsertSpace = autoInsertSpaceInButton.value !== false;
      const kids = children.value?.map(child =>
        insertSpace(child, isNeedInserted() && autoInsertSpace),
      );

      if (href !== undefined) {
        return (
          <a {...buttonProps} href={href} ref={buttonNodeRef}>
            {iconNode}
            {kids}
          </a>
        );
      }

      const buttonNode = (
        <button {...buttonProps} ref={buttonNodeRef} type={htmlType || 'button'}>
          {iconNode}
          {kids}
        </button>
      );

      if (type === 'link') {
        return buttonNode;
      }

      return <Wave ref="wave">{buttonNode}</Wave>;
    };
  },
});
