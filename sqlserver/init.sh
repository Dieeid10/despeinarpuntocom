#!/bin/bash
echo "Esperando a SQL Server..."
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" -b -C &>/dev/null; do
    sleep 2
done

echo "Ejecutando init.sql..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i /init.sql -C
echo "Tablas creadas."