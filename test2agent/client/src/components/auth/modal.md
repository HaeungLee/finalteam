import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/authStore';

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
    <div className="login-modal">
      <div className="modal-container">
        {/* 헤더 */}
        <div className="header">
          <img src="https://via.placeholder.com/50"  alt="Logo" />
        </div>

        {/* 탭 버튼 */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab('login')}
            className={activeTab === 'login' ? 'active' : ''}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={activeTab === 'signup' ? 'active' : ''}
          >
            Sign Up
          </button>
        </div>

        {/* 에러 메시지 */}
        {displayError && (
          <div className="error-message">
            {displayError}
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleLogin}>
          {/* 이메일 입력란 */}
          <input
            type="text"
            placeholder="Email or Username"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />

          {/* 비밀번호 입력란 */}
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />

          {/* Remember me */}
          <label className="remember-me">
            <input type="checkbox" checked defaultChecked /> Remember me
          </label>

          {/* 로그인 버튼 */}
          <button type="submit" className="login-button">
            Login
          </button>

          {/* 비밀번호 찾기 */}
          <p className="forgot-password">
            <a href="#">Forgot your password?</a>
          </p>
        </form>

        {/* 소셜 로그인 */}
        <div className="social-login">
          <button onClick={() => handleSocialLogin('google')}>
            <img src="https://developers.google.com/identity/images/g-logo.png"  alt="Google" />
            Google
          </button>
          <button onClick={() => handleSocialLogin('naver')}>
            <span>N</span>
            Naver
          </button>
          <button onClick={() => handleSocialLogin('kakao')}>
            <span>K</span>
            Kakao
          </button>
        </div>
      </div>
    </div>
  );
};