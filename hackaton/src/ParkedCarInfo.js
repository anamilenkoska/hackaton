import React, {useState,useEffect} from 'react';

function ParkedCarInfo(){
    const [arrivalTime, setArrivalTime] = useState('');
  const [hoursToStay, setHoursToStay] = useState(1);
  const [leaveTime, setLeaveTime] = useState('');

  useEffect(() => {
    const now = new Date();
    setArrivalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateLeaveTime(1); // default to 1 hour
  }, []);

  const updateLeaveTime = (hours) => {
    const now = new Date();
    now.setHours(now.getHours() + parseInt(hours));
    const leave = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLeaveTime(leave);
  };

  const handleHoursChange = (e) => {
    const value = e.target.value;
    setHoursToStay(value);
    updateLeaveTime(value);
  };

  const handlePayment = () => {
    window.location.href = 'https://buy.stripe.com/test_a1b2c3';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Parked Car Info</h2>

        {/* Arrival Time */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Time of Arrival</label>
          <input
            type="text"
            value={arrivalTime}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700"
          />
        </div>

        {/* Hour Selector */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Stay Duration</label>
          <select
            value={hoursToStay}
            onChange={handleHoursChange}
            className="w-full text-3xl text-center py-4 px-2 border rounded-xl bg-white shadow-sm"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <option key={h} value={h}>
                {h} hour{h > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Leave Time */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Expected Leave Time</label>
          <input
            type="text"
            value={leaveTime}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-700"
          />
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-xl font-semibold transition"
        >
          Pay with Card
        </button>
      </div>
    </div>
  );
}

export default ParkedCarInfo