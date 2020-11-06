import ResizeObserver from '../vc-resize-observer';
import omit from 'omit.js';
import classNames from 'classnames';
import calculateNodeHeight from './calculateNodeHeight';
import raf from '../_util/raf';
import warning from '../_util/warning';
import BaseMixin from '../_util/BaseMixin';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getListeners } from '../_util/props-util';

const RESIZE_STATUS_NONE = 0;
const RESIZE_STATUS_RESIZING = 1;
const RESIZE_STATUS_RESIZED = 2;

const TextAreaProps = {
  ...inputProps,
  autosize: PropTypes.oneOfType([Object, Boolean]),
  autoSize: PropTypes.oneOfType([Object, Boolean]),
};
const ResizableTextArea = {
  name: 'ResizableTextArea',
  props: TextAreaProps,
  data() {
    return {
      textareaStyles: {},
      resizeStatus: RESIZE_STATUS_NONE,
    };
  },
  mixins: [BaseMixin],
  mounted() {
    this.$nextTick(() => {
      this.resizeTextarea();
    });
  },
  beforeDestroy() {
    raf.cancel(this.nextFrameActionId);
    raf.cancel(this.resizeFrameId);
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.resizeTextarea();
      });
    },
  },
  methods: {
    handleResize(size) {
      const { resizeStatus } = this.$data;
      const { autoSize } = this.$props;

      if (resizeStatus !== RESIZE_STATUS_NONE) {
        return;
      }
      this.$emit('resize', size);
      if (autoSize) {
        this.resizeOnNextFrame();
      }
    },
    resizeOnNextFrame() {
      raf.cancel(this.nextFrameActionId);
      this.nextFrameActionId = raf(this.resizeTextarea);
    },

    resizeTextarea() {
      const autoSize = this.$props.autoSize || this.$props.autosize;
      if (!autoSize || !this.$refs.textArea) {
        return;
      }
      const { minRows, maxRows } = autoSize;
      const textareaStyles = calculateNodeHeight(this.$refs.textArea, false, minRows, maxRows);
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
        if (document.activeElement === this.$refs.textArea) {
          const currentStart = this.$refs.textArea.selectionStart;
          const currentEnd = this.$refs.textArea.selectionEnd;
          this.$refs.textArea.setSelectionRange(currentStart, currentEnd);
        }
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    },

    renderTextArea() {
      const props = getOptionProps(this);
      const { prefixCls, autoSize, autosize, disabled } = props;
      const { textareaStyles, resizeStatus } = this.$data;
      warning(
        autosize === undefined,
        'Input.TextArea',
        'autosize is deprecated, please use autoSize instead.',
      );
      const otherProps = omit(props, [
        'prefixCls',
        'autoSize',
        'autosize',
        'defaultValue',
        'allowClear',
        'type',
        'lazy',
        'value',
      ]);
      const cls = classNames(prefixCls, {
        [`${prefixCls}-disabled`]: disabled,
      });
      const domProps = {};
      // Fix https://github.com/ant-design/ant-design/issues/6776
      // Make sure it could be reset when using form.getFieldDecorator
      if ('value' in props) {
        domProps.value = props.value || '';
      }
      const style = {
        ...textareaStyles,
        ...(resizeStatus === RESIZE_STATUS_RESIZING
          ? { overflowX: 'hidden', overflowY: 'hidden' }
          : null),
      };
      const textareaProps = {
        attrs: otherProps,
        domProps,
        style,
        class: cls,
        on: omit(getListeners(this), 'pressEnter'),
        directives: [
          {
            name: 'ant-input',
          },
        ],
      };
      return (
        <ResizeObserver onResize={this.handleResize} disabled={!(autoSize || autosize)}>
          <textarea {...textareaProps} ref="textArea" />
        </ResizeObserver>
      );
    },
  },

  render() {
    return this.renderTextArea();
  },
};

export default ResizableTextArea;
