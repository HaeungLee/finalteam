import * as http from 'http';
import { URL } from 'url';

const FASTAPI_BASE_URL = 'http://localhost:8082';
const PORT = 8083;

interface RequestBody {
  duration?: number;
  text?: string;
}

// CORS 헤더 설정
const setCORSHeaders = (res: http.ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// JSON 응답 전송
const sendJSONResponse = (res: http.ServerResponse, statusCode: number, data: any) => {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// FastAPI 서버로 프록시 요청
const proxyToFastAPI = async (path: string, method: string, body?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8082,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 40000, // 40초 타임아웃 (STT 처리 시간 고려)
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: { message: data } });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    // 타임아웃 처리 추가
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout: Python FastAPI 서버 응답 시간 초과 (40초)'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

// 요청 본문 파싱
const parseRequestBody = (req: http.IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  });
};

// 서버 생성
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method!;

  console.log(`[Voice Proxy] ${method} ${pathname}`);

  // CORS preflight 처리
  if (method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // 헬스 체크
    if (pathname === '/health' && method === 'GET') {
      try {
        const result = await proxyToFastAPI('/api/health', 'GET');
        sendJSONResponse(res, result.statusCode || 200, result.data);
      } catch (error) {
        sendJSONResponse(res, 503, { 
          status: 'error', 
          message: 'FastAPI server unavailable',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      return;
    }

    // 음성 녹음 + STT
    if (pathname === '/voice/record' && method === 'POST') {
      const body = await parseRequestBody(req);
      const result = await proxyToFastAPI('/api/record-and-transcribe', 'POST', body);
      sendJSONResponse(res, result.statusCode || 200, result.data);
      return;
    }

    // TTS
    if (pathname === '/voice/tts' && method === 'POST') {
      const body = await parseRequestBody(req);
      const result = await proxyToFastAPI('/api/text-to-speech', 'POST', body);
      sendJSONResponse(res, result.statusCode || 200, result.data);
      return;
    }

    // 통합 음성 명령
    if (pathname === '/voice/command' && method === 'POST') {
      const body = await parseRequestBody(req);
      const result = await proxyToFastAPI('/api/voice-command', 'POST', body);
      sendJSONResponse(res, result.statusCode || 200, result.data);
      return;
    }

    // 녹음 시간 프리셋
    if (pathname === '/voice/duration-presets' && method === 'GET') {
      const result = await proxyToFastAPI('/api/duration-presets', 'GET');
      sendJSONResponse(res, result.statusCode || 200, result.data);
      return;
    }

    // 404 처리
    sendJSONResponse(res, 404, { message: 'Not Found' });

  } catch (error) {
    console.error('[Voice Proxy] Error:', error);
    sendJSONResponse(res, 500, { 
      message: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 서버 시작
server.listen(PORT, () => {
  console.log(`🎤 Voice Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying to FastAPI: ${FASTAPI_BASE_URL}`);
  console.log('📋 Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /voice/record');
  console.log('  POST /voice/tts');
  console.log('  POST /voice/command');
  console.log('  GET  /voice/duration-presets');
});

// 프로세스 종료 처리
process.on('SIGINT', () => {
  console.log('\n🛑 Voice Proxy Server shutting down...');
  server.close(() => {
    console.log('✅ Voice Proxy Server stopped');
    process.exit(0);
  });
});

export default server; 