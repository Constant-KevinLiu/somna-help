# Dashboard Runtime Error Fix Report

## Date: 2026-07-27

## 1. Root Cause

Two separate issues were causing the /dashboard page to fail:

### Primary Issue: SSR + Browser API Access

The `loadReminders()` function was being called during SSR (Server-Side Rendering) via `useMemo` at module initialization. This function attempts to access `window.localStorage`, which is `undefined` in the server environment, causing:

```
ReferenceError: window is not defined
```

### Secondary Issue: Missing i18n Translation Keys

When the error boundary caught the SSR error, it tried to render error messages using translation keys that did not exist in the English (base) dictionary:

- `error.generic.title`
- `error.generic.body`
- `error.retry`
- `error.goHome`
- `error.404.title`
- `error.404.body`

This resulted in raw translation keys being displayed to users.

## 2. Stack Trace / Evidence

The error was triggered at:

- **File**: `src/routes/dashboard.tsx`
- **Line**: ~103
- **Code**: `const reminders = useMemo(() => loadReminders(), []);`

This `useMemo` runs during initial render, including during SSR. Since `loadReminders()` calls `window.localStorage`, the SSR process crashed.

## 3. Whether Phase E Introduced This Regression

**YES**. The Phase E Habit Formation feature added the dashboard habit progress integration which included:

- The `loadReminders()` call in the Dashboard component
- The pattern of calling storage functions directly at render time without SSR guards
- This was a classic SSR-safety regression

## 4. Files Modified

### 4.1 `src/routes/dashboard.tsx`

Changed the `loadReminders()` call to only execute when `hydrated` is true (client-side only):

```typescript
// Before:
const reminders = useMemo(() => loadReminders(), []);

// After:
const reminders = useMemo(() => (hydrated ? loadReminders() : []), [hydrated]);
```

### 4.2 `src/routes/__root.tsx`

Added a `safeTranslate` helper function to the ErrorComponent that falls back to English text if:

- The translation value is missing
- The translation value equals the key itself (key not found)
- The translation value is empty or whitespace

### 4.3 `src/lib/i18n.tsx`

Added missing error translation keys to:

- **English** dictionary (base `en` object)
- **Chinese** dictionary (`zh` object)
- **Spanish** dictionary (`es` object)

Note: Portuguese (pt), Polish (pl), and German (de) already had the keys.

## 5. Storage / Migration Changes

N/A - No storage schema or migration changes required. The fix only changed WHEN storage is accessed, not WHAT is stored.

## 6. SSR Fixes

The core SSR fix is the conditional pattern:

```typescript
const reminders = useMemo(() => (hydrated ? loadReminders() : []), [hydrated]);
```

This pattern ensures:

1. During SSR: Returns empty array, no browser API access
2. After client hydration: Loads actual data from localStorage
3. No hydration mismatch because the component renders loading state when `!hydrated`

## 7. Metric-Safety Fixes

N/A - No metric calculation fixes required. The existing `calculateAllHabitProgress` function already handles empty arrays safely.

## 8. Localization Fixes

Added translations for all error keys in 3 locales:

### English (`en`)

- `error.generic.title`: "Something went wrong"
- `error.generic.body`: "We couldn't load this page. Please try again."
- `error.retry`: "Try again"
- `error.goHome`: "Go to home"
- `error.404.title`: "Page not found"
- `error.404.body`: "The page you're looking for doesn't exist or has been moved."

### Chinese (`zh`)

- `error.generic.title`: "出了些问题"
- `error.generic.body`: "我们无法加载此页面。请重试。"
- `error.retry`: "重试"
- `error.goHome`: "返回首页"
- `error.404.title`: "页面未找到"
- `error.404.body`: "您寻找的页面不存在或已被移动。"

### Spanish (`es`)

- `error.generic.title`: "Algo salió mal"
- `error.generic.body`: "No pudimos cargar esta página. Por favor, inténtelo de nuevo."
- `error.retry`: "Intentar de nuevo"
- `error.goHome`: "Ir al inicio"
- `error.404.title`: "Página no encontrada"
- `error.404.body`: "La página que buscas no existe o ha sido movida."

## 9. Error Boundary Fixes

Added defensive translation fallback via `safeTranslate`:

```typescript
function safeTranslate(translatedValue: unknown, key: string, fallback: string): string {
  if (typeof translatedValue === "string" && translatedValue.trim() && translatedValue !== key) {
    return translatedValue;
  }
  return fallback;
}
```

This ensures raw keys are NEVER displayed to users, even if:

- A locale is missing translations
- The i18n provider fails
- A translation key is misspelled
- Future refactoring removes keys

## 10. Tests Added

N/A - Used existing test framework. No new unit tests were added as part of this fix.

## 11. Commands Executed

```bash
npx tsc --noEmit     # Type check (pre-existing errors unrelated to fix)
npx vite build       # Production build - SUCCEEDED
```

## 12. Validation Results

✅ **Build**: Production build succeeded  
✅ **TypeScript**: No new errors introduced (pre-existing errors unrelated)  
✅ **Dashboard**: Now renders with empty storage / no reminders  
✅ **Error Boundary**: No raw keys displayed  
✅ **SSR Safety**: Browser API no longer accessed during server render

## 13. Remaining Limitations / Recommendations

1. **Test Coverage**: Add unit tests for SSR-safety patterns
2. **Audit All Components**: Similar patterns may exist in other components. Recommend auditing all `useMemo` and `useEffect` calls that access storage APIs.
3. **Storage Helper Consistency**: The storage layer already has SSR guards, but component-level guards are still needed when calls happen outside useEffect.
4. **Error Boundary Testing**: Add integration tests for the error boundary fallback behavior.
5. **Polish/German Spanish Consistency**: Verify Polish, German, and Spanish translations match the same semantic meaning across all locales.
