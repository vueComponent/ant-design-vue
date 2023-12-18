import type { ExtractPropTypes, CSSProperties } from 'vue';
import { computed, defineComponent, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { getStyleStr, getPixelRatio, rotateWatermark, reRendering } from './utils';
import { arrayType, objectType, someType, withInstall } from '../_util/type';
import { useMutationObserver } from '../_util/hooks/_vueuse/useMutationObserver';
import { initDefaultProps } from '../_util/props-util';
import { useToken } from '../theme/internal';

/**
 * Base size of the canvas, 1 for parallel layout and 2 for alternate layout
 * Only alternate layout is currently supported
 */
const BaseSize = 2;
const FontGap = 3;

export interface WatermarkFontType {
  color?: string;
  fontSize?: number | string;
  fontWeight?: 'normal' | 'light' | 'weight' | number;
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
  fontFamily?: string;
}
export const watermarkProps = () => ({
  zIndex: Number,
  rotate: Number,
  width: Number,
  height: Number,
  image: String,
  content: someType<string | string[]>([String, Array]),
  font: objectType<WatermarkFontType>(),
  rootClassName: String,
  gap: arrayType<[number, number]>(),
  offset: arrayType<[number, number]>(),
});
export type WatermarkProps = Partial<ExtractPropTypes<ReturnType<typeof watermarkProps>>>;
const Watermark = defineComponent({
  name: 'AWatermark',
  inheritAttrs: false,
  props: initDefaultProps(watermarkProps(), {
    zIndex: 9,
    rotate: -22,
    font: {},
    gap: [100, 100],
  }),
  setup(props, { slots, attrs }) {
    const [, token] = useToken();
    const containerRef = shallowRef<HTMLDivElement>();
    const watermarkRef = shallowRef<HTMLDivElement>();
    const stopObservation = shallowRef(false);
    const gapX = computed(() => props.gap?.[0] ?? 100);
    const gapY = computed(() => props.gap?.[1] ?? 100);
    const gapXCenter = computed(() => gapX.value / 2);
    const gapYCenter = computed(() => gapY.value / 2);
    const offsetLeft = computed(() => props.offset?.[0] ?? gapXCenter.value);
    const offsetTop = computed(() => props.offset?.[1] ?? gapYCenter.value);
    const fontSize = computed(() => props.font?.fontSize ?? token.value.fontSizeLG);
    const fontWeight = computed(() => props.font?.fontWeight ?? 'normal');
    const fontStyle = computed(() => props.font?.fontStyle ?? 'normal');
    const fontFamily = computed(() => props.font?.fontFamily ?? 'sans-serif');
    const color = computed(() => props.font?.color ?? token.value.colorFill);
    const markStyle = computed(() => {
      const markStyle: CSSProperties = {
        zIndex: props.zIndex ?? 9,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundRepeat: 'repeat',
      };

      /** Calculate the style of the offset */
      let positionLeft = offsetLeft.value - gapXCenter.value;
      let positionTop = offsetTop.value - gapYCenter.value;
      if (positionLeft > 0) {
        markStyle.left = `${positionLeft}px`;
        markStyle.width = `calc(100% - ${positionLeft}px)`;
        positionLeft = 0;
      }
      if (positionTop > 0) {
        markStyle.top = `${positionTop}px`;
        markStyle.height = `calc(100% - ${positionTop}px)`;
        positionTop = 0;
      }
      markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

      return markStyle;
    });
    const destroyWatermark = () => {
      if (watermarkRef.value) {
        watermarkRef.value.remove();
        watermarkRef.value = undefined;
      }
    };

    const appendWatermark = (base64Url: string, markWidth: number) => {
      if (containerRef.value && watermarkRef.value) {
        stopObservation.value = true;
        watermarkRef.value.setAttribute(
          'style',
          getStyleStr({
            ...markStyle.value,
            backgroundImage: `url('${base64Url}')`,
            backgroundSize: `${(gapX.value + markWidth) * BaseSize}px`,
          }),
        );
        containerRef.value?.append(watermarkRef.value);
        // Delayed execution
        setTimeout(() => {
          stopObservation.value = false;
        });
      }
    };
    /**
     * Get the width and height of the watermark. The default values are as follows
     * Image: [120, 64]; Content: It's calculated by content;
     */
    const getMarkSize = (ctx: CanvasRenderingContext2D) => {
      let defaultWidth = 120;
      let defaultHeight = 64;
      const content = props.content;
      const image = props.image;
      const width = props.width;
      const height = props.height;
      if (!image && ctx.measureText) {
        ctx.font = `${Number(fontSize.value)}px ${fontFamily.value}`;
        const contents = Array.isArray(content) ? content : [content];
        const widths = contents.map(item => ctx.measureText(item!).width);
        defaultWidth = Math.ceil(Math.max(...widths));
        defaultHeight = Number(fontSize.value) * contents.length + (contents.length - 1) * FontGap;
      }
      return [width ?? defaultWidth, height ?? defaultHeight] as const;
    };
    const fillTexts = (
      ctx: CanvasRenderingContext2D,
      drawX: number,
      drawY: number,
      drawWidth: number,
      drawHeight: number,
    ) => {
      const ratio = getPixelRatio();
      const content = props.content;
      const mergedFontSize = Number(fontSize.value) * ratio;
      ctx.font = `${fontStyle.value} normal ${fontWeight.value} ${mergedFontSize}px/${drawHeight}px ${fontFamily.value}`;
      ctx.fillStyle = color.value;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.translate(drawWidth / 2, 0);
      const contents = Array.isArray(content) ? content : [content];
      contents?.forEach((item, index) => {
        ctx.fillText(item ?? '', drawX, drawY + index * (mergedFontSize + FontGap * ratio));
      });
    };
    const renderWatermark = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = props.image;
      const rotate = props.rotate ?? -22;

      if (ctx) {
        if (!watermarkRef.value) {
          watermarkRef.value = document.createElement('div');
        }

        const ratio = getPixelRatio();
        const [markWidth, markHeight] = getMarkSize(ctx);
        const canvasWidth = (gapX.value + markWidth) * ratio;
        const canvasHeight = (gapY.value + markHeight) * ratio;
        canvas.setAttribute('width', `${canvasWidth * BaseSize}px`);
        canvas.setAttribute('height', `${canvasHeight * BaseSize}px`);

        const drawX = (gapX.value * ratio) / 2;
        const drawY = (gapY.value * ratio) / 2;
        const drawWidth = markWidth * ratio;
        const drawHeight = markHeight * ratio;
        const rotateX = (drawWidth + gapX.value * ratio) / 2;
        const rotateY = (drawHeight + gapY.value * ratio) / 2;
        /** Alternate drawing parameters */
        const alternateDrawX = drawX + canvasWidth;
        const alternateDrawY = drawY + canvasHeight;
        const alternateRotateX = rotateX + canvasWidth;
        const alternateRotateY = rotateY + canvasHeight;

        ctx.save();
        rotateWatermark(ctx, rotateX, rotateY, rotate);

        if (image) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            /** Draw interleaved pictures after rotation */
            ctx.restore();
            rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
            ctx.drawImage(img, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
            appendWatermark(canvas.toDataURL(), markWidth);
          };
          img.crossOrigin = 'anonymous';
          img.referrerPolicy = 'no-referrer';
          img.src = image;
        } else {
          fillTexts(ctx, drawX, drawY, drawWidth, drawHeight);
          /** Fill the interleaved text after rotation */
          ctx.restore();
          rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
          fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
          appendWatermark(canvas.toDataURL(), markWidth);
        }
      }
    };
    onMounted(() => {
      renderWatermark();
    });
    watch(
      () => [props, token.value.colorFill, token.value.fontSizeLG],
      () => {
        renderWatermark();
      },
      {
        deep: true,
        flush: 'post',
      },
    );
    onBeforeUnmount(() => {
      destroyWatermark();
    });
    const onMutate = (mutations: MutationRecord[]) => {
      if (stopObservation.value) {
        return;
      }
      mutations.forEach(mutation => {
        if (reRendering(mutation, watermarkRef.value)) {
          destroyWatermark();
          renderWatermark();
        }
      });
    };
    useMutationObserver(containerRef, onMutate, {
      attributes: true,
      subtree: true,
      childList: true,
      attributeFilter: ['style', 'class'],
    });
    return () => {
      return (
        <div
          {...attrs}
          ref={containerRef}
          class={[attrs.class, props.rootClassName]}
          style={[{ position: 'relative' }, attrs.style as CSSProperties]}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});

export default withInstall(Watermark);
