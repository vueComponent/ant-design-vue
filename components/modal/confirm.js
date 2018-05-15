import Vue from 'vue'
import ConfirmDialog from './ConfirmDialog'

export default function confirm (config) {
  const div = document.createElement('div')
  const el = document.createElement('div')
  div.appendChild(el)
  document.body.appendChild(div)

  let confirmDialogInstance = null
  function close (...args) {
    destroy(...args)
  }

  function destroy (...args) {
    if (confirmDialogInstance && div.parentNode) {
      confirmDialogInstance.$destroy()
      confirmDialogInstance = null
      div.parentNode.removeChild(div)
    }
    const triggerCancel = args && args.length &&
      args.some(param => param && param.triggerCancel)
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args)
    }
  }

  function render (props) {
    const confirmDialogProps = {
      props,
    }
    return new Vue({
      el: el,
      render () {
        return <ConfirmDialog {...confirmDialogProps} />
      },
    })
  }

  confirmDialogInstance = render({ ...config, visible: true, close })

  return {
    destroy: close,
  }
}

