# STT/TTS 통합 구현 가이드

## 📋 개요

Agentica 프로젝트에 음성 인식(STT: Speech-to-Text)과 음성 합성(TTS: Text-to-Speech) 기능을 통합하기 위한 설계 문서입니다.

## 🎯 목표

- **한국어 최적화**: 한국어 음성 처리에 특화된 설계
- **Clean Architecture**: 기존 Agentica Controller 패턴과 호환
- **Multi-Provider**: 여러 음성 서비스 제공자 지원
- **실시간 처리**: WebRTC 기반 실시간 음성 대화
- **성능 최적화**: 최소한의 의존성으로 고성능 구현

## 🏗️ 아키텍처 설계

### 1. 환경변수 확장

```typescript
// SGlobal.ts 확장
interface IEnvironments {
  // ...existing code...
  
  // TTS/STT 설정
  TTS_PROVIDER?: "openai" | "google" | "azure" | "elevenlabs" | "naver";
  STT_PROVIDER?: "openai" | "google" | "azure" | "naver";
  
  // API 키
  ELEVENLABS_API_KEY?: string;
  AZURE_SPEECH_KEY?: string;
  AZURE_SPEECH_REGION?: string;
  NAVER_CLOVA_CLIENT_ID?: string;
  NAVER_CLOVA_CLIENT_SECRET?: string;
  
  // 음성 설정
  TTS_VOICE_ID?: string;
  TTS_LANGUAGE?: "ko-KR" | "en-US";
  STT_LANGUAGE?: "ko-KR" | "en-US";
  TTS_SPEED?: string; // "0.5" ~ "2.0"
  TTS_PITCH?: string; // "-20" ~ "+20"
}
```

### 2. 폴더 구조

```
test-agentica/
├── server/
│   ├── src/
│   │   ├── services/
│   │   │   ├── voice/
│   │   │   │   ├── VoiceWrapperService.ts      # 메인 음성 서비스
│   │   │   │   ├── providers/
│   │   │   │   │   ├── IVoiceService.ts        # 인터페이스
│   │   │   │   │   ├── OpenAIVoiceService.ts   # OpenAI 구현
│   │   │   │   │   ├── GoogleVoiceService.ts   # Google Cloud 구현
│   │   │   │   │   ├── NaverVoiceService.ts    # Naver Clova 구현
│   │   │   │   │   ├── ElevenLabsVoiceService.ts # ElevenLabs 구현
│   │   │   │   │   └── AzureVoiceService.ts    # Azure Cognitive 구현
│   │   │   │   ├── utils/
│   │   │   │   │   ├── AudioConverter.ts       # 오디오 포맷 변환
│   │   │   │   │   ├── KoreanOptimizer.ts      # 한국어 최적화
│   │   │   │   │   └── AudioValidator.ts       # 오디오 검증
│   │   │   │   └── types/
│   │   │   │       ├── TTSOptions.ts           # TTS 옵션 타입
│   │   │   │       ├── STTOptions.ts           # STT 옵션 타입
│   │   │   │       └── VoiceResponse.ts        # 응답 타입
│   │   │   └── ...existing services...
│   │   └── ...existing code...
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── voice/
│   │   │   │   ├── VoiceChat.tsx               # 음성 채팅 컴포넌트
│   │   │   │   ├── AudioRecorder.tsx           # 음성 녹음기
│   │   │   │   ├── AudioPlayer.tsx             # 음성 재생기
│   │   │   │   └── VoiceSettings.tsx           # 음성 설정
│   │   │   └── ...existing components...
│   │   ├── hooks/
│   │   │   ├── useVoiceChat.ts                 # 음성 채팅 훅
│   │   │   ├── useAudioRecorder.ts             # 녹음 훅
│   │   │   └── useAudioPlayer.ts               # 재생 훅
│   │   └── ...existing code...
└── stt_tts.md                                  # 이 문서
```

## 🔧 핵심 구현

### 1. Voice Service 인터페이스

```typescript
export interface IVoiceService {
  /**
   * 텍스트를 음성으로 변환
   */
  textToSpeech(text: string, options?: TTSOptions): Promise<VoiceBuffer>;
  
  /**
   * 음성을 텍스트로 변환
   */
  speechToText(audioBuffer: Buffer, options?: STTOptions): Promise<STTResult>;
  
  /**
   * 지원하는 음성 목록 조회
   */
  getAvailableVoices(): Promise<VoiceInfo[]>;
  
  /**
   * 서비스 상태 확인
   */
  healthCheck(): Promise<boolean>;
}

export interface TTSOptions {
  voice?: string;           // 음성 ID
  language?: string;        // 언어 코드 (ko-KR, en-US)
  speed?: number;           // 속도 (0.25 ~ 4.0)
  pitch?: number;           // 톤 (-20 ~ +20)
  format?: 'mp3' | 'wav';   // 출력 포맷
}

export interface STTOptions {
  language?: string;        // 언어 코드
  model?: string;           // 모델명
  enablePunctuation?: boolean; // 구두점 자동 삽입
  enableProfanityFilter?: boolean; // 욕설 필터
}
```

### 2. 한국어 최적화 유틸리티

```typescript
export class KoreanOptimizer {
  /**
   * 한국어 텍스트 전처리 (TTS용)
   */
  static preprocessTextForTTS(text: string): string {
    return text
      .replace(/([0-9]+)/g, (match) => this.numberToKorean(match))
      .replace(/([A-Za-z]+)/g, (match) => this.englishToKoreanPronunciation(match))
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * 한국어 음성 인식 후처리 (STT용)
   */
  static postprocessSTTResult(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/([가-힣])\s+([가-힣])/g, '$1$2') // 한글 단어 연결
      .trim();
  }
  
  /**
   * 숫자를 한국어로 변환
   */
  private static numberToKorean(num: string): string {
    // 구현: "123" → "백이십삼"
    // ...
  }
  
  /**
   * 영어를 한국어 발음으로 변환
   */
  private static englishToKoreanPronunciation(eng: string): string {
    // 구현: "OpenAI" → "오픈에이아이"
    // ...
  }
}
```

### 3. Voice Wrapper Service

```typescript
export class VoiceWrapperService {
  private readonly ttsService: IVoiceService;
  private readonly sttService: IVoiceService;
  
  constructor(props: {
    ttsProvider: string;
    sttProvider: string;
    apiKeys: Record<string, string>;
  }) {
    this.ttsService = this.createVoiceService(props.ttsProvider, props.apiKeys);
    this.sttService = this.createVoiceService(props.sttProvider, props.apiKeys);
  }
  
  /**
   * AI 응답을 한국어 음성으로 변환
   */
  async convertToSpeech(input: {
    /**
     * 변환할 텍스트
     * @title 텍스트
     */
    text: string;
    
    /**
     * 음성 설정
     * @title 음성
     */
    voice?: string;
    
    /**
     * 언어 설정 (기본: ko-KR)
     * @title 언어
     */
    language?: "ko-KR" | "en-US";
    
    /**
     * 음성 속도 (기본: 1.0)
     * @title 속도
     */
    speed?: number;
    
    /**
     * 한국어 최적화 적용 여부 (기본: true)
     * @title 한국어 최적화
     */
    optimizeKorean?: boolean;
  }) {
    console.log('🔊 TTS 변환 요청:', { text: input.text.substring(0, 50) + '...' });
    
    // 한국어 최적화
    let processedText = input.text;
    if (input.optimizeKorean !== false && input.language === 'ko-KR') {
      processedText = KoreanOptimizer.preprocessTextForTTS(input.text);
    }
    
    const audioBuffer = await this.ttsService.textToSpeech(processedText, {
      voice: input.voice || this.getDefaultKoreanVoice(),
      language: input.language || "ko-KR",
      speed: input.speed || 1.0,
      format: 'mp3',
    });
    
    return {
      audio: audioBuffer.data.toString('base64'),
      format: audioBuffer.format,
      duration: this.estimateDuration(input.text),
      language: input.language || "ko-KR",
    };
  }
  
  /**
   * 음성을 텍스트로 변환 (한국어 최적화)
   */
  async convertToText(input: {
    /**
     * 음성 데이터 (Base64 또는 Buffer)
     * @title 음성 데이터
     */
    audioData: string | Buffer;
    
    /**
     * 언어 설정 (기본: ko-KR)
     * @title 언어
     */
    language?: "ko-KR" | "en-US";
    
    /**
     * 구두점 자동 삽입 (기본: true)
     * @title 구두점 삽입
     */
    enablePunctuation?: boolean;
    
    /**
     * 한국어 후처리 적용 여부 (기본: true)
     * @title 한국어 후처리
     */
    postprocessKorean?: boolean;
  }) {
    console.log('🎤 STT 변환 요청');
    
    const audioBuffer = typeof input.audioData === 'string' 
      ? Buffer.from(input.audioData, 'base64')
      : input.audioData;
    
    const result = await this.sttService.speechToText(audioBuffer, {
      language: input.language || "ko-KR",
      enablePunctuation: input.enablePunctuation !== false,
    });
    
    // 한국어 후처리
    let processedText = result.text;
    if (input.postprocessKorean !== false && input.language === 'ko-KR') {
      processedText = KoreanOptimizer.postprocessSTTResult(result.text);
    }
    
    return {
      text: processedText,
      confidence: result.confidence,
      language: input.language || "ko-KR",
      duration: result.duration,
    };
  }
  
  /**
   * 기본 한국어 음성 반환
   */
  private getDefaultKoreanVoice(): string {
    // Provider별 기본 한국어 음성 설정
    if (this.ttsService instanceof NaverVoiceService) {
      return 'nara'; // 네이버 클로바 나라 음성
    } else if (this.ttsService instanceof GoogleVoiceService) {
      return 'ko-KR-Standard-A'; // 구글 한국어 음성
    } else {
      return 'alloy'; // OpenAI 기본 음성
    }
  }
}
```

## 🌟 주요 특징

### 1. 한국어 특화 기능

- **숫자 발음 최적화**: "123" → "백이십삼"
- **영어 단어 한국어 발음**: "OpenAI" → "오픈에이아이"
- **한국어 문장 연결 최적화**: 자연스러운 한국어 음성 생성
- **한국어 음성 인식 후처리**: 띄어쓰기 및 맞춤법 보정

### 2. Multi-Provider 지원

| Provider | TTS 지원 | STT 지원 | 한국어 품질 | 비용 |
|----------|----------|----------|-------------|------|
| OpenAI   | ✅       | ✅       | ⭐⭐⭐      | 💰💰  |
| Google   | ✅       | ✅       | ⭐⭐⭐⭐    | 💰💰💰 |
| Naver    | ✅       | ✅       | ⭐⭐⭐⭐⭐  | 💰    |
| Azure    | ✅       | ✅       | ⭐⭐⭐⭐    | 💰💰  |
| ElevenLabs | ✅     | ❌       | ⭐⭐⭐      | 💰💰💰 |

### 3. 성능 최적화

- **Streaming TTS**: 긴 텍스트의 실시간 음성 생성
- **Audio Compression**: 효율적인 오디오 압축
- **Caching**: 자주 사용되는 음성 캐싱
- **Batch Processing**: 여러 요청 일괄 처리

## 🚀 구현 단계

### Phase 1: 기본 TTS/STT (1주)
- [ ] OpenAI TTS/STT 구현
- [ ] VoiceWrapperService 기본 구조
- [ ] 환경변수 설정
- [ ] 기본 테스트 작성

### Phase 2: 한국어 최적화 (1주)
- [ ] KoreanOptimizer 구현
- [ ] Naver Clova 연동
- [ ] 한국어 특화 전/후처리
- [ ] 한국어 품질 테스트

### Phase 3: 클라이언트 통합 (1주)
- [ ] React 음성 컴포넌트
- [ ] WebRTC 실시간 음성
- [ ] 음성 설정 UI
- [ ] 사용자 경험 최적화

### Phase 4: 고급 기능 (1주)
- [ ] 감정 인식 및 TTS 톤 조절
- [ ] 다화자 인식
- [ ] 노이즈 캔슬링
- [ ] 성능 모니터링

## 📊 테스트 전략

### 1. TDD 테스트 구조

```typescript
describe('VoiceWrapperService', () => {
  describe('convertToSpeech', () => {
    it('한국어 텍스트를 올바르게 음성으로 변환해야 함', async () => {
      // Given
      const service = new VoiceWrapperService(config);
      const input = { text: '안녕하세요', language: 'ko-KR' };
      
      // When
      const result = await service.convertToSpeech(input);
      
      // Then
      expect(result.audio).toBeDefined();
      expect(result.format).toBe('mp3');
      expect(result.language).toBe('ko-KR');
    });
  });
  
  describe('convertToText', () => {
    it('한국어 음성을 올바르게 텍스트로 변환해야 함', async () => {
      // Given
      const service = new VoiceWrapperService(config);
      const audioBuffer = generateKoreanAudioSample();
      
      // When
      const result = await service.convertToText({ audioData: audioBuffer });
      
      // Then
      expect(result.text).toContain('안녕하세요');
      expect(result.confidence).toBeGreaterThan(0.8);
    });
  });
});
```

### 2. 성능 테스트

- **응답 시간**: TTS/STT 변환 속도 측정
- **메모리 사용량**: 대용량 오디오 처리 시 메모리 효율성
- **동시 처리**: 다중 요청 처리 성능
- **한국어 품질**: 한국어 음성 품질 평가

## 📝 사용 예시

### 1. Agent에서 음성 응답

```typescript
// 사용자: "오늘 날씨 어때?"
// Agent 처리 후 음성으로 응답
const weatherResponse = "오늘 서울 날씨는 맑고 기온은 25도입니다.";
const voiceResponse = await voiceService.convertToSpeech({
  text: weatherResponse,
  language: "ko-KR",
  optimizeKorean: true
});

// 클라이언트로 음성 데이터 전송
await websocket.send({
  type: 'voice_response',
  data: voiceResponse
});
```

### 2. 실시간 음성 대화

```typescript
// 클라이언트에서 음성 녹음
const audioBlob = await recorder.stop();

// STT로 텍스트 변환
const sttResult = await voiceService.convertToText({
  audioData: audioBlob,
  language: "ko-KR"
});

// Agent 처리
const agentResponse = await agent.conversate(sttResult.text);

// TTS로 음성 응답 생성
const ttsResult = await voiceService.convertToSpeech({
  text: agentResponse,
  language: "ko-KR"
});

// 음성 재생
await audioPlayer.play(ttsResult.audio);
```

## 🔒 보안 고려사항

- **API 키 보호**: 환경변수를 통한 안전한 키 관리
- **오디오 데이터 암호화**: 전송 중 오디오 데이터 보호
- **사용량 제한**: 무제한 음성 변환 방지
- **개인정보 보호**: 음성 데이터 임시 저장 후 삭제

## 📚 참고 자료

- [OpenAI Speech API](https://platform.openai.com/docs/guides/text-to-speech)
- [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
- [Naver Clova Voice](https://www.ncloud.com/product/aiService/css)
- [WebRTC Audio Processing](https://webrtc.org/)
- [한국어 음성학 기초](https://www.korean.go.kr/)

## 🎯 예상 효과

- **사용자 경험 향상**: 음성 기반 자연스러운 AI 대화
- **접근성 개선**: 시각 장애인 및 거동 불편한 사용자 지원
- **효율성 증대**: 타이핑 없이 빠른 정보 입력/출력
- **한국어 특화**: 한국 사용자에게 최적화된 음성 경험

---

**작성일**: 2025년 6월 14일  
**버전**: 1.0  
**작성자**: Agentica Development Team
