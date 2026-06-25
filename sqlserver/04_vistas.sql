USE master;
GO

/* Vista general del dashboard */
CREATE VIEW vw_dashboard_metrics AS
SELECT
    (SELECT COUNT(*) FROM reservas WHERE estado IN ('pendiente', 'confirmada')) AS reservas_activas,
    (SELECT ISNULL(SUM(monto), 0) FROM pagos
     WHERE estado_pago = 'completado'
     AND MONTH(fecha_pago) = MONTH(GETDATE())
     AND YEAR(fecha_pago) = YEAR(GETDATE())) AS ingresos_mes,
    (SELECT COUNT(*) FROM clientes) AS clientes_registrados,
    (SELECT COUNT(*) FROM vuelos WHERE fecha_salida > GETDATE()) AS vuelos_programados
GO
 
/* Vista para toda infor de reservas */
CREATE VIEW vw_reservas_detalle AS
SELECT
    r.reserva_id, r.fecha_reserva,
    r.estado, r.tipo_reserva,
    c.nombre + ' ' + c.apellido AS cliente,
    c.email AS cliente_email,
    c.documento AS cliente_documento,
    p.nombre AS paquete, p.precio AS precio_paquete,
    pg.monto AS monto_pagado, pg.metodo_pago,
    pg.estado_pago, pg.comprobante_pago
FROM reservas AS r
INNER JOIN clientes AS c ON r.cliente_id = c.id
LEFT JOIN paquetes AS p ON r.paquete_id = p.paquete_id
LEFT JOIN pagos AS pg ON r.reserva_id = pg.reserva_id
GO
 
/* Vista de vuelos origen/destino */
CREATE VIEW vw_vuelos_detalle AS
SELECT v.vuelo_id, v.tipo_vuelo, v.fecha_salida, v.fecha_llegada, DATEDIFF(HOUR, v.fecha_salida, v.fecha_llegada) AS duracion_horas, orig.codigo_iata  AS origen_iata,
    orig.ciudad AS origen_ciudad, orig.pais AS origen_pais,
    dest.codigo_iata AS destino_iata, dest.ciudad AS destino_ciudad,
    dest.pais AS destino_pais, al.nombre AS aerolinea,
    COUNT(a.asiento_id) AS total_asientos
FROM vuelos AS v
INNER JOIN aeropuertos AS orig ON v.origen_id = orig.codigo_iata
INNER JOIN aeropuertos AS dest ON v.destino_id = dest.codigo_iata
INNER JOIN aerolineas AS al ON v.id_aerolinea = al.id_aerolinea
LEFT JOIN asientos AS a ON v.vuelo_id = a.vuelo_id
GROUP BY
    v.vuelo_id, v.tipo_vuelo, v.fecha_salida, v.fecha_llegada,
    orig.codigo_iata, orig.ciudad, orig.pais,
    dest.codigo_iata, dest.ciudad, dest.pais,
    al.nombre
GO
 
/* Vista de paquetes con sus vuelos y servicios */
CREATE VIEW vw_paquetes_detalle AS
SELECT p.paquete_id, p.nombre, p.descripcion, p.duracion_dias, p.precio, p.activo, COUNT(DISTINCT pv.vuelo_id) AS cantidad_vuelos, COUNT(DISTINCT ps.servicio_id) AS cantidad_servicios
FROM paquetes AS p
LEFT JOIN paquetes_vuelos AS pv ON p.paquete_id = pv.paquete_id
LEFT JOIN paquetes_servicios AS ps ON p.paquete_id = ps.paquete_id
GROUP BY p.paquete_id, p.nombre, p.descripcion, p.duracion_dias, p.precio, p.activo
GO
 
/* Vista metrica de pagos */
CREATE VIEW vw_ingresos_metodo_pago AS
SELECT metodo_pago, SUM(monto) AS total, COUNT(*) AS cantidad, CAST(SUM(monto) * 100.0 / NULLIF((SELECT SUM(monto) FROM pagos WHERE estado_pago = 'completado'), 0)  AS DECIMAL(5,2)) AS porcentaje 
FROM pagos
WHERE estado_pago = 'completado'
GROUP BY metodo_pago
GO