import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

const goldIcon = new L.Icon({
  iconUrl: '/leaflet/images/marker-icon-2x-gold.png',
  iconRetinaUrl: '/leaflet/images/marker-icon-gold.png',
  shadowUrl: '/leaflet/images/marker-shadow.png', // use default shadow
  iconSize: [25, 41], // default Leaflet icon size
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], 
  shadowSize: [41, 41],
});


function ChangeView({ center, zoom, bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, bounds, map]);

  return null;
}

export default function AttractionsMap({ results=[], userLocation }) {
  const center = userLocation || [43.65107, -79.347015]; // fallback coords (Toronto)
  const zoom = 13;

  // Filter only valid coordinates
  const validResults = Array.isArray(results)
  ? results.filter((r) => typeof r.lat === 'number' && typeof r.lon === 'number')
  : [];


  const bounds = validResults.length
    ? L.latLngBounds(validResults.map((r) => [r.lat, r.lon]))
    : null;

    return (
    <MapContainer style={{ height: '400px', width: '100%' }} center={center} zoom={zoom} scrollWheelZoom={true}>
      <ChangeView center={center} zoom={zoom} bounds={bounds} />
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Location Marker */}
      {userLocation && (
        <Marker position={userLocation} icon={goldIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Attraction Markers */}
      {validResults.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lon]}>
          <Popup>
            <strong>{place.name}</strong><br />
            {place.address && <>Address: {place.address}<br /></>}
            {place.description && <p style={{ margin: 0 }}>{place.description}</p>}
            {place.url && (
              <p style={{ marginTop: 5 }}>
                <a href={place.url} target="_blank" rel="noopener noreferrer">More info</a>
              </p>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
