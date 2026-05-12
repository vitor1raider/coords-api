import axios from "axios";
import type { Point } from "../types/point";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

export const createPoint = async (point: Omit<Point, "id" | "createdAt">) => {
  await api.post("/pontos", point);
};

export const fetchPoints = async (): Promise<Point[]> => {
  return await api.get<Point[]>("/pontos").then((res) => res.data);
};

export const searchByName = async (name: string): Promise<Point[]> => {
  return await api.get<Point[]>(`/pontos/busca?nome=${(name)}`).then(
    (res) => res.data
  );
}

export const deletePoint = async (id: number) => {
  await api.delete(`/pontos/${id}`);
}

export const calculateDistance = async (id1: number, id2: number) => {
  return await api.get<{ distance: number }>(`/pontos/distancia?id1=${id1}&id2=${id2}`).then(
    (res) => res.data.distance
  );
}