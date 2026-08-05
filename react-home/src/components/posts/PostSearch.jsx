// 게시글 키워드 검색 입력 UI
function PostSearch({ keyword, onKeywordChange, onSearch }) {
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
      </div>
      <button type="submit">검색</button>
    </form>
  );
}

export default PostSearch;
