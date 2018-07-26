import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, initDefaultProps, filterEmpty, getComponentFromProp } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import TimelineItem from './TimelineItem';
import Icon from '../icon';

export var TimelineProps = {
  prefixCls: PropTypes.string,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: PropTypes.any,
  pendingDot: PropTypes.string
};

export default {
  name: 'ATimeline',
  props: initDefaultProps(TimelineProps, {
    prefixCls: 'ant-timeline'
  }),
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        prefixCls = _getOptionProps.prefixCls,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls']);

    var pendingDot = getComponentFromProp(this, 'pendingDot');
    var pending = getComponentFromProp(this, 'pending');
    var pendingNode = typeof pending === 'boolean' ? null : pending;
    var classString = classNames(prefixCls, _defineProperty({}, prefixCls + '-pending', !!pending));
    // Remove falsy items
    var falsylessItems = filterEmpty(this.$slots['default']);
    var items = falsylessItems.map(function (item, idx) {
      return cloneElement(item, {
        props: {
          last: falsylessItems.length - 1 === idx
        }
      });
    });
    var pendingItem = pending ? h(
      TimelineItem,
      {
        attrs: {
          pending: !!pending
        }
      },
      [h(
        'template',
        { slot: 'dot' },
        [pendingDot || h(Icon, {
          attrs: { type: 'loading' }
        })]
      ), pendingNode]
    ) : null;
    var timelineProps = {
      props: _extends({}, restProps),
      'class': classString,
      on: this.$listeners
    };
    return h(
      'ul',
      timelineProps,
      [items, pendingItem]
    );
  }
};