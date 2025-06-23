import { useNavigate } from "react-router-dom";
import { ChatInput } from "../chat/ChatInput";
import agenticaLogo from "../../images/agentica.png";

export function Home() {
  const navigate = useNavigate();

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      navigate("/chat", { state: { initialMessage: message } });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-20 px-4 md:px-8 min-w-0">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-6">
        <img 
          src={agenticaLogo} 
          alt="Agentica Logo" 
          className="h-40 w-auto object-contain max-w-full"
        />
        <p className="text-2xl font-bold text-white">무엇을 도와드릴까요?</p>
        
        <div className="w-full max-w-2xl mt-4">
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={false}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
