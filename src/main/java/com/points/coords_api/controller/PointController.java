package com.points.coords_api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.points.coords_api.model.Point;
import com.points.coords_api.service.PointService;

@RestController
@RequestMapping("/pontos")
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

  @GetMapping("/{id}")
  public Point getPoint(@PathVariable Long id) {
    return pointService.getById(id);
  }

  @GetMapping("/distancia")
  public double calculateDistance(@RequestParam Long id1, @RequestParam Long id2) {
    Point pointA = pointService.getById(id1);
    Point pointB = pointService.getById(id2);
    return pointService.calculateDistance(pointA, pointB);
  }

  @DeleteMapping("/{id}")
  public void deletePoint(@PathVariable Long id) {
    pointService.deletePoint(id);
  }

  @GetMapping("/busca")
  public List<Point> searchByName(@RequestParam("nome") String name) {
    return pointService.searchByName(name);
  }
}
