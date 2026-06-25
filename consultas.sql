/* Recupera los clientes por apellido */
SELECT id, nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion
FROM clientes
ORDER BY apellido

/* Recupera un cliente por id */
SELECT id, nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion
FROM clientes
WHERE id = cliente_id

/* Actualiza los datos de un cliente */
UPDATE clientes 
SET nombre='pedro', apellido='apellido', documento='41015648', email='email@mail.com', telefono='45876498', fecha_nacimiento='fehca', direccion='direccion'
WHERE id = cliente_id

/* Recupera el ultimo id de paquete */
SELECT MAX(paquete_id) AS id 
FROM paquetes

/* Elimina un paquete por id */
DELETE FROM paquetes_vuelos 
WHERE paquete_id = paquete_id

/* Mostrar reservas con datos del cliente */
SELECT r.reserva_id, r.fecha_reserva, r.estado, r.tipo_reserva, c.nombre + ' ' + c.apellido AS cliente, c.email
FROM reservas AS r
INNER JOIN clientes AS c ON r.cliente_id = c.id

/* Mostrar vuelos con ciudad de origen, destino y aerolínea */
SELECT v.vuelo_id, ao.ciudad AS origen, ad.ciudad AS destino, al.nombre AS aerolinea, v.fecha_salida, v.fecha_llegada
FROM vuelos AS v
INNER JOIN aeropuertos AS ao ON v.origen_id = ao.codigo_iata
INNER JOIN aeropuertos AS ad ON v.destino_id = ad.codigo_iata
INNER JOIN aerolineas AS al ON v.id_aerolinea = al.id_aerolinea

/* Mostrar pasajeros con su reserva y asiento asignado */
SELECT r.reserva_id, rp.nombre + ' ' + rp.apellido AS pasajero, rp.documento, a.numero_asiento, a.tipo_asiento
FROM reservas_pasajeros AS rp
INNER JOIN reservas AS r ON rp.reserva_id = r.reserva_id
INNER JOIN asientos AS a ON rp.asiento_id = a.asiento_id

/* Mostrar paquetes con sus vuelos incluidos */
SELECT p.paquete_id, p.nombre AS paquete, v.vuelo_id, ao.ciudad AS origen, ad.ciudad AS destino
FROM paquetes AS p
INNER JOIN paquetes_vuelos AS pv ON p.paquete_id = pv.paquete_id
INNER JOIN vuelos AS v ON pv.vuelo_id = v.vuelo_id
INNER JOIN aeropuertos AS ao ON v.origen_id = ao.codigo_iata
INNER JOIN aeropuertos AS ad ON v.destino_id = ad.codigo_iata

/* Mostrar reservas con pagos realizados */
SELECT r.reserva_id, r.estado AS estado_reserva, p.monto, p.metodo_pago, p.estado_pago, p.comprobante_pago
FROM reservas AS r
INNER JOIN pagos AS p ON r.reserva_id = p.reserva_id

/* Cantidad de reservas por estado */
SELECT estado, COUNT(*) AS cantidad_reservas
FROM reservas
GROUP BY estado

/* Ingresos totales por metodo de pago */
SELECT metodo_pago, SUM(monto) AS total_recaudado, COUNT(*) AS cantidad_pagos
FROM pagos
GROUP BY metodo_pago

/* Cantidad de pasajeros por reserva */
SELECT r.reserva_id, COUNT(rp.reserva_pasajero_id) AS cantidad_pasajeros
FROM reservas AS r
LEFT JOIN reservas_pasajeros AS rp ON r.reserva_id = rp.reserva_id
GROUP BY r.reserva_id

/* Vuelos con mas de 3 asientos cargados */
SELECT v.vuelo_id, COUNT(a.asiento_id) AS cantidad_asientos
FROM vuelos AS v
INNER JOIN asientos AS a ON v.vuelo_id = a.vuelo_id
GROUP BY v.vuelo_id
HAVING COUNT(a.asiento_id) > 3

/* Paquetes con mas de 2 servicios incluidos */
SELECT p.paquete_id, p.nombre, COUNT(ps.servicio_id) AS cantidad_servicios
FROM paquetes AS p
INNER JOIN paquetes_servicios AS ps ON p.paquete_id = ps.paquete_id
GROUP BY p.paquete_id, p.nombre
HAVING COUNT(ps.servicio_id) > 2

/* Mostrar pagos que monto sea mayor al promedio */
SELECT pago_id, reserva_id, monto, metodo_pago
FROM pagos
WHERE monto > ( SELECT AVG(monto) FROM pagos )

/* Mostrar clientes que tengan reservas registradas */
SELECT id, nombre, apellido, email 
FROM clientes
WHERE id IN ( SELECT cliente_id FROM reservas )

/* Mostrar reservas que tengan servicios adicionales contratados */
SELECT r.reserva_id, r.estado, r.tipo_reserva
FROM reservas AS r
WHERE EXISTS ( SELECT 1 FROM reservas_servicios AS rs WHERE rs.reserva_id = r.reserva_id )

/* Mostrar clientes que tengan más de una reserva*/
SELECT c.id, c.nombre, c.apellido, c.email
FROM clientes AS c
WHERE ( SELECT COUNT(*) FROM reservas AS r WHERE r.cliente_id = c.id ) > 1

/* Mostrar vuelos que todavia no fueron reservados directamente */
SELECT vuelo_id, origen_id, destino_id, fecha_salida
FROM vuelos
WHERE vuelo_id NOT IN ( SELECT vuelo_id FROM reservas_vuelos )