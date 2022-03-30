## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| colorRounded | precision of color | number | 0 |
| config | pickr config | [pickr options](https://github.com/Simonwep/pickr) | - |
| defaultValue | default color | string | - |
| disabled | whether disabled picker | boolean | false |
| format | Color format | 'HEXA' \|'RGBA' \|'HSVA' \|'HSLA' \|'CMYK' | 'HEXA' |
| getPopupContainer | to set the container of the floating layer, while the default is to create a div element in body | Function(triggerNode) | () => document.body |
| locale | locale package | [default setting](https://github.com/vueComponent/ant-design-vue/blob/main/components/color-picker/locale) | - |
| size | size of pickr | 'large'\|'small'\|'default' | 'default' |
| value | color value | string | - |

### Event

| Event | Description | Arguments |
| --- | --- | --- |
| `cancel` | User clicked the cancel button (return to previous color). | `PickrInstance` |
| `change` | Color has changed (but not saved). Also fired on `swatchselect` | `HSVaColorObject, PickrInstance` |
| `changestop` | User stopped to change the color | `PickrInstance` |
| `clear` | User cleared the color. | `PickrInstance` |
| `hide` | Pickr got closed | `PickrInstance` |
| `init` | Initialization done - pickr can be used | `PickrInstance` |
| `save` | User clicked the save / clear button. Also fired on clear with `null` as color. | `HSVaColorObject or null, PickrInstance` |
| `show` | Pickr got opened | `PickrInstance` |
| `swatchselect` | User clicked one of the swatches | `HSVaColorObject, PickrInstance` |
