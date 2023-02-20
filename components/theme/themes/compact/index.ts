import genControlHeight from '../shared/genControlHeight';
import type { MapToken, SeedToken } from '../../interface';
import defaultAlgorithm from '../default';
import genCompactSizeMapToken from './genCompactSizeMapToken';
import genFontMapToken from '../shared/genFontMapToken';
import type { DerivativeFunc } from '../../../_util/cssinjs';

const derivative: DerivativeFunc<SeedToken, MapToken> = (token, mapToken) => {
  const mergedMapToken = mapToken ?? defaultAlgorithm(token);

  const fontSize = mergedMapToken.fontSizeSM; // Smaller size font-size as base
  const controlHeight = mergedMapToken.controlHeight - 4;

  return {
    ...mergedMapToken,
    ...genCompactSizeMapToken(mapToken ?? token),

    // font
    ...genFontMapToken(fontSize),

    // controlHeight
    controlHeight,
    ...genControlHeight({ ...mergedMapToken, controlHeight }),
  };
};

export default derivative;
