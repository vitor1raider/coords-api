package com.points.coords_api.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.points.coords_api.dto.DistanceResponseDTO;
import com.points.coords_api.model.Point;
import com.points.coords_api.service.PointService;

@ExtendWith(MockitoExtension.class)
public class PointControllerTest {
  @Mock
  private PointService pointService;

  @InjectMocks
  private PointController pointController;

  @Test
  @DisplayName("Should return distance with unit")
  void shouldReturnDistanceWithUnit() {
    Point pointA = new Point();
    pointA.setLatitude(-27.15);
    pointA.setLongitude(-48.89);

    Point pointB = new Point();
    pointB.setLatitude(-22.90);
    pointB.setLongitude(-43.20);

    when(pointService.getById(1L)).thenReturn(pointA);
    when(pointService.getById(2L)).thenReturn(pointB);
    when(pointService.calculateDistance(pointA, pointB)).thenReturn(new PointService.Distance(999.5, "km"));

    DistanceResponseDTO response = pointController.calculateDistance(1L, 2L);
    assertEquals(999.5, response.getDistance());
    assertEquals("km", response.getUnit());
  }
}