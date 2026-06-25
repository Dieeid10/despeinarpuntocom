echo "Esperando a SQL Server..."

until /opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U sa \
    -P "$SA_PASSWORD" \
    -Q "SELECT 1" \
    -C > /dev/null 2>&1
do
    sleep 5
done

echo "SQL Server listo."

for file in /sql/*.sql
do
    echo "Ejecutando $file..."

    /opt/mssql-tools18/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$SA_PASSWORD" \
        -i "$file" \
        -b \
        -C
done