<docs>
---
order: 8
title:
  zh-CN: 自定义面板
  en-US: Custom panel
---
## zh-CN

通过 `panelRender` 自由控制面板的渲染。

## en-US

Rendering of the free control panel via `panelRender`.
</docs>

<template>
  <a-space direction="vertical">
    <a-row align="middle">
      <a-space>
        <span>Add title:</span>
        <a-col>
          <a-color-picker :panel-render="panelRenderWithAddTitle" />
        </a-col>
      </a-space>
    </a-row>
    <a-row align="middle">
      <a-space>
        <span>Horizontal layout:</span>
        <a-col>
          <a-color-picker
            :styles="{
              popupOverlayInner: {
                width: `${468 + 24}px`,
              },
            }"
            :presets="presets"
            :panel-render="panelRenderWithHorizontalLayout"
          />
        </a-col>
      </a-space>
    </a-row>
  </a-space>
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { Divider } from 'ant-design-vue';
const panelRenderWithAddTitle = panel => {
  return h(
    'div',
    {
      class: 'custom-panel',
    },
    [
      h(
        'div',
        {
          style: {
            fontSize: '12px',
            color: 'rgba(0, 0, 0, 0.88)',
            lineHeight: '20px',
            marginBottom: '8px',
          },
        },
        'Color Picker',
      ),
      h('div', {}, panel),
    ],
  );
};
const presets = [
  {
    label: 'Recommended',
    colors: [
      '#000000',
      '#000000E0',
      '#000000A6',
      '#00000073',
      '#00000040',
      '#00000026',
      '#0000001A',
      '#00000012',
      '#0000000A',
      '#00000005',
      '#F5222D',
      '#FA8C16',
      '#FADB14',
      '#8BBB11',
      '#52C41A',
      '#13A8A8',
      '#1677FF',
      '#2F54EB',
      '#722ED1',
      '#EB2F96',
      '#F5222D4D',
      '#FA8C164D',
      '#FADB144D',
      '#8BBB114D',
      '#52C41A4D',
      '#13A8A84D',
      '#1677FF4D',
      '#2F54EB4D',
      '#722ED14D',
      '#EB2F964D',
    ],
  },
  {
    label: 'Recent',
    colors: ['#F5222D4D', '#FA8C164D', '#FADB144D', '#8BBB114D', '#52C41A4D', '#13A8A84D'],
  },
];
const panelRenderWithHorizontalLayout = (_, { components: { Picker, Presets } }) => {
  return h(
    'div',
    {
      class: 'custom-panel',
      style: {
        display: 'flex',
        width: `468px`,
      },
    },
    [
      h(
        'div',
        {
          style: {
            flex: 1,
          },
        },
        h(Presets),
      ),
      h(Divider, {
        type: 'vertical',
        style: {
          height: 'auto',
        },
      }),
      h(
        'div',
        {
          style: {
            width: '234px',
          },
        },
        h(Picker),
      ),
    ],
  );
};
</script>
