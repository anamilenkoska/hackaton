import MapView from './MapView';
import { BrowserRouter as Router,Routes,Route } from 'react-router';
import ParkedCarinfo from './ParkedCarinfo';
import WebSocketNotification from './WebSocketNotification';

function App() {
  return(
    <Router>
      <div>
        <WebSocketNotification />

        <Routes>
          <Route path="/" element={<MapView />} />
          <Route path="/park" element={<ParkedCarinfo />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
