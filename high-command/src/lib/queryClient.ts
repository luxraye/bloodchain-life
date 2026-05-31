import { QueryClient } from '@tanstack/react-query';

import { isDemoSession } from './isDemoSession';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: isDemoSession() ? false : 2,
            refetchOnWindowFocus: false,
        },
    },
});
