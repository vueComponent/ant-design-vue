## API

> The distance to the bottom is set to `50px` by default, which is overridable.
>
> If you decide to use custom styles, please note the size limit: no more than `40px * 40px`.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| target | specifies the scrollable area dom node | () => HTMLElement | () => window |
| visibilityHeight | the `BackTop` button will not show until the scroll height reaches this value | number | 400 |

### events

| Events Name | Description                                                          | Arguments |
| ----------- | -------------------------------------------------------------------- | --------- |
| click       | a callback function, which can be executed when you click the button | Function  |
