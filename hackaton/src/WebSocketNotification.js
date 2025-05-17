import React, { useEffect, useRef, useState } from 'react';

function WebSocketNotification() {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);

  // Unique ID for this client session
  const CLIENT_ID = React.useMemo(() => Math.random().toString(36).substring(2, 15), []);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.current.send(JSON.stringify({ type: 'register', clientId: CLIENT_ID }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.targetClientId === CLIENT_ID) {
          const text = data.message;

          setMessages((prev) => [...prev, text]);

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.pitch = 1.0;
          utterance.rate = 1.0;
          utterance.volume = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.error("Invalid message format", err);
      }
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [CLIENT_ID]);

  // Remove message on OK click
  function handleOkClick(index) {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-xl z-50 max-w-xs">
      <h3 className="font-semibold mb-2">Real-time Notifications</h3>
      <ul className="text-sm max-h-48 overflow-y-auto">
        {messages.map((msg, i) => (
  <li key={i} className="mb-3 border-b pb-2">
    <div>🔔 {msg}</div>
    {/* Remove this button */}
    {/* <button
      onClick={() => handleOkClick(i)}
      className="mt-1 px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
    >
      OK
    </button> */}
  </li>
))}

      </ul>
    </div>
  );
}

export default WebSocketNotification;
