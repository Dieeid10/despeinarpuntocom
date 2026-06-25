USE master;
GO

/* vuelos */
CREATE INDEX idx_vuelos_origen ON vuelos(origen_id);
CREATE INDEX idx_vuelos_destino ON vuelos(destino_id);
CREATE INDEX idx_vuelos_fecha ON vuelos(fecha_salida);

/* asientos */
CREATE INDEX idx_asientos_vuelo ON asientos(vuelo_id);
CREATE INDEX idx_asientos_tipo ON asientos(tipo_asiento);

/* reservas */
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_paquete ON reservas(paquete_id);
CREATE INDEX idx_reservas_fecha ON reservas(fecha_reserva);

/* pagos */
CREATE INDEX idx_pagos_reserva ON pagos(reserva_id);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);

/* reservas_servicios */
CREATE INDEX idx_reservas_servicios_reserva ON reservas_servicios(reserva_id);

/* reservas_pasajeros */
CREATE INDEX idx_reservas_pasajeros_reserva ON reservas_pasajeros(reserva_id);
CREATE INDEX idx_reservas_pasajeros_asiento ON reservas_pasajeros(asiento_id);