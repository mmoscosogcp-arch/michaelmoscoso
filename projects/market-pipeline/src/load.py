# ============================================================
# load.py — Capa de Carga (la "L" del ETL)
# ============================================================
# Toma los datos transformados y los guarda en DuckDB,
# que actúa como nuestro "mini warehouse" local.
# DuckDB es ideal para proyectos personales: rápido, sin servidor,
# y compatible con SQL estándar.

import duckdb
import pandas as pd
from src.config import DB_PATH


def load(df: pd.DataFrame) -> None:
    """
    Carga el DataFrame procesado en DuckDB.
    Crea (o reemplaza) la tabla 'stock_prices'.

    Args:
        df: DataFrame limpio y enriquecido de transform.py
    """
    print("Iniciando carga en DuckDB...")

    # Conectar a DuckDB (crea el archivo .db si no existe)
    conn = duckdb.connect(DB_PATH)

    # Crear (o reemplazar) la tabla con los datos procesados
    # CREATE OR REPLACE borra la tabla anterior y la recrea fresca
    conn.execute("""
        CREATE OR REPLACE TABLE stock_prices AS
        SELECT * FROM df
    """)

    # Verificar cuántas filas se cargaron
    count = conn.execute("SELECT COUNT(*) FROM stock_prices").fetchone()[0]
    print(f"Carga completa: {count} filas en tabla 'stock_prices'")

    # Mostrar un resumen de los datos por símbolo
    resumen = conn.execute("""
        SELECT
            symbol,
            COUNT(*)                        AS dias,
            ROUND(MIN(Close), 2)            AS precio_min,
            ROUND(MAX(Close), 2)            AS precio_max,
            ROUND(AVG(daily_return) * 100, 4) AS retorno_promedio_pct
        FROM stock_prices
        GROUP BY symbol
        ORDER BY symbol
    """).df()

    print("\nResumen por símbolo:")
    print(resumen.to_string(index=False))

    conn.close()
    print(f"\nDatos guardados en: {DB_PATH}\n")
