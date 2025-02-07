import { useEffect, useRef } from "react";

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => console.log("WebSocket Connected");
      ws.current.onmessage = (event) => console.log("Message:", event.data);
      ws.current.onclose = () => console.log("WebSocket Disconnected");
    }
  }, [url]);

  return ws;
};