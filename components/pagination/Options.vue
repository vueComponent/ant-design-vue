<script>
import PropTypes from 'vue-types'
import KEYCODE from './KeyCode'

function noop () {
}
export default {
  props: {
    rootPrefixCls: PropTypes.String,
    changeSize: PropTypes.func.def(noop),
    quickGo: PropTypes.func.def(noop),
    selectComponentClass: PropTypes.func.def(noop),
    current: PropTypes.number,
    pageSizeOptions: PropTypes.array.def(['10', '20', '30', '40']),
    pageSize: PropTypes.number,
    locale: PropTypes.object,
  },
  data () {
    return {
      goInputText: '',
      stateCurrent: this.current,
    }
  },
  methods: {
    buildOptionText (value) {
      return `${value} ${this.locale.items_per_page}`
    },
    changeValue (e) {
      this.goInputText = e.target.value
    },
    go (e) {
      let val = this.goInputText
      if (val === '') {
        return
      }
      val = Number(val)
      if (isNaN(val)) {
        val = this.stateCurrent
      }
      if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
        this.goInputText = ''
        this.stateCurrent = this.quickGo(val)
      }
    },
  },
  render () {
    const locale = this.locale
    const prefixCls = `${this.rootPrefixCls}-options`
    const changeSize = this.changeSize
    const quickGo = this.quickGo
    const goButton = this.goButton
    const buildOptionText = this.buildOptionText
    const Select = this.selectComponentClass
    let changeSelect = null
    let goInput = null
    let gotoButton = null

    if (!(changeSize || quickGo)) {
      return null
    }

    if (changeSize && Select) {
      const Option = Select.Option
      const pageSize = this.pageSize || this.pageSizeOptions[0]
      const options = this.pageSizeOptions.map((opt, i) => (
        <Option key={i} value={opt}>{buildOptionText(opt)}</Option>
      ))

      changeSelect = (
        <Select
          prefixCls={this.selectPrefixCls}
          showSearch={false}
          class={`${prefixCls}-size-changer`}
          optionLabelProp='children'
          dropdownMatchSelectWidth={false}
          value={pageSize.toString()}
          onChange={this.changeSize}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {options}
        </Select>
      )
    }

    if (quickGo) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = (
            <button
              type='button'
              onClick={this.go}
              onKeyup={this.go}
            >
              {locale.jump_to_confirm}
            </button>
          )
        } else {
          gotoButton = goButton
        }
      }
      goInput = (
        <div class={`${prefixCls}-quick-jumper`}>
          {locale.jump_to}
          <input
            type='text'
            value={this.goInputText}
            onInput={this.changeValue}
            onKeyup={this.go}
          />
          {locale.page}
          {gotoButton}
        </div>
      )
    }

    return (
      <li class={`${prefixCls}`}>
        {changeSelect}
        {goInput}
      </li>
    )
  },
}
</script>
