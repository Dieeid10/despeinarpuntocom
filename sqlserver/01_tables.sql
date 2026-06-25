USE master;
GO

CREATE TABLE aeropuertos (
    codigo_iata VARCHAR(3)   PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    pais VARCHAR(255) NOT NULL,

    CONSTRAINT chk_codigo_iata CHECK (LEN(codigo_iata) = 3)
);

CREATE TABLE aerolineas (
    id_aerolinea INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50)  NOT NULL,
    telefono VARCHAR(20)  NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE vuelos (
    vuelo_id INT PRIMARY KEY IDENTITY(1,1),
    tipo_vuelo VARCHAR(15) NOT NULL,
    origen_id VARCHAR(3) NOT NULL,
    destino_id VARCHAR(3)   NOT NULL,
    fecha_salida DATETIME NOT NULL,
    fecha_llegada DATETIME NOT NULL,
    id_aerolinea INT NOT NULL,

    CONSTRAINT chk_tipo_vuelo CHECK (tipo_vuelo IN ('nacional', 'internacional')),
    CONSTRAINT chk_fecha CHECK (fecha_salida < fecha_llegada),
    FOREIGN KEY (origen_id) REFERENCES aeropuertos(codigo_iata),
    FOREIGN KEY (destino_id) REFERENCES aeropuertos(codigo_iata),
    FOREIGN KEY (id_aerolinea) REFERENCES aerolineas(id_aerolinea)
);

CREATE TABLE clases (
    tipo_asiento VARCHAR(20) PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    tamaño_asiento INT NOT NULL,
    reclinable BIT NOT NULL,
    cama BIT NOT NULL,
    incluye_comida BIT NOT NULL,
    kg_equipaje_incluido INT NOT NULL,

    CONSTRAINT chk_tipo_asiento CHECK (tipo_asiento IN ('economica', 'ejecutiva', 'primera'))
);

create table asientos (
    asiento_id INT PRIMARY KEY IDENTITY(1,1),
    vuelo_id INT NOT NULL,
    tipo_asiento VARCHAR(20) NOT NULL,
    numero_asiento VARCHAR(10) NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,

    FOREIGN KEY (vuelo_id) REFERENCES vuelos(vuelo_id),
    FOREIGN KEY (tipo_asiento) REFERENCES clases(tipo_asiento)
);

create table clientes (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    documento VARCHAR(20)  NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20)  NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL
);

create table servicios_adicionales (
    servicio_id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
);

create table paquetes (
    paquete_id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    duracion_dias INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    activo BIT NOT NULL
);

CREATE TABLE paquetes_vuelos (
    paquete_id INT NOT NULL,
    vuelo_id INT NOT NULL,
    PRIMARY KEY (paquete_id, vuelo_id),
    FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id),
    FOREIGN KEY (vuelo_id)   REFERENCES vuelos(vuelo_id)
);

create table paquetes_servicios (
    paquete_id INT NOT NULL,
    servicio_id INT NOT NULL,
    PRIMARY KEY (paquete_id, servicio_id),
    FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id),
    FOREIGN KEY (servicio_id) REFERENCES servicios_adicionales(servicio_id)
);

create table reservas (
    reserva_id INT PRIMARY KEY IDENTITY(1,1),
    cliente_id UNIQUEIDENTIFIER NOT NULL,
    paquete_id INT NULL,
    fecha_reserva DATETIME NOT NULL,
    estado VARCHAR(50) NOT NULL,
    tipo_reserva VARCHAR(50) NOT NULL,

    CONSTRAINT chk_estado CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
    CONSTRAINT chk_tipo_reserva CHECK (tipo_reserva IN ('vuelo', 'paquete')),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id)
);

CREATE TABLE reservas_pasajeros (
    reserva_pasajero_id INT PRIMARY KEY IDENTITY(1,1),
    reserva_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    asiento_id INT NOT NULL,

    FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id),
    FOREIGN KEY (asiento_id) REFERENCES asientos(asiento_id)
);

CREATE TABLE reservas_vuelos (
    reserva_id INT NOT NULL,
    vuelo_id INT NOT NULL,

    PRIMARY KEY(reserva_id, vuelo_id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id),
    FOREIGN KEY (vuelo_id) REFERENCES vuelos(vuelo_id)
);

CREATE TABLE reservas_servicios (
    reserva_id INT NOT NULL,
    servicio_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    
    PRIMARY KEY (reserva_id, servicio_id),
    FOREIGN KEY (reserva_id)  REFERENCES reservas(reserva_id),
    FOREIGN KEY (servicio_id) REFERENCES servicios_adicionales(servicio_id)
);

create table pagos (
    pago_id INT PRIMARY KEY IDENTITY(1,1),
    reserva_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATETIME NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado_pago VARCHAR(50) NOT NULL,
    comprobante_pago VARCHAR(255) NOT NULL,

    CONSTRAINT chk_metodo_pago CHECK (metodo_pago IN ('tarjeta_credito', 'transferencia_bancaria', 'paypal', 'efectivo', 'otro')),
    CONSTRAINT chk_estado_pago CHECK (estado_pago IN ('pendiente', 'completado', 'fallido')),
    FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id)
);

create table roles (
    rol_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

create table usuarios (
    usuario_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,

    FOREIGN KEY (rol_id) REFERENCES roles(rol_id)
);