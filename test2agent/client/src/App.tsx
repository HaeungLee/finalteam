import { useState } from "react";
import { Chat } from "./components/chat/Chat";
import { Landing } from "./components/Landing";
import { AgenticaRpcProvider } from "./provider/AgenticaRpcProvider";
import { AuthProvider } from "./store/authStore";
import { Header } from "./components/layout/Header";
import { LoginModal } from "./components/auth/LoginModal";

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
