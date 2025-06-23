import { getConfig } from './config';

const config = getConfig();

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 로그인 요청/응답 타입
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

// 회원가입 요청 타입
interface SignupRequest {
  email: string;
  password: string;
  name: string;
  verificationCode: string;
}

// 이메일 인증 요청 타입
interface EmailVerificationRequest {
  email: string;
}

// 인증번호 확인 요청 타입
interface VerifyCodeRequest {
  email: string;
  verificationCode: string;
}

// API 클래스
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.SPRING_API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // 🔑 인증 관련 API
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<string>> {
    return this.request<string>('/api/auth/join', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<string>> {
    return this.request<string>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // 📧 이메일 인증 관련 API
  async sendVerificationCode(email: string): Promise<ApiResponse<string>> {
    return this.request<string>('/api/auth/send-verification-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyCode(data: VerifyCodeRequest): Promise<ApiResponse<string>> {
    return this.request<string>('/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkEmailExists(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    return this.request<{ exists: boolean }>(`/api/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });
  }

  // 👤 사용자 정보 관련 API (향후 확장용)
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request<any>('/api/member/me', {
      method: 'GET',
    });
  }
}

// 소셜 로그인 URL 생성 함수
export const getSocialLoginUrl = (provider: 'google' | 'naver' | 'kakao'): string => {
  return `${config.SPRING_API_URL}/oauth2/authorization/${provider}`;
};

// API 서비스 인스턴스 내보내기
export const apiService = new ApiService();

// 타입들 내보내기
export type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  EmailVerificationRequest,
  VerifyCodeRequest,
};
