// 페이지 URL과 공개, 인증 라우트
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import MyPage from "./pages/MyPage/MyPage";
import PasswordEditPage from "./pages/PasswordEditPage/PasswordEditPage";
import PostDetailPage from "./pages/PostDetailPage/PostDetailPage";
import PostEditPage from "./pages/PostEditPage/PostEditPage";
import PostWritePage from "./pages/PostWritePage/PostWritePage";
import PostsPage from "./pages/PostsPage/PostsPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/password" element={<PasswordEditPage />} />
            <Route path="/posts/new" element={<PostWritePage />} />
            <Route path="/posts/:postId/edit" element={<PostEditPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
