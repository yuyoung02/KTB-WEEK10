// 회원정보 수정 완료 토스트
function UpdateToast({ isOpen }) {
  if (!isOpen) return null;
  return (
    <div className="mypage-toast" role="status">
      수정완료
    </div>
  );
}

export default UpdateToast;
