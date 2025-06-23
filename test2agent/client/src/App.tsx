import { useState, useEffect } from "react";
import { Chat } from "./components/chat/Chat";
import { Landing } from "./components/Landing";
import { AgenticaRpcProvider } from "./provider/AgenticaRpcProvider";
import { AuthProvider, useAuth } from "./store/authStore";
import { Header } from "./components/layout/Header";
import { LoginModal } from "./components/auth/LoginModal";

function AppContent() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { setSocialLoginSuccess } = useAuth();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  // 소셜 로그인 완료 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginStatus = urlParams.get('login');
    const email = urlParams.get('email');
    const name = urlParams.get('name');

    if (loginStatus === 'success' && email) {
      // 🔧 한글 이름 디코딩 처리
      const decodedName = name ? decodeURIComponent(name) : '';
      
      console.log('소셜 로그인 성공 처리:', {
        email,
        originalName: name,
        decodedName
      });

      // 소셜 로그인 성공 처리
      setSocialLoginSuccess(email, decodedName);

      // URL 파라미터 정리
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // 로그인 모달 닫기
      setIsLoginModalOpen(false);
    }
  }, []); // 빈 dependency array로 변경 - 마운트 시에만 실행

  return (
    <div className="relative min-h-screen">
      {/* Shared Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-slate-900 to-neutral-900" />
      <div className="fixed inset-0 opacity-[0.07] bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header */}
      <Header onLoginClick={handleLoginClick} />

      {/* Content */}
      <div className="relative flex w-full min-h-screen pt-20">
        <div className="hidden lg:flex md:flex-1">
          <Landing />
        </div>
        <AgenticaRpcProvider>
          <Chat />
        </AgenticaRpcProvider>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
