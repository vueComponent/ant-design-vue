
## Usage

This component provides a configuration to all Vue components underneath itself via the [provide / inject](https://vuejs.org/v2/api/#provide-inject), In the render tree all components will have access to the provided config.

````html
<a-config-provider :getPopupContainer="getPopupContainer">
  <app />
</a-config-provider>
````

## API

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| getPopupContainer | to set the container of the popup element. The default is to create a `div` element in `body`. | Function(triggerNode) | `() => document.body` |
