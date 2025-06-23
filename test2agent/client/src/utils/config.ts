// API 설정
export const API_CONFIG = {
  SPRING_BASE_URL: 'http://localhost:8080',
  NODE_BASE_URL: 'http://localhost:8081',
  PYTHON_VOICE_URL: 'http://localhost:8082',
  VOICE_PROXY_URL: 'http://localhost:8083',
  WEBSOCKET_URL: 'ws://localhost:8081'
};

// 환경별 설정
const config = {
  development: {
    SPRING_API_URL: 'http://localhost:8080',
    NODE_API_URL: 'http://localhost:8081',
    PYTHON_VOICE_URL: 'http://localhost:8082',
    VOICE_PROXY_URL: 'http://localhost:8083',
    WEBSOCKET_URL: 'ws://localhost:8081'
  },
  production: {
    SPRING_API_URL: import.meta.env.VITE_SPRING_API_URL || 'http://localhost:8080',
    NODE_API_URL: import.meta.env.VITE_NODE_API_URL || 'http://localhost:8081',
    PYTHON_VOICE_URL: import.meta.env.VITE_PYTHON_VOICE_URL || 'http://localhost:8082',
    VOICE_PROXY_URL: import.meta.env.VITE_VOICE_PROXY_URL || 'http://localhost:8083',
    WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8081'
  }
};

export const getConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return config[env as keyof typeof config];
};

export default config; 