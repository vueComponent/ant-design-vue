import { TinyColor } from '@ctrl/tinycolor'

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

export const getCssVarColor = (baseColor: string) => {
  return {
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
