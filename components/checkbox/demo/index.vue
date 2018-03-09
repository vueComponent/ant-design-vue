<script>
  import Basic from './basic.md'
  import CheckAll from './check-all.md'
  import Controller from './controller.md'
  import Disabled from './disabled.md'
  import Group from './group.md'
  import Layout from './layout.md'

  import CN from './../index.zh-CN.md'
  import US from './../index.en-US.md'

  const md = {
    cn: `# Checkbox多选框
           多选框
         ## 何时使用
         - 在一组可选项中进行多项选择时；
         - 单独使用可以表示两种状态之间的切换，和 switch 类似。区别在于切换 switch 会直接触发状态改变，而 checkbox 一般用于状态标记，需要和提交操作配合。
         ## 代码演示
        `,
    us: `# Checkbox
           Checkbox
         ## When to use
         - Used for selecting multiple values from several options.
         - If you use only one checkbox, it is the same as using Switch to toggle between two states. The difference is that Switch will trigger the state change directly, but Checkbox just marks the state as changed and this needs to be submitted.
         ## Examples
        `
  }

  export default {
    render() {
      return (
        <div>
          <md cn={md.cn} us={md.us} />
          <Basic />
          <CheckAll />
          <Disabled />
          <Controller />
          <Group />
          <Layout />
          <api>
            <CN slot='cn' />
            <US />
          </api>
        </div>
      )
    }
  }
</script>
