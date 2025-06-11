# Agentica

Agentica는 OpenRouter API를 활용한 대화형 AI 채팅 애플리케이션입니다.

## 프로젝트 구조

```
test-agentica/
├── server/     # WebSocket 서버
└── client/     # React 기반 웹 클라이언트
```

## 시작하기

### 1. 서버 설정 및 실행

1. server 디렉토리로 이동:
```bash
cd server
```

2. `.env` 파일 생성 및 설정:
```env
PORT=3001
MODEL_PROVIDER=openrouter
MODEL_NAME=meta-llama/llama-4-maverick:free
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

3. 패키지 설치 및 서버 실행:
```bash
npm install
npm run prepare
npm run build
npm start
```

### 2. 클라이언트 설정 및 실행

1. 새 터미널에서 client 디렉토리로 이동:
```bash
cd client
```

2. `.env` 파일 생성 및 설정:
```env
VITE_AGENTICA_WS_URL=ws://localhost:3001/chat
```

3. 패키지 설치 및 클라이언트 실행:
```bash
npm install
npm run dev
```

4. 브라우저에서 `http://localhost:5173` 접속

## 주의사항

- OpenRouter API 키가 필요합니다.
- 서버는 반드시 클라이언트보다 먼저 실행되어야 합니다.
- 현재 기본 채팅 기능만 활성화되어 있습니다.
