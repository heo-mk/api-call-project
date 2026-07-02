import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.scss'
import App from './App.tsx'

// QueryClient 인스턴스는 컴포넌트 외부에서 한 번만 생성하여 재렌더링 시 인스턴스가 재생성되는 것을 방지합니다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 사용자 경험을 위해 브라우저 포커스 시 자동 리페치를 비활성화합니다.
      retry: 1, // 실패 시 재시도 횟수를 1회로 제한하여 불필요한 API 호출을 방지합니다.
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

