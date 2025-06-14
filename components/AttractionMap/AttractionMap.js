import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import { useEffect } from 'react';
import styles from './AttractionMap.module.css';

// Gold icon for user location
const goldIcon = new L.Icon({
  iconUrl: '/leaflet/images/marker-icon-2x-gold.png',
  iconRetinaUrl: '/leaflet/images/marker-icon-gold.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ChangeView({ center, bounds }) {
  const map = useMap();
  useEffect(() => {
    bounds ? map.fitBounds(bounds, { padding: [50, 50] }) : map.setView(center, 13);
  }, [center, bounds, map]);
  return null;
}

export default function AttractionMap({ results, hoveredId, userLocation }) {
  if (!results?.length) return null;

  const valid = results.filter(r => typeof r.lat === 'number' && typeof r.lon === 'number');
  if (!valid.length) return null;

  const center = userLocation ? [userLocation.lat, userLocation.lon] : [valid[0].lat, valid[0].lon];
  const bounds = L.latLngBounds(valid.map(r => [r.lat, r.lon]));

  return (
      <div className={styles.mapContainer}>
        <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <ChangeView center={center} bounds={bounds} />
          <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {userLocation && <Marker position={center} icon={goldIcon}><Popup>Your Location</Popup></Marker>}

          {valid.map(item => (
              <Marker key={item.id} position={[item.lat, item.lon]}>
                <Popup><strong>{item.name}</strong></Popup>
              </Marker>
          ))}
        </MapContainer>
      </div>
  );
}