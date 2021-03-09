import type { Ref } from 'vue';
import { ref, provide, defineComponent, inject, reactive } from 'vue';
import Preview from './Preview';

export interface GroupConsumerProps {
  previewPrefixCls?: string;
}
export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: Ref<boolean | undefined>;
  previewUrls: Record<number, string>;
  setPreviewUrls: (previewUrls: Record<number, string>) => void;
  current: Ref<number>;
  setCurrent: (current: number) => void;
  setShowPreview: (isShowPreview: boolean) => void;
  setMousePosition: (mousePosition: null | { x: number; y: number }) => void;
  registerImage: (id: number, url: string) => () => void;
}
const previewGroupContext = Symbol('previewGroupContext');
export const context = {
  provide: (val: GroupConsumerValue) => {
    provide(previewGroupContext, val);
  },
  inject: () => {
    return inject<GroupConsumerValue>(previewGroupContext, {
      isPreviewGroup: ref(false),
      previewUrls: reactive({}),
      setPreviewUrls: () => {},
      current: ref(null),
      setCurrent: () => {},
      setShowPreview: () => {},
      setMousePosition: () => {},
      registerImage: null,
    });
  },
};

const Group = defineComponent({
  name: 'PreviewGroup',
  inheritAttrs: false,
  props: { previewPrefixCls: String },
  setup(props, { slots }) {
    const previewUrls = reactive<Record<number, string>>({});
    const current = ref<number>();
    const isShowPreview = ref<boolean>(false);
    const mousePosition = ref<{ x: number; y: number }>(null);
    const setPreviewUrls = (val: Record<number, string>) => {
      Object.assign(previewUrls, val);
    };
    const setCurrent = (val: number) => {
      current.value = val;
    };
    const setMousePosition = (val: null | { x: number; y: number }) => {
      mousePosition.value = val;
    };
    const setShowPreview = (val: boolean) => {
      isShowPreview.value = val;
    };
    const registerImage = (id: number, url: string) => {
      previewUrls[id] = url;

      return () => {
        delete previewUrls[id];
      };
    };
    const onPreviewClose = (e: any) => {
      e?.stopPropagation();
      isShowPreview.value = false;
      mousePosition.value = null;
    };
    context.provide({
      isPreviewGroup: ref(true),
      previewUrls,
      setPreviewUrls,
      current,
      setCurrent,
      setShowPreview,
      setMousePosition,
      registerImage,
    });
    return () => {
      return (
        <>
          {slots.default && slots.default()}
          <Preview
            ria-hidden={!isShowPreview.value}
            visible={isShowPreview.value}
            prefixCls={props.previewPrefixCls}
            onClose={onPreviewClose}
            mousePosition={mousePosition.value}
            src={previewUrls[current.value]}
          />
        </>
      );
    };
  },
});

export default Group;
