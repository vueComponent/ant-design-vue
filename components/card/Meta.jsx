
import PropTypes from '../_util/vue-types'
import { getComponentFromProp } from '../_util/props-util'

export default {
  name: 'ACardMeta',
  props: {
    prefixCls: PropTypes.string.def('ant-card'),
    title: PropTypes.string,
    description: PropTypes.string,
  },
  render () {
    const { prefixCls = 'ant-card', title, description, ...others } = this.$props
    const classString = {
      [`${prefixCls}-meta`]: true,
    }

    const avatar = getComponentFromProp(this, 'avatar')
    const avatarDom = avatar ? <div class={`${prefixCls}-meta-avatar`}>{avatar}</div> : null
    const titleDom = title ? <div class={`${prefixCls}-meta-title`}>{title}</div> : null
    const descriptionDom = description
      ? <div class={`${prefixCls}-meta-description`}>{description}</div> : null
    const MetaDetail = titleDom || descriptionDom
      ? <div class={`${prefixCls}-meta-detail`}>
        {titleDom}
        {descriptionDom}
      </div> : null
    return (
      <div {...others} class={classString}>
        {avatarDom}
        {MetaDetail}
      </div>
    )
  },
}

