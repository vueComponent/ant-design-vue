import { computed, defineComponent } from 'vue';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { IconType } from './interface';
import Notice from '../vc-notification/Notice';
import classNames from '../_util/classNames';
import type { NoticeProps } from '../vc-notification/Notice';
import type { VueNode } from '../_util/type';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import { renderHelper } from '../_util/util';

export function getCloseIcon(prefixCls: string, closeIcon?: VueNode) {
  return (
    closeIcon || (
      <span class={`${prefixCls}-close-x`}>
        <CloseOutlined class={`${prefixCls}-close-icon`} />
      </span>
    )
  );
}

export interface PureContentProps {
  prefixCls: string;
  icon?: VueNode;
  message?: VueNode;
  description?: VueNode;
  btn?: VueNode;
  type?: IconType;
}

export const TypeIcon = {
  info: <InfoCircleFilled />,
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  loading: <LoadingOutlined />,
};

const typeToIcon = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
};

export function PureContent({
  prefixCls,
  icon,
  type,
  message,
  description,
  btn,
}: PureContentProps) {
  let iconNode = null;
  if (icon) {
    iconNode = <span class={`${prefixCls}-icon`}>{renderHelper(icon)}</span>;
  } else if (type) {
    const Icon = typeToIcon[type];
    iconNode = <Icon class={`${prefixCls}-icon ${prefixCls}-icon-${type}`} />;
  }

  return (
    <div
      class={classNames({
        [`${prefixCls}-with-icon`]: iconNode,
      })}
      role="alert"
    >
      {iconNode}
      <div class={`${prefixCls}-message`}>{message}</div>
      <div class={`${prefixCls}-description`}>{description}</div>
      {btn && <div class={`${prefixCls}-btn`}>{btn}</div>}
    </div>
  );
}

export interface PurePanelProps
  extends Omit<NoticeProps, 'prefixCls' | 'eventKey'>,
    Omit<PureContentProps, 'prefixCls'> {
  prefixCls?: string;
}

/** @private Internal Component. Do not use in your production. */
export default defineComponent<PurePanelProps>({
  name: 'PurePanel',
  inheritAttrs: false,
  props: ['prefixCls', 'icon', 'type', 'message', 'description', 'btn', 'closeIcon'] as any,
  setup(props) {
    const { getPrefixCls } = useConfigInject('notification', props);
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'));
    const noticePrefixCls = computed(() => `${prefixCls.value}-notice`);

    const [, hashId] = useStyle(prefixCls);
    return () => {
      return (
        <Notice
          {...props}
          prefixCls={prefixCls.value}
          class={classNames(hashId.value, `${noticePrefixCls.value}-pure-panel`)}
          noticeKey="pure"
          duration={null}
          closable={props.closable}
          closeIcon={getCloseIcon(prefixCls.value, props.closeIcon)}
        >
          <PureContent
            prefixCls={noticePrefixCls.value}
            icon={props.icon}
            type={props.type}
            message={props.message}
            description={props.description}
            btn={props.btn}
          />
        </Notice>
      );
    };
  },
});
