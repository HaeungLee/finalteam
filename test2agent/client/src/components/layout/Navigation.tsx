import agenticaLogo from "/agentica.svg";
import { FiChevronLeft, FiMenu } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const toggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <>
      {/* Navigation */}
      <div className="relative">
        {/* Toggle Button - Visible when sidebar is closed */}
        {!isOpen && (
          <div className="fixed top-4 left-0 z-50">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-r-md bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300"
              style={{
                transitionProperty: 'all',
                transitionDuration: '300ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              aria-label="Open navigation"
            >
              <FiMenu size={24} />
            </button>
          </div>
        )}

        <nav 
          className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white overflow-y-auto border-r border-gray-700 z-40 pt-4 pl-4 space-y-4 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%-3rem)]'}`}
      >

        {/* 로고/제목 및 토글 버튼 */}
        <div className="flex items-center justify-between w-full pr-4">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src={agenticaLogo}
              alt="Agentica logo"
              className={`w-8 h-8 transition-all hover:filter hover:drop-shadow-[0_0_1rem_rgba(255,255,255,0.5)] ${!isOpen ? 'ml-10' : ''}`}
            />
            {isOpen && (
              <h1 className="text-xl font-semibold text-white ml-2">
                Agentica
              </h1>
            )}
          </div>
          {isOpen && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar(e);
              }}
              className="p-1 rounded-md hover:bg-gray-700 transition-colors"
              aria-label="Close navigation"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
        </div>
      <ul className="space-y-4">
        <li className="text-white hover:text-gray-300 cursor-pointer p-2 rounded hover:bg-gray-700">
          소개
        </li>
        <li className="text-white hover:text-gray-300 cursor-pointer p-2 rounded hover:bg-gray-700">
          연락처
        </li>
      </ul>
        </nav>
      </div>
    </>
  );
};

export default Navigation;