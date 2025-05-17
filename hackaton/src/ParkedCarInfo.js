import React, { useState, useEffect, useRef } from 'react';
import MapView from './MapView';
import WebSocketNotification from './WebSocketNotification';

function ParkedCarInfo({ onSessionEnd }) {
  const [arrivalTime, setArrivalTime] = useState('');
  const [minutesToStay, setMinutesToStay] = useState(60);
  const [leaveTime, setLeaveTime] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const timerIdRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:3001');

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const now = new Date();
    setArrivalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateLeaveTime(minutesToStay);
  }, []);

  const updateLeaveTime = (mins) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + parseInt(mins));
    const leave = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLeaveTime(leave);
  };

  const handleMinutesChange = (e) => {
    const value = parseInt(e.target.value);
    setMinutesToStay(value);
    updateLeaveTime(value);
  };

  const handleConfirm = () => {
    setShowForm(false);
    setSecondsLeft(minutesToStay * 60);
  };

  useEffect(() => {
    if (!showForm && secondsLeft > 0) {
      timerIdRef.current = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && !showForm && !sessionEnded) {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: 'spotAvailable', message: 'A parking spot is now available!' })
        );
      }
      setSessionEnded(true); // Show popup
    }

    return () => clearTimeout(timerIdRef.current);
  }, [secondsLeft, showForm, sessionEnded]);

  const handleEndSessionConfirm = () => {
  if (secondsLeft === 0 && socketRef.current?.readyState === WebSocket.OPEN) {
  const message = {
    type: 'spotAvailable',
    text: 'A parking spot is now available!',
    sender: CLIENT_ID
  };
  socketRef.current.send(JSON.stringify(message));
}


  if (typeof onSessionEnd === 'function') {
    onSessionEnd(); // return to map
  }
};

const CLIENT_ID = Math.random().toString(36).substring(2, 15);


  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
  };

  if (showForm) {
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg p-4 w-80">
        <h2 className="text-xl font-semibold mb-3 text-center">Parked Car Info</h2>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Time of Arrival</label>
          <input type="text" value={arrivalTime} disabled className="w-full px-3 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700" />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Stay Duration</label>
          <select value={minutesToStay} onChange={handleMinutesChange} className="w-full py-2 px-3 border rounded bg-white">
            {[1, 5, 10, 15, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720].map((min) => (
              <option key={min} value={min}>
                {min >= 60 ? `${min / 60} hour${min >= 120 ? 's' : ''}` : `${min} minute${min > 1 ? 's' : ''}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Expected Leave Time</label>
          <input type="text" value={leaveTime} disabled className="w-full px-3 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700" />
        </div>

        <button onClick={handleConfirm} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">
          OK
        </button>
      </div>
    );
  }

  if (sessionEnded) {
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg p-5 w-80 text-center">
        <h2 className="text-lg font-semibold mb-2">Parking Session Ended</h2>
        <p className="mb-4">Thank you! Availability increased by 1.</p>
        <button onClick={handleEndSessionConfirm} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          OK
        </button>
        <MapView/>

      </div>
    );
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg p-3 w-48 text-center">
      <p className="text-lg font-medium">Parking session active</p>
      <p className="text-2xl font-bold mt-2">{formatTimer(secondsLeft)}</p>
    </div>
  );
}

export default ParkedCarInfo;
