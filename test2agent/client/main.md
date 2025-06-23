import React from 'react';

const GeminiLandingPage: React.FC = () => {
  return (
    <div className="relative min-w-[320px] bg-[#030303] text-zinc-200 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full print:hidden">
        <div className="absolute -z-10 size-full border-b border-zinc-800/50 bg-black/30 backdrop-blur-md"></div>
        <nav style={{ height: 64 }} className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8 justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center transition-opacity hover:opacity-80">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 28C6.2807 28 0 21.7193 0 14C0 6.2807 6.2807 0 14 0C21.7193 0 28 6.2807 28 14C28 21.7193 21.7193 28 14 28ZM14 1.65587C7.19303 1.65587 1.65587 7.19389 1.65587 14C1.65587 20.8061 7.19389 26.3441 14 26.3441C20.8061 26.3441 26.3441 20.8061 26.3441 14C26.3441 7.19389 20.807 1.65587 14 1.65587Z" fill="#FAFAFA" />
            </svg>
            <b className="ml-2 text-xl font-bold">Gemini</b>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">가이드 문서</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">튜토리얼</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">플레이그라운드</a>
          </div>

          {/* Search & GitHub */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input type="search" placeholder="문서 검색... (Ctrl+K)" className="w-full md:w-64 rounded-lg bg-zinc-800/80 px-3 py-1.5 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#86FFD9]/50" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hidden lg:block">CTRL K</span>
            </div>
            <a href="https://github.com"  target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <svg fill="currentColor" viewBox="3 3 18 18" height="24" width="24">
                <path d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z" />
              </svg>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-bg relative h-[calc(100vh-64px)] w-full">
        <div className="h-full w-full">
          <div className="relative mx-auto flex h-full max-w-[1440px] flex-col-reverse items-center justify-center gap-8 p-6 md:flex-row md:justify-between lg:px-20">
            {/* Left Content */}
            <div className="z-10 flex flex-1 flex-col items-center gap-8 text-center md:items-start md:text-left">
              {/* Animated Logo Grid */}
              <div className="relative grid h-48 w-48 grid-cols-10 gap-1 md:h-60 md:w-60">
                {Array.from({ length: 100 }).map((_, i) => {
                  const delay = `${Math.random() * 2}s`;
                  const show = Math.random() > 0.3;
                  return show ? (
                    <div key={i} className="logo-dot aspect-square rounded-full bg-zinc-600" style={{ animationDelay: delay, opacity: 0.1 }}></div>
                  ) : (
                    <div key={i}></div>
                  );
                })}
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-9 items-center md:items-start">
                <div className="flex flex-col gap-4 items-center md:items-start">
                  <h1 className="text-6xl font-black text-zinc-50 md:text-7xl lg:text-8xl">GEMINI</h1>
                  <p className="max-w-md text-base text-zinc-300 md:text-lg lg:text-xl">
                    Gemini AI는 TypeScript 컴파일러 기술로 강화된, LLM 함수 호출에 특화된 AI 프레임워크입니다.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
                  <a href="#" className="flex-1">
                    <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-zinc-700/80 text-lg font-semibold text-white transition-colors hover:bg-zinc-600/80 md:h-14 md:w-48 md:text-xl">
                      문서 보기
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 7h10v10"></path>
                        <path d="M7 17 17 7"></path>
                      </svg>
                    </button>
                  </a>
                  <a href="#" className="flex-1">
                    <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white text-lg font-semibold text-black transition-colors hover:bg-zinc-200 md:h-14 md:w-48 md:text-xl">
                      Github
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0.75C5.64625 0.75 0.5 5.89625 0.5 12.25C0.5 17.3387 3.79187 21.6369 8.36312 23.1606C8.93812 23.2612 9.15375 22.9162 9.15375 22.6144C9.15375 22.3412 9.13938 21.4356 9.13938 20.4725C6.25 21.0044 5.5025 19.7681 5.2725 19.1212C5.14313 18.7906 4.5825 17.77 4.09375 17.4969C3.69125 17.2812 3.11625 16.7494 4.07938 16.735C4.985 16.7206 5.63188 17.5687 5.8475 17.9137C6.8825 19.6531 8.53563 19.1644 9.19688 18.8625C9.2975 18.115 9.59938 17.6119 9.93 17.3244C7.37125 17.0369 4.6975 16.045 4.6975 11.6462C4.6975 10.3956 5.14312 9.36062 5.87625 8.55562C5.76125 8.26812 5.35875 7.08937 5.99125 5.50812C5.99125 5.50812 6.95438 5.20625 9.15375 6.68687C10.0738 6.42812 11.0513 6.29875 12.0288 6.29875C13.0063 6.29875 13.9838 6.42812 14.9038 6.68687C17.1031 5.19187 18.0662 5.50812 18.0662 5.50812C18.6987 7.08937 18.2962 8.26812 18.1812 8.55562C18.9144 9.36062 19.36 10.3812 19.36 11.6462C19.36 16.0594 16.6719 17.0369 14.1131 17.3244C14.53 17.6837 14.8894 18.3737 14.8894 19.4519C14.8894 20.99 14.875 22.2262 14.875 22.6144C14.875 22.9162 15.0906 23.2756 15.6656 23.1606C20.2081 21.6369 23.5 17.3244 23.5 12.25C23.5 5.89625 18.3538 0.75 12 0.75Z" fill="black" />
                      </svg>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Content - Chat UI Mockup */}
            <div className="z-10 hidden h-[85vh] max-h-[720px] w-full shrink-0 rounded-2xl bg-zinc-900/50 p-3 backdrop-blur-sm md:block md:w-[480px]">
              <div className="custom-scrollbar group h-full overflow-y-scroll pr-2">
                <div className="flex flex-col gap-6 text-zinc-300">
                  <p>주문에 대한 취소는 없었습니다.</p>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">주소 정보</h4>
                    <p>배송 주소가 확인되었으며 다음을 포함합니다:</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li><span className="font-medium text-zinc-100">휴대폰:</span> 010-1234-5678</li>
                      <li><span className="font-medium text-zinc-100">이름:</span> 홍길동</li>
                      <li><span className="font-medium text-zinc-100">국가:</span> 대한민국</li>
                      <li><span className="font-medium text-zinc-100">도:</span> 서울</li>
                      <li><span className="font-medium text-zinc-100">시:</span> 서울</li>
                      <li><span className="font-medium text-zinc-100">상세주소:</span> 제미니 아파트</li>
                      <li><span className="font-medium text-zinc-100">동호수:</span> 101동 1411호</li>
                      <li><span className="font-medium text-zinc-100">우편번호:</span> 04100</li>
                      <li><span className="font-medium text-zinc-100">특이사항:</span> 이 필드는 null이며, 배송에 대한 추가 지침이 제공되지 않았습니다.</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">결론</h4>
                    <p className="text-sm">결제가 완료된 주문이 성공적으로 게시되었으며 배송 처리를 기다리고 있습니다. 현재 상태는 '없음'이므로 아직 배송이 이루어지지 않았습니다. 그러나 제공된 세부 정보는 향후 주문 추적 및 관리에 도움이 될 것입니다.</p>
                  </div>
                  <p>주문에 대해 더 궁금한 점이 있거나 추가 지원이 필요한 경우 언제든지 문의해 주세요!</p>
                  <div className="self-end rounded-lg bg-[#86FFD9] p-3 text-right text-black">
                    <p className="font-semibold">감사합니다!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeminiLandingPage;


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

// App.tsx
import React from 'react';
import GeminiLandingPage from './components/GeminiLandingPage';

function App() {
  return <GeminiLandingPage />;
}

export default App;