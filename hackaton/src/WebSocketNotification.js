import React, { useEffect, useRef, useState } from 'react';

function WebSocketNotification() {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onmessage = (event) => {
      const text = event.data;
      setMessages(prev => [...prev, text]);

      // Text-to-Speech
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };

    return () => ws.current.close();
  }, []);

  const sendNotification = () => {
  const text = "User A says hello!";

  if (ws.current && ws.current.readyState === WebSocket.OPEN) {
    ws.current.send(text);
    setMessages(prev => [...prev, `You: ${text}`]);
  } else {
    console.warn("WebSocket not connected yet.");
  }
};


  return (
    <div>
      <h3>Real-time Notifications</h3>
      <button onClick={sendNotification}>Send Alert</button>
      <ul>
        {messages.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
    </div>
  );
}

export default WebSocketNotification;
