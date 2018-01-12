<script>
import BaseMixin from '../_util/BaseMixin'

function getNumberArray (num) {
  return num
    ? num.toString()
      .split('')
      .reverse()
      .map(i => Number(i)) : []
}
export default {
  name: 'ScrollNumber',
  props: {
    className: Object,
    prefixCls: String,
    count: [Number, String],
    titleNumber: [Number, String],
    styleNumber: {
      type: Object,
      default: () => ({}),
    },
  },
  mixins: [BaseMixin],
  data () {
    const { count } = this
    return {
      animateStarted: true,
      lastCount: 0,
      stateCount: count,
    }
  },
  watch: {
    count (newValue, oldValue) {
      // 复原数字初始位置
      this.setState({
        animateStarted: true,
        lastCount: oldValue,
      }, () => {
        // 等待数字位置复原完毕
        // 开始设置完整的数字
        setTimeout(() => {
          this.setState({
            animateStarted: false,
            stateCount: newValue,
          })
        }, 30)
      })
    },
  },
  methods: {
    getPositionByNum (num, i) {
      const { animateStarted, lastCount, stateCount } = this
      if (animateStarted) {
        return 10 + num
      }
      const currentDigit = getNumberArray(stateCount)[i]
      const lastDigit = getNumberArray(lastCount)[i]
      // 同方向则在同一侧切换数字
      if (stateCount > lastCount) {
        if (currentDigit >= lastDigit) {
          return 10 + num
        }
        return 20 + num
      }
      if (currentDigit <= lastDigit) {
        return 10 + num
      }
      return num
    },
    renderNumberList (position) {
      const childrenArr = new Array(30).fill(1)
      const childrenHtml = childrenArr.map((item, i) => {
        const currentClassName = (position === i) ? 'current' : ''
        return <p key={i.toString()} class={currentClassName}>{i % 10}</p>
      })
      return childrenHtml
    },
    renderCurrentNumber (num, i) {
      const { animateStarted, prefixCls } = this
      const position = this.getPositionByNum(num, i)
      let removeTransition = animateStarted ||
        (getNumberArray(this.lastCount)[i] === undefined)
      if (!removeTransition) {
        removeTransition = ''
      }
      const styleSpan = {
        transition: `${removeTransition}` && 'none',
        msTransform: `translateY(${-position * 100}%)`,
        WebkitTransform: `translateY(${-position * 100}%)`,
        transform: `translateY(${-position * 100}%)`,
      }
      return (
        <span
          key={i}
          class={`${prefixCls}-only`}
          style = {styleSpan}
        >
          {
            this.renderNumberList(position)
          }
        </span>
      )
    },
    renderNumberElement () {
      const { stateCount } = this
      if (!stateCount || isNaN(Number(stateCount))) {
        return stateCount
      }
      return getNumberArray(stateCount)
        .map((num, i) => this.renderCurrentNumber(num, i)).reverse()
    },
  },
  render () {
    const { prefixCls, className, titleNumber, styleNumber } = this
    return (
      <sup
        class={[prefixCls, className]}
        title={titleNumber}
        style={styleNumber}>
        {
          this.renderNumberElement()
        }
      </sup>
    )
  },
}
</script>
