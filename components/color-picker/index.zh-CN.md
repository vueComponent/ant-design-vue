## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 默认颜色 | string | - |
| config | pickr 配置项 | [pickr options](https://github.com/Simonwep/pickr) | - |
| value | 颜色值 | string | - |
| locale | 语言包 | [默认配置](https://github.com/vueComponent/ant-design-vue/blob/next/components/color-picker/locale) | - |
| colorRounded | 颜色数值精度 | number | 0 |
| size | 取色器尺寸 | 'large'\|'small'\|'default' | 'default' |
| getPopupContainer | 浮层渲染父节点，默认渲染到 body 上 | Function(triggerNode) | () => document.body |
| disabled | 是否禁用 | boolean | false |
| format | 定义返回的颜色格式 | 'HEXA' \|'RGBA' \|'HSVA' \|'HSLA' \|'CMYK' | 'HEXA' |

### 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| `init` | 初始化完成,可以使用 pickr | `PickrInstance` |
| `hide` | Pickr 关闭时 | `PickrInstance` |
| `show` | Pickr 开启时 | `PickrInstance` |
| `save` | 用户点击保存/清空按钮时 | `HSVaColorObject or null, PickrInstance` |
| `clear` | 清空颜色时 | `PickrInstance` |
| `change` | 颜色值发生变更时(非保存).`swatchselect`也会触发 | `HSVaColorObject, PickrInstance` |
| `changestop` | 用户不再改变颜色时 | `PickrInstance` |
| `cancel` | 用户点击取消时(颜色返回至上个颜色) | `PickrInstance` |
| `swatchselect` | 用户切换了色板 | `HSVaColorObject, PickrInstance` |
