import React, { useEffect, useRef, useState } from 'react';

function WebSocketNotification() {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);

  const CLIENT_ID = Math.random().toString(36).substring(2, 15);


  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.current.onmessage = (event) => {
      const text = event.data;

      setMessages((prev) => [...prev, text]);

      // Text-to-Speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Optional: ensure correct accent
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-xl z-50">
      <h3 className="font-semibold mb-2">Real-time Notifications</h3>
      <ul className="text-sm max-h-48 overflow-y-auto">
        {messages.map((msg, i) => (
          <li key={i} className="mb-1">🔔 {msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default WebSocketNotification;