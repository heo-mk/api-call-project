import { useEffect } from 'react'
import { useThemeStore } from './store/useThemeStore'
import { Sun, Moon } from 'lucide-react'

// Lucide v1.x에서는 브랜드 아이콘(Github, Discord 등)이 패키지에서 제거되었으므로, 일관된 스타일링과 의존성 제거를 위해 SVG 컴포넌트로 직접 선언하여 사용합니다.
const GithubIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)


/*
  앱의 기본 메인 레이아웃 컴포넌트입니다.
  Zustand의 useThemeStore를 호출하여 사용자가 설정한 다크모드 전역 상태를 적용하고, 첫 진입 시 로컬 스토리지 설정을 HTML DOM에 반영합니다.
*/
function App() {
  const { isDarkMode, toggleTheme } = useThemeStore()

  // 첫 마운트 및 다크모드 변경 시 body 클래스를 동기화하여 화면 테마가 깜빡이지 않도록 합니다.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="container">
      <header className="header">
        <div className="header-inner">
          <div className="logo-container">
            <GithubIcon size={28} />
            <span>GitFind Dashboard</span>
          </div>
          <div className="header-actions">
            <label className="switch" aria-label="Toggle Theme">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleTheme} 
              />
              <span className="slider">
                {isDarkMode ? (
                  <Moon size={14} style={{ color: '#fff', marginLeft: '4px' }} />
                ) : (
                  <Sun size={14} style={{ color: '#f59e0b', marginLeft: '4px' }} />
                )}
              </span>
            </label>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="empty-state">
          <h2>1단계 세팅 완료!</h2>
          <p style={{ marginTop: '0.5rem' }}>
            Vite, TypeScript, React Query 및 Zustand 연동 환경이 구성되었습니다.
          </p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            상단 스위치로 다크모드를 토글해 보세요! 다음 단계에서 GitHub 검색 기능(useQuery)이 구현됩니다.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
