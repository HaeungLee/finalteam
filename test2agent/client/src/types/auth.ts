// 사용자 정보 타입
export interface User {
  id?: number;
  email: string;
  name: string;
  provider?: string;
  token?: string;
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// 로그인 요청 타입
export interface LoginCredentials {
  email: string;
  password: string;
}

// 회원가입 요청 타입
export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// 토큰 갱신 응답 타입
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

// OAuth 제공자 타입
export type OAuthProvider = 'google' | 'kakao';

// OAuth 토큰 타입
export interface OAuthToken {
  provider: OAuthProvider;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scope?: string;
}

// 인증 상태 타입
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API 에러 타입
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
} 