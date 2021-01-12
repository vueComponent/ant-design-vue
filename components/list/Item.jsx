import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import {
  getComponentFromProp,
  isStringElement,
  getListeners,
  isEmptyElement,
} from '../_util/props-util';
import { Col } from '../grid';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { ListGridType } from './index';
import { cloneElement } from '../_util/vnode';

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

export const Meta = {
  functional: true,
  name: 'AListItemMeta',
  __ANT_LIST_ITEM_META: true,
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render(h, context) {
    const { props, slots, listeners, injections } = context;
    const slotsMap = slots();
    const getPrefixCls = injections.configProvider.getPrefixCls;
    const { prefixCls: customizePrefixCls } = props;
    const prefixCls = getPrefixCls('list', customizePrefixCls);

    const avatar = props.avatar || slotsMap.avatar;
    const title = props.title || slotsMap.title;
    const description = props.description || slotsMap.description;
    const content = (
      <div class={`${prefixCls}-item-meta-content`}>
        {title && <h4 class={`${prefixCls}-item-meta-title`}>{title}</h4>}
        {description && <div class={`${prefixCls}-item-meta-description`}>{description}</div>}
      </div>
    );
    return (
      <div {...{ on: listeners }} class={`${prefixCls}-item-meta`}>
        {avatar && <div class={`${prefixCls}-item-meta-avatar`}>{avatar}</div>}
        {(title || description) && content}
      </div>
    );
  },
};

function getGrid(grid, t) {
  return grid[t] && Math.floor(24 / grid[t]);
}

export default {
  name: 'AListItem',
  Meta,
  props: ListItemProps,
  inject: {
    listContext: { default: () => ({}) },
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    isItemContainsTextNodeAndNotSingular() {
      const { $slots } = this;
      let result;
      const children = $slots.default || [];
      children.forEach(element => {
        if (isStringElement(element) && !isEmptyElement(element)) {
          result = true;
        }
      });
      return result && children.length > 1;
    },

    isFlexMode() {
      const extra = getComponentFromProp(this, 'extra');
      const { itemLayout } = this.listContext;
      if (itemLayout === 'vertical') {
        return !!extra;
      }
      return !this.isItemContainsTextNodeAndNotSingular();
    },
  },
  render() {
    const { grid, itemLayout } = this.listContext;
    const { prefixCls: customizePrefixCls, $slots } = this;
    const listeners = getListeners(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('list', customizePrefixCls);
    const extra = getComponentFromProp(this, 'extra');
    const actions = getComponentFromProp(this, 'actions');

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

    const Tag = grid ? 'div' : 'li';
    const itemChildren = (
      <Tag
        {...{ on: listeners }}
        class={classNames(`${prefixCls}-item`, {
          [`${prefixCls}-item-no-flex`]: !this.isFlexMode(),
        })}
      >
        {itemLayout === 'vertical' && extra
          ? [
              <div class={`${prefixCls}-item-main`} key="content">
                {$slots.default}
                {actionsContent}
              </div>,
              <div class={`${prefixCls}-item-extra`} key="extra">
                {extra}
              </div>,
            ]
          : [$slots.default, actionsContent, cloneElement(extra, { key: 'extra' })]}
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
