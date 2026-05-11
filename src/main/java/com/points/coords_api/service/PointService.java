package com.points.coords_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.points.coords_api.model.Point;
import com.points.coords_api.repository.PointRepository;

@Service
public class PointService {
  private final PointRepository pointRepository;

  public PointService(PointRepository pointRepository) {
    this.pointRepository = pointRepository;
  }

  public List<Point> getAllPoints() {
    return pointRepository.findAll();
  }

  public Point createPoint(Point point) {
    if (point.getName() == null) {
      throw new IllegalArgumentException("Nome é obrigatório");
    }
    if (point.getLatitude() == null || point.getLatitude() < -90 || point.getLatitude() > 90) {
      throw new IllegalArgumentException("Latitude deve estar entre -90 e 90");
    }
    if (point.getLongitude() == null || point.getLongitude() < -180 || point.getLongitude() > 180) {
      throw new IllegalArgumentException("Longitude deve estar entre -180 e 180");
    }
    return pointRepository.save(point);
  }

  public Point getById(Long id) {
    return pointRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Ponto não encontrado"));
  }

  public record Distance(double value, String unit) {
    @Override
    public String toString() {
        return value + " " + unit;
    }
  }

  public Distance calculateDistance(Point a, Point b) {
    final int EARTH_RADIUS_KM = 6371;

    double latA = Math.toRadians(a.getLatitude());
    double latB = Math.toRadians(b.getLatitude());
    double deltaLat = Math.toRadians(b.getLatitude() - a.getLatitude());
    double deltaLon = Math.toRadians(b.getLongitude() - a.getLongitude());

    double h = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
      + Math.cos(latA) * Math.cos(latB)
      * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    double c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

    return new Distance(Math.round(EARTH_RADIUS_KM * c * 100.0) / 100.0, "km");
  }

  public void deletePoint(Long id) {
    if (!pointRepository.existsById(id)) {
      throw new IllegalArgumentException("Ponto não encontrado");
    }
    pointRepository.deleteById(id);
  }

  public List<Point> searchByName(String name) {
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("Nome é obrigatório");
    }
    return pointRepository.findByName(name);
  }
}
