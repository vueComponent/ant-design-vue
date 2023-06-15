import TreeNode from './TreeNode';
import type { FlattenNode } from './interface';
import { useInjectTreeContext } from './contextTypes';
import type { PropType } from 'vue';
import {
  computed,
  nextTick,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  Transition,
  watch,
} from 'vue';
import { treeNodeProps } from './props';
import collapseMotion from '../_util/collapseMotion';

export default defineComponent({
  compatConfig: { MODE: 3 },
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
    // treeNodeRequiredProps: { type: Object as PropType<TreeNodeRequiredProps> },
  },
  setup(props, { attrs, slots }) {
    const visible = shallowRef(true);
    const context = useInjectTreeContext();
    const motionedRef = shallowRef(false);
    const transitionProps = computed(() => {
      if (props.motion) {
        return props.motion;
      } else {
        return collapseMotion();
      }
    });
    const onMotionEnd = (node?: HTMLDivElement, type?: 'appear' | 'leave') => {
      if (type === 'appear') {
        transitionProps.value?.onAfterEnter?.(node);
      } else if (type === 'leave') {
        transitionProps.value?.onAfterLeave?.(node);
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
      const { motion, motionNodes, motionType, active, eventKey, ...otherProps } = props;
      if (motionNodes) {
        return (
          <Transition
            {...transitionProps.value}
            appear={motionType === 'show'}
            onAfterAppear={(node: HTMLDivElement) => onMotionEnd(node, 'appear')}
            onAfterLeave={(node: HTMLDivElement) => onMotionEnd(node, 'leave')}
          >
            <div v-show={visible.value} class={`${context.value.prefixCls}-treenode-motion`}>
              {motionNodes.map((treeNode: FlattenNode) => {
                const {
                  data: { ...restProps },
                  title,
                  key,
                  isStart,
                  isEnd,
                } = treeNode;
                delete restProps.children;

                return (
                  <TreeNode
                    v-slots={slots}
                    {...restProps}
                    title={title}
                    active={active}
                    data={treeNode.data}
                    key={key}
                    eventKey={key}
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
          class={attrs.class}
          style={attrs.style}
          {...otherProps}
          active={active}
          eventKey={eventKey}
        />
      );
    };
  },
});
