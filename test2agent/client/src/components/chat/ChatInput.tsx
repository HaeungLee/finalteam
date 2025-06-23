import { useState, KeyboardEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function ChatInput({ onSendMessage, disabled, autoFocus = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage("");
    textareaRef.current?.focus();
    
    // Navigate to chat screen if not already there
    if (window.location.pathname !== '/chat') {
      navigate('/chat');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      e.nativeEvent.isComposing === false
    ) {
      e.preventDefault();
      if (!disabled) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div 
        className="flex-1 relative"
        onClick={(e) => {
          e.stopPropagation();
          textareaRef.current?.focus();
        }}
      >
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setMessage(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            placeholder="입력해 주세요."
            className="w-full min-h-[100px] max-h-[160px] p-3 pr-12 bg-zinc-700/50 text-gray-100 placeholder:text-gray-400 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-white/20 cursor-text select-text"
            autoFocus={autoFocus}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${
              message.trim() && !disabled
                ? "text-gray-400 hover:text-gray-400"
                : "text-[#111827] cursor-not-allowed"
            } bg-transparent`}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="h-7 w-7" // Tailwind 스타일 유지 가능
            >
              <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
