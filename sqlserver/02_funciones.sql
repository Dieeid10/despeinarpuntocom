USE master;
GO

/* Calcula el total de la reserva */
CREATE FUNCTION fn_precio_reserva(@reserva_id INT)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @total DECIMAL(10,2) = 0;
 
    -- Precio del paquete si aplica
    SELECT @total = ISNULL(p.precio, 0)
    FROM reservas r
    LEFT JOIN paquetes p ON r.paquete_id = p.paquete_id
    WHERE r.reserva_id = @reserva_id;
 
    -- Suma servicios adicionales de la reserva
    SELECT @total = @total + ISNULL(SUM(sa.precio * rs.cantidad), 0)
    FROM reservas_servicios rs
    INNER JOIN servicios_adicionales sa ON rs.servicio_id = sa.servicio_id
    WHERE rs.reserva_id = @reserva_id;
 
    RETURN @total;
END
GO
 
CREATE FUNCTION fn_cliente_tiene_reservas_activas
(
    @cliente_id UNIQUEIDENTIFIER
)
RETURNS BIT
AS
BEGIN
    DECLARE @resultado BIT;

    IF EXISTS ( SELECT 1 FROM reservas WHERE cliente_id = @cliente_id AND estado IN ('pendiente', 'confirmada'))
        SET @resultado = 1;
    ELSE
        SET @resultado = 0;

    RETURN @resultado;
END
GO