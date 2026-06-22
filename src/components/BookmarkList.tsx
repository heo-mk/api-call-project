import React from 'react'
import { Bookmark, X, ExternalLink } from 'lucide-react'
import type { GithubRepo } from '../api/github'

interface BookmarkListProps {
  bookmarks: GithubRepo[]
  onRemove: (repo: GithubRepo) => void
}

/*
  즐겨찾기에 등록된 레포지토리 목록을 사이드바 형태로 렌더링하는 컴포넌트입니다.
  검색 결과와 즐겨찾기는 서로 다른 데이터 출처(서버 상태 vs 클라이언트 상태)를 가지므로, 명확한 관심사 분리를 위해 별도 컴포넌트로 분리했습니다.
*/
export const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, onRemove }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bookmark size={18} />
            즐겨찾기
          </span>
          <span className="badge">{bookmarks.length}</span>
        </div>

        {bookmarks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
            검색 결과의 ☆ 버튼으로<br />즐겨찾기를 추가해 보세요.
          </p>
        ) : (
          <div className="mini-bookmark-list">
            {bookmarks.map((repo) => (
              <div key={repo.id} className="mini-card">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mini-card-title"
                  title={repo.full_name}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ExternalLink size={12} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                  {repo.full_name}
                </a>
                {/* 즐겨찾기 제거 버튼: 작은 X 아이콘으로 사이드바 내 직접 제거가 가능합니다. */}
                <button
                  onClick={() => onRemove(repo)}
                  className="icon-btn"
                  aria-label={`Remove ${repo.name} from bookmarks`}
                  style={{ padding: '0.25rem' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
