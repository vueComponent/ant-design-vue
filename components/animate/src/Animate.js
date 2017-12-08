import React from 'react'
import PropTypes from 'prop-types'
import {
  toArrayChildren,
  mergeChildren,
  findShownChildInChildrenByKey,
  findChildInChildrenByKey,
  isSameChildren,
} from './ChildrenUtils'
import AnimateChild from './AnimateChild'
const defaultKey = `rc_animate_${Date.now()}`
import animUtil from './util'

function getChildrenFromProps (props) {
  const children = props.children
  if (React.isValidElement(children)) {
    if (!children.key) {
      return React.cloneElement(children, {
        key: defaultKey,
      })
    }
  }
  return children
}

function noop () {
}

export default class Animate extends React.Component {
  static propTypes = {
    component: PropTypes.any,
    componentProps: PropTypes.object,
    animation: PropTypes.object,
    transitionName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    transitionEnter: PropTypes.bool,
    transitionAppear: PropTypes.bool,
    exclusive: PropTypes.bool,
    transitionLeave: PropTypes.bool,
    onEnd: PropTypes.func,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    onAppear: PropTypes.func,
    showProp: PropTypes.string,
  }

  static defaultProps = {
    animation: {},
    component: 'span',
    componentProps: {},
    transitionEnter: true,
    transitionLeave: true,
    transitionAppear: false,
    onEnd: noop,
    onEnter: noop,
    onLeave: noop,
    onAppear: noop,
  }

  constructor (props) {
    super(props)

    this.currentlyAnimatingKeys = {}
    this.keysToEnter = []
    this.keysToLeave = []

    this.state = {
      children: toArrayChildren(getChildrenFromProps(this.props)),
    }

    this.childrenRefs = {}
  }

  componentDidMount () {
    const showProp = this.props.showProp
    let children = this.state.children
    if (showProp) {
      children = children.filter((child) => {
        return !!child.props[showProp]
      })
    }
    children.forEach((child) => {
      if (child) {
        this.performAppear(child.key)
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    this.nextProps = nextProps
    const nextChildren = toArrayChildren(getChildrenFromProps(nextProps))
    const props = this.props
    // exclusive needs immediate response
    if (props.exclusive) {
      Object.keys(this.currentlyAnimatingKeys).forEach((key) => {
        this.stop(key)
      })
    }
    const showProp = props.showProp
    const currentlyAnimatingKeys = this.currentlyAnimatingKeys
    // last props children if exclusive
    const currentChildren = props.exclusive
      ? toArrayChildren(getChildrenFromProps(props))
      : this.state.children
    // in case destroy in showProp mode
    let newChildren = []
    if (showProp) {
      currentChildren.forEach((currentChild) => {
        const nextChild = currentChild && findChildInChildrenByKey(nextChildren, currentChild.key)
        let newChild
        if ((!nextChild || !nextChild.props[showProp]) && currentChild.props[showProp]) {
          newChild = React.cloneElement(nextChild || currentChild, {
            [showProp]: true,
          })
        } else {
          newChild = nextChild
        }
        if (newChild) {
          newChildren.push(newChild)
        }
      })
      nextChildren.forEach((nextChild) => {
        if (!nextChild || !findChildInChildrenByKey(currentChildren, nextChild.key)) {
          newChildren.push(nextChild)
        }
      })
    } else {
      newChildren = mergeChildren(
        currentChildren,
        nextChildren
      )
    }

    // need render to avoid update
    this.setState({
      children: newChildren,
    })

    nextChildren.forEach((child) => {
      const key = child && child.key
      if (child && currentlyAnimatingKeys[key]) {
        return
      }
      const hasPrev = child && findChildInChildrenByKey(currentChildren, key)
      if (showProp) {
        const showInNext = child.props[showProp]
        if (hasPrev) {
          const showInNow = findShownChildInChildrenByKey(currentChildren, key, showProp)
          if (!showInNow && showInNext) {
            this.keysToEnter.push(key)
          }
        } else if (showInNext) {
          this.keysToEnter.push(key)
        }
      } else if (!hasPrev) {
        this.keysToEnter.push(key)
      }
    })

    currentChildren.forEach((child) => {
      const key = child && child.key
      if (child && currentlyAnimatingKeys[key]) {
        return
      }
      const hasNext = child && findChildInChildrenByKey(nextChildren, key)
      if (showProp) {
        const showInNow = child.props[showProp]
        if (hasNext) {
          const showInNext = findShownChildInChildrenByKey(nextChildren, key, showProp)
          if (!showInNext && showInNow) {
            this.keysToLeave.push(key)
          }
        } else if (showInNow) {
          this.keysToLeave.push(key)
        }
      } else if (!hasNext) {
        this.keysToLeave.push(key)
      }
    })
  }

  componentDidUpdate () {
    const keysToEnter = this.keysToEnter
    this.keysToEnter = []
    keysToEnter.forEach(this.performEnter)
    const keysToLeave = this.keysToLeave
    this.keysToLeave = []
    keysToLeave.forEach(this.performLeave)
  }

  performEnter = (key) => {
    // may already remove by exclusive
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true
      this.childrenRefs[key].componentWillEnter(
        this.handleDoneAdding.bind(this, key, 'enter')
      )
    }
  }

  performAppear = (key) => {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true
      this.childrenRefs[key].componentWillAppear(
        this.handleDoneAdding.bind(this, key, 'appear')
      )
    }
  }

  handleDoneAdding = (key, type) => {
    const props = this.props
    delete this.currentlyAnimatingKeys[key]
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== this.nextProps) {
      return
    }
    const currentChildren = toArrayChildren(getChildrenFromProps(props))
    if (!this.isValidChildByKey(currentChildren, key)) {
      // exclusive will not need this
      this.performLeave(key)
    } else {
      if (type === 'appear') {
        if (animUtil.allowAppearCallback(props)) {
          props.onAppear(key)
          props.onEnd(key, true)
        }
      } else {
        if (animUtil.allowEnterCallback(props)) {
          props.onEnter(key)
          props.onEnd(key, true)
        }
      }
    }
  }

  performLeave = (key) => {
    // may already remove by exclusive
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true
      this.childrenRefs[key].componentWillLeave(this.handleDoneLeaving.bind(this, key))
    }
  }

  handleDoneLeaving = (key) => {
    const props = this.props
    delete this.currentlyAnimatingKeys[key]
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== this.nextProps) {
      return
    }
    const currentChildren = toArrayChildren(getChildrenFromProps(props))
    // in case state change is too fast
    if (this.isValidChildByKey(currentChildren, key)) {
      this.performEnter(key)
    } else {
      const end = () => {
        if (animUtil.allowLeaveCallback(props)) {
          props.onLeave(key)
          props.onEnd(key, false)
        }
      }
      if (!isSameChildren(this.state.children,
        currentChildren, props.showProp)) {
        this.setState({
          children: currentChildren,
        }, end)
      } else {
        end()
      }
    }
  }

  isValidChildByKey (currentChildren, key) {
    const showProp = this.props.showProp
    if (showProp) {
      return findShownChildInChildrenByKey(currentChildren, key, showProp)
    }
    return findChildInChildrenByKey(currentChildren, key)
  }

  stop (key) {
    delete this.currentlyAnimatingKeys[key]
    const component = this.childrenRefs[key]
    if (component) {
      component.stop()
    }
  }

  render () {
    const props = this.props
    this.nextProps = props
    const stateChildren = this.state.children
    let children = null
    if (stateChildren) {
      children = stateChildren.map((child) => {
        if (child === null || child === undefined) {
          return child
        }
        if (!child.key) {
          throw new Error('must set key for <rc-animate> children')
        }
        return (
          <AnimateChild
            key={child.key}
            ref={node => this.childrenRefs[child.key] = node}
            animation={props.animation}
            transitionName={props.transitionName}
            transitionEnter={props.transitionEnter}
            transitionAppear={props.transitionAppear}
            transitionLeave={props.transitionLeave}
          >
            {child}
          </AnimateChild>
        )
      })
    }
    const Component = props.component
    if (Component) {
      let passedProps = props
      if (typeof Component === 'string') {
        passedProps = {
          className: props.className,
          style: props.style,
          ...props.componentProps,
        }
      }
      return <Component {...passedProps}>{children}</Component>
    }
    return children[0] || null
  }
}
