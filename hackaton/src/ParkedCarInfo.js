import { useState, useEffect, useRef } from 'react';
import MapView from './MapView';
import ReportCard from './ReportCard';
import './ParkedcarInfo.css';

function ParkedCarInfo({ onSessionEnd }) {
  const [arrivalTime, setArrivalTime] = useState('');
  const [minutesToStay, setMinutesToStay] = useState(60);
  const [leaveTime, setLeaveTime] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);
  const timerIdRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:3001');

    socketRef.current.onopen = () => console.log('WebSocket connected');
    socketRef.current.onclose = () => console.log('WebSocket disconnected');

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const now = new Date();
    setArrivalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateLeaveTime(minutesToStay);
  }, [minutesToStay]);

  const updateLeaveTime = (mins) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + parseInt(mins));
    setLeaveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleMinutesChange = (e) => {
    const value = parseInt(e.target.value);
    setMinutesToStay(value);
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
      }
      setSessionEnded(true);
    }

    return () => clearTimeout(timerIdRef.current);
  }, [secondsLeft, showForm, sessionEnded]);

  const handleReportSubmit = (reportData) => {
    console.log('Report submitted:', reportData);
    setShowReportCard(false);
  };

  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
  };

  if (showReportCard) {
    return (
      <ReportCard
        onSubmit={handleReportSubmit}
        onCancel={() => setShowReportCard(false)}
      />
    );
  }

  if (showForm) {
    return (
      <div className="container">
        <div className="card">
          <h2>Parked Car Info</h2>

          <div>
            <label>Time of Arrival</label>
            <input type="text" value={arrivalTime} disabled className="input" />
          </div>

          <div>
            <label>Stay Duration</label>
            <select value={minutesToStay} onChange={handleMinutesChange} className="input">
              {[1, 5, 10, 15, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720].map((min) => (
                <option key={min} value={min}>
                  {min >= 60 ? `${min / 60} hour${min >= 120 ? 's' : ''}` : `${min} minute${min > 1 ? 's' : ''}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Expected Leave Time</label>
            <input type="text" value={leaveTime} disabled className="input" />
          </div>

          <div className="buttons">
            <button className="pay" onClick={handleConfirm}>Confirm</button>
          </div>

          <div
            className="report-issue-container"
            onClick={() => setShowReportCard(true)}
            style={{ cursor: 'pointer' }}
          >
            <span className="report-issue-text">Report Issue</span>
            <span className="report-issue-icon">⚠️</span>
          </div>
        </div>
      </div>
    );
  }

  if (sessionEnded) {
    return (
      <div>
        <div>
        <p style={{ marginTop: '10px', textAlign: 'center', color: '#4a6b8a',fontWeight: 'bold'  }}>Thank you! Availability increased.</p>
          <div>
            <MapView/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card text-center">
        <p>Parking session active</p>
        <p className="timer">{formatTimer(secondsLeft)}</p>
      </div>
    </div>
  );
}

export default ParkedCarInfo;