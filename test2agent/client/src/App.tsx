import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Chat } from "./components/chat/Chat";
import { Home } from "./components/home/Home";
import { AgenticaRpcProvider } from "./provider/AgenticaRpcProvider";
import { AuthProvider } from "./store/authStore";
import { Header } from "./components/layout/Header";
import { LoginModal } from "./components/auth/LoginModal";
import Navigation from "./components/layout/Navigation";

function AppContent() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const location = useLocation();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Hide navigation on chat page
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen bg-[#111827]">
      <div className="fixed inset-0" />

      {/* Header */}
      <Header onLoginClick={handleLoginClick} />
      
      {/* Navigation - Hidden on chat page */}
      {!isChatPage && (
        <Navigation isOpen={isNavOpen} onToggle={toggleNav} />
      )}

      <div className={`pt-16 min-h-screen transition-all duration-300 ${!isChatPage && isNavOpen ? 'pl-64' : 'pl-0'}`}>
        <main className="h-[calc(100vh-4rem)] overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AgenticaRpcProvider>
          <AppContent />
        </AgenticaRpcProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
