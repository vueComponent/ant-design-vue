<script>
import PropTypes from '../_util/vue-types'
import KEYCODE from './KeyCode'
import BaseMixin from '../_util/BaseMixin'

export default {
  mixins: [BaseMixin],
  props: {
    rootPrefixCls: PropTypes.String,
    changeSize: PropTypes.func,
    quickGo: PropTypes.func,
    selectComponentClass: PropTypes.any,
    current: PropTypes.number,
    pageSizeOptions: PropTypes.array.def(['10', '20', '30', '40']),
    pageSize: PropTypes.number,
    buildOptionText: PropTypes.func,
    locale: PropTypes.object,
    goButton: PropTypes.any,
  },
  data () {
    return {
      goInputText: '',
      stateCurrent: this.current,
    }
  },
  methods: {
    defaultBuildOptionText (value) {
      return `${value} ${this.locale.items_per_page}`
    },
    handleChange (e) {
      this.setState({
        goInputText: e.target.value,
      })
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
        this.setState({
          goInputText: '',
          stateCurrent: this.quickGo(val),
        })
      }
    },
  },
  render () {
    const { rootPrefixCls, locale, changeSize, quickGo, goButton, buildOptionText, selectComponentClass: Select, defaultBuildOptionText } = this
    const prefixCls = `${rootPrefixCls}-options`
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
        <Option key={i} value={opt}>{buildOptionText ? buildOptionText(opt) : defaultBuildOptionText(opt)}</Option>
      ))

      changeSelect = (
        <Select
          prefixCls={this.selectPrefixCls}
          showSearch={false}
          class={`${prefixCls}-size-changer`}
          optionLabelProp='children'
          dropdownMatchSelectWidth={false}
          value={pageSize.toString()}
          onChange={value => this.changeSize(Number(value))}
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
          gotoButton = (
            <span
              onClick={this.go}
              onKeyUp={this.go}
            >{goButton}</span>
          )
        }
      }
      goInput = (
        <div class={`${prefixCls}-quick-jumper`}>
          {locale.jump_to}
          <input
            type='text'
            value={this.goInputText}
            onChange={this.handleChange}
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
