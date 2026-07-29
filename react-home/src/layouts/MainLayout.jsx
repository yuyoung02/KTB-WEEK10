// 공통 헤더와 페이지 본문 레이아웃
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header/Header";
import ScrollManager from "../components/common/ScrollManager";

function MainLayout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <Outlet />
    </>
  );
}

export default MainLayout;
