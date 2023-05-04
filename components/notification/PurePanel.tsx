import { computed } from 'vue';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { IconType } from './interface';
import Notice from '../vc-notification/Notice';
import classNames from '../_util/classNames';
import type { NoticeProps } from '../vc-notification/Notice';
import type { VueNode } from '../_util/type';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue';
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

const typeToIcon = {
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
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
    Omit<PureContentProps, 'prefixCls' | 'children'> {
  prefixCls?: string;
}

/** @private Internal Component. Do not use in your production. */
export default function PurePanel(props: PurePanelProps) {
  const { getPrefixCls } = useConfigInject('notification', props);
  const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'));
  const noticePrefixCls = `${prefixCls.value}-notice`;

  const [, hashId] = useStyle(prefixCls);

  return (
    <Notice
      {...props}
      prefixCls={prefixCls.value}
      class={classNames(hashId.value, `${noticePrefixCls}-pure-panel`)}
      noticeKey="pure"
      duration={null}
      closable={props.closable}
      closeIcon={getCloseIcon(prefixCls.value, props.closeIcon)}
    >
      <PureContent
        prefixCls={noticePrefixCls}
        icon={props.icon}
        type={props.type}
        message={props.message}
        description={props.description}
        btn={props.btn}
      />
    </Notice>
  );
}
