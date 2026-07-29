// 게시글 본문과 첨부 이미지 표시
function PostBody({ text, image }) {
  return (
    <section className="detail-post-body">
      {/* TODO: 이미지 저장 정책 확정 전까지 백엔드의 String URL을 그대로 사용한다. */}
      {image && (
        <div className="post-image">
          <img src={image} alt="게시글 첨부 이미지" />
        </div>
      )}
      <p className="post-text">{text}</p>
    </section>
  );
}

export default PostBody;
