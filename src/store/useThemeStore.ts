import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDarkMode: boolean
  toggleTheme: () => void
}

/*
  Zustand persist 미들웨어를 사용하여 사용자의 테마 설정을 로컬 스토리지에 유지합니다.
  클라이언트 사이드 상태이므로 무겁고 설정이 복잡한 Context API나 Redux 대신 경량화된 Zustand를 선택해 코드 양을 줄이고 가독성을 높였습니다.
*/
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => {
        const nextMode = !state.isDarkMode
        // DOM 요소의 classList에 'dark' 클래스를 토글하여 CSS 변수 모드를 제어합니다.
        if (nextMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { isDarkMode: nextMode }
      }),
    }),
    {
      name: 'theme-storage', // 로컬 스토리지 키
    }
  )
)
