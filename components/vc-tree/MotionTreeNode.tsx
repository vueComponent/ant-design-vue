import TreeNode from './TreeNode';
import { FlattenNode } from './interface';
import { getTreeNodeProps, TreeNodeRequiredProps } from './utils/treeUtil';
import { useInjectTreeContext } from './contextTypes';
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, Transition, watch } from 'vue';
import { treeNodeProps } from './props';

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
    const onMotionEnd = () => {
      if (!motionedRef.value) {
        props.onMotionEnd();
      }
      motionedRef.value = true;
    };

    watch(
      () => props.motionNodes,
      () => {
        if (props.motionNodes && props.motionType === 'hide' && visible.value) {
          visible.value = false;
        }
      },
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
            {...motion}
            appear={motionType === 'show'}
            onAfterAppear={onMotionEnd}
            onAfterLeave={onMotionEnd}
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
