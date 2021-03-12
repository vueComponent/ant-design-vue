## API

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| delay | specifies a delay in milliseconds for loading state (prevent flush) | number (milliseconds) | - |
| indicator | vue node of the spinning indicator | vNode \|slot | - |
| size | size of Spin, options: `small`, `default` and `large` | string | `default` |
| spinning | whether Spin is spinning | boolean | true |
| tip | customize description content when Spin has children | string | - |
| wrapperClassName | className of wrapper when Spin has children | string | - |

### Static Method

- `Spin.setDefaultIndicator({indicator})` As `indicator`, you can define the global default spin element

```jsx
Spin.setDefaultIndicator({
  indicator: h => {
    return <i class="anticon anticon-loading anticon-spin ant-spin-dot"></i>;
  },
});
or;
Spin.setDefaultIndicator({
  indicator: {
    render() {
      return <i class="anticon anticon-loading anticon-spin ant-spin-dot"></i>;
    },
  },
});
```
