# Agentica 프로젝트 개선 제안서 2.0

## 1. 실현 가능성 평가

### 1) STT (Whisper) + TTS 통합
- Whisper는 오픈소스로, CPU/로컬 환경에서도 동작 가능합니다.
- TTS는 Coqui TTS, Google TTS, ElevenLabs 등 다양한 선택지가 있으며, 직접 음성 학습도 가능합니다.
- **실현 가능성:** 매우 높음.
  - Whisper는 Python, Node.js 연동 모두 가능.
  - TTS도 API/로컬 모델 모두 활용 가능.

### 2) OpenAI 기반 Agentica + Google API (Gemma) 하이브리드
- Agentica가 OpenAI에 강하게 의존하고 있다면,
  - **기존 OpenAI 기능은 유지**
  - **Gemma(google) provider를 추가**하는 방식이 가장 현실적입니다.
- Gemma-3-27B-IT는 Vertex AI Model Garden에서 제공, API 호출로 사용 가능(무료 티어 내에서 제한적 사용).
- **실현 가능성:** 높음.
  - Provider 패턴으로 OpenAI/Gemma 선택적 호출 구조로 확장 가능.
  - 일부 기능(코드 생성, 분석 등)은 OpenAI, 일반 대화/요약 등은 Gemma로 분기 추천.

### 3) TTS 음성 커스텀 학습
- Coqui TTS, Google TTS, ElevenLabs 등에서 커스텀 음성 학습 지원.
- 직접 음성 데이터셋을 수집/가공하면, 고유 음성 합성 가능.
- **실현 가능성:** 중~상.
  - 음성 데이터셋 품질과 양이 중요.
  - Coqui TTS는 오픈소스라 자체 학습 가능, Google/ElevenLabs는 API 기반.

### 4) Teleport 등 인프라/보안 후순위
- Teleport, 인프라 보안 등은 MVP 이후 확장으로 미뤄도 무방.

## 2. 현실적인 조정/구현 방안

### 1) Provider 패턴 도입
- `core/providers/`에 OpenAI, Google(Gemma), Whisper, TTS 등 각종 provider를 모듈화.
- `ModelFactory`에서 사용 목적(대화/코드/요약 등)에 따라 provider 선택.
- 예시:
  ```typescript
  // ModelFactory.ts
  export function getProvider(type: 'chat'|'code'|'summarize') {
    if (type === 'chat') return process.env.USE_GEMMA ? GemmaProvider : OpenAIProvider;
    if (type === 'code') return OpenAIProvider;
    // ...
  }
  ```

### 2) STT/TTS 파이프라인
- Whisper(로컬/서버) → Agentica Core → TTS(커스텀/Google/Coqui) 순으로 파이프라인 구성.
- Node.js ↔ Python 연동은 zerorpc, child_process, REST API 등으로 구현.

### 3) Gemma-3-27B-IT 연동
- Google Cloud 계정 생성 → Vertex AI Model Garden에서 Gemma API 사용.
- API 호출 방식은 OpenAI와 유사(REST/GRPC).
- 무료 티어 내에서 사용량 관리 필요(쿼터 초과 시 fallback to OpenAI).

### 4) TTS 커스텀 음성 학습
- Coqui TTS: 오픈소스, 자체 음성 데이터셋으로 학습 가능.
- Google/ElevenLabs: API 기반, 커스텀 음성은 별도 비용/제약 있음.
- **추천:** MVP는 Coqui TTS로 시작, 추후 음성 데이터셋 확보 후 커스텀 학습.

### 5) Agentica 구조 조정
- 기존 OpenAI 기반 로직은 유지하되,
  - `GemmaProvider` 등 Google API provider를 추가.
  - `AIsuggest.md`의 provider/factory 구조 적극 반영.
- 기능별로 OpenAI/Gemma 분기 처리(비용, 성능, 정확도 기준).

### 6) 실행/배포
- Docker Compose로 PostgreSQL, Redis, MinIO, FastAPI, Node.js 등 통합 배포.
- WebSocket/REST API로 모바일/웹 연동.

## 3. 추가 현실적 조언

- **무료 티어 한계:**
  - Gemma-3-27B-IT는 쿼터가 빠르게 소진될 수 있으니,
    - 일반 대화/요약 위주로 우선 활용,
    - 코드 생성/분석 등 고비용 작업은 OpenAI로 fallback.
- **TTS 커스텀 음성:**
  - 음성 데이터셋(30분~1시간 이상) 확보가 중요.
  - Coqui TTS로 자체 학습 → MVP 이후 품질 개선.
- **STT/TTS 서버 분리:**
  - 음성 처리(Whisper, TTS)는 FastAPI(Python)로 별도 서버 운영 추천.
  - Node.js(Agentica Core)와 REST/WebSocket으로 통신.

## 4. 실현 가능성 결론

- **전체적으로 실현 가능성 매우 높음.**
- 핵심은 provider/factory 패턴으로 OpenAI와 Google(Gemma) API를 유연하게 병행/전환하는 구조.
- TTS 커스텀 음성은 데이터셋 품질/양에 따라 품질 차이 있으나, MVP 수준은 충분히 구현 가능.
- 인프라/보안(teleport 등)은 후순위로 미뤄도 무방.

## 5. 추천 현실적 로드맵

1. **STT(Whisper) + TTS(기성/Coqui) 파이프라인 MVP**
2. **Agentica Core에 Google(Gemma) provider 추가**
3. **Provider/factory 패턴으로 OpenAI/Gemma 분기**
4. **TTS 커스텀 음성 데이터셋 수집 및 학습**
5. **모바일/웹 연동, 실시간 음성 인터페이스**
6. **(후순위) Teleport 등 인프라/보안 강화** 