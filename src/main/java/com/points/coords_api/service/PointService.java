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
    return pointRepository.save(point);
  }
}
