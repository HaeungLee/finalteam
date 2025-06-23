import React, { useState, useCallback, useEffect, useRef } from 'react';
import { voiceApiService, formatDuration } from '../../utils/voiceApi';

interface VoiceButtonProps {
  onVoiceInput: (text: string) => void;
  disabled?: boolean;
  className?: string;
  defaultDuration?: number;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  onVoiceInput, 
  disabled = false,
  className = "",
  defaultDuration = 15.0
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [duration] = useState(defaultDuration);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 마운트 시 서버 상태 확인
  useEffect(() => {
    checkServerHealth();
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  const checkServerHealth = async () => {
    try {
      const healthy = await voiceApiService.checkHealth();
      setIsHealthy(healthy);
    } catch (error) {
      setIsHealthy(false);
    }
  };

  const startCountdown = useCallback((durationSeconds: number) => {
    setCountdown(durationSeconds);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);
  }, []);

  const handleVoiceInput = useCallback(async () => {
    if (disabled || isRecording) return;
    
    setIsRecording(true);
    setError(null);
    startCountdown(duration);
    
    try {
      // FastAPI 서버로 음성 명령 처리 요청
      const text = await voiceApiService.processVoiceCommand(duration);
      
      if (text.trim()) {
        // 채팅 입력창에 텍스트 삽입
        onVoiceInput(text);
      } else {
        setError('음성이 인식되지 않았습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Voice input error:', error);
      setError(error instanceof Error ? error.message : '음성 인식 중 오류가 발생했습니다.');
      
      // 서버 연결 문제일 수 있으므로 health check
      if (error instanceof Error && error.message.includes('fetch')) {
        setIsHealthy(false);
      }
    } finally {
      stopCountdown();
      setIsRecording(false);
    }
  }, [disabled, isRecording, duration, onVoiceInput, startCountdown, stopCountdown]);

  const getButtonStatus = () => {
    if (isRecording) return 'recording';
    if (disabled) return 'disabled';
    if (isHealthy === false) return 'offline';
    return 'ready';
  };

  const getButtonContent = () => {
    const status = getButtonStatus();
    
    switch (status) {
      case 'recording':
        return (
          <>
            <span className="text-lg animate-pulse">🎤</span>
            <span className="text-sm font-mono">
              {countdown !== null ? `${countdown}s` : '처리중...'}
            </span>
          </>
        );
      case 'offline':
        return (
          <>
            <span className="text-lg">🔌</span>
            <span className="text-sm">오프라인</span>
          </>
        );
      default:
        return (
          <>
            <span className="text-lg">🎤</span>
            <span className="text-sm hidden sm:inline">음성</span>
          </>
        );
    }
  };

  const getButtonClassName = () => {
    const status = getButtonStatus();
    const baseClasses = "px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2";
    
    switch (status) {
      case 'recording':
        return `${baseClasses} bg-red-500/80 text-white animate-pulse focus:ring-red-400/50`;
      case 'offline':
        return `${baseClasses} bg-gray-500/80 text-gray-300 cursor-not-allowed focus:ring-gray-400/50`;
      case 'disabled':
        return `${baseClasses} bg-gray-600/50 text-gray-400 opacity-50 cursor-not-allowed focus:ring-gray-400/50`;
      default:
        return `${baseClasses} bg-blue-500/80 hover:bg-blue-600/80 text-white cursor-pointer focus:ring-blue-400/50`;
    }
  };

  const getButtonTitle = () => {
    const status = getButtonStatus();
    
    switch (status) {
      case 'recording':
        return `음성 녹음 중... (${formatDuration(duration)})`;
      case 'offline':
        return '음성 서버에 연결할 수 없습니다. 다시 시도해주세요.';
      case 'disabled':
        return '음성 기능이 비활성화되었습니다.';
      default:
        return `음성으로 메시지 입력 (${formatDuration(duration)})`;
    }
  };

  return (
    <div className={`voice-button-container flex items-center gap-2 relative ${className}`}>
      {/* 메인 음성 버튼 */}
      <button 
        onClick={handleVoiceInput}
        disabled={disabled || isRecording || isHealthy === false}
        className={getButtonClassName()}
        title={getButtonTitle()}
      >
        {getButtonContent()}
      </button>

      {/* 서버 상태 재확인 버튼 */}
      {isHealthy === false && (
        <button
          onClick={checkServerHealth}
          className="px-2 py-2 rounded-xl bg-yellow-500/80 hover:bg-yellow-600/80 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          title="음성 서버 연결 상태 다시 확인"
        >
          <span className="text-sm">🔄</span>
        </button>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-500/90 text-white text-sm rounded-md max-w-xs z-20 shadow-lg">
          <div className="flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <div>
              <div className="font-medium">음성 처리 오류</div>
              <div className="text-xs mt-1 opacity-90">{error}</div>
              <button
                onClick={() => setError(null)}
                className="text-xs underline mt-1 hover:no-underline"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};