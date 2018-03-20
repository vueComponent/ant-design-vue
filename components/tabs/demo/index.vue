<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>CardTop</h1>
    <CardTop />
    <h1>Card</h1>
    <Card />
    <h1>CustomAddTrigger</h1>
    <CustomAddTrigger />
    <h1>Disabled</h1>
    <Disabled />
    <h1>EditableCard</h1>
    <EditableCard />
    <h1>Extra</h1>
    <Extra />
    <h1>Icon</h1>
    <Icon />
    <h1>Position</h1>
    <Position />
    <h1>Size</h1>
    <Size />
    <h1>Slide</h1>
    <Slide/>
  </div>
</template>
<script>
import Basic from './basic'
import CardTop from './card-top'
import Card from './card'
import CustomAddTrigger from './custom-add-trigger'
import Disabled from './disabled'
import EditableCard from './editable-card'
import Extra from './extra'
import Icon from './icon'
import Position from './position'
import Size from './size'
import Slide from './slide'
export default {
  category: 'Components',
  subtitle: '标签页',
  type: 'Data Display',
  title: 'Tabs',
  cols: 1,
  components: {
    Basic,
    CardTop,
    Card,
    CustomAddTrigger,
    Disabled,
    EditableCard,
    Extra,
    Icon,
    Position,
    Size,
    Slide,
  },
}
</script>
