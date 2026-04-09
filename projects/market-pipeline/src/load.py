import duckdb
from src.config import DB_PATH


def load(df):
    conn = duckdb.connect(DB_PATH)
    conn.execute("CREATE OR REPLACE TABLE stock_prices AS SELECT * FROM df")
    conn.close()
    print(f"Datos cargados en {DB_PATH}")
