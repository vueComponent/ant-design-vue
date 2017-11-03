<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>ButtonGroup</h1>
    <ButtonGroup />
    <h1>Disabled</h1>
    <Disabled />
    <h1>Ghost</h1>
    <Ghost />
    <h1>Icon</h1>
    <Icon />
    <h1>Loading</h1>
    <Loading />
    <h1>TODO ： Multiple</h1>
    <Multiple />
    <h1>Size</h1>
    <Size />
  </div>
</template>
<script>
import Basic from './basic'
import ButtonGroup from './button-group'
import Disabled from './disabled'
import Ghost from './ghost'
import Icon from './icon'
import Loading from './loading'
import Multiple from './multiple'
import Size from './size'
export default {
  components: {
    Basic,
    ButtonGroup,
    Disabled,
    Ghost,
    Icon,
    Loading,
    Multiple,
    Size,
  },
}
</script>
