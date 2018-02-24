<script>
  import { Tabs } from 'antd'
  import omit from 'omit.js'
  import PropTypes from '../_util/vue-types'
  import addEventListener from '../_util/Dom/addEventListener'
  import { hasProp, getComponentFromProp, getComponentName } from '../_util/props-util'
  import throttleByAnimationFrame from '../_util/throttleByAnimationFrame'
  import BaseMixin from '../_util/BaseMixin'

  const { TabPane } = Tabs
  export default {
    name: 'Card',
    mixins: [BaseMixin],
    props: {
      prefixCls: PropTypes.string.def('ant-card'),
      title: PropTypes.string,
      extra: PropTypes.any,
      bordered: PropTypes.bool.def(true),
      bodyStyle: PropTypes.object,
      loading: PropTypes.bool.def(false),
      noHovering: PropTypes.bool.def(false),
      hoverable: PropTypes.bool.def(false),
      type: PropTypes.string,
      actions: PropTypes.any,
      tabList: PropTypes.array,
    },
    data () {
      return {
        widerPadding: false,
        updateWiderPaddingCalled: false,
      }
    },
    mounted () {
      this.updateWiderPadding = throttleByAnimationFrame(this.updateWiderPadding)
      this.updateWiderPadding()
      this.resizeEvent = addEventListener(window, 'resize', this.updateWiderPadding)

      // if (hasProp(this, 'noHovering')) {
      //   warning(
      //     !this.noHovering,
      //     '`noHovering` of Card is deperated, you can remove it safely or use `hoverable` instead.',
      //   )
      //   warning(!!this.noHovering, '`noHovering={false}` of Card is deperated, use `hoverable` instead.')
      // }
    },
    beforeMount () {
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
      // For 2.x compatible
      getCompatibleHoverable () {
        const { noHovering, hoverable } = this.$props
        if (hasProp(this, 'noHovering')) {
          return !noHovering || hoverable
        }
        return !!hoverable
      },
    },
    render () {
      const {
        prefixCls = 'ant-card', extra, bodyStyle, title, loading,
        bordered = true, type, tabList, ...others
      } = this.$props

      const { $slots } = this

      const classString = {
        [`${prefixCls}`]: true,
        [`${prefixCls}-loading`]: loading,
        [`${prefixCls}-bordered`]: bordered,
        [`${prefixCls}-hoverable`]: this.getCompatibleHoverable(),
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

      let head
      const tabs = tabList && tabList.length ? (
        <Tabs class={`${prefixCls}-head-tabs`} size='large' onChange={this.onHandleTabChange}>
          {tabList.map(item => <TabPane tab={item.tab} key={item.key} />)}
        </Tabs>
      ) : null
      const titleDom = title || getComponentFromProp(this, 'title')
      const extraDom = extra || getComponentFromProp(this, 'extra')
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
      const divProps = omit(others, [
        'tabChange',
      ])
      return (
        <div {...divProps} class={classString} ref='cardContainerRef'>
          {head}
          {coverDom}
          {children ? body : null}
          {actionDom}
        </div>
      )
    },
  }
</script>
