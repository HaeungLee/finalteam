import { DiscordService } from "@wrtnlabs/connector-discord";

/**
 * 순환 참조를 제거하는 강력한 헬퍼 함수 (더 강화된 버전)
 */
function sanitizeObject(obj: any, seen = new WeakSet(), depth = 0): any {
  // 깊이 제한 (무한 재귀 방지)
  if (depth > 8) {
    return '[Max Depth Reached]';
  }
  
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // 원시 타입은 그대로 반환
  if (typeof obj !== 'object') {
    return obj;
  }
  
  // 순환 참조 감지
  if (seen.has(obj)) {
    return '[Circular Reference]';
  }
  
  seen.add(obj);
  
  try {
    // 배열 처리
    if (Array.isArray(obj)) {
      const result = obj.map(item => sanitizeObject(item, seen, depth + 1));
      seen.delete(obj);
      return result;
    }
    
    // Error 객체 처리
    if (obj instanceof Error) {
      const result = {
        name: obj.name,
        message: obj.message,
        stack: obj.stack
      };
      seen.delete(obj);
      return result;
    }
    
    // Date 객체 처리
    if (obj instanceof Date) {
      const result = obj.toISOString();
      seen.delete(obj);
      return result;
    }
    
    // HTTP 관련 객체들 제외 (더 포괄적)
    const dangerousTypes = [
      'ClientRequest', 'IncomingMessage', 'Socket', 'ServerResponse',
      'Duplex', 'Readable', 'Writable', 'Transform', 'PassThrough',
      'Http2Stream', 'Http2Session', 'TLSSocket', 'TcpSocket'
    ];
    
    if (obj.constructor && dangerousTypes.includes(obj.constructor.name)) {
      seen.delete(obj);
      return `[${obj.constructor.name} Object]`;
    }
    
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // 위험한 속성들 제외 (더 포괄적)
      if ([
        'req', 'res', 'socket', '_headers', 'client', 'request', 'response',
        '_socket', '_httpMessage', '_writableState', '_readableState',
        'connection', 'httpVersion', 'httpVersionMajor', 'httpVersionMinor',
        'headers', 'rawHeaders', 'trailers', 'rawTrailers',
        'upgrade', 'url', 'method', 'statusCode', 'statusMessage',
        'setTimeout', 'setNoDelay', 'setKeepAlive', 'destroy',
        'pipe', 'unpipe', 'resume', 'pause', 'read', 'write',
        '_handle', '_handlersCount', '_eventsCount', '_events',
        'domain', '_domain', '_writableState', '_readableState'
      ].includes(key)) {
        continue;
      }
      
      // 함수 제외
      if (typeof value === 'function') {
        continue;
      }
      
      try {
        sanitized[key] = sanitizeObject(value, seen, depth + 1);
      } catch (error) {
        sanitized[key] = `[Error sanitizing ${key}]`;
      }
    }
    
    seen.delete(obj);
    return sanitized;
    
  } catch (error) {
    seen.delete(obj);
    return `[Sanitization Error: ${error instanceof Error ? error.message : String(error)}]`;
  }
}

/**
 * JSON 직렬화 안전성 검증 (더 강화된 버전)
 */
function ensureSerializable(obj: any): any {
  try {
    // 먼저 기본 JSON.stringify로 테스트
    JSON.stringify(obj);
    return obj;
  } catch (error) {
    console.warn('⚠️ Object not serializable, applying deep sanitization:', error instanceof Error ? error.message : String(error));
    
    // 더 강력한 sanitization 적용
    const sanitized = sanitizeObject(obj);
    
    // 두 번째 검증
    try {
      JSON.stringify(sanitized);
      return sanitized;
    } catch (secondError) {
      console.error('❌ Second sanitization failed:', secondError instanceof Error ? secondError.message : String(secondError));
      return {
        error: 'Object could not be serialized',
        originalType: typeof obj,
        constructorName: obj?.constructor?.name || 'unknown'
      };
    }
  }
}

/**
 * Discord Wrapper Service
 * 순환 참조 문제를 해결하고 Discord Connector 기능을 래핑
 * 동적으로 메서드를 감지하고 sanitization 적용
 */
export class DiscordWrapperService {
  private readonly discordService: DiscordService;

  constructor(props: {
    discordToken: string;
  }) {
    this.discordService = new DiscordService(props);
    
    // Proxy를 사용해서 모든 메서드 호출을 동적으로 처리
    return new Proxy(this, {
      get(target, prop, receiver) {
        const originalValue = Reflect.get(target, prop, receiver);
        
        // 기존 프로퍼티가 있으면 그대로 반환
        if (originalValue !== undefined) {
          return originalValue;
        }
        
        // discordService의 메서드인지 확인
        const discordMethod = (target.discordService as any)[prop];
        if (typeof discordMethod === 'function') {
          return async function(...args: any[]) {
            console.log(`🔧 DiscordWrapperService.${String(prop)} 호출됨`, args);
            
            try {
              // 입력 arguments도 sanitize
              const sanitizedArgs = args.map(arg => {
                try {
                  return ensureSerializable(arg);
                } catch {
                  return arg; // sanitize 실패시 원본 사용
                }
              });
              
              const result = await discordMethod.apply(target.discordService, sanitizedArgs);
              console.log(`🔍 원본 결과 타입:`, typeof result, result?.constructor?.name);
              
              // 강력한 sanitize 적용
              const sanitized = ensureSerializable(result);
              console.log(`✅ Discord ${String(prop)} 성공`);
              return sanitized;
            } catch (error) {
              console.error(`❌ Discord ${String(prop)} 실패:`, error);
              
              // 에러도 sanitize해서 반환
              const sanitizedError = ensureSerializable({
                name: error instanceof Error ? error.name : 'Unknown Error',
                message: error instanceof Error ? error.message : String(error),
                method: String(prop),
                timestamp: new Date().toISOString()
              });
              
              throw sanitizedError;
            }
          };
        }
        
        return undefined;
      }
    });
  }
}
