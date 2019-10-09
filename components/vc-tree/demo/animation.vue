<script>
/* eslint no-console:0 */
import Tree, { TreeNode } from '../index';
import '../assets/index.less';
import cssAnimation from '../../_util/css-animation';

function animate(node, show, done) {
  let height = node.offsetHeight;
  return cssAnimation(node, 'collapse', {
    start() {
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
      } else {
        height = node.offsetHeight;
        node.style.height = 0;
      }
    },
    active() {
      node.style.height = `${show ? height : 0}px`;
    },
    end() {
      node.style.height = '';
      done();
    },
  });
}

const animation = {
  enter(node, done) {
    return animate(node, true, done);
  },
  leave(node, done) {
    return animate(node, false, done);
  },
};
export default {
  render() {
    return (
      <div>
        <h2>expanded</h2>
        <Tree
          defaultExpandAll={false}
          defaultExpandedKeys={['p1']}
          openAnimation={{ on: animation, props: { appear: true } }}
        >
          <TreeNode title="parent 1" key="p1">
            <TreeNode key="p10" title="leaf" />
            <TreeNode title="parent 1-1" key="p11">
              <TreeNode title="parent 2-1" key="p21">
                <TreeNode title="leaf" />
                <TreeNode title="leaf" />
              </TreeNode>
              <TreeNode key="p22" title="leaf" />
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  },
};
</script>
<style>
.collapse {
  overflow: hidden;
  display: block;
}

.collapse-active {
  transition: height 0.3s ease-out;
}
</style>
