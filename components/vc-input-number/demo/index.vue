<script>
import CombinationKeyFormat from './combination-key-format.jsx';
import Custom from './custom.jsx';
import Decimal from './decimal.jsx';
import Formatter from './formatter.jsx';
import SimpleUseTouch from './simple-use-touch.jsx';
import Simple from './simple.jsx';
import SmallStep from './small-step.jsx';

export default {
  render() {
    return (
      <div>
        <CombinationKeyFormat />
        <Custom />
        <Decimal />
        <Formatter />
        <SimpleUseTouch />
        <Simple />
        <SmallStep />
      </div>
    );
  },
};
</script>
