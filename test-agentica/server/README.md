# Agentica 서버

## 환경 설정

1. `.env` 파일을 서버 디렉토리의 루트에 생성하고 다음 내용을 추가하세요:

```env
PORT=3001
MODEL_PROVIDER=openrouter
MODEL_NAME=meta-llama/llama-4-maverick:free
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## 설치 및 실행

1. 필요한 패키지 설치:
```bash
npm install
```

2. TypeScript 컴파일을 위한 환경 준비:
```bash
npm run prepare
```

3. 서버 빌드:
```bash
npm run build
```

4. 서버 실행:
```bash
npm start
```

서버가 성공적으로 시작되면 콘솔에서 다음과 같은 메시지를 볼 수 있습니다:
"Using openrouter with model: meta-llama/llama-4-maverick:free"

## 주의사항

- OpenRouter API 키는 반드시 유효한 키를 사용해야 합니다.
- 서버는 기본적으로 3001 포트에서 실행됩니다.
- 현재 대부분의 커넥터 서비스는 주석 처리되어 있어 기본 채팅 기능만 사용 가능합니다.