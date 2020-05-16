import KeyCode from '../_util/KeyCode';
import BaseMixin from '../_util/BaseMixin';
import PropTypes from '../_util/vue-types';
import TextArea from '../input/TextArea';
import EnterOutlined from '@ant-design/icons-vue/EnterOutlined';

const Editable = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    value: PropTypes.string,
  },
  data() {
    return {
      current: this.value || '',
      lastKeyCode: undefined,
      inComposition: false,
    };
  },
  watch: {
    value(val) {
      this.current = val;
    },
  },
  mounted() {
    const resizableTextArea = this.$refs.textarea.$refs.resizableTextArea;
    const textArea = resizableTextArea.$refs.textArea;
    textArea.focus();
    const { length } = textArea.value;
    textArea.setSelectionRange(length, length);
  },
  methods: {
    onChange({ target: { value } }) {
      this.setState({ current: value.replace(/[\r\n]/g, '') });
    },
    onCompositionStart() {
      this.inComposition = true;
    },
    onCompositionEnd() {
      this.inComposition = false;
    },
    onKeyDown({ keyCode }) {
      // We don't record keyCode when IME is using
      if (this.inComposition) return;

      this.lastKeyCode = keyCode;
    },
    onKeyUp({ keyCode, ctrlKey, altKey, metaKey, shiftKey }) {
      // Check if it's a real key
      if (
        this.lastKeyCode === keyCode &&
        !this.inComposition &&
        !ctrlKey &&
        !altKey &&
        !metaKey &&
        !shiftKey
      ) {
        if (keyCode === KeyCode.ENTER) {
          this.confirmChange();
        } else if (keyCode === KeyCode.ESC) {
          this.$emit('cancel');
        }
      }
    },

    onBlur() {
      this.confirmChange();
    },

    confirmChange() {
      const { current } = this;
      this.$emit('save', current.trim());
    },
  },
  render() {
    const { current } = this;
    const { prefixCls } = this.$props;

    return (
      <div class={`${prefixCls} ${prefixCls}-edit-content`}>
        <TextArea
          ref="textarea"
          value={current}
          onChange={this.onChange}
          onKeydown={this.onKeyDown}
          onKeyup={this.onKeyUp}
          onCompositionStart={this.onCompositionStart}
          onCompositionEnd={this.onCompositionEnd}
          onBlur={this.onBlur}
          autoSize
        />
        <EnterOutlined class={`${prefixCls}-edit-content-confirm`} />
      </div>
    );
  },
};

export default Editable;
