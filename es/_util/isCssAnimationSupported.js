var animation = void 0;

function isCssAnimationSupported() {
  if (animation !== undefined) {
    return animation;
  }
  var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
  var elm = document.createElement('div');
  if (elm.style.animationName !== undefined) {
    animation = true;
  }
  if (animation !== undefined) {
    for (var i = 0; i < domPrefixes.length; i++) {
      if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
        animation = true;
        break;
      }
    }
  }
  animation = animation || false;
  return animation;
}

export default isCssAnimationSupported;