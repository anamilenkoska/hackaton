import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView() {
    useEffect(() => {
        const koperLatLng = [45.5467, 13.7300]
        const map = L.map('map').setView(koperLatLng, 14)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map)

        const parkingSpots = [
            { name: "Vergerijev trg", coords: [45.5491, 13.7301] },
            { name: "Trg Brolo", coords: [45.5485, 13.7305] },
            { name: "Ukmarjev trg", coords: [45.5490, 13.7246] },
            { name: "Northern bypass 3", coords: [45.5493, 13.7329] },
            { name: "Northern bypass 4", coords: [45.5494, 13.7359] },
            { name: "Marketplace inside the barriers", coords: [45.5455, 13.7251] },
            { name: "Behind Banka Koper", coords: [45.5438, 13.7289] },
            { name: "Marketplace outside the barriers", coords: [45.5455, 13.7247] },
            { name: "Olympic pool", coords: [45.5432, 13.7250] },
            { name: "New Health Centre", coords: [45.5396, 13.7319] },
            { name: "Behind Barka", coords: [45.5464, 13.7393] },
            { name: "Ankaranska 5–5c", coords: [45.5457, 13.7411] },
            { name: "Parking garage Belveder", coords: [45.54974541276327, 13.72838322240881] },
            { name: "Zeleni park", coords: [45.5448463989675, 13.727842690325643] },
            { name: "Zunanje parkirisce", coords: [45.54524718171611, 13.727596606030867] },
            { name: "Bonifika", coords: [45.5410849707848, 13.731581585052883] },
            { name: "Planet Koper", coords: [45.54062044165103, 13.735077284557754] },
            {name:"Grafist",coords:[45.5445880121679, 13.73255337827174 ]}
        ];

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

        const MAX_DISTANCE = 1000

        const parkingIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png', // red location pin
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        })

        const highlightedIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
        })

        const userIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64572.png', // small user icon
            iconSize: [25, 25],
            iconAnchor: [12, 25],
            popupAnchor: [0, -25],
        })

        const parkingLayerGroup = L.layerGroup().addTo(map)
        const parkingMarkers = {}

        //add all parking markers
        parkingSpots.forEach(spot => {
            const marker = L.marker(spot.coords, { icon: parkingIcon })
                .addTo(parkingLayerGroup)
                .bindPopup(<b>${spot.name}</b>)
            parkingMarkers[spot.name] = marker
        })

        let userMarker = null
        let userCircle = null

        function getDistance(lat1, lon1, lat2, lon2) {
            const R = 6371000;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }

        const findNearbyParkings = () => {
            map.locate({ setView: true, enableHighAccuracy: true });
        }

        map.on('locationfound', (e) => {
            const userLatLng = e.latlng;
            const accuracyRadius = e.accuracy;

            if (userMarker) map.removeLayer(userMarker);
            if (userCircle) map.removeLayer(userCircle);

            userMarker = L.marker(userLatLng,{icon:userIcon}).addTo(map).bindPopup("You are here").openPopup();
            userCircle = L.circle(userLatLng, accuracyRadius, {
                color: 'blue',
                fillColor: '#30f',
                fillOpacity: 0.2
            }).addTo(map);

            let found = false;

            parkingSpots.forEach(spot => {
                const dist = getDistance(
                    userLatLng.lat, userLatLng.lng,
                    spot.coords[0], spot.coords[1]
                );

                const marker = parkingMarkers[spot.name];

                if (dist <= MAX_DISTANCE) {
                    found = true;
                    marker.setIcon(highlightedIcon);
                    marker.setPopupContent(`<b>${spot.name}</b><br>${Math.round(dist)} meters away`);
                } else {
                    marker.setIcon(parkingIcon);
                    marker.setPopupContent(`<b>${spot.name}</b>`);
                }
            });

            if (!found) {
                alert("No parking spots found within 1000 meters.");
            }
        });

        map.on('locationerror', () => {
            alert("Unable to retrieve your location. Please allow location access.");
        });

        // Attach button click
        const button = document.getElementById('findNearbyParkings');
        if (button) button.onclick = findNearbyParkings;

        // Cleanup
        return () => {
            map.remove();
        }

    }, [])

    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Nearby parking in Koper</h2>
            <div id="controls" style={{ textAlign: "center", margin: "10px" }}>
                <button id="findNearbyParkings">Find nearby parking</button>
            </div>
            <div id="map" style={{ height: "90vh", width: "100%" }}></div>
        </div>
    )
}

export default MapView
