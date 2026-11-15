import { useEffect, useState } from 'react';

const EMPTY_DEPS = [];

/** Returns true for `ms` after mount and after every change of `deps`. Drives skeletons. */
export default function useLoading(deps, ms = 500) {
  const [loading, setLoading] = useState(true);
  const activeDeps = deps || EMPTY_DEPS;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setLoading(false);
    }, ms);
    return () => {
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, activeDeps);

  return loading;
}
