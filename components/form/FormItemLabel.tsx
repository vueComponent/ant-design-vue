import type { ColProps } from '../grid/Col';
import Col from '../grid/Col';
import type { FormLabelAlign } from './interface';
import { useInjectForm } from './context';
import type { RequiredMark } from './Form';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';
import classNames from '../_util/classNames';
import type { VueNode } from '../_util/type';
import type { FunctionalComponent, HTMLAttributes } from 'vue';
import Tooltip from '../tooltip/Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

export interface FormItemLabelProps {
  colon?: boolean;
  htmlFor?: string;
  label?: VueNode;
  subtitle?: string;
  labelTooltip?: string;
  labelExtra?: VueNode;
  labelExtraRight?: boolean;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps & HTMLAttributes;
  requiredMark?: RequiredMark;
  required?: boolean;
  prefixCls: string;
  onClick: Function;
}

const FormItemLabel: FunctionalComponent<FormItemLabelProps> = (props, { slots, emit, attrs }) => {
  const { prefixCls, htmlFor, labelCol, labelAlign, colon, required, requiredMark } = {
    ...props,
    ...attrs,
  };
  const [formLocale] = useLocaleReceiver('Form');
  const label = props.label ?? slots.label?.();
  if (!label) return null;
  const {
    vertical,
    labelAlign: contextLabelAlign,
    labelCol: contextLabelCol,
    labelWrap,
    colon: contextColon,
  } = useInjectForm();
  const mergedLabelCol: FormItemLabelProps['labelCol'] = labelCol || contextLabelCol?.value || {};

  const mergedLabelAlign: FormLabelAlign | undefined = labelAlign || contextLabelAlign?.value;

  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    mergedLabelAlign === 'left' && `${labelClsBasic}-left`,
    mergedLabelCol.class,
    {
      [`${labelClsBasic}-wrap`]: !!labelWrap.value,
      [`${prefixCls}-item-label-extra-right`]: props.labelExtra && props.labelExtraRight,
    },
  );

  let labelChildren = label;
  // Keep label is original where there should have no colon
  const computedColon = colon === true || (contextColon?.value !== false && colon !== false);
  const haveColon = computedColon && !vertical.value;
  // Remove duplicated user input colon
  if (haveColon && typeof label === 'string' && (label as string).trim() !== '') {
    labelChildren = (label as string).replace(/[:|：]\s*$/, '');
  }

  labelChildren = (
    <>
      {labelChildren}
      {slots.tooltip?.({ class: `${prefixCls}-item-tooltip` })}
    </>
  );

  // Add required mark if optional
  if (requiredMark === 'optional' && !required) {
    labelChildren = (
      <>
        {labelChildren}
        <span class={`${prefixCls}-item-optional`}>
          {formLocale.value?.optional || defaultLocale.Form?.optional}
        </span>
      </>
    );
  }

  // Add subtitle if have
  if (props.subtitle) {
    const isWrappedByChineseBrackets = /^（.*）$/.test(props.subtitle);
    labelChildren = (
      <>
        {labelChildren}
        <span
          class={classNames(`${prefixCls}-item-subtitle`, {
            [`${prefixCls}-item-subtitle-brackets-wrapped`]: isWrappedByChineseBrackets,
          })}
        >
          {props.subtitle}
        </span>
      </>
    );
  }

  // Add label tooltip if have
  if (props.labelTooltip) {
    labelChildren = (
      <>
        {labelChildren}
        <Tooltip
          class={`${prefixCls}-item-label-tooltip-icon`}
          placement="right"
          title={props.labelTooltip}
        >
          <QuestionCircleOutlined />
        </Tooltip>
      </>
    );
  }

  // Add label extra if have
  const labelExtra = props.labelExtra ?? slots.labelExtra?.();
  if (labelExtra) {
    labelChildren = (
      <>
        <span class={`${prefixCls}-item-label-content`}>{labelChildren}</span>
        {/* {labelExtra} */}
        <span class={`${prefixCls}-item-label-extra`}>{labelExtra}</span>
      </>
    );
  }

  const labelClassName = classNames({
    [`${prefixCls}-item-required`]: required,
    [`${prefixCls}-item-required-mark-optional`]: requiredMark === 'optional',
    [`${prefixCls}-item-no-colon`]: !computedColon,
  });
  return (
    <Col {...mergedLabelCol} class={labelColClassName}>
      <label
        for={htmlFor}
        class={labelClassName}
        title={typeof label === 'string' ? label : ''}
        onClick={e => emit('click', e)}
      >
        {labelChildren}
      </label>
    </Col>
  );
};

FormItemLabel.displayName = 'FormItemLabel';
FormItemLabel.inheritAttrs = false;

export default FormItemLabel;
