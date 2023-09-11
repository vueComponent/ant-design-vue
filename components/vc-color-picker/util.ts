import type { Ref } from 'vue';
import type { ColorGenInput, HsbaColorType, TransformOffset } from './interface';

import { Color } from './color';

export const ColorPickerPrefixCls = 'rc-color-picker';

export const generateColor = (color: ColorGenInput): Color => {
  if (color instanceof Color) {
    return color;
  }
  return new Color(color);
};

export const defaultColor = generateColor('#1677ff');

export const calculateColor = (props: {
  offset: TransformOffset;
  containerRef: Ref<HTMLDivElement>;
  targetRef: Ref<{ transformDomRef: HTMLDivElement }>;
  color?: Color;
  type?: HsbaColorType;
}): Color => {
  const { offset, targetRef, containerRef, color, type } = props;
  const height = containerRef.value.offsetHeight;
  const width = containerRef.value.offsetWidth;
  const { width: targetWidth, height: targetHeight } =
    targetRef.value?.transformDomRef.getBoundingClientRect();

  const centerOffsetX = targetWidth / 2;
  const centerOffsetY = targetHeight / 2;
  const saturation = (offset.x + centerOffsetX) / width;
  const bright = 1 - (offset.y + centerOffsetY) / height;
  const hsb = color.toHsb();
  const alphaOffset = saturation;
  const hueOffset = ((offset.x + centerOffsetX) / width) * 360;

  if (type) {
    switch (type) {
      case 'hue':
        return generateColor({
          ...hsb,
          h: hueOffset <= 0 ? 0 : hueOffset,
        });
      case 'alpha':
        return generateColor({
          ...hsb,
          a: alphaOffset <= 0 ? 0 : alphaOffset,
        });
    }
  }

  return generateColor({
    h: hsb.h,
    s: saturation <= 0 ? 0 : saturation,
    b: bright >= 1 ? 1 : bright,
    a: hsb.a,
  });
};

export const calculateOffset = (
  containerRef: Ref<HTMLDivElement>,
  targetRef: Ref<{ transformDomRef: HTMLDivElement }>,
  color?: Ref<Color>,
  type?: HsbaColorType,
): TransformOffset => {
  const { width, height } = containerRef.value.getBoundingClientRect();
  const { width: targetWidth, height: targetHeight } =
    targetRef.value.transformDomRef?.getBoundingClientRect();
  const centerOffsetX = targetWidth / 2;
  const centerOffsetY = targetHeight / 2;
  const hsb = color.value.toHsb();
  // Exclusion of boundary cases
  if ((targetWidth === 0 && targetHeight === 0) || targetWidth !== targetHeight) {
    return;
  }

  if (type) {
    switch (type) {
      case 'hue':
        return {
          x: (hsb.h / 360) * width - centerOffsetX,
          y: -centerOffsetY / 3,
        };
      case 'alpha':
        return {
          x: (hsb.a / 1) * width - centerOffsetX,
          y: -centerOffsetY / 3,
        };
    }
  }
  return {
    x: hsb.s * width - centerOffsetX,
    y: (1 - hsb.b) * height - centerOffsetY,
  };
};
