---
category: Components
type: Data Display
title: Segmented
---

Segmented Controls.

### When To Use

- When displaying multiple options and user can select a single option;
- When switching the selected option, the content of the associated area changes.

## API

### Segmented

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent\'s width | boolean | false |  |
| defaultValue | Default selected value | string \| number |  |  |
| disabled | Disable all segments | boolean | false |  |
| change | The callback function that is triggered when the state changes | function(value: string \| number) |  |  |
| options | Set children optional | string[] \| number[] \| Array<{ value?: string disabled?: boolean }> | [] |  |
| size | The size of the Segmented. | `large` \| `middle` \| `small` | - |  |
| value | Currently selected value | string \| number |  |  |
