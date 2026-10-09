import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.scss'
import App from './App.tsx'
import { RateLimitError } from './api/github'

// 새로고침 시 브라우저가 이전 스크롤 위치를 복원하지 않고 맨 위에서 시작하게 함
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// QueryClient 인스턴스는 컴포넌트 외부에서 한 번만 생성하여 재렌더링 시 인스턴스가 재생성되는 것을 방지합니다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 사용자 경험을 위해 브라우저 포커스 시 자동 리페치를 비활성화합니다.
      retry: (failureCount, error) => !(error instanceof RateLimitError) && failureCount < 1, // 재시도는 1회로 제한하고, 한도 초과 오류는 재시도하지 않아 불필요한 API 호출을 방지합니다.
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

