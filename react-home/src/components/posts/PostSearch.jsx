// 게시글 키워드 검색 입력 UI
function PostSearch({ keyword, onKeywordChange, onSearch, onClear }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(keyword);
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <div className="search-input-wrap">
        <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.3" />
          <path d="m15.5 15.5 4.2 4.2" />
        </svg>
        <input
          type="search"
          value={keyword}
          placeholder="제목이나 본문을 검색해보세요"
          aria-label="게시글 검색어"
          onChange={(event) => onKeywordChange(event.target.value)}
        />
        {keyword && (
          <button
            type="button"
            className="search-clear"
            aria-label="검색어 지우기"
            onClick={onClear}
          >
            ×
          </button>
        )}
      </div>
      <button type="submit" className="search-submit">검색</button>
    </form>
  );
}

export default PostSearch;
