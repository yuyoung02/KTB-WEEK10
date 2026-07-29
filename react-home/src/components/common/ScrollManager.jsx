// URL 해시에 맞춰 홈의 해당 구역으로 스크롤
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 });
      return undefined;
    }

    const sectionId = decodeURIComponent(hash.slice(1));
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, hash]);

  return null;
}

export default ScrollManager;
