import omit from 'omit.js';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import warning from '../_util/warning';
import TransButton from '../_util/transButton';
import raf from '../_util/raf';
import isStyleSupport from '../_util/styleChecker';
import Editable from './Editable';
import measure from './util';
import PropTypes from '../_util/vue-types';
import Typography, { TypographyProps } from './Typography';
import ResizeObserver from '../vc-resize-observer';
import Tooltip from '../tooltip';
import copy from '../_util/copy-to-clipboard';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CopyOutlined from '@ant-design/icons-vue/CopyOutlined';
import EditOutlined from '@ant-design/icons-vue/EditOutlined';
import {
  defineComponent,
  VNodeTypes,
  VNode,
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  watchEffect,
  nextTick,
  CSSProperties,
  toRaw,
  computed,
} from 'vue';
import { AutoSizeType } from '../input/ResizableTextArea';
import useConfigInject from '../_util/hooks/useConfigInject';

export type BaseType = 'secondary' | 'success' | 'warning' | 'danger';

const isLineClampSupport = isStyleSupport('webkitLineClamp');
const isTextOverflowSupport = isStyleSupport('textOverflow');

function toArray(value: any) {
  let ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

interface CopyConfig {
  text?: string;
  onCopy?: () => void;
  icon?: VNodeTypes;
  tooltips?: boolean | VNodeTypes;
}

interface EditConfig {
  editing?: boolean;
  icon?: VNodeTypes;
  tooltip?: boolean | VNodeTypes;
  onStart?: () => void;
  onChange?: (value: string) => void;
  maxlength?: number;
  autoSize?: boolean | AutoSizeType;
}

export interface EllipsisConfig {
  rows?: number;
  expandable?: boolean;
  suffix?: string;
  symbol?: VNodeTypes;
  onExpand?: EventHandlerNonNull;
  onEllipsis?: (ellipsis: boolean) => void;
  tooltip?: boolean | VNodeTypes;
}

export interface BlockProps extends TypographyProps {
  title?: string;
  editable?: boolean | EditConfig;
  copyable?: boolean | CopyConfig;
  type?: BaseType;
  disabled?: boolean;
  ellipsis?: boolean | EllipsisConfig;
  // decorations
  code?: boolean;
  mark?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  keyboard?: boolean;
  content?: string;
}

interface Locale {
  edit?: string;
  copy?: string;
  copied?: string;
  expand?: string;
}

interface InternalBlockProps extends BlockProps {
  component: string;
}

const ELLIPSIS_STR = '...';

const Base = defineComponent<InternalBlockProps>({
  name: 'Base',
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('typography', props);

    const state = reactive({
      edit: false,
      copied: false,
      ellipsisText: '',
      ellipsisContent: null,
      isEllipsis: false,
      expanded: false,
      clientRendered: false,
      //locale
      expandStr: '',
      copyStr: '',
      copiedStr: '',
      editStr: '',

      copyId: undefined,
      rafId: undefined,
      prevProps: undefined,
    });

    const contentRef = ref();
    const editIcon = ref();
    const ellipsis = computed(
      (): EllipsisConfig => {
        const ellipsis = props.ellipsis;
        if (!ellipsis) return {};

        return {
          rows: 1,
          expandable: false,
          ...(typeof ellipsis === 'object' ? ellipsis : null),
        };
      },
    );
    onMounted(() => {
      state.clientRendered = true;
    });

    onBeforeUnmount(() => {
      window.clearTimeout(state.copyId);
      raf.cancel(state.rafId);
    });

    watch(
      [() => ellipsis.value.rows, () => props.content],
      () => {
        nextTick(() => {
          resizeOnNextFrame();
        });
      },
      { flush: 'post', deep: true, immediate: true },
    );

    watchEffect(() => {
      if (!('content' in props)) {
        warning(
          !props.editable,
          'Typography',
          'When `editable` is enabled, please use `content` instead of children',
        );
        warning(
          !props.ellipsis,
          'Typography',
          'When `ellipsis` is enabled, please use `content` instead of children',
        );
      }
    });

    function saveTypographyRef(node: VNode) {
      contentRef.value = node;
    }

    function saveEditIconRef(node: VNode) {
      editIcon.value = node;
    }

    function getChildrenText(): string {
      return props.ellipsis || props.editable ? props.content : contentRef.value.text;
    }

    // =============== Expand ===============
    function onExpandClick(e: MouseEvent) {
      const { onExpand } = ellipsis.value;
      state.expanded = true;
      onExpand?.(e);
    }
    // ================ Edit ================
    function onEditClick() {
      triggerEdit(true);
    }

    function onEditChange(value: string) {
      const { onChange } = editable.value;
      onChange?.(value);

      triggerEdit(false);
    }

    function onEditCancel() {
      triggerEdit(false);
    }

    // ================ Copy ================
    function onCopyClick(e: MouseEvent) {
      e.preventDefault();
      const { copyable } = props;

      const copyConfig = {
        ...(typeof copyable === 'object' ? copyable : null),
      };

      if (copyConfig.text === undefined) {
        copyConfig.text = getChildrenText();
      }

      copy(copyConfig.text || '');

      state.copied = true;
      nextTick(() => {
        if (copyConfig.onCopy) {
          copyConfig.onCopy();
        }

        state.copyId = window.setTimeout(() => {
          state.copied = false;
        }, 3000);
      });
    }
    const editable = computed(() => {
      const editable = props.editable;
      if (!editable) return { editing: state.edit };

      return {
        editing: state.edit,
        ...(typeof editable === 'object' ? editable : null),
      };
    });

    function triggerEdit(edit: boolean) {
      const { onStart } = editable.value;
      if (edit && onStart) {
        onStart();
      }

      state.edit = edit;
      nextTick(() => {
        if (!edit) {
          editIcon.value?.focus();
        }
      });
    }

    // ============== Ellipsis ==============
    function resizeOnNextFrame() {
      raf.cancel(state.rafId);
      state.rafId = raf(() => {
        // Do not bind `syncEllipsis`. It need for test usage on prototype
        syncEllipsis();
      });
    }

    const canUseCSSEllipsis = computed(() => {
      const { rows, expandable, suffix, onEllipsis, tooltip } = ellipsis.value;

      if (suffix || tooltip) return false;

      // Can't use css ellipsis since we need to provide the place for button
      if (props.editable || props.copyable || expandable || onEllipsis) {
        return false;
      }

      if (rows === 1) {
        return isTextOverflowSupport;
      }

      return isLineClampSupport;
    });

    const syncEllipsis = () => {
      const { ellipsisText, isEllipsis } = state;
      const { rows, suffix, onEllipsis } = ellipsis.value;
      if (!rows || rows < 0 || !contentRef.value?.$el || state.expanded) return;

      // Do not measure if css already support ellipsis
      if (canUseCSSEllipsis.value) return;

      const { content, text, ellipsis: ell } = measure(
        contentRef.value?.$el,
        { rows, suffix },
        props.content,
        renderOperations(true),
        ELLIPSIS_STR,
      );

      if (ellipsisText !== text || state.isEllipsis !== ell) {
        state.ellipsisText = text;
        state.ellipsisContent = content;
        state.isEllipsis = ell;
        if (isEllipsis !== ell && onEllipsis) {
          onEllipsis(ell);
        }
      }
    };

    function wrapperDecorations(
      { mark, code, underline, delete: del, strong, keyboard }: BlockProps,
      content,
    ) {
      let currentContent = content;

      function wrap(needed: boolean, Tag: string) {
        if (!needed) return;

        currentContent = <Tag>{currentContent}</Tag>;
      }

      wrap(strong, 'strong');
      wrap(underline, 'u');
      wrap(del, 'del');
      wrap(code, 'code');
      wrap(mark, 'mark');
      wrap(keyboard, 'kbd');

      return currentContent;
    }

    function renderExpand(forceRender?: boolean) {
      const { expandable, symbol } = ellipsis.value;

      if (!expandable) return null;

      // force render expand icon for measure usage or it will cause dead loop
      if (!forceRender && (state.expanded || !state.isEllipsis)) return null;

      let expandContent;
      if (symbol) {
        expandContent = symbol;
      } else {
        expandContent = state.expandStr;
      }

      return (
        <a
          key="expand"
          class={`${prefixCls.value}-expand`}
          onClick={onExpandClick}
          aria-label={state.expandStr}
        >
          {expandContent}
        </a>
      );
    }

    function renderEdit() {
      if (!props.editable) return;

      const { icon, tooltip } = props.editable as EditConfig;

      const title = tooltip || state.editStr;
      const ariaLabel = typeof title === 'string' ? title : '';

      return (
        <Tooltip key="edit" title={tooltip === false ? '' : title}>
          <TransButton
            ref={saveEditIconRef}
            class={`${prefixCls.value}-edit`}
            onClick={onEditClick}
            aria-label={ariaLabel}
          >
            {icon || <EditOutlined role="button" />}
          </TransButton>
        </Tooltip>
      );
    }

    function renderCopy() {
      if (!props.copyable) return;

      const { tooltips } = props.copyable as CopyConfig;
      let tooltipNodes = toArray(tooltips) as VNodeTypes[];
      if (tooltipNodes.length === 0) {
        tooltipNodes = [state.copyStr, state.copiedStr];
      }
      const title = state.copied ? tooltipNodes[1] : tooltipNodes[0];
      const ariaLabel = typeof title === 'string' ? title : '';
      const icons = toArray((props.copyable as CopyConfig).icon);

      return (
        <Tooltip key="copy" title={tooltips === false ? '' : title}>
          <TransButton
            class={[
              `${prefixCls.value}-copy`,
              { [`${prefixCls.value}-copy-success`]: state.copied },
            ]}
            onClick={onCopyClick}
            aria-label={ariaLabel}
          >
            {state.copied ? icons[1] || <CheckOutlined /> : icons[0] || <CopyOutlined />}
          </TransButton>
        </Tooltip>
      );
    }

    function renderEditInput() {
      const { class: className, style } = attrs;
      const { maxlength, autoSize } = editable.value;

      return (
        <Editable
          class={className}
          style={style}
          prefixCls={prefixCls.value}
          value={props.content}
          maxlength={maxlength}
          autoSize={autoSize}
          onSave={onEditChange}
          onCancel={onEditCancel}
        />
      );
    }

    function renderOperations(forceRenderExpanded?: boolean) {
      return [renderExpand(forceRenderExpanded), renderEdit(), renderCopy()].filter(node => node);
    }

    return () => {
      const { editing } = editable.value;
      const children =
        props.ellipsis || props.editable
          ? props.content
          : slots.default
          ? slots.default()
          : props.content;

      if (editing) {
        return renderEditInput();
      }
      return (
        <LocaleReceiver
          componentName="Text"
          children={(locale: Locale) => {
            const { type, disabled, title, content, class: className, style, ...restProps } = {
              ...props,
              ...attrs,
            };
            const { rows, suffix, tooltip } = ellipsis.value;

            const { edit, copy: copyStr, copied, expand } = locale;

            state.editStr = edit;
            state.copyStr = copyStr;
            state.copiedStr = copied;
            state.expandStr = expand;

            const textProps = omit(restProps, [
              'prefixCls',
              'editable',
              'copyable',
              'ellipsis',
              'mark',
              'code',
              'delete',
              'underline',
              'strong',
              'keyboard',
            ]);

            const cssEllipsis = canUseCSSEllipsis.value;
            const cssTextOverflow = rows === 1 && cssEllipsis;
            const cssLineClamp = rows && rows > 1 && cssEllipsis;

            let textNode = children as VNodeTypes;
            let ariaLabel: string | undefined;

            // Only use js ellipsis when css ellipsis not support
            if (rows && state.isEllipsis && !state.expanded && !cssEllipsis) {
              ariaLabel = title;
              if (!title) {
                ariaLabel = content;
              }
              // We move full content to outer element to avoid repeat read the content by accessibility
              textNode = (
                <span title={ariaLabel} aria-hidden="true">
                  {toRaw(state.ellipsisContent)}
                  {ELLIPSIS_STR}
                  {suffix}
                </span>
              );
              // If provided tooltip, we need wrap with span to let Tooltip inject events
              if (tooltip) {
                textNode = (
                  <Tooltip title={tooltip === true ? children : tooltip}>
                    <span>{textNode}</span>
                  </Tooltip>
                );
              }
            } else {
              textNode = (
                <>
                  {children}
                  {suffix}
                </>
              );
            }

            textNode = wrapperDecorations(props, textNode);

            return (
              <ResizeObserver onResize={resizeOnNextFrame} disabled={!rows}>
                <Typography
                  ref={saveTypographyRef}
                  class={[
                    { [`${prefixCls.value}-${type}`]: type },
                    { [`${prefixCls.value}-disabled`]: disabled },
                    { [`${prefixCls.value}-ellipsis`]: rows },
                    { [`${prefixCls.value}-ellipsis-single-line`]: cssTextOverflow },
                    { [`${prefixCls.value}-ellipsis-multiple-line`]: cssLineClamp },
                    className,
                  ]}
                  style={{
                    ...(style as CSSProperties),
                    WebkitLineClamp: cssLineClamp ? rows : undefined,
                  }}
                  aria-label={ariaLabel}
                  {...textProps}
                >
                  {textNode}
                  {renderOperations()}
                </Typography>
              </ResizeObserver>
            );
          }}
        />
      );
    };
  },
});

export const baseProps = () => ({
  editable: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
  copyable: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
  prefixCls: PropTypes.string,
  component: PropTypes.string,
  type: PropTypes.oneOf(['secondary', 'success', 'danger', 'warning']),
  disabled: PropTypes.looseBool,
  ellipsis: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
  code: PropTypes.looseBool,
  mark: PropTypes.looseBool,
  underline: PropTypes.looseBool,
  delete: PropTypes.looseBool,
  strong: PropTypes.looseBool,
  keyboard: PropTypes.looseBool,
  content: PropTypes.string,
});

Base.props = baseProps();

export default Base;
