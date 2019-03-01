import Rate from '../index';
import VcTooltip from '../../vc-tooltip/index';
import '../../vc-tooltip/assets/bootstrap_white.less';
import '../assets/index.less';

export default {
  data() {
    return {};
  },
  render() {
    return (
      <div style="margin: 100px">
        <Rate
          defaultValue={3}
          characterRender={(node, props) => {
            // console.dir(node);
            // console.dir(props.index);
            return (
              <VcTooltip placement="top" overlay={props.index}>
                {node}
              </VcTooltip>
            );
          }}
        />
      </div>
    );
  },
};
