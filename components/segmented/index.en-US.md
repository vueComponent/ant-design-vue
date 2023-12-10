---
category: Components
type: Data Display
title: Segmented
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*papwTpNscPIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tz7qSaWpi1kAAAAAAAAAAAAADrJ8AQ/original
tag: New
---

Segmented Controls.

### When To Use

- When displaying multiple options and user can select a single option;
- When switching the selected option, the content of the associated area changes.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent\'s width | boolean | false |  |
| disabled | Disable all segments | boolean | false |  |
| options | Set children optional | string[] \| number[] \| SegmentedOption[] | [] |  |
| size | The size of the Segmented. | `large` \| `middle` \| `small` | - |  |
| value | Currently selected value | string \| number |  |  |
| label | custom label by slot | v-slot:label="SegmentedBaseOption" |  |  |

### events

| Events Name | Description | Arguments |  |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes | function(value: string \| number) | - |

#### SegmentedBaseOption、 SegmentedOption

```ts
interface SegmentedBaseOption {
  value: string | number;
  disabled?: boolean;
  payload?: any; // payload more data
  /**
   * html `title` property for label
   */
  title?: string;
  className?: string;
}
interface SegmentedOption extends SegmentedBaseOption {
  label?: VueNode | ((option: SegmentedBaseOption) => VueNode);
}
```
