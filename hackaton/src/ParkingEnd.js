import React, { use, useEffect, useState } from 'react';
import SessionPopup from './SessionPopup.js'

function ParkingEnd() {
    const [showPopup, setShowPopup] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)
    const [timerActive, setTimerActive] = useState(false)

    const startSession = (minutes) => {
        setTimeLeft(minutes * 60)
        setTimerActive(true)
    }

    useEffect(() => {
        if (!timerActive) return

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setShowPopup(true);
                    setTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // Cleanup
    }, [timerActive]);


    const end = () => {
        onFreeSpot(parkingId)
        setShowPopup(false)
    }

    const extend = () => {
        setTimeLeft(15 * 60)
        setTimerActive(true)
        setShowPopup(false)
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    return (
        // <>
        //     {showPopup && (
        //         <SessionPopup onEnd={end} onExtend={extend} />
        //     )}
        //     <p style={{ textAlign: 'center' }}>Parking session end:{endSessionCount}</p>
        // </>
        <div style={{ textAlign: 'center', marginTop: '1em' }}>
            <button onClick={() => startSession(0.1)}>Start Parking Session</button> {/* 6 sec for demo */}
            {timerActive && <p>Time left: {formatTime(timeLeft)}</p>}
            {showPopup && <SessionPopup onEnd={handleEnd} onExtend={handleExtend} />}
        </div>
    )
}

export default ParkingEnd