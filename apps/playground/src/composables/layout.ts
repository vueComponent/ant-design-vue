import { inject, InjectionKey, provide, Ref } from 'vue'

export interface LayoutOptions {
  pageClass: Ref<string | undefined>
  contentClass: Ref<string | undefined>
  hideNavbar: Ref<boolean>
  hideBreadcrumbs: Ref<boolean>
}

const LayoutOptionsToken: InjectionKey<LayoutOptions> = Symbol()

export function provideLayoutOptions(options: LayoutOptions) {
  provide(LayoutOptionsToken, options)
}

export function injectLayoutOptions() {
  const options = inject(LayoutOptionsToken)
  if (!options) {
    throw new Error('"injectLayoutOptions" must be called inside pages')
  }
  return options
}
