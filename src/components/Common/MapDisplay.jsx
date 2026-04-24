import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map centering when position changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
}

const MapDisplay = ({ position, markerText, zoom = 13, height = "300px", interactive = true }) => {
  const defaultPosition = [24.8607, 67.0011]; // Karachi
  const currentPosition = position || defaultPosition;

  return (
    <div style={{ height, width: "100%", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer 
        center={currentPosition} 
        zoom={zoom} 
        scrollWheelZoom={interactive}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={currentPosition} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={currentPosition}>
          {markerText && <Popup>{markerText}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
