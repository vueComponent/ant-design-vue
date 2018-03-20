<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>Checkable</h1>
    <Checkable />
    <h1>Colorful</h1>
    <Colorful />
    <h1>Control</h1>
    <Control />
    <h1>HotTags</h1>
    <HotTags />
  </div>
</template>
<script>
import Basic from './basic'
import Checkable from './checkable'
import Colorful from './colorful'
import Control from './control'
import HotTags from './hot-tags'
export default {
  category: 'Components',
  subtitle: '标签',
  type: 'Data Display',
  title: 'Tag',
  components: {
    Basic,
    Checkable,
    Colorful,
    Control,
    HotTags,
  },
}
</script>
