# MyPlan 2.0: Voice-Driven AI Agent Platform with Intelligent Architecture

## Enhanced Technical Specification & Implementation Strategy

---

## 🎯 Project Vision

Create a revolutionary voice-driven AI agent platform that can learn project structures, generate presentations instantly, and provide seamless multi-modal interactions across all platforms.

---

## 🏗️ Core Architecture

### **Recommended Tech Stack**

#### **Backend Architecture**

```yaml
Primary Backend: FastAPI (Python)
  - Ultra-fast async performance
  - Automatic OpenAPI documentation
  - Native Pydantic validation
  - Excellent ML/AI library ecosystem
  - Perfect for voice processing

Secondary Services: Node.js (TypeScript)
  - Leverage existing Agentica core
  - WebSocket real-time communication
  - JavaScript ecosystem integration
```

#### **Frontend Architecture**

```yaml
Web Frontend: React (TypeScript) + Next.js
  - Server-side rendering for SEO
  - API routes for hybrid functionality
  - Excellent developer experience
  - PWA capabilities for offline use

Mobile: React Native (TypeScript)
  - Code sharing with web frontend
  - Native audio/video processing
  - Cross-platform deployment
```

#### **Alternative Architecture Consideration**

```yaml
Full TypeScript Stack:
  Backend: Node.js + Fastify/Hono
  - Type safety across entire stack
  - Better integration with existing Agentica core
  - Shared types and utilities
  - Easier team collaboration

Trade-offs:
  - Python: Better AI/ML ecosystem, faster voice processing
  - Node.js: Better integration, type safety, team efficiency
```

---

## 💾 Database Architecture

### **Primary Database: PostgreSQL + pgvector**

```sql
-- pgvector 확장 설치
CREATE EXTENSION vector;
CREATE EXTENSION "uuid-ossp";

-- 사용자 및 프로젝트 기본 정보
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    voice_profile JSONB, -- 음성 프로필 설정
    preferences JSONB,   -- 사용자 선호도
    created_at TIMESTAMP DEFAULT NOW()
);

-- 프로젝트 DNA 저장소
CREATE TABLE project_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    project_name VARCHAR(255) NOT NULL,
    structure_embedding vector(1536),    -- 프로젝트 구조 벡터
    code_patterns JSONB,                 -- 코딩 패턴 및 스타일
    architecture_type VARCHAR(100),      -- React, Vue, Angular, etc.
    tech_stack JSONB,                    -- 기술 스택 정보
    generated_presentations JSONB,       -- 생성된 프레젠테이션 메타데이터
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 음성 대화 기록
CREATE TABLE voice_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    transcript TEXT,                     -- STT 결과
    ai_response TEXT,                    -- AI 응답
    audio_file_url TEXT,                 -- S3 등 저장소 URL
    language VARCHAR(10) DEFAULT 'ko-KR',
    embedding vector(1536),              -- 대화 의미 벡터
    metadata JSONB,                      -- 음성 메타데이터 (길이, 품질 등)
    created_at TIMESTAMP DEFAULT NOW()
);

-- 생성된 프레젠테이션
CREATE TABLE generated_presentations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_dna_id UUID REFERENCES project_dna(id),
    title VARCHAR(255),
    content JSONB,                       -- 프레젠테이션 구조 및 내용
    assets JSONB,                        -- 이미지, 차트 등 에셋 정보
    live_demo_url TEXT,                  -- 라이브 데모 URL
    presentation_type VARCHAR(100),      -- portfolio, corporate, demo 등
    voice_narration_url TEXT,            -- 음성 해설 파일
    created_at TIMESTAMP DEFAULT NOW()
);

-- 메신저 통합 데이터
CREATE TABLE messenger_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    platform VARCHAR(50),               -- kakao, whatsapp, telegram 등
    platform_user_id VARCHAR(255),
    conversation_history JSONB,
    response_patterns JSONB,             -- 학습된 응답 패턴
    last_interaction TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 이메일 및 주문 처리
CREATE TABLE email_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    original_content TEXT,
    summary TEXT,
    recipients JSONB,                    -- 수신자 목록
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 벡터 검색을 위한 인덱스
CREATE INDEX idx_project_dna_embedding ON project_dna USING ivfflat (structure_embedding vector_cosine_ops);
CREATE INDEX idx_conversation_embedding ON voice_conversations USING ivfflat (embedding vector_cosine_ops);
```

### **Caching & Real-time: Redis**

```redis
# 음성 스트리밍 세션 관리
voice:session:{sessionId} -> {
  userId: string,
  status: 'listening' | 'processing' | 'responding',
  language: string,
  startTime: timestamp,
  audioChunks: string[]
}

# 실시간 협업 세션
collaboration:room:{roomId} -> {
  participants: userId[],
  currentProject: projectId,
  sharedState: object
}

# API 응답 캐싱
cache:api:{key} -> response (TTL: 300s)

# WebSocket 연결 관리
websocket:user:{userId} -> connectionId
```

### **Object Storage: MinIO/S3**

```yaml
buckets:
  voice-recordings: # 음성 파일 저장
    - conversations/{userId}/{sessionId}/audio.wav
    - narrations/{presentationId}/voice.mp3

  presentations: # 생성된 프레젠테이션
    - generated/{projectId}/presentation.html
    - assets/{projectId}/images/
    - demos/{projectId}/live-demo/

  project-snapshots: # 프로젝트 스냅샷
    - snapshots/{projectId}/{timestamp}/
    - dna-analysis/{projectId}/structure.json
```

---

## 🎤 Voice Processing Pipeline

### **1. STT (Speech-to-Text) Architecture**

```python
# FastAPI Backend (Python)
from faster_whisper import WhisperModel
import asyncio

class VoiceProcessor:
    def __init__(self):
        # CPU 최적화된 Whisper 모델
        self.whisper = WhisperModel("base", device="cpu")
        self.vosk_model = None  # 경량 실시간 처리용

    async def process_realtime_audio(self, audio_stream):
        """실시간 음성 스트리밍 처리"""
        async for chunk in audio_stream:
            # Vosk로 실시간 중간 결과
            partial_result = self.vosk_model.process(chunk)
            yield {"type": "partial", "text": partial_result}

    async def process_complete_audio(self, audio_file):
        """완전한 음성 파일 처리 (높은 정확도)"""
        segments, info = self.whisper.transcribe(audio_file)
        return {
            "text": " ".join([segment.text for segment in segments]),
            "language": info.language,
            "confidence": info.language_probability
        }
```

### **2. TTS (Text-to-Speech) Architecture**

```python
class TTSProcessor:
    def __init__(self):
        # 다중 TTS 엔진 지원
        self.engines = {
            "coqui": CoquiTTS(),
            "google": GoogleTTS(),
            "elevenlabs": ElevenLabsTTS()
        }

    async def synthesize_voice(self, text, voice_profile, emotion="neutral"):
        """감정과 개인화된 음성 합성"""
        engine = self.select_best_engine(voice_profile)
        audio_data = await engine.synthesize(
            text=text,
            voice_id=voice_profile.get("voice_id"),
            emotion=emotion,
            speed=voice_profile.get("speed", 1.0)
        )
        return audio_data
```

---

## 🧠 Project DNA Learning System

### **Core AI Components**

```python
class ProjectDNAAnalyzer:
    """프로젝트 구조 학습 및 분석"""

    def __init__(self):
        self.structure_analyzer = ASTAnalyzer()
        self.pattern_recognizer = PatternRecognizer()
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

    async def analyze_project_structure(self, project_path: str):
        """프로젝트 DNA 추출"""
        # 1. 파일 구조 분석
        structure = await self.structure_analyzer.analyze(project_path)

        # 2. 코딩 패턴 인식
        patterns = await self.pattern_recognizer.extract_patterns(structure)

        # 3. 벡터 임베딩 생성
        structure_text = self.serialize_structure(structure, patterns)
        embedding = self.embedding_model.encode(structure_text)

        return ProjectDNA(
            structure=structure,
            patterns=patterns,
            embedding=embedding,
            tech_stack=self.detect_tech_stack(structure),
            architecture_type=self.detect_architecture(patterns)
        )

    async def generate_presentation(self, project_dna: ProjectDNA, style="modern"):
        """프로젝트 DNA 기반 프레젠테이션 생성"""
        # AI 기반 프레젠테이션 템플릿 선택
        template = await self.select_template(project_dna, style)

        # 인터랙티브 컴포넌트 생성
        components = await self.generate_components(project_dna)

        # 라이브 데모 생성
        demo_url = await self.create_live_demo(project_dna)

        return PresentationBundle(
            html_content=template.render(components),
            live_demo_url=demo_url,
            voice_narration=await self.generate_narration(project_dna),
            interactive_elements=components
        )
```

---

## 📱 Mobile & Web Integration

### **React Frontend Architecture**

```typescript
// Web Frontend (Next.js + TypeScript)
interface VoiceAgentConfig {
  sttProvider: "whisper" | "vosk" | "google";
  ttsProvider: "coqui" | "google" | "elevenlabs";
  realtime: boolean;
  language: "ko-KR" | "en-US" | "ja-JP";
}

class VoiceAgentClient {
  private ws: WebSocket;
  private audioContext: AudioContext;

  async startVoiceSession(config: VoiceAgentConfig) {
    // WebSocket 연결 설정
    this.ws = new WebSocket(`ws://localhost:8000/voice-session`);

    // 마이크 스트리밍 설정
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      // 실시간 음성 데이터 전송
      this.ws.send(event.data);
    };

    // 실시간 STT 결과 수신
    this.ws.onmessage = (event) => {
      const result = JSON.parse(event.data);
      this.handleVoiceResult(result);
    };
  }

  async analyzeProject(projectPath: string) {
    const response = await fetch("/api/analyze-project", {
      method: "POST",
      body: JSON.stringify({ projectPath }),
      headers: { "Content-Type": "application/json" },
    });

    return await response.json();
  }
}
```

### **React Native Integration**

```typescript
// Mobile App (React Native + TypeScript)
import { NativeModules, NativeEventEmitter } from "react-native";
import AudioRecord from "react-native-audio-record";

class MobileVoiceAgent {
  private audioRecord: AudioRecord;
  private wsClient: WebSocketClient;

  async initializeVoiceRecording() {
    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioFormat: "wav",
    };

    AudioRecord.init(options);

    // 실시간 오디오 스트리밍
    AudioRecord.on("data", (data) => {
      this.wsClient.send(data);
    });
  }

  async generatePresentationFromVoice(command: string) {
    // "이 프로젝트로 프레젠테이션 만들어줘" 음성 명령 처리
    const response = await this.wsClient.sendVoiceCommand({
      command,
      context: "presentation_generation",
      projectContext: await this.getCurrentProjectContext(),
    });

    return response;
  }
}
```

---

## 🔄 Integration & Communication

### **Messenger Platform Integration**

```python
class MessengerHub:
    """통합 메신저 플랫폼 관리"""

    def __init__(self):
        self.adapters = {
            'kakao': KakaoTalkAdapter(),
            'whatsapp': WhatsAppAdapter(),
            'telegram': TelegramAdapter(),
            'slack': SlackAdapter()
        }

    async def process_message(self, platform: str, message: dict):
        """메신저 메시지 처리 및 AI 응답 생성"""
        adapter = self.adapters[platform]

        # 사용자 컨텍스트 로드
        user_context = await self.load_user_context(message['user_id'])

        # AI 응답 생성
        ai_response = await self.generate_contextual_response(
            message['text'],
            user_context
        )

        # 플랫폼별 형식으로 응답
        formatted_response = adapter.format_response(ai_response)
        await adapter.send_message(message['chat_id'], formatted_response)
```

### **Email & Document Processing**

```python
class DocumentProcessor:
    """이메일 및 문서 처리"""

    async def summarize_conversation(self, conversation_id: str):
        """30분 대화 요약"""
        conversation = await self.db.get_conversation_history(conversation_id)

        # AI 요약 생성
        summary = await self.ai_summarizer.summarize(
            conversation_text=conversation['full_text'],
            style='professional',
            length='medium'
        )

        return {
            'summary': summary,
            'key_points': await self.extract_key_points(conversation),
            'action_items': await self.extract_action_items(conversation),
            'participants': conversation['participants']
        }

    async def send_summary_email(self, summary: dict, recipients: list):
        """요약된 내용 이메일 전송"""
        email_content = await self.generate_email_template(summary)

        await self.email_service.send_email(
            to=recipients,
            subject=f"대화 요약: {summary['title']}",
            html_content=email_content,
            attachments=[summary['pdf_export']]
        )
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Foundation (4-6 weeks)**

```yaml
Week 1-2: Database & Backend Setup
  - PostgreSQL + pgvector 설정
  - Redis 클러스터 구성
  - FastAPI 기본 구조 및 API 설계
  - Docker compose 환경 구성

Week 3-4: Voice Processing Core
  - STT/TTS 파이프라인 구현
  - WebSocket 실시간 통신
  - 기본 음성 인터페이스

Week 5-6: Project DNA System
  - 코드 구조 분석기 구현
  - 벡터 임베딩 시스템
  - 기본 프레젠테이션 생성기
```

### **Phase 2: Intelligence Layer (6-8 weeks)**

```yaml
Week 7-10: AI Integration
  - Agentica Core 통합
  - 프로젝트 패턴 학습
  - 실시간 코드 변환

Week 11-14: Presentation Engine
  - 인터랙티브 프레젠테이션 생성
  - 라이브 데모 자동화
  - 음성 해설 통합
```

### **Phase 3: Platform Integration (4-6 weeks)**

```yaml
Week 15-18: Mobile & Web
  - React Native 앱 개발
  - Progressive Web App
  - 크로스 플랫폼 동기화

Week 19-20: Messenger Integration
  - 카카오톡/WhatsApp API 연동
  - 학습 기반 응답 시스템
```

---

## 🔧 Development Environment

### **Docker Compose Setup**

```yaml
version: "3.8"
services:
  postgres:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_DB: agentica
      POSTGRES_USER: agentica
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
      - minio
    environment:
      DATABASE_URL: postgresql://agentica:password@postgres:5432/agentica
      REDIS_URL: redis://redis:6379
      MINIO_URL: http://minio:9000

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### **Recommended Development Stack**

```yaml
Backend:
  - FastAPI (Python) for AI/ML processing
  - Node.js (TypeScript) for Agentica integration
  - PostgreSQL + pgvector for data storage
  - Redis for caching and real-time
  - MinIO for object storage

Frontend:
  - Next.js (TypeScript) for web
  - React Native (TypeScript) for mobile
  - TailwindCSS for styling
  - SWR/TanStack Query for data fetching

DevOps:
  - Docker for containerization
  - GitHub Actions for CI/CD
  - Vercel/Railway for deployment
  - Sentry for error tracking
```

---

## 🎯 Success Metrics

### **Technical KPIs**

- Voice recognition accuracy: >95%
- Response latency: <200ms
- Project analysis speed: <30 seconds
- Presentation generation: <2 minutes
- Database query performance: <100ms avg

### **User Experience KPIs**

- Voice command success rate: >90%
- User satisfaction: >4.5/5
- Daily active users: 1000+ (6 months)
- Project DNA accuracy: >85%

---

## 💡 Advanced Features for Future

### **Collaborative Intelligence**

```python
# 팀 협업을 위한 AI 기능
class CollaborativeAI:
    async def analyze_team_project(self, team_id: str, project_id: str):
        """팀 프로젝트 통합 분석"""
        team_members = await self.get_team_members(team_id)
        individual_patterns = []

        for member in team_members:
            pattern = await self.analyze_coding_style(member.id, project_id)
            individual_patterns.append(pattern)

        # 팀 코딩 스타일 통합
        unified_style = await self.merge_coding_styles(individual_patterns)

        return TeamProjectDNA(
            unified_patterns=unified_style,
            member_contributions=individual_patterns,
            collaboration_insights=await self.analyze_collaboration(team_id)
        )
```

### **Voice-Driven Development Environment**

```typescript
// 음성으로 개발 환경 제어
interface VoiceDrivenIDE {
  // "새 컴포넌트 만들어줘"
  createComponent(name: string, type: ComponentType): Promise<void>;

  // "이 함수 리팩토링해줘"
  refactorFunction(functionName: string): Promise<void>;

  // "테스트 코드 생성해줘"
  generateTests(targetFile: string): Promise<void>;

  // "프로젝트 구조 최적화해줘"
  optimizeStructure(): Promise<void>;
}
```

---
