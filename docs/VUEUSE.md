# VueUse Integration Guide

This project adopts a **VueUse-first paradigm**. Before implementing custom helper functions, composables, or adding new utilities, always check [VueUse](https://vueuse.org/) first.

## Installation

VueUse is installed as a production dependency:
```bash
npm install @vueuse/core
```

Version: `^14.2.1` (Vue 3.5+ compatible)

## Why VueUse?

- **Best Practices**: Community-maintained, production-tested composables
- **Consistency**: Follow Vue ecosystem standards instead of reinventing
- **Maintainability**: Less custom code to maintain and debug
- **Documentation**: Well-documented with examples
- **Performance**: Optimized implementations from Vue core team contributions

## Common Composables for This Project

### Theme & Dark Mode
```typescript
import { usePreferredDark } from '@vueuse/core'

// Detect system dark mode preference
const isDark = usePreferredDark()
```

### Local Storage
```typescript
import { useLocalStorage } from '@vueuse/core'

// Persist theme preference
const theme = useLocalStorage('app-theme', 'light')

// Persist quiz progress or user responses
const responses = useLocalStorage('quiz-responses', {})
```

### Window & Device
```typescript
import { useWindowSize, useScreenOrientation } from '@vueuse/core'

// Responsive design helpers
const { width, height } = useWindowSize()
const { orientation } = useScreenOrientation()
```

### Event Listeners
```typescript
import { useEventListener, useKeyboard } from '@vueuse/core'

// Clean event handling with automatic cleanup
useEventListener('click', handleClick)
useEventListener('resize', handleResize)

// Keyboard shortcuts
const { Enter, Escape } = useKeyboard()
```

### Timing & Debouncing
```typescript
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

// Debounce search input
const debouncedSearch = useDebounceFn((query) => {
  // search API call
}, 300)

// Throttle scroll events
const throttledScroll = useThrottleFn(handleScroll, 100)
```

### Async State
```typescript
import { useAsyncState } from '@vueuse/core'

// Simplified async data fetching
const { state, loading, error } = useAsyncState(
  async () => {
    const res = await fetch('/api/personality')
    return res.json()
  },
  {}
)
```

## When to Use Custom Code

Custom code is justified when:

1. **No VueUse equivalent exists** and the logic is specific to this project
2. **VueUse composable is overkill** for a trivial one-liner utility
3. **Business logic is deeply project-specific** and not reusable

Even then, consider:
- Can the logic be extracted to a separate utility function?
- Would wrapping a VueUse composable be cleaner?

## Examples in This Project

### Theme Switching (VueUse-first)
Instead of:
```typescript
// ❌ Custom implementation
const isDark = ref(false)
onMounted(() => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
})
```

Use:
```typescript
// ✅ VueUse
import { usePreferredDark } from '@vueuse/core'
const isDark = usePreferredDark()
```

### Persisting User Responses (VueUse-first)
Instead of:
```typescript
// ❌ Custom implementation
const responses = ref({})
watch(responses, (newVal) => {
  localStorage.setItem('responses', JSON.stringify(newVal))
})
onMounted(() => {
  const saved = localStorage.getItem('responses')
  if (saved) responses.value = JSON.parse(saved)
})
```

Use:
```typescript
// ✅ VueUse
import { useLocalStorage } from '@vueuse/core'
const responses = useLocalStorage('responses', {})
```

## VueUse API Reference

Full documentation: https://vueuse.org/

### Popular Composables by Category

**State & Reactive**
- `useLocalStorage()` - Reactive local storage
- `useSessionStorage()` - Reactive session storage
- `useAsyncState()` - Async state with loading/error

**Browser**
- `useWindowSize()` - Window dimensions
- `useWindowScroll()` - Scroll position
- `useScreenOrientation()` - Device orientation
- `useGeolocation()` - Geolocation API

**CSS & DOM**
- `useCssVar()` - CSS variable manipulation
- `useElementSize()` - Element dimensions
- `useIntersectionObserver()` - Intersection detection

**Events**
- `useEventListener()` - Event listener with cleanup
- `useKeyboard()` - Keyboard state
- `useMousePressed()` - Mouse button state
- `useClickOutside()` - Click outside detection

**Timing**
- `useDebounceFn()` - Debounce function
- `useThrottleFn()` - Throttle function
- `useRafFn()` - RequestAnimationFrame loop
- `useTimeout()` - Timeout with cleanup

**Utilities**
- `useToggle()` - Boolean toggle
- `useCounter()` - Counter state
- `useClipboard()` - Clipboard API

## Contribution Guidelines

When adding new functionality:

1. **Check VueUse first**
   ```
   https://vueuse.org/functions.html
   ```

2. **If not found, implement custom composable** following Vue/VueUse patterns
   - Name with `use` prefix: `useMyComposable()`
   - Place in `src/composables/`
   - Document with JSDoc comments

3. **If implementing similar functionality to VueUse later**, consider replacing custom code with VueUse equivalent

## Resources

- VueUse Official Docs: https://vueuse.org/
- VueUse GitHub: https://github.com/vueuse/vueuse
- Vue 3 Composables Guide: https://vuejs.org/guide/reusability/composables.html

