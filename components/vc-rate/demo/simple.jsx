import Rate from '../index'
import '../assets/index.less'

export default {
  data () {
    return {
    }
  },
  methods: {
    onChange (v) {
      console.log('selected star', v)
    },
    onFocus () {
      console.dir('focus')
    },
  },
  render () {
    const { onChange, onFocus } = this
    const scopedSlots = (
      <i class='anticon anticon-star' />
    )
    const rateProps = {
      props: {
        defaultValue: 2.5,
        allowHalf: true,
      },
      on: {
        change: onChange,
      },
      style: {
        fontSize: '50px', marginTop: '24px',
      },
      scopedSlots: {
        character: scopedSlots,
      },
    }
    const rateProps1 = {
      props: {
        defaultValue: 2,
      },
      on: {
        change: onChange,
      },
      style: {
        fontSize: '50px', marginTop: '24px',
      },
      scopedSlots: {
        character: scopedSlots,
      },
    }
    return (
      <div style='margin: 100px'>
        <Rate
          defaultValue={2.5}
          onChange={onChange}
          onFocus={onFocus}
          style='fontSize: 40px'
          allowHalf
          allowClear={false}
          autoFocus
          disabled
        />
        <br />
        <Rate
          defaultValue={2.5}
          onChange={onChange}
          style='fontSize: 50px; marginTop: 24px'
          allowHalf
          character='$'
        />
        <br />
        <Rate
          {...rateProps}
        >
        </Rate>
        <br />
        <Rate
          {...rateProps1}
        >
        </Rate>
      </div>
    )
  },
}
