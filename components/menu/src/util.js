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
        cb(c2, index)
      })
    } else {
      cb(c, index)
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
    if (c) {
      const construt = c.type
      if (!construt || !(construt.isSubMenu || construt.isMenuItem || construt.isMenuItemGroup)) {
        return
      }
      if (keys.indexOf(c.key) !== -1) {
        ret.find = true
      } else if (c.$slots.default) {
        loopMenuItemRecusively(c.$slots.default, keys, ret)
      }
    }
  })
}
