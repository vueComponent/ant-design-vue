import NumCalculator from './NumCalculator';
import CSSCalculator from './CSSCalculator';
import type AbstractCalculator from './calculator';

const genCalc = (type: 'css' | 'js') => {
  const Calculator = type === 'css' ? CSSCalculator : NumCalculator;

  return (num: number | string | AbstractCalculator) => new Calculator(num);
};

export default genCalc;
