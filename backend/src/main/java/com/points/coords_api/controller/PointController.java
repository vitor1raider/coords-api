package com.points.coords_api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.points.coords_api.dto.DistanceResponseDTO;
import com.points.coords_api.model.Point;
import com.points.coords_api.service.PointService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Pontos", description = "Operações para criar, consultar, buscar, excluir e calcular distância entre pontos")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/pontos")
public class PointController {
  private final PointService pointService;

  public PointController(PointService pointService) {
    this.pointService = pointService;
  }

  @Operation(summary = "Listar pontos", description = "Retorna todos os pontos cadastrados")
  @GetMapping
  public List<Point> getAllPoints() {
    return pointService.getAllPoints();
  }

  @Operation(summary = "Criar ponto", description = "Cadastra um novo ponto geográfico")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Ponto criado com sucesso"),
    @ApiResponse(responseCode = "400", description = "Dados inválidos (nome, latitude ou longitude ausentes/fora do intervalo)")
  })
  @PostMapping
  public Point createPoint(@Valid @RequestBody Point point) {
    return pointService.createPoint(point);
  }

  @Operation(summary = "Buscar ponto por ID", description = "Retorna um ponto pelo ID")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Ponto encontrado"),
    @ApiResponse(responseCode = "404", description = "Ponto não encontrado")
  })
  @GetMapping("/{id}")
  public Point getPoint(
      @Parameter(description = "ID do ponto") @PathVariable Long id) {
    return pointService.getById(id);
  }

  @Operation(summary = "Calcular distância", description = "Calcula a distância entre dois pontos em km")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Distância calculada com sucesso"),
    @ApiResponse(responseCode = "404", description = "Um ou ambos os pontos não encontrados")
  })
  @GetMapping("/distancia")
  public DistanceResponseDTO calculateDistance(
      @Parameter(description = "ID do primeiro ponto")  @RequestParam Long id1,
      @Parameter(description = "ID do segundo ponto")   @RequestParam Long id2) {
    Point pointA = pointService.getById(id1);
    Point pointB = pointService.getById(id2);
    PointService.Distance distance = pointService.calculateDistance(pointA, pointB);
    return new DistanceResponseDTO(distance.value(), distance.unit());
  }

  @Operation(summary = "Excluir ponto", description = "Remove um ponto pelo ID")
  @ApiResponses({
    @ApiResponse(responseCode = "204", description = "Ponto removido com sucesso"),
    @ApiResponse(responseCode = "404", description = "Ponto não encontrado")
  })
  @DeleteMapping("/{id}")
  public void deletePoint(
      @Parameter(description = "ID do ponto") @PathVariable Long id) {
    pointService.deletePoint(id);
  }

  @Operation(summary = "Buscar pontos por nome", description = "Retorna pontos que correspondem ao nome informado")
  @GetMapping("/busca")
  public List<Point> searchByName(
      @Parameter(description = "Texto a buscar no nome do ponto") @RequestParam("nome") String name) {
    return pointService.searchByName(name);
  }
}