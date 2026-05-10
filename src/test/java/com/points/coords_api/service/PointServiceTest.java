package com.points.coords_api.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.points.coords_api.model.Point;
import com.points.coords_api.repository.PointRepository;

@ExtendWith(MockitoExtension.class)
public class PointServiceTest {
  @Mock
  private PointRepository pointRepository;

  @InjectMocks
  private PointService pointService;

  @Test
  @DisplayName("Should throw error when name is null")
  void shouldThrowWhenNameIsNull() throws Exception {
    Point point = new Point();
    point.setName(null);
    assertThrows(IllegalArgumentException.class, () -> pointService.createPoint(point));
  }

  @Test
  @DisplayName("Should throw error when longitude is out of range")
  void shouldThrowWhenLongitudeOutOfRange() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(-27.15);
    point.setLongitude(181.0);  // inválido

    assertThrows(IllegalArgumentException.class, () -> pointService.createPoint(point));
  }

  @Test
  @DisplayName("Should throw error when latitude is out of range")
  void shouldThrowWhenLatitudeOutOfRange() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(91.0);   // inválido
    point.setLongitude(-48.89);

    assertThrows(IllegalArgumentException.class, () -> pointService.createPoint(point));
  }

  @Test
  @DisplayName("Should throw error when name, longitude and latitude are null")
  void shouldThrowWhenNameLongitudeLatitudeAreNull() {
    Point point = new Point();
    point.setName(null);
    point.setLatitude(null);
    point.setLongitude(null);

    assertThrows(IllegalArgumentException.class, () -> pointService.createPoint(point));
  }

  @Test
  @DisplayName("Should accept boundary latitude values")
  void shouldAcceptBoundaryLatitude() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(-90.0);
    point.setLongitude(0.0);

    when(pointRepository.save(point)).thenReturn(point);

    assertDoesNotThrow(() -> pointService.createPoint(point));
  }

  @Test
  @DisplayName("Should save point when data is valid")
  void shouldSavePointWhenValid() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(-27.15);
    point.setLongitude(-48.89);

    when(pointRepository.save(point)).thenReturn(point);

    Point saved = pointService.createPoint(point);
    assertNotNull(saved);
    verify(pointRepository, times(1)).save(point);
  }
}
