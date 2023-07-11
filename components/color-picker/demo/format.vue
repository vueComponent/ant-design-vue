<docs>
---
order: 5
title:
  zh-CN: 编码格式
  en-US: Encoding formats
---

## zh-CN

编码格式，支持`HEX`、`HSB`、`RGB`。

## en-US

Encoding formats, support `HEX`, `HSB`, `RGB`.

</docs>

<template>
  <a-space direction="vertical" size="middle">
    <a-row align="middle">
      <a-space>
        <a-col>
          <a-color-picker
            v-model:value="colorHex"
            :format="formatHex"
            @formatChange="handleFormatChange"
          />
        </a-col>
        <a-col>
          HEX:
          <span>{{ hexString }}</span>
        </a-col>
      </a-space>
    </a-row>
    <a-row align="middle">
      <a-space>
        <a-col>
          <a-color-picker
            v-model="colorHsb"
            :format="formatHsb"
            @formatChange="handleFormatChange"
          />
        </a-col>
        <a-col>
          HSB:
          <span>{{ hsbString }}</span>
        </a-col>
      </a-space>
    </a-row>
    <a-row align="middle">
      <a-space>
        <a-col>
          <a-color-picker
            v-model:value="colorRgb"
            :format="formatRgb"
            @formatChange="handleFormatChange"
          />
        </a-col>
        <a-col>
          RGB:
          <span>{{ rgbString }}</span>
        </a-col>
      </a-space>
    </a-row>
  </a-space>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Color, ColorPickerProps } from 'ant-design-vue/es/color-picker';

const colorHex = ref<Color | string>('#1677ff');
const colorHsb = ref<Color | string>('hsb(215, 91%, 100%)');
const colorRgb = ref<Color | string>('rgb(22, 119, 255)');
const formatHex = ref<ColorPickerProps['format']>('hex');
const formatHsb = ref<ColorPickerProps['format']>('hsb');
const formatRgb = ref<ColorPickerProps['format']>('rgb');

const hexString = computed(() =>
  typeof colorHex.value === 'string' ? colorHex.value : colorHex.value.toHexString(),
);

const hsbString = computed(() =>
  typeof colorHsb.value === 'string' ? colorHsb : colorHsb.value.toHsbString(),
);

const rgbString = computed(() =>
  typeof colorRgb.value === 'string' ? colorRgb : colorRgb.value.toRgbString(),
);

const handleFormatChange = (format: ColorPickerProps['format']) => {
  formatHex.value = format;
  formatHsb.value = format;
  formatRgb.value = format;
};
</script>
