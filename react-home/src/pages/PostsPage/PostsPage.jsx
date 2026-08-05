// 게시글 목록 조회와 구장 필터·페이지 상태 관리
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPosts } from "../../api/postsApi";
import { getApiErrorMessage } from "../../api/client";
import PostList from "../../components/posts/PostList";
import PostSearch from "../../components/posts/PostSearch";
import StadiumDropdown from "../../components/posts/StadiumDropdown";
import { getStadiumCode, stadiums } from "../../data/stadiums";
import "./PostsPage.css";

function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stadiumParam = searchParams.get("stadium") ?? "";
  const stadiumIdFromUrl = stadiums.some((stadium) => stadium.id === stadiumParam)
    ? stadiumParam
    : "";
  const [posts, setPosts] = useState([]);
  const [selectedStadiumId, setSelectedStadiumId] = useState(stadiumIdFromUrl);
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedStadiumId(stadiumIdFromUrl);
  }, [stadiumIdFromUrl]);

  useEffect(() => {
    let isCancelled = false;

    async function loadPosts() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getPosts({
          stadiumId: getStadiumCode(selectedStadiumId),
          keyword: submittedKeyword,
        });

        if (isCancelled) return;

        setPosts(Array.isArray(data) ? data : []);
      } catch (requestError) {
        if (isCancelled) return;
        console.error(requestError);
        setPosts([]);
        setError(getApiErrorMessage(requestError, {
          default: "게시글을 불러오지 못했습니다.",
        }));
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadPosts();
    return () => {
      isCancelled = true;
    };
  }, [selectedStadiumId, submittedKeyword]);

  const handleStadiumChange = (stadiumId) => {
    setSelectedStadiumId(stadiumId);
    setSearchParams(stadiumId ? { stadium: stadiumId } : {});
  };

  return (
    <main className="posts-page">
      <section className="posts-container">
        <div className="page-title-row">
          <div>
            <p className="eyebrow">BALLPARK STORY</p>
            <h2>구장 이야기</h2>
            <p className="page-description">
              직관 전후에 들르기 좋은 핫플과 구장 정보를 공유해보세요.
            </p>
          </div>
        </div>

        <div className="filter-row">
          <StadiumDropdown
            stadiums={stadiums}
            selectedStadiumId={selectedStadiumId}
            onChange={handleStadiumChange}
          />
          <PostSearch
            keyword={keyword}
            onKeywordChange={setKeyword}
            onSearch={(searchKeyword) => setSubmittedKeyword(searchKeyword.trim())}
          />
        </div>

        <div className="write-button-wrap">
          <Link to="/posts/new" className="write-button">게시글 작성</Link>
        </div>

        <PostList posts={posts} isLoading={isLoading} error={error} />

      </section>
    </main>
  );
}

export default PostsPage;
