package com.points.coords_api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
  
  @NotBlank
  @Column(nullable = false)
  private String name;

  @NotNull
  @DecimalMin("-90")
  @DecimalMax("90")
  @Column(nullable = false)
  private Double latitude;

  @NotNull
  @DecimalMin("-180")
  @DecimalMax("180")
  @Column(nullable = false)
  private Double longitude;

  @Column(name = "created_at")
  private LocalDateTime createdAt = LocalDateTime.now();
}
