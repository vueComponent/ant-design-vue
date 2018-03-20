<script>
import Basic from './basic'
import All from './all'
import CN from '../index.zh-CN.md'
import US from '../index.en-US.md'
export default {
  category: 'Components',
  subtitle: '国际化',
  cols: 1,
  type: 'Other',
  title: 'LocaleProvider',
  render () {
    return (
      <div>
        <api>
          <CN slot='cn' />
          <US/>
        </api>
        <Basic />
        <All />
      </div>
    )
  },
}
</script>
