import { getCurrentInstance } from 'vue';
import _ from 'lodash';

const useThemeKey = () => {
  const instance = getCurrentInstance();

  if (!instance) {
    return _.uniqueId() + '';
  }

  return instance.uid + '';
};

export default useThemeKey;
