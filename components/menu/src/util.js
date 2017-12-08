import React from 'react'

export function noop () {
}

export function getKeyFromChildrenIndex (child, menuEventKey, index) {
  const prefix = menuEventKey || ''
  return child.key || `${prefix}item_${index}`
}

export function loopMenuItem (children, cb) {
  let index = -1
  React.Children.forEach(children, (c) => {
    index++
    if (c && c.type && c.type.isMenuItemGroup) {
      React.Children.forEach(c.props.children, (c2) => {
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
  React.Children.forEach(children, (c) => {
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
      } else if (c.props.children) {
        loopMenuItemRecusively(c.props.children, keys, ret)
      }
    }
  })
}
