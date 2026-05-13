# Collapse Component Review

## Overview
This PR contains the code review for the Collapse component as part of the Component Review Tracker (vueComponent/ant-design-vue#8497).

## Issues Found

### 1. Accessibility - Missing ARIA Attributes
**File**: `packages/ui/src/components/collapse/Collapse.vue`
**Issue**: The Collapse component has `role="tablist"` but lacks other ARIA attributes.

**Current Code**:
```vue
<div :class="classes" role="tablist">
  <slot />
</div>
```

**Recommended Fix**:
```vue
<div 
  :class="classes" 
  role="tablist"
  :aria-label="title || 'Collapse'"
>
  <slot />
</div>
```

### 2. Edge Case - normalizeKeys Function
**File**: `packages/ui/src/components/collapse/Collapse.vue`
**Issue**: The `normalizeKeys` function handles `null` and `undefined` similarly.

**Current Code**:
```typescript
function normalizeKeys(val: string | number | (string | number)[] | undefined): (string | number)[] {
  if (val == null) return []
  return Array.isArray(val) ? [...val] : [val]
}
```

**Analysis**:
- `val == null` catches both `null` and `undefined`
- This is intentional but may be confusing
- Consider adding comments for clarity

**Recommended Fix**:
```typescript
function normalizeKeys(val: string | number | (string | number)[] | undefined): (string | number)[] {
  // Handle null and undefined
  if (val == null) return []
  // Handle array
  if (Array.isArray(val)) return [...val]
  // Handle single value
  return [val]
}
```

### 3. Style - Missing Dark Mode Support
**File**: `packages/ui/src/components/collapse/style/index.css`
**Issue**: Collapse styles lack dark mode support.

**Current Code**:
```css
:where(.ant-collapse) {
  @apply box-border;
  font-family: var(--ant-font-family);
  font-size: var(--ant-font-size);
  line-height: var(--ant-line-height);
  color: var(--color-neutral, rgba(0, 0, 0, 0.88));
  background-color: var(--color-neutral-bg-container-alt, rgba(0, 0, 0, 0.02));
  border: 1px solid var(--color-neutral-border, #d9d9d9);
  border-bottom: 0;
  border-radius: var(--ant-border-radius, 8px);
}
```

**Recommended Addition**:
```css
@media (prefers-color-scheme: dark) {
  :where(.ant-collapse) {
    color: var(--color-neutral-dark, rgba(255, 255, 255, 0.85));
    background-color: var(--color-neutral-bg-container-alt-dark, rgba(255, 255, 255, 0.04));
    border-color: var(--color-neutral-border-dark, #434343);
  }
  
  :where(.ant-collapse) .ant-collapse-content {
    color: var(--color-neutral-dark, rgba(255, 255, 255, 0.85));
    background-color: var(--color-neutral-bg-container-dark, #1f1f1f);
  }
}
```

### 4. TypeScript - Missing Export for Context Key
**File**: `packages/ui/src/components/collapse/types.ts`
**Issue**: The `collapseContextKey` is exported but not documented.

**Current Code**:
```typescript
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContext')
```

**Analysis**:
- This is already exported ✅
- But users may not know how to use it
- Consider adding documentation

### 5. Documentation - Missing JSDoc Comments
**File**: `packages/ui/src/components/collapse/types.ts`
**Issue**: Some props lack detailed JSDoc documentation.

**Recommended Enhancement**:
```typescript
export interface CollapseProps {
  /** Currently active panel key(s) (controlled mode) */
  activeKey?: string | number | (string | number)[]
  /** Default active panel key(s) (uncontrolled mode) */
  defaultActiveKey?: string | number | (string | number)[]
  /** Only allow one panel open at a time (accordion mode) */
  accordion?: boolean
  /** Show border around collapse (default: true) */
  bordered?: boolean
  /** Position of the expand icon: 'start' or 'end' (default: 'start') */
  expandIconPosition?: 'start' | 'end'
  /** Restrict collapsible trigger area: 'header', 'icon', or 'disabled' */
  collapsible?: CollapsibleType
  /** Transparent background with no borders (default: false) */
  ghost?: boolean
  /** Destroy panel content when collapsed (default: false) */
  destroyInactivePanel?: boolean
}
```

## Positive Aspects
1. ✅ Excellent use of Vue 3 Composition API
2. ✅ Proper TypeScript typing with comprehensive interfaces
3. ✅ Good use of inject/provide for parent-child communication
4. ✅ Clean CSS with proper styling
5. ✅ Good support for accordion mode
6. ✅ Proper controlled/uncontrolled mode support
7. ✅ Clean slot support for customization
8. ✅ Good accessibility support (role="tablist")

## Recommendations
1. Add more ARIA attributes for accessibility
2. Improve normalizeKeys function clarity
3. Add dark mode support
4. Enhance JSDoc documentation

## Checklist
- [x] Code follows project conventions
- [x] TypeScript types are properly defined
- [x] Component logic is clear and maintainable
- [x] Good accessibility support
- [ ] Dark mode support needed
- [ ] Documentation enhancements needed

---

**Reviewer**: @ruguoba
**Date**: 2026-05-13
**Component**: Collapse
**Issue**: vueComponent/ant-design-vue#8497
