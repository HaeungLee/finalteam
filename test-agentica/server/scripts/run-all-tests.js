/**
 * 전체 Connector 통합 테스트 러너
 * 
 * 모든 connector들을 순차적으로 테스트합니다:
 * - Discord Connector
 * - GitHub Connector  
 * - Kakao Services (Map, Navi, Talk)
 * - Naver News
 * - Notion
 * - YouTube
 */

import { runDiscordTest } from './test-discord-connector.js';
import { runGitHubTest } from './test-github-connector.js';
import { runKakaoTest } from './test-kakao-connectors.js';
import { runMultiServiceTest } from './test-other-connectors.js';

class IntegratedTester {
  constructor() {
    this.testResults = {
      discord: null,
      github: null,
      kakao: null,
      others: null
    };
  }

  async runAllTests() {
    console.log('🚀 모든 Connector 통합 테스트 시작...\n');
    console.log('=' .repeat(60));

    try {
      // Discord 테스트
      console.log('\n📍 1. Discord Connector 테스트 실행...');
      this.testResults.discord = await this.safeTest('Discord', runDiscordTest);
      
      await this.delay(5000);

      // GitHub 테스트  
      console.log('\n📍 2. GitHub Connector 테스트 실행...');
      this.testResults.github = await this.safeTest('GitHub', runGitHubTest);
      
      await this.delay(5000);

      // Kakao 테스트
      console.log('\n📍 3. Kakao Services 테스트 실행...');
      this.testResults.kakao = await this.safeTest('Kakao', runKakaoTest);
      
      await this.delay(5000);

      // 기타 서비스 테스트
      console.log('\n📍 4. Naver/Notion/YouTube 테스트 실행...');
      this.testResults.others = await this.safeTest('Others', runMultiServiceTest);

    } catch (error) {
      console.error('통합 테스트 중 오류 발생:', error);
    }

    this.printTestSummary();
  }

  async safeTest(serviceName, testFunction) {
    try {
      await testFunction();
      console.log(`✅ ${serviceName} 테스트 완료`);
      return 'SUCCESS';
    } catch (error) {
      console.error(`❌ ${serviceName} 테스트 실패:`, error.message);
      return 'FAILED';
    }
  }

  printTestSummary() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 테스트 결과 요약');
    console.log('=' .repeat(60));
    
    const services = [
      { name: 'Discord Connector', result: this.testResults.discord },
      { name: 'GitHub Connector', result: this.testResults.github },
      { name: 'Kakao Services', result: this.testResults.kakao },
      { name: 'Naver/Notion/YouTube', result: this.testResults.others }
    ];

    services.forEach(service => {
      const status = service.result === 'SUCCESS' ? '✅ 성공' : 
                    service.result === 'FAILED' ? '❌ 실패' : '⏸️ 미실행';
      console.log(`${service.name}: ${status}`);
    });

    const successCount = Object.values(this.testResults).filter(r => r === 'SUCCESS').length;
    const totalCount = Object.values(this.testResults).length;
    
    console.log('\n' + '-' .repeat(40));
    console.log(`전체 성공률: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
    console.log('=' .repeat(60));

    // 다음 단계 안내
    if (successCount === totalCount) {
      console.log('\n🎉 모든 테스트가 성공했습니다!');
      console.log('📝 이제 TTS/STT 기능을 추가할 준비가 되었습니다.');
    } else {
      console.log('\n⚠️ 일부 테스트가 실패했습니다.');
      console.log('💡 실패한 connector들의 설정을 확인해주세요:');
      console.log('   - API 키가 올바른지 확인');
      console.log('   - 환경변수가 제대로 설정되었는지 확인');
      console.log('   - 해당 서비스의 권한이 있는지 확인');
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function runIntegratedTest() {
  const tester = new IntegratedTester();
  await tester.runAllTests();
}

// 직접 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegratedTest();
}

export { runIntegratedTest };
