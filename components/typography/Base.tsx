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
import { defaultConfigProvider } from '../config-provider';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CopyOutlined from '@ant-design/icons-vue/CopyOutlined';
import EditOutlined from '@ant-design/icons-vue/EditOutlined';
import {
  defineComponent,
  inject,
  VNodeTypes,
  Text,
  VNode,
  reactive,
  ref,
  onMounted,
  onUpdated,
  onBeforeUnmount,
  watch,
  watchEffect,
  nextTick,
  CSSProperties,
  toRaw,
} from 'vue';
import { filterEmpty } from '../_util/props-util';
import { AutoSizeType } from '../input/ResizableTextArea';

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
  maxLength?: number;
  autoSize?: boolean | AutoSizeType;
}

export interface EllipsisConfig {
  rows?: number;
  expandable?: boolean;
  suffix?: string;
  symbol?: VNodeTypes;
  onExpand?: EventHandlerNonNull;
  onEllipsis?: (ellipsis: boolean) => void;
  tooltip?: VNodeTypes;
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
    const configProvider = inject('configProvider', defaultConfigProvider);

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

    onMounted(() => {
      state.prevProps = { ...props, children: getChildren() };
      state.clientRendered = true;
      resizeOnNextFrame();
    });

    onUpdated(() => {
      const ellipsis = getEllipsis();
      const prevEllipsis = getEllipsis(state.prevProps);
      const children = getChildren();

      if (
        JSON.stringify(children) !== JSON.stringify(toRaw(state.prevProps.children)) ||
        ellipsis.rows !== prevEllipsis.rows
      ) {
        resizeOnNextFrame();
      }
      state.prevProps = { ...props, children };
    });

    onBeforeUnmount(() => {
      window.clearTimeout(state.copyId);
      raf.cancel(state.rafId);
    });

    watch(
      () => props.ellipsis,
      () => {
        resizeOnNextFrame();
      },
    );

    watchEffect(() => {
      const children = getChildren();

      warning(
        !props.editable || children.every(item => item.type === Text),
        'Typography',
        'When `editable` is enabled, the `children` should use string.',
      );
    });

    function getChildren() {
      return filterEmpty(slots.default?.());
    }

    function saveTypographyRef(node: VNode) {
      contentRef.value = node;
    }

    function saveEditIconRef(node: VNode) {
      editIcon.value = node;
    }

    function getChildrenText(): string {
      const children = getChildren();
      return children.length !== 0
        ? children
            .filter(item => item.type === Text)
            .map(item => item.children)
            .reduce((cur, prev) => cur + prev, '')
        : '';
    }

    // =============== Expand ===============
    function onExpandClick(e: MouseEvent) {
      const { onExpand } = getEllipsis();
      state.expanded = true;

      if (onExpand) {
        onExpand(e);
      }
    }
    // ================ Edit ================
    function onEditClick() {
      triggerEdit(true);
    }

    function onEditChange(value: string) {
      const { onChange } = getEditable();
      if (onChange) {
        onChange(value);
      }

      triggerEdit(false);
    }

    function onEditCancel() {
      triggerEdit(false);
    }

    // ================ Copy ================
    function onCopyClick() {
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

    function getEditable($props?: BlockProps): EditConfig {
      const editable = ($props || props).editable;
      if (!editable) return { editing: state.edit };

      return {
        editing: state.edit,
        ...(typeof editable === 'object' ? editable : null),
      };
    }

    function getEllipsis($props?: BlockProps): EllipsisConfig {
      const ellipsis = ($props || props).ellipsis;
      if (!ellipsis) return {};

      return {
        rows: 1,
        expandable: false,
        ...(typeof ellipsis === 'object' ? ellipsis : null),
      };
    }

    function triggerEdit(edit: boolean) {
      const { onStart } = getEditable();
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

    function canUseCSSEllipsis(): boolean {
      const { rows, expandable, suffix } = getEllipsis();

      if (suffix) return false;

      // Can't use css ellipsis since we need to provide the place for button
      if (props.editable || props.copyable || expandable || !state.clientRendered) {
        return false;
      }

      if (rows === 1) {
        return isTextOverflowSupport;
      }

      return isLineClampSupport;
    }

    function syncEllipsis() {
      const { ellipsisText, isEllipsis } = state;
      const children = getChildren();
      const { rows, suffix, onEllipsis } = getEllipsis();
      if (!rows || rows < 0 || !contentRef.value?.$el || state.expanded) return;

      // Do not measure if css already support ellipsis
      if (canUseCSSEllipsis()) return;

      warning(
        children.every(item => item.type === Text),
        'Typography',
        '`ellipsis` should use string as children only.',
      );

      const { content, text, ellipsis } = measure(
        contentRef.value?.$el,
        { rows, suffix },
        children,
        renderOperations(true),
        ELLIPSIS_STR,
      );

      if (ellipsisText !== text || state.isEllipsis !== ellipsis) {
        state.ellipsisText = text;
        state.ellipsisContent = content;
        state.isEllipsis = ellipsis;
        if (isEllipsis !== ellipsis && onEllipsis) {
          onEllipsis(ellipsis);
        }
      }
    }

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
      const { expandable, symbol } = getEllipsis();
      const prefixCls = getPrefixCls();

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
          class={`${prefixCls}-expand`}
          onClick={onExpandClick}
          aria-label={state.expandStr}
        >
          {expandContent}
        </a>
      );
    }

    function renderEdit() {
      if (!props.editable) return;

      const prefixCls = getPrefixCls();
      const { icon, tooltip } = props.editable as EditConfig;

      const title = tooltip || state.editStr;
      const ariaLabel = typeof title === 'string' ? title : '';

      return (
        <Tooltip key="edit" title={tooltip === false ? '' : title}>
          <TransButton
            ref={saveEditIconRef}
            class={`${prefixCls}-edit`}
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

      const prefixCls = getPrefixCls();

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
            class={[`${prefixCls}-copy`, { [`${prefixCls}-copy-success`]: state.copied }]}
            onClick={onCopyClick}
            aria-label={ariaLabel}
          >
            {state.copied ? icons[1] || <CheckOutlined /> : icons[0] || <CopyOutlined />}
          </TransButton>
        </Tooltip>
      );
    }

    function renderEditInput() {
      const prefixCls = getPrefixCls();
      const { class: className, style } = attrs;
      const { maxLength, autoSize } = getEditable();

      const value = getChildrenText();

      return (
        <Editable
          class={className}
          style={style}
          prefixCls={prefixCls}
          value={value}
          maxlength={maxLength}
          autoSize={autoSize}
          onSave={onEditChange}
          onCancel={onEditCancel}
        />
      );
    }

    function renderOperations(forceRenderExpanded?: boolean) {
      return [renderExpand(forceRenderExpanded), renderEdit(), renderCopy()].filter(node => node);
    }

    function getPrefixCls() {
      const getPrefixCls = configProvider.getPrefixCls;
      return getPrefixCls('typography', props.prefixCls);
    }

    return () => {
      const { editing } = getEditable();
      const children = filterEmpty(slots.default?.());

      if (editing) {
        return renderEditInput();
      }
      return (
        <LocaleReceiver
          componentName="Text"
          children={(locale: Locale) => {
            const { type, disabled, title, ...restProps } = props;
            const { class: className, style } = attrs;
            const { rows, suffix } = getEllipsis();

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

            const cssEllipsis = canUseCSSEllipsis();
            const cssTextOverflow = rows === 1 && cssEllipsis;
            const cssLineClamp = rows && rows > 1 && cssEllipsis;

            let textNode = children as VNodeTypes;
            let ariaLabel: string | undefined;

            // Only use js ellipsis when css ellipsis not support
            if (rows && state.isEllipsis && !state.expanded && !cssEllipsis) {
              ariaLabel = title;
              if (!title && children.every(item => item.type === Text)) {
                ariaLabel = children
                  .map(item => item.children)
                  .reduce((cur, prev) => cur + prev, '');
              }
              // We move full content to outer element to avoid repeat read the content by accessibility
              textNode = (
                <span title={ariaLabel} aria-hidden="true">
                  {toRaw(state.ellipsisContent)}
                  {ELLIPSIS_STR}
                  {suffix}
                </span>
              );
            } else {
              textNode = (
                <>
                  {children}
                  {suffix}
                </>
              );
            }

            textNode = wrapperDecorations(props, textNode);

            const prefixCls = getPrefixCls();

            return (
              <ResizeObserver onResize={resizeOnNextFrame} disabled={!rows}>
                <Typography
                  ref={saveTypographyRef}
                  class={[
                    { [`${prefixCls}-${type}`]: type },
                    { [`${prefixCls}-disabled`]: disabled },
                    { [`${prefixCls}-ellipsis`]: rows },
                    { [`${prefixCls}-ellipsis-single-line`]: cssTextOverflow },
                    { [`${prefixCls}-ellipsis-multiple-line`]: cssLineClamp },
                    className,
                  ]}
                  style={{
                    ...(style as CSSProperties),
                    WebkitLineClamp: cssLineClamp ? rows : null,
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

Base.props = {
  editable: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
  copyable: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
  prefixCls: PropTypes.string,
  component: PropTypes.string,
  type: PropTypes.oneOf(['secondary', 'danger', 'warning']),
  disabled: PropTypes.bool,
  ellipsis: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]),
  code: PropTypes.bool,
  mark: PropTypes.bool,
  underline: PropTypes.bool,
  delete: PropTypes.bool,
  strong: PropTypes.bool,
  keyboard: PropTypes.bool,
};

export default Base;
