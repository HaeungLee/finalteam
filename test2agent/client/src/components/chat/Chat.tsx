import { useAgenticaRpc } from "../../provider/AgenticaRpcProvider";
import { ChatMessages } from "./ChatMessages";
import { ChatStatus } from "./ChatStatus";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function Chat() {
  const { messages, isConnected, isError, tryConnect, conversate } = useAgenticaRpc();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const hasMessage = messages.length > 0;

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
    <div className="flex-1 flex flex-col p-4 md:p-8 min-w-0 overflow-hidden">
      <div className="relative w-full h-full">
        <div className="h-full flex flex-col bg-zinc-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-zinc-700/30">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
          >
            {hasMessage ? (
              <ChatMessages messages={messages} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                대화를 시작하세요
              </div>
            )}
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
  );
}
