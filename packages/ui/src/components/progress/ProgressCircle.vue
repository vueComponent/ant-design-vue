<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  percent: number
  successPercent?: number
  strokeColor?: string | string[] | Record<string, string>
  trailColor?: string
  strokeLinecap: 'butt' | 'square' | 'round'
  strokeWidth: number
  size: number
  gapDegree: number
  gapPosition: 'top' | 'bottom' | 'left' | 'right'
  type: 'circle' | 'dashboard'
}>()

const circleSize = computed(() => props.size)
const pathRadius = computed(() => 50 - props.strokeWidth / 2)

function getPathD(radius: number, beginAngle: number, endAngle: number) {
  // SVG arcs can't draw a full circle (start === end point), so cap at 359.9
  const clampedEnd = Math.min(endAngle, 359.9)
  const startRad = (beginAngle / 180) * Math.PI
  const endRad = ((beginAngle + clampedEnd) / 180) * Math.PI
  const x1 = 50 + radius * Math.sin(startRad)
  const y1 = 50 - radius * Math.cos(startRad)
  const x2 = 50 + radius * Math.sin(endRad)
  const y2 = 50 - radius * Math.cos(endRad)
  const largeArc = clampedEnd > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
}

function getPathStyles(offset: number, percent: number, color?: string) {
  const radius = pathRadius.value
  const len = Math.PI * 2 * radius
  const gapDeg = props.type === 'dashboard' ? 75 : props.gapDegree

  const begin = gapDeg / 2
  const end = 360 - gapDeg

  // Determine rotation based on gap position
  let rotate = 0
  switch (props.gapPosition) {
    case 'left':
      rotate = 90 + begin
      break
    case 'right':
      rotate = -90 + begin
      break
    case 'bottom':
      rotate = 180 + begin
      break
    default:
      rotate = -begin + (gapDeg ? begin : 0)
      break
  }

  const strokeDasharray = `${(percent / 100) * (end / 360) * len}px ${len}px`
  const strokeDashoffset = `${-(offset / 100) * (end / 360) * len}px`
  const transition = 'stroke-dashoffset 0.3s ease, stroke-dasharray 0.3s ease, stroke 0.3s'

  return {
    d: getPathD(radius, begin, end),
    style: {
      stroke: color || undefined,
      strokeDasharray,
      strokeDashoffset,
      transition,
    },
    transform: `rotate(${rotate} 50 50)`,
  }
}

const trailPath = computed(() =>
  getPathStyles(0, 100, props.trailColor || 'rgba(0, 0, 0, 0.04)'),
)
const strokePath = computed(() => {
  let color: string | undefined
  if (typeof props.strokeColor === 'string') color = props.strokeColor
  return getPathStyles(0, props.percent, color)
})
const successPath = computed(() => {
  if (!props.successPercent) return null
  return getPathStyles(props.percent, props.successPercent, 'var(--color-success, #52c41a)')
})
</script>

<template>
  <svg
    :width="circleSize"
    :height="circleSize"
    viewBox="0 0 100 100"
    class="ant-progress-circle"
  >
    <path
      :d="trailPath.d"
      :transform="trailPath.transform"
      :stroke="trailPath.style.stroke"
      :stroke-linecap="strokeLinecap"
      :stroke-width="strokeWidth"
      fill="none"
      class="ant-progress-circle-trail"
    />
    <path
      :d="strokePath.d"
      :transform="strokePath.transform"
      :style="strokePath.style"
      :stroke-linecap="strokeLinecap"
      :stroke-width="strokeWidth"
      fill="none"
      class="ant-progress-circle-path"
    />
    <path
      v-if="successPath"
      :d="successPath.d"
      :transform="successPath.transform"
      :style="successPath.style"
      :stroke-linecap="strokeLinecap"
      :stroke-width="strokeWidth"
      fill="none"
      class="ant-progress-circle-path ant-progress-circle-success"
    />
  </svg>
</template>
