package com.points.coords_api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.points.coords_api.model.Point;
import com.points.coords_api.service.PointService;

@RestController
@RequestMapping("/api/points")
public class PointController {
  private final PointService pointService;
  
  public PointController(PointService pointService) {
    this.pointService = pointService;
  }

  @GetMapping
  public List<Point> getAllPoints() {
    return pointService.getAllPoints();
  }

  @PostMapping
  public Point createPoint(@RequestBody Point point) {
    return pointService.createPoint(point);
  }
}
