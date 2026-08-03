// 게시글 키워드 검색 입력 UI
function PostSearch({ keyword, onKeywordChange }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: 키워드 검색 -> 검색함수 호출로
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <input
        type="search"
        value={keyword}
        placeholder="구장 정보 검색"
        aria-label="게시글 검색어"
        onChange={(event) => onKeywordChange(event.target.value)}
      />
      <button type="submit">검색</button>
    </form>
  );
}

export default PostSearch;
