import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiService, getSocialLoginUrl, type LoginRequest, type SignupRequest } from '../utils/api';
import { User } from '../types/auth';

// 인증 상태 타입
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// 액션 타입
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

// 초기 상태
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// 리듀서
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
        isLoading: false,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

// Context 타입
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<boolean>;
  signup: (userData: SignupRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  sendVerificationCode: (email: string) => Promise<boolean>;
  verifyCode: (email: string, code: string) => Promise<boolean>;
  checkEmailExists: (email: string) => Promise<boolean>;
  loginWithSocial: (provider: 'google' | 'naver' | 'kakao') => void;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔑 로그인 함수
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        // JWT 토큰은 HTTP-Only 쿠키로 자동 저장됨
        // 사용자 정보 생성 (토큰에서 추출하거나 별도 API 호출)
        const user: User = {
          email: credentials.email,
          name: credentials.email.split('@')[0], // 임시로 이메일에서 이름 추출
          token: response.data.accessToken, // 필요시 클라이언트에서도 보관
        };
        
        dispatch({ type: 'SET_USER', payload: user });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || '로그인에 실패했습니다.' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // 📝 회원가입 함수
  const signup = async (userData: SignupRequest): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.signup(userData);
      
      if (response.success) {
        // 회원가입 성공 후 자동 로그인
        const loginSuccess = await login({
          email: userData.email,
          password: userData.password,
        });
        return loginSuccess;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || '회원가입에 실패했습니다.' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // 🚪 로그아웃 함수
  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // 📧 이메일 인증번호 전송
  const sendVerificationCode = async (email: string): Promise<boolean> => {
    try {
      const response = await apiService.sendVerificationCode(email);
      return response.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '인증번호 전송에 실패했습니다.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // ✅ 인증번호 확인
  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    try {
      const response = await apiService.verifyCode({ email, verificationCode: code });
      return response.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '인증번호 확인에 실패했습니다.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // 📧 이메일 중복 확인
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await apiService.checkEmailExists(email);
      return response.success ? response.data.exists : false;
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      return false;
    }
  };

  // 🌐 소셜 로그인
  const loginWithSocial = (provider: 'google' | 'naver' | 'kakao'): void => {
    const socialLoginUrl = getSocialLoginUrl(provider);
    window.location.href = socialLoginUrl;
  };

  // 에러 초기화
  const clearError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 쿠키에 토큰이 있는지 확인하기 위해 보호된 엔드포인트 호출
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          const user: User = {
            email: response.data.email,
            name: response.data.name,
            token: '', // HTTP-Only 쿠키이므로 클라이언트에서 접근 불가
          };
          dispatch({ type: 'SET_USER', payload: user });
        }
      } catch (error) {
        // 인증되지 않은 상태로 처리
        console.log('사용자 인증 상태 확인: 미인증');
      }
    };

    checkAuthStatus();
  }, []);

  const contextValue: AuthContextType = {
    state,
    login,
    signup,
    logout,
    clearError,
    sendVerificationCode,
    verifyCode,
    checkEmailExists,
    loginWithSocial,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 