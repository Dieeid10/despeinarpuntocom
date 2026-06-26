# Despeinar Turismo

Sistema de gestión para una agencia de turismo y aerolíneas. Permite administrar usuarios, clientes, vuelos, paquetes y reservas, con acceso diferenciado según el rol del usuario autenticado.

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Backend** | Python 3.12, FastAPI, Uvicorn, PyJWT |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, Material UI |
| **Base de datos** | Microsoft SQL Server 2022 |
| **Infraestructura** | Docker Compose |

## Arquitectura

El proyecto se organiza en tres capas principales:

```
┌─────────────┐     HTTP + JWT      ┌─────────────┐     SQL / SPs     ┌─────────────┐
│   Frontend  │ ──────────────────► │   Backend   │ ────────────────► │  SQL Server │
│  (Next.js)  │                     │  (FastAPI)  │                   │             │
└─────────────┘                     └─────────────┘                   └─────────────┘
                                                                           ▲
                                                                           │
                                                                    ┌─────────────┐
                                                                    │   Adminer   │
                                                                    │  (gestor)   │
                                                                    └─────────────┘
```

### Backend

API REST construida con **FastAPI**. En lugar de usar un ORM con clases de dominio, el backend trabaja con **pseudo-objetos**: diccionarios y funciones que encapsulan la lógica de acceso a datos (`user_dict`, `database`, etc.). Las consultas se ejecutan directamente contra SQL Server mediante stored procedures y queries parametrizadas.

**Autenticación:** sistema de login con usuario/contraseña. Las contraseñas se hashean con SHA-256 y, tras un login exitoso, el backend emite un **JWT** que el frontend envía en cada request protegido.

**Autorización:** middleware por roles (`gerente`, `operario`, `finanzas`) que restringe el acceso a ciertos endpoints.

### Frontend

Aplicación web en **Next.js** con **React**, estilizada con **Tailwind CSS** y componentes de **Material UI**. Tras el login, el token JWT se guarda en una cookie y el layout de la aplicación valida la sesión antes de renderizar las rutas internas. El menú lateral muestra u oculta secciones según el rol del usuario.

### Base de datos

**SQL Server** con esquema relacional completo: aeropuertos, aerolíneas, vuelos, asientos, clientes, paquetes, reservas, pagos, usuarios y roles. Incluye funciones, vistas, triggers, índices y stored procedures definidos en la carpeta `sqlserver/`.

## Servicios Docker

`docker-compose.yml` levanta **4 servicios**:

| Servicio | Descripción | Puerto (configurable en `.env`) |
|----------|-------------|----------------------------------|
| `sqlserver` | Instancia de SQL Server 2022. Al iniciar ejecuta automáticamente los scripts de `sqlserver/` (tablas, funciones, datos de prueba, etc.) | `SQLSERVER_EXTERNAL_PORT` → 1433 |
| `adminer` | Gestor visual web para consultar y administrar la base de datos | `ADMINER_EXTERNAL_PORT` → 8080 |
| `backend` | API FastAPI con driver ODBC para SQL Server | `BACKEND_EXTERNAL_PORT` → 8000 |
| `frontend` | Aplicación Next.js | `FRONTEND_EXTERNAL_PORT` → 3000 |

## Estructura del repositorio

```
.
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── controllers/  # Lógica de negocio (pseudo-objetos)
│   │   ├── routes/       # Endpoints REST
│   │   ├── db/           # Conexión y casos de uso de BD
│   │   └── utils/        # JWT, respuestas, manejo de errores
│   ├── main.py
│   └── Dockerfile.backend
├── frontend/             # App Next.js
│   ├── app/              # Páginas y rutas
│   ├── components/       # Componentes UI
│   ├── services/         # Cliente HTTP hacia el backend
│   └── hooks/            # Custom hooks
├── sqlserver/            # Scripts SQL (schema, datos, SPs)
│   ├── 01_tables.sql
│   ├── 02_funciones.sql
│   ├── 03_indices.sql
│   ├── 04_vistas.sql
│   ├── 05_triggers.sql
│   ├── 06_insert_data.sql
│   ├── 07_procedimientos.sql
│   └── init.sh           # Script de inicialización del contenedor
├── docker-compose.yml
└── .env.example
```

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose
- (Opcional, para desarrollo local sin Docker)
  - Python 3.12 + [uv](https://docs.astral.sh/uv/)
  - Node.js 20+

## Configuración

1. Clonar el repositorio:

```bash
git clone <url-del-repo>
cd "tp tecnicas de programación"
```

2. Copiar el archivo de variables de entorno y completar los valores:

```bash
cp .env.example .env
```

Variables principales:

```env
# SQL Server
SQLSERVER_HOST=sqlserver
SQLSERVER_PORT=1433
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=<contraseña_segura>
SQLSERVER_DATABASE=master

# Puertos expuestos en el host
SQLSERVER_EXTERNAL_PORT=1433
BACKEND_EXTERNAL_PORT=8000
FRONTEND_EXTERNAL_PORT=3000
ADMINER_EXTERNAL_PORT=8080

# Modo de la aplicación (production | developer)
mode=production

# JWT
JWT_SECRET=<clave_secreta>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=6
```

Para el frontend, configurar también:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MODE=production
```

## Ejecución con Docker

Levantar todos los servicios:

```bash
docker compose up --build
```

Una vez iniciados:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend (API) | http://localhost:8000 |
| Backend (docs) | http://localhost:8000/docs |
| Adminer | http://localhost:8080 |

### Conexión a Adminer

- **Sistema:** MS SQL (beta)
- **Servidor:** `sqlserver`
- **Usuario:** `sa`
- **Contraseña:** la definida en `SQLSERVER_PASSWORD`
- **Base de datos:** `master`

## Ejecución en desarrollo local

### Base de datos

```bash
docker compose up sqlserver adminer
```

### Backend

```bash
cd backend
uv sync
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Usuarios de prueba

El script `sqlserver/06_insert_data.sql` carga usuarios iniciales:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Gerente | `carlos@despeinar.com` | `gerente123` |
| Operario | `laura@despeinar.com` | `operario123` |
| Finanzas | `martin@despeinar.com` | `finanzas123` |

## API

Documentación interactiva disponible en `/docs` (Swagger UI) cuando el backend está corriendo.

Endpoints principales:

| Prefijo | Recurso |
|---------|---------|
| `/users` | Usuarios, login y roles |
| `/clients` | Clientes |
| `/flights` | Vuelos |
| `/packages` | Paquetes turísticos |
| `/reservations` | Reservas |

Los endpoints protegidos requieren el header:

```
Authorization: Bearer <token_jwt>
```

## Roles y permisos

| Rol | Acceso |
|-----|--------|
| **Gerente** | Panel general, usuarios, aeropuertos, aerolíneas, operaciones y finanzas |
| **Operario** | Reservas, vuelos, paquetes y clientes |
| **Finanzas** | Resumen financiero, pagos y comprobantes |

## Licencia

Proyecto académico — IFTS, Técnicas de Programación.
