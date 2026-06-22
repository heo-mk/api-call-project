import React, { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  onSearch: (query: string) => void
  initialValue?: string
}

/*
  사용자 입력을 수집하고 검색 이벤트를 상위 컴포넌트로 전달하는 검색창 컴포넌트입니다.
  입력되는 매 타이핑마다 API가 호출되는 것을 방지하기 위해 로컬 상태(local state)로 입력을 관리하고, Form Submit 시점에만 검색 쿼리를 트리거합니다.
*/
export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(inputValue)
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-wrapper">
        <Search className="search-icon-inside" size={20} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="GitHub 레포지토리 검색..."
          className="search-input"
        />
      </div>
      <button type="submit" className="search-btn">
        검색
      </button>
    </form>
  )
}
