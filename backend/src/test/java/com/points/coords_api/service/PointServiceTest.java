package com.points.coords_api.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
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

import com.points.coords_api.exceptions.NotFoundException;
import com.points.coords_api.model.Point;
import com.points.coords_api.repository.PointRepository;

@ExtendWith(MockitoExtension.class)
public class PointServiceTest {
  @Mock
  private PointRepository pointRepository;

  @InjectMocks
  private PointService pointService;

  @Test
  @DisplayName("Should return point by id successfully")
  void shouldReturnPointByIdSuccessfully() {
    Point point = new Point();
    point.setName("Ponto A");
    when(pointRepository.findById(1L)).thenReturn(java.util.Optional.of(point));

    Point foundPoint = pointService.getById(1L);

    assertNotNull(foundPoint);
    assertEquals("Ponto A", foundPoint.getName());
  }

  @Test
  @DisplayName("Should throw error when name is not found by id")
  void shouldThrowWhenNameIsNotFound() {
    when(pointRepository.findById(1L)).thenReturn(java.util.Optional.empty());
    assertThrows(NotFoundException.class, () -> pointService.getById(1L));
  }

  @Test
  @DisplayName("Should delete point successfully when id exists")
  void shouldDeletePointSuccessfullyWhenIdExists() {
    when(pointRepository.existsById(1L)).thenReturn(true);

    assertDoesNotThrow(() -> pointService.deletePoint(1L));

    verify(pointRepository, times(1)).deleteById(1L);
  }

  @Test
  @DisplayName("Should throw error when delete point id does not exist")
  void shouldThrowWhenDeletePointIdDoesNotExist() {
    when(pointRepository.existsById(1L)).thenReturn(false);

    assertThrows(NotFoundException.class, () -> pointService.deletePoint(1L));
  }

  @Test
  @DisplayName("Should return points by name successfully")
  void shouldReturnPointsByNameSuccessfully() {
    Point point = new Point();
    point.setName("Ponto A");
    when(pointRepository.findByName("Ponto A")).thenReturn(java.util.List.of(point));

    var points = pointService.searchByName("Ponto A");

    assertEquals(1, points.size());
    assertEquals("Ponto A", points.get(0).getName());
  }

  @Test
  @DisplayName("Should return all points successfully")
  void shouldReturnAllPointsSuccessfully() {
    Point point = new Point();
    point.setName("Ponto A");
    when(pointRepository.findAll()).thenReturn(java.util.List.of(point));

    var points = pointService.getAllPoints();

    assertEquals(1, points.size());
    assertEquals("Ponto A", points.get(0).getName());
  }

  @Test
  @DisplayName("Should calculate distance between two known points")
  void shouldCalculateDistanceBetweenTwoPoints() {
    Point pointA = new Point();
    pointA.setLatitude(-27.59);
    pointA.setLongitude(-48.54);

    Point pointB = new Point();
    pointB.setLatitude(-22.90);
    pointB.setLongitude(-43.17);

    PointService.Distance distance = pointService.calculateDistance(pointA, pointB);

    assertEquals(750.0, distance.value(), 20.0); 
    assertEquals("km", distance.unit());
  }

  @Test
  @DisplayName("Should accept boundary latitude value successfully")
  void shouldAcceptBoundaryLatitudeValueSuccessfully() {
    Point point = new Point();
    point.setName("Ponto A");
    point.setLatitude(-90.0);
    point.setLongitude(0.0);

    when(pointRepository.save(point)).thenReturn(point);

    assertDoesNotThrow(() -> pointService.createPoint(point));
  }

  @Test
  @DisplayName("Should save point successfully when data is valid")
  void shouldSavePointSuccessfullyWhenValid() {
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
