import React from 'react';
import { useAuth } from '../../store/authStore';

interface HeaderProps {
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { state, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* 로고/제목 */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-900">
            Agentica Chat
          </h1>
        </div>

        {/* 사용자 영역 */}
        <div className="flex items-center space-x-4">
          {state.isAuthenticated ? (
            <>
              {/* 사용자 정보 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {state.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  {state.user?.name || state.user?.email}
                </span>
              </div>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                disabled={state.isLoading}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? '로그아웃 중...' : '로그아웃'}
              </button>
            </>
          ) : (
            <>
              {/* 게스트 표시 */}
              <span className="text-sm text-gray-500">게스트 사용자</span>
              
              {/* 로그인 버튼 */}
              <button
                onClick={onLoginClick}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}; 