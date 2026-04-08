# ============================================================
# report.py — Generador de Reporte HTML
# ============================================================
# Consulta DuckDB y genera un reporte HTML con tablas y métricas.
# Es la capa de "consumo" de los datos — lo que el usuario final ve.

import duckdb
import os
from datetime import date
from src.config import DB_PATH, REPORT_PATH, TICKERS, INDICES


def generate_report() -> None:
    """
    Lee los datos de DuckDB y genera un reporte HTML con:
    - Tabla resumen por acción
    - Las 5 mejores y peores jornadas
    """
    print("Generando reporte HTML...")
    conn = duckdb.connect(DB_PATH)

    # --- Consulta 1: Resumen general por símbolo ---
    resumen = conn.execute("""
        SELECT
            symbol,
            COUNT(*)                              AS dias_con_datos,
            ROUND(MIN(Close), 2)                  AS precio_minimo,
            ROUND(MAX(Close), 2)                  AS precio_maximo,
            ROUND(LAST(Close), 2)                 AS precio_actual,
            ROUND(AVG(daily_return) * 100, 4)     AS retorno_promedio_pct,
            ROUND(AVG(volatility_7d) * 100, 4)    AS volatilidad_media_pct
        FROM stock_prices
        GROUP BY symbol
        ORDER BY symbol
    """).df()

    # --- Consulta 2: Mejores y peores días ---
    mejores = conn.execute("""
        SELECT symbol, date, ROUND(daily_return * 100, 2) AS retorno_pct, ROUND(Close, 2) AS cierre
        FROM stock_prices
        WHERE symbol NOT LIKE '^%'
        ORDER BY daily_return DESC
        LIMIT 5
    """).df()

    peores = conn.execute("""
        SELECT symbol, date, ROUND(daily_return * 100, 2) AS retorno_pct, ROUND(Close, 2) AS cierre
        FROM stock_prices
        WHERE symbol NOT LIKE '^%'
        ORDER BY daily_return ASC
        LIMIT 5
    """).df()

    conn.close()

    # --- Generar HTML ---
    all_names = {**TICKERS, **INDICES}

    def df_to_html_table(df):
        rows = ""
        for _, row in df.iterrows():
            rows += "<tr>" + "".join(f"<td>{v}</td>" for v in row) + "</tr>"
        headers = "".join(f"<th>{c}</th>" for c in df.columns)
        return f"<table><thead><tr>{headers}</tr></thead><tbody>{rows}</tbody></table>"

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Market Pipeline — Reporte {date.today()}</title>
<style>
  body {{ font-family: 'Inter', sans-serif; background: #0d1117; color: #e6edf3; padding: 40px; }}
  h1 {{ color: #58a6ff; }} h2 {{ color: #79c0ff; border-bottom: 1px solid #30363d; padding-bottom: 8px; }}
  table {{ border-collapse: collapse; width: 100%; margin-bottom: 32px; }}
  th {{ background: #161b22; color: #8b949e; padding: 10px 14px; text-align: left; font-size: 13px; }}
  td {{ padding: 10px 14px; border-bottom: 1px solid #21262d; font-size: 14px; }}
  tr:hover td {{ background: #161b22; }}
  .meta {{ color: #8b949e; font-size: 13px; margin-bottom: 40px; }}
</style>
</head>
<body>
<h1>Reporte de Mercados Financieros</h1>
<p class="meta">Generado el {date.today()} · Pipeline ETL con Python + DuckDB</p>

<h2>Resumen por símbolo</h2>
{df_to_html_table(resumen)}

<h2>5 mejores jornadas</h2>
{df_to_html_table(mejores)}

<h2>5 peores jornadas</h2>
{df_to_html_table(peores)}

</body>
</html>"""

    os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Reporte generado en: {REPORT_PATH}")
