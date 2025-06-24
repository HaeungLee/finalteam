import { useAgenticaRpc } from "../../provider/AgenticaRpcProvider";
import { ChatMessages } from "./ChatMessages";
import { ChatStatus } from "./ChatStatus";
import { ChatInput } from "./ChatInput";
import Navigation from "../layout/Navigation";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function Chat() {
  const { messages, isConnected, isError, tryConnect, conversate } = useAgenticaRpc();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const hasMessage = messages.length > 0;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Handle initial message from home page
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage) {
      conversate(initialMessage);
      // Clear the state to prevent resending on re-renders
      window.history.replaceState({}, '');
    }
  }, [location.state, conversate]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#111827] overflow-hidden">
      <Navigation isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex flex-col h-[calc(100vh-4rem)] ${isSidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-thumb-rounded">
            <div
              ref={messagesContainerRef}
              className="space-y-6"
            >
              {hasMessage ? (
                <ChatMessages messages={messages} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  대화를 시작하세요
                </div>
              )}
              <div className="pb-4">
                <ChatStatus
                  isError={isError}
                  isConnected={isConnected}
                  hasMessages={hasMessage}
                  onRetryConnect={tryConnect}
                  isWsUrlConfigured={import.meta.env.VITE_AGENTICA_WS_URL !== ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <ChatInput 
            onSendMessage={conversate} 
            disabled={!isConnected} 
          />
        </div>
      </div>
    </div>
  );
}
