<script>
import DateTHead from './DateTHead'
import DateTBody from './DateTBody'

export default {
  functional: true,
  render (createElement, context) {
    const { data, listeners = {}} = context
    const prefixCls = data.prefixCls
    const props = {
      props: data,
      on: listeners,
    }
    return (<table class = {`${prefixCls}-table`} cellSpacing='0' role='grid'>
      <DateTHead {...props}/>
      <DateTBody {...props}/>
    </table>)
  },
}
</script>
