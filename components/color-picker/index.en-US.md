## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| defaultValue | default color | string | - |
| config | pickr config | [pickr options](https://github.com/Simonwep/pickr) | - |
| value | color value | string | - |
| locale | locale package | [default setting](https://github.com/vueComponent/ant-design-vue/blob/next/components/color-picker/locale) | - |
| colorRounded | precision of color | number | 0 |
| size | size of pickr | 'large'\|'small'\|'default' | 'default' |
| getPopupContainer | to set the container of the floating layer, while the default is to create a div element in body | Function(triggerNode) | () => document.body |
| disabled | whether disabled picker | boolean | false |
| format | Color format | 'HEXA' \|'RGBA' \|'HSVA' \|'HSLA' \|'CMYK' | 'HEXA' |

### Event

| Event | Description | Arguments |
| --- | --- | --- |
| `init` | Initialization done - pickr can be used | `PickrInstance` |
| `hide` | Pickr got closed | `PickrInstance` |
| `show` | Pickr got opened | `PickrInstance` |
| `save` | User clicked the save / clear button. Also fired on clear with `null` as color. | `HSVaColorObject or null, PickrInstance` |
| `clear` | User cleared the color. | `PickrInstance` |
| `change` | Color has changed (but not saved). Also fired on `swatchselect` | `HSVaColorObject, PickrInstance` |
| `changestop` | User stopped to change the color | `PickrInstance` |
| `cancel` | User clicked the cancel button (return to previous color). | `PickrInstance` |
| `swatchselect` | User clicked one of the swatches | `HSVaColorObject, PickrInstance` |
