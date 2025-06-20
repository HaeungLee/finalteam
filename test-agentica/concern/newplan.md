# NewPlan.md: Agentica 기반 점진적 개선 계획

## 🎯 프로젝트 개요

**현재 상황 분석:**
- ✅ **Agentica 오픈소스** 기반 WebSocket 서버 구축 완료
- ✅ **React + Vite + Tailwind** 클라이언트 구축 완료  
- ✅ **OpenRouter + Llama-4-maverick** 모델 연동 완료
- ✅ **다양한 Connector** 준비 완료 (현재 주석처리)
- 🔄 **점진적 기능 확장** 필요

**목표:**
기존 Agentica 구조를 최대한 활용하면서 STT/TTS, 모바일 지원, LangChain 통합, Agent 기능을 단계적으로 추가

---

## 🏗️ 현재 기술 스택 (유지)

### Backend (Server)
```yaml
Core Framework: Agentica + Node.js + TypeScript
AI Model: OpenRouter + meta-llama/llama-4-maverick:free
Communication: WebSocket (tgrid)
Connectors: @wrtnlabs/* (Google, Kakao, Naver 등)
```

### Frontend (Client)
```yaml
Core Framework: React 18 + TypeScript + Vite
Styling: Tailwind CSS (기존 유지)
Communication: WebSocket (tgrid)
```

---

## 📈 단계별 개선 계획

### 🚀 Phase 1: Core Enhancement (2-3주)

#### 1.1 음성 기능 통합
```
server/src/services/
├── VoiceService.ts          # STT/TTS 통합 서비스
├── SpeechToTextService.ts   # Google Speech-to-Text + Whisper
├── TextToSpeechService.ts   # Google TTS + 한국어 TTS
└── AudioProcessor.ts        # 오디오 전처리
```

**구현 순서:**
1. **Google Cloud Speech API** 연동 (한국어 최적화)
2. **OpenAI Whisper** 로컬 처리 옵션
3. **Google TTS** + **한국어 TTS** 모델 통합
4. **WebSocket 실시간 오디오** 스트리밍
5. **기존 Chat UI에 음성 버튼** 추가

#### 1.2 LangChain 메모리 시스템
```
server/src/memory/
├── ConversationMemory.ts    # 대화 기억 저장
├── UserProfileService.ts    # 사용자 프로필 관리
├── SystemPromptManager.ts   # 시스템 프롬프트 설정
└── VectorStoreService.ts    # 임베딩 기반 검색
```

**구현 순서:**
1. **로컬 SQLite** 기반 대화 저장
2. **사용자별 컨텍스트** 관리
3. **시스템 프롬프트 커스터마이징**
4. **대화 히스토리 검색** 기능

#### 1.3 기존 Connector 활성화
```typescript
// index.ts에서 주석 해제 및 순차 활성화
const enabledConnectors = [
  "GoogleMap",      // 지도 검색
  "GoogleDocs",     // 문서 작업
  "KakaoMap",       // 한국 지역 정보
  "NaverBlog",      // 한국 콘텐츠 검색
  "Gmail",          // 이메일 자동화
];
```

---

### 🎨 Phase 2: UI/UX Enhancement (2-3주)

#### 2.1 음성 중심 UI 개선
```
client/src/components/
├── voice/
│   ├── VoiceRecorder.tsx    # 음성 녹음 컴포넌트
│   ├── AudioVisualizer.tsx  # 실시간 오디오 시각화
│   ├── VoiceButton.tsx      # 음성 활성화 버튼
│   └── SpeechBubble.tsx     # 음성 대화 버블
├── memory/
│   ├── ConversationHistory.tsx  # 대화 기록
│   ├── UserProfile.tsx          # 사용자 설정
│   └── SystemPromptEditor.tsx   # 프롬프트 편집
└── analytics/
    ├── UsageChart.tsx       # Victory.js 기반 차트
    └── PerformanceMonitor.tsx
```

**Tailwind 기반 디자인 시스템:**
```css
/* 음성 UI 전용 클래스 */
.voice-button-active { @apply bg-red-500 animate-pulse; }
.voice-wave { @apply h-2 bg-blue-400 rounded animate-bounce; }
.conversation-bubble { @apply bg-gray-100 dark:bg-gray-800 rounded-xl p-4; }
```

#### 2.2 차트 및 분석 기능
- **Victory.js** 통합 (가벼운 SVG 차트)
- **API 사용량 모니터링**
- **음성 처리 성능 분석**
- **사용자 활동 대시보드**

---

### 📱 Phase 3: Mobile Preparation (2-3주)

#### 3.1 PWA 기능 추가
```
client/public/
├── manifest.json           # PWA 설정
├── sw.js                  # Service Worker
└── icons/                 # 앱 아이콘
```

#### 3.2 모바일 최적화
- **Touch-friendly** UI 컴포넌트
- **반응형 음성 버튼** (큰 터치 영역)
- **오프라인 기본 기능**
- **백그라운드 음성 처리**

#### 3.3 React Native 준비
```
mobile/ (향후 확장)
├── VoiceAssistant/        # React Native 프로젝트
├── shared/                # 공통 컴포넌트
└── native-modules/        # 네이티브 음성 처리
```

---

### 🧠 Phase 4: Advanced AI Features (3-4주)

#### 4.1 Intelligent Agent 시스템
```
server/src/agents/
├── TaskAgent.ts           # 작업 자동화 에이전트
├── MemoryAgent.ts         # 기억 관리 에이전트  
├── ConnectorOrchestrator.ts # 서비스 연동 조율
└── PersonalityEngine.ts   # 개성 있는 대화
```

#### 4.2 고급 통합 기능
- **멀티모달 처리** (텍스트 + 음성 + 이미지)
- **작업 자동화** (이메일, 문서 작성)
- **한국어 특화** 기능 (경어, 방언 인식)
- **컨텍스트 유지** 대화

---

## 🔧 구현 세부사항

### 음성 처리 아키텍처
```typescript
// server/src/services/VoiceService.ts
export class VoiceService {
  private sttService: SpeechToTextService;
  private ttsService: TextToSpeechService;
  
  async processVoiceInput(audioBuffer: Buffer): Promise<string> {
    const text = await this.sttService.transcribe(audioBuffer);
    return this.optimizeKoreanText(text);
  }
  
  async generateVoiceResponse(text: string): Promise<Buffer> {
    const optimizedText = this.addKoreanProsody(text);
    return await this.ttsService.synthesize(optimizedText);
  }
}
```

### 메모리 시스템
```typescript
// server/src/memory/ConversationMemory.ts
export class ConversationMemory {
  async storeConversation(userId: string, conversation: any) {
    // SQLite + LangChain 연동
    const embedding = await this.createEmbedding(conversation.text);
    await this.vectorStore.addDocument(conversation, embedding);
  }
  
  async getRelevantMemories(query: string): Promise<any[]> {
    const queryEmbedding = await this.createEmbedding(query);
    return await this.vectorStore.similaritySearch(queryEmbedding);
  }
}
```

### 모바일 PWA
```javascript
// client/public/sw.js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'VOICE_PROCESS') {
    // 백그라운드 음성 처리
    processVoiceInBackground(event.data.audio);
  }
});
```

---

## 🎯 한국어 최적화 전략

### STT 최적화
```yaml
Speech Recognition:
  Primary: Google Cloud Speech (한국어 모델)
  Fallback: OpenAI Whisper Large-v3
  Features:
    - 방언 인식 (서울, 부산, 대구 등)
    - 경어 감지
    - 전문용어 사전
```

### TTS 최적화  
```yaml
Text-to-Speech:
  Primary: Google Cloud TTS (한국어 Neural)
  Custom: KoSpeech 기반 로컬 모델
  Features:
    - 자연스러운 억양
    - 감정 표현
    - 연령/성별 선택
```

### 언어 처리
```typescript
// 한국어 특화 처리
const koreanProcessor = {
  honorifics: true,        // 경어 처리
  particles: true,         // 조사 정확성
  contextual: true,        // 맥락 이해
  slang: true,            // 신조어/은어
};
```

---

## 📊 성능 및 모니터링

### 실시간 성능 추적
```typescript
// Performance Metrics
interface VoiceMetrics {
  sttLatency: number;      // STT 응답 시간
  ttsLatency: number;      // TTS 생성 시간
  accuracy: number;        // 인식 정확도
  userSatisfaction: number; // 사용자 만족도
}
```

### Victory.js 차트 통합
```tsx
// client/src/components/analytics/PerformanceChart.tsx
import { VictoryLine, VictoryChart } from 'victory';

export const PerformanceChart = () => (
  <VictoryChart theme={VictoryTheme.material}>
    <VictoryLine
      data={performanceData}
      x="timestamp"
      y="latency"
      style={{ data: { stroke: "#3b82f6" } }}
    />
  </VictoryChart>
);
```

---

## 💰 비용 최적화

### API 사용량 관리
```typescript
// 무료 티어 최대 활용
const apiLimits = {
  openrouter: { daily: 200_000, model: "llama-4-maverick:free" },
  googleSpeech: { monthly: 60 * 60 }, // 60분
  googleTTS: { monthly: 4_000_000 },  // 4M 문자
};
```

### 하이브리드 처리
```yaml
Processing Strategy:
  Local: 기본 STT (Whisper), 캐싱
  Cloud: 고품질 TTS, 복잡한 질의
  Fallback: 네트워크 오류 시 로컬 처리
```

---

## 🔒 보안 및 개인정보

### 데이터 보호
```typescript
// 음성 데이터 암호화
const voiceEncryption = {
  storage: "AES-256-GCM",     // 로컬 저장 암호화
  transmission: "TLS 1.3",    // 전송 암호화
  retention: 30,              // 30일 후 자동 삭제
};
```

### 개인정보 최소화
- **로컬 우선** 처리
- **사용자 동의** 기반 데이터 수집
- **익명화** 처리
- **GDPR 준수**

---

## 📅 개발 일정

### Week 1-2: 음성 기능 기초
- [ ] Google Speech API 연동
- [ ] 기본 TTS 구현
- [ ] WebSocket 오디오 스트리밍
- [ ] 간단한 음성 UI

### Week 3-4: 메모리 시스템
- [ ] LangChain 통합
- [ ] SQLite 대화 저장
- [ ] 사용자 프로필 관리
- [ ] 시스템 프롬프트 편집기

### Week 5-6: Connector 활성화
- [ ] 핵심 Connector 활성화 (Google, Kakao)
- [ ] 통합 테스트
- [ ] 성능 최적화

### Week 7-8: UI 개선
- [ ] 음성 중심 컴포넌트
- [ ] Victory.js 차트 통합
- [ ] 반응형 디자인 개선

### Week 9-10: PWA 및 모바일 준비
- [ ] PWA 기능 추가
- [ ] 모바일 최적화
- [ ] 오프라인 기능

### Week 11-12: 고급 기능
- [ ] 고급 Agent 시스템
- [ ] 한국어 특화 기능
- [ ] 최종 통합 테스트

---

## 🚨 추가 고려사항 및 의문점

### 기술적 고려사항

1. **Agentica Core 버전 호환성**
   - 현재 v0.28.0 사용 중
   - 업데이트 시 호환성 검증 필요
   - 커스텀 기능과의 충돌 가능성

2. **WebSocket 동시 연결 제한**
   - 현재 구조에서 다중 사용자 지원 범위
   - 음성 스트리밍 시 대역폭 관리
   - 서버 리소스 사용량 모니터링

3. **OpenRouter 무료 모델 제약**
   - meta-llama/llama-4-maverick:free 성능 한계
   - Rate limiting 및 사용량 제한
   - 백업 모델 전략 필요

### 아키텍처 의문점

1. **기존 Connector 통합 우선순위**
   - 어떤 Connector를 먼저 활성화할지?
   - 한국 서비스 우선 vs 글로벌 서비스?
   - 비용 대비 효과 분석 필요

2. **음성 처리 지연 시간**
   - STT → LLM → TTS 파이프라인 최적화
   - 실시간 대화를 위한 허용 지연시간
   - 중간 피드백 (typing indicator) 필요성

3. **메모리 시스템 스케일링**
   - 사용자 증가 시 벡터 검색 성능
   - 로컬 SQLite vs 클라우드 DB 전환점
   - 개인정보 보호 vs 성능 트레이드오프

### 비즈니스 관련 의문점

1. **모바일 앱 배포 전략**
   - PWA vs Native App 우선순위
   - 앱스토어 정책 및 승인 과정
   - iOS/Android 동시 지원 범위

2. **사용자 피드백 수집**
   - 음성 품질 평가 방법
   - 사용성 테스트 계획
   - 베타 테스터 모집 전략

3. **확장성 계획**
   - 팀 확장 시 개발 워크플로우
   - 인프라 확장 임계점
   - 수익 모델과의 연계

### 법적/윤리적 고려사항

1. **음성 데이터 처리 규정**
   - 한국 개인정보보호법 준수
   - 유럽 GDPR 대응 필요성
   - 음성 데이터 국외 전송 제약

2. **AI 서비스 책임 범위**
   - 잘못된 정보 제공 시 책임
   - 편향성 및 차별 방지
   - 사용자 안전 장치

---

## 🎯 성공 지표

### 기술적 KPI
- **음성 인식 정확도**: 95% 이상 (한국어)
- **응답 지연시간**: 3초 이하 (STT→TTS 전체)
- **시스템 가용성**: 99% 이상
- **동시 사용자**: 50명 이상 지원

### 사용자 경험 KPI  
- **일일 활성 사용자**: 목표치 설정 필요
- **대화 세션 길이**: 평균 10분 이상
- **사용자 만족도**: 4.5/5 이상
- **기능 사용률**: 음성 기능 80% 이상

### 비즈니스 KPI
- **개발 일정 준수**: 12주 내 MVP 완성
- **비용 효율성**: 월 $100 이하 운영비
- **기술 부채**: 코드 품질 B등급 이상

---

**결론**: 기존 Agentica 인프라를 최대한 활용하면서 점진적으로 음성 기능과 고급 AI 기능을 추가하는 현실적이고 지속가능한 접근 방식을 제안합니다. 새 프로젝트 생성 대신 기존 자산을 활용하여 리스크를 최소화하면서도 목표하는 기능들을 체계적으로 구현할 수 있습니다.
