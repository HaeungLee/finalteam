from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import asyncio
from typing import Optional
import logging
import sys
import os

# 현재 디렉토리를 Python path에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from src.main import VoiceAssistant
except ImportError as e:
    print(f"Warning: Could not import VoiceAssistant: {e}")
    print("Running in mock mode for testing...")
    VoiceAssistant = None

app = FastAPI(
    title="STT/TTS Voice Service",
    description="Speech-to-Text and Text-to-Speech API using Whisper and ElevenLabs",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경에서는 모든 origin 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic 모델들
class RecordRequest(BaseModel):
    duration: float = Field(
        default=15.0, 
        ge=5.0, 
        le=30.0, 
        description="녹음 시간 (5-30초, 권장: 15초)"
    )

class TTSRequest(BaseModel):
    text: str = Field(description="음성으로 변환할 텍스트")

class VoiceResponse(BaseModel):
    success: bool
    text: Optional[str] = None
    duration: Optional[float] = None
    message: Optional[str] = None
    error: Optional[str] = None

class DurationPreset(BaseModel):
    name: str
    duration: float
    description: str

class DurationPresetsResponse(BaseModel):
    presets: list[DurationPreset]
    recommended: float
    performance_info: dict

# 전역 음성 어시스턴트 인스턴스 (Mock 모드 지원)
voice_assistant = None
if VoiceAssistant:
    try:
        voice_assistant = VoiceAssistant()
        logger.info("VoiceAssistant initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize VoiceAssistant: {e}")
        voice_assistant = None

@app.get("/health")
async def health_check():
    """서버 상태 확인"""
    status = "ok" if voice_assistant else "mock"
    return {
        "status": status,
        "service": "STT/TTS Server",
        "docs": "/docs",
        "voice_assistant": voice_assistant is not None
    }

@app.post("/voice/record", response_model=VoiceResponse)
async def record_and_transcribe(request: RecordRequest):
    """마이크로 녹음하고 STT 수행 (비동기)"""
    if not voice_assistant:
        # Mock 응답 (테스트용)
        return VoiceResponse(
            success=True,
            text=f"Mock STT result for {request.duration} seconds",
            duration=request.duration,
            message="Mock mode - VoiceAssistant not available"
        )
    
    try:
        logger.info(f"Starting voice recording for {request.duration} seconds")
        
        # CPU 집약적 작업을 별도 스레드에서 실행
        loop = asyncio.get_event_loop()
        
        # 녹음 작업 (블로킹 작업을 비동기로 처리)
        audio_data = await loop.run_in_executor(
            None, 
            voice_assistant.stt.record_audio, 
            request.duration
        )
        
        if audio_data is not None:
            logger.info("Audio recorded successfully, starting transcription")
            
            # STT 작업 (블로킹 작업을 비동기로 처리)
            text = await loop.run_in_executor(
                None,
                voice_assistant.stt.transcribe_audio,
                audio_data
            )
            
            logger.info(f"Transcription completed: {text[:50]}...")
            
            return VoiceResponse(
                success=True,
                text=text,
                duration=request.duration,
                message="Voice recording and transcription completed"
            )
        else:
            raise HTTPException(status_code=400, detail="Recording failed")
            
    except Exception as e:
        logger.error(f"Voice recording error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/voice/tts", response_model=VoiceResponse)
async def text_to_speech(request: TTSRequest):
    """텍스트를 음성으로 변환하고 재생 (비동기)"""
    if not voice_assistant:
        # Mock 응답 (테스트용)
        return VoiceResponse(
            success=True,
            message=f"Mock TTS for text: {request.text[:50]}..."
        )
    
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="No text provided")
        
        logger.info(f"Starting TTS for text: {request.text[:50]}...")
        
        # TTS 작업 (블로킹 작업을 비동기로 처리)
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            voice_assistant.tts.speak,
            request.text
        )
        
        logger.info("TTS completed successfully")
        
        return VoiceResponse(
            success=True,
            message="Speech played successfully"
        )
        
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/voice/command", response_model=VoiceResponse)
async def voice_command(request: RecordRequest):
    """음성 명령 녹음 → STT → (외부 처리용 텍스트 반환)"""
    if not voice_assistant:
        # Mock 응답 (테스트용)
        return VoiceResponse(
            success=True,
            text=f"smanew28@gmail.com으로 테스트 메일을 보내줘",  # 실제 명령어 예시
            duration=request.duration,
            message="Mock voice command"
        )
    
    try:
        logger.info(f"Starting voice command recording for {request.duration} seconds")
        
        loop = asyncio.get_event_loop()
        
        # 녹음 + STT 처리
        audio_data = await loop.run_in_executor(
            None, 
            voice_assistant.stt.record_audio, 
            request.duration
        )
        
        if audio_data is not None:
            text = await loop.run_in_executor(
                None,
                voice_assistant.stt.transcribe_audio,
                audio_data
            )
            
            logger.info(f"Voice command transcribed: {text}")
            
            return VoiceResponse(
                success=True,
                text=text,
                duration=request.duration,
                message="Voice command transcribed successfully"
            )
        else:
            raise HTTPException(status_code=400, detail="Recording failed")
            
    except Exception as e:
        logger.error(f"Voice command error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/voice/duration-presets")
async def get_duration_presets():
    """음성 녹음 시간 프리셋 반환"""
    return DurationPresetsResponse(
        presets=[
            DurationPreset(name="빠른 명령", duration=10.0, description="간단한 명령어용"),
            DurationPreset(name="일반 명령", duration=15.0, description="대부분의 명령어 (권장)"),
            DurationPreset(name="긴 명령", duration=30.0, description="복잡한 명령어나 긴 텍스트")
        ],
        recommended=15.0,
        performance_info={
            "base_model": "whisper-base",
            "processing_time": {
                "10_seconds": "2-5초",
                "15_seconds": "3-7초",
                "30_seconds": "5-10초"
            },
            "memory_usage": "1-3GB",
            "recommended_duration": "15초 (최적의 정확도와 속도)"
        }
    )

# 개발 서버 실행
if __name__ == "__main__":
    import uvicorn
    
    print("🎤 Starting FastAPI Voice Server...")
    print("📋 Features:")
    print("  - STT (Speech-to-Text) via Whisper")
    print("  - TTS (Text-to-Speech) via ElevenLabs")
    print("  - Voice Command Processing")
    print("  - Duration Presets")
    print("  - Health Check")
    print(f"🔧 Voice Assistant: {'Available' if voice_assistant else 'Mock Mode'}")
    print("📖 API Documentation: http://localhost:8082/docs")
    
    uvicorn.run(
        "web_server:app", 
        host="0.0.0.0", 
        port=8082, 
        reload=True,
        log_level="info"
    ) 