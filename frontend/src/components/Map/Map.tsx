import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function Map() {
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
    </MapContainer>
  );
}
