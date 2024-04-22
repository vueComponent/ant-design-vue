import type { PropType, Ref, ComputedRef } from 'vue';
import {
  ref,
  shallowRef,
  provide,
  defineComponent,
  inject,
  watch,
  reactive,
  computed,
  watchEffect,
} from 'vue';
import { type ImagePreviewType, mergeDefaultValue } from './Image';
import Preview from './Preview';
import type { PreviewProps } from './Preview';
import useMergedState from '../../_util/hooks/useMergedState';

export interface PreviewGroupPreview
  extends Omit<ImagePreviewType, 'icons' | 'mask' | 'maskClassName'> {
  /**
   * If Preview the show img index
   * @default 0
   */
  current?: number;
}

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  preview?: boolean | PreviewGroupPreview;
}

interface PreviewUrl {
  url: string;
  canPreview: boolean;
}

export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: Ref<boolean | undefined>;
  previewUrls: ComputedRef<Map<number, string>>;
  setPreviewUrls: (id: number, url: string, canPreview?: boolean) => void;
  current: Ref<number>;
  setCurrent: (current: number) => void;
  setShowPreview: (isShowPreview: boolean) => void;
  setMousePosition: (mousePosition: null | { x: number; y: number }) => void;
  registerImage: (id: number, url: string, canPreview?: boolean) => () => void;
  rootClassName?: string;
}
const previewGroupContext = Symbol('previewGroupContext');
export const context = {
  provide: (val: GroupConsumerValue) => {
    provide(previewGroupContext, val);
  },
  inject: () => {
    return inject<GroupConsumerValue>(previewGroupContext, {
      isPreviewGroup: shallowRef(false),
      previewUrls: computed(() => new Map()),
      setPreviewUrls: () => {},
      current: ref(null),
      setCurrent: () => {},
      setShowPreview: () => {},
      setMousePosition: () => {},
      registerImage: null,
      rootClassName: '',
    });
  },
};

export const imageGroupProps = () => ({
  previewPrefixCls: String,
  preview: {
    type: [Boolean, Object] as PropType<boolean | ImagePreviewType>,
    default: true as boolean | ImagePreviewType,
  },
  icons: {
    type: Object as PropType<PreviewProps['icons']>,
    default: () => ({}),
  },
});

const Group = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'PreviewGroup',
  inheritAttrs: false,
  props: imageGroupProps(),
  setup(props, { slots }) {
    const preview = computed<PreviewGroupPreview>(() => {
      const defaultValues = {
        visible: undefined,
        onVisibleChange: () => {},
        getContainer: undefined,
        current: 0,
      };
      return typeof props.preview === 'object'
        ? mergeDefaultValue(props.preview, defaultValues)
        : defaultValues;
    });
    const previewUrls = reactive(new Map<number, PreviewUrl>());
    const current = ref<number>();

    const previewVisible = computed(() => preview.value.visible);
    const getPreviewContainer = computed(() => preview.value.getContainer);
    const onPreviewVisibleChange = (val, preval) => {
      preview.value.onVisibleChange?.(val, preval);
    };
    const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible.value, {
      value: previewVisible,
      onChange: onPreviewVisibleChange,
    });

    const mousePosition = ref<{ x: number; y: number }>(null);
    const isControlled = computed(() => previewVisible.value !== undefined);
    const previewUrlsKeys = computed(() => Array.from(previewUrls.keys()));
    const currentControlledKey = computed(() => previewUrlsKeys.value[preview.value.current]);
    const canPreviewUrls = computed(
      () =>
        new Map<number, string>(
          Array.from(previewUrls)
            .filter(([, { canPreview }]) => !!canPreview)
            .map(([id, { url }]) => [id, url]),
        ),
    );

    const setPreviewUrls = (id: number, url: string, canPreview = true) => {
      previewUrls.set(id, {
        url,
        canPreview,
      });
    };
    const setCurrent = (val: number) => {
      current.value = val;
    };
    const setMousePosition = (val: null | { x: number; y: number }) => {
      mousePosition.value = val;
    };

    const registerImage = (id: number, url: string, canPreview = true) => {
      const unRegister = () => {
        previewUrls.delete(id);
      };
      previewUrls.set(id, {
        url,
        canPreview,
      });
      return unRegister;
    };

    const onPreviewClose = (e: any) => {
      e?.stopPropagation();
      setShowPreview(false);
      setMousePosition(null);
    };

    watch(
      currentControlledKey,
      val => {
        setCurrent(val);
      },
      {
        immediate: true,
        flush: 'post',
      },
    );
    watchEffect(
      () => {
        if (isShowPreview.value && isControlled.value) {
          setCurrent(currentControlledKey.value);
        }
      },
      {
        flush: 'post',
      },
    );

    context.provide({
      isPreviewGroup: shallowRef(true),
      previewUrls: canPreviewUrls,
      setPreviewUrls,
      current,
      setCurrent,
      setShowPreview,
      setMousePosition,
      registerImage,
    });

    return () => {
      const { ...dialogProps } = preview.value;
      return (
        <>
          {slots.default && slots.default()}
          <Preview
            {...dialogProps}
            ria-hidden={!isShowPreview.value}
            visible={isShowPreview.value}
            prefixCls={props.previewPrefixCls}
            onClose={onPreviewClose}
            mousePosition={mousePosition.value}
            src={canPreviewUrls.value.get(current.value)}
            icons={props.icons}
            getContainer={getPreviewContainer.value}
          />
        </>
      );
    };
  },
});

export default Group;
