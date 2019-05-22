import Vue from 'vue';
import Spin, { setDefaultIndicator } from './Spin';

export { SpinProps } from './Spin';

function loading(config) {
  const div = document.createElement('div');
  div.setAttribute('class', 'ant-spin-wrapper');
  const el = document.createElement('div');
  div.appendChild(el);
  document.body.appendChild(div);
  let currentConfig = { ...config, spinning: true };

  let loadingInstance = null;
  const loadingProps = { props: {} };

  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    loadingProps.props = currentConfig;
  }

  function destroy(...args) {
    if (loadingInstance && div.parentNode) {
      loadingInstance.$destroy();
      loadingInstance = null;
      div.parentNode.removeChild(div);
    }
  }
  function close(...args) {
    destroy(...args);
  }

  function render(props) {
    loadingProps.props = props;
    return new Vue({
      el: el,
      data() {
        return { loadingProps };
      },
      render() {
        // 先解构，避免报错，原因不详
        const cdProps = { ...this.loadingProps };
        return <Spin {...cdProps} />;
      },
    });
  }

  loadingInstance = render(currentConfig);

  return {
    close,
    destroy: close,
    update,
  };
}

const open = function(props) {
  const config = {
    size: 'large',
    ...props,
  };

  return loading(config);
};

Spin.open = open;

Spin.setDefaultIndicator = setDefaultIndicator;

/* istanbul ignore next */
Spin.install = function(Vue) {
  Vue.component(Spin.name, Spin);
};

export default Spin;
