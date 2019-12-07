import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { getSlotOptions, getComponentFromProp, isEmptyElement } from '../_util/props-util';
import { Col } from '../grid';
import { ConfigConsumerProps } from '../config-provider';
import { ListGridType } from './index';

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
  render() {
    const { grid } = this.listContext;
    const { prefixCls: customizePrefixCls, $slots, $listeners } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('list', customizePrefixCls);

    const classString = `${prefixCls}-item`;
    const extra = getComponentFromProp(this, 'extra');
    const actions = getComponentFromProp(this, 'actions');
    const metaContent = [];
    const otherContent = [];

    ($slots.default || []).forEach(element => {
      if (!isEmptyElement(element)) {
        if (getSlotOptions(element).__ANT_LIST_ITEM_META) {
          metaContent.push(element);
        } else {
          otherContent.push(element);
        }
      }
    });

    const contentClassString = classNames(`${prefixCls}-item-content`, {
      [`${prefixCls}-item-content-single`]: metaContent.length < 1,
    });
    const content =
      otherContent.length > 0 ? <div class={contentClassString}>{otherContent}</div> : null;

    let actionsContent;
    if (actions && actions.length > 0) {
      const actionsContentItem = (action, i) => (
        <li key={`${prefixCls}-item-action-${i}`}>
          {action}
          {i !== actions.length - 1 && <em class={`${prefixCls}-item-action-split`} />}
        </li>
      );
      actionsContent = (
        <ul class={`${prefixCls}-item-action`}>
          {actions.map((action, i) => actionsContentItem(action, i))}
        </ul>
      );
    }

    const extraContent = (
      <div class={`${prefixCls}-item-extra-wrap`}>
        <div class={`${prefixCls}-item-main`}>
          {metaContent}
          {content}
          {actionsContent}
        </div>
        <div class={`${prefixCls}-item-extra`}>{extra}</div>
      </div>
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
        <div {...{ on: $listeners }} class={classString}>
          {extra && extraContent}
          {!extra && metaContent}
          {!extra && content}
          {!extra && actionsContent}
        </div>
      </Col>
    ) : (
      <div {...{ on: $listeners }} class={classString}>
        {extra && extraContent}
        {!extra && metaContent}
        {!extra && content}
        {!extra && actionsContent}
      </div>
    );

    return mainContent;
  },
};
