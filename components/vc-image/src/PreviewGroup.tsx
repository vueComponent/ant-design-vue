import { ref, provide, defineComponent, inject } from 'vue';
import Preview from './Preview';

export interface GroupConsumerProps {
  previewPrefixCls?: string;
}
export interface GroupConsumerValue extends GroupConsumerProps {
  isPreviewGroup?: boolean | undefined;
  previewUrls: string[];
  setPreviewUrls: (previewUrls: string[]) => void;
  setCurrent: (current: string) => void;
  setShowPreview: (isShowPreview: boolean) => void;
  setMousePosition: (mousePosition: null | { x: number; y: number }) => void;
}
const previewGroupContext: string = 'previewGroupContext';
export const context = {
  provide: e => {
    provide(previewGroupContext, e);
  },
  inject: () => {
    return inject<GroupConsumerValue>(previewGroupContext, {
      isPreviewGroup: false,
      previewUrls: [],
      setPreviewUrls: () => {},
      setCurrent: () => {},
      setShowPreview: () => {},
      setMousePosition: () => {},
    });
  },
};

const Group = defineComponent({
  props: { previewPrefixCls: String },
  setup(props, { slots }) {
    const previewUrls = ref<string[]>([]);
    const current = ref();
    const isShowPreview = ref<boolean>(false);
    const mousePosition = ref<{ x: number; y: number }>(null);
    const onPreviewClose = (e: any) => {
      e?.stopPropagation();
      isShowPreview.value = false;
      mousePosition.value = null;
    };
    const previewGroupContext = ref<GroupConsumerValue>();

    const renderComponent = () => {
      return (
        <>
          {slots.default && slots.default()}
          <Preview
            ria-hidden={!isShowPreview.value}
            visible={isShowPreview.value}
            prefixCls={props.previewPrefixCls}
            onClose={onPreviewClose}
            mousePosition={mousePosition.value}
            src={current.value}
          />
        </>
      );
    };
    return {
      isPreviewGroup: true,
      previewGroupContext,
      isShowPreview,
      current,
      previewUrls,
      mousePosition,
      onPreviewClose,
      renderComponent,
    };
  },
  created() {
    context.provide(this);
  },
  methods: {
    setPreviewUrls(previewUrls: string[]) {
      this.previewUrls = previewUrls;
    },
    setCurrent(current: string) {
      this.current = current;
    },
    setMousePosition(mousePosition: null | { x: number; y: number }) {
      this.mousePosition = mousePosition;
    },
    setShowPreview(isShowPreview: boolean) {
      this.isShowPreview = isShowPreview;
    },
  },
  render() {
    return this.renderComponent();
  },
});

export default Group;
