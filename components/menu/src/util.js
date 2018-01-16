export function noop () {
}

export function getKeyFromChildrenIndex (child, menuEventKey, index) {
  const prefix = menuEventKey || ''
  return child.key || `${prefix}item_${index}`
}

export function loopMenuItem (children, cb) {
  let index = -1
  children.forEach((c) => {
    index++
    if (c && c.type && c.type.isMenuItemGroup) {
      c.$slots.default.forEach((c2) => {
        index++
        c.componentOptions && cb(c2, index)
      })
    } else {
      c.componentOptions && cb(c, index)
    }
  })
}

export function loopMenuItemRecusively (children, keys, ret) {
  if (!children || ret.find) {
    return
  }
  children.forEach((c) => {
    if (ret.find) {
      return
    }
    if (c.data && c.data.slot && c.data.slot !== 'default') {
      return
    }
    if (c && c.componentOptions) {
      const options = c.componentOptions.Ctor.options
      if (!options || !(options.isSubMenu || options.isMenuItem || options.isMenuItemGroup)) {
        return
      }
      if (keys.indexOf(c.key) !== -1) {
        ret.find = true
      } else if (c.componentOptions.children) {
        loopMenuItemRecusively(c.componentOptions.children, keys, ret)
      }
    }
  })
}
