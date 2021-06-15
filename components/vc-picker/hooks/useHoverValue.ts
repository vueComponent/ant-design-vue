import { useState, useEffect, useRef } from 'react';
import type { ValueTextConfig } from './useValueTexts';
import useValueTexts from './useValueTexts';

export default function useHoverValue<DateType>(
  valueText: string,
  { formatList, generateConfig, locale }: ValueTextConfig<DateType>,
): [string, (date: DateType) => void, (immediately?: boolean) => void] {
  const [value, internalSetValue] = useState<DateType>(null);
  const raf = useRef(null);

  function setValue(val: DateType, immediately: boolean = false) {
    cancelAnimationFrame(raf.current);
    if (immediately) {
      internalSetValue(val);
      return;
    }
    raf.current = requestAnimationFrame(() => {
      internalSetValue(val);
    });
  }

  const [, firstText] = useValueTexts(value, {
    formatList,
    generateConfig,
    locale,
  });

  function onEnter(date: DateType) {
    setValue(date);
  }

  function onLeave(immediately: boolean = false) {
    setValue(null, immediately);
  }

  useEffect(() => {
    onLeave(true);
  }, [valueText]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return [firstText, onEnter, onLeave];
}
