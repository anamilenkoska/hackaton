import React, { useEffect, useRef, useState } from 'react';
import MapView from './MapView';

function App() {
  // const ws = useRef(null);
  // const [messages, setMessages] = useState([]);
  // const [connected, setConnected] = useState(false);

  // useEffect(() => {
  //   ws.current = new WebSocket('ws://localhost:3001');

  //   ws.current.onopen = () => {
  //     console.log("WebSocket connected");
  //     setConnected(true);
  //   };

  //   ws.current.onmessage = (event) => {
  //     if (typeof event.data === 'string') {
  //       const text = event.data;
  //       setMessages(prev => [...prev, text]);

  //       const utterance = new SpeechSynthesisUtterance(text);
  //       window.speechSynthesis.speak(utterance);

  //     } else if (event.data instanceof Blob) {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const text = reader.result;
  //         setMessages(prev => [...prev, text]);

  //         const utterance = new SpeechSynthesisUtterance(text);
  //         window.speechSynthesis.speak(utterance);
  //       };
  //       reader.readAsText(event.data);
  //     } else {
  //       console.warn("Unknown WebSocket message type", event.data);
  //     }
  //   };

  //   ws.current.onclose = () => {
  //     console.log("WebSocket disconnected");
  //     setConnected(false);
  //   };

  //   ws.current.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   return () => {
  //     if (ws.current) ws.current.close();
  //   };
  // }, []);

  // const sendNotification = () => {
  //   const text = "No more spots available";
  //   if (ws.current && ws.current.readyState === WebSocket.OPEN) {
  //     ws.current.send(text);
  //     setMessages(prev => [...prev, `You: ${text}`]);
  //   } else {
  //     console.warn("WebSocket is not connected yet.");
  //   }
  // };

  // return (
  //   <div>
  //     <h3>Real-time Notifications</h3>
  //     <button onClick={sendNotification} disabled={!connected}>
  //       Send Alert
  //     </button>
  //     {!connected && <p>Connecting to server...</p>}
  //     <ul>
  //       {messages.map((msg, i) => (
  //         <li key={i}>{msg}</li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  return(
    <div>
      <MapView />
    </div>
  )
}

export default App;
