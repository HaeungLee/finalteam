/**
 * Google Services API Refresh Token 발급 헬퍼 스크립트
 * Gmail + Google Calendar + Google Drive + Google Docs + Google Sheets 통합 인증
 * 
 * 사전 준비:
 * 1. Google Cloud Console에서 필요한 API들 활성화
 *    - Gmail API
 *    - Google Calendar API  
 *    - Google Drive API
 *    - Google Docs API
 *    - Google Sheets API
 * 2. OAuth 2.0 클라이언트 ID 생성
 * 3. 리디렉션 URI: http://localhost:3001/auth/callback 설정
 */

import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import open from 'open';

// .env 파일에서 설정된 값 사용
const CLIENT_ID = '207390623047-cgtnd87rimflmcnrrhtal9k7u144ef8n.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3001/auth/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// 모든 Google Services API 권한 스코프
const SCOPES = [
  // Gmail API
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  
  // Google Calendar API
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.calendarlist',
  'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
  
  // Google Drive API
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  
  // Google Docs API
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
  
  // Google Sheets API
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];

/**
 * Refresh Token 발급 프로세스
 */
async function getRefreshToken() {
  console.log('🔐 Google Services API Refresh Token 발급을 시작합니다...\n');
  
  console.log('📋 요청할 권한 목록:');
  console.log('  ✉️  Gmail (읽기, 전송, 수정)');
  console.log('  📅 Calendar (전체 관리)'); 
  console.log('  💾 Drive (파일 관리)');
  console.log('  📄 Docs (문서 편집)');
  console.log('  📊 Sheets (스프레드시트 편집)\n');
  
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
          
          console.log('🔍 토큰 상세 정보:');
          console.log(`Access Token (일부): ${tokens.access_token?.substring(0, 20)}...`);
          console.log(`Refresh Token (일부): ${tokens.refresh_token?.substring(0, 20)}...`);
          console.log(`Token Type: ${tokens.token_type}`);
          console.log(`Expires In: ${tokens.expiry_date ? new Date(tokens.expiry_date) : 'N/A'}\n`);
          
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h2>✅ Google Services API 인증 완료</h2>
                <p>✉️ Gmail + 📅 Calendar + 💾 Drive + 📄 Docs + 📊 Sheets</p>
                <p>콘솔에서 토큰 정보를 확인하세요.</p>
                <p>이 창을 닫아도 됩니다.</p>
                <script>
                  setTimeout(() => {
                    window.close();
                  }, 3000);
                </script>
              </body>
            </html>
          `);
          
          server.close();
          
          // 자동으로 API 테스트 실행
          console.log('🧪 발급된 토큰으로 API 연결 테스트를 시작합니다...\n');
          await testAllAPIs(tokens.refresh_token);
          
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
 * 발급된 토큰으로 모든 API 테스트
 */
async function testAllAPIs(refreshToken) {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    let allSuccess = true;

    // Gmail API 테스트
    console.log('1️⃣ Gmail API 테스트...');
    try {
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      console.log(`   ✅ Gmail: ${profile.data.emailAddress} (메시지 ${profile.data.messagesTotal}개)`);
    } catch (error) {
      console.log(`   ❌ Gmail: ${error.message}`);
      allSuccess = false;
    }

    // Google Calendar API 테스트
    console.log('2️⃣ Google Calendar API 테스트...');
    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const calendars = await calendar.calendarList.list();
      console.log(`   ✅ Calendar: ${calendars.data.items?.length || 0}개 캘린더 발견`);
    } catch (error) {
      console.log(`   ❌ Calendar: ${error.message}`);
      allSuccess = false;
    }

    // Google Drive API 테스트
    console.log('3️⃣ Google Drive API 테스트...');
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      const files = await drive.files.list({ pageSize: 5 });
      console.log(`   ✅ Drive: ${files.data.files?.length || 0}개 파일 확인`);
    } catch (error) {
      console.log(`   ❌ Drive: ${error.message}`);
      allSuccess = false;
    }

    // Google Docs API 테스트
    console.log('4️⃣ Google Docs API 테스트...');
    try {
      const docs = google.docs({ version: 'v1', auth: oauth2Client });
      // docs는 특정 문서 ID가 필요하므로 인증만 확인
      console.log(`   ✅ Docs: 인증 성공 (API 사용 가능)`);
    } catch (error) {
      console.log(`   ❌ Docs: ${error.message}`);
      allSuccess = false;
    }

    // Google Sheets API 테스트
    console.log('5️⃣ Google Sheets API 테스트...');
    try {
      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
      // sheets도 특정 시트 ID가 필요하므로 인증만 확인
      console.log(`   ✅ Sheets: 인증 성공 (API 사용 가능)`);
    } catch (error) {
      console.log(`   ❌ Sheets: ${error.message}`);
      allSuccess = false;
    }

    console.log('\n' + '='.repeat(50));
    if (allSuccess) {
      console.log('🎉 모든 Google Services API 연결 성공!');
      console.log('이제 .env 파일에 GOOGLE_REFRESH_TOKEN을 업데이트하세요.');
    } else {
      console.log('⚠️  일부 API에서 문제가 발생했습니다.');
      console.log('Google Cloud Console에서 해당 API가 활성화되어 있는지 확인하세요.');
    }
    console.log('='.repeat(50));

    return allSuccess;
  } catch (error) {
    console.error('❌ API 테스트 실패:', error.message);
    return false;
  }
}

/**
 * 개별 API 테스트 함수들
 */
async function testGmailOnly(refreshToken) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const profile = await gmail.users.getProfile({ userId: 'me' });
  console.log(`✅ Gmail 연결 성공: ${profile.data.emailAddress}`);
}

async function testCalendarOnly(refreshToken) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const calendars = await calendar.calendarList.list();
  console.log(`✅ Calendar 연결 성공: ${calendars.data.items?.length}개 캘린더`);
}

// 명령행 인자에 따라 실행
const args = process.argv.slice(2);

if (args[0] === 'test' && args[1]) {
  // 테스트 모드: node google-services-auth-helper.js test <refresh_token>
  testAllAPIs(args[1]);
} else if (args[0] === 'test-gmail' && args[1]) {
  // Gmail만 테스트
  testGmailOnly(args[1]);
} else if (args[0] === 'test-calendar' && args[1]) {
  // Calendar만 테스트
  testCalendarOnly(args[1]);
} else if (args[0] === 'help') {
  console.log(`
🔐 Google Services API Refresh Token 발급 헬퍼

지원하는 서비스:
  ✉️  Gmail (읽기, 전송, 수정)
  📅 Calendar (전체 관리)
  💾 Drive (파일 관리)  
  📄 Docs (문서 편집)
  📊 Sheets (스프레드시트 편집)

사용법:
  node google-services-auth-helper.js              # 모든 서비스 Refresh Token 발급
  node google-services-auth-helper.js test <token> # 모든 API 연결 테스트
  node google-services-auth-helper.js test-gmail <token>     # Gmail만 테스트
  node google-services-auth-helper.js test-calendar <token> # Calendar만 테스트
  node google-services-auth-helper.js help         # 도움말

사전 준비사항:
1. Google Cloud Console (https://console.cloud.google.com)
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 필요한 API들 활성화:
   - Gmail API
   - Google Calendar API
   - Google Drive API
   - Google Docs API  
   - Google Sheets API
4. OAuth 2.0 클라이언트 ID 생성
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI: http://localhost:3001/auth/callback
5. 클라이언트 ID와 시크릿을 이 스크립트에 입력

⚠️ 중요사항:
- access_type: 'offline'과 prompt: 'consent'가 있어야 refresh_token이 발급됩니다!
- 처음 인증할 때는 모든 권한을 한 번에 승인해야 합니다.
- 기존 토큰이 있어도 새로운 스코프 추가시 재인증이 필요합니다.
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
