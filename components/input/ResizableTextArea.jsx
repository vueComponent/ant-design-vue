import ResizeObserver from '../vc-resize-observer';
import omit from 'omit.js';
import classNames from '../_util/classNames';
import calculateNodeHeight from './calculateNodeHeight';
import raf from '../_util/raf';
import warning from '../_util/warning';
import BaseMixin from '../_util/BaseMixin';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';
import syncWatch from '../_util/syncWatch';

const RESIZE_STATUS_NONE = 0;
const RESIZE_STATUS_RESIZING = 1;
const RESIZE_STATUS_RESIZED = 2;

const TextAreaProps = {
  ...inputProps,
  autosize: PropTypes.oneOfType([Object, Boolean]),
  autoSize: PropTypes.oneOfType([Object, Boolean]),
  onResize: PropTypes.func,
};
const ResizableTextArea = {
  name: 'ResizableTextArea',
  inheritAttrs: false,
  props: TextAreaProps,
  data() {
    return {
      textareaStyles: {},
      resizeStatus: RESIZE_STATUS_NONE,
    };
  },
  mixins: [BaseMixin],
  mounted() {
    this.resizeTextarea();
  },
  beforeUnmount() {
    raf.cancel(this.nextFrameActionId);
    raf.cancel(this.resizeFrameId);
  },
  watch: {
    value: syncWatch(function() {
      this.$nextTick(() => {
        this.resizeTextarea();
      });
    }),
  },
  methods: {
    saveTextArea(textArea) {
      this.textArea = textArea;
    },
    handleResize(size) {
      const { resizeStatus } = this.$data;

      if (resizeStatus !== RESIZE_STATUS_NONE) {
        return;
      }
      this.$emit('resize', size);
    },
    resizeOnNextFrame() {
      raf.cancel(this.nextFrameActionId);
      this.nextFrameActionId = raf(this.resizeTextarea);
    },

    resizeTextarea() {
      const autoSize = this.$props.autoSize || this.$props.autosize;
      if (!autoSize || !this.textArea) {
        return;
      }
      const { minRows, maxRows } = autoSize;
      const textareaStyles = calculateNodeHeight(this.textArea, false, minRows, maxRows);
      this.setState({ textareaStyles, resizeStatus: RESIZE_STATUS_RESIZING }, () => {
        raf.cancel(this.resizeFrameId);
        this.resizeFrameId = raf(() => {
          this.setState({ resizeStatus: RESIZE_STATUS_RESIZED }, () => {
            this.resizeFrameId = raf(() => {
              this.setState({ resizeStatus: RESIZE_STATUS_NONE });
              this.fixFirefoxAutoScroll();
            });
          });
        });
      });
    },
    // https://github.com/ant-design/ant-design/issues/21870
    fixFirefoxAutoScroll() {
      try {
        if (document.activeElement === this.textArea) {
          const currentStart = this.textArea.selectionStart;
          const currentEnd = this.textArea.selectionEnd;
          this.textArea.setSelectionRange(currentStart, currentEnd);
        }
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    },

    renderTextArea() {
      const props = { ...getOptionProps(this), ...this.$attrs };
      const { prefixCls, autoSize, autosize, disabled, class: className } = props;
      const { textareaStyles, resizeStatus } = this.$data;
      warning(
        autosize === undefined,
        'Input.TextArea',
        'autosize is deprecated, please use autoSize instead.',
      );
      const otherProps = omit(props, [
        'prefixCls',
        'onPressEnter',
        'autoSize',
        'autosize',
        'defaultValue',
        'allowClear',
        'type',
        'lazy',
      ]);
      const cls = classNames(prefixCls, className, {
        [`${prefixCls}-disabled`]: disabled,
      });
      // Fix https://github.com/ant-design/ant-design/issues/6776
      // Make sure it could be reset when using form.getFieldDecorator
      if ('value' in otherProps) {
        otherProps.value = otherProps.value || '';
      }
      const style = {
        ...props.style,
        ...textareaStyles,
        ...(resizeStatus === RESIZE_STATUS_RESIZING
          ? { overflowX: 'hidden', overflowY: 'hidden' }
          : null),
      };
      const textareaProps = {
        ...otherProps,
        style,
        class: cls,
      };
      if (!textareaProps.autofocus) {
        delete textareaProps.autofocus;
      }
      return (
        <ResizeObserver onResize={this.handleResize} disabled={!(autoSize || autosize)}>
          <textarea {...textareaProps} ref={this.saveTextArea} />
        </ResizeObserver>
      );
    },
  },

  render() {
    return this.renderTextArea();
  },
};

export default ResizableTextArea;
