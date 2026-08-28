import { QueryClient } from '@tanstack/react-query'


//<---------- queryClient -------------->
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})
