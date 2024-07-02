---
category: Components
subtitle: 包裹组件
cols: 1
type: 其它
title: App
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*TBTSR4PyVmkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JGb3RIzyOCkAAAAAAAAAAAAADrJ8AQ/original
tag: New
---

新的包裹组件，提供重置样式和提供消费上下文的默认环境。

## 何时使用

- 提供可消费 provide/inject 的 `message.xxx`、`Modal.xxx`、`notification.xxx` 的静态方法，可以简化 useMessage 等方法需要手动植入 `contextHolder` 的问题。
- 提供基于 `.ant-app` 的默认重置样式，解决原生元素没有 antd 规范样式的问题。

## API

### App

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| message | App 内 Message 的全局配置 | [MessageConfig](/components/message-cn/#messageconfig) | - | 4.x |
| notification | App 内 Notification 的全局配置 | [NotificationConfig](/components/notification-cn/#notificationconfig) | - | 4.x |

## 如何使用

### 基础用法

App 组件通过 `provide/inject` 提供上下文方法调用，因而 useApp 需要作为子组件才能使用，我们推荐在应用中顶层包裹 App。

```html
/*myPage.vue*/
<template>
  <a-space>
    <a-button type="primary" @click="showMessage">Open message</a-button>
    <a-button type="primary" @click="showModal">Open modal</a-button>
    <a-button type="primary" @click="showNotification">Open notification</a-button>
  </a-space>
</template>

<script setup lang="ts">
  import { App } from 'ant-design-vue';

  const { message, modal, notification } = App.useApp();

  const showMessage = () => {
    message.success('Success!');
  };

  const showModal = () => {
    modal.warning({
      title: 'This is a warning message',
      content: 'some messages...some messages...',
    });
  };

  const showNotification = () => {
    notification.info({
      message: `Notification topLeft`,
      description: 'Hello, Ant Design Vue!!',
      placement: 'topLeft',
    });
  };
</script>
```

注意：App.useApp 必须在 App 之下方可使用。

#### 内嵌使用场景（如无必要，尽量不做嵌套）

```html
<a-app>
  <a-space>
    ...
    <a-app>...</a-app>
  </a-space>
</a-app>
```

#### 与 ConfigProvider 先后顺序

App 组件只能在 `ConfigProvider` 之下才能使用 Design Token， 如果需要使用其样式重置能力，则 ConfigProvider 与 App 组件必须成对出现。

```html
<a-config-provider theme="{{ ... }}">
  <a-app>...</a-app>
</a-config-provider>
```

#### 全局场景 (pinia 场景)

```ts
import { App } from 'ant-design-vue';
import type { MessageInstance } from 'ant-design-vue/es/message/interface';
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm';
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface';

export const useGlobalStore = defineStore('global', () => {
  const message: MessageInstance = ref();
  const notification: NotificationInstance = ref();
  const modal: Omit<ModalStaticFunctions, 'warn'> = ref();
  (() => {
    const staticFunction = App.useApp();
    message.value = staticFunction.message;
    modal.value = staticFunction.modal;
    notification.value = staticFunction.notification;
  })();

  return { message, notification, modal };
});
```

```html
// sub page
<template>
  <a-space>
    <a-button type="primary" @click="showMessage">Open message</a-button>
  </a-space>
</template>

<script setup>
  import { useGlobalStore } from '@/stores/global';
  const global = useGlobalStore();
  const showMessage = () => {
    global.message.success('Success!');
  };
</script>
```
