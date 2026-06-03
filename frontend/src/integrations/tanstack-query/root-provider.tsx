import { QueryClient } from '@tanstack/react-query';

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  })

  return {
    queryClient,
    auth: {
      isSignedIn: false,  // default (will be replaced later)
      userId: null,

    }
  }
}
export default function TanstackQueryProvider() {}
