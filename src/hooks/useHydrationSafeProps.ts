import { useMemo } from 'react';

/**
 * Hook to filter out attributes that can cause hydration mismatches
 * These attributes are commonly added by browser extensions and can cause
 * server/client HTML differences
 */
export function useHydrationSafeProps<T extends Record<string, any>>(props: T): T {
  return useMemo(() => {
    const {
      fdprocessedid,
      'data-lastpass-icon-root': dataLastpassIconRoot,
      'data-1p-ignore': data1pIgnore,
      'data-lastpass-root': dataLastpassRoot,
      'data-bwignore': dataBwignore,
      'data-form-type': dataFormType,
      'data-lastpass-icon': dataLastpassIcon,
      ...filteredProps
    } = props;

    return filteredProps as T;
  }, [props]);
}
