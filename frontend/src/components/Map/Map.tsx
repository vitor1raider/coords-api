import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Point } from "../../types/point";
import { useMapEvents } from "react-leaflet";

interface MapProps {
  points: Point[];
  onMapClick?: (latitude: number, longitude: number) => void;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick?: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click: (event) => {
      onMapClick?.(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export function Map({ points, onMapClick }: MapProps) {
  return (
    <MapContainer
      center={[-15.78, -47.93]}
      zoom={5}
      minZoom={2}
      maxZoom={18}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={1.0}
      className="w-full h-full rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        noWrap={true}
        bounds={[
          [-90, -180],
          [90, 180],
        ]}
      />
      <MapClickHandler onMapClick={onMapClick} />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
