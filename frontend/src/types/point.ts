export interface Point {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface DistanceResponse {
  distance: number;
  unit: string;
}