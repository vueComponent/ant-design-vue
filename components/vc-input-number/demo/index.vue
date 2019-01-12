<script>
import CombinationKeyFormat from '../vc-input-number/demo/combination-key-format';
import Custom from '../vc-input-number/demo/custom';
import Decimal from '../vc-input-number/demo/decimal';
import Formatter from '../vc-input-number/demo/formatter';
import SimpleUseTouch from '../vc-input-number/demo/simple-use-touch';
import Simple from '../vc-input-number/demo/simple';
import SimpleStep from '../vc-input-number/demo/simple-step';

export default {
  render () {
    return (
      <div>
        <CombinationKeyFormat />
        <Custom />
        <Decimal />
        <Formatter/>
        <SimpleUseTouch/>
        <Simple/>
        <SimpleStep/>
      </div>
    );
  },
};
</script>

