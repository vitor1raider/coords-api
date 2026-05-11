package com.points.coords_api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
@Entity
@Table(name = "points")
public class Point {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(nullable = false)
  private String name;

  @Min(-90)
  @Max(90)
  @Column(nullable = false)
  private Double latitude;

  @Min(-180)
  @Max(180)
  @Column(nullable = false)
  private Double longitude;

  @Column(name = "created_at")
  private LocalDateTime createdAt = LocalDateTime.now();
}
