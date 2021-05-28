import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';

import Col, { ColProps } from '../grid/col';
import { useProvideForm, useInjectForm, useProvideFormItemPrefix } from './context';
import ErrorList from './ErrorList';
import classNames from '../_util/classNames';
import { ValidateStatus } from './FormItem';
import { VueNode } from '../_util/type';
import { computed, defineComponent, HTMLAttributes, onUnmounted } from 'vue';

interface FormItemInputMiscProps {
  prefixCls: string;
  errors: VueNode[];
  hasFeedback?: boolean;
  validateStatus?: ValidateStatus;
  onDomErrorVisibleChange: (visible: boolean) => void;
}

export interface FormItemInputProps {
  wrapperCol?: ColProps;
  help?: VueNode;
  extra?: VueNode;
  status?: ValidateStatus;
}

const iconMap: { [key: string]: any } = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined,
};
const FormItemInput = defineComponent<FormItemInputProps & FormItemInputMiscProps>({
  slots: ['help', 'extra', 'errors'],
  setup(props, { slots }) {
    const formContext = useInjectForm();
    const { wrapperCol: contextWrapperCol } = formContext;

    // Pass to sub FormItem should not with col info
    const subFormContext = { ...formContext };
    delete subFormContext.labelCol;
    delete subFormContext.wrapperCol;
    useProvideForm(subFormContext);

    useProvideFormItemPrefix({
      prefixCls: computed(() => props.prefixCls),
      status: computed(() => props.status),
    });

    return () => {
      const {
        prefixCls,
        wrapperCol,
        help = slots.help?.(),
        errors = slots.errors?.(),
        onDomErrorVisibleChange,
        hasFeedback,
        validateStatus,
        extra = slots.extra?.(),
      } = props;
      const baseClassName = `${prefixCls}-item`;

      const mergedWrapperCol: ColProps & HTMLAttributes =
        wrapperCol || contextWrapperCol?.value || {};

      const className = classNames(`${baseClassName}-control`, mergedWrapperCol.class);

      onUnmounted(() => {
        onDomErrorVisibleChange(false);
      });

      // Should provides additional icon if `hasFeedback`
      const IconNode = validateStatus && iconMap[validateStatus];
      const icon =
        hasFeedback && IconNode ? (
          <span class={`${baseClassName}-children-icon`}>
            <IconNode />
          </span>
        ) : null;

      const inputDom = (
        <div class={`${baseClassName}-control-input`}>
          <div class={`${baseClassName}-control-input-content`}>{slots.default?.()}</div>
          {icon}
        </div>
      );
      const errorListDom = (
        <ErrorList errors={errors} help={help} onDomErrorVisibleChange={onDomErrorVisibleChange} />
      );

      // If extra = 0, && will goes wrong
      // 0&&error -> 0
      const extraDom = extra ? <div class={`${baseClassName}-extra`}>{extra}</div> : null;

      return (
        <Col {...mergedWrapperCol} class={className}>
          {inputDom}
          {errorListDom}
          {extraDom}
        </Col>
      );
    };
  },
});

export default FormItemInput;
