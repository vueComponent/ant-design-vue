# Card Component Review

## Overview
This PR contains the code review for the Card component as part of the Component Review Tracker (vueComponent/ant-design-vue#8497).

## Issues Found

### 1. Accessibility - Missing ARIA Attributes
**File**: `packages/ui/src/components/card/Card.vue`
**Issue**: The Card component lacks proper ARIA attributes for screen readers.

**Current Code**:
```vue
<div :class="classes">
  <div v-if="hasHead" class="ant-card-head" :style="headStyle">
    <!-- ... -->
  </div>
  <!-- ... -->
</div>
```

**Recommended Fix**:
```vue
<div 
  :class="classes"
  role="article"
  :aria-label="title || 'Card'"
>
  <div v-if="hasHead" class="ant-card-head" :style="headStyle">
    <!-- ... -->
  </div>
  <!-- ... -->
</div>
```

### 2. CSS - Float Layout in CardGrid
**File**: `packages/ui/src/components/card/style/index.css`
**Issue**: CardGrid uses `float` layout which may cause issues.

**Current Code**:
```css
:where(.ant-card-grid) {
  @apply float-left overflow-hidden p-6;
  width: 33.33%;
  /* ... */
}
```

**Analysis**:
- Using `float` layout is outdated and may cause clearfix issues
- Consider using flexbox or grid instead

**Recommended Fix**:
```css
:where(.ant-card-grid) {
  @apply overflow-hidden p-6;
  width: 33.33%;
  /* ... */
}

/* Add a grid container */
:where(.ant-card-grid-container) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
}
```

### 3. Style - Missing Dark Mode Support
**File**: `packages/ui/src/components/card/style/index.css`
**Issue**: Card styles lack dark mode support.

**Current Code**:
```css
:where(.ant-card) {
  @apply box-border relative;
  font-family: var(--ant-font-family);
  font-size: var(--ant-font-size, 14px);
  color: var(--color-neutral, rgba(0, 0, 0, 0.88));
  background: #fff;
  border-radius: var(--ant-border-radius, 8px);
}
```

**Recommended Addition**:
```css
@media (prefers-color-scheme: dark) {
  :where(.ant-card) {
    color: var(--color-neutral-dark, rgba(255, 255, 255, 0.85));
    background: var(--color-neutral-bg-container-dark, #1f1f1f);
  }
  
  :where(.ant-card) .ant-card-head {
    color: var(--color-neutral-dark, rgba(255, 255, 255, 0.85));
    border-bottom-color: var(--color-neutral-border-dark, #434343);
  }
}
```

### 4. TypeScript - Missing Export for Sub-components
**File**: `packages/ui/src/components/card/index.ts`
**Issue**: CardMeta and CardGrid are exported but not documented.

**Current Code**:
```typescript
export { default as Card } from './Card.vue'
export { default as CardMeta } from './CardMeta.vue'
export { default as CardGrid } from './CardGrid.vue'
export * from './types'
```

**Analysis**:
- These are already exported ✅
- But users may not know how to use them
- Consider adding documentation

### 5. Documentation - Missing JSDoc Comments
**File**: `packages/ui/src/components/card/types.ts`
**Issue**: Some props lack detailed JSDoc documentation.

**Recommended Enhancement**:
```typescript
export interface CardProps {
  /** Card title text */
  title?: string
  /** Whether to show border (default: true) */
  bordered?: boolean
  /** Inline CSS style for body section */
  bodyStyle?: Record<string, string>
  /** Inline CSS style for head section */
  headStyle?: Record<string, string>
  /** Show loading skeleton animation (default: false) */
  loading?: boolean
  /** Lift card on hover with shadow (default: false) */
  hoverable?: boolean
  /** Card type: 'inner' for nested cards */
  type?: 'inner'
  /** Card size: 'default' or 'small' (default: 'default') */
  size?: 'default' | 'small'
  /** Active tab key (for future tab support) */
  activeTabKey?: string
  /** Default active tab key */
  defaultActiveTabKey?: string
}
```

## Positive Aspects
1. ✅ Excellent use of Vue 3 Composition API
2. ✅ Proper TypeScript typing with comprehensive interfaces
3. ✅ Clean CSS with proper styling
4. ✅ Good support for loading state
5. ✅ Clean slot support for customization
6. ✅ Good hoverable effect
7. ✅ Proper border support
8. ✅ Good size variations

## Recommendations
1. Add ARIA attributes for accessibility
2. Consider using flexbox/grid for CardGrid
3. Add dark mode support
4. Enhance JSDoc documentation

## Checklist
- [x] Code follows project conventions
- [x] TypeScript types are properly defined
- [x] Component logic is clear and maintainable
- [x] Good loading state support
- [ ] Accessibility improvements needed
- [ ] CSS layout improvements needed
- [ ] Dark mode support needed

---

**Reviewer**: @ruguoba
**Date**: 2026-05-13
**Component**: Card
**Issue**: vueComponent/ant-design-vue#8497
