import { TinyColor } from '@ctrl/tinycolor'
import { generate, presetPalettes, presetDarkPalettes } from '@ant-design/colors'

export const getAlphaColor = (baseColor: string, alpha: number) =>
  new TinyColor(baseColor).setAlpha(alpha).toRgbString()

export const getSolidColor = (baseColor: string, brightness: number) => {
  const instance = new TinyColor(baseColor)
  return instance.darken(brightness).toHexString()
}

export const getTintColor = (baseColor: string, tintNumber: number) => {
  return new TinyColor(baseColor).tint(tintNumber).toString()
}

export const getShadeColor = (baseColor: string, shadeNumber: number) => {
  return new TinyColor(baseColor).shade(shadeNumber).toString()
}

export const getLightNeutralColor = () => {
  return {
    '--neutral-color': '#000000e0',
    '--neutral-secondary': '#000000a6',
    '--neutral-disabled': '#00000040',
    '--neutral-disabled-bg': '#0000000a',
    '--neutral-border': '#d9d9d9',
    '--neutral-separator': '#0505050f',
    '--neutral-bg': '#f5f5f5',
  }
}

export const getDarkNeutralColor = () => {
  return {
    '--neutral-color': '#FFFFFFD9',
    '--neutral-secondary': '#FFFFFFA6',
    '--neutral-disabled': '#FFFFFF40',
    '--neutral-disabled-bg': 'rgba(255, 255, 255, 0.08)',
    '--neutral-border': '#424242',
    '--neutral-separator': '#FDFDFD1F',
    '--neutral-bg': '#000000',
  }
}

export const getCssVarColor = (
  baseColor: string,
  opts?: { appearance: 'light' | 'dark'; backgroundColor: string },
) => {
  const { appearance = 'light', backgroundColor = '#141414' } = opts || {}
  const color = new TinyColor(baseColor)
  const preset = appearance === 'dark' ? presetDarkPalettes : presetPalettes
  const colors =
    preset[baseColor] ||
    generate(
      color.toHexString(),
      appearance === 'dark' ? { theme: appearance, backgroundColor } : undefined,
    )
  const accentColor = colors[5]
  return {
    '--accent-color-1': colors[0],
    '--accent-color-2': colors[1],
    '--accent-color-3': colors[2],
    '--accent-color-4': colors[3],
    '--accent-color-5': colors[4],
    '--accent-color-6': colors[5],
    '--accent-color-7': colors[6],
    '--accent-color-8': colors[7],
    '--accent-color-9': colors[8],
    '--accent-color-10': colors[9],
    '--accent-color': accentColor,
    '--accent-color-hover': colors[4],
    '--accent-color-active': colors[5],
    '--accent-color-content': '#ffffff',
    ...(appearance === 'dark' ? getDarkNeutralColor() : getLightNeutralColor()),
    '--bg-color': baseColor,
    '--bg-color-hover': getTintColor(baseColor, 10),
    '--bg-color-active': getTintColor(baseColor, 20),
    '--bg-color-content': '#ffffff',

    '--border-color': baseColor,
    '--border-color-hover': getTintColor(baseColor, 10),
    '--border-color-active': getTintColor(baseColor, 20),
    '--border-color-tint-10': getTintColor(baseColor, 10),
    '--border-color-tint-20': getTintColor(baseColor, 20),
    '--border-color-tint-30': getTintColor(baseColor, 30),
    '--border-color-tint-40': getTintColor(baseColor, 40),
    '--border-color-tint-50': getTintColor(baseColor, 50),
    '--border-color-tint-60': getTintColor(baseColor, 60),
    '--border-color-tint-70': getTintColor(baseColor, 70),
    '--border-color-tint-80': getTintColor(baseColor, 80),
    '--border-color-tint-90': getTintColor(baseColor, 90),
    '--bg-color-tint-10': getTintColor(baseColor, 10),
    '--bg-color-tint-20': getTintColor(baseColor, 20),
    '--bg-color-tint-30': getTintColor(baseColor, 30),
    '--bg-color-tint-40': getTintColor(baseColor, 40),
    '--bg-color-tint-50': getTintColor(baseColor, 50),
    '--bg-color-tint-60': getTintColor(baseColor, 60),
    '--bg-color-tint-70': getTintColor(baseColor, 70),
    '--bg-color-tint-80': getTintColor(baseColor, 80),
    '--bg-color-tint-90': getTintColor(baseColor, 90),
    '--text-color': baseColor,
    '--text-color-hover': getTintColor(baseColor, 10),
    '--text-color-active': getTintColor(baseColor, 20),
  }
}
