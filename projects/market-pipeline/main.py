# ============================================================
# main.py — Punto de entrada del pipeline
# ============================================================
# Este archivo orquesta las 3 capas del ETL en orden:
#   1. extract()  → trae los datos crudos de Yahoo Finance
#   2. transform() → limpia y calcula métricas
#   3. load()     → guarda en DuckDB
#   4. report()   → genera el reporte HTML
#
# Para correr el pipeline: python main.py

from src.extract import extract_all
from src.transform import transform
from src.load import load
from src.report import generate_report


def run_pipeline():
    print("=" * 50)
    print("  MARKET DATA PIPELINE")
    print("=" * 50 + "\n")

    # Paso 1: Extracción
    raw_data = extract_all()

    # Paso 2: Transformación
    clean_data = transform(raw_data)

    # Paso 3: Carga en DuckDB
    load(clean_data)

    # Paso 4: Reporte
    generate_report()

    print("\n" + "=" * 50)
    print("  Pipeline completado exitosamente")
    print("=" * 50)


if __name__ == "__main__":
    run_pipeline()
