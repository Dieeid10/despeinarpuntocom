DROP DATABASE IF EXISTS despeinarDB;
CREATE DATABASE despeinarDB;

USE despeinarDB;
GO

CREATE TABLE aeropuertos (
    id          INT PRIMARY KEY IDENTITY(1,1),
    codigo_iata VARCHAR(3)   NOT NULL UNIQUE,
    nombre      VARCHAR(255) NOT NULL,
    ciudad      VARCHAR(255) NOT NULL,
    pais        VARCHAR(255) NOT NULL
);

CREATE TABLE vuelos (
    vuelo_id        INT PRIMARY KEY IDENTITY(1,1),
    tipo_vuelo      VARCHAR(50)  NOT NULL,
    origen_id       INT          NOT NULL,
    destino_id      INT          NOT NULL,
    fecha_salida    DATETIME     NOT NULL,
    fecha_llegada   DATETIME     NOT NULL,
    capacidad        INT          NOT NULL,
    id_provedor      INT          NOT NULL,

    CONSTRAINT chk_tipo_vuelo CHECK (tipo_vuelo IN ('nacional', 'internacional')),
    FOREIGN KEY (origen_id) REFERENCES aeropuertos(id),
    FOREIGN KEY (destino_id) REFERENCES aeropuertos(id)
);

CREATE TABLE clases (
    clase_id          INT PRIMARY KEY IDENTITY(1,1),
    nombre      VARCHAR(50) NOT NULL UNIQUE,

    CONSTRAINT chk_tipo_vuelo CHECK (tipo_vuelo IN ('economica', 'ejecutiva', 'primera')),
);

create table asientos (
    asiento_id          INT PRIMARY KEY IDENTITY(1,1),
    vuelo_id     INT NOT NULL,
    clase_id     INT NOT NULL,
    numero_asiento VARCHAR(10) NOT NULL,
    disponible   BIT NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,

    FOREIGN KEY (vuelo_id) REFERENCES vuelos(vuelo_id),
    FOREIGN KEY (clase_id) REFERENCES clases(clase_id)
)

create table clientes (
    id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    nombre      VARCHAR(255) NOT NULL,
    apellido    VARCHAR(255) NOT NULL,
    documento   VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    telefono    VARCHAR(20)  NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion   VARCHAR(255) NOT NULL
)

create table provedores (
    id_provedor INT PRIMARY KEY IDENTITY(1,1),
    nombre      VARCHAR(255) NOT NULL,
    tipo        VARCHAR(50)  NOT NULL,
    telefono     VARCHAR(20)  NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
)

create table servicios_adicionales (
    servicio_id        INT PRIMARY KEY IDENTITY(1,1),
    tipo             VARCHAR(255) NOT NULL,
    descripcion        TEXT NOT NULL,
    precio             DECIMAL(10, 2) NOT NULL,
    id_provedor       INT NOT NULL,

    FOREIGN KEY (id_provedor) REFERENCES provedores(id_provedor)
)

create table paquetes (
    paquete_id          INT PRIMARY KEY IDENTITY(1,1),
    nombre      VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    duracion_dias INT NOT NULL,
    precio      DECIMAL(10, 2) NOT NULL,
    activo      BIT NOT NULL
)

create table paquetes_vuelos (
    paquetes_vuelos_id varchar(255) PRIMARY KEY,
    paquete_id   INT NOT NULL,
    vuelo_id     INT NOT NULL,

    FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id),
    FOREIGN KEY (vuelo_id) REFERENCES vuelos(vuelo_id)
)

create table paquetes_servicios (
    paquetes_servicios_id varchar(255) PRIMARY KEY,
    paquete_id   INT NOT NULL,
    servicio_id  INT NOT NULL,

    FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(servicio_id)
)

create table reservas (
    reserva_id          INT PRIMARY KEY IDENTITY(1,1),
    cliente_id          UUID NOT NULL,
    paquete_id          INT NULL,
    numero_asiento      VARCHAR(10) NOT NULL,
    fecha_reserva       DATETIME NOT NULL,
    estado              VARCHAR(50) NOT NULL,

    CONSTRAINT chk_estado CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
    FOREIGN KEY (cliente_id) REFERENCES cleintes(id),
    FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id),
)

create table reservas_pasajeros (
    reserva_pasajero_id INT PRIMARY KEY IDENTITY(1,1),
    reserva_id          INT NOT NULL,
    nombre              VARCHAR(255) NOT NULL,
    apellido            VARCHAR(255) NOT NULL,
    documento           VARCHAR(50)  NOT NULL,
    asiento_id          INT NOT NULL,

    FOREIGN KEY (asiento_id) REFERENCES asientos(asiento_id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id)
)

create table pagos (
    pago_id        INT PRIMARY KEY IDENTITY(1,1),
    reserva_id      INT NOT NULL,
    monto           DECIMAL(10, 2) NOT NULL,
    fecha_pago      DATETIME NOT NULL,
    metodo_pago     VARCHAR(50) NOT NULL,
    estado_pago     VARCHAR(50) NOT NULL,
    comprobante_pago VARCHAR(255) NOT NULL,

    CONSTRAINT chk_metodo_pago CHECK (metodo_pago IN ('tarjeta_credito', 'transferencia_bancaria', 'paypal', 'efectivo', 'otro')),
    CONSTRAINT chk_estado_pago CHECK (estado_pago IN ('pendiente', 'completado', 'fallido')),
    FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id)
)