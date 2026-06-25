USE master;
GO

/* Procedimientos de usuario */
CREATE PROCEDURE sp_insert_user
    @nombre VARCHAR(255),
    @apellido VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255),
    @rol_id INT,
    @usuario_id UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    DECLARE @password_hash VARCHAR(225)

    IF EXISTS(SELECT 1 FROM usuarios WHERE email = @email)
    BEGIN
        RAISERROR('El email ya esta registrado', 16, 1)
        RETURN
    END

    IF NOT EXISTS (SELECT 1 FROM roles WHERE rol_id = @rol_id)
    BEGIN
        RAISERROR('El rol especificado no existe', 16, 1)
        RETURN
    END

    SET @password_hash = LOWER(CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', @password), 2))

    SET @usuario_id = NEWID()

    INSERT INTO usuarios (usuario_id, nombre, apellido, email, password_hash, rol_id)
    VALUES (@usuario_id, @nombre, @apellido, @email, @password_hash, @rol_id)

    PRINT 'Usuario insertado con exito con el ID: ' + CAST(@usuario_id AS VARCHAR(36))
END
GO

 
CREATE PROCEDURE sp_get_user_by_email
    @email VARCHAR(255)
AS
BEGIN
    SELECT u.usuario_id, u.nombre, u.apellido, u.email, u.password_hash, r.nombre AS rol
    FROM usuarios AS u
    INNER JOIN roles AS r ON u.rol_id = r.rol_id
    WHERE u.email = @email
END
GO
 
CREATE PROCEDURE sp_get_all_users
AS
BEGIN
    SELECT u.usuario_id, u.nombre, u.apellido, u.email, r.nombre AS rol, r.rol_id
    FROM usuarios AS u
    INNER JOIN roles AS r ON u.rol_id = r.rol_id
    ORDER BY u.apellido
END
GO
 
/* Procedimientos de vuelo */
 
CREATE PROCEDURE sp_insert_vuelo
    @tipo_vuelo     VARCHAR(15),
    @origen_id      VARCHAR(3),
    @destino_id     VARCHAR(3),
    @fecha_salida   DATETIME,
    @fecha_llegada  DATETIME,
    @id_aerolinea   INT,
    @vuelo_id       INT OUTPUT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM aeropuertos WHERE codigo_iata = @origen_id)
    BEGIN
        RAISERROR('El aeropuerto de origen no existe', 16, 1)
        RETURN
    END
 
    IF NOT EXISTS (SELECT 1 FROM aeropuertos WHERE codigo_iata = @destino_id)
    BEGIN
        RAISERROR('El aeropuerto de destino no existe', 16, 1)
        RETURN
    END
 
    IF @fecha_salida >= @fecha_llegada
    BEGIN
        RAISERROR('La fecha de salida debe ser anterior a la de llegada', 16, 1)
        RETURN
    END
 
    INSERT INTO vuelos (tipo_vuelo, origen_id, destino_id, fecha_salida, fecha_llegada, id_aerolinea)
    VALUES (@tipo_vuelo, @origen_id, @destino_id, @fecha_salida, @fecha_llegada, @id_aerolinea)
 
    SET @vuelo_id = SCOPE_IDENTITY()
END
GO
 
CREATE PROCEDURE sp_get_vuelos
    @origen_id  VARCHAR(3) = NULL,
    @destino_id VARCHAR(3) = NULL
AS
BEGIN
    SELECT v.vuelo_id, v.tipo_vuelo, v.fecha_salida, v.fecha_llegada, a_origen.ciudad  AS origen_ciudad, a_origen.pais AS origen_pais, a_destino.ciudad AS destino_ciudad, a_destino.pais AS destino_pais, al.nombre AS aerolinea
    FROM vuelos AS v
    INNER JOIN aeropuertos AS a_origen ON v.origen_id  = a_origen.codigo_iata
    INNER JOIN aeropuertos AS a_destino ON v.destino_id = a_destino.codigo_iata
    INNER JOIN aerolineas AS al ON v.id_aerolinea = al.id_aerolinea
    WHERE (@origen_id  IS NULL OR v.origen_id  = @origen_id) AND (@destino_id IS NULL OR v.destino_id = @destino_id)
    ORDER BY v.fecha_salida
END
GO
 
CREATE PROCEDURE sp_get_vuelo_by_id
    @vuelo_id INT
AS
BEGIN
    SELECT v.vuelo_id, v.tipo_vuelo, v.fecha_salida, v.fecha_llegada, a_origen.codigo_iata AS origen_iata, a_origen.ciudad AS origen_ciudad, a_origen.pais AS origen_pais, a_destino.codigo_iata AS destino_iata, a_destino.ciudad AS destino_ciudad, a_destino.pais AS destino_pais, al.nombre AS aerolinea
    FROM vuelos AS v
    INNER JOIN aeropuertos AS a_origen ON v.origen_id  = a_origen.codigo_iata
    INNER JOIN aeropuertos AS a_destino ON v.destino_id = a_destino.codigo_iata
    INNER JOIN aerolineas AS al ON v.id_aerolinea = al.id_aerolinea
    WHERE v.vuelo_id = @vuelo_id
END
GO
 
/* Procedimientos de paquete */
 
CREATE PROCEDURE sp_insert_paquete
    @nombre VARCHAR(255),
    @descripcion VARCHAR(255),
    @duracion_dias INT,
    @precio DECIMAL(10,2),
    @paquete_id INT OUTPUT
AS
BEGIN
    INSERT INTO paquetes (nombre, descripcion, duracion_dias, precio, activo)
    VALUES (@nombre, @descripcion, @duracion_dias, @precio, 1)
 
    SET @paquete_id = SCOPE_IDENTITY()
END
GO
 
CREATE PROCEDURE sp_get_paquetes
    @solo_activos BIT = 1
AS
BEGIN
    SELECT p.paquete_id, p.nombre, p.descripcion, p.duracion_dias, p.precio, p.activo, COUNT(DISTINCT pv.vuelo_id) AS cantidad_vuelos,COUNT(DISTINCT ps.servicio_id) AS cantidad_servicios
    FROM paquetes AS p
    LEFT JOIN paquetes_vuelos AS pv ON p.paquete_id = pv.paquete_id
    LEFT JOIN paquetes_servicios AS ps ON p.paquete_id = ps.paquete_id
    WHERE @solo_activos = 0 OR p.activo = 1
    GROUP BY p.paquete_id, p.nombre, p.descripcion, p.duracion_dias, p.precio, p.activo
    ORDER BY p.nombre
END
GO
 
CREATE PROCEDURE sp_toggle_paquete
    @paquete_id INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM paquetes WHERE paquete_id = @paquete_id)
    BEGIN
        RAISERROR('El paquete no existe', 16, 1)
        RETURN
    END
 
    UPDATE paquetes
    SET activo = CASE WHEN activo = 1 THEN 0 ELSE 1 END
    WHERE paquete_id = @paquete_id
END
GO
 
/* Procedimeintos de reservas */
 
CREATE PROCEDURE sp_insert_reserva
    @cliente_id UNIQUEIDENTIFIER,
    @paquete_id INT = NULL,
    @tipo_reserva VARCHAR(50),
    @reserva_id INT OUTPUT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM clientes WHERE id = @cliente_id)
    BEGIN
        RAISERROR('El cliente no existe', 16, 1)
        RETURN
    END
 
    IF @tipo_reserva = 'paquete' AND @paquete_id IS NULL
    BEGIN
        RAISERROR('Una reserva de paquete requiere un paquete_id', 16, 1)
        RETURN
    END
 
    INSERT INTO reservas (cliente_id, paquete_id, fecha_reserva, estado, tipo_reserva)
    VALUES (@cliente_id, @paquete_id, GETDATE(), 'pendiente', @tipo_reserva)
 
    SET @reserva_id = SCOPE_IDENTITY()
END
GO
 
CREATE PROCEDURE sp_update_estado_reserva
    @reserva_id INT,
    @estado VARCHAR(50)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM reservas WHERE reserva_id = @reserva_id)
    BEGIN
        RAISERROR('La reserva no existe', 16, 1)
        RETURN
    END
 
    UPDATE reservas
    SET estado = @estado
    WHERE reserva_id = @reserva_id
END
GO
 
CREATE PROCEDURE sp_get_reservas
AS
BEGIN
    SELECT r.reserva_id, r.fecha_reserva, r.estado, r.tipo_reserva, c.nombre + ' ' + c.apellido AS cliente, c.email AS cliente_email, p.nombre AS paquete
    FROM reservas r
    INNER JOIN clientes AS c ON r.cliente_id = c.id
    LEFT JOIN paquetes AS p ON r.paquete_id = p.paquete_id
    ORDER BY r.fecha_reserva DESC
END
GO

CREATE PROCEDURE sp_get_reservas_detalle
AS
BEGIN

    SELECT
        r.reserva_id, r.fecha_reserva, r.estado, r.tipo_reserva, c.nombre + ' ' + c.apellido AS cliente_nombre, c.email AS cliente_email, c.documento AS cliente_documento, rp.reserva_pasajero_id, rp.nombre + ' ' + rp.apellido AS pasajero_nombre, rp.documento AS pasajero_documento, a.numero_asiento, a.tipo_asiento, p.nombre AS paquete_nombre,

        (
            SELECT TOP 1 ao.ciudad + ' (' + ao.codigo_iata + ')' FROM reservas_vuelos as rv2
            INNER JOIN vuelos as v2 ON rv2.vuelo_id = v2.vuelo_id
            INNER JOIN aeropuertos ao ON v2.origen_id = ao.codigo_iata
            WHERE rv2.reserva_id = r.reserva_id
        ) AS origen,

        (
            SELECT TOP 1 ad.ciudad + ' (' + ad.codigo_iata + ')'
            FROM reservas_vuelos AS rv2
            INNER JOIN vuelos AS v2 ON rv2.vuelo_id = v2.vuelo_id
            INNER JOIN aeropuertos AS ad ON v2.destino_id = ad.codigo_iata
            WHERE rv2.reserva_id = r.reserva_id
        ) AS destino,

        pg.monto AS monto_pagado, pg.metodo_pago, pg.estado_pago, pg.comprobante_pago

    FROM reservas AS r
    INNER JOIN clientes AS c
    ON r.cliente_id = c.id

    LEFT JOIN reservas_pasajeros AS rp
    ON r.reserva_id = rp.reserva_id

    LEFT JOIN asientos AS a
    ON ra.asiento_id = a.asiento_id

    LEFT JOIN paquetes AS p
    ON r.paquete_id = p.paquete_id

    LEFT JOIN pagos AS pg
    ON r.reserva_id = pg.reserva_id

    ORDER BY r.fecha_reserva DESC;
END
GO
 
CREATE PROCEDURE sp_get_reserva_by_id
    @reserva_id INT
AS
BEGIN
    SELECT r.reserva_id, r.fecha_reserva, r.estado, r.tipo_reserva,
        c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
        c.email AS cliente_email, c.documento AS cliente_documento,
        c.telefono AS cliente_telefono, p.nombre AS paquete_nombre,
        p.precio AS paquete_precio, p.duracion_dias AS paquete_duracion
    FROM reservas AS r
    INNER JOIN clientes AS c ON r.cliente_id = c.id
    LEFT JOIN paquetes AS p  ON r.paquete_id = p.paquete_id
    WHERE r.reserva_id = @reserva_id
END
GO

CREATE PROCEDURE sp_cancelar_reserva
    @reserva_id INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM reservas WHERE reserva_id = @reserva_id)
    BEGIN
        RAISERROR('La reserva no existe.', 16, 1)
        RETURN
    END

    UPDATE reservas
    SET estado = 'cancelada'
    WHERE reserva_id = @reserva_id
END
GO

/* Procedimientos de pago */
 
CREATE PROCEDURE sp_insert_pago
    @reserva_id INT,
    @metodo_pago VARCHAR(50),
    @comprobante_pago VARCHAR(255),
    @pago_id INT OUTPUT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM reservas WHERE reserva_id = @reserva_id)
    BEGIN
        RAISERROR('La reserva no existe', 16, 1)
        RETURN
    END

    DECLARE @monto DECIMAL(10,2)

    SET @monto = dbo.fn_precio_reserva(@reserva_id)
 
    INSERT INTO pagos (reserva_id, monto, fecha_pago, metodo_pago, estado_pago, comprobante_pago)
    VALUES (@reserva_id, @monto, GETDATE(), @metodo_pago, 'pendiente', @comprobante_pago)
 
    SET @pago_id = SCOPE_IDENTITY()
END
GO

CREATE PROCEDURE sp_confirmar_pago
    @pago_id INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pagos WHERE pago_id = @pago_id)
    BEGIN
        RAISERROR('La reserva no existe', 16, 1)
        RETURN
    END

    UPDATE pagos
    SET estado_pago = 'pagado'
    WHERE pago_id = @pago_id;

    UPDATE reservas
    SET estado = 'confirmada'
    WHERE reserva_id = ( SELECT reserva_id FROM pagos WHERE pago_id = @pago_id )
END
GO