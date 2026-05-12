# 🌍 CoordsAPI
Desenvolver uma aplicação full-stack para gestão de pontos geográficos em um mapa. O
usuário deve conseguir cadastrar pontos (latitude e longitude), visualizar todos em um mapa
interativo, selecionar dois deles e ver a distância calculada entre os pontos.

## 🛠️ Funcionalidades
- Cadastro de pontos (nome, latitude e longitude) por meio de formulário ou seleção no mapa
- Lista de todos os pontos
- Remover ponto cadastrado
- Filtro de busca com base no nome do ponto
- Interação com os pontos no mapa interativo
- Linha tracejada entre os pontos selecionados
- Calcula a distância entre dois pontos utilizando fórmula de Haversine
- Interface responsiva

## 🚀 Tecnologias utilizadas

### Backend
- Java 21
- Spring Boot 3.5.14
- Spring Data JPA
- Spring Validation
- Flyway (migrations)
- SpringDoc OpenAPI/Swagger
- Lombok
- Maven

### Frontend
- React 19
- Vite 8
- TypeScript 6
- Tailwind CSS 4
- Leaflet 
- Axios 
- Zod 
- Lucide React 

### Infraestrutura
- Docker & Docker Compose
- PostgreSQL 16

## 📁 Estrutura do projeto
```bash
coords-api/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## ⚙️ Como rodar o projeto

Pré-requisitos
- Docker
- Docker Compose

ou

- Java 21
- Node.js 20+
- PostgreSQL

## 🐳 Executando com Docker
Na raiz do projeto:
```bash
docker-compose up --build
```

A aplicação ficará disponível em:
| Serviço            | URL                          |
|--------------------|------------------------------|
| Frontend           | http://localhost:5173        |
| Backend            | http://localhost:8080        |
| Swagger (Backend)  | http://localhost:8080/swagger-ui.html |

## Executando manualmente

### Backend

#### 1. Configurar banco PostgreSQL
Certifique-se de que o PostgreSQL está rodando. Crie um banco:
```bash
CREATE DATABASE coordsdb;
```

#### 2. Configurar variáveis de ambiente
Configure o arquivo `backend/src/main/resources/application.properties`:
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/coordsdb
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
```

#### 3. Executar backend
```bash
cd backend
./mvnw spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

### Frontend

#### 1. Instalar dependências
```bash
cd frontend
npm install
```

#### 2. Configurar variável de ambiente (opcional em desenvolvimento)
Crie arquivo `frontend/.env`:
```bash
VITE_API_URL=http://localhost:8080
```

#### 3. Executar frontend
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 📌 Endpoints
| Método | Rota | O que faz |
|---|---|---|
| GET | `/pontos` | Lista todos os pontos cadastrados |
| GET | `/pontos/{id}` | Busca um ponto pelo ID |
| POST | `/pontos` | Cadastra um novo ponto (body: `{name, latitude, longitude}`) |
| GET | `/pontos/busca?nome=texto` | Busca pontos que contenham o texto no nome |
| GET | `/pontos/distancia?id1=1&id2=2` | Calcula a distância (Haversine) entre dois pontos em km |
| DELETE | `/pontos/{id}` | Remove um ponto cadastrado |

### Exemplo de request POST:
```json
{
  "name": "Ponto A",
  "latitude": -27.59,
  "longitude": -48.54
}
```

### Exemplo de response:
```json
{
  "id": 1,
  "name": "Ponto A",
  "latitude": -27.59,
  "longitude": -48.54,
  "createdAt": "2025-06-12T10:30:00"
}
```

## 📚 Documentação Interativa
Após iniciar o backend, acesse a documentação Swagger em:
```
http://localhost:8080/swagger-ui.html
```
