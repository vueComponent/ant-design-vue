<docs>
---
order: 6.1
title:
  zh-CN: 自定义表单控件
  en-US: Customized Form Controls
---

## zh-CN

自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件注入 `useInjectFormItemContext` 并调用相应方法。

## en-US

Customized or third-party form controls can be used in Form, too.

Controls must injects `useInjectFormItemContext` and calls the corresponding method.
</docs>
<template>
  <a-form name="customized_form_controls" layout="inline" :model="formState" @finish="onFinish">
    <a-form-item name="price" label="Price" :rules="[{ validator: checkPrice }]">
      <price-input v-model:value="formState.price" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
// sorceCode https://github.com/vueComponent/ant-design-vue/blob/cb3c002e17f0f4f5b3e8d01846069da0e2645aff/components/form/demo/price-input.vue
import PriceInput from './price-input.vue';
import type { Currency } from './price-input.vue';

export default defineComponent({
  components: {
    PriceInput,
  },
  setup() {
    const formState = reactive({
      price: {
        number: 0,
        currency: 'rmb' as Currency,
      },
    });
    const onFinish = (values: any) => {
      console.log('Received values from form: ', values);
    };
    const checkPrice = (_: any, value: { number: number }) => {
      if (value.number > 0) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Price must be greater than zero!'));
    };
    return { onFinish, formState, checkPrice };
  },
});
</script>
