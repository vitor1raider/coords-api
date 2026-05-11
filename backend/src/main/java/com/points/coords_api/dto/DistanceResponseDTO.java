package com.points.coords_api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DistanceResponseDTO {
  private Double distance;
  private String unit;

  public DistanceResponseDTO(Double distance, String unit) {
    this.distance = distance;
    this.unit = unit;
  }
}