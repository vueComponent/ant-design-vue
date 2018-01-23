<template>
  <div>
    <md>
    # Button 按钮
    按钮用于开始一个即时操作。
    ## 何时使用
    标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

    ## 代码演示
    </md>
    <Basic />
    <ButtonGroup />
    <Disabled />
    <Ghost />
    <Icon />
    <Loading />
    <h1>TODO ： Multiple</h1>
    <Multiple />
    <Size />
    <Doc class="markdown"/>
  </div>
</template>
<script>
import Basic from './basic.md'
import ButtonGroup from './button-group'
import Disabled from './disabled'
import Ghost from './ghost'
import Icon from './icon'
import Loading from './loading'
import Multiple from './multiple'
import Size from './size'
import Doc from '../index.zh-CN.md'
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
    Doc,
  },
}
</script>
<style>
[id^="components-button-demo-"] .ant-btn {
  margin-right: 8px;
  margin-bottom: 12px;
}
[id^="components-button-demo-"] .ant-btn-group > .ant-btn {
  margin-right: 0;
}
</style>
