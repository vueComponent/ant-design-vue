import type { CSSProperties } from 'vue';
import type { VueNode } from '../../_util/type';
import useMergeProps from '../hooks/useMergeProps';
import { useInjectPanel } from '../PanelContext';

const HIDDEN_STYLE: CSSProperties = {
  visibility: 'hidden',
};

export type HeaderProps = {
  prefixCls: string;

  // Icons
  prevIcon?: VueNode;
  nextIcon?: VueNode;
  superPrevIcon?: VueNode;
  superNextIcon?: VueNode;

  /** Last one step */
  onPrev?: () => void;
  /** Next one step */
  onNext?: () => void;
  /** Last multiple steps */
  onSuperPrev?: () => void;
  /** Next multiple steps */
  onSuperNext?: () => void;

  children?: VueNode;
};

function Header(_props: HeaderProps, { slots }) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    prevIcon = '\u2039',
    nextIcon = '\u203A',
    superPrevIcon = '\u00AB',
    superNextIcon = '\u00BB',
    onSuperPrev,
    onSuperNext,
    onPrev,
    onNext,
  } = props;
  const { hideNextBtn, hidePrevBtn } = useInjectPanel();

  return (
    <div class={prefixCls}>
      {onSuperPrev && (
        <button
          type="button"
          onClick={onSuperPrev}
          tabindex={-1}
          class={`${prefixCls}-super-prev-btn`}
          style={hidePrevBtn.value ? HIDDEN_STYLE : {}}
        >
          {superPrevIcon}
        </button>
      )}
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          tabindex={-1}
          class={`${prefixCls}-prev-btn`}
          style={hidePrevBtn.value ? HIDDEN_STYLE : {}}
        >
          {prevIcon}
        </button>
      )}
      <div class={`${prefixCls}-view`}>{slots.default?.()}</div>
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          tabindex={-1}
          class={`${prefixCls}-next-btn`}
          style={hideNextBtn.value ? HIDDEN_STYLE : {}}
        >
          {nextIcon}
        </button>
      )}
      {onSuperNext && (
        <button
          type="button"
          onClick={onSuperNext}
          tabindex={-1}
          class={`${prefixCls}-super-next-btn`}
          style={hideNextBtn.value ? HIDDEN_STYLE : {}}
        >
          {superNextIcon}
        </button>
      )}
    </div>
  );
}

Header.displayName = 'Header';
Header.inheritAttrs = false;

export default Header;
