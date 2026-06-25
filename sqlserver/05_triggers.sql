USE master
GO

/* Cuando se inserta un pago se modifica el estado de la reserva */
CREATE TRIGGER trg_confirmar_reserva_pago ON pagos
AFTER INSERT
AS
BEGIN
    UPDATE r
    SET estado = 'confirmada'
    FROM reservas AS r
    INNER JOIN inserted AS i
    ON r.reserva_id = i.reserva_id;
END
GO

/* Comprueba que un asiento este vacio antes de insertar la reserva */
CREATE TRIGGER trg_validar_asiento_ocupado
ON reservas_pasajeros
INSTEAD OF INSERT
AS
BEGIN

    IF EXISTS ( SELECT 1 FROM inserted AS i INNER JOIN reservas_pasajeros AS rp 
                ON rp.asiento_id = i.asiento_id
                INNER JOIN reservas AS r
                ON rp.reserva_id = r.reserva_id
                WHERE r.estado <> 'cancelada'
            )
    BEGIN
        RAISERROR('El asiento ya se encuentra ocupado.', 16, 1);
        RETURN;
    END

    INSERT INTO reservas_pasajeros( reserva_id, nombre, apellido, documento, asiento_id )
    SELECT reserva_id, nombre, apellido, documento, asiento_id
    FROM inserted;
END
GO

/* Evita que se elimine un cliente que tenga una reserva activa */
CREATE TRIGGER trg_no_eliminar_cliente ON clientes
INSTEAD OF DELETE
AS
BEGIN

    IF EXISTS (
        SELECT 1 FROM deleted AS d
        WHERE dbo.fn_cliente_tiene_reservas_activas(d.id) = 1
    )
    BEGIN
        RAISERROR('El cliente posee reservas activas.',16,1)
        RETURN
    END

    DELETE c FROM clientes AS c
    INNER JOIN deleted d
    ON c.id = d.id

END
GO