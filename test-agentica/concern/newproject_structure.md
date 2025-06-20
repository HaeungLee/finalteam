# Voice Assistant MVP - 새 프로젝트 구조

## 🎯 프로젝트 개요

**프로젝트명**: voice-assistant-mvp  
**목표**: 한국어 최적화 음성 비서 시스템 MVP  
**개발 기간**: 6주  
**팀 구성**: 팀장(80%) + 인턴 2명  
**아키텍처**: Clean Architecture + TDD + 마이크로서비스  

---

## 📁 전체 프로젝트 구조

```
voice-assistant-mvp/
├── README.md
├── .gitignore
├── docker-compose.yml
├── .env.example
├── LICENSE
├── CONTRIBUTING.md
│
├── backend/                           # 백엔드 서비스들
│   ├── auth-service/                  # 인증 서비스 (인턴1 담당)
│   ├── voice-service/                 # 음성 처리 서비스 (팀장 담당)
│   ├── agent-service/                 # AI 에이전트 서비스 (팀장 담당)
│   └── api-gateway/                   # API 게이트웨이
│
├── frontend/                          # 프론트엔드 (팀장 담당)
│   ├── web-app/                       # React 웹 애플리케이션
│   ├── components/                    # 공통 컴포넌트
│   └── mobile-app/                    # React Native (Phase 2)
│
├── database/                          # 데이터베이스 (인턴2 담당)
│   ├── schemas/                       # 스키마 정의
│   ├── migrations/                    # 마이그레이션
│   ├── seeds/                         # 테스트 데이터
│   └── scripts/                       # DB 관리 스크립트
│
├── performance/                       # 성능 평가 (인턴2 담당)
│   ├── benchmarks/                    # STT/TTS 벤치마크
│   ├── monitoring/                    # 성능 모니터링
│   ├── reports/                       # 성능 보고서
│   └── experiments/                   # AI 모델 실험
│
├── shared/                            # 공통 리소스
│   ├── types/                         # TypeScript 타입 정의
│   ├── constants/                     # 상수 정의
│   ├── utils/                         # 공통 유틸리티
│   └── locales/                       # 한국어 리소스
│
├── deployment/                        # 배포 관련
│   ├── docker/                        # Docker 설정
│   ├── kubernetes/                    # K8s 설정 (향후)
│   └── scripts/                       # 배포 스크립트
│
├── docs/                              # 문서화
│   ├── api/                           # API 문서
│   ├── architecture/                  # 아키텍처 문서
│   ├── development/                   # 개발 가이드
│   └── user-guide/                    # 사용자 가이드
│
└── tools/                             # 개발 도구
    ├── scripts/                       # 개발 스크립트
    ├── testing/                       # 테스트 도구
    └── monitoring/                    # 모니터링 도구
```

---

## 🔧 서비스별 상세 구조

### 1. 인증 서비스 (auth-service) - 인턴1 담당

```
backend/auth-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── voiceassistant/
│   │   │           └── auth/
│   │   │               ├── AuthServiceApplication.java
│   │   │               ├── config/                # 설정 클래스
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   ├── JwtConfig.java
│   │   │               │   └── OAuth2Config.java
│   │   │               ├── controller/            # REST 컨트롤러
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── UserController.java
│   │   │               │   └── OAuth2Controller.java
│   │   │               ├── service/               # 비즈니스 로직
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── UserService.java
│   │   │               │   ├── JwtService.java
│   │   │               │   └── OAuth2Service.java
│   │   │               ├── repository/            # 데이터 접근
│   │   │               │   ├── UserRepository.java
│   │   │               │   └── TokenRepository.java
│   │   │               ├── entity/                # JPA 엔티티
│   │   │               │   ├── User.java
│   │   │               │   ├── Role.java
│   │   │               │   └── RefreshToken.java
│   │   │               ├── dto/                   # 데이터 전송 객체
│   │   │               │   ├── request/
│   │   │               │   └── response/
│   │   │               ├── security/              # 보안 관련
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   ├── JwtTokenProvider.java
│   │   │               │   └── CustomUserDetailsService.java
│   │   │               └── exception/             # 예외 처리
│   │   │                   ├── GlobalExceptionHandler.java
│   │   │                   └── custom/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── static/
│   └── test/
│       └── java/
│           └── com/
│               └── voiceassistant/
│                   └── auth/
│                       ├── controller/            # 컨트롤러 테스트
│                       ├── service/               # 서비스 테스트
│                       ├── repository/            # 리포지토리 테스트
│                       └── integration/           # 통합 테스트
├── Dockerfile
├── pom.xml
└── README.md
```

### 2. 음성 처리 서비스 (voice-service) - 팀장 담당

```
backend/voice-service/
├── app/
│   ├── __init__.py
│   ├── main.py                        # FastAPI 애플리케이션
│   ├── core/                          # 핵심 설정
│   │   ├── __init__.py
│   │   ├── config.py                  # 애플리케이션 설정
│   │   ├── database.py                # DB 연결
│   │   ├── logging.py                 # 로깅 설정
│   │   └── websocket.py               # WebSocket 설정
│   ├── api/                           # API 라우터
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   ├── stt.py                 # STT API
│   │   │   ├── tts.py                 # TTS API
│   │   │   ├── voice.py               # 음성 통합 API
│   │   │   └── websocket.py           # WebSocket 엔드포인트
│   │   └── deps.py                    # 의존성 주입
│   ├── services/                      # 비즈니스 로직
│   │   ├── __init__.py
│   │   ├── stt_service.py             # STT 서비스
│   │   ├── tts_service.py             # TTS 서비스
│   │   ├── voice_service.py           # 음성 통합 서비스
│   │   └── audio_processor.py         # 오디오 처리
│   ├── models/                        # 데이터 모델
│   │   ├── __init__.py
│   │   ├── voice.py                   # 음성 관련 모델
│   │   ├── audio.py                   # 오디오 관련 모델
│   │   └── database.py                # DB 모델
│   ├── schemas/                       # Pydantic 스키마
│   │   ├── __init__.py
│   │   ├── stt.py
│   │   ├── tts.py
│   │   └── voice.py
│   ├── integrations/                  # 외부 서비스 연동
│   │   ├── __init__.py
│   │   ├── google_stt.py              # Google STT
│   │   ├── openai_whisper.py          # OpenAI Whisper
│   │   ├── custom_tts.py              # 커스텀 TTS
│   │   └── realtime_tts.py            # RealTime TTS
│   ├── utils/                         # 유틸리티
│   │   ├── __init__.py
│   │   ├── audio_utils.py             # 오디오 유틸리티
│   │   ├── file_utils.py              # 파일 유틸리티
│   │   └── korean_utils.py            # 한국어 처리 유틸리티
│   └── exceptions/                    # 예외 정의
│       ├── __init__.py
│       ├── voice_exceptions.py
│       └── handlers.py
├── tests/                             # 테스트 코드
│   ├── __init__.py
│   ├── conftest.py                    # pytest 설정
│   ├── unit/                          # 단위 테스트
│   │   ├── test_stt_service.py
│   │   ├── test_tts_service.py
│   │   └── test_voice_service.py
│   ├── integration/                   # 통합 테스트
│   │   ├── test_api_endpoints.py
│   │   └── test_websocket.py
│   └── e2e/                           # E2E 테스트
│       └── test_voice_pipeline.py
├── assets/                            # 정적 자산
│   ├── models/                        # AI 모델 파일
│   ├── audio_samples/                 # 테스트 오디오
│   └── korean_resources/              # 한국어 리소스
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── .env.example
└── README.md
```

### 3. AI 에이전트 서비스 (agent-service) - 팀장 담당

```
backend/agent-service/
├── app/
│   ├── __init__.py
│   ├── main.py                        # FastAPI 애플리케이션
│   ├── core/                          # 핵심 설정
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── llm_config.py              # LLM 설정
│   │   └── function_registry.py       # Function Calling 레지스트리
│   ├── api/                           # API 라우터
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py                # 채팅 API
│   │   │   ├── functions.py           # Function Calling API
│   │   │   └── agent.py               # 에이전트 API
│   │   └── deps.py
│   ├── services/                      # 비즈니스 로직
│   │   ├── __init__.py
│   │   ├── llm_service.py             # LLM 서비스
│   │   ├── agent_service.py           # 에이전트 서비스
│   │   ├── function_service.py        # Function Calling 서비스
│   │   └── context_service.py         # 컨텍스트 관리
│   ├── agents/                        # 에이전트 구현
│   │   ├── __init__.py
│   │   ├── base_agent.py              # 기본 에이전트
│   │   ├── voice_agent.py             # 음성 에이전트
│   │   └── korean_agent.py            # 한국어 특화 에이전트
│   ├── functions/                     # Function Calling 구현
│   │   ├── __init__.py
│   │   ├── weather.py                 # 날씨 함수
│   │   ├── search.py                  # 검색 함수
│   │   ├── schedule.py                # 일정 함수
│   │   └── korean_functions.py        # 한국어 특화 함수
│   ├── models/                        # 데이터 모델
│   │   ├── __init__.py
│   │   ├── conversation.py
│   │   ├── function_call.py
│   │   └── agent.py
│   ├── schemas/                       # Pydantic 스키마
│   │   ├── __init__.py
│   │   ├── chat.py
│   │   ├── function.py
│   │   └── agent.py
│   ├── integrations/                  # 외부 서비스 연동
│   │   ├── __init__.py
│   │   ├── openai_client.py           # OpenAI 클라이언트
│   │   ├── voice_service_client.py    # 음성 서비스 클라이언트
│   │   └── auth_service_client.py     # 인증 서비스 클라이언트
│   └── utils/                         # 유틸리티
│       ├── __init__.py
│       ├── prompt_utils.py            # 프롬프트 유틸리티
│       └── korean_prompt_utils.py     # 한국어 프롬프트 유틸리티
├── tests/                             # 테스트 코드
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_llm_service.py
│   │   ├── test_agent_service.py
│   │   └── test_functions.py
│   ├── integration/
│   │   └── test_agent_api.py
│   └── e2e/
│       └── test_agent_pipeline.py
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
└── README.md
```

### 4. 프론트엔드 웹 앱 (web-app) - 팀장 담당

```
frontend/web-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── main.tsx                       # 엔트리 포인트
│   ├── App.tsx                        # 메인 컴포넌트
│   ├── vite-env.d.ts                  # Vite 타입 정의
│   ├── components/                    # 컴포넌트
│   │   ├── common/                    # 공통 컴포넌트
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Loading/
│   │   ├── voice/                     # 음성 관련 컴포넌트
│   │   │   ├── VoiceInput/
│   │   │   ├── VoiceOutput/
│   │   │   ├── WaveForm/
│   │   │   └── VoiceStatus/
│   │   ├── chat/                      # 채팅 관련 컴포넌트
│   │   │   ├── ChatContainer/
│   │   │   ├── MessageBubble/
│   │   │   └── ChatInput/
│   │   ├── auth/                      # 인증 관련 컴포넌트
│   │   │   ├── LoginForm/
│   │   │   ├── SignupForm/
│   │   │   └── SocialLogin/
│   │   └── charts/                    # 차트 컴포넌트
│   │       ├── VisitorChart/
│   │       ├── PerformanceChart/
│   │       └── UsageChart/
│   ├── pages/                         # 페이지 컴포넌트
│   │   ├── Home/
│   │   ├── VoiceChat/
│   │   ├── Dashboard/
│   │   ├── Profile/
│   │   └── Settings/
│   ├── hooks/                         # 커스텀 훅
│   │   ├── useVoice.ts
│   │   ├── useAuth.ts
│   │   ├── useWebSocket.ts
│   │   └── usePerformance.ts
│   ├── services/                      # API 서비스
│   │   ├── api.ts                     # API 클라이언트
│   │   ├── authService.ts
│   │   ├── voiceService.ts
│   │   ├── agentService.ts
│   │   └── websocketService.ts
│   ├── store/                         # 상태 관리 (Zustand)
│   │   ├── authStore.ts
│   │   ├── voiceStore.ts
│   │   ├── chatStore.ts
│   │   └── performanceStore.ts
│   ├── types/                         # TypeScript 타입
│   │   ├── auth.ts
│   │   ├── voice.ts
│   │   ├── chat.ts
│   │   └── api.ts
│   ├── utils/                         # 유틸리티
│   │   ├── audio.ts
│   │   ├── formatters.ts
│   │   ├── validation.ts
│   │   └── korean.ts
│   ├── styles/                        # 스타일
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── themes/
│   │       ├── default.ts
│   │       └── korean.ts
│   └── assets/                        # 정적 자산
│       ├── images/
│       ├── icons/
│       └── audio/
├── tests/                             # 테스트 코드
│   ├── setup.ts                       # 테스트 설정
│   ├── components/                    # 컴포넌트 테스트
│   ├── hooks/                         # 훅 테스트
│   ├── services/                      # 서비스 테스트
│   └── e2e/                           # E2E 테스트
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
└── README.md
```

### 5. 데이터베이스 구조 (database) - 인턴2 담당

```
database/
├── schemas/                           # 스키마 정의
│   ├── auth/                          # 인증 관련 스키마
│   │   ├── users.sql
│   │   ├── roles.sql
│   │   ├── user_roles.sql
│   │   └── refresh_tokens.sql
│   ├── voice/                         # 음성 관련 스키마
│   │   ├── voice_sessions.sql
│   │   ├── audio_files.sql
│   │   └── transcriptions.sql
│   ├── chat/                          # 채팅 관련 스키마
│   │   ├── conversations.sql
│   │   ├── messages.sql
│   │   └── function_calls.sql
│   └── analytics/                     # 분석 관련 스키마
│       ├── user_activities.sql
│       ├── performance_metrics.sql
│       └── api_usage.sql
├── migrations/                        # 마이그레이션
│   ├── 001_create_users_table.sql
│   ├── 002_create_voice_tables.sql
│   ├── 003_create_chat_tables.sql
│   ├── 004_create_analytics_tables.sql
│   └── 005_add_indexes.sql
├── seeds/                             # 테스트 데이터
│   ├── users.sql
│   ├── sample_conversations.sql
│   └── performance_data.sql
├── scripts/                           # DB 관리 스크립트
│   ├── init_db.sh
│   ├── backup_db.sh
│   ├── restore_db.sh
│   └── reset_test_db.sh
├── views/                             # 뷰 정의
│   ├── user_analytics_view.sql
│   ├── performance_summary_view.sql
│   └── chat_statistics_view.sql
├── functions/                         # 저장 함수
│   ├── korean_text_processing.sql
│   ├── performance_calculations.sql
│   └── cleanup_functions.sql
├── indexes/                           # 인덱스 정의
│   ├── performance_indexes.sql
│   ├── search_indexes.sql
│   └── analytics_indexes.sql
├── docker-compose.yml                 # PostgreSQL 컨테이너
├── Dockerfile
└── README.md
```

### 6. 성능 평가 (performance) - 인턴2 담당

```
performance/
├── benchmarks/                        # 벤치마크 스크립트
│   ├── stt_benchmark/
│   │   ├── google_stt_test.py
│   │   ├── whisper_test.py
│   │   ├── local_stt_test.py
│   │   └── compare_stt.py
│   ├── tts_benchmark/
│   │   ├── realtime_tts_test.py
│   │   ├── google_tts_test.py
│   │   └── compare_tts.py
│   ├── korean_benchmark/
│   │   ├── korean_accuracy_test.py
│   │   ├── korean_response_time_test.py
│   │   └── korean_quality_test.py
│   └── integration_benchmark/
│       ├── end_to_end_test.py
│       ├── concurrent_users_test.py
│       └── memory_usage_test.py
├── monitoring/                        # 성능 모니터링
│   ├── metrics_collector.py
│   ├── performance_dashboard.py
│   ├── alert_system.py
│   └── data_processors/
│       ├── response_time_processor.py
│       ├── accuracy_processor.py
│       └── resource_usage_processor.py
├── reports/                           # 성능 보고서
│   ├── templates/
│   │   ├── benchmark_report.html
│   │   ├── performance_summary.html
│   │   └── comparison_report.html
│   ├── generators/
│   │   ├── report_generator.py
│   │   ├── chart_generator.py
│   │   └── pdf_generator.py
│   └── outputs/                       # 생성된 보고서
├── experiments/                       # AI 모델 실험
│   ├── model_comparison/
│   │   ├── stt_model_comparison.py
│   │   ├── tts_model_comparison.py
│   │   └── llm_model_comparison.py
│   ├── korean_optimization/
│   │   ├── korean_accent_test.py
│   │   ├── korean_context_test.py
│   │   └── korean_speed_test.py
│   └── parameter_tuning/
│       ├── stt_parameter_tuning.py
│       ├── tts_parameter_tuning.py
│       └── optimization_results.py
├── data/                              # 테스트 데이터
│   ├── audio_samples/
│   │   ├── korean_male/
│   │   ├── korean_female/
│   │   └── mixed_audio/
│   ├── text_samples/
│   │   ├── korean_formal.txt
│   │   ├── korean_casual.txt
│   │   └── korean_technical.txt
│   └── ground_truth/
│       ├── transcription_gt.json
│       └── quality_scores.json
├── tools/                             # 성능 도구
│   ├── load_tester.py
│   ├── audio_analyzer.py
│   ├── metric_calculator.py
│   └── visualization_tools.py
├── config/                            # 설정 파일
│   ├── benchmark_config.yaml
│   ├── monitoring_config.yaml
│   └── experiment_config.yaml
├── requirements.txt
└── README.md
```

---

## 🔄 개발 워크플로우

### TDD 개발 프로세스

```yaml
각 기능 개발 시:
  1. 테스트 작성 (Red)
  2. 최소 구현 (Green)  
  3. 리팩토링 (Refactor)
  4. 문서화 및 코드 리뷰

테스트 레벨:
  - Unit Tests: 개별 함수/클래스 테스트
  - Integration Tests: 서비스 간 연동 테스트
  - E2E Tests: 전체 사용자 시나리오 테스트
  - Performance Tests: 성능 및 부하 테스트
```

### Clean Architecture 적용

```yaml
계층 구조:
  1. Entities: 핵심 비즈니스 로직
  2. Use Cases: 애플리케이션 비즈니스 로직  
  3. Interface Adapters: 컨트롤러, 게이트웨이
  4. Frameworks & Drivers: 데이터베이스, 웹 프레임워크

의존성 규칙:
  - 내부 계층은 외부 계층을 알지 못함
  - 모든 의존성은 내부로 향함
  - 인터페이스를 통한 의존성 주입
```

### 한국어 최적화

```yaml
한국어 처리:
  - STT: 한국어 음성 인식 정확도 85% 이상
  - TTS: 자연스러운 한국어 발음 및 억양
  - LLM: 한국어 문맥 이해 및 응답
  - UI: 한국어 폰트 및 레이아웃 최적화

리소스:
  - 한국어 음성 데이터셋
  - 한국어 프롬프트 템플릿
  - 한국어 에러 메시지
  - 한국어 사용자 가이드
```

---

## 🚀 팀별 개발 로드맵

### Week 1: 프로젝트 세팅

**팀장 (80% 작업)**
- [ ] 전체 프로젝트 구조 생성
- [ ] FastAPI voice-service 기본 구조
- [ ] React web-app 기본 구조  
- [ ] agent-service 기본 구조
- [ ] Docker Compose 설정
- [ ] CI/CD 파이프라인 기본 설정

**인턴1 (auth-service)**
- [ ] Spring Security 프로젝트 생성
- [ ] JWT 인증 기본 구현
- [ ] Google OAuth2 연동
- [ ] 기본 사용자 관리 API
- [ ] 단위 테스트 작성

**인턴2 (database & performance)**
- [ ] PostgreSQL Docker 환경 구축
- [ ] 기본 스키마 설계 및 생성
- [ ] 성능 측정 환경 구축
- [ ] 기본 벤치마크 스크립트 작성
- [ ] 데이터베이스 테스트 작성

### Week 2-3: 핵심 기능 개발

**팀장**
- [ ] STT 서비스 구현 (Google + Whisper)
- [ ] TTS 서비스 구현 (RealTime TTS 통합)
- [ ] WebSocket 실시간 통신
- [ ] 기본 AI 에이전트 구현
- [ ] 기본 UI 컴포넌트 (Tamagui)

**인턴1**
- [ ] 소셜 로그인 확장 (Kakao, Naver)
- [ ] JWT 리프레시 토큰
- [ ] API 보안 게이트웨이
- [ ] 사용자 권한 관리
- [ ] 통합 테스트

**인턴2**
- [ ] STT/TTS 성능 비교 실험
- [ ] 한국어 음성 품질 평가
- [ ] 성능 데이터 수집 시스템
- [ ] 기본 모니터링 대시보드
- [ ] 실험 결과 분석

### Week 4-5: 통합 및 최적화

**팀장**
- [ ] 서비스 간 연동 완성
- [ ] Voice UI 고도화
- [ ] Victory.js 차트 통합
- [ ] 성능 최적화
- [ ] E2E 테스트

**인턴1**
- [ ] 보안 강화 및 테스트
- [ ] API 문서화 (Swagger)
- [ ] 사용자 프로필 관리
- [ ] 세션 관리 최적화
- [ ] 보안 취약점 점검

**인턴2**
- [ ] 성능 벤치마크 완료
- [ ] 차트용 데이터 API
- [ ] 실시간 모니터링
- [ ] 성능 보고서 생성
- [ ] 최종 분석 및 권장사항

### Week 6: 최종 통합 및 배포

**전체 팀**
- [ ] 통합 테스트 및 버그 수정
- [ ] 배포 환경 구축
- [ ] 사용자 가이드 작성
- [ ] MVP 데모 준비
- [ ] 최종 성능 검증

---

## 📋 체크리스트

### 개발 환경 구축
- [ ] Git Repository 생성
- [ ] Docker 환경 구축
- [ ] IDE 설정 (VS Code Extensions)
- [ ] 린터 및 포매터 설정
- [ ] 테스트 환경 구축

### 코드 품질
- [ ] ESLint + Prettier (Frontend)
- [ ] Black + isort (Python)
- [ ] Checkstyle (Java)
- [ ] SonarQube 연동
- [ ] 코드 커버리지 90% 이상

### 보안
- [ ] JWT 토큰 보안
- [ ] API Rate Limiting
- [ ] Input Validation
- [ ] SQL Injection 방지
- [ ] XSS 방지

### 성능
- [ ] 음성 처리 2초 이내
- [ ] 동시 사용자 10명 이상
- [ ] 메모리 사용량 최적화
- [ ] 데이터베이스 쿼리 최적화
- [ ] CDN 및 캐싱 전략

### 배포
- [ ] Docker 이미지 최적화
- [ ] 환경별 설정 분리
- [ ] 로그 수집 및 모니터링
- [ ] 백업 및 복구 전략
- [ ] 무중단 배포 설정

---

## 🔗 관련 문서

- [Finalplan3.md](./Finalplan3.md) - 전체 개발 계획
- [API 문서](./docs/api/) - API 명세서
- [아키텍처 문서](./docs/architecture/) - 시스템 아키텍처
- [개발 가이드](./docs/development/) - 개발 표준 및 가이드

**새 프로젝트로 깔끔하고 효율적인 개발을 시작합시다! 🚀**
