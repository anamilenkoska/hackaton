import { useEffect,useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useNavigate} from 'react-router';


function MapView() {
    const navigate=useNavigate()
      const [availableSpots, setAvailableSpots] = useState(10);

    const parkingSpots = [
        { name: "Vergerijev trg", coords: [45.5491, 13.7301], capacity: 20, occupied: 19, price: 1 },
        { name: "Trg Brolo", coords: [45.5485, 13.7305], capacity: 20, occupied: 20, price: 1 },
        { name: "Ukmarjev trg", coords: [45.5490, 13.7246], capacity: 20, occupied: 10, price: 1 },
        { name: "Northern bypass 3", coords: [45.5493, 13.7329], capacity: 20, occupied: 4, price: 1 },
        { name: "Northern bypass 4", coords: [45.5494, 13.7359], capacity: 20, occupied: 4, price: 1 },
        { name: "Marketplace inside the barriers", coords: [45.5455, 13.7251], capacity: 20, occupied: 4, price: 1 },
        { name: "Behind Banka Koper", coords: [45.5438, 13.7289], capacity: 20, occupied: 4, price: 1 },
        { name: "Marketplace outside the barriers", coords: [45.5455, 13.7247], capacity: 20, occupied: 4, price: 1 },
        { name: "Olympic pool", coords: [45.5432, 13.7250], capacity: 20, occupied: 4, price: 1 },
        { name: "New Health Centre", coords: [45.5396, 13.7319], capacity: 20, occupied: 4, price: 1 },
        { name: "Behind Barka", coords: [45.5464, 13.7393], capacity: 20, occupied: 4, price: 1 },
        { name: "Ankaranska 5–5c", coords: [45.5457, 13.7411], capacity: 20, occupied: 4, price: 1 },
        { name: "Parking garage Belveder", coords: [45.54974541276327, 13.72838322240881], capacity: 20, occupied: 4, price: 1 },
        { name: "Zeleni park", coords: [45.5448463989675, 13.727842690325643], capacity: 20, occupied: 4, price: 1 },
        { name: "Zunanje parkirisce", coords: [45.54524718171611, 13.727596606030867], capacity: 20, occupied: 4, price: 1 },
        { name: "Bonifika", coords: [45.5410849707848, 13.731581585052883], capacity: 20, occupied: 4, price: 1 },
        { name: "Planet Koper", coords: [45.54062044165103, 13.735077284557754], capacity: 20, occupied: 4, price: 1 },
        { name: "Grafist", coords: [45.5445880121679, 13.73255337827174], capacity: 20, occupied: 4, price: 1 }
    ];

    const parkingMarkers = {};
    const activeTimers = {};

    function getColorIcon(ratio) {
        let color = "green";
        if (ratio === 0) color = "red";
        else if (ratio <= 0.5) color = "yellow";

        return L.icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            shadowSize: [41, 41]
        });
    }

    function updateMarkerVisuals(spot, countdownSeconds) {
        const ratio = (spot.capacity - spot.occupied) / spot.capacity;
        const icon = getColorIcon(ratio);
        const marker = parkingMarkers[spot.name];

        let content = `<b>${spot.name}</b><br>
      ${spot.capacity - spot.occupied} / ${spot.capacity} spots available<br>
      ${spot.price} euro/h`;

        if (countdownSeconds !== undefined) {
            content += `<br><i>Reserved: ${countdownSeconds}s left</i>`;
        }

        content += `<br><button onclick="window.reserveSpot('${spot.name}')">Reserve</button>`;

        marker.setIcon(icon);
        marker.setPopupContent(content);
    }

    function createTimer({ durationMs, onTick, onComplete }) {
        let remaining = durationMs;
        let timerId = null;

        const tick = () => {
            remaining -= 1000;
            if (onTick) onTick(remaining);
            if (remaining <= 0) {
                clearInterval(timerId);
                if (onComplete) onComplete();
            }
        };

        const start = () => {
            if (!timerId) {
                timerId = setInterval(tick, 1000);
            }
        };

        return { start };
    }

    function reserveSpot(spotName) {
        const spot = parkingSpots.find(s => s.name === spotName);
        if (!spot || activeTimers[spotName]) return;

        if (spot.occupied >= spot.capacity) {
            alert("No spots available to reserve.");
            return;
        }

        spot.occupied += 1;
        updateMarkerVisuals(spot);
        alert(`You reserved ${spotName} for 5 minutes.`);

        const timer = createTimer({
            durationMs: 0.5 * 60 * 1000,
            onTick: (msLeft) => {
                updateMarkerVisuals(spot, Math.floor(msLeft / 1000));
            },
            onComplete: () => {
                askArrivalConfirmation(spotName);
            }
        });

        timer.start();
        activeTimers[spotName] = timer;
    }
    window.reserveSpot = reserveSpot;

//     function showArrivalConfirmation(spotName) {
//         const spot = parkingSpots.find(s => s.name === spotName);
//         const marker = parkingMarkers[spotName];

//         const popupContent = `
//       <b>${spot.name}</b><br>
//       Reservation time ended.<br>
//       <strong>Did you arrive?</strong><br>
//       <button onclick="window.confirmArrival('${spotName}')">Yes</button>
//       <button onclick="window.rejectArrival('${spotName}')">No</button>
//     `;
//         marker.setPopupContent(popupContent).openPopup();
//     }

//     function confirmArrival(spotName) {
//         const spot = parkingSpots.find(s => s.name === spotName);
//         if (!spot) return;
//         updateMarkerVisuals(spot);
//         delete activeTimers[spotName];
//         alert(`${spotName}: Your arrival has been confirmed.`);
//     }
//     //window.confirmArrival = confirmArrival;
//     window.confirmArrival = (spotName) => {
//     const spot = parkingSpots.find(s => s.name === spotName);
//     if (!spot) return;
//     updateMarkerVisuals(spot);
//     delete activeTimers[spotName];
//     alert(`${spotName}: Your arrival has been confirmed.`);
//     navigate('/park'); // <- Add navigation here
// };

function askArrivalConfirmation(spotName) {
    const confirmed = window.confirm("Your reservation time ended. Proceed to parking?");
    if (confirmed) {
      // User confirmed arrival: navigate immediately without popup
      const spot = parkingSpots.find(s => s.name === spotName);
      if (spot) {
        // Just update visuals and clear timer
        updateMarkerVisuals(spot);
        delete activeTimers[spotName];
        navigate('/park');
      }
    } else {
      // User rejected arrival: release spot and update marker
      rejectArrival(spotName);
    }
  }

    function rejectArrival(spotName) {
        const spot = parkingSpots.find(s => s.name === spotName);
        if (!spot) return;
        spot.occupied -= 1;
        updateMarkerVisuals(spot);
        delete activeTimers[spotName];
        alert(`${spotName}: Reservation expired. Spot released.`);
    }
    window.rejectArrival = rejectArrival;

    useEffect(() => {
        const koperLatLng = [45.5467, 13.7300];
        const map = L.map('map').setView(koperLatLng, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const MAX_DISTANCE = 500;

        const userIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64572.png',
            iconSize: [25, 25],
            iconAnchor: [12, 25],
            popupAnchor: [0, -25],
        });

        const parkingLayerGroup = L.layerGroup().addTo(map);

        parkingSpots.forEach(spot => {
            const ratio = (spot.capacity - spot.occupied) / spot.capacity;
            const icon = getColorIcon(ratio);

            const marker = L.marker(spot.coords, { icon }).addTo(parkingLayerGroup);
            marker.bindPopup(`<b>${spot.name}</b><br>${spot.capacity - spot.occupied} / ${spot.capacity} spots available`);
            parkingMarkers[spot.name] = marker;
        });

        let userMarker = null;
        let userCircle = null;

        const getDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371000;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        const findNearbyParkings = () => {
            map.locate({ setView: true, enableHighAccuracy: true });
        };

        map.on('locationfound', (e) => {
            const userLatLng = e.latlng;
            const accuracyRadius = e.accuracy;

            if (userMarker) map.removeLayer(userMarker);
            if (userCircle) map.removeLayer(userCircle);

            userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map).bindPopup("You are here").openPopup();
            userCircle = L.circle(userLatLng, accuracyRadius, {
                color: 'blue',
                fillColor: '#30f',
                fillOpacity: 0.2
            }).addTo(map);

            let found = false;

            parkingSpots.forEach(spot => {
                const dist = getDistance(userLatLng.lat, userLatLng.lng, spot.coords[0], spot.coords[1]);
                const marker = parkingMarkers[spot.name];
                const ratio = (spot.capacity - spot.occupied) / spot.capacity;
                const icon = getColorIcon(ratio);

                marker.setIcon(icon);

                if (dist <= MAX_DISTANCE) {
                    found = true;
                    marker.setPopupContent(
                        `<b>${spot.name}</b><br>
            ${spot.capacity - spot.occupied} / ${spot.capacity} spots available<br>
            ${Math.round(dist)} meters away<br>
            ${spot.price} euro/h<br>
            <button onclick="window.reserveSpot('${spot.name}')">Reserve</button>`
                    );
                } else {
                    marker.setPopupContent(
                        `<b>${spot.name}</b><br>
            ${spot.capacity - spot.occupied} / ${spot.capacity} spots available`
                    );
                }
            });

            if (!found) alert("No parking spots found within 1000 meters.");
        });

        map.on('locationerror', () => {
            alert("Unable to retrieve your location. Please allow location access.");
        });

        const button = document.getElementById('findNearbyParkings');
        if (button) button.onclick = findNearbyParkings;

    return () => {
        map.remove();
    }
    }, []);

    return (
        
        <div>
            <h2 style={{ textAlign: "center" }}>Nearby parking in Koper</h2>
            <div id="controls" style={{ textAlign: "center", margin: "10px" }}>
                <button id="findNearbyParkings">Find nearby parking</button>
            </div>
            <div id="map" style={{ height: "90vh", width: "100%" }}></div>
        </div>
    );
}

export default MapView;
