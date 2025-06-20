/**
 * tgrid 모듈 구조 확인 테스트
 */

// CommonJS 방식으로 확인
try {
  const tgrid = require('tgrid');
  console.log('🔍 tgrid (CommonJS):', Object.keys(tgrid));
  console.log('WebSocketConnector 타입:', typeof tgrid.WebSocketConnector);
  console.log('전체 구조:', tgrid);
} catch (error) {
  console.error('❌ CommonJS 로드 실패:', error.message);
}

// ES 모듈 방식으로도 확인
import('tgrid').then(tgridModule => {
  console.log('🔍 tgrid (ESM):', Object.keys(tgridModule));
  console.log('WebSocketConnector 타입:', typeof tgridModule.WebSocketConnector);
  console.log('default 타입:', typeof tgridModule.default);
  
  if (tgridModule.default) {
    console.log('default 내용:', Object.keys(tgridModule.default));
  }
}).catch(error => {
  console.error('❌ ESM 로드 실패:', error.message);
});
