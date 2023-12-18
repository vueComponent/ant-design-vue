import LocaleReceiver from '../locale-provider/LocaleReceiver';
import warning from '../_util/warning';
import TransButton from '../_util/transButton';
import raf from '../_util/raf';
import { isStyleSupport } from '../_util/styleChecker';
import Editable from './Editable';
import measure from './util';
import type { TypographyProps } from './Typography';
import Typography from './Typography';
import ResizeObserver from '../vc-resize-observer';
import Tooltip from '../tooltip';
import copy from '../_util/copy-to-clipboard';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CopyOutlined from '@ant-design/icons-vue/CopyOutlined';
import EditOutlined from '@ant-design/icons-vue/EditOutlined';
import type { VNodeTypes, CSSProperties, PropType, HTMLAttributes } from 'vue';
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  watchEffect,
  nextTick,
  computed,
  toRaw,
} from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { EventHandler } from '../_util/EventInterface';
import omit from '../_util/omit';
import type { AutoSizeType } from '../input/inputProps';
import useMergedState from '../_util/hooks/useMergedState';
import { findDOMNode } from '../_util/props-util';

export type BaseType = 'secondary' | 'success' | 'warning' | 'danger';

const isLineClampSupport = isStyleSupport('webkitLineClamp');
const isTextOverflowSupport = isStyleSupport('textOverflow');

export interface CopyConfig {
  text?: string;
  onCopy?: (event?: MouseEvent) => void;
  tooltip?: boolean;
}

export interface EditConfig {
  editing?: boolean;
  tooltip?: boolean;
  onStart?: () => void;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onEnd?: () => void;
  maxlength?: number;
  autoSize?: boolean | AutoSizeType;
  triggerType?: ('icon' | 'text')[];
}

export interface EllipsisConfig {
  rows?: number;
  expandable?: boolean;
  suffix?: string;
  symbol?: string;
  onExpand?: EventHandler;
  onEllipsis?: (ellipsis: boolean) => void;
  tooltip?: any;
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

export const baseProps = () => ({
  editable: {
    type: [Boolean, Object] as PropType<InternalBlockProps['editable']>,
    default: undefined as InternalBlockProps['editable'],
  },
  copyable: {
    type: [Boolean, Object] as PropType<InternalBlockProps['copyable']>,
    default: undefined as InternalBlockProps['copyable'],
  },
  prefixCls: String,
  component: String,
  type: String as PropType<BaseType>,
  disabled: { type: Boolean, default: undefined },
  ellipsis: {
    type: [Boolean, Object] as PropType<InternalBlockProps['ellipsis']>,
    default: undefined as InternalBlockProps['ellipsis'],
  },
  code: { type: Boolean, default: undefined },
  mark: { type: Boolean, default: undefined },
  underline: { type: Boolean, default: undefined },
  delete: { type: Boolean, default: undefined },
  strong: { type: Boolean, default: undefined },
  keyboard: { type: Boolean, default: undefined },
  content: String,
  'onUpdate:content': Function as PropType<(content: string) => void>,
});

const Base = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TypographyBase',
  inheritAttrs: false,
  props: baseProps(),
  // emits: ['update:content'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject('typography', props);

    const state = reactive({
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

      originContent: '',
    });

    const contentRef = ref();
    const editIcon = ref();
    const ellipsis = computed((): EllipsisConfig => {
      const ellipsis = props.ellipsis;
      if (!ellipsis) return {};

      return {
        rows: 1,
        expandable: false,
        ...(typeof ellipsis === 'object' ? ellipsis : null),
      };
    });
    onMounted(() => {
      state.clientRendered = true;
      syncEllipsis();
    });

    onBeforeUnmount(() => {
      clearTimeout(state.copyId);
      raf.cancel(state.rafId);
    });

    watch(
      [() => ellipsis.value.rows, () => props.content],
      () => {
        nextTick(() => {
          resizeOnNextFrame();
        });
      },
      { flush: 'post', deep: true },
    );

    watchEffect(() => {
      if (props.content === undefined) {
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

    function getChildrenText(): string {
      return props.ellipsis || props.editable
        ? props.content
        : findDOMNode(contentRef.value)?.innerText;
    }

    // =============== Expand ===============
    function onExpandClick(e: MouseEvent) {
      const { onExpand } = ellipsis.value;
      state.expanded = true;
      onExpand?.(e);
    }
    // ================ Edit ================
    function onEditClick(e: MouseEvent) {
      e.preventDefault();
      state.originContent = props.content;
      triggerEdit(true);
    }

    function onEditChange(value: string) {
      onContentChange(value);
      triggerEdit(false);
    }
    function onContentChange(value: string) {
      const { onChange } = editable.value;
      if (value !== props.content) {
        emit('update:content', value);
        onChange?.(value);
      }
    }

    function onEditCancel() {
      editable.value.onCancel?.();
      triggerEdit(false);
    }

    // ================ Copy ================
    function onCopyClick(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
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
          copyConfig.onCopy(e);
        }

        state.copyId = setTimeout(() => {
          state.copied = false;
        }, 3000);
      });
    }

    const editable = computed(() => {
      const editable = props.editable;
      if (!editable) return { editing: false };

      return {
        ...(typeof editable === 'object' ? editable : null),
      };
    });

    const [editing, setEditing] = useMergedState(false, {
      value: computed(() => {
        return editable.value.editing;
      }),
    });

    function triggerEdit(edit: boolean) {
      const { onStart } = editable.value;
      if (edit && onStart) {
        onStart();
      }

      setEditing(edit);
    }
    watch(
      editing,
      val => {
        if (!val) {
          editIcon.value?.focus();
        }
      },
      { flush: 'post' },
    );

    // ============== Ellipsis ==============
    function resizeOnNextFrame(sizeInfo?: { width: number; height: number }) {
      if (sizeInfo) {
        const { width, height } = sizeInfo;
        if (!width || !height) return;
      }

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
      if (
        !rows ||
        rows < 0 ||
        !findDOMNode(contentRef.value) ||
        state.expanded ||
        props.content === undefined
      )
        return;

      // Do not measure if css already support ellipsis
      if (canUseCSSEllipsis.value) return;

      const {
        content,
        text,
        ellipsis: ell,
      } = measure(
        findDOMNode(contentRef.value),
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
      const expandContent =
        (slots.ellipsisSymbol ? slots.ellipsisSymbol() : symbol) || state.expandStr;

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

      const { tooltip, triggerType = ['icon'] } = props.editable as EditConfig;
      const icon = slots.editableIcon ? slots.editableIcon() : <EditOutlined role="button" />;
      const title = slots.editableTooltip ? slots.editableTooltip() : state.editStr;
      const ariaLabel = typeof title === 'string' ? title : '';

      return triggerType.indexOf('icon') !== -1 ? (
        <Tooltip key="edit" title={tooltip === false ? '' : title}>
          <TransButton
            ref={editIcon}
            class={`${prefixCls.value}-edit`}
            onClick={onEditClick}
            aria-label={ariaLabel}
          >
            {icon}
          </TransButton>
        </Tooltip>
      ) : null;
    }

    function renderCopy() {
      if (!props.copyable) return;

      const { tooltip } = props.copyable as CopyConfig;
      const defaultTitle = state.copied ? state.copiedStr : state.copyStr;
      const title = slots.copyableTooltip
        ? slots.copyableTooltip({ copied: state.copied })
        : defaultTitle;
      const ariaLabel = typeof title === 'string' ? title : '';
      const defaultIcon = state.copied ? <CheckOutlined /> : <CopyOutlined />;
      const icon = slots.copyableIcon
        ? slots.copyableIcon({ copied: !!state.copied })
        : defaultIcon;

      return (
        <Tooltip key="copy" title={tooltip === false ? '' : title}>
          <TransButton
            class={[
              `${prefixCls.value}-copy`,
              { [`${prefixCls.value}-copy-success`]: state.copied },
            ]}
            onClick={onCopyClick}
            aria-label={ariaLabel}
          >
            {icon}
          </TransButton>
        </Tooltip>
      );
    }

    function renderEditInput() {
      const { class: className, style } = attrs;
      const { maxlength, autoSize, onEnd } = editable.value;

      return (
        <Editable
          class={className}
          style={style}
          prefixCls={prefixCls.value}
          value={props.content}
          originContent={state.originContent}
          maxlength={maxlength}
          autoSize={autoSize}
          onSave={onEditChange}
          onChange={onContentChange}
          onCancel={onEditCancel}
          onEnd={onEnd}
          direction={direction.value}
          component={props.component}
          v-slots={{ enterIcon: slots.editableEnterIcon }}
        />
      );
    }

    function renderOperations(forceRenderExpanded?: boolean) {
      return [renderExpand(forceRenderExpanded), renderEdit(), renderCopy()].filter(node => node);
    }

    return () => {
      const { triggerType = ['icon'] } = editable.value;
      const children =
        props.ellipsis || props.editable
          ? props.content !== undefined
            ? props.content
            : slots.default?.()
          : slots.default
          ? slots.default()
          : props.content;

      if (editing.value) {
        return renderEditInput();
      }
      return (
        <LocaleReceiver
          componentName="Text"
          children={(locale: Locale) => {
            const {
              type,
              disabled,
              content,
              class: className,
              style,
              ...restProps
            } = {
              ...props,
              ...(attrs as HTMLAttributes),
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
              'onUpdate:content',
            ]);
            const cssEllipsis = canUseCSSEllipsis.value;
            const cssTextOverflow = rows === 1 && cssEllipsis;
            const cssLineClamp = rows && rows > 1 && cssEllipsis;

            let textNode = children as VNodeTypes;
            let ariaLabel: string | undefined;

            // Only use js ellipsis when css ellipsis not support
            if (rows && state.isEllipsis && !state.expanded && !cssEllipsis) {
              const { title } = restProps;
              let restContent = title || '';

              if (!title && (typeof children === 'string' || typeof children === 'number')) {
                restContent = String(children);
              }

              // show rest content as title on symbol
              restContent = restContent?.slice(String(state.ellipsisContent || '').length);
              // We move full content to outer element to avoid repeat read the content by accessibility
              textNode = (
                <>
                  {toRaw(state.ellipsisContent)}
                  <span title={restContent} aria-hidden="true">
                    {ELLIPSIS_STR}
                  </span>
                  {suffix}
                </>
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

            const showTooltip =
              tooltip && rows && state.isEllipsis && !state.expanded && !cssEllipsis;
            const title = slots.ellipsisTooltip ? slots.ellipsisTooltip() : tooltip;
            return (
              <ResizeObserver onResize={resizeOnNextFrame} disabled={!rows}>
                <Typography
                  ref={contentRef}
                  class={[
                    {
                      [`${prefixCls.value}-${type}`]: type,
                      [`${prefixCls.value}-disabled`]: disabled,
                      [`${prefixCls.value}-ellipsis`]: rows,
                      [`${prefixCls.value}-single-line`]: rows === 1 && !state.isEllipsis,
                      [`${prefixCls.value}-ellipsis-single-line`]: cssTextOverflow,
                      [`${prefixCls.value}-ellipsis-multiple-line`]: cssLineClamp,
                    },
                    className,
                  ]}
                  style={{
                    ...(style as CSSProperties),
                    WebkitLineClamp: cssLineClamp ? rows : undefined,
                  }}
                  aria-label={ariaLabel}
                  direction={direction.value}
                  onClick={triggerType.indexOf('text') !== -1 ? onEditClick : () => {}}
                  {...textProps}
                >
                  {showTooltip ? (
                    <Tooltip title={tooltip === true ? children : title}>
                      <span>{textNode}</span>
                    </Tooltip>
                  ) : (
                    textNode
                  )}
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

export default Base;
