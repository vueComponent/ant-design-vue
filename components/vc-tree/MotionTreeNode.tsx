import TreeNode from './TreeNode';
import type { FlattenNode } from './interface';
import type { TreeNodeRequiredProps } from './utils/treeUtil';
import { getTreeNodeProps } from './utils/treeUtil';
import { useInjectTreeContext } from './contextTypes';
import type { PropType } from 'vue';
import {
  computed,
  nextTick,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  Transition,
  watch,
} from 'vue';
import { treeNodeProps } from './props';
import { collapseMotion } from '../_util/transition';

export default defineComponent({
  name: 'MotionTreeNode',
  inheritAttrs: false,
  props: {
    ...treeNodeProps,
    active: Boolean,
    motion: Object,
    motionNodes: { type: Array as PropType<FlattenNode[]> },
    onMotionStart: Function,
    onMotionEnd: Function,
    motionType: String,
    treeNodeRequiredProps: { type: Object as PropType<TreeNodeRequiredProps> },
  },
  slots: ['title', 'icon', 'switcherIcon', 'checkable'],
  setup(props, { attrs, slots }) {
    const visible = ref(true);
    const context = useInjectTreeContext();
    const motionedRef = ref(false);
    const transitionClass = ref('');
    const transitionStyle = shallowRef({});
    const transitionProps = computed(() => {
      if (props.motion) {
        return props.motion;
      } else {
        return collapseMotion(transitionStyle, transitionClass);
      }
    });
    const onMotionEnd = (type?: 'appear' | 'leave') => {
      if (type === 'appear') {
        transitionProps.value?.onAfterAppear?.();
      } else if (type === 'leave') {
        transitionProps.value?.onAfterLeave?.();
      }
      if (!motionedRef.value) {
        props.onMotionEnd();
      }
      motionedRef.value = true;
    };

    watch(
      () => props.motionNodes,
      () => {
        if (props.motionNodes && props.motionType === 'hide' && visible.value) {
          nextTick(() => {
            visible.value = false;
          });
        }
      },
      { immediate: true, flush: 'post' },
    );
    onMounted(() => {
      props.motionNodes && props.onMotionStart();
    });
    onBeforeUnmount(() => {
      props.motionNodes && onMotionEnd();
    });

    return () => {
      const { motion, motionNodes, motionType, active, treeNodeRequiredProps, ...otherProps } =
        props;
      if (motionNodes) {
        return (
          <Transition
            {...transitionProps.value}
            appear={motionType === 'show'}
            onAfterAppear={() => onMotionEnd('appear')}
            onAfterLeave={() => onMotionEnd('leave')}
          >
            <div
              v-show={visible.value}
              class={[`${context.value.prefixCls}-treenode-motion`, transitionClass.value]}
              style={transitionStyle.value}
            >
              {motionNodes.map((treeNode: FlattenNode) => {
                const {
                  data: { ...restProps },
                  title,
                  key,
                  isStart,
                  isEnd,
                } = treeNode;
                delete restProps.children;

                const treeNodeProps = getTreeNodeProps(key, treeNodeRequiredProps);

                return (
                  <TreeNode
                    v-slots={slots}
                    {...restProps}
                    {...treeNodeProps}
                    title={title}
                    active={active}
                    data={treeNode.data}
                    key={key}
                    isStart={isStart}
                    isEnd={isEnd}
                  />
                );
              })}
            </div>
          </Transition>
        );
      }
      return (
        <TreeNode
          v-slots={slots}
          domRef={ref}
          class={attrs.class}
          style={attrs.style}
          {...otherProps}
          active={active}
        />
      );
    };
  },
});
