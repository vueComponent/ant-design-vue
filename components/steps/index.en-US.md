---
category: Components
type: Navigation
cols: 1
title: Steps
cover: https://gw.alipayobjects.com/zos/antfincdn/UZYqMizXHaj/Steps.svg
---

`Steps` is a navigation bar that guides users through the steps of a task.

## API

```jsx
<a-steps>
  <a-step title="first step" />
  <a-step title="second step" />
  <a-step title="third step" />
</a-steps>
```

### Steps

The whole of the step bar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| current(v-model) | to set the current step, counting from 0. You can overwrite this state by using `status` of `Step`, support v-model after 1.5.0 | number | 0 |  |
| type | Type of steps, can be set to one of the following values: `default`, `navigation` | string | `default` | 1.5.0 |
| direction | to specify the direction of the step bar, `horizontal` and `vertical` are currently supported | string | `horizontal` |  |
| labelPlacement | support vertial title and description | string | `horizontal` |  |
| progressDot | Steps with progress dot style, customize the progress dot by setting a scoped slot. labelPlacement will be `vertical` | Boolean or v-slot:progressDot="{index, status, title, description, prefixCls, iconDot}" | false |  |
| percent | Progress circle percentage of current step in `process` status (only works on basic Steps) | number | - | 3.0 |
| responsive | change to vertical direction when screen width smaller than `532px` | boolean | true | 3.0 |
| size | to specify the size of the step bar, `default` and `small` are currently supported | string | `default` |  |
| status | to specify the status of current step, can be set to one of the following values: `wait` `process` `finish` `error` | string | `process` |  |
| initial | set the initial step, counting from 0 | number | 0 |  |

#### Steps Events

| Events Name | Description                  | Arguments         | Version |
| ----------- | ---------------------------- | ----------------- | ------- |
| change      | Trigger when Step is changed | (current) => void | -       | 1.5.0 |

### Steps.Step

A single step in the step bar.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| description | description of the step, optional property | string\|slot | - |  |
| icon | icon of the step, optional property | string\|slot | - |  |
| status | to specify the status. It will be automatically set by `current` of `Steps` if not configured. Optional values are: `wait` `process` `finish` `error` | string | `wait` |  |
| title | title of the step | string\|slot | - |  |
| subTitle | Subtitle of the step | string\|slot | - | 1.5.0 |
| disabled | Disable click | boolean | false | 1.5.0 |
