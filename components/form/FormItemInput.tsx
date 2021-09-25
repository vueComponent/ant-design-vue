import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';

import type { ColProps } from '../grid/Col';
import Col from '../grid/Col';
import { useProvideForm, useInjectForm, useProvideFormItemPrefix } from './context';
import ErrorList from './ErrorList';
import classNames from '../_util/classNames';
import type { ValidateStatus } from './FormItem';
import type { VueNode } from '../_util/type';
import type { HTMLAttributes } from 'vue';
import { computed, defineComponent, onUnmounted } from 'vue';

export interface FormItemInputMiscProps {
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
const FormItemInput = defineComponent({
  slots: ['help', 'extra', 'errors'],
  inheritAttrs: false,
  props: [
    'prefixCls',
    'errors',
    'hasFeedback',
    'validateStatus',
    'onDomErrorVisibleChange',
    'wrapperCol',
    'help',
    'extra',
    'status',
  ],
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

    onUnmounted(() => {
      props.onDomErrorVisibleChange(false);
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

      // Should provides additional icon if `hasFeedback`
      const IconNode = validateStatus && iconMap[validateStatus];

      return (
        <Col
          {...mergedWrapperCol}
          class={className}
          v-slots={{
            default: () => (
              <>
                <div class={`${baseClassName}-control-input`}>
                  <div class={`${baseClassName}-control-input-content`}>{slots.default?.()}</div>
                  {hasFeedback && IconNode ? (
                    <span class={`${baseClassName}-children-icon`}>
                      <IconNode />
                    </span>
                  ) : null}
                </div>
                <ErrorList
                  errors={errors}
                  help={help}
                  onDomErrorVisibleChange={onDomErrorVisibleChange}
                />
                {extra ? <div class={`${baseClassName}-extra`}>{extra}</div> : null}
              </>
            ),
          }}
        ></Col>
      );
    };
  },
});

export default FormItemInput;
