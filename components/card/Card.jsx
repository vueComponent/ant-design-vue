
import Tabs from '../tabs'
import PropTypes from '../_util/vue-types'
import addEventListener from '../_util/Dom/addEventListener'
import { getComponentFromProp, getComponentName } from '../_util/props-util'
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame'
import BaseMixin from '../_util/BaseMixin'

const { TabPane } = Tabs
export default {
  name: 'ACard',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string.def('ant-card'),
    title: PropTypes.any,
    extra: PropTypes.any,
    bordered: PropTypes.bool.def(true),
    bodyStyle: PropTypes.object,
    loading: PropTypes.bool.def(false),
    hoverable: PropTypes.bool.def(false),
    type: PropTypes.string,
    actions: PropTypes.any,
    tabList: PropTypes.array,
    activeTabKey: PropTypes.string,
    defaultActiveTabKey: PropTypes.string,
  },
  data () {
    this.updateWiderPaddingCalled = false
    return {
      widerPadding: false,
    }
  },
  beforeMount () {
    this.updateWiderPadding = throttleByAnimationFrame(this.updateWiderPadding)
  },
  mounted () {
    this.updateWiderPadding()
    this.resizeEvent = addEventListener(window, 'resize', this.updateWiderPadding)
  },
  beforeDestroy () {
    if (this.resizeEvent) {
      this.resizeEvent.remove()
    }
    this.updateWiderPadding.cancel && this.updateWiderPadding.cancel()
  },
  methods: {
    updateWiderPadding () {
      const cardContainerRef = this.$refs.cardContainerRef
      if (!cardContainerRef) {
        return
      }
      // 936 is a magic card width pixer number indicated by designer
      const WIDTH_BOUDARY_PX = 936
      if (cardContainerRef.offsetWidth >= WIDTH_BOUDARY_PX && !this.widerPadding) {
        this.setState({ widerPadding: true }, () => {
          this.updateWiderPaddingCalled = true // first render without css transition
        })
      }
      if (cardContainerRef.offsetWidth < WIDTH_BOUDARY_PX && this.widerPadding) {
        this.setState({ widerPadding: false }, () => {
          this.updateWiderPaddingCalled = true // first render without css transition
        })
      }
    },
    onHandleTabChange (key) {
      this.$emit('tabChange', key)
    },
    isContainGrid (obj = []) {
      let containGrid
      obj.forEach((element) => {
        if (
          element &&
            element.componentOptions &&
            getComponentName(element.componentOptions) === 'Grid'
        ) {
          containGrid = true
        }
      })
      return containGrid
    },
  },
  render () {
    const {
      prefixCls = 'ant-card', bodyStyle, loading,
      bordered = true, type, tabList, hoverable, activeTabKey, defaultActiveTabKey,
    } = this.$props

    const { $slots, $scopedSlots } = this

    const classString = {
      [`${prefixCls}`]: true,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-hoverable`]: !!hoverable,
      [`${prefixCls}-wider-padding`]: this.widerPadding,
      [`${prefixCls}-padding-transition`]: this.updateWiderPaddingCalled,
      [`${prefixCls}-contain-grid`]: this.isContainGrid($slots.default),
      [`${prefixCls}-contain-tabs`]: tabList && tabList.length,
      [`${prefixCls}-type-${type}`]: !!type,
    }

    const loadingBlock = (
      <div class={`${prefixCls}-loading-content`}>
        <p class={`${prefixCls}-loading-block`} style={{ width: '94%' }} />
        <p>
          <span class={`${prefixCls}-loading-block`} style={{ width: '28%' }} />
          <span class={`${prefixCls}-loading-block`} style={{ width: '62%' }} />
        </p>
        <p>
          <span class={`${prefixCls}-loading-block`} style={{ width: '22%' }} />
          <span class={`${prefixCls}-loading-block`} style={{ width: '66%' }} />
        </p>
        <p>
          <span class={`${prefixCls}-loading-block`} style={{ width: '56%' }} />
          <span class={`${prefixCls}-loading-block`} style={{ width: '39%' }} />
        </p>
        <p>
          <span class={`${prefixCls}-loading-block`} style={{ width: '21%' }} />
          <span class={`${prefixCls}-loading-block`} style={{ width: '15%' }} />
          <span class={`${prefixCls}-loading-block`} style={{ width: '40%' }} />
        </p>
      </div>
    )

    const hasActiveTabKey = activeTabKey !== undefined
    const tabsProps = {
      props: {
        size: 'large',
        [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
          ? activeTabKey
          : defaultActiveTabKey,
      },
      on: {
        change: this.onHandleTabChange,
      },
      class: `${prefixCls}-head-tabs`,
    }

    let head
    const tabs = tabList && tabList.length ? (
      <Tabs {...tabsProps}>
        {tabList.map(item => {
          const { tab: temp, scopedSlots = {}} = item
          const name = scopedSlots.tab
          const tab = temp !== undefined ? temp : ($scopedSlots[name] ? $scopedSlots[name](item) : null)
          return <TabPane tab={tab} key={item.key} />
        })}
      </Tabs>
    ) : null
    const titleDom = getComponentFromProp(this, 'title')
    const extraDom = getComponentFromProp(this, 'extra')
    if (titleDom || extraDom || tabs) {
      head = (
        <div class={`${prefixCls}-head`}>
          <div class={`${prefixCls}-head-wrapper`}>
            {titleDom && <div class={`${prefixCls}-head-title`}>{titleDom}</div>}
            {extraDom && <div class={`${prefixCls}-extra`}>{extraDom}</div>}
          </div>
          {tabs}
        </div>
      )
    }

    const children = $slots.default
    const cover = getComponentFromProp(this, 'cover')
    const coverDom = cover ? <div class={`${prefixCls}-cover`}>{cover}</div> : null
    const body = (
      <div class={`${prefixCls}-body`} style={bodyStyle}>
        {loading ? loadingBlock : children}
      </div>
    )
    const actions = getComponentFromProp(this, 'actions')
    const actionDom = actions || null

    return (
      <div class={classString} ref='cardContainerRef'>
        {head}
        {coverDom}
        {children ? body : null}
        {actionDom}
      </div>
    )
  },
}

