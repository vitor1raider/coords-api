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
import { useEffect } from "react";
import { calculateDistance } from "../../services/api";

interface MapProps {
  points: Point[];
  onMapClick?: (latitude: number, longitude: number) => void;
  selectedPoints: number[];
  onSelectPoint: (id: number) => void;
  onClearSelection: () => void;
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
  onClearSelection,
}: MapProps) {
  useEffect(() => {
    const fetchDistance = async () => {
      if (selectedPoints.length === 2) {
        const point1 = points.find((p) => p.id === selectedPoints[0]);
        const point2 = points.find((p) => p.id === selectedPoints[1]);

        if (point1 && point2) {
          const distance = await calculateDistance(point1.id, point2.id);
          alert(
            `Distância entre ${point1.name} e ${point2.name}: ${distance} km`,
          );
          onClearSelection();
        }
      }
    };
    fetchDistance();
  }, [selectedPoints, points, onClearSelection]);

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
