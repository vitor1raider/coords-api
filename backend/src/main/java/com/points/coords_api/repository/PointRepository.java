package com.points.coords_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.points.coords_api.model.Point;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
  List<Point> findByName(String name);
}
