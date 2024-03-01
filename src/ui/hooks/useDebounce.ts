import { useCallback, useEffect, useRef } from 'react';

const DEFAULT_DEBOUNCE = 300;

export const useDebounce = <TCallback extends (...args: any[]) => any>(
    fn: TCallback | undefined,
    {
        ms = DEFAULT_DEBOUNCE
    }: {
        ms?: number;
    } = {}
) => {
    const functionRef = useRef(fn);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    functionRef.current = fn;

    const debouncedCallback = useCallback(
        (...args: any[]): any => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (functionRef.current) {
                const fn = functionRef.current;
                // eslint-disable-next-line prefer-spread
                timerRef.current = setTimeout(() => fn.apply(null, args), ms);
            }

            return undefined;
        },
        [ms]
    );

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [debouncedCallback]);

    return debouncedCallback;
};
