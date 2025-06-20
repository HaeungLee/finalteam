/**
 * Gmail API Refresh Token 발급 헬퍼 스크립트
 * 
 * 사전 준비:
 * 1. Google Cloud Console에서 Gmail API 활성화
 * 2. OAuth 2.0 클라이언트 ID 생성
 * 3. 리디렉션 URI: http://localhost:3000/auth/callback 설정
 */

const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const open = require('open');

// .env 파일에서 설정된 값 사용
const CLIENT_ID = '207390623047-cgtnd87rimflmcnrrhtal9k7u144ef8n.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3001/auth/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Gmail API 권한 스코프
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify'
];

/**
 * Refresh Token 발급 프로세스
 */
async function getRefreshToken() {
  console.log('🔐 Gmail API Refresh Token 발급을 시작합니다...\n');
  
  // 1단계: Authorization URL 생성
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',  // refresh token을 위해 필수
    scope: SCOPES,
    prompt: 'consent'        // 재인증 강제 (refresh token 확보)
  });

  console.log('1단계: 브라우저에서 다음 URL에 접속하여 권한을 승인하세요:');
  console.log(`\n${authUrl}\n`);

  // 2단계: 로컬 서버로 콜백 받기
  const server = http.createServer(async (req, res) => {
    const reqUrl = url.parse(req.url, true);
    
    if (reqUrl.pathname === '/auth/callback') {
      const code = reqUrl.query.code;
      
      if (code) {
        try {
          // 3단계: Authorization Code를 Access Token + Refresh Token으로 교환
          const { tokens } = await oauth2Client.getToken(code);
          
          console.log('\n✅ 토큰 발급 성공!');
          console.log('\n=== .env 파일에 추가할 내용 ===');
          console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
          console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
          console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
          console.log('================================\n');
          
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h2>✅ Gmail API 인증 완료</h2>
                <p>콘솔에서 토큰 정보를 확인하세요.</p>
                <p>이 창을 닫아도 됩니다.</p>
              </body>
            </html>
          `);
          
          server.close();
        } catch (error) {
          console.error('❌ 토큰 교환 실패:', error);
          res.writeHead(500);
          res.end('토큰 교환에 실패했습니다.');
        }
      } else {
        console.error('❌ Authorization code가 없습니다.');
        res.writeHead(400);
        res.end('Authorization code가 필요합니다.');
      }
    }
  });

  server.listen(3001, () => {
    console.log('2단계: 로컬 서버가 포트 3001에서 콜백을 대기 중입니다...');
    
    // 자동으로 브라우저 열기 (선택사항)
    try {
      open(authUrl);
      console.log('✓ 브라우저가 자동으로 열렸습니다.');
    } catch (error) {
      console.log('⚠ 브라우저를 수동으로 열어 위 URL에 접속하세요.');
    }
  });
}

/**
 * 발급된 토큰으로 Gmail API 테스트
 */
async function testGmailAPI(refreshToken) {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    // 프로필 정보 가져오기
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log('✅ Gmail API 연결 성공!');
    console.log(`📧 이메일: ${profile.data.emailAddress}`);
    console.log(`📊 총 메시지 수: ${profile.data.messagesTotal}`);
    
    return true;
  } catch (error) {
    console.error('❌ Gmail API 테스트 실패:', error.message);
    return false;
  }
}

// 명령행 인자에 따라 실행
const args = process.argv.slice(2);

if (args[0] === 'test' && args[1]) {
  // 테스트 모드: node gmail-auth-helper.js test <refresh_token>
  testGmailAPI(args[1]);
} else if (args[0] === 'help') {
  console.log(`
📧 Gmail API Refresh Token 발급 헬퍼

사용법:
  node gmail-auth-helper.js          # Refresh Token 발급
  node gmail-auth-helper.js test <token>  # API 연결 테스트
  node gmail-auth-helper.js help     # 도움말

사전 준비사항:
1. Google Cloud Console (https://console.cloud.google.com)
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Gmail API 활성화
4. OAuth 2.0 클라이언트 ID 생성
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI: http://localhost:3000/auth/callback
5. 클라이언트 ID와 시크릿을 이 스크립트에 입력

⚠️ 중요: access_type: 'offline'과 prompt: 'consent'가 있어야
refresh_token이 발급됩니다!
  `);
} else {
  // 기본 모드: Refresh Token 발급
  if (CLIENT_ID === 'your_google_client_id_here') {
    console.error('❌ CLIENT_ID와 CLIENT_SECRET을 먼저 설정하세요!');
    console.log('스크립트 상단의 CLIENT_ID, CLIENT_SECRET 값을 수정하세요.');
    process.exit(1);
  }
  
  getRefreshToken();
}
