<docs>
---
order: 0
title:
  zh-CN: 自定义配置
  en-US: Custom
---

## zh-CN

通过自定义参数配置预览水印效果。

## en-US

Preview the watermark effect by configuring custom parameters.

</docs>

<template>
  <div style="display: flex">
    <a-watermark v-bind="model">
      <a-typography>
        <a-typography-paragraph>
          The light-speed iteration of the digital world makes products more complex. However, human
          consciousness and attention resources are limited. Facing this design contradiction, the
          pursuit of natural interaction will be the consistent direction of Ant Design.
        </a-typography-paragraph>
        <a-typography-paragraph>
          Natural user cognition: According to cognitive psychology, about 80% of external
          information is obtained through visual channels. The most important visual elements in the
          interface design, including layout, colors, illustrations, icons, etc., should fully
          absorb the laws of nature, thereby reducing the user&apos;s cognitive cost and bringing
          authentic and smooth feelings. In some scenarios, opportunely adding other sensory
          channels such as hearing, touch can create a richer and more natural product experience.
        </a-typography-paragraph>
        <a-typography-paragraph>
          Natural user behavior: In the interaction with the system, the designer should fully
          understand the relationship between users, system roles, and task objectives, and also
          contextually organize system functions and services. At the same time, a series of methods
          such as behavior analysis, artificial intelligence and sensors could be applied to assist
          users to make effective decisions and reduce extra operations of users, to save
          users&apos; mental and physical resources and make human-computer interaction more
          natural.
        </a-typography-paragraph>
      </a-typography>
      <img
        style="z-index: 10; width: 100%; max-width: 800px; position: relative"
        src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ"
        alt="示例图片"
      />
    </a-watermark>
    <a-form
      style="
        width: 280px;
        flex-shrink: 0;
        border-left: 1px solid #eee;
        padding-left: 20px;
        margin-left: 20px;
      "
      layout="vertical"
      :model="model"
    >
      <a-form-item name="content" label="Content">
        <a-input v-model:value="model.content" />
      </a-form-item>
      <a-form-item name="font.fontSize" label="FontSize">
        <a-slider v-model:value="model.font.fontSize" :step="1" :min="0" :max="100" />
      </a-form-item>
      <a-form-item name="zIndex" label="zIndex">
        <a-slider v-model:value="model.zIndex" :step="1" :min="0" :max="100" />
      </a-form-item>
      <a-form-item name="rotate" label="Rotate">
        <a-slider v-model:value="model.rotate" :step="1" :min="-180" :max="180" />
      </a-form-item>
      <a-form-item label="Gap" style="margin-bottom: 0">
        <a-space style="display: flex" align="baseline">
          <a-form-item :name="['gap', 0]">
            <a-input-number v-model:value="model.gap[0]" placeholder="gapX" />
          </a-form-item>
          <a-form-item :name="['gap', 1]">
            <a-input-number v-model:value="model.gap[1]" placeholder="gapY" />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item label="Offset" style="margin-bottom: 0">
        <a-space style="display: flex" align="baseline">
          <a-form-item :name="['offset', 0]">
            <a-input-number v-model:value="model.offset[0]" placeholder="offsetLeft" />
          </a-form-item>
          <a-form-item :name="['offset', 1]">
            <a-input-number v-model:value="model.offset[1]" placeholder="offsetTop" />
          </a-form-item>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
const model = reactive({
  content: 'Ant Design Vue',
  font: {
    fontSize: 16,
  },
  zIndex: 11,
  rotate: -22,
  gap: [100, 100] as [number, number],
  offset: [],
});
</script>
