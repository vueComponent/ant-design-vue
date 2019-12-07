import PropTypes from '../_util/vue-types';
import KEYCODE from './KeyCode';
import BaseMixin from '../_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  props: {
    disabled: PropTypes.bool,
    changeSize: PropTypes.func,
    quickGo: PropTypes.func,
    selectComponentClass: PropTypes.any,
    current: PropTypes.number,
    pageSizeOptions: PropTypes.array.def(['10', '20', '30', '40']),
    pageSize: PropTypes.number,
    buildOptionText: PropTypes.func,
    locale: PropTypes.object,
    rootPrefixCls: PropTypes.string,
    selectPrefixCls: PropTypes.string,
    goButton: PropTypes.any,
  },
  data() {
    return {
      goInputText: '',
    };
  },
  methods: {
    getValidValue() {
      const { goInputText, current } = this;
      return isNaN(goInputText) ? current : Number(goInputText);
    },
    defaultBuildOptionText(opt) {
      return `${opt.value} ${this.locale.items_per_page}`;
    },
    handleChange(e) {
      const { value, composing } = e.target;
      if (composing || this.goInputText === value) return;
      this.setState({
        goInputText: value,
      });
    },
    handleBlur() {
      const { goButton, quickGo } = this;
      if (goButton) {
        return;
      }
      quickGo(this.getValidValue());
    },
    go(e) {
      const { goInputText } = this;
      if (goInputText === '') {
        return;
      }
      if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
        // https://github.com/vueComponent/ant-design-vue/issues/1316
        this.quickGo(this.getValidValue());
        this.setState({
          goInputText: '',
        });
      }
    },
  },
  render() {
    const {
      rootPrefixCls,
      locale,
      changeSize,
      quickGo,
      goButton,
      selectComponentClass: Select,
      defaultBuildOptionText,
      selectPrefixCls,
      pageSize,
      pageSizeOptions,
      goInputText,
      disabled,
    } = this;
    const prefixCls = `${rootPrefixCls}-options`;
    let changeSelect = null;
    let goInput = null;
    let gotoButton = null;

    if (!changeSize && !quickGo) {
      return null;
    }

    if (changeSize && Select) {
      const buildOptionText = this.buildOptionText || defaultBuildOptionText;
      const options = pageSizeOptions.map((opt, i) => (
        <Select.Option key={i} value={opt}>
          {buildOptionText({ value: opt })}
        </Select.Option>
      ));

      changeSelect = (
        <Select
          disabled={disabled}
          prefixCls={selectPrefixCls}
          showSearch={false}
          class={`${prefixCls}-size-changer`}
          optionLabelProp="children"
          dropdownMatchSelectWidth={false}
          value={(pageSize || pageSizeOptions[0]).toString()}
          onChange={value => this.changeSize(Number(value))}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {options}
        </Select>
      );
    }

    if (quickGo) {
      if (goButton) {
        gotoButton =
          typeof goButton === 'boolean' ? (
            <button type="button" onClick={this.go} onKeyup={this.go} disabled={disabled}>
              {locale.jump_to_confirm}
            </button>
          ) : (
            <span onClick={this.go} onKeyup={this.go}>
              {goButton}
            </span>
          );
      }
      goInput = (
        <div class={`${prefixCls}-quick-jumper`}>
          {locale.jump_to}
          <input
            disabled={disabled}
            type="text"
            value={goInputText}
            onInput={this.handleChange}
            onKeyup={this.go}
            onBlur={this.handleBlur}
            {...{
              directives: [
                {
                  name: 'ant-input',
                },
              ],
            }}
          />
          {locale.page}
          {gotoButton}
        </div>
      );
    }

    return (
      <li class={`${prefixCls}`}>
        {changeSelect}
        {goInput}
      </li>
    );
  },
};
