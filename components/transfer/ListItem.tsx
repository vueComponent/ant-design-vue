import PropTypes, { withUndefined } from '../_util/vue-types';
import classNames from '../_util/classNames';
import { TransferLocale } from '.';
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined';
import defaultLocale from '../locale/default';
import Lazyload from '../vc-lazy-load';
import Checkbox from '../checkbox';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { defineComponent, ExtractPropTypes } from 'vue';

function noop() {}

export const transferListItemProps = {
  renderedText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  renderedEl: PropTypes.any,
  item: PropTypes.any,
  lazy: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
  checked: PropTypes.looseBool,
  prefixCls: PropTypes.string,
  disabled: PropTypes.looseBool,
  showRemove: PropTypes.looseBool,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
};

export type TransferListItemProps = Partial<ExtractPropTypes<typeof transferListItemProps>>;

export default defineComponent({
  name: 'ListItem',
  inheritAttrs: false,
  props: transferListItemProps,
  emits: ['click'],
  setup(props, { emit }) {
    return () => {
      const {
        renderedText,
        renderedEl,
        item,
        lazy,
        checked,
        disabled,
        prefixCls,
        showRemove,
        onRemove,
      } = props;
      const className = classNames({
        [`${prefixCls}-content-item`]: true,
        [`${prefixCls}-content-item-disabled`]: disabled || item.disabled,
      });

      let title: string;
      if (typeof renderedText === 'string' || typeof renderedText === 'number') {
        title = String(renderedText);
      }

      const listItem = (
        <LocaleReceiver componentName="Transfer" defaultLocale={defaultLocale.Transfer}>
          {(transferLocale: TransferLocale) => {
            const labelNode = <span class={`${prefixCls}-content-item-text`}>{renderedEl}</span>;
            if (showRemove) {
              return (
                <li
                  class={className}
                  title={title}
                  onClick={() => {
                    onRemove?.(item);
                  }}
                >
                  {labelNode}
                  <TransButton
                    disabled={disabled || item.disabled}
                    class={`${prefixCls}-content-item-remove`}
                    aria-label={transferLocale.remove}
                  >
                    <DeleteOutlined />
                  </TransButton>
                </li>
              );
            }

            return (
              <li
                class={className}
                title={title}
                onClick={
                  disabled || item.disabled
                    ? noop
                    : () => {
                        emit('click', item);
                      }
                }
              >
                <Checkbox checked={checked} disabled={disabled || item.disabled} />
                {labelNode}
              </li>
            );
          }}
        </LocaleReceiver>
      );
      let children = null;
      if (lazy) {
        const lazyProps = {
          height: 32,
          offset: 500,
          throttle: 0,
          debounce: false,
          ...(lazy as any),
        };
        children = <Lazyload {...lazyProps}>{listItem}</Lazyload>;
      } else {
        children = listItem;
      }
      return children;
    };
  },
});
