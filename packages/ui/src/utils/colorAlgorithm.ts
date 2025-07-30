import { TinyColor } from '@ctrl/tinycolor'
import { generate, presetPalettes, presetDarkPalettes } from '@ant-design/colors'

export const getLightNeutralColor = () => {
  return {
    '--color-neutral': '#000000e0',
    '--color-neutral-secondary': '#000000a6',
    '--color-neutral-disabled': '#00000040',
    '--color-neutral-disabled-bg': '#0000000a',
    '--color-neutral-border': '#d9d9d9',
    '--color-neutral-separator': '#0505050f',
    '--color-neutral-bg': '#f5f5f5',
  }
}

export const getDarkNeutralColor = () => {
  return {
    '--color-neutral': '#FFFFFFD9',
    '--color-neutral-secondary': '#FFFFFFA6',
    '--color-neutral-disabled': '#FFFFFF40',
    '--color-neutral-disabled-bg': 'rgba(255, 255, 255, 0.08)',
    '--color-neutral-border': '#424242',
    '--color-neutral-separator': '#FDFDFD1F',
    '--color-neutral-bg': '#000000',
  }
}

const cacheColors = new Map<string, Record<string, string>>()

export const getCssVarColor = (
  baseColor: string,
  opts: { appearance: 'light' | 'dark'; backgroundColor: string },
) => {
  const { appearance = 'light', backgroundColor = '#141414' } = opts
  const cacheKey = `${baseColor}-${appearance}-${backgroundColor}`
  if (cacheColors.has(cacheKey)) {
    return cacheColors.get(cacheKey)
  }
  const color = new TinyColor(baseColor)
  const preset = appearance === 'dark' ? presetDarkPalettes : presetPalettes
  const colors =
    preset[baseColor] ||
    generate(
      color.toHexString(),
      appearance === 'dark' ? { theme: appearance, backgroundColor } : undefined,
    )
  const accentColor = colors[5]
  const cssVars = {
    '--color-accent-1': colors[0],
    '--color-accent-2': colors[1],
    '--color-accent-3': colors[2],
    '--color-accent-4': colors[3],
    '--color-accent-5': colors[4],
    '--color-accent-6': colors[5],
    '--color-accent-7': colors[6],
    '--color-accent-8': colors[7],
    '--color-accent-9': colors[8],
    '--color-accent-10': colors[9],
    '--color-accent': accentColor,
    '--color-accent-hover': colors[4],
    '--color-accent-active': colors[6],
    '--color-accent-content': '#ffffff',

    '--color-error': preset.red[4],
    '--color-warning': preset.yellow[4],
    '--color-success': preset.green[4],
    '--color-info': preset.blue[4],

    ...(appearance === 'dark' ? getDarkNeutralColor() : getLightNeutralColor()),
  }
  cacheColors.set(cacheKey, cssVars)
  return cssVars
}
