/**
 * Discord 토큰 유효성 검사 도구
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// .env 파일을 수동으로 로드하는 함수
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  try {
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8');
      console.log('📁 .env 파일을 찾았습니다:', envPath);
      
      const lines = envFile.split('\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // 따옴표 제거
            process.env[key.trim()] = value.trim();
          }
        }
      });
      
      console.log('✅ .env 파일 로드 완료');
    } else {
      console.log('❌ .env 파일을 찾을 수 없습니다:', envPath);
    }
  } catch (error) {
    console.error('❌ .env 파일 읽기 실패:', error.message);
  }
}

function checkDiscordToken(token, isBot = false) {
  return new Promise((resolve, reject) => {
    // 토큰 타입 자동 감지: 봇 토큰은 보통 더 길고 특정 패턴을 가짐
    const authHeader = isBot || token.length > 65 ? `Bot ${token}` : `Bearer ${token}`;
    
    const options = {
      hostname: 'discord.com',
      port: 443,
      path: '/api/v10/users/@me',
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'User-Agent': 'DiscordBot (personal-assistant, 1.0.0)'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`HTTP Status: ${res.statusCode}`);
        console.log('Response Headers:', res.headers);
        
        if (res.statusCode === 200) {
          try {
            const botInfo = JSON.parse(data);
            resolve({
              valid: true,
              status: res.statusCode,
              botInfo: {
                id: botInfo.id,
                username: botInfo.username,
                discriminator: botInfo.discriminator,
                verified: botInfo.verified,
                bot: botInfo.bot
              }
            });
          } catch (error) {
            resolve({
              valid: false,
              status: res.statusCode,
              error: 'Invalid JSON response',
              rawData: data
            });
          }
        } else {
          resolve({
            valid: false,
            status: res.statusCode,
            error: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function validateToken() {
  console.log('🔍 Discord 토큰 유효성 검사 시작...\n');
  
  // .env 파일 먼저 로드
  loadEnvFile();
  
  // 환경변수에서 토큰들 가져오기
  const userToken = process.env.DISCORD_TOKEN;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  
  console.log('📋 환경변수 상태:');
  console.log(`- DISCORD_TOKEN: ${userToken ? '설정됨' : '없음'}`);
  console.log(`- DISCORD_BOT_TOKEN: ${botToken ? '설정됨' : '없음'}`);
  
  if (!userToken && !botToken) {
    console.error('\n❌ Discord 토큰이 설정되지 않았습니다.');
    console.log('\n💡 해결 방법:');
    console.log('1. .env 파일에 DISCORD_TOKEN=your_user_token 추가');
    console.log('2. 또는 DISCORD_BOT_TOKEN=your_bot_token 추가');
    console.log('3. Discord Developer Portal에서 토큰 생성');
    return;
  }

  // 사용자 토큰 테스트 (우선순위)
  if (userToken) {
    console.log('\n🔍 사용자 토큰 (DISCORD_TOKEN) 검사...');
    await testToken(userToken, 'User', false);
  }
  
  // 봇 토큰 테스트
  if (botToken) {
    console.log('\n🔍 봇 토큰 (DISCORD_BOT_TOKEN) 검사...');
    await testToken(botToken, 'Bot', true);
  }
  
  console.log('\n🔗 도움말 링크:');
  console.log('- Discord Developer Portal: https://discord.com/developers/applications');
  console.log('- 사용자 토큰 vs 봇 토큰: https://discord.com/developers/docs/topics/oauth2#bots');
}

async function testToken(token, type, isBot) {
  console.log(`\n🔑 ${type} 토큰 정보:`);
  console.log(`- 길이: ${token.length} 문자`);
  console.log(`- 시작: ${token.substring(0, 10)}...`);
  console.log(`- 끝: ...${token.substring(token.length - 10)}`);
  
  try {
    const result = await checkDiscordToken(token, isBot);
    
    console.log(`\n📊 ${type} 토큰 검사 결과:`);
    console.log('=' .repeat(50));
    
    if (result.valid) {
      console.log(`✅ ${type} 토큰이 유효합니다!`);
      console.log(`\n🤖 계정 정보:`);
      console.log(`- ID: ${result.botInfo.id}`);
      console.log(`- 이름: ${result.botInfo.username}#${result.botInfo.discriminator || '0000'}`);
      console.log(`- 인증됨: ${result.botInfo.verified ? '예' : '아니오'}`);
      console.log(`- 봇 계정: ${result.botInfo.bot ? '예' : '아니오'}`);
      
      if (!isBot && result.botInfo.bot) {
        console.log('⚠️  주의: 이것은 봇 토큰입니다. DISCORD_BOT_TOKEN으로 설정하는 것이 좋습니다.');
      }
    } else {
      console.log(`❌ ${type} 토큰이 유효하지 않습니다!`);
      console.log(`\n📄 상세 정보:`);
      console.log(`- HTTP 상태: ${result.status}`);
      console.log(`- 오류: ${result.error}`);
      
      if (result.status === 401) {
        console.log(`\n💡 401 Unauthorized 해결 방법:`);
        console.log('1. 토큰이 올바른지 확인');
        console.log(`2. ${isBot ? '"Bot " 접두사가 필요' : '사용자 토큰인지 확인'}`);
        console.log('3. Discord Developer Portal에서 토큰 재생성');
      }
    }
    
  } catch (error) {
    console.error(`❌ ${type} 토큰 검사 중 오류 발생:`, error.message);
  }
}

validateToken();
