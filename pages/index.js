
import { Inter } from '@next/font/google'
import SignerApp from './SignerApp'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignerApp/>
    </QueryClientProvider>
  )
}
