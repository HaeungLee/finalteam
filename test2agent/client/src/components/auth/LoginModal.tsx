import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/authStore';
import agenticaLogo from "/agentica.svg";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'login' | 'signup';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { state, login, signup, clearError, sendVerificationCode, verifyCode, checkEmailExists, loginWithSocial } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('login');

  // 로그인 폼 상태
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // 회원가입 폼 상태
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    verificationCode: '',
  });

  // UI 상태
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verificationTimer > 0) {
      interval = setInterval(() => {
        setVerificationTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [verificationTimer]);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      clearError();
      setLocalError(null);
      setEmailError(null);
      setIsEmailVerified(false);
      setIsEmailSent(false);
      setVerificationTimer(0);
      setActiveTab('login');
      setLoginForm({ email: '', password: '' });
      setSignupForm({ email: '', password: '', confirmPassword: '', name: '', verificationCode: '' });
    }
  }, [isOpen, clearError]);

  // 에러 메시지 표시
  const displayError = localError || state.error;

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!loginForm.email || !loginForm.password) {
      setLocalError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    const success = await login(loginForm);
    if (success) {
      onClose();
    }
  };

  // 이메일 중복 확인 및 인증번호 전송
  const handleSendVerificationCode = async () => {
    setLocalError(null);
    setEmailError(null);
    setIsCheckingEmail(true);

    try {
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signupForm.email)) {
        setEmailError('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      // 이메일 중복 확인
      const emailExists = await checkEmailExists(signupForm.email);
      if (emailExists) {
        setEmailError('이미 사용 중인 이메일입니다.');
        return;
      }

      // 인증번호 전송
      const success = await sendVerificationCode(signupForm.email);
      if (success) {
        setIsEmailSent(true);
        setVerificationTimer(300); // 5분
      } else {
        setEmailError('인증번호 전송에 실패했습니다.');
      }
    } catch (error) {
      setEmailError('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    setLocalError(null);

    if (!signupForm.verificationCode || signupForm.verificationCode.length !== 6) {
      setLocalError('6자리 인증번호를 입력해주세요.');
      return;
    }

    const success = await verifyCode(signupForm.email, signupForm.verificationCode);
    if (success) {
      setIsEmailVerified(true);
      setLocalError(null);
    } else {
      setLocalError('인증번호가 올바르지 않습니다.');
    }
  };

  // 회원가입 처리
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // 필수 필드 검증
    if (!signupForm.email || !signupForm.password || !signupForm.name || !signupForm.verificationCode) {
      setLocalError('모든 필드를 입력해주세요.');
      return;
    }

    // 비밀번호 확인
    if (signupForm.password !== signupForm.confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 강도 검증
    if (signupForm.password.length < 8) {
      setLocalError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    // 이메일 인증 확인
    if (!isEmailVerified) {
      setLocalError('이메일 인증을 완료해주세요.');
      return;
    }

    const success = await signup({
      email: signupForm.email,
      password: signupForm.password,
      name: signupForm.name,
      verificationCode: signupForm.verificationCode,
    });

    if (success) {
      onClose();
    }
  };

  // 소셜 로그인 처리
  const handleSocialLogin = (provider: 'google' | 'naver' | 'kakao') => {
    loginWithSocial(provider);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 shadow-xl w-full max-w-md mx-4 border border-slate-700">
        {/* 헤더 */}
        <div className="flex items-center p-2 pb-3">
          {/* 왼쪽 공간 (빈 div로 균형 유지) */}
          <div className="w-8"></div>

          {/* 가운데 정렬된 이미지 */}
          <div className="flex-1 flex justify-center">
            <img
              src={agenticaLogo}
              alt="Agentica logo"
              className="w-6 h-6 transition-all hover:filter hover:drop-shadow-[0_0_1rem_rgba(255,255,255,0.5)]"
            />
          </div>

          {/* 오른쪽 끝에 닫기 버튼 */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 탭 버튼 */}
        <div className="flex border-slate-700">
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === 'login'
                ? 'text-white font-medium inline-flex flex-col items-center'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('login')}
          >
            <span>로그인</span>
            {activeTab === 'login' && <div className="h-0.5 w-11 bg-[#04B5B5] mt-1"></div>}
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === 'signup'
                ? 'text-white font-medium inline-flex flex-col items-center'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            <span>회원가입</span>
            {activeTab === 'signup' && <div className="h-0.5 w-15 bg-[#04B5B5] mt-1"></div>}
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6">
          {/* 에러 메시지 */}
          {displayError && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200 rounded">
              {displayError}
            </div>
          )}

          {/* 로그인 폼 */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 outline-none"
                  placeholder="이메일 주소"
                  disabled={state.isLoading}
                />
              </div>

              <div>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 outline-none"
                  placeholder="비밀번호"
                  disabled={state.isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={state.isLoading}
                className="w-full bg-[#04B5B5] cursor-pointer text-white py-2 px-4 rounded-md outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          )}

          {/* 회원가입 폼 */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* 이메일 인증 */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => {
                      setSignupForm({ ...signupForm, email: e.target.value });
                      setEmailError(null);
                      setIsEmailVerified(false);
                      setIsEmailSent(false);
                    }}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="이메일 주소"
                    disabled={isEmailVerified || isCheckingEmail}
                  />
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isEmailVerified || isCheckingEmail || verificationTimer > 0}
                    className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isCheckingEmail ? '확인 중...' : verificationTimer > 0 ? `${Math.floor(verificationTimer / 60)}:${(verificationTimer % 60).toString().padStart(2, '0')}` : isEmailVerified ? '인증완료' : '인증번호'}
                  </button>
                </div>
                {emailError && <p className="mt-1 text-sm text-red-400">{emailError}</p>}
              </div>

              {/* 인증번호 입력 */}
              {isEmailSent && !isEmailVerified && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    인증번호
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={signupForm.verificationCode}
                      onChange={(e) => setSignupForm({ ...signupForm, verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="6자리 인증번호를 입력하세요"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                    >
                      확인
                    </button>
                  </div>
                </div>
              )}

              {/* 이름 */}
              <div>
                <input
                  type="text"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="이름"
                  disabled={state.isLoading}
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="비밀번호(8자 이상)"
                  disabled={state.isLoading}
                />
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="비밀번호 확인"
                  disabled={state.isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={state.isLoading || !isEmailVerified}
                className="w-full bg-[#5CD1E5] text-white py-2 px-4 rounded-md hover:bg-[#04B5B5] focus:outline-none focus:ring-2 focus:ring-[#04B5B5] disabled:opacity-50"
              >
                {state.isLoading ? '가입 중...' : '회원가입'}
              </button>
            </form>
          )}

          {/* 소셜 로그인 구분선 */}
          <div className="mt-6 mb-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-gray-400">또는</span>
              </div>
            </div>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center px-4 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <img
                className="w-5 h-5 mr-2 bg-slate-700"
                src="src/images/g-logo.png"
                alt="Google"
              />
              Google로 계속하기
            </button>

            <button
              onClick={() => handleSocialLogin('naver')}
              className="w-full flex items-center justify-center px-4 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <img
                className="w-5 h-5 mr-2 bg-slate-700"
                src="src/images/btnG.png"
                alt="Naver"
              />
              네이버로 계속하기
            </button>

            <button
              onClick={() => handleSocialLogin('kakao')}
              className="w-full flex items-center justify-center px-4 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <img
                className="w-5.5 h-5.5 mr-2 bg-slate-700 border border-slate-700 rounded-md"
                src="src/images/kk.png"
                alt="Kakao"
              />
              카카오로 계속하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 