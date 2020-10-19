import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';

export default function getIcons(props: any, slots: any = {}) {
  const { loading, multiple, prefixCls } = props;
  const suffixIcon = props.suffixIcon || (slots.suffixIcon && slots.suffixIcon());
  const clearIcon = props.clearIcon || (slots.clearIcon && slots.clearIcon());
  const menuItemSelectedIcon =
    props.menuItemSelectedIcon || (slots.menuItemSelectedIcon && slots.menuItemSelectedIcon());
  const removeIcon = props.removeIcon || (slots.removeIcon && slots.removeIcon());
  // Clear Icon
  let mergedClearIcon = clearIcon;
  if (!clearIcon) {
    mergedClearIcon = <CloseCircleFilled />;
  }

  // Arrow item icon
  let mergedSuffixIcon = null;
  if (suffixIcon !== undefined) {
    mergedSuffixIcon = suffixIcon;
  } else if (loading) {
    mergedSuffixIcon = <LoadingOutlined spin />;
  } else {
    const iconCls = `${prefixCls}-suffix`;
    mergedSuffixIcon = ({ open, showSearch }: { open: boolean; showSearch: boolean }) => {
      if (open && showSearch) {
        return <SearchOutlined class={iconCls} />;
      }
      return <DownOutlined class={iconCls} />;
    };
  }

  // Checked item icon
  let mergedItemIcon = null;
  if (menuItemSelectedIcon !== undefined) {
    mergedItemIcon = menuItemSelectedIcon;
  } else if (multiple) {
    mergedItemIcon = <CheckOutlined />;
  } else {
    mergedItemIcon = null;
  }

  let mergedRemoveIcon = null;
  if (removeIcon !== undefined) {
    mergedRemoveIcon = removeIcon;
  } else {
    mergedRemoveIcon = <CloseOutlined />;
  }

  return {
    clearIcon: mergedClearIcon,
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon,
  };
}
