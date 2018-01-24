<script>
import Basic from './basic'
import ButtonGroup from './button-group'
import Disabled from './disabled'
import Ghost from './ghost'
import Icon from './icon'
import Loading from './loading'
import Multiple from './multiple'
import Size from './size'
import CN from '../index.zh-CN.md'
import US from '../index.en-US.md'
export default {
  render () {
    const md = {
      cn: `# Button 按钮
          按钮用于开始一个即时操作。
          ## 何时使用
          标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。
          ## 代码演示`,
      us: `# Button
          To trigger an operation.
          ## When To Use
          A button means an operation (or a series of operations). Clicking a button will trigger corresponding business logic.
          `,
    }
    return (
      <div>
        <md md={md}/>
        <Basic />
        <ButtonGroup />
        <Disabled />
        <Ghost />
        <Icon/>
        <Loading />
        <h1>TODO ： Multiple</h1>
        <Multiple />
        <Size />
        <api>
          <template slot='cn'>
            <CN/>
          </template>
          <template slot='us'>
            <US/>
          </template>
        </api>
      </div>
    )
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
