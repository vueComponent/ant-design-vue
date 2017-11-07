<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>Disabled</h1>
    <Disabled />
    <h1>RadioButton</h1>
    <RadioButton />
    <h1>RadioGroupMore</h1>
    <RadioGroupMore />
    <h1>RadioGroupOptions</h1>
    <RadioGroupOptions />
    <h1>RadioGroupWithName</h1>
    <RadioGroupWithName />
    <h1>RadioGroup</h1>
    <RadioGroup />
    <h1>Size</h1>
    <Size />
  </div>
</template>
<script>
import Basic from './basic'
import Disabled from './disabled'
import RadioButton from './radioButton'
import RadioGroupMore from './radioGroup-more'
import RadioGroupOptions from './radioGroup-options'
import RadioGroupWithName from './radioGroup-with-name'
import RadioGroup from './radioGroup'
import Size from './size'
export default {
  components: {
    Basic,
    Disabled,
    RadioButton,
    RadioGroupMore,
    RadioGroupOptions,
    RadioGroupWithName,
    RadioGroup,
    Size,
  },
}
</script>
