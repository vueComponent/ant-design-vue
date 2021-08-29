import PropTypes from '../_util/vue-types';
import KEYCODE from './KeyCode';
import { computed, defineComponent, ref, withDirectives } from 'vue';
import antInput from '../_util/antInputDirective';
import type { EventHandler } from '../_util/EventInterface';

export default defineComponent({
  props: {
    disabled: PropTypes.looseBool,
    changeSize: PropTypes.func,
    quickGo: PropTypes.func,
    selectComponentClass: PropTypes.any,
    current: PropTypes.number,
    pageSizeOptions: PropTypes.array.def(['10', '20', '50', '100']),
    pageSize: PropTypes.number,
    buildOptionText: PropTypes.func,
    locale: PropTypes.object,
    rootPrefixCls: PropTypes.string,
    selectPrefixCls: PropTypes.string,
    goButton: PropTypes.any,
  },
  setup(props) {
    const goInputText = ref('');
    const validValue = computed(() => {
      return !goInputText.value || isNaN(goInputText.value as any)
        ? undefined
        : Number(goInputText.value);
    });

    const defaultBuildOptionText = opt => {
      return `${opt.value} ${props.locale.items_per_page}`;
    };
    const handleChange: EventHandler = e => {
      const { value, composing } = e.target;
      if (e.isComposing || composing || goInputText.value === value) return;
      goInputText.value = value;
    };
    const handleBlur: EventHandler = e => {
      const { goButton, quickGo, rootPrefixCls } = props;

      if (goButton || goInputText.value === '') {
        return;
      }
      if (
        e.relatedTarget &&
        (e.relatedTarget.className.indexOf(`${rootPrefixCls}-item-link`) >= 0 ||
          e.relatedTarget.className.indexOf(`${rootPrefixCls}-item`) >= 0)
      ) {
        goInputText.value = '';
        return;
      } else {
        quickGo(validValue.value);
        goInputText.value = '';
      }
    };
    const go: EventHandler = e => {
      if (goInputText.value === '') {
        return;
      }
      if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
        // https://github.com/vueComponent/ant-design-vue/issues/1316
        props.quickGo(validValue.value);

        goInputText.value = '';
      }
    };

    const pageSizeOptions = computed(() => {
      const { pageSize, pageSizeOptions } = props;
      if (pageSizeOptions.some(option => option.toString() === pageSize.toString())) {
        return pageSizeOptions;
      }
      return pageSizeOptions.concat([pageSize.toString()]).sort((a, b) => {
        // eslint-disable-next-line no-restricted-globals
        const numberA = isNaN(Number(a)) ? 0 : Number(a);
        // eslint-disable-next-line no-restricted-globals
        const numberB = isNaN(Number(b)) ? 0 : Number(b);
        return numberA - numberB;
      });
    });

    return () => {
      const {
        rootPrefixCls,
        locale,
        changeSize,
        quickGo,
        goButton,
        selectComponentClass: Select,
        selectPrefixCls,
        pageSize,
        disabled,
      } = props;
      const prefixCls = `${rootPrefixCls}-options`;
      let changeSelect = null;
      let goInput = null;
      let gotoButton = null;

      if (!changeSize && !quickGo) {
        return null;
      }

      if (changeSize && Select) {
        const buildOptionText = props.buildOptionText || defaultBuildOptionText;
        const options = pageSizeOptions.value.map((opt, i) => (
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
            value={(pageSize || pageSizeOptions.value[0]).toString()}
            onChange={value => changeSize(Number(value))}
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
              <button
                type="button"
                onClick={go}
                onKeyup={go}
                disabled={disabled}
                class={`${prefixCls}-quick-jumper-button`}
              >
                {locale.jump_to_confirm}
              </button>
            ) : (
              <span onClick={go} onKeyup={go}>
                {goButton}
              </span>
            );
        }
        goInput = (
          <div class={`${prefixCls}-quick-jumper`}>
            {locale.jump_to}
            {withDirectives(
              <input
                disabled={disabled}
                type="text"
                value={goInputText.value}
                onInput={handleChange}
                onChange={handleChange}
                onKeyup={go}
                onBlur={handleBlur}
              />,
              [[antInput]],
            )}
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
    };
  },
});
