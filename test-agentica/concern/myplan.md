# MyPlan: Voice-Driven AI Agent for Agentica

## 요구사항 명세서

### 1. 필수 기능

1. **STT (Speech-to-Text)**

   - 음성을 텍스트로 변환하여 에이전트 모델에 전달.
   - CPU에서 구동 가능한 경량 STT 모델 사용 (예: Vosk, Whisper CPU 버전).
   - Node.js와 Python 간 통신을 위해 `zerorpc` 또는 `child_process` 활용.

2. **TTS (Text-to-Speech)**

   - 에이전트의 텍스트 응답을 음성으로 변환.
   - Coqui TTS 또는 Google TTS API 사용.

3. **Agent 모델 통합**

   - `packages/core`의 에이전트 모델과 STT/TTS를 통합.
   - 음성 입력 → 텍스트 변환(STT) → 에이전트 처리 → 음성 출력(TTS).

4. **모바일 통합**

   - React Native를 사용하여 모바일 앱 개발.
   - 마이크 입력(STT) 및 스피커 출력(TTS) 지원.
   - WebSocket 또는 REST API를 통해 서버와 통신.

5. **주문, 이메일, 동영상 요약 기능**

   - 음성으로 주문 요청 처리.
   - 이메일 텍스트 요약.
   - 동영상 자막(STT) 데이터를 요약.

6. **메신저 앱 통합**

   - 카카오톡, WhatsApp, Telegram 등의 API를 사용하여 메시지 수신/발신.
   - 사용자 대화 데이터를 학습하여 추천 답변 생성.

7. **대화 요약 및 이메일 전송**
   - 약 30분의 대화 또는 발표 내용을 요약.
   - 요약된 내용을 이메일로 전송.
   - 대화 기록 저장 및 요약 알고리즘 추가.
   - Nodemailer 또는 Gmail API를 사용하여 이메일 전송 기능 구현.

### 2. 추후 확장 기능

1. **다국어 지원**

   - STT/TTS 및 에이전트 모델에 다국어 지원 추가.

2. **오프라인 모드**

   - 인터넷 연결 없이도 동작 가능한 로컬 모델 제공.

3. **사용자 맞춤형 학습**

   - 사용자의 대화 스타일을 학습하여 개인화된 응답 제공.

4. **IoT 통합**

   - 스마트홈 기기와의 연동 (예: 음성으로 조명, 온도 조절).

5. **데이터 보안 강화**
   - 음성 및 텍스트 데이터를 암호화하여 안전하게 처리.

---

## 기술 스택 및 프레임워크

### 1. STT/TTS

- **STT**: Vosk (Node.js 모듈 또는 Python 연동)
- **TTS**: Coqui TTS 또는 Google TTS API

### 2. 에이전트 모델

- **기존 패키지**: `packages/core`
- **프롬프트 설계**: `core/prompts/`

### 3. 모바일 앱

- **프레임워크**: React Native
- **통신 방식**: REST API 또는 WebSocket

### 4. 주문/이메일/동영상 요약

- **주문 처리**: `packages/chat`에 주문 API 연동
- **이메일 요약**: OpenAI API 또는 자체 요약 모델
- **동영상 요약**: 자막(STT) 데이터를 요약하는 로직 추가

### 5. 메신저 앱 통합

- **API 연동**: 카카오톡, WhatsApp, Telegram API
- **추천 답변**: `core/prompts/`에 개인화된 답변 생성 로직 추가

### 6. 대화 요약 및 이메일 전송

- **대화 기록 저장**: `packages/chat`에 대화 기록 저장 로직 추가.
- **요약 알고리즘**: OpenAI API 또는 Hugging Face 모델 활용.
- **이메일 전송**: Nodemailer 또는 Gmail API 사용.

---

## 작업 계획

1. **STT/TTS 모듈 개발**

   - `packages/voice` 디렉토리 생성.
   - STT/TTS 기능 구현 및 테스트.

2. **에이전트 통합**

   - `packages/core`에 STT/TTS 통합 로직 추가.

3. **모바일 앱 개발**

   - React Native 앱 초기 설정 및 음성 통신 기능 구현.

4. **주문/이메일/동영상 요약 기능 추가**

   - `packages/chat`에 관련 로직 추가.

5. **메신저 앱 통합**

   - 메신저 API 연동 및 추천 답변 로직 구현.

6. **대화 요약 및 이메일 전송 기능 추가**

   - 대화 기록 저장 및 요약 알고리즘 구현.
   - 이메일 전송 기능 추가.

7. **테스트 및 배포**
   - 모든 기능에 대해 테스트 작성.
   - `pnpm release`를 통해 배포.

---
