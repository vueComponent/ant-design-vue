---
category: Components
cols: 1
type: Other
title: App
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*TBTSR4PyVmkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JGb3RIzyOCkAAAAAAAAAAAAADrJ8AQ/original
tag: New
---

Application wrapper for some global usages.

## When To Use

- Provide reset styles based on `.ant-app` element.
- You could use static methods of `message/notification/Modal` form `useApp` without writing `contextHolder` manually.

## API

### App

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| message | Global config for Message | [MessageConfig](/components/message/#messageconfig) | - | 4.x |
| notification | Global config for Notification | [NotificationConfig](/components/notification/#notificationconfig) | - | 4.x |

## How to use

### Basic usage

App provides upstream and downstream method calls through `provide/inject`, because useApp needs to be used as a subcomponent, we recommend encapsulating App at the top level in the application.

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

Note: App.useApp must be available under App.

#### Embedded usage scenarios (if not necessary, try not to do nesting)

```html
<a-app>
  <a-space>
    ...
    <a-app>...</a-app>
  </a-space>
</a-app>
```

#### Sequence with ConfigProvider

The App component can only use the token in the `ConfigProvider`, if you need to use the Token, the ConfigProvider and the App component must appear in pairs.

```html
<a-config-provider theme="{{ ... }}">
  <a-app>...</a-app>
</a-config-provider>
```

#### Global scene (pinia scene)

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
