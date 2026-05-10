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
}
