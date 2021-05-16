import classNames from '../../_util/classNames';
import { FunctionalComponent, provide } from 'vue';
import { useInjectMenu } from './hooks/useMenuContext';
const InternalSubMenuList: FunctionalComponent<any> = (_props, { slots, attrs }) => {
  const { prefixCls, mode } = useInjectMenu();
  return (
    <ul
      {...attrs}
      class={classNames(
        prefixCls,
        `${prefixCls}-sub`,
        `${prefixCls}-${mode.value === 'inline' ? 'inline' : 'vertical'}`,
      )}
      data-menu-list
    >
      {slots.default?.()}
    </ul>
  );
};

InternalSubMenuList.displayName = 'SubMenuList';

export default InternalSubMenuList;
