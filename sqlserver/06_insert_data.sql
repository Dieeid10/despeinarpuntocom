USE master;
GO

-- =============================================
-- LIMPIEZA EN ORDEN (respetando FK)
-- =============================================

DELETE FROM pagos;
DELETE FROM reservas_servicios;
DELETE FROM reservas_pasajeros;
DELETE FROM reservas_vuelos;
DELETE FROM reservas;
DELETE FROM paquetes_servicios;
DELETE FROM paquetes_vuelos;
DELETE FROM asientos;
DELETE FROM paquetes;
DELETE FROM vuelos;
DELETE FROM servicios_adicionales;
DELETE FROM clientes;
DELETE FROM usuarios;
DELETE FROM roles;
DELETE FROM aerolineas;
DELETE FROM aeropuertos;
DELETE FROM clases;

-- Reseed para que los IDENTITY vuelvan a arrancar desde 1
DBCC CHECKIDENT ('pagos', RESEED, 1);
DBCC CHECKIDENT ('reservas_pasajeros', RESEED, 1);
DBCC CHECKIDENT ('reservas', RESEED, 1);
DBCC CHECKIDENT ('asientos', RESEED, 1);
DBCC CHECKIDENT ('vuelos', RESEED, 1);
DBCC CHECKIDENT ('paquetes', RESEED, 1);
DBCC CHECKIDENT ('servicios_adicionales', RESEED, 1);
DBCC CHECKIDENT ('aerolineas', RESEED, 1);
DBCC CHECKIDENT ('roles', RESEED, 1);
GO

-- =============================================
-- ROLES
-- =============================================
INSERT INTO roles (nombre) VALUES
('gerente'),
('operario'),
('finanzas');

-- =============================================
-- USUARIOS
-- =============================================
DECLARE @uid1 UNIQUEIDENTIFIER = NEWID();
DECLARE @uid2 UNIQUEIDENTIFIER = NEWID();
DECLARE @uid3 UNIQUEIDENTIFIER = NEWID();

INSERT INTO usuarios (usuario_id, nombre, apellido, email, password_hash, rol_id) VALUES
(@uid1, 'Carlos',  'Méndez',    'carlos@despeinar.com', LOWER(CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', 'gerente123'), 2)), 1),
(@uid2, 'Laura',   'Gómez',     'laura@despeinar.com',  LOWER(CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', 'operario123'), 2)), 2),
(@uid3, 'Martín',  'Rodríguez', 'martin@despeinar.com', LOWER(CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', 'finanzas123'), 2)), 3);

-- =============================================
-- AEROPUERTOS
-- =============================================
INSERT INTO aeropuertos (codigo_iata, nombre, ciudad, pais) VALUES
('EZE', 'Aeropuerto Internacional Ministro Pistarini',      'Buenos Aires',   'Argentina'),
('AEP', 'Aeroparque Jorge Newbery',                         'Buenos Aires',   'Argentina'),
('COR', 'Aeropuerto Internacional Ingeniero Taravella',     'Córdoba',        'Argentina'),
('MDZ', 'Aeropuerto Internacional El Plumerillo',           'Mendoza',        'Argentina'),
('IGR', 'Aeropuerto Internacional Cataratas',               'Iguazú',         'Argentina'),
('ROS', 'Aeropuerto Internacional Islas Malvinas',          'Rosario',        'Argentina'),
('MAD', 'Aeropuerto Adolfo Suárez Madrid-Barajas',          'Madrid',         'España'),
('BCN', 'Aeropuerto Josep Tarradellas Barcelona-El Prat',   'Barcelona',      'España'),
('GRU', 'Aeropuerto Internacional de São Paulo-Guarulhos',  'São Paulo',      'Brasil'),
('GIG', 'Aeropuerto Internacional Antonio Carlos Jobim',    'Río de Janeiro', 'Brasil'),
('SCL', 'Aeropuerto Internacional Arturo Merino Benítez',   'Santiago',       'Chile'),
('MIA', 'Aeropuerto Internacional de Miami',                'Miami',          'Estados Unidos'),
('JFK', 'Aeropuerto Internacional John F. Kennedy',         'Nueva York',     'Estados Unidos'),
('CUN', 'Aeropuerto Internacional de Cancún',               'Cancún',         'México'),
('CDG', 'Aeropuerto Internacional Charles de Gaulle',       'París',          'Francia'),
('FCO', 'Aeropuerto Internacional Leonardo da Vinci',       'Roma',           'Italia');

-- =============================================
-- AEROLÍNEAS
-- =============================================
INSERT INTO aerolineas (nombre, tipo, telefono, email) VALUES
('Aerolíneas Argentinas', 'nacional',      '+54 11 4340-7800', 'contacto@aerolineas.com.ar'),
('LATAM Airlines',        'internacional', '+54 11 5983-9000', 'contacto@latam.com'),
('Iberia',                'internacional', '+34 901 111 500',  'contacto@iberia.com'),
('American Airlines',     'internacional', '+1 800 433 7300',  'contacto@aa.com'),
('Flybondi',              'nacional',      '+54 11 6891-3377', 'contacto@flybondi.com'),
('Air France',            'internacional', '+33 892 702 654',  'contacto@airfrance.com'),
('Alitalia',              'internacional', '+39 06 6563 1',    'contacto@alitalia.com');

-- =============================================
-- CLASES
-- =============================================
INSERT INTO clases (tipo_asiento, descripcion, tamaño_asiento, reclinable, cama, incluye_comida, kg_equipaje_incluido) VALUES
('economica', 'Clase económica estándar',        45,  1, 0, 0, 15),
('ejecutiva', 'Clase ejecutiva con más espacio', 80,  1, 0, 1, 30),
('primera',   'Primera clase con cama completa', 120, 1, 1, 1, 40);

-- =============================================
-- VUELOS
-- =============================================
INSERT INTO vuelos (tipo_vuelo, origen_id, destino_id, fecha_salida, fecha_llegada, id_aerolinea) VALUES
('nacional',      'EZE', 'COR', '2025-07-10 08:00', '2025-07-10 09:30', 1),
('nacional',      'EZE', 'MDZ', '2025-07-12 10:00', '2025-07-12 11:45', 1),
('nacional',      'AEP', 'IGR', '2025-07-15 07:00', '2025-07-15 09:00', 5),
('internacional', 'EZE', 'MAD', '2025-07-20 22:00', '2025-07-21 14:00', 3),
('internacional', 'EZE', 'MIA', '2025-07-25 00:00', '2025-07-25 08:00', 4),
('internacional', 'EZE', 'CUN', '2025-08-01 23:00', '2025-08-02 06:00', 2),
('internacional', 'EZE', 'GRU', '2025-08-05 06:00', '2025-08-05 09:30', 2),
('internacional', 'EZE', 'SCL', '2025-08-10 14:00', '2025-08-10 16:00', 2),
('internacional', 'EZE', 'BCN', '2025-08-15 21:00', '2025-08-16 13:00', 3),
('nacional',      'COR', 'EZE', '2025-07-20 17:00', '2025-07-20 18:30', 1),
('nacional',      'EZE', 'ROS', '2025-07-18 09:00', '2025-07-18 10:00', 5),
('internacional', 'EZE', 'JFK', '2025-08-20 23:00', '2025-08-21 09:00', 4),
('internacional', 'EZE', 'CDG', '2025-09-01 20:00', '2025-09-02 12:00', 6),
('internacional', 'EZE', 'FCO', '2025-09-10 21:00', '2025-09-11 14:00', 1),
('internacional', 'EZE', 'GIG', '2025-08-25 06:00', '2025-08-25 10:00', 2);

-- =============================================
-- ASIENTOS
-- =============================================
INSERT INTO asientos (vuelo_id, tipo_asiento, numero_asiento, precio_base) VALUES
(1,'economica','10A',45000),(1,'economica','10B',45000),(1,'economica','10C',45000),(1,'economica','12A',47000),(1,'economica','12B',47000),(1,'ejecutiva','3A',120000),(1,'ejecutiva','3B',120000),
(2,'economica','10A',55000),(2,'economica','10B',55000),(2,'economica','14A',57000),(2,'ejecutiva','2A',130000),(2,'ejecutiva','2B',130000),
(3,'economica','15A',48000),(3,'economica','15B',48000),(3,'economica','16A',50000),(3,'ejecutiva','4A',110000),
(4,'economica','20A',350000),(4,'economica','20B',350000),(4,'economica','22C',360000),(4,'economica','24A',355000),(4,'economica','24B',355000),(4,'ejecutiva','5A',800000),(4,'ejecutiva','5B',800000),(4,'primera','1A',1500000),(4,'primera','1B',1500000),
(5,'economica','18A',420000),(5,'economica','18B',420000),(5,'economica','20A',425000),(5,'ejecutiva','4A',950000),(5,'ejecutiva','4B',950000),(5,'primera','1A',1800000),
(6,'economica','25A',380000),(6,'economica','25B',380000),(6,'economica','26A',385000),(6,'ejecutiva','6A',850000),(6,'ejecutiva','6B',850000),
(7,'economica','12A',280000),(7,'economica','12B',280000),(7,'economica','14A',285000),(7,'ejecutiva','3A',600000),
(8,'economica','10A',180000),(8,'economica','10B',180000),(8,'economica','11A',185000),(8,'ejecutiva','2A',400000),(8,'ejecutiva','2B',400000),
(9,'economica','22A',360000),(9,'economica','22B',360000),(9,'economica','24A',365000),(9,'ejecutiva','5A',820000),(9,'primera','1A',1550000),
(10,'economica','10A',45000),(10,'economica','10B',45000),(10,'ejecutiva','3A',120000),
(11,'economica','8A',35000),(11,'economica','8B',35000),(11,'economica','9A',37000),
(12,'economica','20A',480000),(12,'economica','20B',480000),(12,'economica','22A',485000),(12,'ejecutiva','4A',1100000),(12,'primera','1A',2000000),
(13,'economica','18A',390000),(13,'economica','18B',390000),(13,'economica','20A',395000),(13,'ejecutiva','5A',880000),(13,'primera','1A',1600000),
(14,'economica','16A',370000),(14,'economica','16B',370000),(14,'economica','18A',375000),(14,'ejecutiva','4A',850000),(14,'primera','1A',1580000),
(15,'economica','14A',290000),(15,'economica','14B',290000),(15,'economica','16A',295000),(15,'ejecutiva','3A',650000);

-- =============================================
-- SERVICIOS ADICIONALES
-- =============================================
INSERT INTO servicios_adicionales (nombre, tipo, descripcion, precio) VALUES
('Equipaje extra 10kg',  'equipaje',    'Equipaje adicional de 10kg en bodega',       8500),
('Seguro de viaje',     'seguro',      'Cobertura médica y cancelación',             15000),
('Traslado aeropuerto', 'traslado',    'Transfer ida/vuelta hotel-aeropuerto',        12000),
('Comida premium',      'gastronomia', 'Menú premium a bordo',                        4500),
('Hotel 3 estrellas',   'alojamiento', 'Noche en hotel 3 estrellas con desayuno',     45000),
('Hotel 5 estrellas',   'alojamiento', 'Noche en hotel 5 estrellas todo incluido',    120000),
('Tour ciudad',         'excursion',   'Visita guiada de medio día por la ciudad',    18000),
('Excursión cataratas', 'excursion',   'Excursión de día completo a las cataratas',   35000),
('Renta de auto',       'traslado',    'Vehículo por 3 días con seguro incluido',     55000),
('Asistencia VIP',      'servicio',    'Asistencia personalizada en aeropuerto',      25000);

-- =============================================
-- PAQUETES
-- =============================================
INSERT INTO paquetes (nombre, descripcion, duracion_dias, precio, activo) VALUES
('Europa Clásica 10 días',    'Madrid y Barcelona con guía incluido',         10, 2450000, 1),
('Caribe All Inclusive',      'Cancún todo incluido frente al mar',            7, 1890000, 1),
('Cataratas del Iguazú',      'Escapada de fin de semana a las cataratas',     3, 320000, 0),
('Miami & Playas de Florida', 'Miami, Orlando y los Cayos en un solo viaje',  10, 2100000, 1),
('Brasil Express',           'São Paulo y Río de Janeiro en 5 días',           5, 980000, 1),
('Nueva York City',          'La Gran Manzana en 7 días',                      7, 2800000, 1),
('París Romántico',          'La ciudad del amor con crucero por el Sena',      8, 3100000, 1),
('Italia Completa',          'Roma, Florencia y Venecia en 12 días',          12, 3500000, 1),
('Santiago & Viña',          'Chile en 5 días con tour vinícola',              5, 750000, 1),
('Mendoza & Vinos',          'Escapada a la capital del vino argentino',       3, 280000, 1);

INSERT INTO paquetes_vuelos (paquete_id, vuelo_id) VALUES
(1,4),(1,9),
(2,6),
(3,3),
(4,5),
(5,7),(5,15),
(6,12),
(7,13),
(8,14),
(9,8),
(10,2);

INSERT INTO paquetes_servicios (paquete_id, servicio_id) VALUES
(1,2),(1,3),(1,5),(1,7),
(2,2),(2,3),(2,6),
(3,2),(3,8),
(4,2),(4,3),(4,5),(4,7),
(5,2),(5,3),(5,5),
(6,2),(6,3),(6,6),(6,7),(6,10),
(7,2),(7,3),(7,6),(7,7),
(8,2),(8,3),(8,5),(8,7),(8,9),
(9,2),(9,3),(9,5),(9,9),
(10,2),(10,3),(10,9);

-- =============================================
-- CLIENTES
-- =============================================
DECLARE @c1 UNIQUEIDENTIFIER = NEWID();
DECLARE @c2 UNIQUEIDENTIFIER = NEWID();
DECLARE @c3 UNIQUEIDENTIFIER = NEWID();
DECLARE @c4 UNIQUEIDENTIFIER = NEWID();
DECLARE @c5 UNIQUEIDENTIFIER = NEWID();
DECLARE @c6 UNIQUEIDENTIFIER = NEWID();
DECLARE @c7 UNIQUEIDENTIFIER = NEWID();
DECLARE @c8 UNIQUEIDENTIFIER = NEWID();

INSERT INTO clientes (id, nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion) VALUES
(@c1,'María',    'González',  '30123456','maria.gonzalez@gmail.com',    '+54 11 1234-5678','1990-03-15','Av. Corrientes 1234, CABA'),
(@c2,'Carlos',   'Pérez',     '28456789','carlos.perez@hotmail.com',    '+54 11 2345-6789','1985-07-22','Belgrano 567, Córdoba'),
(@c3,'Ana',      'Romero',    '35789012','ana.romero@yahoo.com',        '+54 11 3456-7890','1995-11-08','San Martín 890, Mendoza'),
(@c4,'Luis',     'Torres',    '32654321','luis.torres@gmail.com',       '+54 11 4567-8901','1988-05-30','Rivadavia 234, Rosario'),
(@c5,'Sofía',    'Martínez',  '33112233','sofia.martinez@gmail.com',    '+54 11 5678-9012','1992-08-14','Florida 456, CABA'),
(@c6,'Diego',    'Fernández', '29887766','diego.fernandez@outlook.com', '+54 11 6789-0123','1983-12-01','Mitre 789, Tucumán'),
(@c7,'Valentina','López',     '36445566','valen.lopez@gmail.com',       '+54 11 7890-1234','1997-04-25','Lavalle 321, Mar del Plata'),
(@c8,'Rodrigo',  'Sánchez',   '31223344','rodrigo.sanchez@gmail.com',   '+54 11 8901-2345','1987-09-18','Pellegrini 654, Santa Fe');

-- =============================================
-- RESERVAS
-- =============================================
INSERT INTO reservas (cliente_id, paquete_id, fecha_reserva, estado, tipo_reserva) VALUES
(@c1, 1,    '2025-06-01 10:00', 'confirmada', 'paquete'),
(@c2, NULL, '2025-06-05 14:00', 'pendiente',  'vuelo'),
(@c3, 2,    '2025-06-08 09:00', 'confirmada', 'paquete'),
(@c4, NULL, '2025-06-10 16:00', 'cancelada',  'vuelo'),
(@c5, 4,    '2025-06-12 11:00', 'confirmada', 'paquete'),
(@c6, NULL, '2025-06-14 09:30', 'confirmada', 'vuelo'),
(@c7, 6,    '2025-06-15 15:00', 'pendiente',  'paquete'),
(@c8, NULL, '2025-06-16 10:00', 'completada', 'vuelo');

-- Reservas de vuelos individuales
INSERT INTO reservas_vuelos (reserva_id, vuelo_id) VALUES
(2,5),
(4,1),
(6,8),
(8,1);

-- =============================================
-- PASAJEROS DE RESERVA
-- Ahora una familia/grupo se representa como:
-- 1 reserva + varios pasajeros + 1 asiento por pasajero.
-- =============================================

INSERT INTO reservas_pasajeros (reserva_id, nombre, apellido, documento, asiento_id) VALUES
-- Reserva 1: paquete familiar Europa Clásica, 4 pasajeros
(1, 'María',   'González', '30123456', 17),
(1, 'Andrés',  'González', '27111222', 18),
(1, 'Julieta', 'González', '45111222', 19),
(1, 'Tomás',   'González', '47111222', 20),

-- Reserva 2: vuelo individual a Miami
(2, 'Carlos',  'Pérez',    '28456789', 26),

-- Reserva 3: paquete Caribe
(3, 'Ana',     'Romero',   '35789012', 32),

-- Reserva 4: vuelo cancelado
(4, 'Luis',    'Torres',   '32654321', 1),

-- Reserva 5: paquete Miami & Playas
(5, 'Sofía',   'Martínez', '33112233', 27),

-- Reserva 6: vuelo individual a Santiago
(6, 'Diego',   'Fernández','29887766', 41),

-- Reserva 7: paquete Nueva York City
(7, 'Valentina','López',   '36445566', 61),

-- Reserva 8: vuelo completado
(8, 'Rodrigo', 'Sánchez',  '31223344', 2);

-- =============================================
-- SERVICIOS ADICIONALES POR RESERVA
-- Servicios globales para toda la reserva.
-- =============================================
INSERT INTO reservas_servicios (reserva_id, servicio_id, cantidad) VALUES
(1, 1, 2),
(1, 10, 1),
(2, 1, 1),
(2, 4, 1),
(3, 3, 1),
(5, 9, 1),
(6, 2, 1),
(7, 10, 1),
(8, 4, 1);

-- =============================================
-- PAGOS
-- =============================================
INSERT INTO pagos (reserva_id, monto, fecha_pago, metodo_pago, estado_pago, comprobante_pago) VALUES
(1, 2450000, '2025-06-01 10:30', 'tarjeta_credito',        'completado', 'COMP-2025-001'),
(3, 1890000, '2025-06-08 09:30', 'transferencia_bancaria', 'completado', 'COMP-2025-002'),
(5, 2100000, '2025-06-12 11:30', 'paypal',                 'completado', 'COMP-2025-003'),
(6,  180000, '2025-06-14 10:00', 'efectivo',               'completado', 'COMP-2025-004'),
(8,   45000, '2025-06-16 10:30', 'tarjeta_credito',        'completado', 'COMP-2025-005');
GO