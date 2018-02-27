<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>AutosizeTextarea</h1>
    <AutosizeTextarea />
    <h1>Presuffix</h1>
    <Presuffix />
    <h1>SearchInput</h1>
    <SearchInput />
    <h1>Size</h1>
    <Size />
    <h1>TextArea</h1>
    <TextArea />
    <h1>Addon</h1>
    <Addon />
  </div>
</template>
<script>
import Basic from './basic'
import AutosizeTextarea from './autosize-textarea'
import Presuffix from './presuffix'
import SearchInput from './search-input'
import Size from './size'
import TextArea from './textarea'
import Addon from './addon'
export default {
  components: {
    Basic,
    AutosizeTextarea,
    Presuffix,
    SearchInput,
    Size,
    TextArea,
    Addon,
  },
}
</script>
