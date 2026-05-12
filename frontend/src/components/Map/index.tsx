import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Point } from "../../types/point";
import { useMapEvents } from "react-leaflet";

interface MapProps {
  points: Point[];
  onMapClick?: (latitude: number, longitude: number) => void;
  selectedPoints: number[];
  onSelectPoint: (id: number) => void;
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

export function Map({
  points,
  onMapClick,
  selectedPoints,
  onSelectPoint,
}: MapProps) {
  return (
    <MapContainer
      center={[-27.09, -48.91]}
      zoom={8}
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
      <Polyline
        positions={selectedPoints
          .map((id) => points.find((p) => p.id === id))
          .filter(Boolean)
          .map((p) => [p!.latitude, p!.longitude])}
        color="#3b82f6"
        weight={3}
        opacity={1}
        dashArray="5, 5"
      />
      <MapClickHandler onMapClick={onMapClick} />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          eventHandlers={{
            click: () => onSelectPoint(point.id),
          }}
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
