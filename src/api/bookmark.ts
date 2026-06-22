/*
  즐겨찾기 API 서버와의 통신을 시뮬레이션하는 모듈입니다.
  실제 서버가 없으므로 setTimeout으로 네트워크 지연을 재현하고,
  shouldError 플래그로 실패 시나리오를 인위적으로 발생시켜 Optimistic Update + Rollback 동작을 검증합니다.
*/
export const simulateBookmarkToggle = (shouldError: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldError) {
        // 에러 토글이 켜져 있으면 서버 오류를 시뮬레이션하여 onError 롤백 경로를 테스트합니다.
        reject(new Error('서버 오류: 즐겨찾기 변경에 실패했습니다. 롤백됩니다.'))
      } else {
        resolve()
      }
    }, 1500) // 1.5초 딜레이: 네트워크 요청 중임을 사용자가 인지할 수 있도록 의도적으로 설정합니다.
  })
}
