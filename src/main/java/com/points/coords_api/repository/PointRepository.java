package com.points.coords_api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.points.coords_api.model.Point;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
  Optional<Point> findByName(String name);
}
