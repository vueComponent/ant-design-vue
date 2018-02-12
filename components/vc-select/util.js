import { getPropsData, getSlotOptions, getKey, getAttrs } from '../_util/props-util'
export function getValuePropValue (child) {
  const props = getPropsData(child)
  if ('value' in props) {
    return props.value
  }
  if (getKey(child)) {
    return getKey(child)
  }
  if (getSlotOptions(child).isSelectOptGroup && props.label) {
    return props.label
  }
  throw new Error(
    `Need at least a key or a value or a label (only for OptGroup) for ${child}`
  )
}

export function getPropValue (child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child)
  }
  if (prop === 'children') {
    if (child.$slots) {
      return child.$slots.default
    } else {
      return child.componentOptions.children
    }
  }
  const data = getPropsData(child)
  if (prop in data) {
    return data[prop]
  } else {
    return getAttrs(child)[prop]
  }
}

export function isMultiple (props) {
  return props.multiple
}

export function isCombobox (props) {
  return props.combobox
}

export function isMultipleOrTags (props) {
  return props.multiple || props.tags
}

export function isMultipleOrTagsOrCombobox (props) {
  return isMultipleOrTags(props) || isCombobox(props)
}

export function isSingleMode (props) {
  return !isMultipleOrTagsOrCombobox(props)
}

export function toArray (value) {
  let ret = value
  if (value === undefined) {
    ret = []
  } else if (!Array.isArray(value)) {
    ret = [value]
  }
  return ret
}

export function preventDefaultEvent (e) {
  e.preventDefault()
}

export function findIndexInValueByKey (value, key) {
  let index = -1
  for (let i = 0; i < value.length; i++) {
    if (value[i].key === key) {
      index = i
      break
    }
  }
  return index
}

export function findIndexInValueByLabel (value, label) {
  let index = -1
  for (let i = 0; i < value.length; i++) {
    if (toArray(value[i].label).join('') === label) {
      index = i
      break
    }
  }
  return index
}

export function getSelectKeys (menuItems, value) {
  if (value === null || value === undefined) {
    return []
  }
  let selectedKeys = []
  menuItems.forEach(item => {
    if (getSlotOptions(item).isMenuItemGroup) {
      selectedKeys = selectedKeys.concat(
        getSelectKeys(item.componentOptions.children, value)
      )
    } else {
      const itemValue = getValuePropValue(item)
      const itemKey = item.key
      if (findIndexInValueByKey(value, itemValue) !== -1 && itemKey) {
        selectedKeys.push(itemKey)
      }
    }
  })
  return selectedKeys
}

export const UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
}

export const UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable',
}

export function findFirstMenuItem (children) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const props = getPropsData(child)
    if (getSlotOptions(child).isMenuItemGroup) {
      const found = findFirstMenuItem(child.componentOptions.children)
      if (found) {
        return found
      }
    } else if (!props.disabled) {
      return child
    }
  }
  return null
}

export function includesSeparators (string, separators) {
  for (let i = 0; i < separators.length; ++i) {
    if (string.lastIndexOf(separators[i]) > 0) {
      return true
    }
  }
  return false
}

export function splitBySeparators (string, separators) {
  const reg = new RegExp(`[${separators.join()}]`)
  return string.split(reg).filter(token => token)
}

export function defaultFilterFn (input, child) {
  const props = getPropsData(child)
  if (props.disabled) {
    return false
  }
  let value = getPropValue(child, this.optionFilterProp)
  if (value.length && value[0].text) {
    value = value[0].text
  } else {
    value = String(value)
  }
  return (
    value.toLowerCase().indexOf(input.toLowerCase()) > -1
  )
}

export function validateOptionValue (value, props) {
  if (isSingleMode(props) || isMultiple(props)) {
    return
  }
  if (typeof value !== 'string') {
    throw new Error(
      `Invalid \`value\` of type \`${typeof value}\` supplied to Option, ` +
      `expected \`string\` when \`tags/combobox\` is \`true\`.`
    )
  }
}
