## API

| Property | Description | Type | Optional | Default |
| -------- | ----------- | ---- | -------- | ------- |
| itemRender | Custom item renderer | (route, params, routes, paths) => ReactNode |  | - |
| params | Routing parameters | object |  | - |
| routes | The routing stack information of router | object\[] |  | - |
| separator | Custom separator | string\|ReactNode |  | `/` |

> `linkRender` and `nameRender` were removed after `antd@2.0`, please use `itemRender` instead.

### Use with browserHistory

The link of Breadcrumb item targets `#` by default, you can use `itemRender` to make a `browserHistory` Link.

```vue
import { Link } from 'react-router';

const routes = [{
  path: 'index',
  breadcrumbName: 'home'
}, {
  path: 'first',
  breadcrumbName: 'first'
}, {
  path: 'second',
  breadcrumbName: 'second'
}];
function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
}

return <Breadcrumb itemRender={itemRender} routes={routes} />;
```
