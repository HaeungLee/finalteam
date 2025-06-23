import { IAgenticaEventJson } from "@agentica/core";
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
import { Driver, WebSocketConnector } from "tgrid";

interface AgenticaRpcContextType {
  messages: IAgenticaEventJson[];
  conversate: (message: string) => Promise<void>;
  isConnected: boolean;
  isError: boolean;
  tryConnect: () => Promise<
    | WebSocketConnector<
        null,
        IAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      >
    | undefined
  >;
}

const AgenticaRpcContext = createContext<AgenticaRpcContextType | null>(null);

export function AgenticaRpcProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<IAgenticaEventJson[]>([]);
  const [isError, setIsError] = useState(false);
  const [driver, setDriver] =
    useState<Driver<IAgenticaRpcService<"chatgpt">, false>>();

  // 메시지 추가 함수를 안정적으로 유지하기 위해 ref 사용하고 Promise 반환하도록 수정
  const pushMessageRef = useRef(async (message: IAgenticaEventJson) => {
    setMessages(prev => [...prev, message]);
    return Promise.resolve();
  });

  // pushMessageRef를 최신 상태로 유지
  const pushMessage = useCallback(async (message: IAgenticaEventJson) => {
    return pushMessageRef.current(message);
  }, []);

  const tryConnect = useCallback(async () => {
    try {
      setIsError(false);
      const connector: WebSocketConnector<
        null,
        IAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      > = new WebSocketConnector<
        null,
        IAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      >(null, {
        assistantMessage: (msg) => pushMessageRef.current(msg),
        describe: (msg) => pushMessageRef.current(msg),
        userMessage: (msg) => pushMessageRef.current(msg)
      });
      await connector.connect(import.meta.env.VITE_AGENTICA_WS_URL);
      const driver = connector.getDriver();
      setDriver(driver);
      return connector;
    } catch (e) {
      console.error(e);
      setIsError(true);
      throw e; // 오류를 다시 throw하여 상위에서 처리할 수 있도록 함
    }
  }, []); // 의존성 배열을 비움

  const conversate = useCallback(
    async (message: string) => {
      if (!driver) {
        console.error("Driver is not connected. Please connect to the server.");
        return;
      }
      try {
        await driver.conversate(message);
      } catch (e) {
        console.error(e);
        setIsError(true);
      }
    },
    [driver]
  );

  useEffect(() => {
    let mounted = true;
    let connector: WebSocketConnector<null, IAgenticaRpcListener, IAgenticaRpcService<"chatgpt">> | undefined;

    const connect = async () => {
      try {
        connector = await tryConnect();
      } catch (e) {
        console.error("Connection error:", e);
      }
    };

    if (mounted) {
      connect();
    }

    return () => {
      mounted = false;
      if (connector) {
        connector.close();
        setDriver(undefined);
      }
    };
  }, [tryConnect]);

  const isConnected = !!driver;

  return (
    <AgenticaRpcContext.Provider
      value={{ messages, conversate, isConnected, isError, tryConnect }}
    >
      {children}
    </AgenticaRpcContext.Provider>
  );
}

export function useAgenticaRpc() {
  const context = useContext(AgenticaRpcContext);
  if (!context) {
    throw new Error("useAgenticaRpc must be used within AgenticaRpcProvider");
  }
  return context;
}
