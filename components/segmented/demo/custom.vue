<docs>
---
order: 5
title:
  zh-CN: 自定义渲染
  en-US: Custom
---

## zh-CN

自定义渲染每一个 Segmented Item。

## en-US
Custom each Segmented Item.
</docs>
<template>
  <a-segmented :options="data">
    <template #title="index">
      <template v-if="index === 0">
        <div style="padding: 4px 4px">
          <a-avatar src="https://joeschmoe.io/api/v1/random" />
          <div>User 1</div>
        </div>
      </template>
      <template v-if="index === 1">
        <div style="padding: 4px 4px">
          <a-avatar style="background-color: #f56a00">K</a-avatar>
          <div>User 2</div>
        </div>
      </template>
      <template v-if="index === 2">
        <div style="padding: 4px 4px">
          <a-avatar style="background-color: #1890ff">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <div>User 3</div>
        </div>
      </template>
    </template>
  </a-segmented>
  <br />
  <br />
  <a-segmented :options="options2">
    <template #title="index">
      <template v-if="index === 0">
        <div style="padding: 4px 4px">
          <div>Spring</div>
          <div>Jan-Mar</div>
        </div>
      </template>
      <template v-if="index === 1">
        <div style="padding: 4px 4px">
          <div>Summer</div>
          <div>Apr-Jun</div>
        </div>
      </template>
      <template v-if="index === 2">
        <div style="padding: 4px 4px">
          <div>Autumn</div>
          <div>Jul-Sept</div>
        </div>
      </template>
      <template v-if="index === 3">
        <div style="padding: 4px 4px">
          <div>Winter</div>
          <div>Oct-Dec</div>
        </div>
      </template>
    </template>
  </a-segmented>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import ASegmented from 'ant-design-vue/es/segmented/src/segmented';

export default defineComponent({
  components: { ASegmented, UserOutlined },
  setup() {
    const data = reactive([{ value: 'user1' }, { value: 'user2' }, { value: 'user3' }]);
    const options2 = reactive([
      { value: 'spring' },
      { value: 'summer' },
      { value: 'autumn' },
      { value: 'winter' },
    ]);
    return {
      data,
      options2,
    };
  },
});
</script>
