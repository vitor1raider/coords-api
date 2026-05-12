package com.points.coords_api.controller;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
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
  @DisplayName("Should return distance successfully with unit")
  void shouldReturnDistanceSuccessfullyWithUnit() {
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

  @Test
  @DisplayName("Should return all points successfully")
  void shouldReturnAllPointsSuccessfully() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(-27.15);
    point.setLongitude(-48.89);

    when(pointService.getAllPoints()).thenReturn(java.util.List.of(point));

    var points = pointController.getAllPoints();

    assertEquals(1, points.size());
    assertEquals("Ponto A", points.get(0).getName());
  }

  @Test
  @DisplayName("Should create point successfully")
  void shouldCreatePointSuccessfully() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(-27.15);
    point.setLongitude(-48.89);

    when(pointService.createPoint(point)).thenReturn(point);
    Point createdPoint = pointController.createPoint(point);
    assertEquals("Ponto A", createdPoint.getName());
    assertEquals(-27.15, createdPoint.getLatitude());
    assertEquals(-48.89, createdPoint.getLongitude());
  }

  @Test
  @DisplayName("Should return point by id successfully")
  void shouldReturnPointByIdSuccessfully() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(-27.15);
    point.setLongitude(-48.89);

    when(pointService.getById(1L)).thenReturn(point);
    Point foundPoint = pointController.getPoint(1L);
    assertEquals("Ponto A", foundPoint.getName());
    assertEquals(-27.15, foundPoint.getLatitude());
    assertEquals(-48.89, foundPoint.getLongitude());
  }

  @Test 
  @DisplayName("Should delete point successfully")
  void shouldDeletePointSuccessfully() {
    assertDoesNotThrow(() -> pointController.deletePoint(1L));
    verify(pointService).deletePoint(1L);
  }

  @Test
  @DisplayName("Should return points by name successfully")
  void shouldReturnPointsByNameSuccessfully() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(-27.15);
    point.setLongitude(-48.89);

    when(pointService.searchByName("Ponto A")).thenReturn(java.util.List.of(point));
    var foundPoints = pointController.searchByName("Ponto A");
    assertEquals(1, foundPoints.size());
    assertEquals("Ponto A", foundPoints.get(0).getName());
  }
}