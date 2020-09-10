import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { getComponent, isStringElement, isEmptyElement, getSlot } from '../_util/props-util';
import { Col } from '../grid';
import { ConfigConsumerProps } from '../config-provider';
import { ListGridType } from './index';
import { cloneElement } from '../_util/vnode';
import { inject } from 'vue';

export const ListItemProps = {
  prefixCls: PropTypes.string,
  extra: PropTypes.any,
  actions: PropTypes.arrayOf(PropTypes.any),
  grid: ListGridType,
};

export const ListItemMetaProps = {
  avatar: PropTypes.any,
  description: PropTypes.any,
  prefixCls: PropTypes.string,
  title: PropTypes.any,
};

export const ListItemMeta = (props, { slots }) => {
  const configProvider = inject('configProvider', ConfigConsumerProps);
  const getPrefixCls = configProvider.getPrefixCls;
  const { prefixCls: customizePrefixCls } = props;
  const prefixCls = getPrefixCls('list', customizePrefixCls);
  const avatar = props.avatar || slots.avatar?.();
  const title = props.title || slots.title?.();
  const description = props.description || slots.description?.();
  const content = (
    <div class={`${prefixCls}-item-meta-content`}>
      {title && <h4 class={`${prefixCls}-item-meta-title`}>{title}</h4>}
      {description && <div class={`${prefixCls}-item-meta-description`}>{description}</div>}
    </div>
  );
  return (
    <div class={`${prefixCls}-item-meta`}>
      {avatar && <div class={`${prefixCls}-item-meta-avatar`}>{avatar}</div>}
      {(title || description) && content}
    </div>
  );
};

Object.assign(ListItemMeta, {
  props: ListItemMetaProps,
  __ANT_LIST_ITEM_META: true,
  displayName: 'AListItemMeta',
});

function getGrid(grid, t) {
  return grid[t] && Math.floor(24 / grid[t]);
}

export default {
  name: 'AListItem',
  inheritAttrs: false,
  Meta: ListItemMeta,
  props: ListItemProps,
  setup() {
    const listContext = inject('listContext', {});
    const configProvider = inject('configProvider', ConfigConsumerProps);
    return {
      listContext,
      configProvider,
    };
  },
  methods: {
    isItemContainsTextNodeAndNotSingular() {
      const children = getSlot(this) || [];
      let result;
      children.forEach(element => {
        if (isStringElement(element) && !isEmptyElement(element)) {
          result = true;
        }
      });
      return result && children.length > 1;
    },

    isFlexMode() {
      const extra = getComponent(this, 'extra');
      const { itemLayout } = this.listContext;
      if (itemLayout === 'vertical') {
        return !!extra;
      }
      return !this.isItemContainsTextNodeAndNotSingular();
    },
  },
  render() {
    const { grid, itemLayout } = this.listContext;
    const { prefixCls: customizePrefixCls, $attrs } = this;
    const { class: _className, ...restAttrs } = $attrs;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('list', customizePrefixCls);
    const extra = getComponent(this, 'extra');
    let actions = getComponent(this, 'actions');
    actions = actions && !Array.isArray(actions) ? [actions] : actions;
    const actionsContent = actions && actions.length > 0 && (
      <ul class={`${prefixCls}-item-action`} key="actions">
        {actions.map((action, i) => (
          <li key={`${prefixCls}-item-action-${i}`}>
            {action}
            {i !== actions.length - 1 && <em class={`${prefixCls}-item-action-split`} />}
          </li>
        ))}
      </ul>
    );
    const children = getSlot(this);
    const Tag = grid ? 'div' : 'li';
    const itemChildren = (
      <Tag
        {...restAttrs}
        class={classNames(`${prefixCls}-item `, _className, {
          [`${prefixCls}-item-no-flex`]: !this.isFlexMode(),
        })}
      >
        {itemLayout === 'vertical' && extra
          ? [
              <div class={`${prefixCls}-item-main`} key="content">
                {children}
                {actionsContent}
              </div>,
              <div class={`${prefixCls}-item-extra`} key="extra">
                {extra}
              </div>,
            ]
          : [children, actionsContent, cloneElement(extra, { key: 'extra' })]}
      </Tag>
    );

    const mainContent = grid ? (
      <Col
        span={getGrid(grid, 'column')}
        xs={getGrid(grid, 'xs')}
        sm={getGrid(grid, 'sm')}
        md={getGrid(grid, 'md')}
        lg={getGrid(grid, 'lg')}
        xl={getGrid(grid, 'xl')}
        xxl={getGrid(grid, 'xxl')}
      >
        {itemChildren}
      </Col>
    ) : (
      itemChildren
    );

    return mainContent;
  },
};
