import { useEffect } from 'react'
import { useThemeStore } from './store/useThemeStore'
import { Sun, Moon, Github } from 'lucide-react'

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
            <Github size={28} />
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
