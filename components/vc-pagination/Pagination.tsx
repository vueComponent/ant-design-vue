import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { hasProp, getComponent, splitAttrs, isValidElement } from '../_util/props-util';
import Pager from './Pager';
import Options from './Options';
import LOCALE from './locale/zh_CN';
import KEYCODE from './KeyCode';
import classNames from '../_util/classNames';
import { defineComponent } from 'vue';
import { cloneElement } from '../_util/vnode';
import firstNotUndefined from '../_util/firstNotUndefined';
import BaseInput from '../_util/BaseInput';

// 是否是正整数
function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

function defaultItemRender({ originalElement }) {
  return originalElement;
}

function calculatePage(p, state, props) {
  const pageSize = typeof p === 'undefined' ? state.statePageSize : p;
  return Math.floor((props.total - 1) / pageSize) + 1;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Pagination',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, default: undefined },
    prefixCls: PropTypes.string.def('rc-pagination'),
    selectPrefixCls: PropTypes.string.def('rc-select'),
    current: Number,
    defaultCurrent: PropTypes.number.def(1),
    total: PropTypes.number.def(0),
    pageSize: Number,
    defaultPageSize: PropTypes.number.def(10),
    hideOnSinglePage: { type: Boolean, default: false },
    showSizeChanger: { type: Boolean, default: undefined },
    showLessItems: { type: Boolean, default: false },
    // showSizeChange: PropTypes.func.def(noop),
    selectComponentClass: PropTypes.any,
    showPrevNextJumpers: { type: Boolean, default: true },
    showQuickJumper: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object]).def(false),
    showTitle: { type: Boolean, default: true },
    pageSizeOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    buildOptionText: Function,
    showTotal: Function,
    simple: { type: Boolean, default: undefined },
    locale: PropTypes.object.def(LOCALE),
    itemRender: PropTypes.func.def(defaultItemRender),
    prevIcon: PropTypes.any,
    nextIcon: PropTypes.any,
    jumpPrevIcon: PropTypes.any,
    jumpNextIcon: PropTypes.any,
    totalBoundaryShowSizeChanger: PropTypes.number.def(50),
  },
  data() {
    const props = this.$props;
    let current = firstNotUndefined([this.current, this.defaultCurrent]);

    const pageSize = firstNotUndefined([this.pageSize, this.defaultPageSize]);

    current = Math.min(current, calculatePage(pageSize, undefined, props));

    return {
      stateCurrent: current,
      stateCurrentInputValue: current,
      statePageSize: pageSize,
    };
  },
  watch: {
    current(val) {
      this.setState({
        stateCurrent: val,
        stateCurrentInputValue: val,
      });
    },
    pageSize(val) {
      const newState: any = {};
      let current = this.stateCurrent;
      const newCurrent = calculatePage(val, this.$data, this.$props);
      current = current > newCurrent ? newCurrent : current;
      if (!hasProp(this, 'current')) {
        newState.stateCurrent = current;
        newState.stateCurrentInputValue = current;
      }
      newState.statePageSize = val;
      this.setState(newState);
    },
    stateCurrent(_val, oldValue) {
      // When current page change, fix focused style of prev item
      // A hacky solution of https://github.com/ant-design/ant-design/issues/8948
      this.$nextTick(() => {
        if (this.$refs.paginationNode) {
          const lastCurrentNode = this.$refs.paginationNode.querySelector(
            `.${this.prefixCls}-item-${oldValue}`,
          );
          if (lastCurrentNode && document.activeElement === lastCurrentNode) {
            lastCurrentNode.blur();
          }
        }
      });
    },
    total() {
      const newState: any = {};
      const newCurrent = calculatePage(this.pageSize, this.$data, this.$props);
      if (hasProp(this, 'current')) {
        const current = Math.min(this.current, newCurrent);
        newState.stateCurrent = current;
        newState.stateCurrentInputValue = current;
      } else {
        let current = this.stateCurrent;
        if (current === 0 && newCurrent > 0) {
          current = 1;
        } else {
          current = Math.min(this.stateCurrent, newCurrent);
        }
        newState.stateCurrent = current;
      }
      this.setState(newState);
    },
  },
  methods: {
    getJumpPrevPage() {
      return Math.max(1, this.stateCurrent - (this.showLessItems ? 3 : 5));
    },
    getJumpNextPage() {
      return Math.min(
        calculatePage(undefined, this.$data, this.$props),
        this.stateCurrent + (this.showLessItems ? 3 : 5),
      );
    },
    getItemIcon(icon, label) {
      const { prefixCls } = this.$props;
      const iconNode = getComponent(this, icon, this.$props) || (
        <button type="button" aria-label={label} class={`${prefixCls}-item-link`} />
      );
      return iconNode;
    },
    getValidValue(e) {
      const inputValue = e.target.value;
      const allPages = calculatePage(undefined, this.$data, this.$props);
      const { stateCurrentInputValue } = this.$data;
      let value;
      if (inputValue === '') {
        value = inputValue;
      } else if (isNaN(Number(inputValue))) {
        value = stateCurrentInputValue;
      } else if (inputValue >= allPages) {
        value = allPages;
      } else {
        value = Number(inputValue);
      }
      return value;
    },
    isValid(page) {
      return isInteger(page) && page !== this.stateCurrent;
    },
    shouldDisplayQuickJumper() {
      const { showQuickJumper, pageSize, total } = this.$props;
      if (total <= pageSize) {
        return false;
      }
      return showQuickJumper;
    },
    // calculatePage (p) {
    //   let pageSize = p
    //   if (typeof pageSize === 'undefined') {
    //     pageSize = this.statePageSize
    //   }
    //   return Math.floor((this.total - 1) / pageSize) + 1
    // },
    handleKeyDown(event) {
      if (event.keyCode === KEYCODE.ARROW_UP || event.keyCode === KEYCODE.ARROW_DOWN) {
        event.preventDefault();
      }
    },
    handleKeyUp(e) {
      const value = this.getValidValue(e);
      const stateCurrentInputValue = this.stateCurrentInputValue;

      if (value !== stateCurrentInputValue) {
        this.setState({
          stateCurrentInputValue: value,
        });
      }

      if (e.keyCode === KEYCODE.ENTER) {
        this.handleChange(value);
      } else if (e.keyCode === KEYCODE.ARROW_UP) {
        this.handleChange(value - 1);
      } else if (e.keyCode === KEYCODE.ARROW_DOWN) {
        this.handleChange(value + 1);
      }
    },
    changePageSize(size) {
      let current = this.stateCurrent;
      const preCurrent = current;
      const newCurrent = calculatePage(size, this.$data, this.$props);
      current = current > newCurrent ? newCurrent : current;
      // fix the issue:
      // Once 'total' is 0, 'current' in 'onShowSizeChange' is 0, which is not correct.
      if (newCurrent === 0) {
        current = this.stateCurrent;
      }
      if (typeof size === 'number') {
        if (!hasProp(this, 'pageSize')) {
          this.setState({
            statePageSize: size,
          });
        }
        if (!hasProp(this, 'current')) {
          this.setState({
            stateCurrent: current,
            stateCurrentInputValue: current,
          });
        }
      }
      this.__emit('update:pageSize', size);
      if (current !== preCurrent) {
        this.__emit('update:current', current);
      }
      this.__emit('showSizeChange', current, size);
      this.__emit('change', current, size);
    },
    handleChange(p) {
      const { disabled } = this.$props;
      let page = p;
      if (this.isValid(page) && !disabled) {
        const currentPage = calculatePage(undefined, this.$data, this.$props);
        if (page > currentPage) {
          page = currentPage;
        } else if (page < 1) {
          page = 1;
        }
        if (!hasProp(this, 'current')) {
          this.setState({
            stateCurrent: page,
            stateCurrentInputValue: page,
          });
        }
        // this.__emit('input', page)
        this.__emit('update:current', page);
        this.__emit('change', page, this.statePageSize);
        return page;
      }
      return this.stateCurrent;
    },
    prev() {
      if (this.hasPrev()) {
        this.handleChange(this.stateCurrent - 1);
      }
    },
    next() {
      if (this.hasNext()) {
        this.handleChange(this.stateCurrent + 1);
      }
    },
    jumpPrev() {
      this.handleChange(this.getJumpPrevPage());
    },
    jumpNext() {
      this.handleChange(this.getJumpNextPage());
    },
    hasPrev() {
      return this.stateCurrent > 1;
    },
    hasNext() {
      return this.stateCurrent < calculatePage(undefined, this.$data, this.$props);
    },
    getShowSizeChanger() {
      const { showSizeChanger, total, totalBoundaryShowSizeChanger } = this.$props;
      if (typeof showSizeChanger !== 'undefined') {
        return showSizeChanger;
      }
      return total > totalBoundaryShowSizeChanger;
    },
    runIfEnter(event, callback, ...restParams) {
      if (event.key === 'Enter' || event.charCode === 13) {
        event.preventDefault();
        callback(...restParams);
      }
    },
    runIfEnterPrev(event) {
      this.runIfEnter(event, this.prev);
    },
    runIfEnterNext(event) {
      this.runIfEnter(event, this.next);
    },
    runIfEnterJumpPrev(event) {
      this.runIfEnter(event, this.jumpPrev);
    },
    runIfEnterJumpNext(event) {
      this.runIfEnter(event, this.jumpNext);
    },
    handleGoTO(event) {
      if (event.keyCode === KEYCODE.ENTER || event.type === 'click') {
        this.handleChange(this.stateCurrentInputValue);
      }
    },

    renderPrev(prevPage) {
      const { itemRender } = this.$props;

      const prevButton = itemRender({
        page: prevPage,
        type: 'prev',
        originalElement: this.getItemIcon('prevIcon', 'prev page'),
      });
      const disabled = !this.hasPrev();
      return isValidElement(prevButton)
        ? cloneElement(prevButton, disabled ? { disabled } : {})
        : prevButton;
    },

    renderNext(nextPage) {
      const { itemRender } = this.$props;
      const nextButton = itemRender({
        page: nextPage,
        type: 'next',
        originalElement: this.getItemIcon('nextIcon', 'next page'),
      });
      const disabled = !this.hasNext();
      return isValidElement(nextButton)
        ? cloneElement(nextButton, disabled ? { disabled } : {})
        : nextButton;
    },
  },
  render() {
    const {
      prefixCls,
      disabled,
      hideOnSinglePage,
      total,
      locale,
      showQuickJumper,
      showLessItems,
      showTitle,
      showTotal,
      simple,
      itemRender,
      showPrevNextJumpers,
      jumpPrevIcon,
      jumpNextIcon,
      selectComponentClass,
      selectPrefixCls,
      pageSizeOptions,
    } = this.$props;
    const { stateCurrent, statePageSize } = this;
    const { class: className, ...restAttrs } = splitAttrs(this.$attrs).extraAttrs;
    // When hideOnSinglePage is true and there is only 1 page, hide the pager
    if (hideOnSinglePage === true && this.total <= statePageSize) {
      return null;
    }

    const allPages = calculatePage(undefined, this.$data, this.$props);
    const pagerList = [];
    let jumpPrev = null;
    let jumpNext = null;
    let firstPager = null;
    let lastPager = null;
    let gotoButton = null;
    const goButton = showQuickJumper && showQuickJumper.goButton;
    const pageBufferSize = showLessItems ? 1 : 2;

    const prevPage = stateCurrent - 1 > 0 ? stateCurrent - 1 : 0;
    const nextPage = stateCurrent + 1 < allPages ? stateCurrent + 1 : allPages;
    const hasPrev = this.hasPrev();
    const hasNext = this.hasNext();
    if (simple) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = (
            <button type="button" onClick={this.handleGoTO} onKeyup={this.handleGoTO}>
              {locale.jump_to_confirm}
            </button>
          );
        } else {
          gotoButton = (
            <span onClick={this.handleGoTO} onKeyup={this.handleGoTO}>
              {goButton}
            </span>
          );
        }
        gotoButton = (
          <li
            title={showTitle ? `${locale.jump_to}${stateCurrent}/${allPages}` : null}
            class={`${prefixCls}-simple-pager`}
          >
            {gotoButton}
          </li>
        );
      }

      return (
        <ul
          class={classNames(
            `${prefixCls} ${prefixCls}-simple`,
            { [`${prefixCls}-disabled`]: disabled },
            className,
          )}
          {...restAttrs}
        >
          <li
            title={showTitle ? locale.prev_page : null}
            onClick={this.prev}
            tabindex={hasPrev ? 0 : null}
            onKeypress={this.runIfEnterPrev}
            class={classNames(`${prefixCls}-prev`, {
              [`${prefixCls}-disabled`]: !hasPrev,
            })}
            aria-disabled={!hasPrev}
          >
            {this.renderPrev(prevPage)}
          </li>
          <li
            title={showTitle ? `${stateCurrent}/${allPages}` : null}
            class={`${prefixCls}-simple-pager`}
          >
            <BaseInput
              type="text"
              value={this.stateCurrentInputValue}
              disabled={disabled}
              onKeydown={this.handleKeyDown}
              onKeyup={this.handleKeyUp}
              onInput={this.handleKeyUp}
              onChange={this.handleKeyUp}
              size="3"
            ></BaseInput>
            <span class={`${prefixCls}-slash`}>／</span>
            {allPages}
          </li>
          <li
            title={showTitle ? locale.next_page : null}
            onClick={this.next}
            tabindex={hasNext ? 0 : null}
            onKeypress={this.runIfEnterNext}
            class={classNames(`${prefixCls}-next`, {
              [`${prefixCls}-disabled`]: !hasNext,
            })}
            aria-disabled={!hasNext}
          >
            {this.renderNext(nextPage)}
          </li>
          {gotoButton}
        </ul>
      );
    }
    if (allPages <= 3 + pageBufferSize * 2) {
      const pagerProps = {
        locale,
        rootPrefixCls: prefixCls,
        showTitle,
        itemRender,
        onClick: this.handleChange,
        onKeypress: this.runIfEnter,
      };
      if (!allPages) {
        pagerList.push(
          <Pager {...pagerProps} key="noPager" page={1} class={`${prefixCls}-item-disabled`} />,
        );
      }
      for (let i = 1; i <= allPages; i += 1) {
        const active = stateCurrent === i;
        pagerList.push(<Pager {...pagerProps} key={i} page={i} active={active} />);
      }
    } else {
      const prevItemTitle = showLessItems ? locale.prev_3 : locale.prev_5;
      const nextItemTitle = showLessItems ? locale.next_3 : locale.next_5;
      if (showPrevNextJumpers) {
        jumpPrev = (
          <li
            title={this.showTitle ? prevItemTitle : null}
            key="prev"
            onClick={this.jumpPrev}
            tabindex="0"
            onKeypress={this.runIfEnterJumpPrev}
            class={classNames(`${prefixCls}-jump-prev`, {
              [`${prefixCls}-jump-prev-custom-icon`]: !!jumpPrevIcon,
            })}
          >
            {itemRender({
              page: this.getJumpPrevPage(),
              type: 'jump-prev',
              originalElement: this.getItemIcon('jumpPrevIcon', 'prev page'),
            })}
          </li>
        );

        jumpNext = (
          <li
            title={this.showTitle ? nextItemTitle : null}
            key="next"
            tabindex="0"
            onClick={this.jumpNext}
            onKeypress={this.runIfEnterJumpNext}
            class={classNames(`${prefixCls}-jump-next`, {
              [`${prefixCls}-jump-next-custom-icon`]: !!jumpNextIcon,
            })}
          >
            {itemRender({
              page: this.getJumpNextPage(),
              type: 'jump-next',
              originalElement: this.getItemIcon('jumpNextIcon', 'next page'),
            })}
          </li>
        );
      }

      lastPager = (
        <Pager
          locale={locale}
          last
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeypress={this.runIfEnter}
          key={allPages}
          page={allPages}
          active={false}
          showTitle={showTitle}
          itemRender={itemRender}
        />
      );
      firstPager = (
        <Pager
          locale={locale}
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeypress={this.runIfEnter}
          key={1}
          page={1}
          active={false}
          showTitle={showTitle}
          itemRender={itemRender}
        />
      );

      let left = Math.max(1, stateCurrent - pageBufferSize);
      let right = Math.min(stateCurrent + pageBufferSize, allPages);

      if (stateCurrent - 1 <= pageBufferSize) {
        right = 1 + pageBufferSize * 2;
      }

      if (allPages - stateCurrent <= pageBufferSize) {
        left = allPages - pageBufferSize * 2;
      }

      for (let i = left; i <= right; i += 1) {
        const active = stateCurrent === i;
        pagerList.push(
          <Pager
            locale={locale}
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={i}
            page={i}
            active={active}
            showTitle={showTitle}
            itemRender={itemRender}
          />,
        );
      }

      if (stateCurrent - 1 >= pageBufferSize * 2 && stateCurrent !== 1 + 2) {
        pagerList[0] = (
          <Pager
            locale={locale}
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={left}
            page={left}
            class={`${prefixCls}-item-after-jump-prev`}
            active={false}
            showTitle={this.showTitle}
            itemRender={itemRender}
          />
        );
        pagerList.unshift(jumpPrev);
      }
      if (allPages - stateCurrent >= pageBufferSize * 2 && stateCurrent !== allPages - 2) {
        pagerList[pagerList.length - 1] = (
          <Pager
            locale={locale}
            rootPrefixCls={prefixCls}
            onClick={this.handleChange}
            onKeypress={this.runIfEnter}
            key={right}
            page={right}
            class={`${prefixCls}-item-before-jump-next`}
            active={false}
            showTitle={this.showTitle}
            itemRender={itemRender}
          />
        );
        pagerList.push(jumpNext);
      }

      if (left !== 1) {
        pagerList.unshift(firstPager);
      }
      if (right !== allPages) {
        pagerList.push(lastPager);
      }
    }

    let totalText = null;

    if (showTotal) {
      totalText = (
        <li class={`${prefixCls}-total-text`}>
          {showTotal(total, [
            total === 0 ? 0 : (stateCurrent - 1) * statePageSize + 1,
            stateCurrent * statePageSize > total ? total : stateCurrent * statePageSize,
          ])}
        </li>
      );
    }
    const prevDisabled = !hasPrev || !allPages;
    const nextDisabled = !hasNext || !allPages;
    const buildOptionText = this.buildOptionText || this.$slots.buildOptionText;
    return (
      <ul
        unselectable="on"
        ref="paginationNode"
        {...restAttrs}
        class={classNames(
          { [`${prefixCls}`]: true, [`${prefixCls}-disabled`]: disabled },
          className,
        )}
      >
        {totalText}
        <li
          title={showTitle ? locale.prev_page : null}
          onClick={this.prev}
          tabindex={prevDisabled ? null : 0}
          onKeypress={this.runIfEnterPrev}
          class={classNames(`${prefixCls}-prev`, {
            [`${prefixCls}-disabled`]: prevDisabled,
          })}
          aria-disabled={prevDisabled}
        >
          {this.renderPrev(prevPage)}
        </li>
        {pagerList}
        <li
          title={showTitle ? locale.next_page : null}
          onClick={this.next}
          tabindex={nextDisabled ? null : 0}
          onKeypress={this.runIfEnterNext}
          class={classNames(`${prefixCls}-next`, {
            [`${prefixCls}-disabled`]: nextDisabled,
          })}
          aria-disabled={nextDisabled}
        >
          {this.renderNext(nextPage)}
        </li>
        <Options
          disabled={disabled}
          locale={locale}
          rootPrefixCls={prefixCls}
          selectComponentClass={selectComponentClass}
          selectPrefixCls={selectPrefixCls}
          changeSize={this.getShowSizeChanger() ? this.changePageSize : null}
          current={stateCurrent}
          pageSize={statePageSize}
          pageSizeOptions={pageSizeOptions}
          buildOptionText={buildOptionText || null}
          quickGo={this.shouldDisplayQuickJumper() ? this.handleChange : null}
          goButton={goButton}
        />
      </ul>
    );
  },
});
