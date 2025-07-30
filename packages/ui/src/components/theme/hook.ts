import { inject, InjectionKey, provide } from 'vue'
import { ThemeProps } from './meta'

const ThemeSymbol: InjectionKey<ThemeProps> = Symbol('theme')

export const useThemeInject = () => {
  return inject(ThemeSymbol, {
    appearance: 'light',
    primaryColor: '#1677ff',
    dangerColor: '#ff4d4f',
    darkBackgroundColor: '#141414',
  } as ThemeProps)
}

export const useThemeProvide = (theme: ThemeProps) => {
  provide(ThemeSymbol, theme)
}
