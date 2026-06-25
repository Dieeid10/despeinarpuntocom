CREATE TABLE [aeropuertos] (
  [codigo_iata] nvarchar(255) PRIMARY KEY,
  [nombre] nvarchar(255),
  [ciudad] nvarchar(255),
  [pais] nvarchar(255)
)
GO

CREATE TABLE [aerolineas] (
  [id_aerolinea] int PRIMARY KEY IDENTITY(1, 1),
  [nombre] nvarchar(255),
  [tipo] nvarchar(255),
  [telefono] nvarchar(255),
  [email] nvarchar(255) UNIQUE
)
GO

CREATE TABLE [vuelos] (
  [vuelo_id] int PRIMARY KEY IDENTITY(1, 1),
  [tipo_vuelo] nvarchar(255),
  [origen_id] nvarchar(255),
  [destino_id] nvarchar(255),
  [fecha_salida] datetime,
  [fecha_llegada] datetime,
  [id_aerolinea] int
)
GO

CREATE TABLE [clases] (
  [tipo_asiento] nvarchar(255) PRIMARY KEY,
  [descripcion] nvarchar(255),
  [tamaño_asiento] int,
  [reclinable] boolean,
  [cama] boolean,
  [incluye_comida] boolean,
  [kg_equipaje_incluido] int
)
GO

CREATE TABLE [asientos] (
  [asiento_id] int PRIMARY KEY IDENTITY(1, 1),
  [vuelo_id] int,
  [tipo_asiento] nvarchar(255),
  [numero_asiento] nvarchar(255),
  [precio_base] decimal
)
GO

CREATE TABLE [clientes] (
  [id] uuid PRIMARY KEY,
  [nombre] nvarchar(255),
  [apellido] nvarchar(255),
  [documento] nvarchar(255) UNIQUE,
  [email] nvarchar(255) UNIQUE,
  [telefono] nvarchar(255),
  [fecha_nacimiento] date,
  [direccion] nvarchar(255)
)
GO

CREATE TABLE [servicios_adicionales] (
  [servicio_id] int PRIMARY KEY IDENTITY(1, 1),
  [nombre] nvarchar(255),
  [tipo] nvarchar(255),
  [descripcion] nvarchar(255),
  [precio] decimal
)
GO

CREATE TABLE [paquetes] (
  [paquete_id] int PRIMARY KEY IDENTITY(1, 1),
  [nombre] nvarchar(255),
  [descripcion] nvarchar(255),
  [duracion_dias] int,
  [precio] decimal,
  [activo] boolean
)
GO

CREATE TABLE [paquetes_vuelos] (
  [paquete_id] int,
  [vuelo_id] int,
  PRIMARY KEY ([paquete_id], [vuelo_id])
)
GO

CREATE TABLE [paquetes_servicios] (
  [paquete_id] int,
  [servicio_id] int,
  PRIMARY KEY ([paquete_id], [servicio_id])
)
GO

CREATE TABLE [reservas] (
  [reserva_id] int PRIMARY KEY IDENTITY(1, 1),
  [cliente_id] uuid,
  [paquete_id] int,
  [fecha_reserva] datetime,
  [estado] nvarchar(255),
  [tipo_reserva] nvarchar(255)
)
GO

CREATE TABLE [reservas_pasajeros] (
  [reserva_pasajero_id] int PRIMARY KEY IDENTITY(1, 1),
  [reserva_id] int,
  [nombre] nvarchar(255),
  [apellido] nvarchar(255),
  [documento] nvarchar(255)
)
GO

CREATE TABLE [reservas_vuelos] (
  [reserva_id] int,
  [vuelo_id] int,
  PRIMARY KEY ([reserva_id], [vuelo_id])
)
GO

CREATE TABLE [reservas_servicios] (
  [reserva_id] int,
  [servicio_id] int,
  [cantidad] int,
  PRIMARY KEY ([reserva_id], [servicio_id])
)
GO

CREATE TABLE [pagos] (
  [pago_id] int PRIMARY KEY IDENTITY(1, 1),
  [reserva_id] int,
  [monto] decimal,
  [fecha_pago] datetime,
  [metodo_pago] nvarchar(255),
  [estado_pago] nvarchar(255),
  [comprobante_pago] nvarchar(255)
)
GO

CREATE TABLE [roles] (
  [rol_id] int PRIMARY KEY IDENTITY(1, 1),
  [nombre] nvarchar(255)
)
GO

CREATE TABLE [usuarios] (
  [usuario_id] uuid PRIMARY KEY,
  [nombre] nvarchar(255),
  [apellido] nvarchar(255),
  [email] nvarchar(255) UNIQUE,
  [password_hash] nvarchar(255),
  [rol_id] int
)
GO

ALTER TABLE [vuelos] ADD FOREIGN KEY ([origen_id]) REFERENCES [aeropuertos] ([codigo_iata])
GO

ALTER TABLE [vuelos] ADD FOREIGN KEY ([destino_id]) REFERENCES [aeropuertos] ([codigo_iata])
GO

ALTER TABLE [vuelos] ADD FOREIGN KEY ([id_aerolinea]) REFERENCES [aerolineas] ([id_aerolinea])
GO

ALTER TABLE [asientos] ADD FOREIGN KEY ([vuelo_id]) REFERENCES [vuelos] ([vuelo_id])
GO

ALTER TABLE [asientos] ADD FOREIGN KEY ([tipo_asiento]) REFERENCES [clases] ([tipo_asiento])
GO

ALTER TABLE [reservas] ADD FOREIGN KEY ([cliente_id]) REFERENCES [clientes] ([id])
GO

ALTER TABLE [reservas] ADD FOREIGN KEY ([paquete_id]) REFERENCES [paquetes] ([paquete_id])
GO

ALTER TABLE [reservas_pasajeros] ADD FOREIGN KEY ([reserva_id]) REFERENCES [reservas] ([reserva_id])
GO

ALTER TABLE [reservas_vuelos] ADD FOREIGN KEY ([reserva_id]) REFERENCES [reservas] ([reserva_id])
GO

ALTER TABLE [reservas_vuelos] ADD FOREIGN KEY ([vuelo_id]) REFERENCES [vuelos] ([vuelo_id])
GO

ALTER TABLE [reservas_servicios] ADD FOREIGN KEY ([reserva_id]) REFERENCES [reservas] ([reserva_id])
GO

ALTER TABLE [reservas_servicios] ADD FOREIGN KEY ([servicio_id]) REFERENCES [servicios_adicionales] ([servicio_id])
GO

ALTER TABLE [pagos] ADD FOREIGN KEY ([reserva_id]) REFERENCES [reservas] ([reserva_id])
GO

ALTER TABLE [usuarios] ADD FOREIGN KEY ([rol_id]) REFERENCES [roles] ([rol_id])
GO

ALTER TABLE [paquetes_servicios] ADD FOREIGN KEY ([paquete_id]) REFERENCES [paquetes] ([paquete_id])
GO

ALTER TABLE [paquetes_servicios] ADD FOREIGN KEY ([servicio_id]) REFERENCES [servicios_adicionales] ([servicio_id])
GO

ALTER TABLE [paquetes_vuelos] ADD FOREIGN KEY ([paquete_id]) REFERENCES [paquetes] ([paquete_id])
GO

ALTER TABLE [paquetes_vuelos] ADD FOREIGN KEY ([vuelo_id]) REFERENCES [vuelos] ([vuelo_id])
GO
