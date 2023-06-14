import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  ) 
}

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }