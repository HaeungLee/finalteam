# Agentica 클라이언트

## 환경 설정

1. `.env` 파일을 클라이언트 디렉토리의 루트에 생성하고 다음 내용을 추가하세요:

```env
VITE_AGENTICA_WS_URL=ws://localhost:3001/chat
```

## 설치 및 실행

1. 필요한 패키지 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

## 주의사항

- 서버가 먼저 실행되어 있어야 합니다.
- 기본적으로 클라이언트는 `http://localhost:5173`에서 실행됩니다.
- WebSocket URL은 서버의 포트(3001)와 일치해야 합니다.
