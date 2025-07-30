import { inject, InjectionKey, provide, Reactive } from 'vue'

type ThemeType = Reactive<{
  appearance: 'light' | 'dark'
  primaryColor: string
  dangerColor: string
}>

const ThemeSymbol: InjectionKey<ThemeType> = Symbol('theme')

export const useThemeInject = () => {
  return inject(ThemeSymbol, {
    appearance: 'light',
    primaryColor: '#1677ff',
    dangerColor: '#ff4d4f',
  })
}

export const useThemeProvide = (theme: ThemeType) => {
  provide(ThemeSymbol, theme)
}
