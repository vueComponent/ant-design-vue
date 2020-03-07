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
      resizing: false,
    };
  },
  mixins: [BaseMixin],
  mounted() {
    this.resizeTextarea();
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
      this.setState({ textareaStyles, resizing: true }, () => {
        raf.cancel(this.resizeFrameId);
        this.resizeFrameId = raf(() => {
          this.setState({ resizing: false });
        });
      });
    },

    renderTextArea() {
      const props = getOptionProps(this);
      const { prefixCls, autoSize, autosize, disabled } = props;
      const { textareaStyles, resizing } = this.$data;
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
        ...(resizing ? { overflow: 'hidden' } : null),
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
        <ResizeObserver onResize={this.resizeOnNextFrame} disabled={!(autoSize || autosize)}>
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
