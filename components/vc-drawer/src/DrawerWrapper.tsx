import Child from './DrawerChild';
import { initDefaultProps } from '../../_util/props-util';
import { Teleport, defineComponent, ref, watch } from 'vue';
import { DrawerProps } from './IDrawerPropTypes';
import type { IDrawerProps } from './IDrawerPropTypes';

const DrawerWrapper = defineComponent({
  inheritAttrs: false,
  props: initDefaultProps(DrawerProps, {
    prefixCls: 'drawer',
    placement: 'left',
    getContainer: 'body',
    level: 'all',
    duration: '.3s',
    ease: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    afterVisibleChange: () => {},
    showMask: true,
    maskClosable: true,
    maskStyle: {},
    wrapperClassName: null,
    keyboard: true,
    forceRender: false,
    autoFocus: true,
  }),
  emits: ['handleClick', 'close'],

  setup(props, { emit, expose, slots }) {
    const dom = ref<HTMLElement>(null);

    const container = ref(props.getContainer || null);

    const open = ref<boolean>(props.open);

    const $forceRender = ref<boolean>(props.forceRender);

    watch(
      () => props.open,
      val => {
        if (!dom.value) {
          $forceRender.value = true;
          open.value = false;
          setTimeout(() => {
            open.value = true;
          });
        } else {
          open.value = val;
        }
      },
    );

    const getDerivedStateFromProps = (
      props: IDrawerProps,
      { prevProps }: { prevProps: IDrawerProps },
    ) => {
      const newState: {
        open?: boolean;
        prevProps: IDrawerProps;
      } = {
        prevProps: props,
      };
      if (typeof prevProps !== 'undefined' && props.open !== prevProps.open) {
        newState.open = props.open;
      }
      return newState;
    };

    expose({ getDerivedStateFromProps });

    const onHandleClick = (e: MouseEvent | KeyboardEvent) => {
      emit('handleClick', e);
    };

    const onClose = (e: MouseEvent | KeyboardEvent) => {
      emit('close', e);
    };

    return () => {
      const { afterVisibleChange, getContainer, wrapperClassName, forceRender, ...otherProps } =
        props;

      let portal = null;
      if (!getContainer) {
        return (
          <div class={wrapperClassName || null} ref={dom}>
            <Child
              v-slots={{ children: slots.default }}
              {...otherProps}
              open={open.value}
              getContainer={() => dom.value}
              onClose={onClose}
              onHandleClick={onHandleClick}
            ></Child>
          </div>
        );
      }
      if ($forceRender.value || open.value || dom.value) {
        portal = (
          <Teleport to={container.value}>
            <div class={wrapperClassName || null} ref={dom}>
              <Child
                v-slots={{ children: slots.default }}
                {...props}
                open={open.value}
                getContainer={() => dom.value}
                afterVisibleChange={afterVisibleChange}
                onClose={onClose}
                onHandleClick={onHandleClick}
              />
            </div>
          </Teleport>
        );
      }
      return portal;
    };
  },
});

export default DrawerWrapper;
