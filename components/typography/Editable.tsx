import KeyCode from '../_util/KeyCode';
import PropTypes from '../_util/vue-types';
import TextArea from '../input/TextArea';
import EnterOutlined from '@ant-design/icons-vue/EnterOutlined';
import { defineComponent, ref, reactive, watch, onMounted } from 'vue';

const Editable = defineComponent({
  name: 'Editable',
  props: {
    prefixCls: PropTypes.string,
    value: PropTypes.string,
    maxlength: PropTypes.number,
    autoSize: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onEnd: PropTypes.func,
    onChange: PropTypes.func,
    originContent: PropTypes.string,
  },
  emits: ['save', 'cancel', 'end', 'change'],
  setup(props, { emit }) {
    const state = reactive({
      current: props.value || '',
      lastKeyCode: undefined,
      inComposition: false,
      cancelFlag: false,
    });
    watch(
      () => props.value,
      current => {
        state.current = current;
      },
    );

    const textArea = ref();

    onMounted(() => {
      if (textArea.value) {
        const resizableTextArea = textArea.value?.resizableTextArea;
        const innerTextArea = resizableTextArea?.textArea;
        innerTextArea.focus();
        const { length } = innerTextArea.value;
        innerTextArea.setSelectionRange(length, length);
      }
    });

    function saveTextAreaRef(node: any) {
      textArea.value = node;
    }

    function onChange({ target: { value } }) {
      state.current = value.replace(/[\r\n]/g, '');
      emit('change', state.current);
    }

    function onCompositionStart() {
      state.inComposition = true;
    }

    function onCompositionEnd() {
      state.inComposition = false;
    }

    function onKeyDown(e: KeyboardEvent) {
      const { keyCode } = e;
      if (keyCode === KeyCode.ENTER) {
        e.preventDefault();
      }
      // We don't record keyCode when IME is using
      if (state.inComposition) return;

      state.lastKeyCode = keyCode;
    }

    function onKeyUp(e: KeyboardEvent) {
      const { keyCode, ctrlKey, altKey, metaKey, shiftKey } = e;

      // Check if it's a real key
      if (
        state.lastKeyCode === keyCode &&
        !state.inComposition &&
        !ctrlKey &&
        !altKey &&
        !metaKey &&
        !shiftKey
      ) {
        if (keyCode === KeyCode.ENTER) {
          confirmChange();
          emit('end');
        } else if (keyCode === KeyCode.ESC) {
          state.current = props.originContent;
          emit('cancel');
        }
      }
    }

    function onBlur() {
      confirmChange();
      emit('end');
    }

    function confirmChange() {
      emit('save', state.current.trim());
    }

    return () => (
      <div class={`${props.prefixCls} ${props.prefixCls}-edit-content`}>
        <TextArea
          ref={saveTextAreaRef}
          maxlength={props.maxlength}
          value={state.current}
          onChange={onChange}
          onKeydown={onKeyDown}
          onKeyup={onKeyUp}
          onCompositionstart={onCompositionStart}
          onCompositionend={onCompositionEnd}
          onBlur={onBlur}
          autoSize={props.autoSize === undefined || props.autoSize}
        />
        <EnterOutlined class={`${props.prefixCls}-edit-content-confirm`} />
      </div>
    );
  },
});

export default Editable;
